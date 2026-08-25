import React, {useState} from "react";

import './OTPInputDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {InputOTP} from "../../../../components/inputs/otp/input-otp/InputOTP";
import {InputOTPGroup} from "../../../../components/inputs/otp/input-otp-group/InputOTPGroup";
import {InputOTPSlot} from "../../../../components/inputs/otp/input-otp-slot/InputOTPSlot";
import {InputOTPSeparator} from "../../../../components/inputs/otp/input-otp-separator/InputOTPSeparator";
import {InputValidationResult} from "../../../../components/inputs/validation/InputValidation";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const OTP_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "string",
		control: "text",
		description: "The code so far. Left off, the field holds it itself."
	},
	{
		name: "maxLength",
		type: "number",
		default: "6",
		control: "slider",
		min: 4,
		max: 8,
		step: 1,
		description: "How many characters the code has."
	},
	{
		name: "groups",
		type: "number[]",
		description: "Splits the slots into blocks — [3, 3] renders three, a separator, then three."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Verification code",
		description: "The label above the field."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "isNumeric",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Restricts entry to digits, and switches the mobile keyboard to the numeric one."
	},
	{
		name: "allowedPattern",
		type: "RegExp",
		description: "Characters that fail this test are rejected as they are typed or pasted."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the field out and stops it taking input."
	},
	{
		name: "autoFocus",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Takes the caret as soon as the field mounts."
	},
	{
		name: "onChange",
		type: "(value: string) => void",
		description: "Fires with the code so far on every change."
	},
	{
		name: "onComplete",
		type: "(value: string) => void",
		description: "Fires once every slot has been filled — usually what submits the code."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Overrides the generated slots. Compose InputOTPGroup and InputOTPSlot by hand instead."
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
	{
		name: "grouped",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — splits the code into two blocks of three."
	},
	...validationProps()
];

const OTP_SLOT_PROPS: Array<PropSpec> = [
	{
		name: "index",
		type: "number",
		required: true,
		description: "Which character of the code this slot shows, counted from 0."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the slot."
	}
];

const OTP_GROUP_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The slots in the block."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the block."
	}
];

const OTP_SEPARATOR_PROPS: Array<PropSpec> = [
	{
		name: "icon",
		type: "string",
		default: "\"ri-subtract-line\"",
		control: "text",
		description: "Any remixicon class."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the separator."
	}
];

interface Props {
}

export const OTPInputDevelopment: React.FC<Props> = ({}) => {

	const [code, setCode] = useState("");

	const [completed, setCompleted] = useState("");

	const validateCode = (value: string): Promise<InputValidationResult> => {
		if (value.length < 6) {
			return Promise.resolve({state: "error", message: "Enter all six digits."});
		}
		if (value !== "123456") {
			return Promise.resolve({state: "error", message: "That code is not right — try 123456."});
		}
		return Promise.resolve({state: "success", message: "Code accepted."});
	}

	return (
		<ComponentDoc
			title="OTP Input"
			description="A one time passcode field. One hidden input holds the value so paste, autofill and the mobile keyboard all behave, while the slots on screen show it a character at a time."
			name="InputOTP"
			previewHeight={180}
			imports={["InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"]}
			props={OTP_PROPS}
			preview={values => (
				<InputOTP
					value={values.value}
					maxLength={values.maxLength}
					groups={values.grouped ? [3, 3] : undefined}
					label={values.label}
					help={values.help}
					isNumeric={values.isNumeric}
					disabled={values.disabled}
					name={values.name}
					required={values.required}
					requiredMessage={values.requiredMessage}
					validateOnChange={values.validateOnChange}
					onChange={() => {}}></InputOTP>
			)}
			siblings={[
				{
					name: "InputOTPSlot",
					description: "One character of the code. Compose these by hand, inside groups, where the generated layout is not the one you want.",
					props: OTP_SLOT_PROPS,
					previewHeight: 140,
					imports: ["InputOTP", "InputOTPGroup"],
					preview: values => (
						<InputOTP maxLength={3}>
							<InputOTPGroup>
								<InputOTPSlot index={0}></InputOTPSlot>
								<InputOTPSlot index={1}></InputOTPSlot>
								<InputOTPSlot index={2}></InputOTPSlot>
							</InputOTPGroup>
						</InputOTP>
					)
				},
				{
					name: "InputOTPGroup",
					description: "Holds a run of slots together, so a code can be split into blocks.",
					props: OTP_GROUP_PROPS,
					previewHeight: 140,
					imports: ["InputOTP", "InputOTPSlot"],
					snippetChildren: () => "<InputOTPSlot index={0}></InputOTPSlot>\n<InputOTPSlot index={1}></InputOTPSlot>",
					preview: () => (
						<InputOTP maxLength={2}>
							<InputOTPGroup>
								<InputOTPSlot index={0}></InputOTPSlot>
								<InputOTPSlot index={1}></InputOTPSlot>
							</InputOTPGroup>
						</InputOTP>
					)
				},
				{
					name: "InputOTPSeparator",
					description: "The mark between two groups. It is decorative, and hidden from screen readers.",
					props: OTP_SEPARATOR_PROPS,
					previewHeight: 110,
					preview: values => (<InputOTPSeparator icon={values.icon}></InputOTPSeparator>)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<InputOTP maxLength={6} onChange={setCode}></InputOTP>
			<Description>{code ? "Value: " + code : "Nothing entered yet."}</Description>

			<GeneralHeading>Grouped</GeneralHeading>
			<Description>Split the slots with the groups prop, or compose them by hand.</Description>
			<InputOTP
				maxLength={6}
				groups={[3, 3]}
				isNumeric={true}
				label="Verification code"
				onComplete={setCompleted}></InputOTP>
			<Description>{completed ? "Completed with " + completed : "Enter six digits to complete."}</Description>

			<GeneralHeading>Composed by hand</GeneralHeading>
			<InputOTP maxLength={4}>
				<InputOTPGroup>
					<InputOTPSlot index={0}></InputOTPSlot>
					<InputOTPSlot index={1}></InputOTPSlot>
				</InputOTPGroup>
				<InputOTPSeparator icon="ri-close-line"></InputOTPSeparator>
				<InputOTPGroup>
					<InputOTPSlot index={2}></InputOTPSlot>
					<InputOTPSlot index={3}></InputOTPSlot>
				</InputOTPGroup>
			</InputOTP>

			<GeneralHeading>With validation</GeneralHeading>
			<Description>Validation runs on blur — the accepted code is 123456.</Description>
			<InputOTP
				maxLength={6}
				groups={[3, 3]}
				isNumeric={true}
				label="Enter the code we sent you"
				required={true}
				validate={validateCode}></InputOTP>

			<GeneralHeading>Disabled</GeneralHeading>
			<InputOTP maxLength={6} groups={[3, 3]} value="123456" disabled={true}></InputOTP>
		</ComponentDoc>
	)
}
