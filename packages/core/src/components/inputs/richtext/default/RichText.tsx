import React, {useEffect, useRef, useState} from "react";

import {StarterKit} from "@tiptap/starter-kit";
import {AnyExtension, EditorContent, Extensions, useEditor} from "@tiptap/react";
import {ButtonIcon} from "../../../buttons/button-icon/ButtonIcon";
import { v4 as uuidv4 } from 'uuid';

import './RichText.css';
import {Placeholder} from "@tiptap/extension-placeholder";
import {Link} from "@tiptap/extension-link";
import {fetchMentionItems, renderSuggestions} from "../suggestion/Suggestion";
import {fetchEmojiItems, renderEmojiSuggestions} from "../suggestion/EmojiSuggestions";
import {EmojiMention} from "../extensions/EmojiMention";
import {EmojiObj} from "../../emoji/data/UnicodeEmoji";
import Cookies from "js-cookie";
import {EmojiWrapper} from "../../emoji/emoji-wrapper/EmojiWrapper";
import {FileInputWrapper} from "../../file-input-wrapper/FileInputWrapper";
import {RichTextEditorUploadedFile, UploadedFile} from "../uploaded-file/UploadedFile";
import {Media} from "@Blue-Orange-Ai/foundations-clients";
import {MediaPermission} from "@Blue-Orange-Ai/foundations-clients";
import {GroupPermission} from "@Blue-Orange-Ai/foundations-clients";
import CustomMention from "../mention-extension/MentionExtension";

export interface MentionItem {
	label: string,
	icon: boolean,
	image: boolean,
	src: string,
	userId: string
}

interface Props {
	content?: string,
	files?: Array<Media>
	placeholder?: string,
	displayFormatting?: boolean,
	editorHeight?: number,
	minEditorHeight?: number,
	allowMentions?: boolean,
	allowEmojis?: boolean,
	uploadPermissions?: Array<MediaPermission>,
	onChange?: (content: string, mentions: Array<string>, attachments: Array<Media>, filesUploading: boolean) => void
}

const defaultUploadPermission: MediaPermission[] = [{
	groupName: "everyone",
	permission: GroupPermission.READ
}]

export const RichText: React.FC<Props> = ({
											  content,
											  files=[],
											  placeholder,
											  displayFormatting= true,
											  minEditorHeight = 10,
											  allowMentions=true,
											  allowEmojis=true,
											  uploadPermissions=defaultUploadPermission,
											  onChange
										  }) => {


	const initialiseFiles = (): RichTextEditorUploadedFile[] => {
		var formattedFiles: RichTextEditorUploadedFile[] = []
		for (var i=0; i < files.length; i++) {
			formattedFiles.push({
				uuid: uuidv4(),
				uploaded: true,
				media: files[i]
			})
		}
		return formattedFiles
	}

	const generateMentions = (html: string | undefined) => {
		if (html == undefined) {
			return [];
		}
		const tempMentionsEl = document.createElement("div");
		tempMentionsEl.innerHTML = html;
		const mentionElements = tempMentionsEl.querySelectorAll('[data-type="mention"]');
		var mentions: string[] = []
		mentionElements.forEach((element) => {
			mentions.push(element.getAttribute("data-user-id") as string)
		});
		return mentions;
	}

	const [displayHeading, setDisplayHeading] = useState(displayFormatting);

	const [query, setQuery] = useState('');

	const [mentionItems, setMentionItems] = useState<Array<MentionItem>>([]);

	const [emojiItems, setEmojiItems] = useState<Array<EmojiObj>>([]);

	const [storedFiles, setStoredFiles] = useState<Array<RichTextEditorUploadedFile>>(initialiseFiles());

	const storedFilesRef = useRef<Array<RichTextEditorUploadedFile>>(initialiseFiles());

	const [mentions, setMentions] = useState<Array<string>>(generateMentions(content));

	const editorContainerRef = useRef<HTMLDivElement>(null);

	const editorRef = useRef<any>(null);

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


	// @ts-ignore
	const mentionExtension = CustomMention.configure({
		HTMLAttributes: {
			class: 'mention',
		},
		suggestion: {
			char: '@',
			startOfLine: false,
			command: ({ editor, range, props }: any) => {
				editor
					.chain()
					.focus()
					.insertContentAt(range, [
						{
							type: 'mention',
							attrs: props
						},
						{ type: 'text', text: ' ' },
					])
					.run();
				editorChanged();
			},
			items: ({ query }: any) => {
				setQuery(query);
				return mentionItems;
			},
			render: () => renderSuggestions({ query }, fetchMentionItems),
		},
	});

	const emojiExtension = EmojiMention.configure({
		HTMLAttributes: {
			class: 'emojis',
		},
		suggestion: {
			char: ':',
			startOfLine: false,
			command: ({ editor, range, props }: any) => {
				const textEmoji = new DOMParser().parseFromString(getEmojiHtml(props), 'text/html').body.textContent;
				editor
					.chain()
					.focus()
					.insertContentAt(range, textEmoji)
					.run();
				editorChanged();
			},
			items: ({ query }: any) => {
				setQuery(query);
				return emojiItems;
			},
			render: () => renderEmojiSuggestions({ query }, fetchEmojiItems),
		},
	})

	var extensions = [
		StarterKit,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		}),
		mentionExtension,
		emojiExtension
	]

	const extensionsNoMentions = [
		StarterKit,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		}),
		emojiExtension
	]

	const extensionsNoEmojis = [
		StarterKit,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		}),
		mentionExtension
	]

	const extensionsNoMentionsNoEmojis: AnyExtension[] = [
		StarterKit,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		})
	]

	const initExtensions = () => {
		if (allowMentions === false && allowEmojis == false) {
			return extensionsNoMentionsNoEmojis;
		} else if (allowMentions === false) {
			return extensionsNoMentions;
		} else if (allowEmojis == false) {
			return extensionsNoEmojis;
		}
		return extensions;
	}

	extensions = initExtensions();

	const editor = useEditor({
		extensions,
		content,
	})

	editorRef.current = editor;

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

	const generateStoredFileAttachments = () => {
		var savedMedia: Array<Media> = []
		storedFilesRef.current.forEach(item => {
			if (item.media) {
				savedMedia.push(item.media);
			}
		})
		return savedMedia;
	}

	const areFilesUploading = () => {
		var savedMedia: Array<Media> = []
		storedFiles.forEach(item => {
			if (item.uploaded == false) {
				return true;
			}
		})
		return false;
	}

	const editorChanged = () => {
		if (editorRef.current && onChange) {
			var content = editorRef.current.getHTML();
			var mentions = generateMentions(content);
			onChange(
				content,
				mentions,
				generateStoredFileAttachments(),
				areFilesUploading())
		}

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
		if (editorContainerRef.current) {
			editorContainerRef.current.addEventListener("keyup", () => {
				editorChanged();
			})
		}
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

	const fileSelected = (file: File) => {
		var newFile = {
			uuid: uuidv4(),
			uploaded: false,
			media: undefined,
			file: file
		}
		storedFilesRef.current = [...storedFiles, newFile];
		setStoredFiles([...storedFiles, newFile]);
	}

	const removeStoredFile =(upload: RichTextEditorUploadedFile) => {
		storedFilesRef.current = storedFiles.filter(obj => obj.uuid !== upload.uuid);
		setStoredFiles(storedFiles.filter(obj => obj.uuid !== upload.uuid));
		editorChanged();
	}

	return (
		<div className='blue-orange-rich-text-editor'>
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
			<div className="blue-orange-rich-text-editor-uploaded-files">
				{storedFiles.map((item, index) => (
					<UploadedFile
						key={item.uuid}
						upload={item}
						uploadPermissions={uploadPermissions}
						onRemove={removeStoredFile}
						onMediaUploaded={(media: Media) => {
							item.media = media;
							editorChanged();
						}}
					></UploadedFile>
				))}
			</div>
			<div className="blue-orange-rich-text-editor-heading-footer">
				<div className="blue-orange-rich-text-editor-heading-footer-left-cont">
					<FileInputWrapper accept={"*/*"} onFileSelect={fileSelected}>
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