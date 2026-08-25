import React from "react";

import './PercentageDevelopment.css'
import {Percentage} from "../../../../components/text-decorations/percentage/Percentage";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const PERCENTAGE_PROPS: Array<PropSpec> = [
	{
		name: "percent",
		type: "number",
		required: true,
		control: "slider",
		min: 0,
		max: 1,
		step: 0.0001,
		value: 0.3333,
		description: "The fraction to print. 1 is 100%."
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
		description: "The locale handed to Intl.NumberFormat, which decides the decimal mark and where the sign goes."
	}
];

interface Props {
}

export const PercentageDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Percentage"
			description="Prints a fraction as a percentage. The value is the fraction itself — 0.5 reads as 50% — so it can be handed straight from a ratio without being scaled first."
			name="Percentage"
			previewHeight={110}
			props={PERCENTAGE_PROPS}
			preview={values => (
				<span style={{fontSize: "1.5rem"}}>
					<Percentage percent={values.percent} decimalPlaces={values.decimalPlaces} numberFormat={values.numberFormat}></Percentage>
				</span>
			)}>

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
		</ComponentDoc>
	)
}
