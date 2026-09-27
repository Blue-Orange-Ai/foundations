// Loading chart rows from an external data server.
//
// The response contract is deliberately forgiving — see ChartRemoteResponse in
// ChartBlockTypes for the shapes a server may return — because the endpoint is
// usually an existing reporting API the author does not control.

import {ChartDataTable, ChartRemoteSource} from "../ChartBlockTypes";
import {coerceCell, gridToTable, uniqueColumnNames} from "./tabular";

/** Follow a dot path ("data.series.0") into a parsed response body. */
export const selectPath = (body: any, path?: string): any => {
	if (!path || path.trim() === "") {
		return body;
	}
	let current = body;
	for (const segment of path.split(".")) {
		const key = segment.trim();
		if (key === "") {
			continue;
		}
		if (current == null) {
			return undefined;
		}
		current = Array.isArray(current) && /^\d+$/.test(key) ? current[Number(key)] : current[key];
	}
	return current;
};

/**
 * Normalise a remote payload into a table. Throws with a message suitable for
 * showing to the author when the payload does not match the contract.
 */
export const remoteResponseToTable = (payload: any): ChartDataTable => {
	if (payload == null) {
		throw new Error("The server response was empty.");
	}

	// { columns, rows }
	if (!Array.isArray(payload) && typeof payload === "object" && Array.isArray(payload.rows)) {
		const rows = payload.rows;
		if (rows.length > 0 && Array.isArray(rows[0])) {
			const declared: Array<string> | undefined = Array.isArray(payload.columns)
				? uniqueColumnNames(payload.columns)
				: undefined;
			// Without a `columns` field the first array row is the header.
			return declared
				? gridToTable([declared as Array<any>].concat(rows))
				: gridToTable(rows);
		}
		return objectRowsToTable(rows, Array.isArray(payload.columns) ? payload.columns.map(String) : undefined);
	}

	if (Array.isArray(payload)) {
		if (payload.length === 0) {
			return {columns: [], rows: []};
		}
		if (Array.isArray(payload[0])) {
			return gridToTable(payload);
		}
		if (typeof payload[0] === "object" && payload[0] != null) {
			return objectRowsToTable(payload);
		}
	}

	throw new Error(
		"Unrecognised response shape. Expected { columns, rows } or an array of row objects."
	);
};

const objectRowsToTable = (
	rows: Array<any>,
	declaredColumns?: Array<string>
): ChartDataTable => {
	const usable = rows.filter((row) => row != null && typeof row === "object" && !Array.isArray(row));
	// Union of every row's keys, in first-seen order, so sparse rows do not
	// silently drop a column that only later rows carry.
	const columns = declaredColumns && declaredColumns.length > 0 ? declaredColumns.slice() : [];
	if (columns.length === 0) {
		for (const row of usable) {
			for (const key of Object.keys(row)) {
				if (columns.indexOf(key) === -1) {
					columns.push(key);
				}
			}
		}
	}
	return {
		columns: columns,
		rows: usable.map((row) => {
			const out: Record<string, any> = {};
			for (const column of columns) {
				out[column] = coerceCell(row[column]);
			}
			return out;
		}),
	};
};

// Every viewer downloads and parses the response, so a chart cannot make them
// take in more than this.
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

const isPlainRead = (source: ChartRemoteSource): boolean =>
	(source.method || "GET").toUpperCase() === "GET" &&
	Object.keys(source.headers || {}).every((name) => name.toLowerCase() === "accept");

const readLimited = async (response: Response, limit: number): Promise<string> => {
	const tooLarge = () => new Error("The data server's response is too large to chart.");
	const declared = Number(response.headers?.get?.("content-length"));
	if (Number.isFinite(declared) && declared > limit) {
		throw tooLarge();
	}
	const reader = response.body && typeof response.body.getReader === "function" ? response.body.getReader() : undefined;
	if (!reader) {
		const text = await response.text();
		if (text.length > limit) {
			throw tooLarge();
		}
		return text;
	}
	const decoder = new TextDecoder();
	let received = 0;
	let text = "";
	for (;;) {
		const {done, value} = await reader.read();
		if (done) {
			break;
		}
		received += value.byteLength;
		if (received > limit) {
			await reader.cancel();
			throw tooLarge();
		}
		text += decoder.decode(value, {stream: true});
	}
	return text + decoder.decode();
};

const isRemoteUrl = (url: string): boolean => {
	try {
		const protocol = new URL(url.trim(), typeof window !== "undefined" ? window.location.href : undefined).protocol;
		return protocol === "http:" || protocol === "https:";
	} catch (e) {
		return false;
	}
};

/** Fetch and normalise the rows described by a remote source. */
export const fetchRemoteTable = async (
	source: ChartRemoteSource,
	signal?: AbortSignal
): Promise<ChartDataTable> => {
	if (!source.url || source.url.trim() === "") {
		throw new Error("No data server URL has been set.");
	}
	// The source is part of the document, so whoever wrote the chart chooses
	// where every viewer's browser sends this request. Only a plain read — a
	// GET with no headers of the document's own — carries the viewer's
	// same-origin cookies: that can do nothing an ordinary link could not, and
	// what it returns is only shown to the viewer. Anything else goes out
	// without them, so a chart cannot make a signed-in viewer's browser post to
	// an API, or pass a header-based CSRF check, on their behalf. The page
	// address is never sent.
	if (!isRemoteUrl(source.url)) {
		throw new Error("The data server URL must be an http or https address.");
	}
	const init: RequestInit = {
		method: source.method || "GET",
		headers: {Accept: "application/json", ...(source.headers || {})},
		signal: signal,
		credentials: isPlainRead(source) ? "same-origin" : "omit",
		referrerPolicy: "no-referrer",
	};
	if (init.method === "POST" && source.body != null && source.body !== "") {
		init.body = source.body;
		const headers = init.headers as Record<string, string>;
		const hasContentType = Object.keys(headers).some((k) => k.toLowerCase() === "content-type");
		if (!hasContentType) {
			headers["Content-Type"] = "application/json";
		}
	}
	const response = await fetch(source.url, init);
	if (!response.ok) {
		throw new Error("The data server responded with " + response.status + " " + response.statusText + ".");
	}
	const text = await readLimited(response, MAX_RESPONSE_BYTES);
	let body: any;
	try {
		body = JSON.parse(text);
	} catch (e) {
		throw new Error("The data server did not return JSON.");
	}
	return remoteResponseToTable(selectPath(body, source.path));
};
