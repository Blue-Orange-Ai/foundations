// File uploads for the chart block: CSV/TSV text and .xlsx workbooks.

import {ChartDataTable} from "../ChartBlockTypes";
import {parseCsv} from "./csv";
import {parseXlsx} from "./xlsx";

export interface ChartUploadResult {
	table: ChartDataTable,
	fileName: string,
	/** Set for workbooks: the sheet that was read, and every sheet available. */
	sheetName?: string,
	sheetNames?: Array<string>,
	/** Every sheet's table, so switching sheets needs no re-upload. */
	sheets?: Record<string, ChartDataTable>,
}

/** File extensions the chart block will accept, for the file input's `accept`. */
export const CHART_UPLOAD_ACCEPT = ".csv,.tsv,.txt,.xlsx,.xlsm";

const extensionOf = (name: string): string => {
	const dot = name.lastIndexOf(".");
	return dot === -1 ? "" : name.substring(dot + 1).toLowerCase();
};

const readAsText = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result ?? ""));
		reader.onerror = () => reject(new Error("Could not read " + file.name + "."));
		reader.readAsText(file);
	});

const readAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer);
		reader.onerror = () => reject(new Error("Could not read " + file.name + "."));
		reader.readAsArrayBuffer(file);
	});

/**
 * Parse an uploaded file into a table. `.xlsx`/`.xlsm` go through the
 * workbook reader (every sheet is parsed so the author can switch between
 * them); anything else is treated as delimited text with the delimiter
 * detected from the content.
 */
export const parseUploadedFile = async (file: File): Promise<ChartUploadResult> => {
	const extension = extensionOf(file.name);
	if (extension === "xlsx" || extension === "xlsm") {
		const workbook = await parseXlsx(await readAsArrayBuffer(file));
		// Prefer the first sheet that actually holds data — a cover sheet or a
		// blank first tab is common and would otherwise look like a failed import.
		const firstWithRows = workbook.sheetNames.find((name) => workbook.sheets[name].rows.length > 0);
		const sheetName = firstWithRows ?? workbook.sheetNames[0];
		return {
			table: workbook.sheets[sheetName],
			fileName: file.name,
			sheetName: sheetName,
			sheetNames: workbook.sheetNames,
			sheets: workbook.sheets,
		};
	}
	if (extension === "xls") {
		throw new Error("The legacy .xls format is not supported. Save the file as .xlsx or .csv and try again.");
	}
	const table = parseCsv(await readAsText(file));
	if (table.columns.length === 0) {
		throw new Error("No columns were found in " + file.name + ".");
	}
	return {table: table, fileName: file.name};
};
