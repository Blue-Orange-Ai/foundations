import {describe, expect, it} from "vitest";

import {remoteResponseToTable, selectPath} from "./remote";

describe("selectPath", () => {

	it("returns the whole body when no path is given", () => {
		const body = {a: 1};
		expect(selectPath(body)).toBe(body);
		expect(selectPath(body, "  ")).toBe(body);
	});

	it("walks object keys and array indices", () => {
		const body = {data: {series: [{rows: [1]}]}};
		expect(selectPath(body, "data.series.0.rows")).toEqual([1]);
	});

	it("returns undefined when the path runs off the end", () => {
		expect(selectPath({a: 1}, "b.c")).toBeUndefined();
	});
});

describe("remoteResponseToTable", () => {

	it("reads { columns, rows } with array rows", () => {
		const table = remoteResponseToTable({
			columns: ["month", "revenue"],
			rows: [["Jan", 120], ["Feb", 140]],
		});
		expect(table.columns).toEqual(["month", "revenue"]);
		expect(table.rows).toEqual([
			{month: "Jan", revenue: 120},
			{month: "Feb", revenue: 140},
		]);
	});

	it("reads { columns, rows } with object rows", () => {
		const table = remoteResponseToTable({
			columns: ["month", "revenue"],
			rows: [{month: "Jan", revenue: 120}],
		});
		expect(table.rows).toEqual([{month: "Jan", revenue: 120}]);
	});

	it("treats the first array row as the header when columns are absent", () => {
		const table = remoteResponseToTable({rows: [["month", "revenue"], ["Jan", 120]]});
		expect(table.columns).toEqual(["month", "revenue"]);
		expect(table.rows).toEqual([{month: "Jan", revenue: 120}]);
	});

	it("reads a bare array of row objects", () => {
		const table = remoteResponseToTable([
			{month: "Jan", revenue: 120},
			{month: "Feb", revenue: 140},
		]);
		expect(table.columns).toEqual(["month", "revenue"]);
		expect(table.rows.length).toBe(2);
	});

	it("unions the keys of sparse row objects", () => {
		const table = remoteResponseToTable([{a: 1}, {b: 2}]);
		expect(table.columns).toEqual(["a", "b"]);
		expect(table.rows).toEqual([{a: 1, b: null}, {a: null, b: 2}]);
	});

	it("reads a bare array of arrays as header-first", () => {
		const table = remoteResponseToTable([["x", "y"], [1, 2]]);
		expect(table.columns).toEqual(["x", "y"]);
		expect(table.rows).toEqual([{x: 1, y: 2}]);
	});

	it("returns an empty table for an empty array", () => {
		expect(remoteResponseToTable([])).toEqual({columns: [], rows: []});
	});

	it("rejects a payload it cannot recognise", () => {
		expect(() => remoteResponseToTable("nope")).toThrow(/Unrecognised response shape/);
		expect(() => remoteResponseToTable(null)).toThrow(/empty/);
	});
});
