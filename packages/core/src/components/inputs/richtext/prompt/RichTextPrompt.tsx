import React, {useEffect, useRef, useState} from "react";

import {StarterKit} from "@tiptap/starter-kit";
import {AnyExtension, EditorContent, useEditor} from "@tiptap/react";
import {ButtonIcon} from "../../../buttons/button-icon/ButtonIcon";
import { v4 as uuidv4 } from 'uuid';

import './RichTextPrompt.css';
import {Placeholder} from "@tiptap/extension-placeholder";
import {SafeLink} from "../extensions/SafeLink";
import {fetchMentionItems, renderSuggestions} from "../suggestion/Suggestion";
import {fetchEmojiItems, renderEmojiSuggestions} from "../suggestion/EmojiSuggestions";
import {EmojiMention} from "../extensions/EmojiMention";
import {EmojiObj} from "../../emoji/data/UnicodeEmoji";
import Cookies from "js-cookie";
import {FileInputWrapper} from "../../file-input-wrapper/FileInputWrapper";
import {RichTextEditorUploadedFile, UploadedFile} from "../uploaded-file/UploadedFile";
import {Media, MediaPermission, GroupPermission} from "@blue-orange-ai/foundations-clients";
import CustomMention from "../mention-extension/MentionExtension";
import {RichTextContent, RichTextDocument, richTextMentions, toEditorContent} from "../document/RichTextDocument";

export interface MentionItem {
	label: string,
	icon: boolean,
	image: boolean,
	src: string,
	userId: string
}

interface Props {
	/**
	 * A document (what onChange hands back as `document`), a serialized
	 * document, or HTML written by an earlier version of the editor.
	 */
	content?: RichTextContent,
	focus?: boolean,
	files?: Array<Media>
	placeholder?: string,
	allowMentions?: boolean,
	allowEmojis?: boolean,
	showClose?: boolean,
	uploadPermissions?: Array<MediaPermission>,
	disabled?: boolean,
	clearState?: string,
	/**
	 * `document` is the content as a TipTap JSON document — store and render
	 * that (with RenderRichText) rather than `content`, which is the same text
	 * as HTML, kept for existing callers.
	 */
	onChange?: (content: string, mentions: Array<string>, attachments: Array<Media>, filesUploading: boolean, document: RichTextDocument) => void,
	onSend?: () => void,
	onClose?: () => void,
}

const defaultUploadPermission: MediaPermission[] = [{
	groupName: "everyone",
	permission: GroupPermission.READ
}]

export const RichTextPrompt: React.FC<Props> = ({
											  content,
											  focus=false,
											  files=[],
											  placeholder,
											  allowMentions=true,
											  allowEmojis=true,
											  showClose=false,
											  uploadPermissions=defaultUploadPermission,
											  disabled = false,
											  clearState="",
											  onChange,
											  onSend,
											  onClose
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

	const [query, setQuery] = useState('');

	const [mentionItems, setMentionItems] = useState<Array<MentionItem>>([]);

	const [emojiItems, setEmojiItems] = useState<Array<EmojiObj>>([]);

	const [storedFiles, setStoredFiles] = useState<Array<RichTextEditorUploadedFile>>(initialiseFiles());

	const storedFilesRef = useRef<Array<RichTextEditorUploadedFile>>(initialiseFiles());

	// Read from the document, never by parsing the content into a detached
	// element, whose images would load and run their handlers.
	const [mentions, setMentions] = useState<Array<string>>(() => richTextMentions(content));

	const editorContainerRef = useRef<HTMLDivElement>(null);

	const editorRef = useRef<any>(null);

	const initRef = useRef(false);

	const enterEventBlock = useRef(false);

	const disabledRef = useRef(disabled);

	const initialClearState = useRef(clearState);

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


	const isClassPresent = (className: string) => {
		return document.querySelector(`.${className}`) !== null;
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
		SafeLink,
		mentionExtension,
		emojiExtension
	]

	const extensionsNoMentions = [
		StarterKit,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		SafeLink,
		emojiExtension
	]

	const extensionsNoEmojis = [
		StarterKit,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		SafeLink,
		mentionExtension
	]

	const extensionsNoMentionsNoEmojis: AnyExtension[] = [
		StarterKit,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		SafeLink
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
		content: toEditorContent(content, {allowMentions, allowEmojis}),
		onUpdate({ editor }) {
			editorChanged();
		},
		editorProps: {
			handleKeyDown(view, event) {
				const mentionsVisible = isClassPresent("blue-orange-rich-text-editor-mention-items");
				if (enterEventBlock.current) {
					enterEventBlock.current = false;
					return false;
				}
				if (!mentionsVisible && event.key === 'Enter' && !event.shiftKey) {
					event.preventDefault();
					return true;
				} else if (!mentionsVisible && event.key === 'Enter' && event.shiftKey && editor) {
					event.preventDefault();
					enterEventBlock.current = true;
					editor.commands.enter();
					return true;
				}
				return false;
			},
		}
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

	const activeIconStyle: React.CSSProperties = {
		marginLeft: "10px",
		height: "30px",
		width: "30px",
		borderRadius: "4px",
		border: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#393939",
		color: "white",
	}

	const secondaryIconStyle: React.CSSProperties = {
		marginLeft: "10px",
		height: "30px",
		width: "30px",
		borderRadius: "4px",
		border: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#e0e1e2",
		color: "#393939",
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
			var richText = editorRef.current.getJSON() as RichTextDocument;
			onChange(
				editorRef.current.getHTML(),
				richTextMentions(richText),
				generateStoredFileAttachments(),
				areFilesUploading(),
				richText)
		}

	}

	const initialise = () => {
		const intervalId = setInterval(() => {
			if (editorContainerRef.current) {
				const childElements = editorContainerRef.current.querySelectorAll('.tiptap');
				if (childElements.length > 0) {
					var tiptapEl: HTMLElement = childElements[0] as HTMLElement;
					tiptapEl.style.minHeight =  "10px";
					clearInterval(intervalId);
				}
			}
		}, 10);
		if (editorContainerRef.current) {
			editorContainerRef.current.addEventListener("keyup", () => {
				editorChanged();
			})
			editorContainerRef.current.addEventListener("keydown", (ev) => {
				if (ev.key == "Enter" && !ev.shiftKey) {
					sendPrompt();
				}
				if (disabledRef.current === true) {
					ev.preventDefault();
				}
			})
		}
	}

	useEffect(() => {
		if (!initRef.current) {
			initRef.current = true
			initialise();
			if (content && content != "" && editor) {
				editor.commands.setContent(toEditorContent(content, {allowMentions, allowEmojis}));
			}
			if (focus && editor) {
				editor.chain().focus();
			}

		}
	}, []);

	useEffect(() => {
		if (initRef.current && clearState != initialClearState.current && editor && editorContainerRef.current) {
			setStoredFiles([]);
			editor.chain().clearContent().focus().run();
			editorContainerRef.current.scrollIntoView(true);
		}
	}, [clearState]);

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

	const sendPrompt = () => {
		if (onSend) {
			onSend()
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

	const closePrompt =() => {
		if (onClose) {
			onClose();
		}
	}

	return (
		<div className='blue-orange-rich-text-prompt-editor'>
			<div className="blue-orange-rich-text-prompt-main-cont">
				<div ref={editorContainerRef}>
					<EditorContent editor={editor}></EditorContent>
				</div>
				{storedFiles && storedFiles.length > 0 &&
					<div className="blue-orange-rich-text-prompt-editor-uploaded-files">
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
				}
			</div>
			<div className="blue-orange-rich-text-prompt-editor-heading-footer">
				<div className="blue-orange-rich-text-prompt-editor-heading-footer-left-cont">
					<FileInputWrapper accept={"*/*"} onFileSelect={fileSelected}>
						<ButtonIcon
							icon={"ri-add-line"}
							style={defaultIconStyle}
							label={"Add files"}
						></ButtonIcon>
					</FileInputWrapper>
					<ButtonIcon
						icon={"ri-at-line"}
						style={defaultIconStyle}
						onClick={insertMentionStart}
						label={"Mention someone"}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-arrow-up-line"}
						style={activeIconStyle}
						onClick={sendPrompt}
						label={"Send"}
					></ButtonIcon>
					{showClose &&
						<ButtonIcon
							icon={"ri-close-line"}
							style={secondaryIconStyle}
							onClick={closePrompt}
							label={"Close"}
						></ButtonIcon>
					}
				</div>
			</div>
		</div>
	);
};