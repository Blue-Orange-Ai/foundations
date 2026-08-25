import React from "react";

import './MarkdownTextDevelopment.css';
import {MarkdownText} from "../../../../components/text-decorations/markdown-text/MarkdownText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SAMPLE_MARKDOWN = "## Delivery report\n\nThe depot is **operational**. See the [run sheet](https://example.com).\n\n| Site | State |\n| --- | --- |\n| Melbourne | Operational |\n| Geelong | Reduced |\n\n```ts\nconst total = runs.reduce((sum, run) => sum + run.count, 0);\n```\n\nThroughput is $\\frac{n}{t}$ per hour.";

const MARKDOWN_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "string",
		required: true,
		control: "text",
		value: SAMPLE_MARKDOWN,
		hideFromSnippet: true,
		description: "The markdown source, as a single string."
	},
	{
		name: "enableMath",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Renders TeX between dollar signs through KaTeX."
	},
	{
		name: "enableGfm",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turns on the GitHub flavoured extras — tables, strikethrough, task lists, autolinks."
	},
	{
		name: "enableCodeHighlighting",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Highlights fenced code blocks. Off, they are rendered as plain preformatted text."
	},
	{
		name: "className",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the wrapper, for styling the rendered markup."
	}
];

interface Props {
}

const basicMarkdown = `
# Hello World

This is a **bold** statement and this is *italic*.

Here's a [link](https://example.com) to somewhere.
`;

const codeMarkdown = `
## Code Examples

Here's some inline \`code\` in a sentence.

\`\`\`javascript
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
\`\`\`
`;

const listMarkdown = `
## Lists

### Unordered List
- First item
- Second item
- Third item
  - Nested item
  - Another nested item

### Ordered List
1. First step
2. Second step
3. Third step
`;

const tableMarkdown = `
## Table Example

| Name | Age | Role |
|------|-----|------|
| Alice | 28 | Developer |
| Bob | 32 | Designer |
| Carol | 25 | Manager |
`;

const blockquoteMarkdown = `
## Blockquotes

> This is a blockquote.
> It can span multiple lines.

> Another quote here with some **emphasis**.
`;

const mathMarkdown = `
## Math Examples

Inline math: $E = mc^2$

Block math:

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
`;

const gfmMarkdown = `
## GFM Features

### Task List
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

### Strikethrough
~~This text is struck through~~

### Autolinks
Visit https://github.com for more info.
`;

export const MarkdownTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Markdown Text"
			description="Renders a markdown string as real markup — headings, lists, tables, fenced code with highlighting, and TeX maths. Each feature can be turned off where the source is not trusted to carry it."
			name="MarkdownText"
			previewHeight={220}
			previewCentered={false}
			snippetChildren={values => "{markdown}"}
			props={MARKDOWN_TEXT_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<MarkdownText
						enableMath={values.enableMath}
						enableGfm={values.enableGfm}
						enableCodeHighlighting={values.enableCodeHighlighting}
						className={values.className}>
						{values.children}
					</MarkdownText>
				</div>
			)}>

			<GeneralHeading>Basic Markdown</GeneralHeading>
			<MarkdownText>{basicMarkdown}</MarkdownText>

			<GeneralHeading>Code Blocks</GeneralHeading>
			<MarkdownText>{codeMarkdown}</MarkdownText>

			<GeneralHeading>Lists</GeneralHeading>
			<MarkdownText>{listMarkdown}</MarkdownText>

			<GeneralHeading>Tables (GFM)</GeneralHeading>
			<MarkdownText>{tableMarkdown}</MarkdownText>

			<GeneralHeading>Blockquotes</GeneralHeading>
			<MarkdownText>{blockquoteMarkdown}</MarkdownText>

			<GeneralHeading>Math Equations</GeneralHeading>
			<MarkdownText enableMath={true}>{mathMarkdown}</MarkdownText>

			<GeneralHeading>GFM Features</GeneralHeading>
			<MarkdownText>{gfmMarkdown}</MarkdownText>

			<GeneralHeading>Disabled Features</GeneralHeading>
			<Description>With math and GFM disabled:</Description>
			<MarkdownText enableMath={false} enableGfm={false}>{basicMarkdown}</MarkdownText>
		</ComponentDoc>
	);
};
