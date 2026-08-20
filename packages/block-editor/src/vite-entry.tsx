export { BlueOrangeBlockEditorWrapper, CommentsLayout, DocumentMode } from './components/block-editor/BlueOrangeBlockEditorWrapper';

// Chart block plugin — registered automatically by the wrapper (see
// `enableCharts`), and exported so a host building its own editor options can
// register it itself via `additionalPlugins`.
export * from './components/block-editor/plugins/chart-plugin';
export type {
	BlueOrangeBlockEditorHandle,
	BlueOrangeBlockEditorWrapperProps,
	BlueOrangeCommentsLayout,
	BlueOrangeDocumentMode,
} from './components/block-editor/BlueOrangeBlockEditorWrapper';

// ---------------------------------------------------------------------------
// Re-export the primitives block-editor public API so consumers of
// @blue-orange-ai/foundations-block-editor can use the new (>= 0.56.3)
// surface without taking a direct dependency on the primitives package.
//
// NOTE: the published primitives bundle rolls up from `editor.js`, so its only
// runtime exports are `BlockEditor`, `DocumentBuilder` and `CalloutColor`. The
// remaining features (markdown serialization, diff/merge, templates, history,
// block store, document mode, …) are reached through a `BlockEditor` instance
// — see BlueOrangeBlockEditorHandle. Everything else below is therefore
// re-exported as a type only. `DocumentMode` is declared in the wrapper rather
// than re-exported, for the same reason (see above).
// ---------------------------------------------------------------------------

export { BlockEditor, DocumentBuilder, CalloutColor } from "@blue-orange-ai/primitives-block-editor";

// Document / state / options
export type {
	BlueOrangeDocument,
	BlueOrangeDocumentState,
	BlueOrangeDocumentOptions,
	BlueOrangeDocumentOptionsPlugin,
	BlueOrangeDocumentPlugin,
	BlueOrangeDocumentAction,
	BlueOrangeDocumentModeValue,
	BlockSpec,
} from "@blue-orange-ai/primitives-block-editor";

// Document builder (primitives >= 0.56.17) — a fluent, DOM-free way to build
// a document of any block type and push it into an editor.
export type {
	DocumentBuilderOptions,
	DocumentBuilderDescriptor,
	DocumentBuilderBlockOptions,
	DocumentBuilderTextOptions,
	DocumentBuilderCalloutOptions,
	DocumentBuilderCodeOptions,
	DocumentBuilderSavedOptions,
	DocumentBuilderImageOptions,
	DocumentBuilderVideoOptions,
	DocumentBuilderFileOptions,
	DocumentBuilderTableCell,
	DocumentBuilderTableOptions,
	DocumentBuilderTableInput,
	DocumentBuilderListItem,
	DocumentBuilderTypeSpec,
} from "@blue-orange-ai/primitives-block-editor";

// File upload — declared in this package rather than re-exported from
// primitives, which does not publish these types. See BlueOrangeFileUpload.ts.
export type {
	BlueOrangeFileUploadHandler,
	BlueOrangeFileUploadResult,
} from "./components/block-editor/BlueOrangeFileUpload";

// Toolbar / slash / inline-context / text-listener configuration
export type {
	BlueOrangeEditorToolbar,
	BlueOrangeEditorToolbarItem,
	BlueOrangeEditorToolbarFontColor,
	BlueOrangeEditorToolbarHighlighterColor,
	BlueOrangeEditorToolbarFillColor,
	BlueOrangeEditorBlockContextWindowItem,
	BlueOrangeEditorTextListener,
	BlueOrangeEditorSlashOption,
	BlueOrangeEditorInlineContextOption,
} from "@blue-orange-ai/primitives-block-editor";

// Selection metadata
export type {
	BlueOrangeSelectionMetadata,
	BlueOrangeSelectionBlockInfo,
} from "@blue-orange-ai/primitives-block-editor";

// Diff & merge
export type {
	DiffViewer,
	DiffViewerOptions,
	DiffEngine,
	DiffEntry,
	DiffEntryStatus,
	DiffSummary,
	DiffContentDiff,
} from "@blue-orange-ai/primitives-block-editor";

// History / transactions / store
export type {
	History,
	Transaction,
	TransactionMeta,
	BlockStore,
	BlockStoreEvent,
} from "@blue-orange-ai/primitives-block-editor";
