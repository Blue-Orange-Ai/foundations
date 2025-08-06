import React, {useState} from "react";

import './TextAreaDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {TagInput} from "../../../../components/inputs/tags/simple/TagInput";
import {TextArea} from "../../../../components/inputs/textarea/TextArea";

interface Props {
}

export const TextAreaDevelopment: React.FC<Props> = ({}) => {

	const [query, setQuery] = useState<string>("Hello World");


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Text Area Editor</PageHeading>
					<TextArea value={query} onChange={setQuery}></TextArea>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(query, null, 4)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}