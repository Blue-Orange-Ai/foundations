// File-upload contract for the block editor.
//
// These types used to be imported from @blue-orange-ai/primitives-block-editor,
// but no published version to date exports them, nor does its
// `BlueOrangeDocumentOptions` declare `fileUploadHandler` (still true as of
// 0.56.18) — so the build only succeeded on machines that happened to have a
// newer primitives release installed locally, and failed in CI where
// `npm ci` installs the locked version.
//
// Declaring them here decouples the wrapper from the primitives type surface:
// the handler is passed straight through to the editor at runtime, so the
// wrapper only needs a shape permissive enough to describe it. Keep these
// definitions permissive — the primitives package owns the real contract.

/**
 * Result of a {@link BlueOrangeFileUploadHandler}.
 *
 * The editor uses `url` to reference the stored file. Every field is optional
 * and additional fields are allowed, so a handler is free to return whatever
 * the primitives editor understands.
 */
export interface BlueOrangeFileUploadResult {
	/** Location the editor should reference for the stored file. */
	url?: string;
	/** Display name for the stored file. */
	name?: string;
	/** MIME type of the stored file. */
	mimeType?: string;
	/** Size of the stored file, in bytes. */
	size?: number;
	/** Any additional fields understood by the primitives editor. */
	[key: string]: unknown;
}

/**
 * Called when media/file uploads bypass the media server, e.g. to write the
 * file to the local file system and hand back a URL to embed.
 */
export type BlueOrangeFileUploadHandler = (
	file: File,
	...rest: any[]
) =>
	| BlueOrangeFileUploadResult
	| string
	| Promise<BlueOrangeFileUploadResult | string>;
