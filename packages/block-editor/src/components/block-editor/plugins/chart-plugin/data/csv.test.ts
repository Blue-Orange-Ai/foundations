import {describe, expect, it} from "vitest";

import {detectDelimiter, parseCsv, parseDelimitedRows} from "./csv";

describe("detectDelimiter", () => {

	it("picks the delimiter that splits every line consistently", () => {
		expect(detectDelimiter("a,b,c\n1,2,3\n4,5,6")).toBe(",");
		expect(detectDelimiter("a\tb\tc\n1\t2\t3")).toBe("\t");
		expect(detectDelimiter("a;b;c\n1;2;3")).toBe(";");
	});

	it("falls back to a comma when nothing splits", () => {
		expect(detectDelimiter("single\nvalues")).toBe(",");
	});

	it("ignores delimiters inside quoted fields", () => {
		expect(detectDelimiter('name;note\nAcme;"one, two"\nBeta;"three, four"')).toBe(";");
	});
});

describe("parseDelimitedRows", () => {

	it("handles quotes, escaped quotes and embedded newlines", () => {
		const rows = parseDelimitedRows('a,b\n"x,1","he said ""hi"""\n"multi\nline",2', ",");
		expect(rows).toEqual([
			["a", "b"],
			["x,1", 'he said "hi"'],
			["multi\nline", "2"],
		]);
	});

	it("accepts CRLF and bare CR line endings", () => {
		expect(parseDelimitedRows("a,b\r\n1,2\r3,4", ",")).toEqual([
			["a", "b"],
			["1", "2"],
			["3", "4"],
		]);
	});

	it("does not emit a trailing empty row for a trailing newline", () => {
		expect(parseDelimitedRows("a,b\n1,2\n", ",")).toEqual([["a", "b"], ["1", "2"]]);
	});
});

describe("parseCsv", () => {

	it("reads the header row and converts numeric cells", () => {
		const table = parseCsv("month,revenue,region\nJan,1200.5,North\nFeb,1400,South");
		expect(table.columns).toEqual(["month", "revenue", "region"]);
		expect(table.rows).toEqual([
			{month: "Jan", revenue: 1200.5, region: "North"},
			{month: "Feb", revenue: 1400, region: "South"},
		]);
	});

	it("reads thousands separators and percentages as numbers", () => {
		const table = parseCsv("label,amount,share\nA,\"1,234,567\",12.5%");
		expect(table.rows[0].amount).toBe(1234567);
		expect(table.rows[0].share).toBe(0.125);
	});

	it("keeps blank cells as null so gaps stay gaps", () => {
		const table = parseCsv("x,y\n1,\n2,5");
		expect(table.rows[0].y).toBeNull();
		expect(table.rows[1].y).toBe(5);
	});

	it("makes duplicate and blank headers unique", () => {
		const table = parseCsv("value,value,\n1,2,3");
		expect(table.columns).toEqual(["value", "value (2)", "Column 3"]);
	});

	it("strips a UTF-8 byte order mark from the first header", () => {
		const table = parseCsv("﻿month,revenue\nJan,10");
		expect(table.columns[0]).toBe("month");
	});

	it("drops fully blank rows", () => {
		const table = parseCsv("a,b\n1,2\n,\n3,4");
		expect(table.rows.length).toBe(2);
	});

	it("returns an empty table for empty input", () => {
		expect(parseCsv("")).toEqual({columns: [], rows: []});
	});
});
