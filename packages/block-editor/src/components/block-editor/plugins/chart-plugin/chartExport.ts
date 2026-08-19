// HTML and markdown representations of a chart block.
//
// The editor's copy/paste and export paths ask each block for a DOM node and a
// markdown string. A canvas cannot be serialised into either, so both render
// the chart's underlying table — the information survives the round trip even
// though the drawing does not.

import {ChartBlockData} from "./ChartBlockTypes";

const plottedColumns = (data: ChartBlockData): Array<string> => {
	const columns: Array<string> = [];
	if (data.labelColumn !== "" && data.source.columns.indexOf(data.labelColumn) > -1) {
		columns.push(data.labelColumn);
	}
	for (const series of data.series) {
		if (data.source.columns.indexOf(series.column) > -1 && columns.indexOf(series.column) === -1) {
			columns.push(series.column);
		}
	}
	return columns;
};

const headingFor = (data: ChartBlockData, column: string): string => {
	if (column === data.labelColumn) {
		return column;
	}
	const series = data.series.find((s) => s.column === column);
	return series && series.label && series.label !== "" ? series.label : column;
};

const cellText = (value: any): string => (value == null ? "" : String(value));

export const chartToHtml = (data: ChartBlockData): HTMLElement => {
	const container = document.createElement("div");
	container.className = "blue-orange-chart-block-export";
	container.setAttribute("blue-orange-chart-kind", data.kind);

	if (data.title !== "") {
		const title = document.createElement("div");
		title.className = "blue-orange-chart-block-title";
		title.textContent = data.title;
		container.appendChild(title);
	}

	const columns = plottedColumns(data);
	if (columns.length > 0) {
		const table = document.createElement("table");
		const thead = document.createElement("thead");
		const headRow = document.createElement("tr");
		for (const column of columns) {
			const th = document.createElement("th");
			th.textContent = headingFor(data, column);
			headRow.appendChild(th);
		}
		thead.appendChild(headRow);
		table.appendChild(thead);

		const tbody = document.createElement("tbody");
		for (const row of data.source.rows) {
			const tr = document.createElement("tr");
			for (const column of columns) {
				const td = document.createElement("td");
				td.textContent = cellText(row[column]);
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		container.appendChild(table);
	}

	if (data.caption !== "") {
		const caption = document.createElement("div");
		caption.className = "blue-orange-chart-block-caption";
		caption.textContent = data.caption;
		container.appendChild(caption);
	}
	return container;
};

export const chartToMarkdown = (data: ChartBlockData): string => {
	const lines: Array<string> = [];
	if (data.title !== "") {
		lines.push("**" + data.title + "**");
		lines.push("");
	}
	const columns = plottedColumns(data);
	if (columns.length > 0) {
		lines.push("| " + columns.map((column) => headingFor(data, column)).join(" | ") + " |");
		lines.push("| " + columns.map(() => "---").join(" | ") + " |");
		for (const row of data.source.rows) {
			// A pipe inside a cell would split the row when the markdown is read back.
			lines.push("| " + columns.map((column) => cellText(row[column]).replace(/\|/g, "\\|")).join(" | ") + " |");
		}
	}
	if (data.caption !== "") {
		lines.push("");
		lines.push("_" + data.caption + "_");
	}
	return lines.join("\n") + "\n";
};
