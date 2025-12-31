import React from "react";

import './CurrencyDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {Currency} from "../../../../components/text-decorations/currency/Currency";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const CurrencyDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Currency Text Decoration</PageHeading>
			<Description>Formats numbers as currency values with locale support.</Description>

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
		</PaddedPage>
	)
}
