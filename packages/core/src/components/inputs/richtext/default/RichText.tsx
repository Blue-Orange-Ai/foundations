import React, {useEffect, useRef, useState} from "react";

import {StarterKit} from "@tiptap/starter-kit";
import {EditorContent, useEditor} from "@tiptap/react";
import {ButtonIcon} from "../../../buttons/button-icon/ButtonIcon";

import './RichText.css';
import {Placeholder} from "@tiptap/extension-placeholder";
import Mention from '@tiptap/extension-mention';
import {Link} from "@tiptap/extension-link";
import {fetchMentionItems, renderSuggestions} from "../suggestion/Suggestion";
import {fetchEmojiItems, renderEmojiSuggestions} from "../suggestion/EmojiSuggestions";
import {EmojiMention} from "../extensions/EmojiMention";
import {EmojiObj} from "../../emoji/data/UnicodeEmoji";
import Cookies from "js-cookie";
import {EmojiWrapper} from "../../emoji/emoji-wrapper/EmojiWrapper";
import {FileInputWrapper} from "../../file-input-wrapper/FileInputWrapper";

export interface MentionItem {
	label: string,
	icon: boolean,
	image: boolean,
	src: string
}

interface Props {
	content?: string,
	placeholder?: string,
	displayFormatting?: boolean,
	editorHeight?: number,
	minEditorHeight?: number
}

export const RichText: React.FC<Props> = ({
											  content,
											  placeholder,
											  displayFormatting= true,
											  minEditorHeight = 10}) => {


	const [displayHeading, setDisplayHeading] = useState(displayFormatting);

	const [query, setQuery] = useState('');

	const [mentionItems, setMentionItems] = useState<Array<MentionItem>>([]);

	const [emojiItems, setEmojiItems] = useState<Array<EmojiObj>>([]);

	const editorContainerRef = useRef<HTMLDivElement>(null);

	const initRef = useRef(false);

	const getEmojiHtml = (emoji: EmojiObj) => {
		const skin_tone = Cookies.get("skinTone")
		var skin_tones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]
		if (!emoji.skin_tone || skin_tone === undefined || +skin_tone == 0) {
			return emoji.html;
		}
		var emojisSplit: string[] = emoji.html.split(";");
		if (emojisSplit.length < 2) {
			return emoji.html + "&#x" + skin_tones[+skin_tone - 1] + ";";
		}
		emojisSplit.splice(1, 0, "&#x" + skin_tones[+skin_tone - 1]);
		return emojisSplit.join(";")
	}

	const extensions = [
		StarterKit,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		}),
		Mention.configure({
			HTMLAttributes: {
				class: 'mention',
			},
			suggestion: {
				char: '@',
				startOfLine: false,
				command: ({ editor, range, props }) => {
					editor
						.chain()
						.focus()
						.insertContentAt(range, [
							{
								type: 'mention',
								attrs: props,
							},
							{ type: 'text', text: ' ' },
						])
						.run();
				},
				items: ({ query }) => {
					setQuery(query);
					return mentionItems;
				},
				render: () => renderSuggestions({ query }, fetchMentionItems),
			},
		}),
		EmojiMention.configure({
			HTMLAttributes: {
				class: 'emojis',
			},
			suggestion: {
				char: ':',
				startOfLine: false,
				command: ({ editor, range, props }) => {
					const textEmoji = new DOMParser().parseFromString(getEmojiHtml(props), 'text/html').body.textContent;
					editor
						.chain()
						.focus()
						.insertContentAt(range, textEmoji)
						.run();
				},
				items: ({ query }) => {
					setQuery(query);
					return emojiItems;
				},
				render: () => renderEmojiSuggestions({ query }, fetchEmojiItems),
			},
		})
	]

	const editor = useEditor({
		extensions,
		content,
	})

	const defaultIconStyle: React.CSSProperties = {
		height: "30px",
		width: "30px",
		borderRadius: "4px",
		border: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}

	const editorStyle: React.CSSProperties = {
		minHeight: "500px",
		width: "100%"
	}

	const toggleHeading = () => {
		setDisplayHeading(!displayHeading);
	}

	const initialise = () => {
		const intervalId = setInterval(() => {
			if (editorContainerRef.current) {
				const childElements = editorContainerRef.current.querySelectorAll('.tiptap');
				if (childElements.length > 0) {
					var tiptapEl: HTMLElement = childElements[0] as HTMLElement;
					tiptapEl.style.minHeight = minEditorHeight + "px";
					clearInterval(intervalId);
				}
			}
		}, 10);
	}

	useEffect(() => {
		if (!initRef.current) {
			initRef.current = true
			initialise();
		}
	}, []);

	const emojiSelection = (emoji: string) => {
		if (editor) {
			const textEmoji = new DOMParser().parseFromString(emoji, 'text/html').body.textContent;
			editor
				.chain()
				.focus()
				.insertContent(textEmoji)
				.run();
		}
	}

	const insertMentionStart = () => {
		if (editor) {
			editor
				.chain()
				.focus()
				.insertContent("@")
				.run();
		}
	}

	return (
		<div ref={editorContainerRef} className='blue-orange-rich-text-editor'>
			{displayHeading &&
				<div className="blue-orange-rich-text-editor-heading">
					<ButtonIcon
						icon={"ri-bold"}
						style={defaultIconStyle}
						onClick={() => editor?.chain().focus().toggleBold().run()}
						className={editor?.isActive('bold') ? 'blue-orange-rich-text-editor-heading-is-active' : ''}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-italic"}
						style={defaultIconStyle}
						onClick={() => editor?.chain().focus().toggleItalic().run()}
						className={editor?.isActive('italic') ? 'blue-orange-rich-text-editor-heading-is-active' : ''}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-strikethrough"}
						style={defaultIconStyle}
						onClick={() => editor?.chain().focus().toggleStrike().run()}
						className={editor?.isActive('strike') ? 'blue-orange-rich-text-editor-heading-is-active' : ''}
					></ButtonIcon>
					<div style={defaultIconStyle}>
						<div className="blue-orange-rich-text-editor-vertical-line-sep"></div>
					</div>
					<ButtonIcon
						icon={"ri-list-unordered"}
						style={defaultIconStyle}
						onClick={() => editor?.chain().focus().toggleBulletList().run()}
						className={editor?.isActive('bulletList') ? 'blue-orange-rich-text-editor-heading-is-active' : ''}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-list-ordered"}
						style={defaultIconStyle}
						onClick={() => editor?.chain().focus().toggleOrderedList().run()}
						className={editor?.isActive('orderedList') ? 'blue-orange-rich-text-editor-heading-is-active' : ''}
					></ButtonIcon>
					<div style={defaultIconStyle}>
						<div className="blue-orange-rich-text-editor-vertical-line-sep"></div>
					</div>
					<ButtonIcon
						icon={"ri-quote-text"}
						style={defaultIconStyle}
						onClick={() => editor?.chain().focus().toggleBlockquote().run()}
						className={editor?.isActive('blockquote') ? 'blue-orange-rich-text-editor-heading-is-active' : ''}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-code-view"}
						style={defaultIconStyle}
						onClick={() => editor?.chain().focus().toggleCode().run()}
						className={editor?.isActive('code') ? 'blue-orange-rich-text-editor-heading-is-active' : ''}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-code-block"}
						style={defaultIconStyle}
						onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
						className={editor?.isActive('codeBlock') ? 'blue-orange-rich-text-editor-heading-is-active' : ''}
					></ButtonIcon>
				</div>
			}
			<div ref={editorContainerRef}>
				<EditorContent editor={editor}></EditorContent>
			</div>
			<div className="blue-orange-rich-text-editor-heading-footer">
				<div className="blue-orange-rich-text-editor-heading-footer-left-cont">
					<FileInputWrapper accept={"*/*"}>
						<ButtonIcon
							icon={"ri-add-line"}
							style={defaultIconStyle}
							label={"Add files"}
						></ButtonIcon>
					</FileInputWrapper>
					<div style={defaultIconStyle}>
						<div className="blue-orange-rich-text-editor-vertical-line-sep"></div>
					</div>
					<ButtonIcon
						icon={"ri-font-size"}
						style={defaultIconStyle}
						onClick={toggleHeading}
						label={"Toggle formatting"}
					></ButtonIcon>
					<EmojiWrapper onSelection={emojiSelection}>
						<ButtonIcon
							icon={"ri-emotion-happy-line"}
							style={defaultIconStyle}
							label={"Emoji"}
						></ButtonIcon>
					</EmojiWrapper>
					<ButtonIcon
						icon={"ri-at-line"}
						style={defaultIconStyle}
						onClick={insertMentionStart}
						label={"Mention someone"}
					></ButtonIcon>
				</div>

			</div>
		</div>
	);
};