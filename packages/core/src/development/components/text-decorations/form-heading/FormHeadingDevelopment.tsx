import React from "react";

import './FormHeadingDevelopment.css'
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const FORM_HEADING_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Email address",
		description: "What the heading reads."
	},
	{
		name: "required",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts an asterisk in front of the label."
	}
];

interface Props {
}

export const FormHeadingDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Form Heading"
			description="The label above a field or a group of fields, with the asterisk that marks it required. It is the heading the input components use themselves."
			name="FormHeading"
			previewHeight={110}
			props={FORM_HEADING_PROPS}
			preview={values => (
				<FormHeading label={values.label} required={values.required}></FormHeading>
			)}>

			<GeneralHeading>Optional Field</GeneralHeading>
			<FormHeading label="Username" />

			<GeneralHeading>Required Field</GeneralHeading>
			<FormHeading label="Email Address" required={true} />

			<GeneralHeading>Multiple Form Headings</GeneralHeading>
			<div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
				<FormHeading label="First Name" required={true} />
				<FormHeading label="Last Name" required={true} />
				<FormHeading label="Phone Number" />
				<FormHeading label="Password" required={true} />
			</div>
		</ComponentDoc>
	)
}
