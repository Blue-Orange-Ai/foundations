// Shared helpers for turning raw spreadsheet/CSV cells into a ChartDataTable.

import {ChartDataTable} from "../ChartBlockTypes";

/**
 * Header names, made unique and non-empty. Duplicate headers are common in
 * exported spreadsheets and would otherwise silently collapse into one column.
 */
export const uniqueColumnNames = (raw: Array<any>): Array<string> => {
	const seen: Record<string, number> = {};
	return raw.map((value, index) => {
		let name = value == null ? "" : String(value).trim();
		if (name === "") {
			name = "Column " + (index + 1);
		}
		if (seen[name] === undefined) {
			seen[name] = 1;
			return name;
		}
		seen[name] += 1;
		return name + " (" + seen[name] + ")";
	});
};

// Numbers written by spreadsheets: optional sign, thousands separators,
// decimals, exponent, and a trailing percent sign.
const NUMERIC = /^[+-]?(\d{1,3}(,\d{3})+|\d+)(\.\d+)?([eE][+-]?\d+)?%?$/;

/**
 * Convert one raw cell to the value we store. Numeric strings become numbers
 * so they can be plotted; everything else is kept as a trimmed string, and
 * blank cells become null so gaps in a series stay gaps.
 */
export const coerceCell = (value: any): any => {
	if (value == null) {
		return null;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return value;
	}
	const text = String(value).trim();
	if (text === "") {
		return null;
	}
	if (NUMERIC.test(text)) {
		const isPercent = text.endsWith("%");
		const numeric = Number(text.replace(/,/g, "").replace(/%$/, ""));
		if (!isNaN(numeric)) {
			return isPercent ? numeric / 100 : numeric;
		}
	}
	return text;
};

/** True when at least half of the column's non-null values are numbers. */
export const columnIsNumeric = (table: ChartDataTable, column: string): boolean => {
	let numeric = 0;
	let total = 0;
	for (const row of table.rows) {
		const value = row[column];
		if (value == null || value === "") {
			continue;
		}
		total++;
		if (typeof value === "number") {
			numeric++;
		}
	}
	return total > 0 && numeric / total >= 0.5;
};

/**
 * Build a table from a grid where the first row is the header. Used by the
 * xlsx reader and by remote responses that send arrays-of-arrays.
 */
export const gridToTable = (grid: Array<Array<any>>): ChartDataTable => {
	const usable = grid.filter((row) => row.some((cell) => cell != null && String(cell).trim() !== ""));
	if (usable.length === 0) {
		return {columns: [], rows: []};
	}
	const columns = uniqueColumnNames(usable[0]);
	const rows = usable.slice(1).map((cells) => {
		const row: Record<string, any> = {};
		for (let c = 0; c < columns.length; c++) {
			row[columns[c]] = coerceCell(cells[c]);
		}
		return row;
	});
	return {columns: columns, rows: rows};
};
