import React from "react";

import './TelephoneTextDevelopment.css'
import {TelephoneText} from "../../../../components/text-decorations/telephone/TelephoneText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const TELEPHONE_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "phone",
		type: "string",
		control: "text",
		value: "0412345678",
		description: "The number as it was entered. It is parsed against `country`."
	},
	{
		name: "country",
		type: "string",
		control: "select",
		value: "AU",
		options: [
			{label: "Australia (AU)", value: "AU"},
			{label: "United States (US)", value: "US"},
			{label: "United Kingdom (GB)", value: "GB"},
			{label: "Germany (DE)", value: "DE"},
			{label: "France (FR)", value: "FR"},
			{label: "Japan (JP)", value: "JP"}
		],
		description: "An ISO 3166 country code, which decides how the number is grouped."
	},
	{
		name: "telephone",
		type: "Telephone",
		description: "A Telephone object carrying both the number and its code, used instead of the two props above. Anything that cannot be parsed reads as \"Undefined\"."
	}
];

interface Props {
}

export const TelephoneTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Telephone Text"
			description="Prints a phone number the way its own country writes it. Give it the number and a country code, or hand it a Telephone object straight from the API."
			name="TelephoneText"
			previewHeight={110}
			props={TELEPHONE_TEXT_PROPS}
			preview={values => (
				<span style={{fontSize: "1.5rem"}}>
					<TelephoneText phone={values.phone} country={values.country}></TelephoneText>
				</span>
			)}>

			<GeneralHeading>Australian Phone Number</GeneralHeading>
			<p><TelephoneText phone="0412345678" country="AU" /></p>

			<GeneralHeading>US Phone Number</GeneralHeading>
			<p><TelephoneText phone="2025551234" country="US" /></p>

			<GeneralHeading>UK Phone Number</GeneralHeading>
			<p><TelephoneText phone="07911123456" country="GB" /></p>

			<GeneralHeading>Using Telephone Object</GeneralHeading>
			<p><TelephoneText telephone={{ number: "0412345678", code: "AU", country: "Australia", extension: null, format: null }} /></p>

			<GeneralHeading>International Format Examples</GeneralHeading>
			<div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
				<p>Germany: <TelephoneText phone="15123456789" country="DE" /></p>
				<p>France: <TelephoneText phone="0612345678" country="FR" /></p>
				<p>Japan: <TelephoneText phone="09012345678" country="JP" /></p>
			</div>
		</ComponentDoc>
	)
}
