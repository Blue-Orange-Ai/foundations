export * from './components/block-editor/BlueOrangeBlockEditorWrapper';

// Re-export the primitives values consumers commonly need to drive the editor
// directly (diff engine/viewer and the reference modal helper).
export {DiffEngine, DiffViewer, openReferenceModal} from "@blue-orange-ai/primitives-block-editor";

// Re-export the primitives types so consumers can type documents, options and
// diff interactions without depending on the primitives package directly.
export type {
	BlueOrangeDocument,
	BlueOrangeDocumentState,
	BlueOrangeDocumentOptions,
	BlueOrangeEditorToolbar,
	BlueOrangeDocumentOptionsPlugin,
	BlueOrangeEditorTextListener,
	BlueOrangeEditorBlockContextWindowItem,
	DiffViewerOptions,
	DiffEntry,
	DiffSummary
} from "@blue-orange-ai/primitives-block-editor";