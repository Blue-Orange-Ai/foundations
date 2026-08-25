import React, {useState} from "react";

import './EmailRecipientDevelopment.css'
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {EmailRecipientInput} from "../../../../components/inputs/email-recipient/EmailRecipientInput";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const DEMO_EMAILS = ["ada@blueorange.ai"];

const DEMO_EMAIL_SUGGESTIONS = ["grace@blueorange.ai", "alan@blueorange.ai", "katherine@blueorange.ai"];

const EMAIL_RECIPIENT_PROPS: Array<PropSpec> = [
	{
		name: "initialEmails",
		type: "string[]",
		default: "[]",
		description: "The addresses the field starts with."
	},
	{
		name: "suggestions",
		type: "string[]",
		default: "[]",
		description: "Addresses offered as the field is typed in. They are a convenience only — any well formed email can still be added."
	},
	{
		name: "maxEmails",
		type: "number",
		default: "100000",
		control: "slider",
		min: 1,
		max: 10,
		step: 1,
		value: 5,
		description: "How many addresses can be added before the field stops taking them."
	},
	{
		name: "placeholder",
		type: "string",
		default: "\"Add guests by email\"",
		control: "text",
		description: "Shown while the field is empty."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Recipients",
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
		type: "(emails: string[]) => void",
		description: "Fires with every address in the field."
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
		name: "useSuggestions",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — hands the field three addresses to suggest."
	},
	...validationProps("string[]")
];

interface Props {
}

const SUGGESTIONS = [
	"ada@company.com",
	"grace@company.com",
	"alan@company.com",
	"katherine@company.com",
];

const USAGE = `const [recipients, setRecipients] = useState<string[]>([]);

<EmailRecipientInput
    label="To"
    initialEmails={["ada@company.com"]}
    suggestions={["grace@company.com", "alan@company.com"]}
    maxEmails={10}
    onChange={setRecipients}></EmailRecipientInput>`;

export const EmailRecipientDevelopment: React.FC<Props> = ({}) => {

	const [recipients, setRecipients] = useState<Array<string>>(["ada@company.com"]);

	const [limited, setLimited] = useState<Array<string>>([]);

	return (
		<ComponentDoc
			title="Email Recipient Input"
			description="Addresses entered as pills. Anything that is not a well formed email is refused as it is typed, and a list of suggestions can be offered alongside — though any valid address is still accepted."
			name="EmailRecipientInput"
			previewHeight={200}
			previewCentered={false}
			props={EMAIL_RECIPIENT_PROPS}
			preview={values => (
				<div style={{width: "100%", maxWidth: "460px"}}>
					<EmailRecipientInput
						initialEmails={DEMO_EMAILS}
						suggestions={values.useSuggestions ? DEMO_EMAIL_SUGGESTIONS : undefined}
						maxEmails={values.maxEmails}
						placeholder={values.placeholder}
						label={values.label}
						help={values.help}
						name={values.name}
						required={values.required}
						requiredMessage={values.requiredMessage}
						validateOnChange={values.validateOnChange}
						onChange={() => {}}></EmailRecipientInput>
				</div>
			)}>

			<div className="email-recipient-dev-section">
				<FormHeading label="With suggestions"></FormHeading>
				<EmailRecipientInput
					label="To"
					initialEmails={recipients}
					suggestions={SUGGESTIONS}
					placeholder="Add a recipient"
					onChange={setRecipients}></EmailRecipientInput>
				<div className="email-recipient-dev-output">
					{recipients.length} recipient(s): {recipients.join(", ") || "none"}
				</div>
			</div>

			<div className="email-recipient-dev-section">
				<FormHeading label="Capped at three"></FormHeading>
				<EmailRecipientInput
					label="Cc"
					maxEmails={3}
					suggestions={SUGGESTIONS}
					placeholder="Up to three"
					onChange={setLimited}></EmailRecipientInput>
				<div className="email-recipient-dev-output">{limited.length}/3 used</div>
			</div>

			<div className="email-recipient-dev-section">
				<FormHeading label="Required, with help text"></FormHeading>
				<EmailRecipientInput
					label="Bcc"
					name="bcc"
					required={true}
					requiredMessage="At least one recipient is needed"
					help="Everyone here receives a copy without the others seeing it."></EmailRecipientInput>
			</div>

			<div className="email-recipient-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</ComponentDoc>
	)
}
