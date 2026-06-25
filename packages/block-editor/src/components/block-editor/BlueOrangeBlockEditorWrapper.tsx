import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";

import '../../../../../node_modules/codemirror/lib/codemirror.css'
import '../../../../../node_modules/plyr/dist/plyr.css'

import './BlueOrangeBlockEditorWrapper.css'

import '@blue-orange-ai/primitives-block-editor/dist/css/primitives-block-editor.min.css'

import {
	BlockEditor,
	BlueOrangeDocument,
	BlueOrangeDocumentOptions,
	DiffEngine,
	DiffViewer,
	DiffViewerOptions,
	openReferenceModal
} from "@blue-orange-ai/primitives-block-editor";
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

/**
 * Detail payloads surfaced by the editor's reference events. The shape mirrors
 * the `detail` of the underlying primitives CustomEvents.
 */
export interface ReferenceEventDetail {
	referenceUuid?: string,
	referenceNumber?: number,
	referenceLink?: string,
	referenceDescription?: string,
	[key: string]: any
}

/**
 * Imperative API exposed via a ref. Lets a parent component drive the editor:
 * read/replace content, undo/redo, manage references and collaboration cursors,
 * and open a diff viewer. All methods are no-ops (returning undefined) until the
 * editor has mounted.
 */
export interface BlueOrangeBlockEditorHandle {
	/** The underlying primitives editor instance, or null before mount. */
	getEditor: () => BlockEditor | null,

	// --- Content I/O ---
	/** Serialised live document (may share references with editor internals). */
	toJson: () => BlueOrangeDocument | undefined,
	/** Deep-copied serialised document, safe to persist/mutate. */
	toJsonCopy: () => BlueOrangeDocument | undefined,
	/** Current document rendered as an HTML string. */
	toHtmlCopy: () => string | undefined,
	/** Replace the editor's content with the supplied document. */
	reviveDocument: (doc: BlueOrangeDocument) => void,
	/** Remove all content from the editor. */
	clearDocument: () => void,

	// --- History ---
	undo: () => void,
	redo: () => void,

	// --- References / citations ---
	addReferenceSuperscript: (referenceUuid: string, referenceNumber: number, referenceLink?: string, referenceDescription?: string) => void,
	getNextReferenceNumber: () => number | undefined,
	showReferenceNumberEditor: (referenceUuid: string, currentNumber: number) => void,
	updateReferenceNumber: (referenceUuid: string, newNumber: number) => void,
	/** Open the built-in reference editing modal for the given reference. */
	openReferenceModal: (referenceUuid: string, currentNumber: number) => HTMLElement | undefined,

	// --- Collaboration ---
	updateCollaborationCursor: (reference: string, color: string, userId: string, pos: number) => void,
	removeCollaborationCursors: () => void,
	removeCollaborationCursor: (userId: string) => void,

	// --- Comments ---
	resolveComment: (commentId: string) => void,

	// --- Inline context (mentions / emoji) ---
	updateInlineContext: (options: Array<any>) => void,
	closeInlineContextWindowToolbar: () => void,

	// --- Diff viewer ---
	/**
	 * Open a side-by-side diff between `otherDoc` (treated as the original) and
	 * the current editor state (treated as the modified version). Returns the
	 * DiffViewer instance so callers can drive accept/reject/close, or undefined
	 * if the editor is not mounted.
	 */
	showDiff: (otherDoc: BlueOrangeDocument, options?: DiffViewerOptions) => DiffViewer | undefined,
}

interface Props {
	/**
	 * Optional document identifier. When provided and `options.reference` is not
	 * set, it is forwarded as the document reference so save/collaboration events
	 * carry a meaningful docId.
	 */
	documentId?: string,
	/** Initial document to seed the editor with. */
	doc?: BlueOrangeDocument,
	/** Editor configuration (plugins, toolbar, collaboration, listeners, ...). */
	options?: BlueOrangeDocumentOptions,
	handleMentionAdded?: (mentionId: string, userId: string) => void,
	/** Fired whenever the document content changes (debounced by the editor). */
	onChange?: (doc: BlueOrangeDocument) => void,
	/** Fired when the editor requests a save; receives the serialised document. */
	onSave?: (doc: BlueOrangeDocument, docId?: string) => void,
	/** Fired on inline text changes; receives the raw CustomEvent. */
	onTextChange?: (event: CustomEvent) => void,
	/** Fired when the caret/cursor position changes. */
	onCursorChange?: (event: CustomEvent) => void,
	/** Fired once the editor has finished loading its initial document. */
	onLoadingFinished?: (event: CustomEvent) => void,
	/** Fired when a new reference/citation is added. */
	onReferenceAdded?: (detail: ReferenceEventDetail) => void,
	/** Fired when an existing reference superscript is clicked. */
	onReferenceClicked?: (detail: ReferenceEventDetail) => void,
	/** Fired when a reference is removed. */
	onReferenceRemoved?: (detail: ReferenceEventDetail) => void,
	/** Fired when a reference's number/metadata is updated. */
	onReferenceUpdated?: (detail: ReferenceEventDetail) => void,
	/** Fired for collaboration lifecycle/state events. */
	onCollaborate?: (detail: any) => void,
	/** Fired when the block metadata panel is opened. */
	onOpenMetadata?: (detail: any) => void,
}

export const BlueOrangeBlockEditorWrapper = forwardRef<BlueOrangeBlockEditorHandle, Props>((props, ref) => {

	const editorRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeEditorRef = useRef<BlockEditor | null>(null);

	// Holds the latest props so the once-created event handlers always invoke
	// the current callbacks instead of the ones captured at mount.
	const propsRef = useRef(props);
	propsRef.current = props;

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

	useEffect(() => {
		const current = editorRef.current as HTMLElement;
		if (current == null || blueOrangeEditorRef.current != null) {
			return;
		}

		// Forward documentId as the document reference when not otherwise set, so
		// save/collaboration events carry a meaningful docId.
		const editorOptions: BlueOrangeDocumentOptions = {...(propsRef.current.options || {})};
		if (propsRef.current.documentId && editorOptions.reference == undefined) {
			editorOptions.reference = propsRef.current.documentId;
		}

		const editor = new BlockEditor(current, propsRef.current.doc, editorOptions);
		blueOrangeEditorRef.current = editor;

		// --- Comments ---
		const onNewComment = (ev: Event) => {
			const commentId = (ev as CustomEvent).detail.commentUuid;
			setCommentWindowState({display: true, commentId: [commentId]});
		};
		const onCommentTooltipClicked = (ev: Event) => {
			const commentIds = (ev as CustomEvent).detail.commentIds;
			setCommentWindowState({display: true, commentId: commentIds});
		};

		// --- Inline context (mentions / emoji) ---
		const onInlineContextSelection = (ev: Event) => {
			const selectedMention = (ev as CustomEvent).detail;
			try {
				if (selectedMention.type == "mention" && propsRef.current.handleMentionAdded) {
					propsRef.current.handleMentionAdded(selectedMention.uuid, selectedMention.userId)
				}
			} catch (e) {}
		};
		const onInlineContextOpen = (ev: Event) => {
			const detail = (ev as CustomEvent).detail;
			if (detail.listener.key == "@" && blueOrangeEditorRef.current) {
				fetchUsers("").then(users => {
					blueOrangeEditorRef.current?.updateInlineContext(users);
				}).catch(reason => console.error(reason));
			} else if (detail.listener.key == ":" && blueOrangeEditorRef.current) {
				blueOrangeEditorRef.current.updateInlineContext(processEmojiObjects(fetchEmojiItems("")))
			} else if (blueOrangeEditorRef.current) {
				blueOrangeEditorRef.current.closeInlineContextWindowToolbar();
			}
		};
		const onInlineContextUpdate = (ev: Event) => {
			const detail = (ev as CustomEvent).detail;
			if (detail.listener.key == "@") {
				fetchUsers(detail.filter).then(users => {
					blueOrangeEditorRef.current?.updateInlineContext(users);
				}).catch(reason => console.error(reason));
			} else if (detail.listener.key == ":" && blueOrangeEditorRef.current) {
				blueOrangeEditorRef.current.updateInlineContext(processEmojiObjects(fetchEmojiItems(detail.filter)))
			} else if (blueOrangeEditorRef.current) {
				blueOrangeEditorRef.current.closeInlineContextWindowToolbar();
			}
		};

		// --- Content change / save / lifecycle ---
		const onDataChange = () => {
			if (propsRef.current.onChange && blueOrangeEditorRef.current) {
				propsRef.current.onChange(blueOrangeEditorRef.current.toJsonCopy());
			}
		};
		const onSave = (ev: Event) => {
			const detail = (ev as CustomEvent).detail;
			propsRef.current.onSave?.(detail?.document, detail?.docId);
		};
		const onTextChange = (ev: Event) => propsRef.current.onTextChange?.(ev as CustomEvent);
		const onCursorChange = (ev: Event) => propsRef.current.onCursorChange?.(ev as CustomEvent);
		const onLoadingFinished = (ev: Event) => propsRef.current.onLoadingFinished?.(ev as CustomEvent);
		const onOpenMetadata = (ev: Event) => propsRef.current.onOpenMetadata?.((ev as CustomEvent).detail);

		// --- References / citations ---
		const onReferenceAdded = (ev: Event) => propsRef.current.onReferenceAdded?.((ev as CustomEvent).detail);
		const onReferenceClicked = (ev: Event) => propsRef.current.onReferenceClicked?.((ev as CustomEvent).detail);
		const onReferenceRemoved = (ev: Event) => propsRef.current.onReferenceRemoved?.((ev as CustomEvent).detail);
		const onReferenceUpdated = (ev: Event) => propsRef.current.onReferenceUpdated?.((ev as CustomEvent).detail);

		// --- Collaboration ---
		const onCollaborate = (ev: Event) => propsRef.current.onCollaborate?.((ev as CustomEvent).detail);

		// Events dispatched on the container (or its parent) are caught at the
		// target/bubble phase; content-change events are dispatched on inner
		// elements without bubbling, so we register every listener in the capture
		// phase, which observes events on descendants regardless of `bubbles`.
		const listeners: Array<[string, EventListener]> = [
			["blue-orange-editor-new-comment-added", onNewComment as EventListener],
			["blue-orange-editor-comment-tooltip-clicked", onCommentTooltipClicked as EventListener],
			["blueorangeeditorinlinecontextselectionevent", onInlineContextSelection as EventListener],
			["blueorangeeditorinlinecontextopen", onInlineContextOpen as EventListener],
			["blueorangeeditorinlinecontextupdateevent", onInlineContextUpdate as EventListener],
			["datachange", onDataChange as EventListener],
			["blueorangeeditorsave", onSave as EventListener],
			["textchange", onTextChange as EventListener],
			["cursorchange", onCursorChange as EventListener],
			["loadingfinished", onLoadingFinished as EventListener],
			["blueorangeeditoropenmetadata", onOpenMetadata as EventListener],
			["blue-orange-editor-new-reference-added", onReferenceAdded as EventListener],
			["blue-orange-editor-reference-clicked", onReferenceClicked as EventListener],
			["blue-orange-editor-reference-removed", onReferenceRemoved as EventListener],
			["blue-orange-editor-reference-updated", onReferenceUpdated as EventListener],
			["blueorangeeditorcollaborate", onCollaborate as EventListener],
		];

		listeners.forEach(([name, handler]) => current.addEventListener(name, handler, true));

		return () => {
			listeners.forEach(([name, handler]) => current.removeEventListener(name, handler, true));
			try {
				blueOrangeEditorRef.current?.destroy();
			} catch (e) {
				console.error("Failed to destroy block editor:", e);
			}
			blueOrangeEditorRef.current = null;
		};
	}, []);

	useImperativeHandle(ref, (): BlueOrangeBlockEditorHandle => ({
		getEditor: () => blueOrangeEditorRef.current,

		toJson: () => blueOrangeEditorRef.current?.toJson(),
		toJsonCopy: () => blueOrangeEditorRef.current?.toJsonCopy(),
		toHtmlCopy: () => blueOrangeEditorRef.current?.toHtmlCopy(),
		reviveDocument: (doc) => blueOrangeEditorRef.current?.reviveDocument(doc),
		clearDocument: () => blueOrangeEditorRef.current?.clearDocument(),

		undo: () => blueOrangeEditorRef.current?.undo(),
		redo: () => blueOrangeEditorRef.current?.redo(),

		addReferenceSuperscript: (referenceUuid, referenceNumber, referenceLink, referenceDescription) =>
			blueOrangeEditorRef.current?.addReferenceSuperscript(referenceUuid, referenceNumber, referenceLink, referenceDescription),
		getNextReferenceNumber: () => blueOrangeEditorRef.current?.getNextReferenceNumber(),
		showReferenceNumberEditor: (referenceUuid, currentNumber) =>
			blueOrangeEditorRef.current?.showReferenceNumberEditor(referenceUuid, currentNumber),
		updateReferenceNumber: (referenceUuid, newNumber) =>
			blueOrangeEditorRef.current?.updateReferenceNumber(referenceUuid, newNumber),
		openReferenceModal: (referenceUuid, currentNumber) =>
			blueOrangeEditorRef.current ? openReferenceModal(blueOrangeEditorRef.current, referenceUuid, currentNumber) : undefined,

		updateCollaborationCursor: (reference, color, userId, pos) =>
			blueOrangeEditorRef.current?.updateCollaborationCursor(reference, color, userId, pos),
		removeCollaborationCursors: () => blueOrangeEditorRef.current?.removeCollaborationCursors(),
		removeCollaborationCursor: (userId) => blueOrangeEditorRef.current?.removeCollaborationCursor(userId),

		resolveComment: (commentId) => resolveComment(commentId),

		updateInlineContext: (options) => blueOrangeEditorRef.current?.updateInlineContext(options),
		closeInlineContextWindowToolbar: () => blueOrangeEditorRef.current?.closeInlineContextWindowToolbar(),

		showDiff: (otherDoc, options) => {
			const editor = blueOrangeEditorRef.current;
			if (editor == null) {
				return undefined;
			}
			const currentDoc = editor.toJson();
			const engine = new DiffEngine();
			const entries = engine.diff(otherDoc, currentDoc);
			return new DiffViewer(editor, entries, otherDoc, currentDoc, options || {});
		},
	}), []);


	return (
		<>
			<div ref={editorRef} className="blue-orange-block-editor-parent"></div>
			{commentWindowState.display &&
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

BlueOrangeBlockEditorWrapper.displayName = "BlueOrangeBlockEditorWrapper";
