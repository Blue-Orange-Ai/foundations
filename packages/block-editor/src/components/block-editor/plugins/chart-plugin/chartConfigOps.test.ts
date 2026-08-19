import {describe, expect, it} from "vitest";

import {
	addSeries,
	applyKind,
	applyTable,
	moveSeries,
	removeSeries,
	unusedColumns,
	updateSeries,
} from "./chartConfigOps";
import {ChartDataTable, emptyChartData, migrateChartData} from "./ChartBlockTypes";

const TABLE: ChartDataTable = {
	columns: ["month", "revenue", "cost", "region"],
	rows: [
		{month: "Jan", revenue: 100, cost: 40, region: "North"},
		{month: "Feb", revenue: 120, cost: 55, region: "South"},
	],
};

describe("applyTable", () => {

	it("picks a categorical label column and numeric series by default", () => {
		const data = applyTable(emptyChartData(), TABLE, {fileName: "sales.csv"});
		expect(data.labelColumn).toBe("month");
		expect(data.series.map((s) => s.column)).toEqual(["revenue", "cost"]);
		expect(data.source.fileName).toBe("sales.csv");
		expect(data.source.rows.length).toBe(2);
	});

	it("gives each default series its own palette colour", () => {
		const data = applyTable(emptyChartData(), TABLE);
		const colors = data.series.map((s) => s.color);
		expect(new Set(colors).size).toBe(colors.length);
	});

	it("keeps existing styling when the columns survive a re-upload", () => {
		let data = applyTable(emptyChartData(), TABLE);
		data = updateSeries(data, 0, {color: "#123456", lineStyle: "dashed"});
		const reloaded = applyTable(data, {
			columns: TABLE.columns,
			rows: [{month: "Mar", revenue: 130, cost: 60, region: "East"}],
		});
		expect(reloaded.series[0].color).toBe("#123456");
		expect(reloaded.series[0].lineStyle).toBe("dashed");
		expect(reloaded.source.rows.length).toBe(1);
	});

	it("reconfigures from scratch when no configured column survives", () => {
		const data = applyTable(applyTable(emptyChartData(), TABLE), {
			columns: ["day", "visits"],
			rows: [{day: "Mon", visits: 10}],
		});
		expect(data.labelColumn).toBe("day");
		expect(data.series.map((s) => s.column)).toEqual(["visits"]);
	});

	it("falls back to the first column when everything is numeric", () => {
		const data = applyTable(emptyChartData(), {
			columns: ["x", "y"],
			rows: [{x: 1, y: 2}, {x: 2, y: 4}],
		});
		expect(data.labelColumn).toBe("x");
		expect(data.series.map((s) => s.column)).toEqual(["y"]);
	});
});

describe("applyKind", () => {

	it("re-points every series' mark at the new kind's default", () => {
		const data = applyKind(applyTable(emptyChartData(), TABLE), "bar");
		expect(data.kind).toBe("bar");
		expect(data.series.every((s) => s.kind === "bar")).toBe(true);
	});

	it("turns fill on for area charts and off again when leaving", () => {
		const area = applyKind(applyTable(emptyChartData(), TABLE), "area");
		expect(area.series.every((s) => s.fill)).toBe(true);
		expect(applyKind(area, "line").series.every((s) => !s.fill)).toBe(true);
	});

	it("leaves per-series marks alone on a combo chart", () => {
		let data = applyKind(applyTable(emptyChartData(), TABLE), "combo");
		data = updateSeries(data, 0, {kind: "bar"});
		data = applyKind(data, "combo");
		expect(data.series[0].kind).toBe("bar");
		expect(data.series[1].kind).toBe("line");
	});
});

describe("series operations", () => {

	it("adds, removes and reorders series", () => {
		let data = applyTable(emptyChartData(), TABLE);
		data = addSeries(data, "region");
		expect(data.series.map((s) => s.column)).toEqual(["revenue", "cost", "region"]);

		data = moveSeries(data, 2, -1);
		expect(data.series.map((s) => s.column)).toEqual(["revenue", "region", "cost"]);

		data = removeSeries(data, 1);
		expect(data.series.map((s) => s.column)).toEqual(["revenue", "cost"]);
	});

	it("ignores a move that would run off either end", () => {
		const data = applyTable(emptyChartData(), TABLE);
		expect(moveSeries(data, 0, -1)).toBe(data);
		expect(moveSeries(data, data.series.length - 1, 1)).toBe(data);
	});

	it("never mutates the data it is given", () => {
		const data = applyTable(emptyChartData(), TABLE);
		const before = JSON.stringify(data);
		addSeries(data, "region");
		updateSeries(data, 0, {color: "#000000"});
		removeSeries(data, 0);
		expect(JSON.stringify(data)).toBe(before);
	});

	it("offers only columns that are neither plotted nor the x axis", () => {
		const data = applyTable(emptyChartData(), TABLE);
		expect(unusedColumns(data)).toEqual(["region"]);
	});
});

describe("migrateChartData", () => {

	it("returns a complete default for anything unrecognisable", () => {
		expect(migrateChartData(undefined)).toEqual(emptyChartData());
		expect(migrateChartData("nonsense")).toEqual(emptyChartData());
	});

	it("round-trips a configured block", () => {
		const data = applyKind(applyTable(emptyChartData(), TABLE), "combo");
		expect(migrateChartData(JSON.parse(JSON.stringify(data)))).toEqual(data);
	});

	it("drops series that have no column and defaults their styling", () => {
		const migrated = migrateChartData({
			kind: "bar",
			series: [{column: "revenue"}, {label: "orphan"}],
			source: {columns: ["revenue"], rows: []},
		});
		expect(migrated.series.length).toBe(1);
		expect(migrated.series[0].lineStyle).toBe("solid");
		expect(migrated.series[0].kind).toBe("bar");
	});

	it("normalises a stored remote source", () => {
		const migrated = migrateChartData({
			source: {kind: "remote", columns: [], rows: [], remote: {url: "https://x", method: "PATCH"}},
		});
		expect(migrated.source.kind).toBe("remote");
		expect(migrated.source.remote?.method).toBe("GET");
		expect(migrated.source.remote?.headers).toEqual({});
		expect(migrated.source.remote?.refreshSeconds).toBe(0);
	});
});
