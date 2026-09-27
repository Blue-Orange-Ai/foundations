import React from "react";

import './RenderRichTextDevelopment.css'
import {RenderRichText} from "../../../../components/text-decorations/render-rich-text/RenderRichText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {RichTextDocument} from "../../../../components/inputs/richtext/document/RichTextDocument";

const document: RichTextDocument = {
	type: "doc",
	content: [
		{type: "heading", attrs: {level: 3}, content: [{type: "text", text: "Release notes"}]},
		{
			type: "paragraph",
			content: [
				{type: "text", text: "Shipped by "},
				{type: "mention", attrs: {id: "Ann", label: "Ann", userId: "u1"}},
				{type: "text", text: " — see "},
				{type: "text", text: "the changelog", marks: [{type: "link", attrs: {href: "https://example.com"}}]},
				{type: "text", text: " for "},
				{type: "text", text: "details", marks: [{type: "bold"}]},
				{type: "text", text: "."},
			]
		},
		{
			type: "bulletList",
			content: [
				{type: "listItem", content: [{type: "paragraph", content: [{type: "text", text: "Comments are stored as JSON"}]}]},
				{type: "listItem", content: [{type: "paragraph", content: [{type: "text", text: "Nothing in them can run"}]}]},
			]
		},
		{type: "codeBlock", attrs: {language: "ts"}, content: [{type: "text", text: "editor.getJSON()"}]},
	]
};

const RENDER_RICH_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "content",
		type: "RichTextDocument | string",
		required: true,
		control: "text",
		value: JSON.stringify(document),
		description: "The editor's JSON document, a serialized document, or HTML from an earlier version of the editor. It is rendered as React elements — never as markup — so nothing in it can run."
	},
	{
		name: "className",
		type: "string",
		description: "Added to the root element."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Applied to the root element."
	}
];

const legacyHtml = '<p>A comment saved as <strong>HTML</strong><img src="x" onerror="alert(1)"> with a <a href="javascript:alert(1)">script link</a>.</p>';

interface Props {
}

export const RenderRichTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Render Rich Text"
			description="Shows what the rich text editors produce — their TipTap JSON document — as React elements. Only the blocks and marks the editors support are drawn, links keep only http(s), mailto, tel and ftp addresses, and all text is escaped. Use it wherever editor content written by someone else is shown: comments, chat messages, descriptions."
			name="RenderRichText"
			previewHeight={220}
			previewCentered={false}
			props={RENDER_RICH_TEXT_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<RenderRichText content={values.content}></RenderRichText>
				</div>
			)}>

			<GeneralHeading>A document</GeneralHeading>
			<RenderRichText content={document} />

			<GeneralHeading>Legacy HTML</GeneralHeading>
			<RenderRichText content={legacyHtml} />
		</ComponentDoc>
	)
}
