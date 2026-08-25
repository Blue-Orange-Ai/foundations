import React, {useState} from "react";

import './ColorPickerDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

const COLOR_PICKER_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "string",
		control: "color",
		value: "#7c4dff",
		description: "The colour, as a hex string."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Brand colour",
		description: "The label above the field."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "onChange",
		type: "(value: string) => void",
		description: "Fires with the colour that was chosen."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	},
	...validationProps()
];

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
				<ComponentDoc
					title="Color Picker"
					description="A colour swatch that opens the browser's own picker, with the hex value beside it as a field of its own — so a colour can be typed as easily as it is picked."
					name="ColorPicker"
					previewHeight={160}
					previewCentered={false}
					props={COLOR_PICKER_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "320px"}}>
							<ColorPicker
								value={values.value}
								label={values.label}
								help={values.help}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></ColorPicker>
						</div>
					)}>
					<ColorPicker value={color} onChange={setColor}></ColorPicker>
				</ComponentDoc>
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