import React from "react";

import './MarkdownTextDevelopment.css';
import {MarkdownText} from "../../../../components/text-decorations/markdown-text/MarkdownText";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

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
		<PaddedPage>
			<PageHeading>Markdown Text Decoration</PageHeading>
			<Description>A component that renders markdown content with support for code highlighting, math equations, and GFM features.</Description>

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
		</PaddedPage>
	);
};
