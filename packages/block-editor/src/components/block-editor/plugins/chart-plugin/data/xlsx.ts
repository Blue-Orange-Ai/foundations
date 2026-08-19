// Minimal .xlsx reader: enough of ZIP + SpreadsheetML to pull the cell values
// out of a workbook in the browser.
//
// Written by hand rather than taken from a dependency. The block editor ships
// to browsers, so a full spreadsheet library would be a large addition for one
// upload path, and the published SheetJS build on npm is unmaintained. What we
// need is narrow: read the sheets, the shared strings, and enough of the number
// formats to recognise dates.
//
// Inflate is done with the platform's DecompressionStream, so no compression
// code lives here.

import {ChartDataTable} from "../ChartBlockTypes";
import {gridToTable} from "./tabular";

export interface XlsxWorkbook {
	sheetNames: Array<string>,
	/** Sheet name to its parsed table. */
	sheets: Record<string, ChartDataTable>,
}

// ---------------------------------------------------------------------------
// ZIP
// ---------------------------------------------------------------------------

interface ZipEntry {
	name: string,
	method: number,
	compressedSize: number,
	localHeaderOffset: number,
}

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;
/** EOCD is 22 bytes plus a comment of at most 65535. */
const MAX_EOCD_SEARCH = 22 + 0xffff;

const findEndOfCentralDirectory = (view: DataView): number => {
	const start = Math.max(0, view.byteLength - MAX_EOCD_SEARCH);
	for (let i = view.byteLength - 22; i >= start; i--) {
		if (view.getUint32(i, true) === EOCD_SIGNATURE) {
			return i;
		}
	}
	return -1;
};

const readZipEntries = (bytes: Uint8Array): Array<ZipEntry> => {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const eocd = findEndOfCentralDirectory(view);
	if (eocd < 0) {
		throw new Error("Not a valid .xlsx file (no zip end-of-central-directory record).");
	}
	const entryCount = view.getUint16(eocd + 10, true);
	let offset = view.getUint32(eocd + 16, true);
	if (offset === 0xffffffff) {
		throw new Error("This workbook uses the ZIP64 format, which is not supported. Re-save it or upload a CSV.");
	}
	const entries: Array<ZipEntry> = [];
	const decoder = new TextDecoder("utf-8");
	for (let i = 0; i < entryCount; i++) {
		if (view.getUint32(offset, true) !== CENTRAL_SIGNATURE) {
			break;
		}
		const method = view.getUint16(offset + 10, true);
		const compressedSize = view.getUint32(offset + 20, true);
		const nameLength = view.getUint16(offset + 28, true);
		const extraLength = view.getUint16(offset + 30, true);
		const commentLength = view.getUint16(offset + 32, true);
		const localHeaderOffset = view.getUint32(offset + 42, true);
		const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
		entries.push({
			name: name,
			method: method,
			compressedSize: compressedSize,
			localHeaderOffset: localHeaderOffset,
		});
		offset += 46 + nameLength + extraLength + commentLength;
	}
	return entries;
};

const inflateRaw = async (bytes: Uint8Array): Promise<Uint8Array> => {
	const globalAny: any = typeof globalThis === "undefined" ? {} : globalThis;
	if (typeof globalAny.DecompressionStream !== "function") {
		throw new Error("This browser cannot decompress .xlsx files. Please upload a CSV instead.");
	}
	const source = new globalAny.ReadableStream({
		start(controller: any) {
			controller.enqueue(bytes);
			controller.close();
		},
	});
	const reader = source.pipeThrough(new globalAny.DecompressionStream("deflate-raw")).getReader();
	const chunks: Array<Uint8Array> = [];
	let total = 0;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const {done, value} = await reader.read();
		if (done) {
			break;
		}
		chunks.push(value);
		total += value.length;
	}
	const out = new Uint8Array(total);
	let cursor = 0;
	for (const chunk of chunks) {
		out.set(chunk, cursor);
		cursor += chunk.length;
	}
	return out;
};

const readZipEntryText = async (bytes: Uint8Array, entry: ZipEntry): Promise<string> => {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const local = entry.localHeaderOffset;
	if (view.getUint32(local, true) !== LOCAL_SIGNATURE) {
		throw new Error("Corrupt .xlsx file (bad local header for " + entry.name + ").");
	}
	// The central directory carries the authoritative sizes; the local header
	// only tells us where the payload starts.
	const nameLength = view.getUint16(local + 26, true);
	const extraLength = view.getUint16(local + 28, true);
	const start = local + 30 + nameLength + extraLength;
	const raw = bytes.subarray(start, start + entry.compressedSize);
	const decoder = new TextDecoder("utf-8");
	if (entry.method === 0) {
		return decoder.decode(raw);
	}
	if (entry.method !== 8) {
		throw new Error("Unsupported compression in .xlsx file (method " + entry.method + ").");
	}
	return decoder.decode(await inflateRaw(raw));
};

// ---------------------------------------------------------------------------
// SpreadsheetML
// ---------------------------------------------------------------------------

const parseXml = (text: string): Document => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(text, "application/xml");
	if (doc.getElementsByTagName("parsererror").length > 0) {
		throw new Error("Could not read the workbook — its XML is malformed.");
	}
	return doc;
};

// Tag names in these parts are namespaced in some producers' output, so match
// on the local name rather than the qualified one.
const childrenByLocalName = (root: Element | Document, localName: string): Array<Element> => {
	const all = root.getElementsByTagName("*");
	const out: Array<Element> = [];
	for (let i = 0; i < all.length; i++) {
		const el = all[i];
		if ((el.localName || el.nodeName.replace(/^.*:/, "")) === localName) {
			out.push(el);
		}
	}
	return out;
};

const attr = (el: Element, name: string): string | null => {
	return el.getAttribute(name);
};

/** Shared strings, in index order. Rich-text runs are concatenated. */
const parseSharedStrings = (xml: string): Array<string> => {
	const doc = parseXml(xml);
	return childrenByLocalName(doc, "si").map((si) => {
		return childrenByLocalName(si, "t")
			.map((t) => t.textContent || "")
			.join("");
	});
};

/** Built-in numFmtIds that render as a date and/or a time. */
const BUILTIN_DATE_FORMATS = new Set([
	14, 15, 16, 17, 18, 19, 20, 21, 22,
	27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
	45, 46, 47,
	50, 51, 52, 53, 54, 55, 56, 57, 58,
]);

const formatCodeIsDate = (code: string): boolean => {
	// Strip colour/condition blocks and quoted literals before looking for
	// date tokens, so `"$"#,##0` or `[Red]0.00` are not mistaken for dates.
	const stripped = code
		.replace(/\[[^\]]*\]/g, "")
		.replace(/"[^"]*"/g, "")
		.replace(/\\./g, "");
	return /[ymdhs]/i.test(stripped) && !/^[^ymdhs]*general[^ymdhs]*$/i.test(stripped);
};

/** For each cellXf index, whether that style renders as a date. */
const parseDateStyles = (xml: string | null): Array<boolean> => {
	if (xml == null) {
		return [];
	}
	const doc = parseXml(xml);
	const customFormats: Record<number, string> = {};
	for (const numFmt of childrenByLocalName(doc, "numFmt")) {
		const id = Number(attr(numFmt, "numFmtId"));
		const code = attr(numFmt, "formatCode");
		if (!isNaN(id) && code != null) {
			customFormats[id] = code;
		}
	}
	// Only the <xf> children of <cellXfs> are addressed by a cell's `s` index;
	// the identically-named children of <cellStyleXfs> are not.
	const cellXfs = childrenByLocalName(doc, "cellXfs")[0];
	if (!cellXfs) {
		return [];
	}
	const styles: Array<boolean> = [];
	for (let i = 0; i < cellXfs.children.length; i++) {
		const xf = cellXfs.children[i];
		const id = Number(attr(xf, "numFmtId") || "0");
		if (customFormats[id] !== undefined) {
			styles.push(formatCodeIsDate(customFormats[id]));
		} else {
			styles.push(BUILTIN_DATE_FORMATS.has(id));
		}
	}
	return styles;
};

/** "BC12" -> 54 (zero-based column index). */
export const columnIndexFromRef = (ref: string): number => {
	let index = 0;
	for (let i = 0; i < ref.length; i++) {
		const code = ref.charCodeAt(i);
		if (code < 65 || code > 90) {
			break;
		}
		index = index * 26 + (code - 64);
	}
	return index - 1;
};

/**
 * Excel serial date to an ISO string. Serials count days from 1899-12-30
 * (the offset absorbs the spreadsheet's fictional 1900 leap day). Values
 * with no fractional part are emitted as plain dates so a category axis
 * reads cleanly.
 */
export const excelSerialToIso = (serial: number): string => {
	const ms = Math.round((serial - 25569) * 86400000);
	const date = new Date(ms);
	if (isNaN(date.getTime())) {
		return String(serial);
	}
	const iso = date.toISOString();
	return Math.abs(serial - Math.floor(serial)) < 1e-9 ? iso.substring(0, 10) : iso;
};

const parseSheet = (
	xml: string,
	sharedStrings: Array<string>,
	dateStyles: Array<boolean>
): Array<Array<any>> => {
	const doc = parseXml(xml);
	const grid: Array<Array<any>> = [];
	for (const rowEl of childrenByLocalName(doc, "row")) {
		const cells: Array<any> = [];
		for (let i = 0; i < rowEl.children.length; i++) {
			const cell = rowEl.children[i];
			if ((cell.localName || cell.nodeName.replace(/^.*:/, "")) !== "c") {
				continue;
			}
			const ref = attr(cell, "r");
			const columnIndex = ref ? columnIndexFromRef(ref) : cells.length;
			const type = attr(cell, "t") || "n";
			const styleIndex = Number(attr(cell, "s") || "-1");

			let value: any = null;
			if (type === "inlineStr") {
				value = childrenByLocalName(cell, "t").map((t) => t.textContent || "").join("");
			} else {
				const valueEl = childrenByLocalName(cell, "v")[0];
				const raw = valueEl ? (valueEl.textContent || "") : "";
				if (raw === "") {
					value = null;
				} else if (type === "s") {
					const index = Number(raw);
					value = sharedStrings[index] !== undefined ? sharedStrings[index] : "";
				} else if (type === "b") {
					value = raw === "1";
				} else if (type === "e") {
					// Error cells (#N/A, #DIV/0!) are gaps, not data.
					value = null;
				} else if (type === "str") {
					value = raw;
				} else {
					const numeric = Number(raw);
					if (isNaN(numeric)) {
						value = raw;
					} else if (styleIndex >= 0 && dateStyles[styleIndex]) {
						value = excelSerialToIso(numeric);
					} else {
						value = numeric;
					}
				}
			}
			// Sparse rows skip empty cells entirely, so pad to the cell's
			// real column position rather than appending.
			while (cells.length < columnIndex) {
				cells.push(null);
			}
			cells[columnIndex] = value;
		}
		grid.push(cells);
	}
	return grid;
};

const resolveTarget = (target: string): string => {
	if (target.startsWith("/")) {
		return target.substring(1);
	}
	if (target.startsWith("xl/")) {
		return target;
	}
	return "xl/" + target;
};

/**
 * Read every worksheet in an .xlsx workbook. Sheet order matches the
 * workbook's own order, so `sheetNames[0]` is the one Excel opens on.
 */
export const parseXlsx = async (buffer: ArrayBuffer): Promise<XlsxWorkbook> => {
	const bytes = new Uint8Array(buffer);
	const entries = readZipEntries(bytes);
	const byName: Record<string, ZipEntry> = {};
	for (const entry of entries) {
		byName[entry.name] = entry;
	}

	const workbookEntry = byName["xl/workbook.xml"];
	if (!workbookEntry) {
		throw new Error("Not a valid .xlsx workbook (xl/workbook.xml is missing).");
	}

	const sharedStrings = byName["xl/sharedStrings.xml"]
		? parseSharedStrings(await readZipEntryText(bytes, byName["xl/sharedStrings.xml"]))
		: [];
	const dateStyles = parseDateStyles(
		byName["xl/styles.xml"] ? await readZipEntryText(bytes, byName["xl/styles.xml"]) : null
	);

	// rId -> part path
	const relationships: Record<string, string> = {};
	if (byName["xl/_rels/workbook.xml.rels"]) {
		const relsDoc = parseXml(await readZipEntryText(bytes, byName["xl/_rels/workbook.xml.rels"]));
		for (const rel of childrenByLocalName(relsDoc, "Relationship")) {
			const id = attr(rel, "Id");
			const target = attr(rel, "Target");
			if (id && target) {
				relationships[id] = resolveTarget(target);
			}
		}
	}

	const workbookDoc = parseXml(await readZipEntryText(bytes, workbookEntry));
	const sheetNames: Array<string> = [];
	const sheets: Record<string, ChartDataTable> = {};
	let fallbackIndex = 0;
	for (const sheetEl of childrenByLocalName(workbookDoc, "sheet")) {
		fallbackIndex++;
		const name = attr(sheetEl, "name") || "Sheet" + fallbackIndex;
		const relId =
			sheetEl.getAttribute("r:id") ||
			sheetEl.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
		const path = (relId && relationships[relId]) || "xl/worksheets/sheet" + fallbackIndex + ".xml";
		const entry = byName[path];
		if (!entry) {
			continue;
		}
		const grid = parseSheet(await readZipEntryText(bytes, entry), sharedStrings, dateStyles);
		sheetNames.push(name);
		sheets[name] = gridToTable(grid);
	}

	if (sheetNames.length === 0) {
		throw new Error("The workbook has no readable worksheets.");
	}
	return {sheetNames: sheetNames, sheets: sheets};
};
