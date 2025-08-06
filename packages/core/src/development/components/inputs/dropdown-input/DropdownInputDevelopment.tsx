import React, {useState} from "react";

import './DropdownInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";
import {DateInput} from "../../../../components/inputs/date/datepicker/inputs/dateinput/DateInput";
import {Dropdown} from "../../../../components/inputs/dropdown/basic/Dropdown";
import {DropdownItem} from "../../../../components/inputs/dropdown/items/DropdownItem/DropdownItem";
import {DropdownItemText} from "../../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {DropdownItemIcon} from "../../../../components/inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {
	DropdownItemHeading
} from "../../../../components/inputs/dropdown/items/DropdownItemHeading/DropdownItemHeading";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

interface Props {
}

export const DropdownInputDevelopment: React.FC<Props> = ({}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [query, setQuery] = useState<Date>(new Date());


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Date Input Editor</PageHeading>
					<Dropdown>
						<DropdownItemHeading label={"Title Item"} value={"heading"} selected={false}></DropdownItemHeading>
						<DropdownItemText label={"Plain Text"} value={"plain-text"} selected={true}></DropdownItemText>
						<DropdownItemIcon src={"ri-link"} label={"Icon dropdown item"} value={"icon-text"} selected={true}></DropdownItemIcon>
					</Dropdown>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{query.toISOString()}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}