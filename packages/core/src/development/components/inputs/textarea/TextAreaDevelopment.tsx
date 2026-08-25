import React, {useState} from "react";

import './TextAreaDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {TagInput} from "../../../../components/inputs/tags/simple/TagInput";
import {TextArea} from "../../../../components/inputs/textarea/TextArea";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const TEXT_AREA_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "string",
		default: "\"\"",
		control: "text",
		value: "Six bays, two of them refrigerated.",
		description: "What is in the field."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Notes",
		description: "The label above the field."
	},
	{
		name: "placeholder",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Shown while the field is empty."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the field out and stops it taking input."
	},
	{
		name: "onChange",
		type: "(value: string) => void",
		description: "Fires on every keystroke."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the field — this is where its height comes from."
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

export const TextAreaDevelopment: React.FC<Props> = ({}) => {

	const [query, setQuery] = useState<string>("Hello World");


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Text Area"
					description="The multi line field, for a note or a description. It takes the same label, help and validation props as Input."
					name="TextArea"
					previewHeight={200}
					previewCentered={false}
					props={TEXT_AREA_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "420px"}}>
							<TextArea
								value={values.value}
								label={values.label}
								placeholder={values.placeholder}
								help={values.help}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></TextArea>
						</div>
					)}>
					<TextArea value={query} onChange={setQuery}></TextArea>
				</ComponentDoc>
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