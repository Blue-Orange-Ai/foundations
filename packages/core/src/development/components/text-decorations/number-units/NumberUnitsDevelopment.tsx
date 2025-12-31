import React from "react";

import './NumberUnitsDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {NumberUnits} from "../../../../components/text-decorations/number-units/NumberUnits";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const NumberUnitsDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Number Units Text Decoration</PageHeading>
			<Description>Formats numbers with units (kilometers, liters, etc.).</Description>

			<GeneralHeading>Kilometers</GeneralHeading>
			<p><NumberUnits value={150} unit="kilometer" /></p>

			<GeneralHeading>Meters with Decimals</GeneralHeading>
			<p><NumberUnits value={1234.5} unit="meter" decimalPlaces={2} /></p>

			<GeneralHeading>Liters</GeneralHeading>
			<p><NumberUnits value={50} unit="liter" /></p>

			<GeneralHeading>Kilograms</GeneralHeading>
			<p><NumberUnits value={75.5} unit="kilogram" decimalPlaces={1} /></p>

			<GeneralHeading>Celsius</GeneralHeading>
			<p><NumberUnits value={23} unit="celsius" /></p>

			<GeneralHeading>Fahrenheit</GeneralHeading>
			<p><NumberUnits value={72} unit="fahrenheit" /></p>

			<GeneralHeading>Miles (US Format)</GeneralHeading>
			<p><NumberUnits value={100} unit="mile" numberFormat="en-US" /></p>

			<GeneralHeading>Percent</GeneralHeading>
			<p><NumberUnits value={85} unit="percent" /></p>
		</PaddedPage>
	)
}
