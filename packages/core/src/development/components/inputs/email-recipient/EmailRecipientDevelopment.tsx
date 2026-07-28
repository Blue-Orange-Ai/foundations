import React, {useState} from "react";

import './EmailRecipientDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {EmailRecipientInput} from "../../../../components/inputs/email-recipient/EmailRecipientInput";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";

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
		<PaddedPage>
			<PageHeading>Email Recipient Input</PageHeading>
			<Paragraph>
				Addresses are entered as pills. Anything that is not a well formed email is rejected as you type, and
				suggestions are offered from the list you pass in — though any valid address can still be added.
			</Paragraph>

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
		</PaddedPage>
	)
}
