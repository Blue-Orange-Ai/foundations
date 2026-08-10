import React from "react";

import './PropertyHistogramDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {
	PropertyHistogram,
	PropertyHistogramProperty
} from "../../../../components/text-decorations/property-histogram/PropertyHistogram";

interface Props {
}

const BROWSERS: PropertyHistogramProperty[] = [
	{label: "Chrome", value: 620},
	{label: "Safari", value: 210},
	{label: "Firefox", value: 90},
	{label: "Edge", value: 55},
	{label: "Opera", value: 15},
	{label: "Brave", value: 10}
];

const STATUSES: PropertyHistogramProperty[] = [
	{label: "Succeeded", value: 84, color: "#16a34b"},
	{label: "Failed", value: 9, color: "#e11d48"},
	{label: "Cancelled", value: 7, color: "#f97317"}
];

export const PropertyHistogramDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Property Histogram</PageHeading>

			<GeneralHeading>Default</GeneralHeading>
			<PropertyHistogram properties={BROWSERS}></PropertyHistogram>

			<GeneralHeading>Max properties with see more</GeneralHeading>
			<PropertyHistogram
				properties={BROWSERS}
				maxProperties={3}
				onSeeMore={() => alert("See more clicked")}
			></PropertyHistogram>

			<GeneralHeading>See more forced by the flag</GeneralHeading>
			<PropertyHistogram
				properties={BROWSERS.slice(0, 3)}
				seeMore={true}
				seeMoreLabel={"View all browsers"}
				onSeeMore={() => alert("See more clicked")}
			></PropertyHistogram>

			<GeneralHeading>Tooltip disabled</GeneralHeading>
			<PropertyHistogram properties={BROWSERS} tooltip={false}></PropertyHistogram>

			<GeneralHeading>Per property colours</GeneralHeading>
			<PropertyHistogram properties={STATUSES}></PropertyHistogram>

			<GeneralHeading>Explicit total</GeneralHeading>
			<PropertyHistogram properties={STATUSES} total={200} color={"#2d88ff"}></PropertyHistogram>
		</PaddedPage>
	)
}
