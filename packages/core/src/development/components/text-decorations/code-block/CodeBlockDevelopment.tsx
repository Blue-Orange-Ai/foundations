import React from "react";

import './CodeBlockDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {CodeBlock, CodeRender} from "../../../../components/text-decorations/code-block/CodeBlock";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";


interface Props {
}

export const CodeBlockDevelopment: React.FC<Props> = ({}) => {

	const snippet = `const greet = (name: string): string => {\n\treturn \`hello \${name}\`;\n}`;

	const themed: CodeRender = {
		code: 'const a = 1',
		lang: 'javascript'
	}

	return (
		<PaddedPage>
			<PageHeading>Code Block Text Decoration</PageHeading>

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
		</PaddedPage>
	)
}
