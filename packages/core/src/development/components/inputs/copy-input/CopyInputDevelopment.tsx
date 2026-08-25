import React, {useState} from "react";

import './CopyInputDevelopment.css'
import {CopyInput} from "../../../../components/inputs/copy-input/CopyInput";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";


const COPY_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "string | null",
		control: "text",
		value: "sk-live-8f2c41d9a7b34e15",
		description: "What is shown, and what the button puts on the clipboard."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "API key",
		description: "The label above the field."
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
		control: "toggle",
		description: "Greys the field out, copy button and all."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the field."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		description: "Inline style put on the label."
	},
	...validationProps()
];

interface Props {
}

export const CopyInputDevelopment: React.FC<Props> = ({}) => {


	return (
		<ComponentDoc
			title="Copy Input"
			description="A read only field with a copy button on the end — an API key, a share link, an identifier. The value is shown so it can be checked, and copied without being selected by hand."
			name="CopyInput"
			previewHeight={160}
			previewCentered={false}
			props={COPY_INPUT_PROPS}
			preview={values => (
				<div style={{width: "100%", maxWidth: "420px"}}>
					<CopyInput
						value={values.value}
						label={values.label}
						help={values.help}
						disabled={values.disabled}
						name={values.name}
						required={values.required}
						requiredMessage={values.requiredMessage}
						validateOnChange={values.validateOnChange}></CopyInput>
				</div>
			)}>
			<CopyInput value={"Hello World"}></CopyInput>
		</ComponentDoc>
	)
}