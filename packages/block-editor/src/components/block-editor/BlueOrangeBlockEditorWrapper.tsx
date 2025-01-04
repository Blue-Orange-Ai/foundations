import React, {useEffect, useRef, useState} from "react";

import '../../../../../node_modules/codemirror/lib/codemirror.css'
import '../../../../../node_modules/plyr/dist/plyr.css'

import './BlueOrangeBlockEditorWrapper.css'

import '@blue-orange-ai/primitives-block-editor/dist/css/primitives-block-editor.min.css'

import {BlockEditor} from "@blue-orange-ai/primitives-block-editor";
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
import {User, UserSearchResult} from "@blue-orange-ai/foundations-clients";
import passport from "./config/BlueOrangePassportConfig";
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

interface Props {
	documentId: string,
	handleMentionAdded?: (mentionId: string, userId: string) => void
}
export const BlueOrangeBlockEditorWrapper: React.FC<Props> = ({documentId, handleMentionAdded}) => {

	const editorRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeEditorRef = useRef<BlockEditor | null>(null);

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

	const getDisplayName = (user: User) => {
		if (user.name == undefined || user.name == "") {
			return user.username;
		} else {
			return user.name;
		}
	}

	const fetchUsers = async (query: string): Promise<EditorMention[]> => {
		try {
			var searchResult: UserSearchResult = await passport.searchUsers(
				{
					query: query,
					page: 0,
					size: 10
				});
			var users = searchResult.result;

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
		if (blueOrangeEditorRef.current == null) {
			blueOrangeEditorRef.current = new BlockEditor(
				current);
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
			current.addEventListener("blueorangeeditorinlinecontextselectionevent", (ev: any) => {
				const selectedMention = ev.detail;
				try {
					if (selectedMention.type == "mention" && handleMentionAdded) {
						handleMentionAdded(selectedMention.uuid, selectedMention.userId)
					}
				} catch (e) {}
			})
			current.addEventListener("blueorangeeditorinlinecontextopen", (ev:any) => {
				if (ev.detail.listener.key == "@" && blueOrangeEditorRef.current) {
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
				if (ev.detail.listener.key == "@") {
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
		}
	}, []);


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
}