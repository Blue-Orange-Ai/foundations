/**
 * Internal shared context for the PDF viewer. Holds the resolved feature
 * configuration, the active document id and the small amount of chrome UI state
 * (side panel + signature dialog) that several sibling components need.
 */
import React from 'react';
import type { PdfScrollMode, PdfSidePanelTab, PdfViewerApi, PdfViewerProps, PdfZoomLevel, PdfRotation, PdfSpreadMode } from '../types';
export interface ResolvedConfig {
    fileName: string;
    showToolbar: boolean;
    showSidePanel: boolean;
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
    minZoom: number;
    maxZoom: number;
    zoomStep: number;
    initialPage?: number;
    initialZoom: PdfZoomLevel;
    initialRotation: PdfRotation;
    initialSpread: PdfSpreadMode;
    scrollMode: PdfScrollMode;
    defaultSidePanelTab: PdfSidePanelTab;
    defaultSidePanelOpen: boolean;
}
/** Resolve the raw props into a config object with all defaults applied. */
export declare const resolveConfig: (props: PdfViewerProps) => ResolvedConfig;
export interface PdfViewerContextValue {
    config: ResolvedConfig;
    props: PdfViewerProps;
    documentId: string | null;
    /** Imperative API, available once a document is mounted. */
    apiRef: React.MutableRefObject<PdfViewerApi | null>;
    /** Chrome UI state. */
    sidePanelOpen: boolean;
    setSidePanelOpen: (open: boolean) => void;
    activeSidePanelTab: PdfSidePanelTab;
    setActiveSidePanelTab: (tab: PdfSidePanelTab) => void;
    signatureDialogOpen: boolean;
    setSignatureDialogOpen: (open: boolean) => void;
}
export declare const PdfViewerProvider: React.Provider<PdfViewerContextValue | null>;
export declare const usePdfViewerContext: () => PdfViewerContextValue;
