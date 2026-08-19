import {describe, expect, it} from "vitest";

import {chartDatasets, chartLabels, rendersAsCombo, usesPointObjects, visibleSeries} from "./chartDatasets";
import {applyKind, applyTable, updateSeries} from "../chartConfigOps";
import {ChartDataTable, emptyChartData} from "../ChartBlockTypes";

const TABLE: ChartDataTable = {
	columns: ["month", "revenue", "cost"],
	rows: [
		{month: "Jan", revenue: 100, cost: 40},
		{month: "Feb", revenue: 120, cost: null},
	],
};

const configured = () => applyTable(emptyChartData(), TABLE);

describe("chartLabels", () => {

	it("reads the label column", () => {
		expect(chartLabels(configured())).toEqual(["Jan", "Feb"]);
	});

	it("falls back to row numbers when no label column is set", () => {
		expect(chartLabels({...configured(), labelColumn: ""})).toEqual(["1", "2"]);
	});
});

describe("chartDatasets", () => {

	it("emits one dataset per visible series, in order", () => {
		const datasets = chartDatasets(configured());
		expect(datasets.map((d) => d.label)).toEqual(["revenue", "cost"]);
		expect(datasets[0].data).toEqual([100, 120]);
	});

	it("keeps missing values null so the line breaks rather than reading zero", () => {
		expect(chartDatasets(configured())[1].data).toEqual([40, null]);
	});

	it("skips hidden series and series whose column has gone", () => {
		let data = updateSeries(configured(), 0, {hidden: true});
		expect(visibleSeries(data).map((s) => s.column)).toEqual(["cost"]);

		data = {...data, source: {...data.source, columns: ["month", "revenue"]}};
		expect(chartDatasets(data)).toEqual([]);
	});

	it("maps the line style onto a dash pattern", () => {
		const data = updateSeries(configured(), 0, {lineStyle: "dashed"});
		expect(chartDatasets(data)[0].borderDash).toEqual([6, 4]);
		expect(chartDatasets(data)[1].borderDash).toEqual([]);
	});

	it("uses the series colour for the border and a translucent fill", () => {
		const data = updateSeries(configured(), 0, {color: "#5DADE2", fill: true});
		const dataset = chartDatasets(data)[0];
		expect(dataset.borderColor).toBe("#5DADE2");
		expect(dataset.backgroundColor).toBe("rgba(93, 173, 226, 0.25)");
	});

	it("honours an explicit fill colour", () => {
		const data = updateSeries(configured(), 0, {fillColor: "#ff0000"});
		expect(chartDatasets(data)[0].backgroundColor).toBe("#ff0000");
	});

	it("emits {x, y} points for a non-category axis", () => {
		const data = configured();
		const timed = {...data, options: {...data.options, xScale: "time" as const}};
		expect(usesPointObjects(timed)).toBe(true);
		expect(chartDatasets(timed)[0].data).toEqual([
			{x: "Jan", y: 100},
			{x: "Feb", y: 120},
		]);
	});

	it("keeps bar charts on the category path whatever the scale says", () => {
		const data = applyKind(configured(), "bar");
		expect(usesPointObjects({...data, options: {...data.options, xScale: "linear"}})).toBe(false);
	});

	it("tags each dataset with its mark on a combo chart", () => {
		let data = applyKind(configured(), "combo");
		data = updateSeries(data, 1, {kind: "bar"});
		const datasets = chartDatasets(data);
		expect(datasets[0].type).toBe("line");
		expect(datasets[1].type).toBe("bar");
	});

	it("leaves the dataset type off the single-mark charts", () => {
		expect(chartDatasets(applyKind(configured(), "bar"))[0].type).toBeUndefined();
	});
});

describe("rendersAsCombo", () => {

	it("is true for combo charts", () => {
		expect(rendersAsCombo(applyKind(configured(), "combo"))).toBe(true);
	});

	it("is true for stacked bar and area charts, which only combo can draw", () => {
		const bar = applyKind(configured(), "bar");
		expect(rendersAsCombo(bar)).toBe(false);
		expect(rendersAsCombo({...bar, options: {...bar.options, stacked: true}})).toBe(true);

		const area = applyKind(configured(), "area");
		expect(rendersAsCombo({...area, options: {...area.options, stacked: true}})).toBe(true);
	});

	it("tags stacked bar datasets with their mark so combo can dispatch", () => {
		const bar = applyKind(configured(), "bar");
		const stacked = {...bar, options: {...bar.options, stacked: true}};
		expect(chartDatasets(stacked)[0].type).toBe("bar");
	});
});
