import React, {useState} from "react";

import './IconSelectorDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {IRule, RuleEditor} from "../../../../components/rules/rule-editor/RuleEditor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {RichText} from "../../../../components/inputs/richtext/default/RichText";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";
import {IconSelector} from "../../../../components/inputs/icon-selector/IconSelector";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

const ICON_SELECTOR_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "string | null",
		control: "text",
		value: "ri-map-pin-2-line",
		description: "The chosen icon, as a remixicon class name."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Marker icon",
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
		description: "Fires with the icon that was picked."
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

export const IconSelectorDevelopment: React.FC<Props> = ({}) => {

	const [selectedIcon, setSelectedIcon] = useState("");


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Icon Selector"
					description="A field for picking one of the remixicon glyphs. It shows the chosen icon beside its name and opens a searchable grid of the rest."
					name="IconSelector"
					previewHeight={180}
					previewCentered={false}
					props={ICON_SELECTOR_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "320px"}}>
							<IconSelector
								value={values.value}
								label={values.label}
								help={values.help}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></IconSelector>
						</div>
					)}>
					<IconSelector value={selectedIcon} onChange={setSelectedIcon}></IconSelector>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{selectedIcon}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}