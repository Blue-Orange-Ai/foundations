import React, {useState} from "react";

import './RichTextPromptDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {RichTextPrompt} from "../../../../components/inputs/richtext/prompt/RichTextPrompt";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

interface Props {
}

export const RichTextPromptDevelopment: React.FC<Props> = ({fontSize, color}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [richTextContent, setRichTextContent] = useState(startingState);

	const [richTextContentStr, setRichTextContentStr] = useState(generateContentStr(startingState));

	const processChangeData = (content: string, mentions: string[], attachments: Media[], filesUploading: boolean) => {
		var state = richTextContent;
		state["content"] = content
		state["mentions"] = mentions
		state["attachments"] = attachments
		state["filesUploading"] = filesUploading
		setRichTextContent(state);
		setRichTextContentStr(generateContentStr(state));
	}

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Rich Text Editor</PageHeading>
					<RichTextPrompt
						content={richTextContent.content}
						files={richTextContent.attachments}
						onChange={processChangeData}
						onSend={() => console.log("Send Event Received")}
					></RichTextPrompt>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{richTextContentStr}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}