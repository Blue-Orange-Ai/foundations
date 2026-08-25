import React from "react";

import './CodeBlockDevelopment.css'
import {CodeBlock, CodeRender} from "../../../../components/text-decorations/code-block/CodeBlock";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";


const CODE_RENDER_INTERFACE = {
	name: "CodeRender",
	description: "The object handed to `value`. It carries the code, the language it is written in, and optionally the theme to paint it with.",
	props: [
		{name: "code", type: "string", required: true, description: "The source to highlight, newlines and all."},
		{name: "lang", type: "string", required: true, description: "A Shiki language id — tsx, json, bash, python and so on."},
		{name: "theme", type: "\"github-light\" | \"github-dark\"", description: "Pins the block to one theme. Left off it follows the light and dark theme of the page."}
	] as Array<PropSpec>
};

const SAMPLE_CODE = "export const greet = (name: string): string => {\n\treturn `Hello ${name}`;\n}";

const CODE_BLOCK_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "CodeRender",
		required: true,
		description: "The code, its language, and optionally the theme. The three controls here build this object."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the block's container."
	},
	{
		name: "code",
		type: "string",
		control: "text",
		value: SAMPLE_CODE,
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — the `code` of the value object."
	},
	{
		name: "lang",
		type: "string",
		control: "select",
		value: "tsx",
		hideFromTable: true,
		hideFromSnippet: true,
		options: [
			{label: "tsx", value: "tsx"},
			{label: "typescript", value: "typescript"},
			{label: "json", value: "json"},
			{label: "bash", value: "bash"},
			{label: "python", value: "python"},
			{label: "sql", value: "sql"}
		],
		description: "Demo only — the `lang` of the value object."
	},
	{
		name: "theme",
		type: "string",
		control: "select",
		value: "",
		hideFromTable: true,
		hideFromSnippet: true,
		options: [
			{label: "Follow the page", value: ""},
			{label: "github-light", value: "github-light"},
			{label: "github-dark", value: "github-dark"}
		],
		description: "Demo only — the `theme` of the value object."
	}
];

interface Props {
}

export const CodeBlockDevelopment: React.FC<Props> = ({}) => {

	const snippet = `const greet = (name: string): string => {\n\treturn \`hello \${name}\`;\n}`;

	const themed: CodeRender = {
		code: 'const a = 1',
		lang: 'javascript'
	}

	return (
		<ComponentDoc
			title="Code Block"
			description="A syntax highlighted block of code with a copy button. Shiki does the highlighting, and unless a theme is named the block follows whichever theme the rest of the page is in."
			name="CodeBlock"
			previewHeight={200}
			previewCentered={false}
			imports={["CodeRender"]}
			interfaces={[CODE_RENDER_INTERFACE]}
			props={CODE_BLOCK_PROPS}
			usage={values => "import {CodeBlock} from \"@blue-orange-ai/foundations-core\";\n\n<CodeBlock value={{\n\tcode: " + JSON.stringify(values.code) + ",\n\tlang: " + JSON.stringify(values.lang) + (values.theme ? ",\n\ttheme: " + JSON.stringify(values.theme) : "") + "\n}}></CodeBlock>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<CodeBlock value={{code: values.code, lang: values.lang, theme: values.theme ? values.theme : undefined}}></CodeBlock>
				</div>
			)}>

			<div className="code-block-dev-section">
				<FormHeading label="Follows the page theme (no theme set)"></FormHeading>
				<CodeBlock value={themed}></CodeBlock>
			</div>

			<div className="code-block-dev-section">
				<FormHeading label="Follows the page theme, multiple lines"></FormHeading>
				<CodeBlock value={{code: snippet, lang: "typescript"}}></CodeBlock>
			</div>

			<div className="code-block-dev-section">
				<FormHeading label="Pinned to github-light"></FormHeading>
				<CodeBlock value={{code: snippet, lang: "typescript", theme: "github-light"}}></CodeBlock>
			</div>

			<div className="code-block-dev-section">
				<FormHeading label="Pinned to github-dark"></FormHeading>
				<CodeBlock value={{code: snippet, lang: "typescript", theme: "github-dark"}}></CodeBlock>
			</div>
		</ComponentDoc>
	)
}
