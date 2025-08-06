import React, {useState} from "react";

import './TagInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";
import {TagInput} from "../../../../components/inputs/tags/simple/TagInput";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

interface Props {
}

export const TagInputDevelopment: React.FC<Props> = ({}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [query, setQuery] = useState<string[]>(["William"]);


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Tag Editor</PageHeading>
					<TagInput initialTags={query} onChange={setQuery}></TagInput>
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