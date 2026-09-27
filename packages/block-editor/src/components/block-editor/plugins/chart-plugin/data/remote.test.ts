import {afterEach, describe, expect, it, vi} from "vitest";

import {fetchRemoteTable, remoteResponseToTable, selectPath} from "./remote";

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

describe("fetchRemoteTable request hardening", () => {
	const originalFetch = globalThis.fetch;

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	const source = (url: string): any => ({url, method: "GET", headers: {}, body: "", path: "", refreshSeconds: 0});

	it("reads with only same-origin cookies and no referrer", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ok: true, text: async () => "[]"});
		globalThis.fetch = fetchMock as any;
		await fetchRemoteTable(source("https://data.example/rows"));
		const init = fetchMock.mock.calls[0][1];
		expect(init.credentials).toBe("same-origin");
		expect(init.referrerPolicy).toBe("no-referrer");
	});

	it("sends no cookies with a request that could change something", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ok: true, text: async () => "[]"});
		globalThis.fetch = fetchMock as any;
		await fetchRemoteTable({...source("/api/admin/delete"), method: "POST", body: "{}"});
		expect(fetchMock.mock.calls[0][1].credentials).toBe("omit");
	});

	it.each(["javascript:alert(1)", "file:///etc/passwd", "data:application/json,[]"])("refuses %s", async (url) => {
		const fetchMock = vi.fn();
		globalThis.fetch = fetchMock as any;
		await expect(fetchRemoteTable(source(url))).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
