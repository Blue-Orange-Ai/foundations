import React, {useEffect, useRef, useState, useImperativeHandle, forwardRef} from "react";

import '../../../../../node_modules/codemirror/lib/codemirror.css'
import '../../../../../node_modules/plyr/dist/plyr.css'

import './BlueOrangeBlockEditorWrapper.css'

import '@blue-orange-ai/primitives-block-editor/dist/css/primitives-block-editor.min.css'

import {BlockEditor} from "@blue-orange-ai/primitives-block-editor";
// The published primitives bundle exports `BlockEditor`, `DocumentBuilder` and
// `CalloutColor` as runtime values; everything else below is type-only (erased
// at build time).
import type {
	BlockSpec,
	BlueOrangeDocument,
	BlueOrangeDocumentModeValue,
	BlueOrangeDocumentOptions,
	BlueOrangeDocumentState,
	DiffViewer,
	DiffViewerOptions,
	DocumentBuilder
} from "@blue-orange-ai/primitives-block-editor";
// Declared locally rather than imported from primitives — see BlueOrangeFileUpload.ts.
import type {BlueOrangeFileUploadHandler} from "./BlueOrangeFileUpload";
import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerPosition,
	FullPageComments,
	Tab,
	RenderHtml,
	Tabs
} from "@blue-orange-ai/foundations-core";
import UnicodeEmoji from "./data/UnicodeEmoji";
import {PublicUser, User, UserSearchPublicResult, UserSearchResult} from "@blue-orange-ai/foundations-clients";
import passport from "./config/BlueOrangePassportConfig";
import CodeMirror from "codemirror";
import {v4 as uuidv4} from "uuid";


// Markdown serialization is implemented on the BlockEditor instance at
// runtime (delegated to its internal DocumentSerializer) but is not part of
// the published BlockEditor type, so we narrow to it explicitly.
type MarkdownCapableEditor = {
	toMarkdown: () => string,
	fromMarkdown: (markdown: string) => void,
}

/**
 * Document-level interaction modes (primitives >= 0.56.15).
 *
 * Mirrors `DocumentMode` from primitives. The published bundle rolls up from
 * `editor.js` rather than `index.js`, so the constant is not a runtime export
 * of the package — it is declared here rather than re-exported.
 */
export const DocumentMode = Object.freeze({
	EDIT: "edit",
	COMMENT: "comment",
	READ: "read",
} as const);

export type BlueOrangeDocumentMode = BlueOrangeDocumentModeValue;

/**
 * Fold `mode` / `readOnly` / `commentOnly` into the single mode the editor
 * takes. `mode` wins outright — the booleans are shorthands for hosts that
 * only need the binary question, and primitives ignores them when `mode` is
 * set, so the wrapper resolves them the same way.
 */
const resolveDocumentMode = (
	mode?: BlueOrangeDocumentModeValue,
	readOnly?: boolean,
	commentOnly?: boolean
): BlueOrangeDocumentModeValue => {
	if (mode) {
		return mode;
	}
	if (readOnly) {
		return DocumentMode.READ;
	}
	if (commentOnly) {
		return DocumentMode.COMMENT;
	}
	return DocumentMode.EDIT;
}

// `fileUploadHandler` is accepted by the editor at runtime but is absent from
// the published BlueOrangeDocumentOptions type, so we add it here. Omit-then-add
// (rather than a plain intersection) keeps this working once primitives declares
// the option itself; if its signature then differs from ours, the build says so.
type BlueOrangeEditorOptions = Omit<BlueOrangeDocumentOptions, "fileUploadHandler"> & {
	fileUploadHandler?: BlueOrangeFileUploadHandler,
}

interface CommentState {
	display: boolean,
	commentId: Array<string>
}

interface EditorMention {
	userId: string | undefined,
	type: string,
	contextHtml: string,
	inlineHtml: string,
}

interface ReferenceDetail {
	referenceUuid: string,
	referenceNumber: number,
	referenceLink?: string,
	referenceDescription?: string,
}

export interface BlueOrangeBlockEditorHandle {
	getEditor: () => BlockEditor | null,
	toJson: () => BlueOrangeDocument | null,
	toHtmlCopy: () => string | null,
	reviveDocument: (doc: BlueOrangeDocument) => void,
	clearDocument: () => void,
	// Markdown serialization (primitives >= 0.56.3)
	toMarkdown: () => string | null,
	fromMarkdown: (markdown: string) => void,
	// History
	undo: () => void,
	redo: () => void,
	// Diff & merge against another document version
	diffDocuments: (otherDoc: BlueOrangeDocument, options?: DiffViewerOptions) => DiffViewer | null,
	// Programmatic block creation
	createBlock: (spec: BlockSpec) => void,
	// Template fields (active when `template` is enabled)
	isTemplateMode: () => boolean,
	getTemplateVariables: () => string[],
	getTemplateLoops: () => Array<{ name: string; fields: string[] }>,
	getTemplateSchema: () => Record<string, string | Array<Record<string, string>>>,
	substituteTemplateData: (data: Record<string, unknown>) => void,
	substituteVariables: (substitutions: Record<string, string>) => void,
	substituteLoops: (loopData: Record<string, Array<Record<string, string>>>) => void,
	applyTemplateModeToBlocks: () => void,
	// Document mode — read-only / comment-only (primitives >= 0.56.15).
	// A runtime stance over the whole document: it gates user input, never the
	// programmatic API, and is not serialised into the document.
	getDocumentMode: () => BlueOrangeDocumentModeValue,
	setDocumentMode: (mode: BlueOrangeDocumentModeValue) => void,
	setReadOnly: (readOnly?: boolean) => void,
	setCommentOnly: (commentOnly?: boolean) => void,
	isReadOnly: () => boolean,
	isCommentOnly: () => boolean,
	canEdit: () => boolean,
	canComment: () => boolean,
	effectiveBlockEditable: (state: BlueOrangeDocumentState) => boolean,
	applyDocumentMode: () => void,
	// Fluent document construction (primitives >= 0.56.17). The builder is
	// seeded with the editor's current document; call applyTo/appendTo/insertInto
	// on it to push blocks back.
	documentBuilder: () => DocumentBuilder | null,
}

export interface BlueOrangeBlockEditorWrapperProps {
	documentId?: string,
	document?: BlueOrangeDocument,
	options?: Partial<BlueOrangeDocumentOptions>,
	mediaUri?: string,
	disableMediaServer?: boolean,
	// When provided, media/file uploads bypass the media server entirely and
	// are handed to this callback (e.g. to write to the local file system).
	fileUploadHandler?: BlueOrangeFileUploadHandler,
	enableMentions?: boolean,
	enableComments?: boolean,
	template?: boolean,
	/**
	 * Document-level interaction mode (primitives >= 0.56.15). "edit" is normal
	 * authoring, "comment" freezes the body but still allows comments to be
	 * attached to a selection, "read" disables all editing. Changing it after
	 * mount switches the live editor over.
	 *
	 * Takes precedence over `readOnly` / `commentOnly`. Note that "comment"
	 * needs `enableComments` left on to be useful.
	 */
	mode?: BlueOrangeDocumentModeValue,
	/** Shorthand for `mode="read"`. Ignored when `mode` is set. */
	readOnly?: boolean,
	/** Shorthand for `mode="comment"`. Ignored when `mode` is set. */
	commentOnly?: boolean,
	onModeChange?: (mode: BlueOrangeDocumentModeValue, previousMode: BlueOrangeDocumentModeValue) => void,
	handleMentionAdded?: (mentionId: string, userId: string) => void,
	onReferenceAdded?: (detail: ReferenceDetail) => void,
	onReferenceUpdated?: (detail: ReferenceDetail) => void,
	onReferenceRemoved?: (detail: ReferenceDetail) => void,
	onReferenceClicked?: (detail: ReferenceDetail) => void,
	onChange?: (doc: BlueOrangeDocument) => void,
}

export const BlueOrangeBlockEditorWrapper = forwardRef<BlueOrangeBlockEditorHandle, BlueOrangeBlockEditorWrapperProps>(({
	documentId,
	document: initialDocument,
	options: userOptions,
	mediaUri,
	disableMediaServer = false,
	fileUploadHandler,
	enableMentions = true,
	enableComments = true,
	template = false,
	mode,
	readOnly,
	commentOnly,
	onModeChange,
	handleMentionAdded,
	onReferenceAdded,
	onReferenceUpdated,
	onReferenceRemoved,
	onReferenceClicked,
	onChange,
}, ref) => {

	const editorRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeEditorRef = useRef<BlockEditor | null>(null);

	const resolvedMode = resolveDocumentMode(mode, readOnly, commentOnly);

	// The mode-changed listener is registered once on mount, so it reads the
	// callback through a ref to always reach the latest prop rather than the one
	// captured at construction.
	const onModeChangeRef = useRef(onModeChange);
	onModeChangeRef.current = onModeChange;

	const [commentWindowState, setCommentWindowState] = useState<CommentState>({
		display: false,
		commentId: [""]
	});

	const [activeCommentPos, setActiveCommentPos] = useState<number>(0);

	const removeIds = (element: HTMLElement) => {
		element.removeAttribute('id');
		Array.from(element.children).forEach(el => removeIds(el as HTMLElement));
	}

	const cloneCommentElement = (commentId: string): string => {
		if (!editorRef.current) {
			return "";
		}

		const originalElements = editorRef.current.querySelectorAll('[blue-orange-comment-id="' + commentId + '"]');
		if (originalElements == null || originalElements.length < 1) {
			return ""
		}
		const originalElement = originalElements[0];
		const clonedElement = originalElement.cloneNode(true) as HTMLElement;
		removeIds(clonedElement);
		return clonedElement.outerHTML;
	}

	const closeCommentWindow = () => {
		setActiveCommentPos(0);
		setCommentWindowState({
			display: false,
			commentId: [""]
		})
	}

	const getDisplayName = (user: User | PublicUser) => {
		if (user.name == undefined || user.name == "") {
			return user.username;
		} else {
			return user.name;
		}
	}

	const fetchUsers = async (query: string): Promise<EditorMention[]> => {
		try {
			var searchResult: UserSearchPublicResult = await passport.searchPublicUsers(
				{
					query: query,
					page: 0,
					size: 10
				});
			var users: Array<PublicUser> = searchResult.result;

			return users.map(user => {
				const uuid = uuidv4();
				return {
					userId: user.id,
					uuid: uuid,
					type: "mention",
					contextHtml: "<div class='blue-orange-mention-context' blue-orange-editor-mention-uuid=" + uuid + " blue-orange-user-id=" + user.id + ">@" + getDisplayName(user) + "</div>",
					inlineHtml: "<span class='blue-orange-editor-mention-context' blue-orange-editor-mention-uuid=" + uuid + " blue-orange-user-id=" + user.id + "contenteditable='false'>@" + getDisplayName(user) + "</span>"
				}
			})


		} catch (error) {
			console.error('Failed to fetch mention items:', error);
			return [];
		}
	}

	const findEmojiSkinToneGivenHtml = (htmlCode: string) => {
		var flat_unicode_emojis = UnicodeEmoji.getFlat();
		for (var i=0; i < flat_unicode_emojis.length; i++) {
			var emoji = flat_unicode_emojis[i];
			if (emoji.html.startsWith(htmlCode)) {
				return emoji.skin_tone;
			}
		}
		return false;
	}

	const getCookie = (name: string) => {
		const nameEQ = name + "=";
		const ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	const processEmojiObjects = (flatEmojis: any) => {
		// @ts-ignore
		var skinTone = getCookie("skinTone") == undefined || getCookie("skinTone") == null ? undefined : +getCookie("skinTone");
		var processedEmojis = []
		for (var i=0; i < flatEmojis.length; i++) {
			var emoji = flatEmojis[i];
			var html = getEmojiHtmlSkinTone(emoji, skinTone);
			var contextHtml = document.createElement("div");
			contextHtml.className = "blue-orange-editor-emoji-context-row";

			var emojiDisplay = document.createElement("div");
			emojiDisplay.className = "blue-orange-editor-emoji-context-row-emoji";
			emojiDisplay.innerHTML = html;
			contextHtml.appendChild(emojiDisplay);

			var textDisplay = document.createElement("div");
			textDisplay.className = "blue-orange-editor-emoji-context-row-emoji-text"
			textDisplay.innerText = ":" + emoji.uuid + ":"
			contextHtml.appendChild(textDisplay)

			processedEmojis.push({
				data: emoji,
				contextHtml: contextHtml.outerHTML,
				inlineHtml: html
			})
		}
		return processedEmojis;
	}

	const getEmojiHtmlSkinTone = (emoji: any, skin_tone: number | undefined) => {
		var skin_tones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]
		if (!emoji.skin_tone || skin_tone === undefined || skin_tone < 0 || skin_tones[skin_tone] == undefined) {
			return emoji.html;
		}
		var emojisSplit = emoji.html.split(";");
		if (emojisSplit.length < 2) {
			return emoji.html + "&#x" + skin_tones[skin_tone] + ";";
		}
		var processedEmojis = [];
		for (var i=0; i < emojisSplit.length; i++) {
			var tmpEmojiCode = emojisSplit[i];
			if (tmpEmojiCode != undefined) {
				processedEmojis.push(tmpEmojiCode);
				if (findEmojiSkinToneGivenHtml(tmpEmojiCode) && skin_tones[skin_tone] != undefined) {
					processedEmojis.push("&#x" + skin_tones[skin_tone])
				}
			}
		}
		return processedEmojis.join(";")
	}

	const fetchEmojiItems = (query: string) => {
		try {
			if (query == "") {
				return UnicodeEmoji.getFlat().slice(0, 15);
			}
			const flatEmojis = UnicodeEmoji.getFlat().filter(item => item.uuid.toLowerCase().indexOf(query.toLowerCase()) >= 0)
				.slice(0, 15);
			return flatEmojis

		} catch (error) {
			console.error('Failed to fetch mention items:', error);
			return [];
		}
	}

	const resolveComment = (commentId: string) => {
		blueOrangeEditorRef.current?.resolveComment(commentId);
		closeCommentWindow();
	}

	useImperativeHandle(ref, () => ({
		getEditor: () => blueOrangeEditorRef.current,
		toJson: () => blueOrangeEditorRef.current?.toJson() ?? null,
		toHtmlCopy: () => blueOrangeEditorRef.current?.toHtmlCopy() ?? null,
		reviveDocument: (doc: BlueOrangeDocument) => blueOrangeEditorRef.current?.reviveDocument(doc),
		clearDocument: () => blueOrangeEditorRef.current?.clearDocument(),
		toMarkdown: () => {
			const editor = blueOrangeEditorRef.current as MarkdownCapableEditor | null;
			return editor?.toMarkdown() ?? null;
		},
		fromMarkdown: (markdown: string) => {
			const editor = blueOrangeEditorRef.current as MarkdownCapableEditor | null;
			editor?.fromMarkdown(markdown);
		},
		undo: () => blueOrangeEditorRef.current?.undo(),
		redo: () => blueOrangeEditorRef.current?.redo(),
		diffDocuments: (otherDoc: BlueOrangeDocument, options?: DiffViewerOptions) =>
			blueOrangeEditorRef.current?.diffDocuments(otherDoc, options) ?? null,
		createBlock: (spec: BlockSpec) => blueOrangeEditorRef.current?.createBlock(spec),
		isTemplateMode: () => blueOrangeEditorRef.current?.isTemplateMode() ?? false,
		getTemplateVariables: () => blueOrangeEditorRef.current?.getTemplateVariables() ?? [],
		getTemplateLoops: () => blueOrangeEditorRef.current?.getTemplateLoops() ?? [],
		getTemplateSchema: () => blueOrangeEditorRef.current?.getTemplateSchema() ?? {},
		substituteTemplateData: (data: Record<string, unknown>) =>
			blueOrangeEditorRef.current?.substituteTemplateData(data),
		substituteVariables: (substitutions: Record<string, string>) =>
			blueOrangeEditorRef.current?.substituteVariables(substitutions),
		substituteLoops: (loopData: Record<string, Array<Record<string, string>>>) =>
			blueOrangeEditorRef.current?.substituteLoops(loopData),
		applyTemplateModeToBlocks: () => blueOrangeEditorRef.current?.applyTemplateModeToBlocks(),
		getDocumentMode: () => blueOrangeEditorRef.current?.getDocumentMode() ?? resolvedMode,
		setDocumentMode: (documentMode: BlueOrangeDocumentModeValue) =>
			blueOrangeEditorRef.current?.setDocumentMode(documentMode),
		setReadOnly: (value: boolean = true) => blueOrangeEditorRef.current?.setReadOnly(value),
		setCommentOnly: (value: boolean = true) => blueOrangeEditorRef.current?.setCommentOnly(value),
		isReadOnly: () => blueOrangeEditorRef.current?.isReadOnly() ?? false,
		isCommentOnly: () => blueOrangeEditorRef.current?.isCommentOnly() ?? false,
		canEdit: () => blueOrangeEditorRef.current?.canEdit() ?? false,
		canComment: () => blueOrangeEditorRef.current?.canComment() ?? false,
		effectiveBlockEditable: (state: BlueOrangeDocumentState) =>
			blueOrangeEditorRef.current?.effectiveBlockEditable(state) ?? false,
		applyDocumentMode: () => blueOrangeEditorRef.current?.applyDocumentMode(),
		documentBuilder: () => blueOrangeEditorRef.current?.documentBuilder() ?? null,
	}));

	useEffect(() => {
		const current = editorRef.current as HTMLElement;
		if (blueOrangeEditorRef.current == null) {
			const editorOptions: BlueOrangeEditorOptions = {
				...userOptions,
				comments: enableComments,
				template: template,
				mode: resolvedMode,
			};

			if (disableMediaServer) {
				editorOptions.mediaUri = undefined;
			} else if (mediaUri) {
				editorOptions.mediaUri = mediaUri;
			}

			if (fileUploadHandler) {
				editorOptions.fileUploadHandler = fileUploadHandler;
			}

			blueOrangeEditorRef.current = new BlockEditor(
				current,
				initialDocument,
				editorOptions);

			// Comment events
			if (enableComments) {
				current.addEventListener("blue-orange-editor-new-comment-added", (ev) => {
					// @ts-ignore
					const commentId = ev.detail.commentUuid;
					const state = {
						display: true,
						commentId: [commentId]
					}
					setCommentWindowState(state);
				})
				current.addEventListener("blue-orange-editor-comment-tooltip-clicked", (ev) => {
					// @ts-ignore
					const commentIds = ev.detail.commentIds;
					const state = {
						display: true,
						commentId: commentIds
					}
					setCommentWindowState(state);
				})
			}

			// Document mode changes — fired by setDocumentMode, including the calls
			// the wrapper makes itself when the `mode` prop changes.
			current.addEventListener("blue-orange-editor-mode-changed", (ev: any) => {
				onModeChangeRef.current?.(ev.detail.mode, ev.detail.previousMode);
			})

			// Reference events
			current.addEventListener("blue-orange-editor-new-reference-added", (ev: any) => {
				onReferenceAdded?.(ev.detail);
			})
			current.addEventListener("blue-orange-editor-reference-updated", (ev: any) => {
				onReferenceUpdated?.(ev.detail);
			})
			current.addEventListener("blue-orange-editor-reference-removed", (ev: any) => {
				onReferenceRemoved?.(ev.detail);
			})
			current.addEventListener("blue-orange-editor-reference-clicked", (ev: any) => {
				onReferenceClicked?.(ev.detail);
			})

			// Inline context (mentions & emoji)
			current.addEventListener("blueorangeeditorinlinecontextselectionevent", (ev: any) => {
				const selectedMention = ev.detail;
				try {
					if (selectedMention.type == "mention" && handleMentionAdded) {
						handleMentionAdded(selectedMention.uuid, selectedMention.userId)
					}
				} catch (e) {}
			})
			current.addEventListener("blueorangeeditorinlinecontextopen", (ev:any) => {
				if (ev.detail.listener.key == "@" && blueOrangeEditorRef.current && enableMentions) {
					fetchUsers("").then(users => {
						if (blueOrangeEditorRef.current) {
							blueOrangeEditorRef.current.updateInlineContext(users);
						}
					}).catch(reason => console.error(reason));
				} else if (ev.detail.listener.key == ":" && blueOrangeEditorRef.current) {
					blueOrangeEditorRef.current.updateInlineContext(processEmojiObjects(fetchEmojiItems("")))
				} else if (blueOrangeEditorRef.current) {
					blueOrangeEditorRef.current.closeInlineContextWindowToolbar();
				}
			})
			current.addEventListener("blueorangeeditorinlinecontextupdateevent", (ev:any) => {
				if (ev.detail.listener.key == "@" && enableMentions) {
					var query = ev.detail.filter;
					fetchUsers(query).then(users => {
						if (blueOrangeEditorRef.current) {
							blueOrangeEditorRef.current.updateInlineContext(users);
						}
					}).catch(reason => console.error(reason));
				} else if (ev.detail.listener.key == ":" && blueOrangeEditorRef.current) {
					blueOrangeEditorRef.current.updateInlineContext(processEmojiObjects(fetchEmojiItems(ev.detail.filter)))
				} else if (blueOrangeEditorRef.current) {
					blueOrangeEditorRef.current.closeInlineContextWindowToolbar();
				}
			})

			// Data change event
			current.addEventListener("datachange", () => {
				if (onChange && blueOrangeEditorRef.current) {
					onChange(blueOrangeEditorRef.current.toJson());
				}
			})
		}
	}, []);

	// Keep the live editor in step with the mode props. setDocumentMode is a
	// no-op when the mode has not actually changed, but guarding here keeps the
	// re-apply (and the mode-changed event) off every unrelated render.
	useEffect(() => {
		const editor = blueOrangeEditorRef.current;
		if (editor != null && editor.getDocumentMode() !== resolvedMode) {
			editor.setDocumentMode(resolvedMode);
		}
	}, [resolvedMode]);


	return (
		<>
			<div ref={editorRef} className="blue-orange-block-editor-parent"></div>
			{enableComments && commentWindowState.display &&
				<Drawer position={DrawerPosition.RIGHT} width={"450px"} onClose={closeCommentWindow}>
					<DrawerHeader label={"Comments"} onClose={closeCommentWindow}></DrawerHeader>
					{commentWindowState.commentId.length > 1 &&
						<Tabs activeTab={activeCommentPos.toString()} onClick={uuid => setActiveCommentPos(+uuid)}>
							{commentWindowState.commentId.map((commentId, index) => (
								<Tab uuid={index.valueOf().toString()} name={"Group " + (index + 1).valueOf()}></Tab>
							))}
						</Tabs>
					}
					<div className="blue-orange-block-editor-comment-target">
						<RenderHtml html={cloneCommentElement(commentWindowState.commentId[activeCommentPos])}></RenderHtml>
					</div>
					<DrawerBody>
						<div className="blue-orange-block-editor-full-page-comments-cont">
							<FullPageComments topic={commentWindowState.commentId[activeCommentPos]}></FullPageComments>
						</div>
					</DrawerBody>
				</Drawer>
			}
		</>
	)
})