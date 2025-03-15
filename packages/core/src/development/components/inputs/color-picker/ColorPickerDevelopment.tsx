import React, {useState} from "react";

import './ColorPickerDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {IRule, RuleEditor} from "../../../../components/rules/rule-editor/RuleEditor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {RichText} from "../../../../components/inputs/richtext/default/RichText";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

interface Props {
}

export const ColorPickerDevelopment: React.FC<Props> = ({}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [color, setColor] = useState("#000000");


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Color Picker Editor</PageHeading>
					<ColorPicker value={color} onChange={setColor}></ColorPicker>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{color}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}