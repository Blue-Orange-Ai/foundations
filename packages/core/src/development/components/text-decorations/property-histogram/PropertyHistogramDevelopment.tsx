import React from "react";

import './PropertyHistogramDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {
	PropertyHistogram,
	PropertyHistogramProperty
} from "../../../../components/text-decorations/property-histogram/PropertyHistogram";

const HISTOGRAM_PROPERTY_INTERFACE = {
	name: "PropertyHistogramProperty",
	description: "One bar. Its width is its value measured against the histogram's total.",
	props: [
		{name: "label", type: "string", required: true, description: "What the bar is called."},
		{name: "value", type: "number", required: true, description: "The quantity the bar stands for."},
		{name: "color", type: "string", description: "Overrides the histogram's colour for this bar only."}
	] as Array<PropSpec>
};

const PROPERTY_HISTOGRAM_PROPS: Array<PropSpec> = [
	{
		name: "properties",
		type: "PropertyHistogramProperty[]",
		required: true,
		description: "The bars, in the order they should be stacked."
	},
	{
		name: "maxProperties",
		type: "number",
		control: "slider",
		min: 1,
		max: 6,
		step: 1,
		description: "How many bars are drawn before the rest go behind the see more button. Left off, all of them are drawn."
	},
	{
		name: "seeMore",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Shows the see more button even when nothing has been held back."
	},
	{
		name: "seeMoreLabel",
		type: "string",
		default: "\"See more\"",
		control: "text",
		description: "What the see more button reads."
	},
	{
		name: "onSeeMore",
		type: "() => void",
		description: "Fires when the see more button is clicked."
	},
	{
		name: "total",
		type: "number",
		control: "number",
		description: "What a full bar represents. Left off it is the sum of every value, so the bars read as shares of the whole."
	},
	{
		name: "tooltip",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the percentage on hover."
	},
	{
		name: "color",
		type: "string",
		control: "color",
		description: "The fill for every bar. A single bar can override it with its own color."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the histogram."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the histogram."
	}
];

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
		<ComponentDoc
			title="Property Histogram"
			description="A stack of labelled bars for a breakdown — browsers by share, runs by outcome, sites by throughput. Each bar is drawn against the total, which is the sum of the values unless one is given."
			name="PropertyHistogram"
			previewHeight={260}
			previewCentered={false}
			imports={["PropertyHistogramProperty"]}
			interfaces={[HISTOGRAM_PROPERTY_INTERFACE]}
			props={PROPERTY_HISTOGRAM_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<PropertyHistogram
						properties={BROWSERS}
						maxProperties={values.maxProperties}
						seeMore={values.seeMore}
						seeMoreLabel={values.seeMoreLabel}
						total={values.total}
						tooltip={values.tooltip}
						color={values.color}></PropertyHistogram>
				</div>
			)}>

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
		</ComponentDoc>
	)
}
