import React from "react";

import './EmailLinkDevelopment.css'
import {EmailLink} from "../../../../components/text-decorations/email/EmailLink";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const EMAIL_LINK_PROPS: Array<PropSpec> = [
	{
		name: "email",
		type: "string",
		required: true,
		control: "text",
		value: "hello@blueorange.ai",
		description: "The address. It is both the link's target and the text that is shown."
	}
];

interface Props {
}

export const EmailLinkDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Email Link"
			description="An email address rendered as the mailto link it should be, so clicking it opens a new message rather than selecting the text."
			name="EmailLink"
			previewHeight={110}
			props={EMAIL_LINK_PROPS}
			preview={values => (
				<EmailLink email={values.email}></EmailLink>
			)}>

			<GeneralHeading>Basic Email Link</GeneralHeading>
			<p><EmailLink email="hello@example.com" /></p>

			<GeneralHeading>Support Email</GeneralHeading>
			<p><EmailLink email="support@company.com" /></p>

			<GeneralHeading>Personal Email</GeneralHeading>
			<p><EmailLink email="john.doe@gmail.com" /></p>
		</ComponentDoc>
	)
}
