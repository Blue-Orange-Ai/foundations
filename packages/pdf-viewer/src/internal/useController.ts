/**
 * The controller wires the headless plugin capabilities to the viewer's public
 * surface: it fires the callback props, applies the controlled props (page,
 * zoom, rotation, spread) and exposes the imperative {@link PdfViewerApi}.
 *
 * It is rendered inside the <EmbedPDF> provider and only mounts once a document
 * id is available, so every capability hook has a document to bind to.
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { Ref } from 'react';
import { v4 as uuid } from 'uuid';

import {
	type PdfEngine,
	PdfAnnotationSubtype,
	PdfBlendMode,
	MatchFlag,
} from '@embedpdf/models';
import { useScroll } from '@embedpdf/plugin-scroll/react';
import { useZoom } from '@embedpdf/plugin-zoom/react';
import { useRotate } from '@embedpdf/plugin-rotate/react';
import { useSpread } from '@embedpdf/plugin-spread/react';
import { useSelectionCapability } from '@embedpdf/plugin-selection/react';
import { useAnnotationCapability } from '@embedpdf/plugin-annotation/react';
import { useFormCapability } from '@embedpdf/plugin-form/react';
import { useSignatureCapability } from '@embedpdf/plugin-signature/react';
import { useHistoryCapability } from '@embedpdf/plugin-history/react';
import { useSearch } from '@embedpdf/plugin-search/react';
import { useExportCapability } from '@embedpdf/plugin-export/react';
import { usePrintCapability } from '@embedpdf/plugin-print/react';
import { useFullscreen } from '@embedpdf/plugin-fullscreen/react';
import { useDocumentManagerCapability } from '@embedpdf/plugin-document-manager/react';

import type {
	PdfViewerApi,
	PdfViewerProps,
	PdfTextSelection,
	PdfRect,
	PdfSearchState,
	PdfSearchOptions,
	PdfSpreadMode,
	PdfScrollMode,
} from '../types';
import {
	toZoomLevel,
	toRotation,
	fromRotation,
	toSpreadMode,
	toScrollStrategy,
	flattenRect,
} from './mappings';

/** Convert an @embedpdf Task into a Promise. */
const taskToPromise = <T,>(task: {
	wait: (onResolve: (v: T) => void, onReject: (e: unknown) => void) => void;
}): Promise<T> =>
	new Promise<T>((resolve, reject) => task.wait(resolve, reject));

/** Flatten a public PdfRect into the { origin, size } Rect the engine expects. */
const toEngineRect = (r: PdfRect) => ({
	origin: { x: r.x, y: r.y },
	size: { width: r.width, height: r.height },
});

/** Axis-aligned bounding box (engine Rect) covering all of `rects`. */
const boundingEngineRect = (rects: PdfRect[]) => {
	const minX = Math.min(...rects.map((r) => r.x));
	const minY = Math.min(...rects.map((r) => r.y));
	const maxX = Math.max(...rects.map((r) => r.x + r.width));
	const maxY = Math.max(...rects.map((r) => r.y + r.height));
	return { origin: { x: minX, y: minY }, size: { width: maxX - minX, height: maxY - minY } };
};

/** Group rects by their page index, preserving order within each page. */
const groupByPage = (rects: PdfRect[]): Map<number, PdfRect[]> => {
	const byPage = new Map<number, PdfRect[]>();
	for (const r of rects) {
		const list = byPage.get(r.pageIndex);
		if (list) list.push(r);
		else byPage.set(r.pageIndex, [r]);
	}
	return byPage;
};

export interface ControllerArgs {
	documentId: string;
	engine: PdfEngine;
	props: PdfViewerProps;
	apiRef: Ref<PdfViewerApi>;
	openSignatureDialog: () => void;
}

export const usePdfViewerController = ({
	documentId,
	engine,
	props,
	apiRef,
	openSignatureDialog,
}: ControllerArgs) => {
	const scroll = useScroll(documentId);
	const zoom = useZoom(documentId);
	const rotate = useRotate(documentId);
	const spread = useSpread(documentId);
	const selection = useSelectionCapability();
	const annotation = useAnnotationCapability();
	const form = useFormCapability();
	const signature = useSignatureCapability();
	const history = useHistoryCapability();
	const search = useSearch(documentId);
	const exporter = useExportCapability();
	const printer = usePrintCapability();
	const fullscreen = useFullscreen();
	const documents = useDocumentManagerCapability();

	/** Latest resolved selection, kept current for the synchronous getSelection(). */
	const selectionRef = useRef<PdfTextSelection | null>(null);

	/* ---------------------------------------------------------------------- */
	/*  Selection payload builder                                             */
	/* ---------------------------------------------------------------------- */
	const buildSelection = useCallback(async (): Promise<PdfTextSelection | null> => {
		const sel = selection.provides;
		if (!sel) return null;
		const state = sel.getState(documentId);
		const range = state.selection;
		if (!range) return null;

		const formatted = sel.getFormattedSelection(documentId);
		const rects: PdfRect[] = [];
		const boundingRects: PdfRect[] = [];
		const pageSet = new Set<number>();
		for (const seg of formatted) {
			pageSet.add(seg.pageIndex);
			boundingRects.push(flattenRect(seg.rect, seg.pageIndex));
			for (const r of seg.segmentRects) rects.push(flattenRect(r, seg.pageIndex));
		}

		let text = '';
		try {
			const perPage = await taskToPromise<string[]>(sel.getSelectedText(documentId));
			text = perPage.join('\n');
		} catch {
			text = '';
		}

		return {
			text,
			pages: Array.from(pageSet).sort((a, b) => a - b),
			startPage: range.start.page,
			endPage: range.end.page,
			startIndex: range.start.index,
			endIndex: range.end.index,
			rects,
			boundingRects,
		};
	}, [selection.provides, documentId]);

	/* ---------------------------------------------------------------------- */
	/*  Callback wiring                                                       */
	/* ---------------------------------------------------------------------- */

	// Page changes
	useEffect(() => {
		const sc = scroll.provides;
		if (!sc || !props.onPageChange) return;
		return sc.onPageChange((e) => props.onPageChange?.(e.pageNumber, e.totalPages));
	}, [scroll.provides, props.onPageChange]);

	// Zoom changes
	const currentZoom = zoom.state?.currentZoomLevel ?? 1;
	useEffect(() => {
		props.onZoomChange?.(currentZoom);
	}, [currentZoom]); // eslint-disable-line react-hooks/exhaustive-deps

	// Rotation changes
	useEffect(() => {
		props.onRotationChange?.(fromRotation(rotate.rotation));
	}, [rotate.rotation]); // eslint-disable-line react-hooks/exhaustive-deps

	// Selection changes
	useEffect(() => {
		const sel = selection.provides;
		if (!sel) return;
		const unsub = sel.onSelectionChange(async (e) => {
			if (!e.selection) {
				selectionRef.current = null;
				props.onSelectionChange?.(null);
				return;
			}
			const payload = await buildSelection();
			selectionRef.current = payload;
			props.onSelectionChange?.(payload);
		});
		return unsub;
	}, [selection.provides, buildSelection, props.onSelectionChange]);

	// Completed selections
	useEffect(() => {
		const sel = selection.provides;
		if (!sel || !props.onTextSelected) return;
		const unsub = sel.onEndSelection(async () => {
			const payload = await buildSelection();
			if (payload && payload.text) props.onTextSelected?.(payload);
		});
		return unsub;
	}, [selection.provides, buildSelection, props.onTextSelected]);

	// Annotation changes
	useEffect(() => {
		const anno = annotation.provides;
		if (!anno || !props.onAnnotationsChange) return;
		return anno.onAnnotationEvent((e) => {
			props.onAnnotationsChange?.({
				type: e.type,
				documentId: e.documentId,
				pageIndex: 'pageIndex' in e ? e.pageIndex : undefined,
				annotation: 'annotation' in e ? e.annotation : undefined,
				total: 'total' in e ? e.total : undefined,
			});
		});
	}, [annotation.provides, props.onAnnotationsChange]);

	// Form field changes
	useEffect(() => {
		const fm = form.provides;
		if (!fm || !props.onFormFieldChange) return;
		return fm.onFieldValueChange((e) => {
			props.onFormFieldChange?.({
				documentId: e.documentId,
				pageIndex: e.pageIndex,
				annotationId: e.annotationId,
				values: fm.getFormValues(documentId),
			});
		});
	}, [form.provides, props.onFormFieldChange, documentId]);

	// Search results
	const searchState = search.state;
	useEffect(() => {
		if (!props.onSearchResults || !searchState) return;
		const mapped: PdfSearchState = {
			query: searchState.query,
			total: searchState.total,
			activeResultIndex: searchState.activeResultIndex,
			results: searchState.results.map((r) => ({
				pageIndex: r.pageIndex,
				before: r.context?.before ?? '',
				match: r.context?.match ?? '',
				after: r.context?.after ?? '',
			})),
		};
		props.onSearchResults(mapped);
	}, [searchState, props.onSearchResults]);

	// Scroll to the active search result. The search plugin only updates the
	// active-index state and emits `onActiveResultChange` — it does not move the
	// viewport itself — so we bridge that event to the scroll capability here.
	// This covers every navigation path: clicking a result in the side panel, the
	// toolbar next/previous buttons and the imperative API.
	//
	// Two headless-side subtleties make this tricky:
	//   1. `useSearch`/`useScroll` return a fresh capability scope object on every
	//      render, so we must NOT put `*.provides` in the deps — doing so would
	//      re-subscribe on every render (including the re-renders that plain
	//      scrolling triggers).
	//   2. `onActiveResultChange` is a *behavior* emitter: it replays the current
	//      value to every new subscriber. Combined with (1) that would re-scroll
	//      to the active hit on every render — yanking the user back whenever they
	//      scroll away. We subscribe once per document and only scroll when the
	//      index genuinely changes.
	const scrollProvidesRef = useRef(scroll.provides);
	scrollProvidesRef.current = scroll.provides;
	const searchProvidesRef = useRef(search.provides);
	searchProvidesRef.current = search.provides;
	const searchReady = !!search.provides;

	useEffect(() => {
		const s = searchProvidesRef.current;
		if (!s) return;
		let lastIndex = s.getState().activeResultIndex;
		return s.onActiveResultChange((index) => {
			if (index < 0 || index === lastIndex) return;
			lastIndex = index;
			const sc = scrollProvidesRef.current;
			const result = s.getState().results[index];
			if (!sc || !result) return;
			const rect = result.rects[0];
			sc.scrollToPage({
				pageNumber: result.pageIndex + 1,
				pageCoordinates: rect
					? { x: rect.origin.x, y: rect.origin.y }
					: undefined,
				alignY: 25,
			});
		});
	}, [documentId, searchReady]); // eslint-disable-line react-hooks/exhaustive-deps

	/* ---------------------------------------------------------------------- */
	/*  Controlled props                                                      */
	/* ---------------------------------------------------------------------- */
	const appliedInitialPage = useRef(false);

	// Initial page (once the layout is ready)
	useEffect(() => {
		if (appliedInitialPage.current) return;
		const sc = scroll.provides;
		if (!sc || !scroll.state?.totalPages) return;
		if (props.initialPage && props.initialPage > 1) {
			sc.scrollToPage({ pageNumber: props.initialPage });
		}
		appliedInitialPage.current = true;
	}, [scroll.provides, scroll.state?.totalPages, props.initialPage]);

	// Controlled page
	useEffect(() => {
		const sc = scroll.provides;
		if (!sc || props.page === undefined) return;
		if (props.page !== scroll.state?.currentPage) {
			sc.scrollToPage({ pageNumber: props.page });
		}
	}, [props.page]); // eslint-disable-line react-hooks/exhaustive-deps

	// Controlled zoom
	useEffect(() => {
		if (!zoom.provides || props.zoom === undefined) return;
		zoom.provides.requestZoom(toZoomLevel(props.zoom));
	}, [props.zoom]); // eslint-disable-line react-hooks/exhaustive-deps

	// Controlled rotation
	useEffect(() => {
		if (!rotate.provides || props.rotation === undefined) return;
		rotate.provides.setRotation(toRotation(props.rotation));
	}, [props.rotation]); // eslint-disable-line react-hooks/exhaustive-deps

	// Controlled spread
	useEffect(() => {
		if (!spread.provides || props.spread === undefined) return;
		spread.provides.setSpreadMode(toSpreadMode(props.spread));
	}, [props.spread]); // eslint-disable-line react-hooks/exhaustive-deps

	/* ---------------------------------------------------------------------- */
	/*  Page reordering (engine level — no plugin API exists)                 */
	/* ---------------------------------------------------------------------- */
	const applyOrder = useCallback(
		async (order: number[]) => {
			const dm = documents.provides;
			if (!dm) return;
			const doc = dm.getActiveDocument();
			if (!doc) return;
			const file = await taskToPromise(
				engine.mergePages([{ docId: doc.id, pageIndices: order }]),
			);
			const response = await taskToPromise(
				dm.openDocumentBuffer({
					buffer: file.content,
					name: props.fileName ?? 'document.pdf',
					autoActivate: true,
				}),
			);
			// Close the previous document once the reordered copy is active.
			if (response.documentId !== documentId) {
				dm.closeDocument(documentId);
			}
			props.onPageOrderChange?.(order);
		},
		[documents.provides, engine, documentId, props.fileName, props.onPageOrderChange],
	);

	/* ---------------------------------------------------------------------- */
	/*  Imperative API                                                        */
	/* ---------------------------------------------------------------------- */
	const api = useMemo<PdfViewerApi>(() => {
		const pageCount = () => scroll.state?.totalPages ?? 0;
		const currentPage = () => scroll.state?.currentPage ?? 1;

		return {
			/* navigation */
			goToPage: (page) => scroll.provides?.scrollToPage({ pageNumber: page }),
			nextPage: () => scroll.provides?.scrollToNextPage(),
			previousPage: () => scroll.provides?.scrollToPreviousPage(),
			getCurrentPage: currentPage,
			getPageCount: pageCount,

			/* zoom */
			setZoom: (level) => zoom.provides?.requestZoom(toZoomLevel(level)),
			zoomIn: () => zoom.provides?.zoomIn(),
			zoomOut: () => zoom.provides?.zoomOut(),
			getZoom: () => zoom.state?.currentZoomLevel ?? 1,

			/* rotation / layout */
			setRotation: (rotation) => rotate.provides?.setRotation(toRotation(rotation)),
			rotateClockwise: () => rotate.provides?.rotateForward(),
			rotateCounterClockwise: () => rotate.provides?.rotateBackward(),
			getRotation: () => fromRotation(rotate.rotation),
			setSpreadMode: (mode: PdfSpreadMode) =>
				spread.provides?.setSpreadMode(toSpreadMode(mode)),
			setScrollMode: (mode: PdfScrollMode) =>
				scroll.provides?.setScrollStrategy(toScrollStrategy(mode)),

			/* selection */
			getSelection: () => selectionRef.current,
			getSelectedText: async () => {
				const sel = selection.provides;
				if (!sel) return '';
				try {
					const perPage = await taskToPromise<string[]>(
						sel.getSelectedText(documentId),
					);
					return perPage.join('\n');
				} catch {
					return '';
				}
			},
			clearSelection: () => selection.provides?.clear(documentId),
			highlightSelection: (color) => {
				const sel = selection.provides;
				const anno = annotation.provides;
				if (!sel || !anno) return;
				const formatted = sel.getFormattedSelection(documentId);
				for (const seg of formatted) {
					anno.forDocument(documentId).createAnnotation(seg.pageIndex, {
						type: PdfAnnotationSubtype.HIGHLIGHT,
						pageIndex: seg.pageIndex,
						id: uuid(),
						rect: seg.rect,
						segmentRects: seg.segmentRects,
						strokeColor: color ?? '#FFEB3B',
						opacity: 1,
						blendMode: PdfBlendMode.Multiply,
						created: new Date(),
					} as any);
				}
				sel.clear(documentId);
			},
			highlightRects: (rects, options) => {
				const anno = annotation.provides;
				if (!anno || rects.length === 0) return;
				const color = options?.color ?? '#FFEB3B';
				const scope = anno.forDocument(documentId);
				// One highlight annotation per page; the page's rects become the
				// per-line segment rects and their union becomes the bounding rect.
				groupByPage(rects).forEach((pageRects, pageIndex) => {
					scope.createAnnotation(pageIndex, {
						type: PdfAnnotationSubtype.HIGHLIGHT,
						pageIndex,
						id: uuid(),
						rect: boundingEngineRect(pageRects),
						segmentRects: pageRects.map(toEngineRect),
						strokeColor: color,
						opacity: 1,
						blendMode: PdfBlendMode.Multiply,
						created: new Date(),
					} as any);
				});
				if (options?.focus) {
					const first = rects[0];
					scroll.provides?.scrollToPage({
						pageNumber: first.pageIndex + 1,
						pageCoordinates: { x: first.x, y: first.y },
						alignY: 25,
					});
				}
			},
			focusRect: (rect) => {
				scroll.provides?.scrollToPage({
					pageNumber: rect.pageIndex + 1,
					pageCoordinates: { x: rect.x, y: rect.y },
					alignY: 25,
				});
			},
			highlightText: async (query, options) => {
				const s = search.provides;
				if (!s || !query) return [];
				const flags: MatchFlag[] = [];
				if (options?.matchCase) flags.push(MatchFlag.MatchCase);
				if (options?.matchWholeWord) flags.push(MatchFlag.MatchWholeWord);
				s.setFlags(flags);
				s.startSearch();
				const result = await taskToPromise(s.searchAllPages(query));
				const anno = annotation.provides?.forDocument(documentId);
				const color = options?.color ?? '#FFEB3B';
				const all: PdfRect[] = [];
				for (const hit of result.results) {
					const pageRects = hit.rects.map((rc) =>
						flattenRect(rc, hit.pageIndex),
					);
					if (pageRects.length === 0) continue;
					all.push(...pageRects);
					anno?.createAnnotation(hit.pageIndex, {
						type: PdfAnnotationSubtype.HIGHLIGHT,
						pageIndex: hit.pageIndex,
						id: uuid(),
						rect: boundingEngineRect(pageRects),
						segmentRects: pageRects.map(toEngineRect),
						strokeColor: color,
						opacity: 1,
						blendMode: PdfBlendMode.Multiply,
						created: new Date(),
					} as any);
				}
				// Drop the transient search overlay now that persistent highlight
				// annotations exist, so matches aren't double-highlighted.
				s.stopSearch();
				if (options?.focus && all.length > 0) {
					const first = all[0];
					scroll.provides?.scrollToPage({
						pageNumber: first.pageIndex + 1,
						pageCoordinates: { x: first.x, y: first.y },
						alignY: 25,
					});
				}
				return all;
			},

			/* search */
			search: async (query, options?: PdfSearchOptions) => {
				const s = search.provides;
				if (!s) {
					return { query, total: 0, activeResultIndex: -1, results: [] };
				}
				const flags: MatchFlag[] = [];
				if (options?.matchCase) flags.push(MatchFlag.MatchCase);
				if (options?.matchWholeWord) flags.push(MatchFlag.MatchWholeWord);
				s.setFlags(flags);
				s.startSearch();
				const result = await taskToPromise(s.searchAllPages(query));
				return {
					query,
					total: result.total,
					activeResultIndex: 0,
					results: result.results.map((r) => ({
						pageIndex: r.pageIndex,
						before: r.context?.before ?? '',
						match: r.context?.match ?? '',
						after: r.context?.after ?? '',
					})),
				};
			},
			nextSearchResult: () => search.provides?.nextResult(),
			previousSearchResult: () => search.provides?.previousResult(),
			goToSearchResult: (index) => search.provides?.goToResult(index),
			clearSearch: () => search.provides?.stopSearch(),

			/* annotations */
			setAnnotationTool: (toolId) => annotation.provides?.setActiveTool(toolId),
			getActiveAnnotationTool: () =>
				annotation.provides?.getActiveTool()?.id ?? null,
			selectAnnotation: (pageIndex, annotationId) =>
				annotation.provides?.selectAnnotation(pageIndex, annotationId),
			deselectAnnotation: () => annotation.provides?.deselectAnnotation(),
			deleteSelectedAnnotations: () => {
				const anno = annotation.provides;
				if (!anno) return;
				const selected = anno.getSelectedAnnotations();
				anno.deleteAnnotations(
					selected.map((a) => ({ pageIndex: a.object.pageIndex, id: a.object.id })),
				);
			},

			/* forms */
			getFormValues: () => form.provides?.getFormValues(documentId) ?? {},
			setFormValues: async (values) => {
				const fm = form.provides;
				if (!fm) return;
				await taskToPromise(fm.setFormValues(values, documentId));
			},

			/* signatures */
			placeSignature: (entryId) =>
				signature.provides?.forDocument(documentId).activateSignaturePlacement(entryId),
			openSignatureDialog,

			/* page manipulation */
			movePage: async (fromIndex, toIndex) => {
				const total = pageCount();
				if (total === 0) return;
				const order = Array.from({ length: total }, (_, i) => i);
				const [moved] = order.splice(fromIndex, 1);
				order.splice(toIndex, 0, moved);
				await applyOrder(order);
			},
			reorderPages: (order) => applyOrder(order),
			deletePage: async (pageIndex) => {
				const total = pageCount();
				if (total <= 1) return;
				const order = Array.from({ length: total }, (_, i) => i).filter(
					(i) => i !== pageIndex,
				);
				await applyOrder(order);
			},

			/* history */
			undo: () => history.provides?.undo(),
			redo: () => history.provides?.redo(),
			canUndo: () => history.provides?.canUndo() ?? false,
			canRedo: () => history.provides?.canRedo() ?? false,

			/* export / print — honour the feature toggles so a disabled control
			   cannot be triggered through the imperative API either. */
			download: () => {
				if (props.enableDownload === false) return;
				exporter.provides?.forDocument(documentId).download();
			},
			getBytes: async () => {
				const ex = exporter.provides;
				if (!ex) return new ArrayBuffer(0);
				return taskToPromise(ex.forDocument(documentId).saveAsCopy());
			},
			print: () => {
				if (props.enablePrint === false) return;
				printer.provides?.forDocument(documentId).print();
			},

			/* misc */
			toggleFullscreen: () => fullscreen.provides?.toggleFullscreen(),
			openUrl: (url, name) => {
				documents.provides?.openDocumentUrl({
					url,
					name: name ?? url.split('/').pop() ?? 'document.pdf',
					autoActivate: true,
				});
			},
			openBuffer: (buffer, name) => {
				documents.provides?.openDocumentBuffer({ buffer, name, autoActivate: true });
			},
		};
	}, [
		scroll.provides,
		scroll.state,
		zoom.provides,
		zoom.state,
		rotate.provides,
		rotate.rotation,
		spread.provides,
		selection.provides,
		annotation.provides,
		form.provides,
		signature.provides,
		history.provides,
		search.provides,
		exporter.provides,
		printer.provides,
		fullscreen.provides,
		documents.provides,
		documentId,
		applyOrder,
		openSignatureDialog,
		props.enableDownload,
		props.enablePrint,
	]);

	// Expose the imperative handle.
	useEffect(() => {
		if (typeof apiRef === 'function') {
			apiRef(api);
		} else if (apiRef) {
			(apiRef as { current: PdfViewerApi | null }).current = api;
		}
	}, [api, apiRef]);

	// Fire onReady once.
	const readyFired = useRef(false);
	useEffect(() => {
		if (readyFired.current) return;
		readyFired.current = true;
		props.onReady?.(api);
	}, [api]); // eslint-disable-line react-hooks/exhaustive-deps

	return api;
};
