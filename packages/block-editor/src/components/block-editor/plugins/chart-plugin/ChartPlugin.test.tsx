import {describe, expect, it, beforeAll, afterEach} from "vitest";
import {act} from "@testing-library/react";

import {BlockEditor} from "@blue-orange-ai/primitives-block-editor";

import {CHART_BLOCK_TYPE, chartPluginEntry} from "./ChartPlugin";
import {applyKind, applyTable, updateSeries} from "./chartConfigOps";
import {ChartBlockData, emptyChartData} from "./ChartBlockTypes";
import {chartToHtml, chartToMarkdown} from "./chartExport";

// The block editors' plugin editors reach for these through globals rather
// than imports (they are loaded from a CDN in the browser).
beforeAll(() => {
	const globalAny = globalThis as any;
	globalAny.katex = globalAny.katex ?? {renderToString: (text: string) => text};
	globalAny.Plyr = globalAny.Plyr ?? class { destroy() {} };
	globalAny.hljs = globalAny.hljs ?? {highlightElement: () => {}, getLanguage: () => null};
});

afterEach(() => {
	document.body.innerHTML = "";
});

const createEditor = () => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	return new BlockEditor(container, undefined, {
		additionalPlugins: [chartPluginEntry()],
	} as any);
};

/**
 * A fully styled chart whose series are all hidden.
 *
 * The styling is what the round-trip assertions care about; hiding the series
 * keeps the block on its empty-state path so no Chart.js canvas is created —
 * jsdom has no 2D context, and foundations-core ships Chart.js inside its
 * bundle so it cannot be mocked from here.
 */
const configuredChart = (): ChartBlockData => {
	let data = applyTable(emptyChartData(), {
		columns: ["month", "revenue", "cost"],
		rows: [
			{month: "Jan", revenue: 100, cost: 40},
			{month: "Feb", revenue: 120, cost: 55},
		],
	}, {fileName: "sales.csv"});
	data = applyKind(data, "combo");
	data = updateSeries(data, 0, {kind: "bar", color: "#EB984E", lineStyle: "dashed", hidden: true});
	data = updateSeries(data, 1, {color: "#5DADE2", tension: 0.6, hidden: true});
	return {...data, title: "Revenue", caption: "Monthly totals"};
};

const chartStates = (editor: any) => editor.state.filter((s: any) => s.type === CHART_BLOCK_TYPE);

describe("ChartPlugin registration", () => {

	it("registers the chart block alongside the built-in block types", () => {
		const editor = createEditor() as any;
		const types = editor.plugins.map((p: any) => p.type);
		expect(types).toContain(CHART_BLOCK_TYPE);
		// The built-ins are still there — additionalPlugins extends, not replaces.
		expect(types).toContain("image");
		expect(types).toContain("table");
		expect(types).toContain("paragraph");
	});

	it("appears in the block-type menus with a label, icon and search aliases", () => {
		const editor = createEditor() as any;
		const entry = editor.plugins.find((p: any) => p.type === CHART_BLOCK_TYPE);
		expect(entry.label).toBe("Chart");
		expect(entry.icon).toBe("ri-line-chart-line");
		expect(entry.isText).toBe(false);
		expect(entry.aliases).toContain("graph");
		expect(entry.aliases).toContain("csv");
		expect(editor.getLabelByType(CHART_BLOCK_TYPE)).toBe("Chart");
	});

	it("seeds new blocks from the registration entry's defaults", () => {
		const container = document.createElement("div");
		document.body.appendChild(container);
		const editor = new BlockEditor(container, undefined, {
			additionalPlugins: [chartPluginEntry({
				options: {defaults: {...emptyChartData(), kind: "bar", options: {...emptyChartData().options, height: 480}}},
			})],
		} as any) as any;
		act(() => {
			editor.createBlock({pos: editor.state.length - 1, type: CHART_BLOCK_TYPE});
		});
		const data = editor.serialize(chartStates(editor)[0]);
		expect(data.kind).toBe("bar");
		expect(data.options.height).toBe(480);
	});

	it("takes label and icon overrides", () => {
		const entry = chartPluginEntry({label: "Graph", icon: "ri-bar-chart-line"});
		expect(entry.label).toBe("Graph");
		expect(entry.icon).toBe("ri-bar-chart-line");
		expect(entry.type).toBe(CHART_BLOCK_TYPE);
	});
});

describe("ChartPlugin block lifecycle", () => {

	it("creates a chart block and serialises an empty default", () => {
		const editor = createEditor() as any;
		act(() => {
			editor.createBlock({pos: editor.state.length - 1, type: CHART_BLOCK_TYPE});
		});

		const states = chartStates(editor);
		expect(states.length).toBe(1);
		expect(editor.serialize(states[0])).toEqual(emptyChartData());
		expect(document.querySelector(".blue-orange-chart-block")).not.toBeNull();
	});

	it("shows the empty state until the block has data", () => {
		const editor = createEditor() as any;
		act(() => {
			editor.createBlock({pos: editor.state.length - 1, type: CHART_BLOCK_TYPE});
		});
		expect(document.body.textContent).toContain("No data yet");
	});

	it("round-trips a configured chart through toJson and reviveDocument", () => {
		const editor = createEditor() as any;
		act(() => {
			editor.createBlock({pos: editor.state.length - 1, type: CHART_BLOCK_TYPE});
		});
		const chart = configuredChart();
		act(() => {
			editor.getPluginByType(CHART_BLOCK_TYPE).hydrate(chartStates(editor)[0], chart);
		});

		const doc = editor.toJson();
		const serialised = doc.states.filter((s: any) => s.type === CHART_BLOCK_TYPE);
		expect(serialised.length).toBe(1);
		expect(serialised[0].data).toEqual(chart);

		act(() => {
			editor.reviveDocument(JSON.parse(JSON.stringify(doc)));
		});
		const revived = editor.toJson().states.filter((s: any) => s.type === CHART_BLOCK_TYPE);
		expect(revived.length).toBe(1);
		expect(revived[0].data).toEqual(chart);
	});

	it("compares a block against a data snapshot", () => {
		const editor = createEditor() as any;
		act(() => {
			editor.createBlock({pos: editor.state.length - 1, type: CHART_BLOCK_TYPE});
		});
		const plugin = editor.getPluginByType(CHART_BLOCK_TYPE);
		const state = chartStates(editor)[0];
		expect(plugin.equals(state, emptyChartData())).toBe(true);
		expect(plugin.equals(state, configuredChart())).toBe(false);
	});

	it("deletes the block and tears its React root down", () => {
		const editor = createEditor() as any;
		act(() => {
			editor.createBlock({pos: editor.state.length - 1, type: CHART_BLOCK_TYPE});
		});
		const pos = editor.getPos(chartStates(editor)[0].uuid);
		act(() => {
			editor.deleteDiv(pos);
		});
		expect(chartStates(editor).length).toBe(0);
	});

	it("appends a paragraph rather than splitting when Enter is pressed", () => {
		const editor = createEditor() as any;
		const plugin = editor.getPluginByType(CHART_BLOCK_TYPE);
		expect(plugin.onEnter({}, {})).toEqual({action: "insert-after", newType: "paragraph"});
		expect(plugin.onBackspaceAtStart({}, {})).toEqual({action: "merge-with-previous"});
	});
});

describe("chart export", () => {

	it("exports the plotted columns as an HTML table", () => {
		const html = chartToHtml(configuredChart());
		const headings = Array.from(html.querySelectorAll("th")).map((th) => th.textContent);
		expect(headings).toEqual(["month", "revenue", "cost"]);
		expect(html.querySelectorAll("tbody tr").length).toBe(2);
		expect(html.textContent).toContain("Revenue");
		expect(html.textContent).toContain("Monthly totals");
	});

	it("exports a markdown table using the series labels", () => {
		const chart = updateSeries(configuredChart(), 0, {label: "Revenue (£)"});
		const markdown = chartToMarkdown(chart);
		expect(markdown).toContain("| month | Revenue (£) | cost |");
		expect(markdown).toContain("| Jan | 100 | 40 |");
		expect(markdown).toContain("_Monthly totals_");
	});

	it("escapes pipes so a cell cannot split the markdown row", () => {
		const chart = configuredChart();
		chart.source.rows[0].month = "Jan | Feb";
		expect(chartToMarkdown(chart)).toContain("Jan \\| Feb");
	});
});
