import React, {useEffect, useState} from "react";

import './ScatterChartDevelopment.css'
import {ScatterChart} from "../../../../components/charts/scatter/ScatterChart";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {ChartDataset, LegendPosition} from "../../../../components/charts/types/ChartTypes";

const DEMO_SCATTER_DATASET: Array<ChartDataset> = [
	{
		label: "Runs",
		data: [
			{x: 12, y: 820}, {x: 18, y: 932}, {x: 24, y: 901}, {x: 30, y: 1290},
			{x: 36, y: 1330}, {x: 42, y: 620}, {x: 48, y: 410}
		],
		backgroundColor: "#7c4dff"
	},
	{
		label: "Failures",
		data: [
			{x: 12, y: 120}, {x: 18, y: 232}, {x: 24, y: 301}, {x: 30, y: 190},
			{x: 36, y: 330}, {x: 42, y: 220}, {x: 48, y: 110}
		],
		backgroundColor: "#e11d48"
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

const SCATTER_CHART_PROPS: Array<PropSpec> = [
	{
		name: "dataset",
		type: "Array<ChartDataset>",
		required: true,
		description: "The series to plot. Each point is an {x, y} object."
	},
	{
		name: "xScale",
		type: "string",
		control: "select",
		options: [
			{label: "Default", value: ""},
			{label: "linear", value: "linear"},
			{label: "time", value: "time"},
			{label: "logarithmic", value: "logarithmic"}
		],
		description: "The Chart.js scale type for the x axis."
	},
	{
		name: "xScaleTimeUnit",
		type: "string",
		control: "text",
		description: "The unit a time scale ticks in."
	},
	{
		name: "yScale",
		type: "string",
		control: "select",
		options: [
			{label: "Default", value: ""},
			{label: "linear", value: "linear"},
			{label: "logarithmic", value: "logarithmic"}
		],
		description: "The scale type for the y axis."
	},
	...chartCommonProps()
];

interface Props {
}

export const ScatterChartDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Scatter Chart"
			description="Points plotted against two scaled axes. There are no labels — each dataset carries {x, y} points of its own — so it is the chart for a relationship rather than a series over time."
			name="ScatterChart"
			previewHeight={380}
			previewCentered={false}
			imports={["ChartDataset", "LegendPosition"]}
			interfaces={[CHART_DATASET_INTERFACE]}
			props={SCATTER_CHART_PROPS}
			preview={values => (
				<div style={{width: "100%", height: "320px"}}>
					<ScatterChart
						dataset={DEMO_SCATTER_DATASET}
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
						verticalLineWidth={values.verticalLineWidth}></ScatterChart>
				</div>
			)}>
			<ScatterChart
				height={"400px"}
				gridLines={true}
				xScale={"linear"}
				verticalLine={true}
				verticalLineDash={[4, 4]}
				dataset={[{
					label: "Subscribers",
					backgroundColor: "#BB8FCE",
					borderColor: "#BB8FCE",
					data: [{ x: -10, y: 0 },
						{ x: 0, y: 10 },
						{ x: 10, y: 5 },
						{ x: 20, y: -10 },
						{ x: 25, y: -5 }]
				},{
					label: "Subscribers 2",
					backgroundColor: '#E59866',
					borderColor: '#E59866',
					data: [{ x: -30, y: 0 },
						{ x: 30, y: 20 },
						{ x: 40, y: -5 },
						{ x: 50, y: -10 },
						{ x: 65, y: -50 }]
				}]}></ScatterChart>
		</ComponentDoc>
	)
}