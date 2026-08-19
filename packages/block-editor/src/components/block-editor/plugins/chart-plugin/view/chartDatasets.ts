// Turns a ChartBlockData into the props the foundations-core chart components
// expect. Kept free of React so it can be unit tested on its own.

import {LegendPosition} from "@blue-orange-ai/foundations-core";
import {
	CHART_LINE_STYLE_DASH,
	ChartBlockData,
	ChartLegendPosition,
	ChartSeries,
	defaultSeriesKindFor,
	withAlpha,
} from "../ChartBlockTypes";

export const LEGEND_POSITIONS: Record<ChartLegendPosition, LegendPosition> = {
	"top": LegendPosition.TOP,
	"bottom": LegendPosition.BOTTOM,
	"top-left": LegendPosition.TOP_LEFT,
	"top-right": LegendPosition.TOP_RIGHT,
	"bottom-left": LegendPosition.BOTTOM_LEFT,
	"bottom-right": LegendPosition.BOTTOM_RIGHT,
};

/**
 * Whether the block is drawn by ComboChart.
 *
 * Combo charts always are. Stacking is drawn there too: it is the only core
 * chart that stacks, so a stacked bar or area block is rendered as a combo of
 * one mark rather than by BarChart/LineChart, which have no stacked mode.
 */
export const rendersAsCombo = (data: ChartBlockData): boolean =>
	data.kind === "combo" ||
	(data.options.stacked && (data.kind === "bar" || data.kind === "area"));

/** Series that are configured, still backed by a column, and not hidden. */
export const visibleSeries = (data: ChartBlockData): Array<ChartSeries> =>
	data.series.filter((s) => !s.hidden && data.source.columns.indexOf(s.column) > -1);

/**
 * Whether points carry their own x value. A category axis reads x from the
 * shared `labels` array; linear and time axes need {x, y} pairs, as does any
 * scatter mark.
 */
export const usesPointObjects = (data: ChartBlockData): boolean => {
	if (data.kind === "bar" || data.kind === "horizontal-bar") {
		// BarChart always reads its categories from `labels`.
		return false;
	}
	return (
		data.options.xScale !== "category" ||
		data.kind === "scatter" ||
		(data.kind === "combo" && data.series.some((s) => s.kind === "scatter"))
	);
};

/** Back-to-front layering for a combo chart: bars behind, points in front. */
const COMBO_DRAW_ORDER: Record<string, number> = {bar: 2, line: 1, scatter: 0};

const toNumber = (value: any): number | null => {
	if (value == null || value === "") {
		return null;
	}
	if (typeof value === "number") {
		return isNaN(value) ? null : value;
	}
	const numeric = Number(String(value).replace(/,/g, ""));
	return isNaN(numeric) ? null : numeric;
};

/** X values as Chart.js wants them for the configured scale. */
const toXValue = (value: any, scale: string): any => {
	if (value == null) {
		return null;
	}
	if (scale === "linear") {
		return toNumber(value);
	}
	if (scale === "time") {
		// Chart.js' moment adapter parses ISO strings and epoch millis; leave
		// anything else alone so the adapter can have its own go at it.
		return typeof value === "number" ? value : String(value);
	}
	return String(value);
};

export const chartLabels = (data: ChartBlockData): Array<string> => {
	if (data.labelColumn === "" || data.source.columns.indexOf(data.labelColumn) === -1) {
		return data.source.rows.map((_row, index) => String(index + 1));
	}
	return data.source.rows.map((row) => {
		const value = row[data.labelColumn];
		return value == null ? "" : String(value);
	});
};

/**
 * Build one Chart.js dataset per visible series. The extra keys (`type`,
 * `borderDash`, `yAxisID`, …) are passed straight through by the core chart
 * components, which spread the dataset onto the Chart.js config.
 */
export const chartDatasets = (data: ChartBlockData): Array<any> => {
	const pointObjects = usesPointObjects(data);
	const hasLabelColumn = data.labelColumn !== "" && data.source.columns.indexOf(data.labelColumn) > -1;

	return visibleSeries(data).map((series) => {
		const values = data.source.rows.map((row, index) => {
			const y = toNumber(row[series.column]);
			if (!pointObjects) {
				return y;
			}
			const rawX = hasLabelColumn ? row[data.labelColumn] : index;
			return {x: toXValue(rawX, data.options.xScale), y: y};
		});

		const fill = series.fill || data.kind === "area";
		const dataset: any = {
			label: series.label && series.label !== "" ? series.label : series.column,
			data: values,
			borderColor: series.color,
			backgroundColor: fill || series.kind === "bar"
				? (series.fillColor ?? withAlpha(series.color, series.kind === "bar" ? 0.75 : 0.25))
				: (series.fillColor ?? series.color),
			borderWidth: series.lineWidth,
			borderDash: CHART_LINE_STYLE_DASH[series.lineStyle],
			tension: series.tension,
			pointRadius: series.pointRadius,
			pointHoverRadius: Math.max(series.pointRadius, 4) + 1,
			fill: fill ? (data.options.stacked ? "origin" : "start") : false,
		};

		// ComboChart dispatches on the dataset's own type; the single-mark
		// components would be confused by one, so it is only set when combo
		// is actually doing the drawing.
		if (rendersAsCombo(data)) {
			const mark = data.kind === "combo" ? series.kind : defaultSeriesKindFor(data.kind);
			dataset.type = mark;
			// Chart.js draws lower `order` values last, i.e. on top. Bars are
			// translucent, so leaving them above the line tints it towards the
			// bar colour; put them at the back and the marks read correctly.
			dataset.order = COMBO_DRAW_ORDER[mark];
			if (mark === "scatter") {
				dataset.showLine = false;
				dataset.pointRadius = series.pointRadius > 0 ? series.pointRadius : 4;
			}
		}
		return dataset;
	});
};

/** Shared props every core chart component takes. */
export const chartCommonProps = (data: ChartBlockData) => ({
	gridLines: data.options.gridLines,
	xLabel: data.options.xLabel,
	yLabel: data.options.yLabel,
	legend: data.options.legend,
	legendPosition: LEGEND_POSITIONS[data.options.legendPosition] ?? LegendPosition.BOTTOM,
	height: "100%",
	width: "100%",
	// The block redraws whenever the author changes a setting; animating each
	// time makes the configuration panel feel laggy.
	animationTimeout: 400,
});
