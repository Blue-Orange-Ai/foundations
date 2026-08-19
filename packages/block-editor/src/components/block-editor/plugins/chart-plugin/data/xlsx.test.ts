import {describe, expect, it} from "vitest";

import {columnIndexFromRef, excelSerialToIso, parseXlsx} from "./xlsx";

// ---------------------------------------------------------------------------
// A minimal ZIP writer, so the reader can be exercised against a real workbook
// without checking a binary fixture into the repo. Entries are stored
// uncompressed (method 0), which the reader handles without needing
// DecompressionStream.
// ---------------------------------------------------------------------------

const encoder = new TextEncoder();

interface ZipInput {
	/** Raw bytes of the entry. */
	data: Uint8Array,
	/** 0 = stored, 8 = deflate. */
	method: number,
	/** Payload as it goes into the archive. */
	stored: Uint8Array,
}

const deflateRaw = async (bytes: Uint8Array): Promise<Uint8Array> => {
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(bytes);
			controller.close();
		},
	}).pipeThrough(new CompressionStream("deflate-raw"));
	const reader = stream.getReader();
	const chunks: Array<Uint8Array> = [];
	let total = 0;
	for (;;) {
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

const buildZipRaw = (files: Record<string, ZipInput>): ArrayBuffer => {
	const names = Object.keys(files);
	const locals: Array<Uint8Array> = [];
	const centrals: Array<Uint8Array> = [];
	let offset = 0;

	for (const name of names) {
		const nameBytes = encoder.encode(name);
		const entry = files[name];
		const payload = entry.stored;

		const local = new Uint8Array(30 + nameBytes.length + payload.length);
		const localView = new DataView(local.buffer);
		localView.setUint32(0, 0x04034b50, true);
		localView.setUint16(4, 20, true);      // version needed
		localView.setUint16(8, entry.method, true);
		localView.setUint32(18, payload.length, true);
		localView.setUint32(22, entry.data.length, true);
		localView.setUint16(26, nameBytes.length, true);
		local.set(nameBytes, 30);
		local.set(payload, 30 + nameBytes.length);
		locals.push(local);

		const central = new Uint8Array(46 + nameBytes.length);
		const centralView = new DataView(central.buffer);
		centralView.setUint32(0, 0x02014b50, true);
		centralView.setUint16(4, 20, true);
		centralView.setUint16(6, 20, true);
		centralView.setUint16(10, entry.method, true);
		centralView.setUint32(20, payload.length, true);
		centralView.setUint32(24, entry.data.length, true);
		centralView.setUint16(28, nameBytes.length, true);
		centralView.setUint32(42, offset, true);
		central.set(nameBytes, 46);
		centrals.push(central);

		offset += local.length;
	}

	const centralSize = centrals.reduce((total, entry) => total + entry.length, 0);
	const eocd = new Uint8Array(22);
	const eocdView = new DataView(eocd.buffer);
	eocdView.setUint32(0, 0x06054b50, true);
	eocdView.setUint16(8, names.length, true);
	eocdView.setUint16(10, names.length, true);
	eocdView.setUint32(12, centralSize, true);
	eocdView.setUint32(16, offset, true);

	const total = offset + centralSize + eocd.length;
	const out = new Uint8Array(total);
	let cursor = 0;
	for (const chunk of locals.concat(centrals).concat([eocd])) {
		out.set(chunk, cursor);
		cursor += chunk.length;
	}
	return out.buffer;
};

/** Every entry stored uncompressed. */
const buildZip = (files: Record<string, string>): ArrayBuffer => {
	const inputs: Record<string, ZipInput> = {};
	for (const name of Object.keys(files)) {
		const data = encoder.encode(files[name]);
		inputs[name] = {data: data, method: 0, stored: data};
	}
	return buildZipRaw(inputs);
};

/** Every entry deflated, as a real .xlsx from a spreadsheet application is. */
const buildDeflatedZip = async (files: Record<string, string>): Promise<ArrayBuffer> => {
	const inputs: Record<string, ZipInput> = {};
	for (const name of Object.keys(files)) {
		const data = encoder.encode(files[name]);
		inputs[name] = {data: data, method: 8, stored: await deflateRaw(data)};
	}
	return buildZipRaw(inputs);
};

const WORKBOOK = `<?xml version="1.0"?>
<workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Revenue" sheetId="1" r:id="rId1"/>
    <sheet name="Notes" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>`;

const RELS = `<?xml version="1.0"?>
<Relationships>
  <Relationship Id="rId1" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Target="worksheets/sheet2.xml"/>
</Relationships>`;

const SHARED_STRINGS = `<?xml version="1.0"?>
<sst>
  <si><t>month</t></si>
  <si><t>revenue</t></si>
  <si><t>region</t></si>
  <si><r><t>Nor</t></r><r><t>th</t></r></si>
  <si><t>South</t></si>
  <si><t>opened</t></si>
</sst>`;

// cellXfs[1] uses the built-in short-date format, so column D reads as a date.
const STYLES = `<?xml version="1.0"?>
<styleSheet>
  <cellXfs count="2">
    <xf numFmtId="0"/>
    <xf numFmtId="14"/>
  </cellXfs>
</styleSheet>`;

const SHEET1 = `<?xml version="1.0"?>
<worksheet><sheetData>
  <row r="1">
    <c r="A1" t="s"><v>0</v></c>
    <c r="B1" t="s"><v>1</v></c>
    <c r="C1" t="s"><v>2</v></c>
    <c r="D1" t="s"><v>5</v></c>
  </row>
  <row r="2">
    <c r="A2" t="inlineStr"><is><t>Jan</t></is></c>
    <c r="B2"><v>1200.5</v></c>
    <c r="C2" t="s"><v>3</v></c>
    <c r="D2" s="1"><v>45292</v></c>
  </row>
  <row r="3">
    <c r="A3" t="inlineStr"><is><t>Feb</t></is></c>
    <c r="C3" t="s"><v>4</v></c>
    <c r="D3" s="1"><v>45323</v></c>
  </row>
</sheetData></worksheet>`;

const SHEET2 = `<?xml version="1.0"?>
<worksheet><sheetData></sheetData></worksheet>`;

const WORKBOOK_PARTS: Record<string, string> = {
	"xl/workbook.xml": WORKBOOK,
	"xl/_rels/workbook.xml.rels": RELS,
	"xl/sharedStrings.xml": SHARED_STRINGS,
	"xl/styles.xml": STYLES,
	"xl/worksheets/sheet1.xml": SHEET1,
	"xl/worksheets/sheet2.xml": SHEET2,
};

const buildWorkbook = () => buildZip(WORKBOOK_PARTS);

describe("columnIndexFromRef", () => {

	it("converts A1-style references to zero-based column indices", () => {
		expect(columnIndexFromRef("A1")).toBe(0);
		expect(columnIndexFromRef("D12")).toBe(3);
		expect(columnIndexFromRef("Z1")).toBe(25);
		expect(columnIndexFromRef("AA1")).toBe(26);
		expect(columnIndexFromRef("BC12")).toBe(54);
	});
});

describe("excelSerialToIso", () => {

	it("converts a whole-day serial to a plain date", () => {
		expect(excelSerialToIso(45292)).toBe("2024-01-01");
	});

	it("keeps the time when the serial has a fractional part", () => {
		expect(excelSerialToIso(45292.5)).toBe("2024-01-01T12:00:00.000Z");
	});
});

describe("parseXlsx", () => {

	it("reads every sheet in workbook order", async () => {
		const workbook = await parseXlsx(buildWorkbook());
		expect(workbook.sheetNames).toEqual(["Revenue", "Notes"]);
	});

	it("resolves shared strings, inline strings and rich-text runs", async () => {
		const workbook = await parseXlsx(buildWorkbook());
		const sheet = workbook.sheets["Revenue"];
		expect(sheet.columns).toEqual(["month", "revenue", "region", "opened"]);
		expect(sheet.rows[0].month).toBe("Jan");
		expect(sheet.rows[0].region).toBe("North");
	});

	it("keeps numbers numeric and converts date-formatted cells", async () => {
		const workbook = await parseXlsx(buildWorkbook());
		const sheet = workbook.sheets["Revenue"];
		expect(sheet.rows[0].revenue).toBe(1200.5);
		expect(sheet.rows[0].opened).toBe("2024-01-01");
		expect(sheet.rows[1].opened).toBe("2024-02-01");
	});

	it("pads skipped cells so sparse rows keep their columns aligned", async () => {
		const workbook = await parseXlsx(buildWorkbook());
		const sheet = workbook.sheets["Revenue"];
		// Row 3 has no B cell at all.
		expect(sheet.rows[1].month).toBe("Feb");
		expect(sheet.rows[1].revenue).toBeNull();
		expect(sheet.rows[1].region).toBe("South");
	});

	it("inflates deflate-compressed entries", async () => {
		const workbook = await parseXlsx(await buildDeflatedZip(WORKBOOK_PARTS));
		expect(workbook.sheetNames).toEqual(["Revenue", "Notes"]);
		expect(workbook.sheets["Revenue"].rows[0]).toEqual({
			month: "Jan",
			revenue: 1200.5,
			region: "North",
			opened: "2024-01-01",
		});
	});

	it("rejects something that is not a zip", async () => {
		await expect(parseXlsx(encoder.encode("not a zip").buffer)).rejects.toThrow(/not a valid \.xlsx/i);
	});

	it("rejects a zip that is not a workbook", async () => {
		await expect(parseXlsx(buildZip({"hello.txt": "hi"}))).rejects.toThrow(/xl\/workbook\.xml/);
	});
});
