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

/** Fetch and normalise the rows described by a remote source. */
export const fetchRemoteTable = async (
	source: ChartRemoteSource,
	signal?: AbortSignal
): Promise<ChartDataTable> => {
	if (!source.url || source.url.trim() === "") {
		throw new Error("No data server URL has been set.");
	}
	const init: RequestInit = {
		method: source.method || "GET",
		headers: {Accept: "application/json", ...(source.headers || {})},
		signal: signal,
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
	const text = await response.text();
	let body: any;
	try {
		body = JSON.parse(text);
	} catch (e) {
		throw new Error("The data server did not return JSON.");
	}
	return remoteResponseToTable(selectPath(body, source.path));
};
