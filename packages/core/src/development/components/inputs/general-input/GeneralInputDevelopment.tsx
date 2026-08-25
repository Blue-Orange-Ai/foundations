import React, {useState} from "react";

import './GeneralInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";
import {Input} from "../../../../components/inputs/input/Input";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

const INPUT_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "string | null",
		control: "text",
		value: "Melbourne Depot",
		description: "What is in the field."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Site name",
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
		name: "isEmail",
		type: "boolean",
		control: "toggle",
		description: "Treats the value as an email address, which changes both the keyboard and the validation."
	},
	{
		name: "isNumber",
		type: "boolean",
		control: "toggle",
		description: "Restricts entry to digits."
	},
	{
		name: "isPassword",
		type: "boolean",
		control: "toggle",
		description: "Masks the value."
	},
	{
		name: "isInvalid",
		type: "boolean",
		control: "toggle",
		description: "Puts the field in its error state from the outside, for a failure the field cannot see itself."
	},
	{
		name: "preventSpaces",
		type: "boolean",
		control: "toggle",
		description: "Drops spaces as they are typed — for an identifier or a slug."
	},
	{
		name: "disabled",
		type: "boolean",
		control: "toggle",
		description: "Greys the field out and stops it taking input."
	},
	{
		name: "focus",
		type: "boolean",
		control: "toggle",
		description: "Takes the caret when it turns on."
	},
	{
		name: "onChange",
		type: "(value: string) => void",
		description: "Fires on every keystroke."
	},
	{
		name: "focusIn",
		type: "() => void",
		description: "Fires when the field takes the caret."
	},
	{
		name: "focusOut",
		type: "() => void",
		description: "Fires when the field loses it."
	},
	{
		name: "enterEvent",
		type: "() => void",
		description: "Fires when enter is pressed in the field."
	},
	{
		name: "validateKey",
		type: "(key: string) => boolean",
		description: "Runs on each key before it lands; return false to reject it."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the field."
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

export const GeneralInputDevelopment: React.FC<Props> = ({}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [query, setQuery] = useState("Hello world");


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Input"
					description="The single line text field the rest of the library is built on. It carries the label, the required marker, the help icon and the validation message, and switches its own behaviour for an email, a number or a password."
					name="Input"
					previewHeight={180}
					previewCentered={false}
					props={INPUT_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "420px"}}>
							<Input
								value={values.value}
								label={values.label}
								placeholder={values.placeholder}
								help={values.help}
								isEmail={values.isEmail}
								isNumber={values.isNumber}
								isPassword={values.isPassword}
								isInvalid={values.isInvalid}
								preventSpaces={values.preventSpaces}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></Input>
						</div>
					)}>
					<Input value={query} onChange={setQuery}></Input>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{query}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}