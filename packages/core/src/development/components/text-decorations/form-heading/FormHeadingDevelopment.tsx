import React from "react";

import './FormHeadingDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const FormHeadingDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Form Heading Text Decoration</PageHeading>
			<Description>A heading component for form labels with optional required indicator.</Description>

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
		</PaddedPage>
	)
}
