import React from "react";

import {
	Button,
	ButtonIcon,
	ButtonSize,
	ButtonType,
	ColorPicker,
	Input,
	Toggle,
} from "@blue-orange-ai/foundations-core";
import {ChartBlockData, ChartSeries, withAlpha} from "../ChartBlockTypes";
import {addSeries, moveSeries, removeSeries, unusedColumns, updateSeries} from "../chartConfigOps";
import {ChartSelect} from "./ChartSelect";

interface Props {
	data: ChartBlockData,
	onChange: (data: ChartBlockData) => void,
}

const LINE_STYLES = [
	{value: "solid", label: "Solid"},
	{value: "dashed", label: "Dashed"},
	{value: "dotted", label: "Dotted"},
	{value: "dash-dot", label: "Dash dot"},
];

const SERIES_KINDS = [
	{value: "line", label: "Line"},
	{value: "bar", label: "Bar"},
	{value: "scatter", label: "Scatter"},
];

/** Which columns are plotted, and how each one is drawn. */
export const ChartSeriesPanel: React.FC<Props> = ({data, onChange}) => {

	const available = unusedColumns(data);

	if (data.source.columns.length === 0) {
		return (
			<div className="blue-orange-chart-config-panel">
				<div className="blue-orange-chart-config-empty">
					Load a spreadsheet or connect a data server first — the columns it returns become
					the series you can plot.
				</div>
			</div>
		);
	}

	return (
		<div className="blue-orange-chart-config-panel">
			{data.series.length === 0 &&
				<div className="blue-orange-chart-config-empty">
					No series yet. Add a column below to plot it.
				</div>
			}

			{data.series.map((series, index) => (
				<ChartSeriesRow
					key={index}
					data={data}
					series={series}
					index={index}
					onChange={onChange}
				></ChartSeriesRow>
			))}

			<div className="blue-orange-chart-config-section">
				<div className="blue-orange-chart-config-section-title">Add a series</div>
				{available.length === 0 &&
					<div className="blue-orange-chart-config-hint">
						Every column is either plotted already or used as the X axis.
					</div>
				}
				<div className="blue-orange-chart-add-series">
					{available.map((column) => (
						<Button
							key={column}
							text={column}
							icon={"ri-add-line"}
							size={ButtonSize.SMALL}
							buttonType={ButtonType.SECONDARY}
							onClick={() => onChange(addSeries(data, column))}
						></Button>
					))}
				</div>
			</div>
		</div>
	);
};

interface RowProps {
	data: ChartBlockData,
	series: ChartSeries,
	index: number,
	onChange: (data: ChartBlockData) => void,
}

const ChartSeriesRow: React.FC<RowProps> = ({data, series, index, onChange}) => {

	const patch = (values: Partial<ChartSeries>) => onChange(updateSeries(data, index, values));

	// A bar mark has no line to style; a scatter mark has no line and no fill.
	const mark = data.kind === "combo"
		? series.kind
		: (data.kind === "bar" || data.kind === "horizontal-bar"
			? "bar"
			: (data.kind === "scatter" ? "scatter" : "line"));
	const showLineStyling = mark === "line";
	const showFill = mark === "line";
	// Bar and scatter marks on a single-mark chart have nothing to put in this
	// row; rendering it anyway would leave a gap in the card.
	const showMarkRow = data.kind === "combo" || showLineStyling;

	return (
		<div className={"blue-orange-chart-series-card" + (series.hidden ? " blue-orange-chart-series-card-hidden" : "")}>
			<div className="blue-orange-chart-series-card-header">
				<span
					className="blue-orange-chart-series-swatch"
					style={{backgroundColor: series.fillColor ?? withAlpha(series.color, 0.85), borderColor: series.color}}
				></span>
				<span className="blue-orange-chart-series-card-title">
					{series.label && series.label !== "" ? series.label : series.column}
				</span>
				<div className="blue-orange-chart-series-card-actions">
					<ButtonIcon
						icon={series.hidden ? "ri-eye-off-line" : "ri-eye-line"}
						size={ButtonSize.SMALL}
						label={series.hidden ? "Show series" : "Hide series"}
						onClick={() => patch({hidden: !series.hidden})}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-arrow-up-line"}
						size={ButtonSize.SMALL}
						label={"Move up"}
						isDisabled={index === 0}
						onClick={() => onChange(moveSeries(data, index, -1))}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-arrow-down-line"}
						size={ButtonSize.SMALL}
						label={"Move down"}
						isDisabled={index === data.series.length - 1}
						onClick={() => onChange(moveSeries(data, index, 1))}
					></ButtonIcon>
					<ButtonIcon
						icon={"ri-delete-bin-7-line"}
						size={ButtonSize.SMALL}
						label={"Remove series"}
						onClick={() => onChange(removeSeries(data, index))}
					></ButtonIcon>
				</div>
			</div>

			<div className="blue-orange-chart-config-row">
				<ChartSelect
					label={"Column"}
					value={series.column}
					filter={data.source.columns.length > 8}
					options={data.source.columns.map((column) => ({value: column, label: column}))}
					onChange={(value) => patch({column: value})}
				></ChartSelect>
				<Input
					label={"Legend label"}
					value={series.label ?? ""}
					placeholder={series.column}
					onChange={(value) => patch({label: value})}
				></Input>
			</div>

			{showMarkRow &&
			<div className="blue-orange-chart-config-row">
				{data.kind === "combo" &&
					<ChartSelect
						label={"Mark"}
						value={series.kind}
						options={SERIES_KINDS}
						onChange={(value) => patch({kind: value as ChartSeries["kind"]})}
					></ChartSelect>
				}
				{showLineStyling &&
					<ChartSelect
						label={"Line style"}
						value={series.lineStyle}
						options={LINE_STYLES}
						onChange={(value) => patch({lineStyle: value as ChartSeries["lineStyle"]})}
					></ChartSelect>
				}
				{showLineStyling &&
					<Input
						label={"Line width"}
						value={String(series.lineWidth)}
						isNumber={true}
						onChange={(value) => patch({lineWidth: clampNumber(value, 0, 12, series.lineWidth)})}
					></Input>
				}
			</div>
			}

			<div className="blue-orange-chart-config-row">
				<ColorPicker
					label={"Colour"}
					value={series.color}
					onChange={(value) => patch({color: value})}
				></ColorPicker>
				<ColorPicker
					label={mark === "bar" ? "Bar fill" : "Fill"}
					help={"Leave as the series colour for the default translucent tint."}
					value={series.fillColor ?? series.color}
					onChange={(value) => patch({fillColor: value})}
				></ColorPicker>
			</div>

			<div className="blue-orange-chart-config-row">
				<Input
					label={"Point size"}
					value={String(series.pointRadius)}
					isNumber={true}
					onChange={(value) => patch({pointRadius: clampNumber(value, 0, 20, series.pointRadius)})}
				></Input>
				{showLineStyling &&
					<Input
						label={"Curve (0–1)"}
						value={String(series.tension)}
						onChange={(value) => patch({tension: clampNumber(value, 0, 1, series.tension)})}
					></Input>
				}
				{showFill &&
					<div className="blue-orange-chart-toggle-row">
						<span>Fill under line</span>
						<Toggle checked={series.fill} onChange={(checked) => patch({fill: checked})}></Toggle>
					</div>
				}
			</div>
		</div>
	);
};

const clampNumber = (raw: string, min: number, max: number, fallback: number): number => {
	const value = Number(raw);
	if (raw.trim() === "" || isNaN(value)) {
		return fallback;
	}
	return Math.min(max, Math.max(min, value));
};
