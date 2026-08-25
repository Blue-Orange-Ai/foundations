import React from "react";

import './CurrencyDevelopment.css'
import {Currency} from "../../../../components/text-decorations/currency/Currency";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const LOCALE_OPTIONS = [
	{label: "en-AU", value: "en-AU"},
	{label: "en-US", value: "en-US"},
	{label: "en-GB", value: "en-GB"},
	{label: "de-DE", value: "de-DE"},
	{label: "ja-JP", value: "ja-JP"}
];

const CURRENCY_PROPS: Array<PropSpec> = [
	{
		name: "amount",
		type: "number",
		required: true,
		control: "number",
		value: 1234.56,
		description: "The amount, in whole currency units."
	},
	{
		name: "currency",
		type: "string",
		required: true,
		control: "select",
		value: "AUD",
		options: [
			{label: "AUD", value: "AUD"},
			{label: "USD", value: "USD"},
			{label: "EUR", value: "EUR"},
			{label: "GBP", value: "GBP"},
			{label: "JPY", value: "JPY"}
		],
		description: "An ISO 4217 code. It decides the symbol and how many decimal places are shown."
	},
	{
		name: "numberFormat",
		type: "string",
		default: "\"en-AU\"",
		control: "select",
		options: LOCALE_OPTIONS,
		description: "The locale handed to Intl.NumberFormat, which decides the grouping and where the symbol goes."
	}
];

interface Props {
}

export const CurrencyDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Currency"
			description="Prints a number as money. The locale decides where the symbol sits and how the digits are grouped, so the same amount reads correctly wherever it is shown."
			name="Currency"
			previewHeight={110}
			props={CURRENCY_PROPS}
			preview={values => (
				<span style={{fontSize: "1.5rem"}}>
					<Currency amount={values.amount} currency={values.currency} numberFormat={values.numberFormat}></Currency>
				</span>
			)}>

			<GeneralHeading>Australian Dollars (Default)</GeneralHeading>
			<p><Currency amount={1234.56} currency="AUD" /></p>

			<GeneralHeading>US Dollars</GeneralHeading>
			<p><Currency amount={1234.56} currency="USD" numberFormat="en-US" /></p>

			<GeneralHeading>Euros</GeneralHeading>
			<p><Currency amount={1234.56} currency="EUR" numberFormat="de-DE" /></p>

			<GeneralHeading>British Pounds</GeneralHeading>
			<p><Currency amount={1234.56} currency="GBP" numberFormat="en-GB" /></p>

			<GeneralHeading>Japanese Yen</GeneralHeading>
			<p><Currency amount={1234} currency="JPY" numberFormat="ja-JP" /></p>

			<GeneralHeading>Large Amount</GeneralHeading>
			<p><Currency amount={1000000.99} currency="AUD" /></p>
		</ComponentDoc>
	)
}
