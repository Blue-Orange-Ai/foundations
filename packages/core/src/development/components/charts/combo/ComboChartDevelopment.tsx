import React, {useEffect, useRef, useState} from "react";

import './ComboChartDevelopment.css'
import {LineChart} from "../../../../components/charts/line/LineChart";
import {ComboChart} from "../../../../components/charts/combo/ComboChart";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {LegendPosition} from "../../../../components/charts/types/ChartTypes";

const DEMO_COMBO_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEMO_COMBO_DATASET: Array<any> = [
	{
		type: "bar",
		label: "Runs",
		data: [820, 932, 901, 1290, 1330, 620, 410],
		backgroundColor: "#7c4dff",
		borderRadius: 4
	},
	{
		type: "line",
		label: "Median duration",
		data: [14, 16, 15, 19, 22, 12, 9],
		borderColor: "#e11d48",
		yAxisID: "y1"
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

const COMBO_CHART_PROPS: Array<PropSpec> = [
	{
		name: "dataset",
		type: "Array<AnyDataset>",
		required: true,
		description: "The series. Each one names its own `type` — bar or line — which is what makes the chart a combo."
	},
	{
		name: "labels",
		type: "Array<string>",
		description: "The positions along the x axis."
	},
	{
		name: "xScale",
		type: "string",
		control: "select",
		options: [
			{label: "Default", value: ""},
			{label: "linear", value: "linear"},
			{label: "time", value: "time"},
			{label: "category", value: "category"}
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
		description: "Fills the area under the line datasets."
	},
	{
		name: "tension",
		type: "number",
		default: "0.2",
		control: "slider",
		min: 0,
		max: 1,
		step: 0.1,
		description: "How much the lines curve between points."
	},
	{
		name: "stackedBars",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stacks the bar datasets on top of each other rather than beside."
	},
	{
		name: "stackedAreas",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stacks the filled line datasets."
	},
	{
		name: "stackId",
		type: "string",
		default: "\"default\"",
		control: "text",
		description: "Groups datasets into separate stacks."
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

export const ComboChartDevelopment: React.FC<Props> = ({}) => {

	const [dataset1, setDataset1] = useState<Array<any>>([]);

	const [dataset2, setDataset2] = useState<Array<any>>([]);

	const [initialised, setInitialised] = useState(false);

	// Shared x position for the synchronised-crosshair demo below.
	const [syncedCursor, setSyncedCursor] = useState<any>(null);

	const initialisedRef = useRef(false);

	const interval = 1000;

	useEffect(() => {
		const intervalId = setInterval(() => {
			const newDataPoint1 = {
				x: new Date().toISOString(), // Current timestamp
				y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
			};
			const newDataPoint2 = {
				x: new Date().toISOString(), // Current timestamp
				y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
			};
			setDataset1((prevElements) => [
				...prevElements,
				newDataPoint1
			]);
			setDataset2((prevElements) => [
				...prevElements,
				newDataPoint2
			]);
		}, interval);

		// Cleanup interval on component unmount
		return () => clearInterval(intervalId);
	}, [interval]);

	return (
		<ComponentDoc
			title="Combo Chart"
			description="Bars and lines on the same plot. Each dataset says which it is, they can be stacked into groups, and a range can be dragged out across the axis."
			name="ComboChart"
			previewHeight={380}
			previewCentered={false}
			imports={["LegendPosition"]}
			interfaces={[CHART_DATASET_INTERFACE]}
			props={COMBO_CHART_PROPS}
			preview={values => (
				<div style={{width: "100%", height: "320px"}}>
					<ComboChart
						dataset={DEMO_COMBO_DATASET}
						labels={DEMO_COMBO_LABELS}
						gridLines={values.gridLines}
						xLabel={values.xLabel}
						yLabel={values.yLabel}
						height="320px"
						tension={values.tension}
						legend={values.legend}
						legendPosition={values.legendPosition}
						interactionType={values.interactionType}
						animationTimeout={values.animationTimeout}
						stackedBars={values.stackedBars}
						stackedAreas={values.stackedAreas}
						rangeSelect={values.rangeSelect}
						showXValueInTooltip={values.showXValueInTooltip}
						verticalLine={values.verticalLine}
						verticalLineColor={values.verticalLineColor}
						verticalLineWidth={values.verticalLineWidth}></ComboChart>
				</div>
			)}>
			{/* Regular Combo Chart with Basic X-Value Tooltip */}
			<div>
				<h3>Regular Combo Chart with Basic X-Value Tooltip</h3>
				<ComboChart
					height={"50vh"}
					width={"100%"}
					dataset={[
						{ type: 'line', label: 'CPU %', parsing: false, data: [
								{x: 1719705600000, y: 12}, {x: 1719709200000, y: 18}
							], borderColor: '#2d88ff' },
						{ type: 'scatter', label: 'Events', parsing: false, data: [
								{x: 1719707000000, y: 20}, {x: 1719708200000, y: 35}
							], borderColor: '#ff7a00', backgroundColor: '#ff7a00' },
					]}
					xScale="time"
					xScaleTimeUnit="minute"
					yScale="linear"
					showXValueInTooltip={true}
					legend
					rangeSelect
				/>
			</div>

			{/* Stacked Area Chart with X-Value Tooltip */}
			<div style={{marginTop: '40px'}}>
				<h3>Stacked Area Chart with X-Value in Tooltip</h3>
				<ComboChart
					height={"50vh"}
					width={"100%"}
					dataset={[
						{ type: 'line', label: 'Network In', parsing: false, data: [
								{x: 1719705600000, y: 10}, {x: 1719706500000, y: 15}, {x: 1719707400000, y: 12}, {x: 1719708300000, y: 18}, {x: 1719709200000, y: 20}
							], borderColor: '#2d88ff', backgroundColor: 'rgba(45, 136, 255, 0.3)' },
						{ type: 'line', label: 'Network Out', parsing: false, data: [
								{x: 1719705600000, y: 8}, {x: 1719706500000, y: 12}, {x: 1719707400000, y: 10}, {x: 1719708300000, y: 14}, {x: 1719709200000, y: 16}
							], borderColor: '#ff7a00', backgroundColor: 'rgba(255, 122, 0, 0.3)' },
						{ type: 'line', label: 'Disk I/O', parsing: false, data: [
								{x: 1719705600000, y: 5}, {x: 1719706500000, y: 8}, {x: 1719707400000, y: 6}, {x: 1719708300000, y: 9}, {x: 1719709200000, y: 11}
							], borderColor: '#28a745', backgroundColor: 'rgba(40, 167, 69, 0.3)' },
					]}
					xScale="time"
					xScaleTimeUnit="minute"
					yScale="linear"
					stackedAreas={true}
					showXValueInTooltip={true}
					xValueFormatter={(value) => new Date(value).toLocaleString()}
					legend
					rangeSelect
				/>
			</div>

			{/* Stacked Area Chart with Vertical Cursor Line + Custom Tooltip */}
			<div style={{marginTop: '40px'}}>
				<h3>Stacked Area Chart with Vertical Cursor Line + Fully Custom Tooltip</h3>
				<ComboChart
					height={"50vh"}
					width={"100%"}
					dataset={[
						{ type: 'line', label: 'Network In', parsing: false, data: [
								{x: 1719705600000, y: 10}, {x: 1719706500000, y: 15}, {x: 1719707400000, y: 12}, {x: 1719708300000, y: 18}, {x: 1719709200000, y: 20}
							], borderColor: '#2d88ff', backgroundColor: 'rgba(45, 136, 255, 0.3)' },
						{ type: 'line', label: 'Network Out', parsing: false, data: [
								{x: 1719705600000, y: 8}, {x: 1719706500000, y: 12}, {x: 1719707400000, y: 10}, {x: 1719708300000, y: 14}, {x: 1719709200000, y: 16}
							], borderColor: '#ff7a00', backgroundColor: 'rgba(255, 122, 0, 0.3)' },
					]}
					xScale="time"
					xScaleTimeUnit="minute"
					yScale="linear"
					stackedAreas={true}
					legend
					// Vertical cursor line (default red; customised here to a dashed grey)
					verticalLine={true}
					verticalLineColor="#888"
					verticalLineWidth={1}
					verticalLineDash={[4, 4]}
					// Full control over the tooltip: dynamic x header, custom y labels,
					// plus a static field and a dynamic (computed total) field.
					tooltip={{
						xLabel: (ctx) => new Date(ctx.xValue).toLocaleTimeString(),
						yLabel: (dp) => `${dp.datasetLabel} throughput`,
						valueFormatter: (dp) => `${dp.formattedValue} MB/s`,
						fields: [
							{ label: 'Source', value: 'edge-node-1' },
							{
								label: 'Total',
								value: (ctx) =>
									`${ctx.dataPoints.reduce((sum, dp) => sum + Number(dp.formattedValue), 0)} MB/s`,
							},
						],
					}}
				/>
				<p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
					<em>Move the cursor across the chart: a dashed vertical line follows the pointer so you can read the
					granular x position even when the semi-transparent stacked fills blend. The tooltip mixes dynamic
					x/y labels with static and computed fields.</em>
				</p>
			</div>

			{/* Synchronised Crosshair Across Two Charts Sharing an X Axis */}
			<div style={{marginTop: '40px'}}>
				<h3>Synchronised Crosshair Across Charts (shared X axis)</h3>
				<p style={{fontSize: '14px', color: '#666'}}>
					<em>Hover either chart: onCursorMove reports the x value, which is fed into the other chart's
					cursorValue so a red crosshair appears at the same x position on both.</em>
				</p>
				{[
					{title: 'Requests / sec', color: '#2d88ff', data: [
							{x: 1719705600000, y: 30}, {x: 1719706500000, y: 42}, {x: 1719707400000, y: 38}, {x: 1719708300000, y: 55}, {x: 1719709200000, y: 48}
						]},
					{title: 'Latency (ms)', color: '#e83e8c', data: [
							{x: 1719705600000, y: 120}, {x: 1719706500000, y: 95}, {x: 1719707400000, y: 140}, {x: 1719708300000, y: 88}, {x: 1719709200000, y: 110}
						]},
				].map((chart) => (
					<div key={chart.title} style={{marginTop: '16px'}}>
						<ComboChart
							height={"30vh"}
							width={"100%"}
							dataset={[
								{type: 'line', label: chart.title, parsing: false, data: chart.data, borderColor: chart.color, backgroundColor: 'transparent'},
							]}
							xScale="time"
							xScaleTimeUnit="minute"
							yScale="linear"
							legend
							verticalLine={true}
							onCursorMove={(pos) => setSyncedCursor(pos ? pos.x : null)}
							cursorValue={syncedCursor}
							showXValueInTooltip={true}
							xValueFormatter={(value) => new Date(value).toLocaleTimeString()}
						/>
					</div>
				))}
			</div>

			{/* Stacked Bar Chart with Custom X-Value Format */}
			<div style={{marginTop: '40px'}}>
				<h3>Stacked Bar Chart with Custom X-Value Format</h3>
				<ComboChart
					height={"50vh"}
					width={"100%"}
					dataset={[
						{ type: 'bar', label: 'Sales Q1', data: [
								{x: 'Jan', y: 100}, {x: 'Feb', y: 120}, {x: 'Mar', y: 110}, {x: 'Apr', y: 140}
							], backgroundColor: 'rgba(45, 136, 255, 0.7)', borderColor: '#2d88ff' },
						{ type: 'bar', label: 'Sales Q2', data: [
								{x: 'Jan', y: 80}, {x: 'Feb', y: 90}, {x: 'Mar', y: 95}, {x: 'Apr', y: 105}
							], backgroundColor: 'rgba(255, 122, 0, 0.7)', borderColor: '#ff7a00' },
						{ type: 'bar', label: 'Sales Q3', data: [
								{x: 'Jan', y: 60}, {x: 'Feb', y: 70}, {x: 'Mar', y: 75}, {x: 'Apr', y: 85}
							], backgroundColor: 'rgba(40, 167, 69, 0.7)', borderColor: '#28a745' },
					]}
					xScale="category"
					yScale="linear"
					stackedBars={true}
					showXValueInTooltip={true}
					xValueFormatter={(value) => `Month: ${value}`}
					legend
					rangeSelect
				/>
			</div>

			{/* Mixed Stacked Chart */}
			<div style={{marginTop: '40px'}}>
				<h3>Mixed Chart with Stacked Areas and Regular Line</h3>
				<ComboChart
					height={"50vh"}
					width={"100%"}
					dataset={[
						{ type: 'line', label: 'Memory Base', parsing: false, data: [
								{x: 1719705600000, y: 20}, {x: 1719706500000, y: 25}, {x: 1719707400000, y: 22}, {x: 1719708300000, y: 28}, {x: 1719709200000, y: 30}
							], borderColor: '#6f42c1', backgroundColor: 'rgba(111, 66, 193, 0.3)', stack: 'memory' },
						{ type: 'line', label: 'Memory Cache', parsing: false, data: [
								{x: 1719705600000, y: 15}, {x: 1719706500000, y: 18}, {x: 1719707400000, y: 16}, {x: 1719708300000, y: 20}, {x: 1719709200000, y: 22}
							], borderColor: '#e83e8c', backgroundColor: 'rgba(232, 62, 140, 0.3)', stack: 'memory' },
						{ type: 'line', label: 'CPU Usage', parsing: false, data: [
								{x: 1719705600000, y: 45}, {x: 1719706500000, y: 52}, {x: 1719707400000, y: 48}, {x: 1719708300000, y: 55}, {x: 1719709200000, y: 60}
							], borderColor: '#fd7e14', backgroundColor: 'transparent', fill: false },
					]}
					xScale="time"
					xScaleTimeUnit="minute"
					yScale="linear"
					stackedAreas={true}
					showXValueInTooltip={true}
					xValueFormatter={(value) => `Time: ${new Date(value).toLocaleTimeString()}`}
					legend
					rangeSelect
				/>
			</div>

			{/* Simple Line Chart without X-Value Tooltip for Comparison */}
			<div style={{marginTop: '40px'}}>
				<h3>Comparison: Chart without X-Value Tooltip</h3>
				<ComboChart
					height={"40vh"}
					width={"100%"}
					dataset={[
						{ type: 'line', label: 'Temperature', parsing: false, data: [
								{x: 1719705600000, y: 22}, {x: 1719706500000, y: 25}, {x: 1719707400000, y: 23}, {x: 1719708300000, y: 27}, {x: 1719709200000, y: 24}
							], borderColor: '#17a2b8', backgroundColor: 'transparent' },
					]}
					xScale="time"
					xScaleTimeUnit="minute"
					yScale="linear"
					showXValueInTooltip={false}
					legend
				/>
				<p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
					<em>This chart shows the tooltip without x-value display for comparison</em>
				</p>
			</div>

			{/* Persistent Range Selection Examples */}
			<div style={{marginTop: '40px'}}>
				<h3>Persistent Range Selection - With Initial Range</h3>
				<ComboChart
					height={"50vh"}
					width={"100%"}
					dataset={[
						{ type: 'line', label: 'CPU %', parsing: false, data: [
								{x: 1719705600000, y: 12}, {x: 1719706500000, y: 18}, {x: 1719707400000, y: 15}, 
								{x: 1719708300000, y: 22}, {x: 1719709200000, y: 25}, {x: 1719710100000, y: 20}
							], borderColor: '#2d88ff' },
						{ type: 'scatter', label: 'Events', parsing: false, data: [
								{x: 1719707000000, y: 20}, {x: 1719708200000, y: 35}, {x: 1719709800000, y: 28}
							], borderColor: '#ff7a00', backgroundColor: '#ff7a00' },
					]}
					xScale="time"
					xScaleTimeUnit="minute"
					yScale="linear"
					showXValueInTooltip={true}
					xValueFormatter={(value) => new Date(value).toLocaleString()}
					legend
					persistentRangeSelect={true}
					initialRange={{ start: 1719707000000, end: 1719708500000 }}
					onPersistentRangeChange={(start, end) => {
						console.log('Persistent range changed:', { start, end });
					}}
				/>
				<p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
					<em>This chart starts with a predefined range. Drag the blue handles to resize or drag the area to move it.</em>
				</p>
			</div>

			<div style={{marginTop: '40px'}}>
				<h3>Persistent Range Selection - User Initiated</h3>
				<ComboChart
					height={"50vh"}
					width={"100%"}
					dataset={[
						{ type: 'line', label: 'Memory Usage', parsing: false, data: [
								{x: 1719705600000, y: 45}, {x: 1719706500000, y: 52}, {x: 1719707400000, y: 48}, 
								{x: 1719708300000, y: 55}, {x: 1719709200000, y: 60}, {x: 1719710100000, y: 58}
							], borderColor: '#28a745' },
						{ type: 'bar', label: 'Disk I/O', parsing: false, data: [
								{x: 1719705600000, y: 15}, {x: 1719706500000, y: 22}, {x: 1719707400000, y: 18}, 
								{x: 1719708300000, y: 25}, {x: 1719709200000, y: 30}, {x: 1719710100000, y: 28}
							], backgroundColor: 'rgba(255, 122, 0, 0.7)', borderColor: '#ff7a00' },
					]}
					xScale="time"
					xScaleTimeUnit="minute"
					yScale="linear"
					showXValueInTooltip={true}
					xValueFormatter={(value) => new Date(value).toLocaleString()}
					legend
					persistentRangeSelect={true}
					onPersistentRangeChange={(start, end) => {
						console.log('User-initiated range:', { start, end });
					}}
				/>
				<p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
					<em>No initial range - click and drag on the chart to create a persistent range selection.</em>
				</p>
			</div>

			<div style={{marginTop: '40px'}}>
				<h3>Persistent Range Selection - Category Data</h3>
				<ComboChart
					height={"50vh"}
					width={"100%"}
					dataset={[
						{ type: 'bar', label: 'Sales', data: [
								{x: 'Jan', y: 100}, {x: 'Feb', y: 120}, {x: 'Mar', y: 110}, 
								{x: 'Apr', y: 140}, {x: 'May', y: 130}, {x: 'Jun', y: 150}
							], backgroundColor: 'rgba(45, 136, 255, 0.7)', borderColor: '#2d88ff' },
					]}
					xScale="category"
					yScale="linear"
					showXValueInTooltip={true}
					xValueFormatter={(value) => `Month: ${value}`}
					legend
					persistentRangeSelect={true}
					initialRange={{ start: 'Feb', end: 'Apr' }}
					onPersistentRangeChange={(start, end) => {
						console.log('Category range changed:', { start, end });
					}}
				/>
				<p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
					<em>Persistent range selection also works with category scales.</em>
				</p>
			</div>

		</ComponentDoc>
	)
}