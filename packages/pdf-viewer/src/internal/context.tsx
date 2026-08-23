/**
 * Internal shared context for the PDF viewer. Holds the resolved feature
 * configuration, the active document id and the small amount of chrome UI state
 * (side panel + signature dialog) that several sibling components need.
 */
import React, { createContext, useContext } from 'react';
import type { PdfFullscreen } from './useFullscreen';
import type {
	PdfScrollMode,
	PdfSidePanelTab,
	PdfTheme,
	PdfViewerApi,
	PdfViewerProps,
	PdfZoomLevel,
	PdfRotation,
	PdfSpreadMode,
} from '../types';

export interface ResolvedConfig {
	fileName: string;
	theme: PdfTheme;
	// features
	showToolbar: boolean;
	showSidePanel: boolean;
	showPageControls: boolean;
	showZoomControls: boolean;
	showSpreadControls: boolean;
	showHistoryControls: boolean;
	enableThumbnails: boolean;
	enableOutline: boolean;
	enableSearch: boolean;
	enableSelection: boolean;
	enableAnnotations: boolean;
	enableForms: boolean;
	enableSignatures: boolean;
	enablePageReorder: boolean;
	enablePrint: boolean;
	enableDownload: boolean;
	enableFullscreen: boolean;
	enableRotation: boolean;
	enablePan: boolean;
	// zoom
	minZoom: number;
	maxZoom: number;
	zoomStep: number;
	enablePinchZoom: boolean;
	enableWheelZoom: boolean;
	// initial state
	initialPage?: number;
	initialZoom: PdfZoomLevel;
	initialRotation: PdfRotation;
	initialSpread: PdfSpreadMode;
	scrollMode: PdfScrollMode;
	defaultSidePanelTab: PdfSidePanelTab;
	defaultSidePanelOpen: boolean;
}

const bool = (value: boolean | undefined, fallback: boolean): boolean =>
	value === undefined ? fallback : value;

/** Resolve the raw props into a config object with all defaults applied. */
export const resolveConfig = (props: PdfViewerProps): ResolvedConfig => ({
	fileName: props.fileName ?? 'document.pdf',
	theme: props.theme ?? 'light',
	showToolbar: bool(props.showToolbar, true),
	showSidePanel: bool(props.showSidePanel, true),
	showPageControls: bool(props.showPageControls, true),
	showZoomControls: bool(props.showZoomControls, true),
	showSpreadControls: bool(props.showSpreadControls, true),
	showHistoryControls: bool(props.showHistoryControls, true),
	enableThumbnails: bool(props.enableThumbnails, true),
	enableOutline: bool(props.enableOutline, true),
	enableSearch: bool(props.enableSearch, true),
	enableSelection: bool(props.enableSelection, true),
	enableAnnotations: bool(props.enableAnnotations, true),
	enableForms: bool(props.enableForms, true),
	enableSignatures: bool(props.enableSignatures, true),
	enablePageReorder: bool(props.enablePageReorder, true),
	enablePrint: bool(props.enablePrint, true),
	enableDownload: bool(props.enableDownload, true),
	enableFullscreen: bool(props.enableFullscreen, true),
	enableRotation: bool(props.enableRotation, true),
	enablePan: bool(props.enablePan, true),
	minZoom: props.minZoom ?? 0.25,
	maxZoom: props.maxZoom ?? 10,
	zoomStep: props.zoomStep ?? 0.1,
	enablePinchZoom: bool(props.enablePinchZoom, true),
	enableWheelZoom: bool(props.enableWheelZoom, true),
	initialPage: props.initialPage,
	initialZoom: props.initialZoom ?? 'automatic',
	initialRotation: props.initialRotation ?? 0,
	initialSpread: props.initialSpread ?? 'none',
	scrollMode: props.scrollMode ?? 'vertical',
	defaultSidePanelTab: props.defaultSidePanelTab ?? 'thumbnails',
	defaultSidePanelOpen: bool(props.sidePanelOpen, true),
});

export interface PdfViewerContextValue {
	config: ResolvedConfig;
	props: PdfViewerProps;
	documentId: string | null;
	/** True only once the active document has finished loading. */
	documentReady: boolean;
	/** Imperative API, available once a document is mounted. */
	apiRef: React.MutableRefObject<PdfViewerApi | null>;
	/** Chrome UI state. */
	sidePanelOpen: boolean;
	setSidePanelOpen: (open: boolean) => void;
	activeSidePanelTab: PdfSidePanelTab;
	setActiveSidePanelTab: (tab: PdfSidePanelTab) => void;
	signatureDialogOpen: boolean;
	setSignatureDialogOpen: (open: boolean) => void;
	/** Fullscreen control for the viewer root element. */
	fullscreen: PdfFullscreen;
	/** The viewer root element — portal target while fullscreen. */
	rootRef: React.MutableRefObject<HTMLDivElement | null>;
}

const PdfViewerContext = createContext<PdfViewerContextValue | null>(null);

export const PdfViewerProvider = PdfViewerContext.Provider;

export const usePdfViewerContext = (): PdfViewerContextValue => {
	const ctx = useContext(PdfViewerContext);
	if (!ctx) {
		throw new Error('usePdfViewerContext must be used within a PdfViewer');
	}
	return ctx;
};
