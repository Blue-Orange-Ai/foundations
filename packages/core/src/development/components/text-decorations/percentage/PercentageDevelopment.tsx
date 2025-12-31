import React from "react";

import './PercentageDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {Percentage} from "../../../../components/text-decorations/percentage/Percentage";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const PercentageDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Percentage Text Decoration</PageHeading>
			<Description>Formats decimal numbers as percentages with locale support.</Description>

			<GeneralHeading>Basic Percentage (50%)</GeneralHeading>
			<p><Percentage percent={0.5} /></p>

			<GeneralHeading>With 2 Decimal Places</GeneralHeading>
			<p><Percentage percent={0.3333} decimalPlaces={2} /></p>

			<GeneralHeading>Small Percentage</GeneralHeading>
			<p><Percentage percent={0.01} /></p>

			<GeneralHeading>Large Percentage</GeneralHeading>
			<p><Percentage percent={1.5} /></p>

			<GeneralHeading>Precise Percentage (4 decimals)</GeneralHeading>
			<p><Percentage percent={0.12345} decimalPlaces={4} /></p>

			<GeneralHeading>German Format</GeneralHeading>
			<p><Percentage percent={0.75} numberFormat="de-DE" /></p>

			<GeneralHeading>Progress Examples</GeneralHeading>
			<div style={{display: "flex", gap: "16px"}}>
				<span>0%: <Percentage percent={0} /></span>
				<span>25%: <Percentage percent={0.25} /></span>
				<span>50%: <Percentage percent={0.5} /></span>
				<span>75%: <Percentage percent={0.75} /></span>
				<span>100%: <Percentage percent={1} /></span>
			</div>
		</PaddedPage>
	)
}
