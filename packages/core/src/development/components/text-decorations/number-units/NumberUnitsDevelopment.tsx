import React from "react";

import './NumberUnitsDevelopment.css'
import {NumberUnits} from "../../../../components/text-decorations/number-units/NumberUnits";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const NUMBER_UNITS_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "number",
		required: true,
		control: "number",
		value: 150,
		description: "The number to print."
	},
	{
		name: "unit",
		type: "string",
		required: true,
		control: "select",
		value: "kilometer",
		options: [
			{label: "kilometer", value: "kilometer"},
			{label: "meter", value: "meter"},
			{label: "liter", value: "liter"},
			{label: "kilogram", value: "kilogram"},
			{label: "celsius", value: "celsius"},
			{label: "byte", value: "byte"}
		],
		description: "A sanctioned Intl unit identifier. Anything outside that list will throw."
	},
	{
		name: "decimalPlaces",
		type: "number",
		control: "number",
		description: "Pins the output to this many decimal places. Left off, the locale decides."
	},
	{
		name: "numberFormat",
		type: "string",
		default: "\"en-AU\"",
		control: "select",
		options: [
			{label: "en-AU", value: "en-AU"},
			{label: "en-US", value: "en-US"},
			{label: "de-DE", value: "de-DE"},
			{label: "fr-FR", value: "fr-FR"}
		],
		description: "The locale handed to Intl.NumberFormat, which decides how the unit is written."
	}
];

interface Props {
}

export const NumberUnitsDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Number Units"
			description="A number with its unit attached, formatted the way the locale writes that unit — 150 km, 1,234.50 m, 20 °C."
			name="NumberUnits"
			previewHeight={110}
			props={NUMBER_UNITS_PROPS}
			preview={values => (
				<span style={{fontSize: "1.5rem"}}>
					<NumberUnits
						value={values.value}
						unit={values.unit}
						decimalPlaces={values.decimalPlaces}
						numberFormat={values.numberFormat}></NumberUnits>
				</span>
			)}>

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
		</ComponentDoc>
	)
}
