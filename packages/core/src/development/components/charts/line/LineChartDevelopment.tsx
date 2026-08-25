import React, {useEffect, useRef, useState} from "react";

import './LineChartDevelopment.css'
import {LineChart} from "../../../../components/charts/line/LineChart";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {ChartDataset, LegendPosition} from "../../../../components/charts/types/ChartTypes";

const DEMO_LINE_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEMO_LINE_DATASET: Array<ChartDataset> = [
	{
		label: "Runs",
		data: [820, 932, 901, 1290, 1330, 620, 410],
		borderColor: "#7c4dff",
		backgroundColor: "rgba(124, 77, 255, 0.2)"
	},
	{
		label: "Failures",
		data: [20, 32, 61, 45, 18, 12, 9],
		borderColor: "#e11d48",
		backgroundColor: "rgba(225, 29, 72, 0.2)"
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

const LINE_CHART_PROPS: Array<PropSpec> = [
	{
		name: "dataset",
		type: "Array<ChartDataset>",
		required: true,
		description: "The series to draw."
	},
	{
		name: "labels",
		type: "Array<string>",
		description: "The positions along the x axis, where the data are plain numbers rather than points."
	},
	{
		name: "xScale",
		type: "string",
		control: "select",
		options: [
			{label: "Default", value: ""},
			{label: "linear", value: "linear"},
			{label: "time", value: "time"},
			{label: "category", value: "category"},
			{label: "logarithmic", value: "logarithmic"}
		],
		description: "The Chart.js scale type for the x axis."
	},
	{
		name: "xScaleTimeUnit",
		type: "string",
		default: "\"minute\"",
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
	{
		name: "fill",
		type: "any",
		default: "false",
		control: "toggle",
		description: "Fills the area under the line. True fills to the origin; Chart.js' own values — \"start\", \"end\" — also work."
	},
	{
		name: "tension",
		type: "number",
		default: "0.2",
		control: "slider",
		min: 0,
		max: 1,
		step: 0.1,
		description: "How much the line curves between points. 0 is straight segments."
	},
	{
		name: "rangeSelect",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets a range be dragged out across the plot."
	},
	{
		name: "onRangeSelected",
		type: "(startValue: any, endValue: any) => void",
		description: "Fires with the two ends of that range."
	},
	...chartCommonProps()
];

interface Props {
}

export const LineChartDevelopment: React.FC<Props> = ({}) => {


	const [dataset1, setDataset1] = useState<Array<any>>([]);

	const [dataset2, setDataset2] = useState<Array<any>>([]);

	const [initialised, setInitialised] = useState(false);

	const initialisedRef = useRef(false);

	const interval = 500;

	// useEffect(() => {
	// 	const intervalId = setInterval(() => {
	// 		const newDataPoint1 = {
	// 			x: new Date().toISOString(), // Current timestamp
	// 			y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
	// 		};
	// 		const newDataPoint2 = {
	// 			x: new Date().toISOString(), // Current timestamp
	// 			y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
	// 		};
	// 		setDataset1((prevElements) => [
	// 			...prevElements,
	// 			newDataPoint1
	// 		]);
	// 		setDataset2((prevElements) => [
	// 			...prevElements,
	// 			newDataPoint2
	// 		]);
	// 	}, interval);
	//
	// 	// Cleanup interval on component unmount
	// 	return () => clearInterval(intervalId);
	// }, [interval]);

	useEffect(() => {
		if (!initialisedRef.current) {
			initialisedRef.current = true;
			const d1: Array<any> = [];
			const d2: Array<any> = [];
			for (var i=0; i < 50; i++) {
				const newDataPoint1 = {
					x: i, // Current timestamp
					y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
				};
				const newDataPoint2 = {
					x: i, // Current timestamp
					y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
				};
				d1.push(newDataPoint1);
				d2.push(newDataPoint2)
			}
			setDataset1((prevElements) => [
				...prevElements,
				...d1
			]);
			setDataset2((prevElements) => [
				...prevElements,
				...d2
			]);
			setInitialised(true)
		}

	}, []);

	return (
		<ComponentDoc
			title="Line Chart"
			description="A series over a continuous axis. It can fill the area under the line, follow a time scale, report the pointer so two charts move together, and hand back a dragged range."
			name="LineChart"
			previewHeight={380}
			previewCentered={false}
			imports={["ChartDataset", "LegendPosition"]}
			interfaces={[CHART_DATASET_INTERFACE]}
			props={LINE_CHART_PROPS}
			preview={values => (
				<div style={{width: "100%", height: "320px"}}>
					<LineChart
						dataset={DEMO_LINE_DATASET}
						labels={DEMO_LINE_LABELS}
						gridLines={values.gridLines}
						xLabel={values.xLabel}
						yLabel={values.yLabel}
						height="320px"
						fill={values.fill}
						tension={values.tension}
						legend={values.legend}
						legendPosition={values.legendPosition}
						interactionType={values.interactionType}
						animationTimeout={values.animationTimeout}
						rangeSelect={values.rangeSelect}
						showXValueInTooltip={values.showXValueInTooltip}
						verticalLine={values.verticalLine}
						verticalLineColor={values.verticalLineColor}
						verticalLineWidth={values.verticalLineWidth}></LineChart>
				</div>
			)}>
			{initialised &&
				<LineChart
					height={"100vh"}
					width={"100%"}
					gridLines={true}
					xLabel={"Timestamp"}
					yLabel={"Value"}
					xScale={"linear"}
					xScaleTimeUnit={"second"}
					interactionType={"nearest"}
					rangeSelect={true}
					legend={true}
					verticalLine={true}
					dataset={[{
						label: "Subscribers",
						backgroundColor: "#BB8FCE",
						borderColor: "#BB8FCE",
						borderWidth: 2,
						borderDash: [5, 5],
						data: dataset1
					},{
						label: "Subscribers 2",
						backgroundColor: '#E59866',
						borderColor: '#E59866',
						data: dataset2
					}]}></LineChart>

			}

		</ComponentDoc>
	)
}