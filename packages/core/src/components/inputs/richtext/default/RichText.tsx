import React, {useEffect, useRef, useState} from "react";

import {StarterKit} from "@tiptap/starter-kit";
import {AnyExtension, EditorContent, Extensions, useEditor} from "@tiptap/react";
import {Extension} from "@tiptap/core";
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
import {Media, MediaPermission, GroupPermission} from "@blue-orange-ai/foundations-clients";
import CustomMention from "../mention-extension/MentionExtension";
import {InputValidateCallback, useInputValidation} from "../../validation/InputValidation";
import {InputValidationMessage} from "../../validation/InputValidationMessage";
import {HelpIcon} from "../../help/HelpIcon";
import {RequiredIcon} from "../../required-icon/RequiredIcon";

export interface MentionItem {
	label: string,
	icon: boolean,
	image: boolean,
	src: string,
	userId: string
}

interface Props {
	children?: React.ReactNode,
	content?: string,
	focus?: boolean,
	files?: Array<Media>
	placeholder?: string,
	displayFormatting?: boolean,
	editorHeight?: number,
	minEditorHeight?: number,
	singleLine?: boolean,
	allowMentions?: boolean,
	allowEmojis?: boolean,
	allowFileUpload?: boolean,
	allowFormattingToggle?: boolean,
	uploadPermissions?: Array<MediaPermission>,
	disabled?: boolean,
	clearState?: string,
	/** Sits above the editor, and names the field in the message a failed requirement produces. */
	label?: string,
	/** Puts a tooltip beside the label. */
	help?: string,
	labelStyle?: React.CSSProperties,
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string,
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string,
	required?: boolean,
	onChange?: (content: string, mentions: Array<string>, attachments: Array<Media>, filesUploading: boolean) => void,
	onEnter?: () => void,
	validate?: InputValidateCallback<string>,
	validateOnChange?: boolean
}

const defaultUploadPermission: MediaPermission[] = [{
	groupName: "everyone",
	permission: GroupPermission.READ
}]

export const RichText: React.FC<Props> = ({
											  children,
											  content,
											  focus=false,
											  files=[],
											  placeholder,
											  displayFormatting= true,
											  editorHeight,
											  minEditorHeight = 10,
											  singleLine = false,
											  allowMentions=true,
											  allowEmojis=true,
											  allowFileUpload=true,
											  allowFormattingToggle=true,
											  uploadPermissions=defaultUploadPermission,
											  disabled = false,
											  clearState = "",
											  label,
											  help,
											  labelStyle = {},
											  onChange,
											  onEnter,
											  name,
											  requiredMessage,
											  required = false,
											  validate,
											  validateOnChange = false
										  }) => {

	const editorRef = useRef<any>(null);

	// What the field is worth to a form. An untouched editor still reports an
	// empty paragraph as its html, which would read as a filled in field, so
	// nothing is what it is worth until something is typed into it.
	const currentValue = (): string => {
		if (!editorRef.current || editorRef.current.isEmpty) {
			return "";
		}
		return editorRef.current.getHTML();
	}

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			getValue: () => currentValue()
		});

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

	const initRef = useRef(false);

	const disabledRef = useRef(disabled);

	const singleLineRef = useRef(singleLine);

	const placeholderRef = useRef(placeholder ?? "");

	const onEnterRef = useRef(onEnter);

	const initialClearState = useRef(clearState);

	// The editor is rebuilt whenever the extension set changes, so the html it
	// currently holds is kept to hand back to the instance that replaces it.
	const contentRef = useRef(content ?? "");

	// The last value the content prop pushed in, so a rebuild is not mistaken
	// for the parent asking for different content.
	const appliedContentRef = useRef(content);

	const filesKey = (media: Array<Media>) => media.map(item => item.uuid).join(",");

	const appliedFilesRef = useRef(filesKey(files));

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

	const enterKeymapExtension = Extension.create({
		name: 'enterKeymap',
		priority: 200,
		addKeyboardShortcuts() {
			return {
				Enter: () => {
					const suggestionPopup = document.querySelector(
						'[data-tippy-root] .tippy-box[data-theme="blue-orange-rich-text-editor-mention-tippy"]'
					);
					if (suggestionPopup) return false;
					if (!onEnterRef.current) {
						// Nothing to send it to, so a single line editor simply
						// swallows the key rather than growing a second line.
						return singleLineRef.current;
					}
					onEnterRef.current();
					return true;
				},
				'Shift-Enter': ({ editor }) => {
					if (singleLineRef.current) return true;
					if (!onEnterRef.current) return false;
					if (editor.isActive('codeBlock')) {
						return editor.commands.newlineInCode();
					}
					if (editor.isActive('listItem')) {
						if (editor.commands.splitListItem('listItem')) return true;
						if (editor.isActive('bulletList')) {
							return editor.chain().focus().toggleBulletList().run();
						}
						if (editor.isActive('orderedList')) {
							return editor.chain().focus().toggleOrderedList().run();
						}
						return true;
					}
					if (editor.commands.liftEmptyBlock()) {
						return true;
					}
					return editor.commands.splitBlock();
				}
			};
		}
	});

	var extensions = [
		StarterKit,
		Placeholder.configure({
			placeholder: () => placeholderRef.current,
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		}),
		mentionExtension,
		emojiExtension,
		enterKeymapExtension
	]

	const extensionsNoMentions = [
		StarterKit,
		Placeholder.configure({
			placeholder: () => placeholderRef.current,
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		}),
		emojiExtension,
		enterKeymapExtension
	]

	const extensionsNoEmojis = [
		StarterKit,
		Placeholder.configure({
			placeholder: () => placeholderRef.current,
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		}),
		mentionExtension,
		enterKeymapExtension
	]

	const extensionsNoMentionsNoEmojis: AnyExtension[] = [
		StarterKit,
		Placeholder.configure({
			placeholder: () => placeholderRef.current,
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
		}),
		enterKeymapExtension
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
		content: contentRef.current,
		editable: !disabled,
		onUpdate({ editor }) {
			editorChanged();
		}
	}, [allowMentions, allowEmojis])

	editorRef.current = editor;

	// Read by handlers that are registered once, so they have to be kept current
	// on every render rather than captured at mount.
	disabledRef.current = disabled;
	singleLineRef.current = singleLine;
	placeholderRef.current = placeholder ?? "";

	const defaultIconStyle: React.CSSProperties = {
		height: "30px",
		width: "30px",
		borderRadius: "4px",
		border: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}

	const editorStyle = {
		"--blue-orange-rich-text-editor-min-height": minEditorHeight + "px",
		"--blue-orange-rich-text-editor-height": editorHeight === undefined ? "auto" : editorHeight + "px"
	} as React.CSSProperties;

	const editorClassName = () => {
		var classNames = ["blue-orange-rich-text-editor"];
		if (singleLine) classNames.push("blue-orange-rich-text-editor-single-line");
		if (editorHeight !== undefined) classNames.push("blue-orange-rich-text-editor-fixed-height");
		if (disabled) classNames.push("blue-orange-rich-text-editor-disabled");
		if (isError) classNames.push("blue-orange-rich-text-editor-error");
		return classNames.join(" ");
	}

	// Nothing left to put in the footer once every tool is turned off, so the
	// bar itself goes with them unless there are children to hold.
	const displayFooterTools = allowFileUpload || allowFormattingToggle || allowEmojis || allowMentions;

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
		if (editorRef.current) {
			contentRef.current = editorRef.current.getHTML();
		}
		if (editorRef.current && onChange) {
			var content = editorRef.current.getHTML();
			var mentions = generateMentions(content);
			onChange(
				content,
				mentions,
				generateStoredFileAttachments(),
				areFilesUploading())
		}
		handleChangeValidation(currentValue());

	}

	const editorBlurred = () => {
		handleBlurValidation(currentValue());
	}

	useEffect(() => {
		onEnterRef.current = onEnter;
	}, [onEnter]);

	const initialise = () => {
		if (editorContainerRef.current) {
			editorContainerRef.current.addEventListener("keyup", () => {
				editorChanged();
			})
			editorContainerRef.current.addEventListener("keydown", (ev) => {
				if (disabledRef.current === true) {
					ev.preventDefault();
					return;
				}
			})
		}
	}

	useEffect(() => {
		if (!initRef.current) {
			initRef.current = true
			initialise();
		}
	}, []);

	useEffect(() => {
		if (focus && editor && !editor.isDestroyed) {
			editor.commands.focus();
		}
	}, [focus, editor]);

	useEffect(() => {
		if (appliedContentRef.current === content) return;
		appliedContentRef.current = content;
		contentRef.current = content ?? "";
		if (editor && !editor.isDestroyed && editor.getHTML() !== content) {
			editor.commands.setContent(content ?? "", false);
		}
	}, [content, editor]);

	useEffect(() => {
		if (editor && !editor.isDestroyed) {
			editor.setEditable(!disabled);
		}
	}, [disabled, editor]);

	useEffect(() => {
		// The placeholder is drawn as a decoration, so it only picks a new value
		// up once the editor is asked to redraw.
		if (editor && !editor.isDestroyed) {
			editor.view.dispatch(editor.state.tr);
		}
	}, [placeholder, editor]);

	useEffect(() => {
		setDisplayHeading(displayFormatting);
	}, [displayFormatting]);

	useEffect(() => {
		const key = filesKey(files);
		if (key === appliedFilesRef.current) return;
		appliedFilesRef.current = key;
		const updated = initialiseFiles();
		storedFilesRef.current = updated;
		setStoredFiles(updated);
	}, [files]);

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

	useEffect(() => {
		if (editor && editorContainerRef && editorContainerRef.current && initRef.current && clearState != initialClearState.current) {
			setStoredFiles([]);
			editor.chain().clearContent().focus().run();
			editorContainerRef.current.scrollIntoView(true);
		}
	}, [clearState]);

	return (
		<div className="blue-orange-rich-text-editor-cont">
			{label &&
				<div
					className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
					style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			}
			<div className={editorClassName()} style={editorStyle}>
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
				<div ref={editorContainerRef} onBlur={editorBlurred}>
					<EditorContent editor={editor}></EditorContent>
				</div>
				{storedFiles.length > 0 &&
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
				}
				{(displayFooterTools || children) &&
					<div className="blue-orange-rich-text-editor-heading-footer">
						<div className="blue-orange-rich-text-editor-heading-footer-left-cont">
							{allowFileUpload &&
								<FileInputWrapper accept={"*/*"} onFileSelect={fileSelected}>
									<ButtonIcon
										icon={"ri-add-line"}
										style={defaultIconStyle}
										label={"Add files"}
									></ButtonIcon>
								</FileInputWrapper>
							}
							{allowFileUpload && (allowFormattingToggle || allowEmojis || allowMentions) &&
								<div style={defaultIconStyle}>
									<div className="blue-orange-rich-text-editor-vertical-line-sep"></div>
								</div>
							}
							{allowFormattingToggle &&
								<ButtonIcon
									icon={"ri-font-size"}
									style={defaultIconStyle}
									onClick={toggleHeading}
									label={"Toggle formatting"}
								></ButtonIcon>
							}
							{allowEmojis &&
								<EmojiWrapper onSelection={emojiSelection}>
									<ButtonIcon
										icon={"ri-emotion-happy-line"}
										style={defaultIconStyle}
										label={"Emoji"}
									></ButtonIcon>
								</EmojiWrapper>
							}
							{allowMentions &&
								<ButtonIcon
									icon={"ri-at-line"}
									style={defaultIconStyle}
									onClick={insertMentionStart}
									label={"Mention someone"}
								></ButtonIcon>
							}
						</div>
						{children &&
							<div className="blue-orange-rich-text-editor-heading-footer-right-cont">
								{children}
							</div>
						}
					</div>
				}
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	);
};