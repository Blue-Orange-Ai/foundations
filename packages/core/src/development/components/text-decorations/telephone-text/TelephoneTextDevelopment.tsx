import React from "react";

import './TelephoneTextDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {TelephoneText} from "../../../../components/text-decorations/telephone/TelephoneText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const TelephoneTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Telephone Text Decoration</PageHeading>
			<Description>Formats phone numbers according to national standards.</Description>

			<GeneralHeading>Australian Phone Number</GeneralHeading>
			<p><TelephoneText phone="0412345678" country="AU" /></p>

			<GeneralHeading>US Phone Number</GeneralHeading>
			<p><TelephoneText phone="2025551234" country="US" /></p>

			<GeneralHeading>UK Phone Number</GeneralHeading>
			<p><TelephoneText phone="07911123456" country="GB" /></p>

			<GeneralHeading>Using Telephone Object</GeneralHeading>
			<p><TelephoneText telephone={{ number: "0412345678", code: "AU" }} /></p>

			<GeneralHeading>International Format Examples</GeneralHeading>
			<div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
				<p>Germany: <TelephoneText phone="15123456789" country="DE" /></p>
				<p>France: <TelephoneText phone="0612345678" country="FR" /></p>
				<p>Japan: <TelephoneText phone="09012345678" country="JP" /></p>
			</div>
		</PaddedPage>
	)
}
