// RFC 4180-style delimited-text parsing, used for the plugin's CSV/TSV uploads.
//
// Hand-rolled rather than pulled from a dependency: the editor bundle is
// shipped to browsers and the whole job is one state machine over a string.

import {ChartDataTable} from "../ChartBlockTypes";
import {coerceCell, uniqueColumnNames} from "./tabular";

/** Delimiters we try when none is given, most specific first. */
const CANDIDATE_DELIMITERS = [",", ";", "\t", "|"];

/**
 * Guess the delimiter by counting how consistently each candidate splits the
 * first few lines. The winner is the one producing the most columns with the
 * same count on every sampled line.
 */
export const detectDelimiter = (text: string): string => {
	const sample = text.split(/\r\n|\n|\r/).filter((line) => line.trim() !== "").slice(0, 10);
	if (sample.length === 0) {
		return ",";
	}
	let best = ",";
	let bestScore = -1;
	for (const delimiter of CANDIDATE_DELIMITERS) {
		const counts = sample.map((line) => splitLineOutsideQuotes(line, delimiter));
		const first = counts[0];
		if (first < 2) {
			continue;
		}
		const consistent = counts.every((c) => c === first);
		const score = (consistent ? 1000 : 0) + first;
		if (score > bestScore) {
			bestScore = score;
			best = delimiter;
		}
	}
	return best;
};

// Column count for one line, ignoring delimiters inside quoted fields.
const splitLineOutsideQuotes = (line: string, delimiter: string): number => {
	let count = 1;
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') {
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (ch === delimiter && !inQuotes) {
			count++;
		}
	}
	return count;
};

/** Split delimited text into a grid of raw string cells. */
export const parseDelimitedRows = (text: string, delimiter: string): Array<Array<string>> => {
	const rows: Array<Array<string>> = [];
	let row: Array<string> = [];
	let field = "";
	let inQuotes = false;
	let i = 0;

	// A UTF-8 BOM survives FileReader.readAsText and would otherwise become
	// part of the first column's name.
	if (text.charCodeAt(0) === 0xfeff) {
		i = 1;
	}

	const endField = () => {
		row.push(field);
		field = "";
	};
	const endRow = () => {
		endField();
		rows.push(row);
		row = [];
	};

	while (i < text.length) {
		const ch = text[i];
		if (inQuotes) {
			if (ch === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i += 2;
					continue;
				}
				inQuotes = false;
				i++;
				continue;
			}
			field += ch;
			i++;
			continue;
		}
		if (ch === '"' && field === "") {
			inQuotes = true;
			i++;
			continue;
		}
		if (ch === delimiter) {
			endField();
			i++;
			continue;
		}
		if (ch === "\r") {
			// \r\n and a bare \r both end the row.
			endRow();
			i += text[i + 1] === "\n" ? 2 : 1;
			continue;
		}
		if (ch === "\n") {
			endRow();
			i++;
			continue;
		}
		field += ch;
		i++;
	}
	// Trailing newline leaves an empty pending row; anything else is real.
	if (field !== "" || row.length > 0) {
		endRow();
	}
	return rows;
};

/**
 * Parse CSV/TSV text into a table. The first non-empty row is the header;
 * blank trailing rows and fully-empty rows are dropped, and numeric-looking
 * cells are converted to numbers so they can be plotted.
 */
export const parseCsv = (text: string, delimiter?: string): ChartDataTable => {
	const resolved = delimiter && delimiter !== "" ? delimiter : detectDelimiter(text);
	const grid = parseDelimitedRows(text, resolved).filter(
		(row) => row.some((cell) => cell.trim() !== "")
	);
	if (grid.length === 0) {
		return {columns: [], rows: []};
	}
	const columns = uniqueColumnNames(grid[0]);
	const rows = grid.slice(1).map((cells) => {
		const row: Record<string, any> = {};
		for (let c = 0; c < columns.length; c++) {
			row[columns[c]] = coerceCell(cells[c]);
		}
		return row;
	});
	return {columns: columns, rows: rows};
};
