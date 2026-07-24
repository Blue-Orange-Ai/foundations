/**
 * The viewer toolbar. Every control is a component from
 * `@blue-orange-ai/foundations-core` (ButtonIcon, Input), driven by the headless
 * plugin capabilities. Each section can be hidden via config, and the active
 * state of toggle-style buttons is rendered with the `is-active` class (styled
 * black-on-white in light mode, inverted in dark — see PdfViewer.css).
 */
import React, { useState } from 'react';
import { ButtonIcon, Input, ButtonSize } from '@blue-orange-ai/foundations-core';

import { useScroll } from '@embedpdf/plugin-scroll/react';
import { useZoom } from '@embedpdf/plugin-zoom/react';
import { useRotate } from '@embedpdf/plugin-rotate/react';
import { useSpread } from '@embedpdf/plugin-spread/react';
import { useAnnotation } from '@embedpdf/plugin-annotation/react';
import { useHistoryCapability } from '@embedpdf/plugin-history/react';
import { useExportCapability } from '@embedpdf/plugin-export/react';
import { usePrintCapability } from '@embedpdf/plugin-print/react';
import { useFullscreen } from '@embedpdf/plugin-fullscreen/react';

import { usePdfViewerContext } from './context';
import { toZoomLevel, toSpreadMode, fromSpreadMode } from './mappings';

const Divider: React.FC = () => <div className="blue-orange-pdf-toolbar-divider" />;

export const PdfToolbar: React.FC = () => {
	const {
		documentId,
		config,
		sidePanelOpen,
		setSidePanelOpen,
		activeSidePanelTab,
		setActiveSidePanelTab,
		setSignatureDialogOpen,
	} = usePdfViewerContext();

	const docId = documentId ?? '';
	const scroll = useScroll(docId);
	const zoom = useZoom(docId);
	const rotate = useRotate(docId);
	const spread = useSpread(docId);
	const annotation = useAnnotation(docId);
	const history = useHistoryCapability();
	const exporter = useExportCapability();
	const printer = usePrintCapability();
	const fullscreen = useFullscreen();

	const currentPage = scroll.state?.currentPage ?? 1;
	const totalPages = scroll.state?.totalPages ?? 0;
	const zoomPercent = Math.round((zoom.state?.currentZoomLevel ?? 1) * 100);
	const activeTool = annotation.state?.activeToolId ?? null;
	const isDouble = fromSpreadMode(spread.spreadMode) !== 'none';

	const [pageDraft, setPageDraft] = useState<string>('');
	const [pageEditing, setPageEditing] = useState(false);
	const [zoomDraft, setZoomDraft] = useState<string>('');
	const [zoomEditing, setZoomEditing] = useState(false);

	const toggleSidePanel = (tab: typeof activeSidePanelTab) => {
		if (sidePanelOpen && activeSidePanelTab === tab) {
			setSidePanelOpen(false);
		} else {
			setActiveSidePanelTab(tab);
			setSidePanelOpen(true);
		}
	};

	const jumpToPage = () => {
		const n = parseInt(pageDraft, 10);
		if (!Number.isNaN(n) && totalPages > 0) {
			// Clamp to the valid range so an out-of-range entry still navigates to
			// the nearest page instead of being silently discarded.
			const target = Math.min(Math.max(n, 1), totalPages);
			scroll.provides?.scrollToPage({ pageNumber: target });
		}
		setPageDraft('');
		setPageEditing(false);
	};

	const applyZoom = () => {
		const n = parseInt(zoomDraft, 10);
		if (!Number.isNaN(n)) {
			// Interpret the entry as a percentage and clamp to the configured range.
			const scale = Math.min(Math.max(n / 100, config.minZoom), config.maxZoom);
			zoom.provides?.requestZoom(scale);
		}
		setZoomDraft('');
		setZoomEditing(false);
	};

	const toggleTool = (toolId: string) => {
		annotation.provides?.setActiveTool(activeTool === toolId ? null : toolId);
	};

	if (!documentId) return null;

	return (
		<div className="blue-orange-pdf-toolbar">
			{/* Panels */}
			{config.showSidePanel && (
				<div className="blue-orange-pdf-toolbar-group">
					{config.enableThumbnails && (
						<ButtonIcon
							icon="ri-layout-grid-line"
							label="Thumbnails"
							size={ButtonSize.SMALL}
							className={
								sidePanelOpen && activeSidePanelTab === 'thumbnails'
									? 'is-active'
									: ''
							}
							onClick={() => toggleSidePanel('thumbnails')}
						/>
					)}
					{config.enableOutline && (
						<ButtonIcon
							icon="ri-bookmark-line"
							label="Outline"
							size={ButtonSize.SMALL}
							className={
								sidePanelOpen && activeSidePanelTab === 'outline'
									? 'is-active'
									: ''
							}
							onClick={() => toggleSidePanel('outline')}
						/>
					)}
					{config.enableSearch && (
						<ButtonIcon
							icon="ri-search-line"
							label="Search"
							size={ButtonSize.SMALL}
							className={
								sidePanelOpen && activeSidePanelTab === 'search'
									? 'is-active'
									: ''
							}
							onClick={() => toggleSidePanel('search')}
						/>
					)}
					<Divider />
				</div>
			)}

			{/* Page navigation */}
			{config.showPageControls && (
				<>
					<div className="blue-orange-pdf-toolbar-group blue-orange-pdf-page-indicator">
						<ButtonIcon
							icon="ri-arrow-up-s-line"
							label="Previous page"
							size={ButtonSize.SMALL}
							isDisabled={currentPage <= 1}
							onClick={() => scroll.provides?.scrollToPreviousPage()}
						/>
						<Input
							value={pageEditing ? pageDraft : String(currentPage)}
							isNumber
							onChange={setPageDraft}
							focusIn={() => {
								// Clear on focus so the typed number replaces the current
								// page rather than being appended to it.
								setPageEditing(true);
								setPageDraft('');
							}}
							enterEvent={jumpToPage}
							focusOut={jumpToPage}
						/>
						<span>/ {totalPages}</span>
						<ButtonIcon
							icon="ri-arrow-down-s-line"
							label="Next page"
							size={ButtonSize.SMALL}
							isDisabled={currentPage >= totalPages}
							onClick={() => scroll.provides?.scrollToNextPage()}
						/>
					</div>
					<Divider />
				</>
			)}

			{/* Zoom */}
			{config.showZoomControls && (
				<>
					<div className="blue-orange-pdf-toolbar-group">
						<ButtonIcon
							icon="ri-subtract-line"
							label="Zoom out"
							size={ButtonSize.SMALL}
							onClick={() => zoom.provides?.zoomOut()}
						/>
						<div className="blue-orange-pdf-zoom-input">
							<Input
								value={zoomEditing ? zoomDraft : String(zoomPercent)}
								isNumber
								onChange={setZoomDraft}
								focusIn={() => {
									setZoomEditing(true);
									setZoomDraft('');
								}}
								enterEvent={applyZoom}
								focusOut={applyZoom}
							/>
							<span>%</span>
						</div>
						<ButtonIcon
							icon="ri-add-line"
							label="Zoom in"
							size={ButtonSize.SMALL}
							onClick={() => zoom.provides?.zoomIn()}
						/>
						<ButtonIcon
							icon="ri-fullscreen-fill"
							label="Fit width"
							size={ButtonSize.SMALL}
							onClick={() =>
								zoom.provides?.requestZoom(toZoomLevel('fit-width'))
							}
						/>
						<ButtonIcon
							icon="ri-fullscreen-exit-line"
							label="Fit page"
							size={ButtonSize.SMALL}
							onClick={() =>
								zoom.provides?.requestZoom(toZoomLevel('fit-page'))
							}
						/>
					</div>
					<Divider />
				</>
			)}

			{/* Rotation + spread */}
			{(config.enableRotation || config.showSpreadControls) && (
				<div className="blue-orange-pdf-toolbar-group">
					{config.enableRotation && (
						<>
							<ButtonIcon
								icon="ri-anticlockwise-line"
								label="Rotate left"
								size={ButtonSize.SMALL}
								onClick={() => rotate.provides?.rotateBackward()}
							/>
							<ButtonIcon
								icon="ri-clockwise-line"
								label="Rotate right"
								size={ButtonSize.SMALL}
								onClick={() => rotate.provides?.rotateForward()}
							/>
						</>
					)}
					{config.showSpreadControls && (
						<>
							<ButtonIcon
								icon="ri-file-line"
								label="Single page"
								size={ButtonSize.SMALL}
								className={!isDouble ? 'is-active' : ''}
								onClick={() =>
									spread.provides?.setSpreadMode(toSpreadMode('none'))
								}
							/>
							<ButtonIcon
								icon="ri-book-open-line"
								label="Double page"
								size={ButtonSize.SMALL}
								className={isDouble ? 'is-active' : ''}
								onClick={() =>
									spread.provides?.setSpreadMode(toSpreadMode('odd'))
								}
							/>
						</>
					)}
				</div>
			)}

			{/* Annotation tools */}
			{config.enableAnnotations && (
				<>
					<Divider />
					<div className="blue-orange-pdf-toolbar-group">
						<ButtonIcon
							icon="ri-mark-pen-line"
							label="Highlight"
							size={ButtonSize.SMALL}
							className={activeTool === 'highlight' ? 'is-active' : ''}
							onClick={() => toggleTool('highlight')}
						/>
						<ButtonIcon
							icon="ri-underline"
							label="Underline"
							size={ButtonSize.SMALL}
							className={activeTool === 'underline' ? 'is-active' : ''}
							onClick={() => toggleTool('underline')}
						/>
						<ButtonIcon
							icon="ri-quill-pen-line"
							label="Draw"
							size={ButtonSize.SMALL}
							className={activeTool === 'ink' ? 'is-active' : ''}
							onClick={() => toggleTool('ink')}
						/>
						<ButtonIcon
							icon="ri-text"
							label="Text"
							size={ButtonSize.SMALL}
							className={activeTool === 'freeText' ? 'is-active' : ''}
							onClick={() => toggleTool('freeText')}
						/>
					</div>
				</>
			)}

			{/* Signature */}
			{config.enableSignatures && (
				<div className="blue-orange-pdf-toolbar-group">
					<ButtonIcon
						icon="ri-sketching"
						label="Add signature"
						size={ButtonSize.SMALL}
						onClick={() => setSignatureDialogOpen(true)}
					/>
				</div>
			)}

			<div className="blue-orange-pdf-toolbar-spacer" />

			{/* History */}
			{config.showHistoryControls &&
				(config.enableAnnotations ||
					config.enableForms ||
					config.enableSignatures) && (
					<div className="blue-orange-pdf-toolbar-group">
						<ButtonIcon
							icon="ri-arrow-go-back-line"
							label="Undo"
							size={ButtonSize.SMALL}
							onClick={() => history.provides?.undo()}
						/>
						<ButtonIcon
							icon="ri-arrow-go-forward-line"
							label="Redo"
							size={ButtonSize.SMALL}
							onClick={() => history.provides?.redo()}
						/>
						<Divider />
					</div>
				)}

			{/* Output */}
			{(config.enablePrint || config.enableDownload || config.enableFullscreen) && (
				<div className="blue-orange-pdf-toolbar-group">
					{config.enablePrint && (
						<ButtonIcon
							icon="ri-printer-line"
							label="Print"
							size={ButtonSize.SMALL}
							onClick={() => printer.provides?.forDocument(docId).print()}
						/>
					)}
					{config.enableDownload && (
						<ButtonIcon
							icon="ri-download-line"
							label="Download"
							size={ButtonSize.SMALL}
							onClick={() => exporter.provides?.forDocument(docId).download()}
						/>
					)}
					{config.enableFullscreen && (
						<ButtonIcon
							icon="ri-fullscreen-line"
							label="Fullscreen"
							size={ButtonSize.SMALL}
							onClick={() => fullscreen.provides?.toggleFullscreen()}
						/>
					)}
				</div>
			)}
		</div>
	);
};
