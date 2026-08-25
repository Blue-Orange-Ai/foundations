import React, {useState} from "react";

import './TimeInputDevelopment.css'
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {TimeInput} from "../../../../components/inputs/time/TimeInput";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const TIME_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "string",
		control: "text",
		value: "14:30",
		description: "The time, as a 24 hour HH:mm string."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Departure",
		description: "The label above the field."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "isInvalid",
		type: "boolean",
		control: "toggle",
		description: "Puts the field in its error state from the outside."
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
		description: "Fires with the time as it is typed."
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

const USAGE = `const [start, setStart] = useState("09:00");

<TimeInput label="Start" value={start} onChange={setStart}></TimeInput>

// Inside a FormGroup it registers itself under name and can be required
<TimeInput label="Cut off" name="cutOff" required={true}
           requiredMessage="Pick a cut off time"></TimeInput>`;

export const TimeInputDevelopment: React.FC<Props> = ({}) => {

	const [value, setValue] = useState<string>("09:30");

	return (
		<ComponentDoc
			title="Time Input"
			description="A time of day field. It reports its value as a 24 hour HH:mm string, and takes part in a FormGroup like every other input."
			name="TimeInput"
			previewHeight={180}
			previewCentered={false}
			props={TIME_INPUT_PROPS}
			preview={values => (
				<div style={{width: "100%", maxWidth: "320px"}}>
					<TimeInput
						value={values.value}
						label={values.label}
						help={values.help}
						isInvalid={values.isInvalid}
						disabled={values.disabled}
						name={values.name}
						required={values.required}
						requiredMessage={values.requiredMessage}
						validateOnChange={values.validateOnChange}
						onChange={() => {}}></TimeInput>
				</div>
			)}>

			<div className="time-input-dev-section">
				<FormHeading label="Basic"></FormHeading>
				<div className="time-input-dev-row">
					<TimeInput label="Start" value={value} onChange={setValue}></TimeInput>
				</div>
				<div className="time-input-dev-output">Value: {value || "(empty)"}</div>
			</div>

			<div className="time-input-dev-section">
				<FormHeading label="Empty, with a label and without"></FormHeading>
				<div className="time-input-dev-row">
					<TimeInput label="Finish"></TimeInput>
					<TimeInput></TimeInput>
				</div>
			</div>

			<div className="time-input-dev-section">
				<FormHeading label="Required and disabled"></FormHeading>
				<div className="time-input-dev-row">
					<TimeInput label="Required" name="requiredTime" required={true}></TimeInput>
					<TimeInput label="Disabled" value="17:00" disabled={true}></TimeInput>
					<TimeInput label="Invalid" value="25:00" isInvalid={true}></TimeInput>
				</div>
			</div>

			<div className="time-input-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</ComponentDoc>
	)
}
