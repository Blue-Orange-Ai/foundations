export { BlueOrangeBlockEditorWrapper } from './components/block-editor/BlueOrangeBlockEditorWrapper';
export type { BlueOrangeBlockEditorHandle, BlueOrangeBlockEditorWrapperProps } from './components/block-editor/BlueOrangeBlockEditorWrapper';

// ---------------------------------------------------------------------------
// Re-export the primitives block-editor public API so consumers of
// @blue-orange-ai/foundations-block-editor can use the new (>= 0.56.3)
// surface without taking a direct dependency on the primitives package.
//
// NOTE: the published primitives bundle only exports `BlockEditor` as a
// runtime value. The remaining new features (markdown serialization,
// diff/merge, templates, history, block store, …) are reached through a
// `BlockEditor` instance — see BlueOrangeBlockEditorHandle. Everything else
// below is therefore re-exported as a type only.
// ---------------------------------------------------------------------------

export { BlockEditor } from "@blue-orange-ai/primitives-block-editor";

// Document / state / options
export type {
	BlueOrangeDocument,
	BlueOrangeDocumentState,
	BlueOrangeDocumentOptions,
	BlueOrangeDocumentOptionsPlugin,
	BlueOrangeDocumentPlugin,
	BlueOrangeDocumentAction,
	BlockSpec,
} from "@blue-orange-ai/primitives-block-editor";

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
