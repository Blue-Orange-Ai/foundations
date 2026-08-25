import React, {useEffect, useState} from "react";

import './BarChartDevelopment.css'
import {BarChart} from "../../../../components/charts/bar/BarChart";
import {ChartDataset, LegendPosition} from "../../../../components/charts/types/ChartTypes";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const DEMO_BAR_LABELS = ["Melbourne", "Geelong", "Ballarat", "Bendigo"];

const DEMO_BAR_DATASET: Array<ChartDataset> = [
	{
		label: "Runs",
		data: [12840, 4120, 980, 2340],
		backgroundColor: "#7c4dff",
		borderRadius: 4
	},
	{
		label: "Failures",
		data: [220, 96, 310, 44],
		backgroundColor: "#e11d48",
		borderRadius: 4
	}
];

const CHART_LEGEND_OPTIONS = [
	{label: "Bottom", value: LegendPosition.BOTTOM, code: "LegendPosition.BOTTOM"},
	{label: "Top", value: LegendPosition.TOP, code: "LegendPosition.TOP"},
	{label: "Top left", value: LegendPosition.TOP_LEFT, code: "LegendPosition.TOP_LEFT"},
	{label: "Top right", value: LegendPosition.TOP_RIGHT, code: "LegendPosition.TOP_RIGHT"},
	{label: "Bottom left", value: LegendPosition.BOTTOM_LEFT, code: "LegendPosition.BOTTOM_LEFT"},
	{label: "Bottom right", value: LegendPosition.BOTTOM_RIGHT, code: "LegendPosition.BOTTOM_RIGHT"}
];

const CHART_DATASET_INTERFACE = {
	name: "ChartDataset",
	description: "One series. Chart.js reads these straight through, so anything it understands about a dataset can be set here.",
	props: [
		{name: "label", type: "string", required: true, description: "The series name, shown in the legend and the tooltip."},
		{name: "data", type: "Array<any>", required: true, description: "The points. Numbers against `labels`, or {x, y} objects for a scaled axis."},
		{name: "borderColor", type: "string", description: "The line or bar outline."},
		{name: "backgroundColor", type: "string", description: "The fill."},
		{name: "borderWidth", type: "number", description: "How thick that outline is."},
		{name: "fill", type: "boolean | string", description: "Whether the area under a line is filled, and to where."},
		{name: "borderRadius", type: "number", description: "Corner radius on a bar."},
		{name: "yAxisID", type: "string", description: "Which y axis the series is measured against, for a chart with two."}
	] as Array<PropSpec>
};

/** The props every chart in the library shares. */
const chartCommonProps = (): Array<PropSpec> => [
	{
		name: "gridLines",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the grid behind the plot."
	},
	{
		name: "xLabel",
		type: "string",
		control: "text",
		description: "The title under the x axis."
	},
	{
		name: "yLabel",
		type: "string",
		control: "text",
		description: "The title beside the y axis."
	},
	{
		name: "height",
		type: "string",
		default: "\"100%\"",
		control: "text",
		description: "Height of the canvas, as a CSS length."
	},
	{
		name: "width",
		type: "string",
		default: "\"100%\"",
		control: "text",
		description: "Width of the canvas, as a CSS length."
	},
	{
		name: "interactionType",
		type: "string",
		default: "\"index\"",
		control: "select",
		options: [
			{label: "index", value: "index"},
			{label: "nearest", value: "nearest"}
		],
		description: "`index` picks up every series at the hovered position; `nearest` picks up only the closest point."
	},
	{
		name: "animationTimeout",
		type: "number",
		default: "2000",
		control: "number",
		description: "How long the entry animation runs, in milliseconds."
	},
	{
		name: "legend",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the legend."
	},
	{
		name: "legendPosition",
		type: "LegendPosition",
		default: "LegendPosition.BOTTOM",
		defaultValue: LegendPosition.BOTTOM,
		control: "select",
		options: CHART_LEGEND_OPTIONS,
		description: "Where the legend sits."
	},
	{
		name: "tooltip",
		type: "TooltipConfig",
		description: "Full control over the tooltip — its header, the per point label and value, and any extra rows under them."
	},
	{
		name: "showXValueInTooltip",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts the x value in the tooltip header."
	},
	{
		name: "xValueFormatter",
		type: "(value: any) => string",
		description: "Formats that x value."
	},
	{
		name: "verticalLine",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Draws a crosshair down the plot at the pointer."
	},
	{
		name: "verticalLineColor",
		type: "string",
		default: "\"red\"",
		control: "color",
		description: "The colour of that crosshair."
	},
	{
		name: "verticalLineWidth",
		type: "number",
		default: "1",
		control: "number",
		description: "How thick it is."
	},
	{
		name: "verticalLineDash",
		type: "Array<number>",
		description: "A dash pattern for it, as Chart.js takes one."
	},
	{
		name: "onCursorMove",
		type: "(position: CursorPosition | null) => void",
		description: "Fires as the pointer moves over the plot — how two charts are kept in step."
	},
	{
		name: "cursorValue",
		type: "any",
		description: "Puts the crosshair at this x value from the outside, which is the other half of that."
	}
];

const BAR_CHART_PROPS: Array<PropSpec> = [
	{
		name: "dataset",
		type: "Array<ChartDataset>",
		required: true,
		description: "The series to draw, one entry per set of bars."
	},
	{
		name: "labels",
		type: "Array<string>",
		description: "The categories along the index axis."
	},
	{
		name: "indexAxis",
		type: "string",
		default: "\"x\"",
		control: "select",
		options: [
			{label: "x — vertical bars", value: "x"},
			{label: "y — horizontal bars", value: "y"}
		],
		description: "Which axis the categories sit on. `x` stands the bars up, `y` lays them across."
	},
	...chartCommonProps()
];

interface Props {
}

export const BarChartDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Bar Chart"
			description="Bars over a category axis. The index axis decides whether they stand up or run across, and everything else — the legend, the crosshair, the tooltip — is shared with the other charts."
			name="BarChart"
			previewHeight={380}
			previewCentered={false}
			imports={["ChartDataset", "LegendPosition"]}
			interfaces={[CHART_DATASET_INTERFACE]}
			props={BAR_CHART_PROPS}
			preview={values => (
				<div style={{width: "100%", height: "320px"}}>
					<BarChart
						dataset={DEMO_BAR_DATASET}
						labels={DEMO_BAR_LABELS}
						indexAxis={values.indexAxis}
						gridLines={values.gridLines}
						xLabel={values.xLabel}
						yLabel={values.yLabel}
						height="320px"
						legend={values.legend}
						legendPosition={values.legendPosition}
						interactionType={values.interactionType}
						animationTimeout={values.animationTimeout}
						showXValueInTooltip={values.showXValueInTooltip}
						verticalLine={values.verticalLine}
						verticalLineColor={values.verticalLineColor}
						verticalLineWidth={values.verticalLineWidth}></BarChart>
				</div>
			)}>
			<BarChart
			 	indexAxis={"x"}
			 	height={"400px"}
				gridLines={true}
				legend={false}
				verticalLine={true}
				verticalLineColor={"#2d88ff"}
				labels={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
				dataset={[{
					label: "Subscribers",
					backgroundColor: "#BB8FCE",
					borderColor: "#BB8FCE",
					data: [0, 20, 5, 10, 50],
					borderRadius: 4
				}]}></BarChart>
		</ComponentDoc>
	)
}