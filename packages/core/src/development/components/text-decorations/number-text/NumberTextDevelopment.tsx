import React from "react";

import './NumberTextDevelopment.css'
import {NumberText} from "../../../../components/text-decorations/number-text/NumberText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const NUMBER_LOCALE_OPTIONS = [
	{label: "en-AU", value: "en-AU"},
	{label: "en-US", value: "en-US"},
	{label: "de-DE", value: "de-DE"},
	{label: "fr-FR", value: "fr-FR"},
	{label: "hi-IN", value: "hi-IN"}
];

const NUMBER_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "number",
		required: true,
		control: "number",
		value: 1234567.891,
		description: "The number to print."
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
		options: NUMBER_LOCALE_OPTIONS,
		description: "The locale handed to Intl.NumberFormat, which decides the grouping and the decimal mark."
	}
];

interface Props {
}

export const NumberTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Number Text"
			description="Prints a number with the grouping the locale expects, and to a fixed number of decimal places when one is asked for."
			name="NumberText"
			previewHeight={110}
			props={NUMBER_TEXT_PROPS}
			preview={values => (
				<span style={{fontSize: "1.5rem"}}>
					<NumberText value={values.value} decimalPlaces={values.decimalPlaces} numberFormat={values.numberFormat}></NumberText>
				</span>
			)}>

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
		</ComponentDoc>
	)
}
