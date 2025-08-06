import React, {useState} from "react";

import './CodeBlockDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {CodeBlock, CodeRender} from "../../../../components/text-decorations/code-block/CodeBlock";


interface Props {
}

export const CodeBlockDevelopment: React.FC<Props> = ({}) => {

	const code: CodeRender = {
		code: 'const a = 1',
		lang: 'javascript',
		theme: "github-light"
	}


	return (
		<PaddedPage>
			<PageHeading>Code Block Text Decoration</PageHeading>
			<CodeBlock value={code}></CodeBlock>
		</PaddedPage>
	)
}