import React, {useMemo} from "react";

import {BarChart, ComboChart, LineChart, ScatterChart} from "@blue-orange-ai/foundations-core";
import {ChartBlockData} from "../ChartBlockTypes";
import {chartCommonProps, chartDatasets, chartLabels, rendersAsCombo, usesPointObjects} from "./chartDatasets";

interface Props {
	data: ChartBlockData,
}

/**
 * Draws the block with whichever foundations-core chart matches its kind.
 *
 * The core charts build their Chart.js instance once on mount and only watch
 * `dataset`/`labels` afterwards, so every option that lives in the Chart.js
 * config (scales, grid, legend, stacking) is folded into a `key`. Changing one
 * remounts the chart rather than leaving the canvas showing stale options.
 */
export const ChartRenderer: React.FC<Props> = ({data}) => {

	const datasets = useMemo(() => chartDatasets(data), [data]);
	const labels = useMemo(() => chartLabels(data), [data]);
	const common = chartCommonProps(data);

	const configKey = [
		data.kind,
		data.options.xScale,
		data.options.xScaleTimeUnit,
		data.options.yScale,
		data.options.gridLines ? "grid" : "no-grid",
		data.options.legend ? data.options.legendPosition : "no-legend",
		data.options.stacked ? "stacked" : "grouped",
		rendersAsCombo(data) ? "combo" : "single",
		data.options.xLabel ?? "",
		data.options.yLabel ?? "",
		// Chart.js is told the axis type once; whether points carry their own
		// x value has to match it.
		usesPointObjects(data) ? "points" : "labels",
		// The core charts build their HTML legend when the chart is created and
		// do not rebuild it on a data update, so anything the legend shows has
		// to force a remount too.
		datasets.map((d) => [d.label, d.borderColor, d.backgroundColor, d.type].join("~")).join(","),
	].join("|");

	// A category axis reads x from `labels`; the other scales read it from the
	// point objects, and passing a stale label array alongside them makes
	// Chart.js widen the axis to the label count.
	const labelProp = usesPointObjects(data) ? undefined : labels;

	if (rendersAsCombo(data)) {
		return (
			<ComboChart
				key={configKey}
				{...common}
				dataset={datasets}
				labels={labelProp}
				xScale={data.options.xScale}
				xScaleTimeUnit={data.options.xScaleTimeUnit}
				yScale={data.options.yScale}
				stackedBars={data.options.stacked}
				stackedAreas={data.options.stacked}
			></ComboChart>
		);
	}

	if (data.kind === "bar" || data.kind === "horizontal-bar") {
		return (
			<BarChart
				key={configKey}
				{...common}
				indexAxis={data.kind === "horizontal-bar" ? "y" : "x"}
				dataset={datasets}
				labels={labels}
			></BarChart>
		);
	}

	if (data.kind === "scatter") {
		return (
			<ScatterChart
				key={configKey}
				{...common}
				dataset={datasets}
				xScale={data.options.xScale}
				xScaleTimeUnit={data.options.xScaleTimeUnit}
				yScale={data.options.yScale}
			></ScatterChart>
		);
	}

	return (
		<LineChart
			key={configKey}
			{...common}
			dataset={datasets}
			labels={labelProp}
			xScale={data.options.xScale}
			xScaleTimeUnit={data.options.xScaleTimeUnit}
			yScale={data.options.yScale}
			fill={data.kind === "area" ? "start" : false}
		></LineChart>
	);
};
