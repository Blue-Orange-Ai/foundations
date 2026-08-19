import React from "react";

import {Input, Toggle} from "@blue-orange-ai/foundations-core";
import {ChartBlockData, ChartKind} from "../ChartBlockTypes";
import {applyKind} from "../chartConfigOps";
import {ChartSelect} from "./ChartSelect";

interface Props {
	data: ChartBlockData,
	onChange: (data: ChartBlockData) => void,
}

export const CHART_KINDS: Array<{kind: ChartKind, label: string, icon: string}> = [
	{kind: "line", label: "Line", icon: "ri-line-chart-line"},
	{kind: "area", label: "Area", icon: "ri-line-chart-fill"},
	{kind: "bar", label: "Bar", icon: "ri-bar-chart-2-line"},
	{kind: "horizontal-bar", label: "Horizontal bar", icon: "ri-bar-chart-horizontal-line"},
	{kind: "scatter", label: "Scatter", icon: "ri-bubble-chart-line"},
	{kind: "combo", label: "Combo", icon: "ri-bar-chart-grouped-line"},
];

const TIME_UNITS = ["millisecond", "second", "minute", "hour", "day", "week", "month", "quarter", "year"];

/** Chart type and everything about how the axes, legend and frame are drawn. */
export const ChartAppearancePanel: React.FC<Props> = ({data, onChange}) => {

	const setOption = (patch: Partial<ChartBlockData["options"]>) => {
		onChange({...data, options: {...data.options, ...patch}});
	};

	// Stacking is drawn by ComboChart (see rendersAsCombo), which handles bar
	// and area marks; horizontal bars and scatter have no stacked form here.
	const supportsStacking = data.kind === "bar" || data.kind === "combo" || data.kind === "area";
	const supportsScaleChoice = data.kind !== "bar" && data.kind !== "horizontal-bar";

	return (
		<div className="blue-orange-chart-config-panel">

			<div className="blue-orange-chart-config-section">
				<div className="blue-orange-chart-config-section-title">Chart type</div>
				<div className="blue-orange-chart-kind-grid">
					{CHART_KINDS.map((option) => (
						<button
							key={option.kind}
							type="button"
							className={
								"blue-orange-chart-kind-option" +
								(data.kind === option.kind ? " blue-orange-chart-kind-option-active" : "")
							}
							onClick={() => onChange(applyKind(data, option.kind))}
						>
							<i className={option.icon}></i>
							<span>{option.label}</span>
						</button>
					))}
				</div>
				{data.kind === "combo" &&
					<div className="blue-orange-chart-config-hint">
						Combo charts draw each series with its own mark — set them on the Series tab.
					</div>
				}
			</div>

			<div className="blue-orange-chart-config-section">
				<div className="blue-orange-chart-config-section-title">Titles</div>
				<Input
					label={"Title"}
					value={data.title}
					placeholder={"Optional heading shown above the chart"}
					onChange={(value) => onChange({...data, title: value})}
				></Input>
				<Input
					label={"Caption"}
					value={data.caption}
					placeholder={"Optional caption shown below the chart"}
					onChange={(value) => onChange({...data, caption: value})}
				></Input>
			</div>

			<div className="blue-orange-chart-config-section">
				<div className="blue-orange-chart-config-section-title">Axes</div>
				<div className="blue-orange-chart-config-row">
					<Input
						label={"X axis label"}
						value={data.options.xLabel ?? ""}
						onChange={(value) => setOption({xLabel: value === "" ? undefined : value})}
					></Input>
					<Input
						label={"Y axis label"}
						value={data.options.yLabel ?? ""}
						onChange={(value) => setOption({yLabel: value === "" ? undefined : value})}
					></Input>
				</div>
				{supportsScaleChoice &&
					<div className="blue-orange-chart-config-row">
						<ChartSelect
							label={"X axis scale"}
							value={data.options.xScale}
							options={[
								{value: "category", label: "Category"},
								{value: "linear", label: "Numeric"},
								{value: "time", label: "Time"},
							]}
							onChange={(value) => setOption({xScale: value as any})}
						></ChartSelect>
						<ChartSelect
							label={"Y axis scale"}
							value={data.options.yScale}
							options={[
								{value: "linear", label: "Linear"},
								{value: "logarithmic", label: "Logarithmic"},
							]}
							onChange={(value) => setOption({yScale: value as any})}
						></ChartSelect>
					</div>
				}
				{supportsScaleChoice && data.options.xScale === "time" &&
					<ChartSelect
						label={"Time unit"}
						value={data.options.xScaleTimeUnit}
						options={TIME_UNITS.map((unit) => ({value: unit, label: unit}))}
						onChange={(value) => setOption({xScaleTimeUnit: value})}
					></ChartSelect>
				}
				{supportsScaleChoice && data.options.xScale === "time" &&
					<div className="blue-orange-chart-config-hint">
						The X axis column must hold dates — ISO strings such as 2024-03-01 or epoch
						milliseconds. Dates in an uploaded spreadsheet are converted automatically.
					</div>
				}
			</div>

			<div className="blue-orange-chart-config-section">
				<div className="blue-orange-chart-config-section-title">Frame</div>
				<div className="blue-orange-chart-config-row">
					<Input
						label={"Height (px)"}
						value={String(data.options.height)}
						isNumber={true}
						onChange={(value) => {
							const height = Number(value);
							setOption({height: isNaN(height) || height < 80 ? 80 : height});
						}}
					></Input>
					<ChartSelect
						label={"Legend position"}
						value={data.options.legendPosition}
						disabled={!data.options.legend}
						options={[
							{value: "top", label: "Top"},
							{value: "bottom", label: "Bottom"},
							{value: "top-left", label: "Top left"},
							{value: "top-right", label: "Top right"},
							{value: "bottom-left", label: "Bottom left"},
							{value: "bottom-right", label: "Bottom right"},
						]}
						onChange={(value) => setOption({legendPosition: value as any})}
					></ChartSelect>
				</div>
				<div className="blue-orange-chart-toggle-row">
					<span>Show legend</span>
					<Toggle checked={data.options.legend} onChange={(checked) => setOption({legend: checked})}></Toggle>
				</div>
				<div className="blue-orange-chart-toggle-row">
					<span>Show grid lines</span>
					<Toggle checked={data.options.gridLines} onChange={(checked) => setOption({gridLines: checked})}></Toggle>
				</div>
				{supportsStacking &&
					<div className="blue-orange-chart-toggle-row">
						<span>Stack series</span>
						<Toggle checked={data.options.stacked} onChange={(checked) => setOption({stacked: checked})}></Toggle>
					</div>
				}
			</div>
		</div>
	);
};
