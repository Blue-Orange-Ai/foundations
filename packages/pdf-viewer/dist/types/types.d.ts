/** Zoom level: an absolute scale (1 = 100%) or one of the auto-fit modes. */
export type PdfZoomLevel = number | 'automatic' | 'fit-page' | 'fit-width';
/** Page rotation expressed in degrees. */
export type PdfRotation = 0 | 90 | 180 | 270;
/** Page layout: single page, or two-up with odd/even binding. */
export type PdfSpreadMode = 'none' | 'odd' | 'even';
/** Scrolling direction of the document. */
export type PdfScrollMode = 'vertical' | 'horizontal';
/** Which panel is shown in the side bar. */
export type PdfSidePanelTab = 'thumbnails' | 'outline' | 'search';
/** Basic information about a loaded document. */
export interface PdfDocumentInfo {
    /** Internal document id assigned by the engine. */
    documentId: string;
    /** Total number of pages. */
    pageCount: number;
    /** File name (if known). */
    name?: string;
    /** Whether the document is encrypted. */
    isEncrypted: boolean;
}
/** A rectangle in PDF page coordinates, flattened for consumer convenience. */
export interface PdfRect {
    pageIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * A resolved text selection. Returned by selection callbacks and
 * `PdfViewerApi.getSelection()`. Everything the user is currently looking at /
 * has highlighted is described here: the text, every page it spans, the glyph
 * range and the geometry (both per-line rects and per-page bounding boxes).
 */
export interface PdfTextSelection {
    /** The selected text, pages joined with a newline. */
    text: string;
    /** 0-based page indices the selection spans, in ascending order. */
    pages: number[];
    /** First page of the selection (0-based). */
    startPage: number;
    /** Last page of the selection (0-based). */
    endPage: number;
    /** Glyph index of the start of the selection on `startPage`. */
    startIndex: number;
    /** Glyph index of the end of the selection on `endPage`. */
    endIndex: number;
    /** Per-line highlight rectangles across every page of the selection. */
    rects: PdfRect[];
    /** One bounding box per page of the selection. */
    boundingRects: PdfRect[];
}
/** Kinds of annotation change reported through `onAnnotationsChange`. */
export type PdfAnnotationChangeType = 'create' | 'update' | 'delete' | 'loaded';
/** A single annotation change event. */
export interface PdfAnnotationChange {
    type: PdfAnnotationChangeType;
    documentId: string;
    /** Page the annotation lives on (absent for `loaded`). */
    pageIndex?: number;
    /** The annotation object (absent for `loaded`). */
    annotation?: unknown;
    /** For `loaded`: total annotations present in the document. */
    total?: number;
}
/** A form field value change. */
export interface PdfFormFieldChange {
    documentId: string;
    pageIndex: number;
    annotationId: string;
    /** All current form values keyed by field name. */
    values: Record<string, string>;
}
/** A single search hit. */
export interface PdfSearchResult {
    pageIndex: number;
    /** Text immediately before the match. */
    before: string;
    /** The matched text. */
    match: string;
    /** Text immediately after the match. */
    after: string;
}
/** Search state reported through `onSearchResults`. */
export interface PdfSearchState {
    query: string;
    total: number;
    activeResultIndex: number;
    results: PdfSearchResult[];
}
/** Options accepted by {@link PdfViewerApi.search}. */
export interface PdfSearchOptions {
    matchCase?: boolean;
    matchWholeWord?: boolean;
}
/**
 * Imperative handle for driving the viewer from the outside. Obtain it via a
 * React `ref` on `<PdfViewer ref={ref} />` or through the `onReady` callback.
 *
 * This lets you dynamically drive the user's state and view: change the current
 * page, zoom, rotation, spread, search, annotation tool, form values, selection
 * (clear/highlight), signatures, page order, undo/redo, export and print.
 */
export interface PdfViewerApi {
    /** Jump to a 1-based page number. */
    goToPage(page: number): void;
    nextPage(): void;
    previousPage(): void;
    /** Current 1-based page number. */
    getCurrentPage(): number;
    getPageCount(): number;
    setZoom(level: PdfZoomLevel): void;
    zoomIn(): void;
    zoomOut(): void;
    /** Current effective numeric zoom (1 = 100%). */
    getZoom(): number;
    setRotation(rotation: PdfRotation): void;
    rotateClockwise(): void;
    rotateCounterClockwise(): void;
    getRotation(): PdfRotation;
    setSpreadMode(mode: PdfSpreadMode): void;
    setScrollMode(mode: PdfScrollMode): void;
    /** The current text selection, or null if nothing is selected. */
    getSelection(): PdfTextSelection | null;
    /** Resolve the currently selected text. */
    getSelectedText(): Promise<string>;
    clearSelection(): void;
    /** Convert the current text selection into a highlight annotation. */
    highlightSelection(color?: string): void;
    search(query: string, options?: PdfSearchOptions): Promise<PdfSearchState>;
    nextSearchResult(): void;
    previousSearchResult(): void;
    goToSearchResult(index: number): void;
    clearSearch(): void;
    /** Activate an annotation tool (e.g. `highlight`, `ink`, `freeText`), or pass null to deactivate. */
    setAnnotationTool(toolId: string | null): void;
    getActiveAnnotationTool(): string | null;
    /** Select an annotation by id (drives the user's annotation selection). */
    selectAnnotation(pageIndex: number, annotationId: string): void;
    deselectAnnotation(): void;
    deleteSelectedAnnotations(): void;
    getFormValues(): Record<string, string>;
    setFormValues(values: Record<string, string>): Promise<void>;
    /** Arm placement of a previously created signature entry; the next page click drops it. */
    placeSignature(entryId: string): void;
    /** Open the built-in signature creation dialog. */
    openSignatureDialog(): void;
    /** Move a page (0-based) to a new index. Rebuilds and reloads the document. */
    movePage(fromIndex: number, toIndex: number): Promise<void>;
    /** Apply an explicit page order (array of 0-based source indices). */
    reorderPages(order: number[]): Promise<void>;
    /** Delete a page (0-based). */
    deletePage(pageIndex: number): Promise<void>;
    undo(): void;
    redo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    /** Trigger a browser download of the (possibly modified) document. */
    download(): void;
    /** Get the current document bytes (including edits). */
    getBytes(): Promise<ArrayBuffer>;
    print(): void;
    toggleFullscreen(): void;
    /** Open a new document from a URL. */
    openUrl(url: string, name?: string): void;
    /** Open a new document from bytes. */
    openBuffer(buffer: ArrayBuffer, name: string): void;
}
/** Props for the top level {@link PdfViewer} component. */
export interface PdfViewerProps {
    /** URL to load the PDF from. */
    src?: string;
    /** Load the PDF from an ArrayBuffer instead of a URL. */
    data?: ArrayBuffer;
    /** File name used for downloads and display. */
    fileName?: string;
    /** Password for an encrypted document. */
    password?: string;
    /** Override the URL the PDFium wasm binary is loaded from (defaults to jsDelivr CDN). */
    wasmUrl?: string;
    /** Run the engine in a Web Worker (default true). */
    worker?: boolean;
    /** Disable automatic remote font fallback fetching. */
    disableFontFallback?: boolean;
    /** Initial 1-based page. */
    initialPage?: number;
    /** Initial zoom level. */
    initialZoom?: PdfZoomLevel;
    /** Initial rotation. */
    initialRotation?: PdfRotation;
    /** Initial spread mode. */
    initialSpread?: PdfSpreadMode;
    /** Scroll direction (default vertical). */
    scrollMode?: PdfScrollMode;
    /** Controlled 1-based current page — the viewer follows changes to this prop. */
    page?: number;
    /** Controlled zoom level. */
    zoom?: PdfZoomLevel;
    /** Controlled rotation. */
    rotation?: PdfRotation;
    /** Controlled spread mode. */
    spread?: PdfSpreadMode;
    minZoom?: number;
    maxZoom?: number;
    zoomStep?: number;
    showToolbar?: boolean;
    showSidePanel?: boolean;
    /** Initial side panel tab. */
    defaultSidePanelTab?: PdfSidePanelTab;
    /** Start with the side panel open (default true). */
    sidePanelOpen?: boolean;
    enableThumbnails?: boolean;
    enableOutline?: boolean;
    enableSearch?: boolean;
    enableSelection?: boolean;
    enableAnnotations?: boolean;
    enableForms?: boolean;
    enableSignatures?: boolean;
    /** Allow reordering pages by dragging thumbnails (default true). */
    enablePageReorder?: boolean;
    enablePrint?: boolean;
    enableDownload?: boolean;
    enableFullscreen?: boolean;
    enableRotation?: boolean;
    enablePan?: boolean;
    className?: string;
    style?: React.CSSProperties;
    /** Fired when a document finishes loading. */
    onDocumentLoad?: (info: PdfDocumentInfo) => void;
    /** Fired when a document fails to load. */
    onDocumentError?: (error: string) => void;
    /** Fired when the current page changes. Page is 1-based. */
    onPageChange?: (page: number, totalPages: number) => void;
    /** Fired when the effective zoom changes (1 = 100%). */
    onZoomChange?: (zoom: number) => void;
    /** Fired when the rotation changes. */
    onRotationChange?: (rotation: PdfRotation) => void;
    /**
     * Fired whenever the user's text selection changes. Receives the full
     * selection (text, page references and geometry) or null when cleared.
     */
    onSelectionChange?: (selection: PdfTextSelection | null) => void;
    /** Fired when the user completes a non-empty text selection. */
    onTextSelected?: (selection: PdfTextSelection) => void;
    /** Fired on any annotation create/update/delete. */
    onAnnotationsChange?: (change: PdfAnnotationChange) => void;
    /** Fired when a form field value changes. */
    onFormFieldChange?: (change: PdfFormFieldChange) => void;
    /** Fired when search results update. */
    onSearchResults?: (state: PdfSearchState) => void;
    /** Fired when the page order changes (via thumbnail drag or the API). */
    onPageOrderChange?: (order: number[]) => void;
    /** Fired once the imperative API is ready. */
    onReady?: (api: PdfViewerApi) => void;
}
