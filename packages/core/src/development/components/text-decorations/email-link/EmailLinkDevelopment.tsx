import React from "react";

import './EmailLinkDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {EmailLink} from "../../../../components/text-decorations/email/EmailLink";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const EmailLinkDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Email Link Text Decoration</PageHeading>
			<Description>Displays an email address as a clickable mailto link.</Description>

			<GeneralHeading>Basic Email Link</GeneralHeading>
			<p><EmailLink email="hello@example.com" /></p>

			<GeneralHeading>Support Email</GeneralHeading>
			<p><EmailLink email="support@company.com" /></p>

			<GeneralHeading>Personal Email</GeneralHeading>
			<p><EmailLink email="john.doe@gmail.com" /></p>
		</PaddedPage>
	)
}
