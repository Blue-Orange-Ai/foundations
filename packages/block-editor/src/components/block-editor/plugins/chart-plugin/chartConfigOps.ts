// Pure operations over ChartBlockData used by the configuration UI.
//
// Every function returns a new ChartBlockData; nothing here mutates its
// argument, so the controller can diff old against new to decide whether the
// document actually changed.

import {
	ChartBlockData,
	ChartDataTable,
	ChartKind,
	ChartSeries,
	createSeries,
	defaultSeriesKindFor,
} from "./ChartBlockTypes";
import {columnIsNumeric} from "./data/tabular";

export interface ChartTableMeta {
	fileName?: string,
	sheetName?: string,
	sheetNames?: Array<string>,
}

/**
 * Pick sensible defaults for a freshly loaded table: the first non-numeric
 * column becomes the x axis (falling back to the first column), and up to
 * three numeric columns become series.
 */
const autoConfigure = (
	data: ChartBlockData,
	table: ChartDataTable
): {labelColumn: string, series: Array<ChartSeries>} => {
	const numeric = table.columns.filter((column) => columnIsNumeric(table, column));
	const categorical = table.columns.filter((column) => numeric.indexOf(column) === -1);
	const labelColumn = categorical.length > 0 ? categorical[0] : table.columns[0] ?? "";
	const candidates = numeric.filter((column) => column !== labelColumn).slice(0, 3);
	return {
		labelColumn: labelColumn,
		series: candidates.map((column, index) => createSeries(column, index, data.kind)),
	};
};

/**
 * Swap in a new table. Series and the label column are kept when their columns
 * survive the swap — re-uploading a corrected file should not throw away the
 * styling — and defaults are chosen when nothing survives.
 */
export const applyTable = (
	data: ChartBlockData,
	table: ChartDataTable,
	meta: ChartTableMeta = {}
): ChartBlockData => {
	const survivingSeries = data.series.filter((s) => table.columns.indexOf(s.column) > -1);
	const labelSurvives = data.labelColumn !== "" && table.columns.indexOf(data.labelColumn) > -1;
	const auto = survivingSeries.length === 0 || !labelSurvives ? autoConfigure(data, table) : null;

	return {
		...data,
		source: {
			...data.source,
			columns: table.columns,
			rows: table.rows,
			fileName: meta.fileName !== undefined ? meta.fileName : data.source.fileName,
			sheetName: meta.sheetName !== undefined ? meta.sheetName : data.source.sheetName,
			sheetNames: meta.sheetNames !== undefined ? meta.sheetNames : data.source.sheetNames,
		},
		labelColumn: labelSurvives ? data.labelColumn : (auto ? auto.labelColumn : ""),
		series: survivingSeries.length > 0 ? survivingSeries : (auto ? auto.series : []),
	};
};

/** Change the chart kind, re-pointing each series' mark at the new default. */
export const applyKind = (data: ChartBlockData, kind: ChartKind): ChartBlockData => {
	const seriesKind = defaultSeriesKindFor(kind);
	return {
		...data,
		kind: kind,
		series: data.series.map((s) => ({
			...s,
			// A combo chart is the only kind where the per-series mark is the
			// author's choice, so leave those alone when switching between
			// combo and itself and reset them otherwise.
			kind: kind === "combo" ? s.kind : seriesKind,
			fill: kind === "area" ? true : (kind === "combo" ? s.fill : false),
			pointRadius: kind === "scatter" ? Math.max(s.pointRadius, 4) : s.pointRadius,
		})),
	};
};

export const addSeries = (data: ChartBlockData, column: string): ChartBlockData => ({
	...data,
	series: data.series.concat([createSeries(column, data.series.length, data.kind)]),
});

export const updateSeries = (
	data: ChartBlockData,
	index: number,
	patch: Partial<ChartSeries>
): ChartBlockData => ({
	...data,
	series: data.series.map((s, i) => (i === index ? {...s, ...patch} : s)),
});

export const removeSeries = (data: ChartBlockData, index: number): ChartBlockData => ({
	...data,
	series: data.series.filter((_s, i) => i !== index),
});

export const moveSeries = (data: ChartBlockData, index: number, delta: number): ChartBlockData => {
	const target = index + delta;
	if (target < 0 || target >= data.series.length) {
		return data;
	}
	const series = data.series.slice();
	const [moved] = series.splice(index, 1);
	series.splice(target, 0, moved);
	return {...data, series: series};
};

/** Columns not yet plotted, for the "add series" picker. */
export const unusedColumns = (data: ChartBlockData): Array<string> =>
	data.source.columns.filter(
		(column) => column !== data.labelColumn && !data.series.some((s) => s.column === column)
	);
