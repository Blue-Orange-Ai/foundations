import React, {useEffect, useRef, useState} from "react";

import {StarterKit} from "@tiptap/starter-kit";
import {EditorContent, EditorProvider, useCurrentEditor, useEditor} from "@tiptap/react";
import {ButtonIcon} from "../../buttons/button-circle-icon/ButtonIcon";

import './RichText.css';
import {Placeholder} from "@tiptap/extension-placeholder";
import {CodeBlock} from "@tiptap/extension-code-block";
import {Link} from "@tiptap/extension-link";

interface Props {
	content?: string,
	placeholder?: string
}

export const RichText: React.FC<Props> = ({content, placeholder}) => {


	const extensions = [
		StarterKit,
		CodeBlock,
		Placeholder.configure({
			placeholder: placeholder ?? "",
		}),
		Link.configure({
			protocols: ['ftp', 'mailto'],
			openOnClick: true,
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

	return (
		<div className='blue-orange-rich-text-editor'>
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
			<EditorContent editor={editor}></EditorContent>
		</div>
	);
};