import React from "react";

import './NumberTextDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {NumberText} from "../../../../components/text-decorations/number-text/NumberText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const NumberTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Number Text Decoration</PageHeading>
			<Description>Formats numbers with locale-specific formatting and decimal places.</Description>

			<GeneralHeading>Default Format (en-AU)</GeneralHeading>
			<p><NumberText value={1234567.89} /></p>

			<GeneralHeading>With 2 Decimal Places</GeneralHeading>
			<p><NumberText value={1234.5} decimalPlaces={2} /></p>

			<GeneralHeading>With 4 Decimal Places</GeneralHeading>
			<p><NumberText value={3.14159265} decimalPlaces={4} /></p>

			<GeneralHeading>US Format</GeneralHeading>
			<p><NumberText value={1234567.89} numberFormat="en-US" /></p>

			<GeneralHeading>German Format</GeneralHeading>
			<p><NumberText value={1234567.89} numberFormat="de-DE" /></p>

			<GeneralHeading>Large Number</GeneralHeading>
			<p><NumberText value={9876543210} /></p>

			<GeneralHeading>Small Decimal</GeneralHeading>
			<p><NumberText value={0.001234} decimalPlaces={6} /></p>
		</PaddedPage>
	)
}
