// Data model for the chart block.
//
// Everything in ChartBlockData is plain JSON: it is what the plugin's
// serialize() hands back to the primitives editor, so it travels through
// toJson()/reviveDocument(), the undo/redo history and collaboration
// messages unchanged. Nothing here may hold a DOM node, a function or a
// class instance.

/** How the block is drawn. Maps onto a foundations-core chart component. */
export type ChartKind =
	| "line"
	| "area"
	| "bar"
	| "horizontal-bar"
	| "scatter"
	| "combo";

/** Mark used for a single series. Only meaningful for `combo` charts. */
export type ChartSeriesKind = "line" | "bar" | "scatter";

export type ChartLineStyle = "solid" | "dashed" | "dotted" | "dash-dot";

export type ChartLegendPosition =
	| "top"
	| "bottom"
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

export type ChartXScale = "category" | "linear" | "time";

export type ChartYScale = "linear" | "logarithmic";

/** A parsed table: an ordered column list plus row objects keyed by column. */
export interface ChartDataTable {
	columns: Array<string>,
	rows: Array<Record<string, any>>,
}

/** Where a block's rows come from. */
export type ChartSourceKind = "inline" | "remote";

/**
 * An external data server. The endpoint is called with `method` and must
 * answer with one of the shapes ChartRemoteResponse describes; `path`
 * selects a nested property when the payload is wrapped.
 */
export interface ChartRemoteSource {
	url: string,
	method: "GET" | "POST",
	/** Sent as request headers. Values are stored in the document — do not put secrets here. */
	headers: Record<string, string>,
	/** Raw request body, used for POST only. */
	body?: string,
	/** Dot path into the response body, e.g. "data.series". Empty = the whole body. */
	path?: string,
	/** Re-fetch every N seconds while the block is on screen. 0 disables polling. */
	refreshSeconds: number,
}

/**
 * The contract an external data server must satisfy. Any of these is accepted:
 *
 *   { "columns": ["month", "revenue"], "rows": [["Jan", 120], ["Feb", 140]] }
 *   { "columns": ["month", "revenue"], "rows": [{"month": "Jan", "revenue": 120}] }
 *   [ {"month": "Jan", "revenue": 120}, {"month": "Feb", "revenue": 140} ]
 *   [ ["month", "revenue"], ["Jan", 120] ]        // header row first
 *
 * When `columns` is absent it is inferred from the first row.
 */
export type ChartRemoteResponse =
	| { columns?: Array<string>, rows: Array<Record<string, any>> | Array<Array<any>> }
	| Array<Record<string, any>>
	| Array<Array<any>>;

export interface ChartDataSource {
	kind: ChartSourceKind,
	/** Column names in upload/response order. Kept even when no series uses them. */
	columns: Array<string>,
	/** Row data. Populated for `inline`; the last successful fetch for `remote`. */
	rows: Array<Record<string, any>>,
	/** Name of the uploaded file, shown in the configuration panel. */
	fileName?: string,
	/** Sheet the rows came from, for xlsx uploads. */
	sheetName?: string,
	/** Every sheet found in the uploaded workbook, so the user can switch. */
	sheetNames?: Array<string>,
	remote?: ChartRemoteSource,
}

/** One plotted series: a column plus how it is drawn. */
export interface ChartSeries {
	/** Column in ChartDataSource.columns supplying this series' values. */
	column: string,
	/** Legend label. Defaults to the column name. */
	label?: string,
	/** Mark for this series. Honoured on `combo`; ignored elsewhere. */
	kind: ChartSeriesKind,
	/** Line / point / bar border colour. */
	color: string,
	/** Bar and area fill. Derived from `color` when omitted. */
	fillColor?: string,
	lineStyle: ChartLineStyle,
	lineWidth: number,
	/** Curve tension for line marks, 0 = straight segments. */
	tension: number,
	/** Radius of the plotted points, 0 hides them. */
	pointRadius: number,
	/** Fill the area under a line mark. */
	fill: boolean,
	/** Hidden series stay configured but are not drawn. */
	hidden: boolean,
}

export interface ChartDisplayOptions {
	height: number,
	legend: boolean,
	legendPosition: ChartLegendPosition,
	gridLines: boolean,
	xLabel?: string,
	yLabel?: string,
	xScale: ChartXScale,
	/** Time unit for a `time` x scale, e.g. "day", "month". */
	xScaleTimeUnit: string,
	yScale: ChartYScale,
	/** Stack bar series (and area series on combo charts). */
	stacked: boolean,
}

export interface ChartBlockData {
	/** Bumped when the stored shape changes; see migrateChartData. */
	version: number,
	title: string,
	caption: string,
	kind: ChartKind,
	source: ChartDataSource,
	/** Column supplying the x axis / category labels. */
	labelColumn: string,
	series: Array<ChartSeries>,
	options: ChartDisplayOptions,
}

export const CHART_DATA_VERSION = 1;

/**
 * Series colours, in assignment order. Picked to sit alongside the callout
 * palette the editor already uses and to stay legible on both themes.
 */
export const CHART_COLOR_PALETTE: Array<string> = [
	"#5DADE2",
	"#EB984E",
	"#58D68D",
	"#EC7063",
	"#A569BD",
	"#45B39D",
	"#F4D03F",
	"#5D6D7E",
	"#DC7633",
	"#48C9B0",
];

export const CHART_LINE_STYLE_DASH: Record<ChartLineStyle, Array<number>> = {
	"solid": [],
	"dashed": [6, 4],
	"dotted": [2, 3],
	"dash-dot": [8, 3, 2, 3],
};

/** Hex (or rgb) colour to an rgba string at the given alpha. */
export const withAlpha = (color: string, alpha: number): string => {
	const hex = color.trim();
	const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
	if (match) {
		let body = match[1];
		if (body.length === 3) {
			body = body[0] + body[0] + body[1] + body[1] + body[2] + body[2];
		}
		const r = parseInt(body.substring(0, 2), 16);
		const g = parseInt(body.substring(2, 4), 16);
		const b = parseInt(body.substring(4, 6), 16);
		return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
	}
	// Not a hex colour (a named colour, rgb(), a gradient…) — use it as-is
	// rather than emitting something Chart.js cannot parse.
	return color;
};

export const defaultSeriesKindFor = (kind: ChartKind): ChartSeriesKind => {
	if (kind === "bar" || kind === "horizontal-bar") {
		return "bar";
	}
	if (kind === "scatter") {
		return "scatter";
	}
	return "line";
};

export const createSeries = (
	column: string,
	index: number,
	kind: ChartKind
): ChartSeries => ({
	column: column,
	label: column,
	kind: defaultSeriesKindFor(kind),
	color: CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length],
	lineStyle: "solid",
	lineWidth: 2,
	tension: kind === "line" || kind === "area" || kind === "combo" ? 0.2 : 0,
	pointRadius: kind === "scatter" ? 4 : 0,
	fill: kind === "area",
	hidden: false,
});

export const emptyChartData = (): ChartBlockData => ({
	version: CHART_DATA_VERSION,
	title: "",
	caption: "",
	kind: "line",
	source: {
		kind: "inline",
		columns: [],
		rows: [],
	},
	labelColumn: "",
	series: [],
	options: {
		height: 320,
		legend: true,
		legendPosition: "bottom",
		gridLines: true,
		xScale: "category",
		xScaleTimeUnit: "day",
		yScale: "linear",
		stacked: false,
	},
});

export const emptyRemoteSource = (): ChartRemoteSource => ({
	url: "",
	method: "GET",
	headers: {},
	refreshSeconds: 0,
});

/**
 * Coerce whatever was stored in the document back into a complete
 * ChartBlockData. Blocks are revived from JSON written by older builds (and,
 * during collaboration, by other clients), so every field is defaulted rather
 * than trusted.
 */
export const migrateChartData = (raw: any): ChartBlockData => {
	const base = emptyChartData();
	if (raw == null || typeof raw !== "object") {
		return base;
	}
	const source = raw.source && typeof raw.source === "object" ? raw.source : {};
	const options = raw.options && typeof raw.options === "object" ? raw.options : {};
	const columns = Array.isArray(source.columns) ? source.columns.map(String) : [];
	const rows = Array.isArray(source.rows) ? source.rows.filter((r: any) => r && typeof r === "object") : [];
	const kind: ChartKind = raw.kind || base.kind;

	const series: Array<ChartSeries> = Array.isArray(raw.series)
		? raw.series
			.filter((s: any) => s && typeof s === "object" && typeof s.column === "string")
			.map((s: any, index: number) => {
				const fallback = createSeries(s.column, index, kind);
				return {
					column: s.column,
					label: typeof s.label === "string" ? s.label : fallback.label,
					kind: s.kind === "bar" || s.kind === "scatter" || s.kind === "line" ? s.kind : fallback.kind,
					color: typeof s.color === "string" && s.color !== "" ? s.color : fallback.color,
					fillColor: typeof s.fillColor === "string" && s.fillColor !== "" ? s.fillColor : undefined,
					lineStyle: CHART_LINE_STYLE_DASH[s.lineStyle as ChartLineStyle] ? s.lineStyle : fallback.lineStyle,
					lineWidth: typeof s.lineWidth === "number" ? s.lineWidth : fallback.lineWidth,
					tension: typeof s.tension === "number" ? s.tension : fallback.tension,
					pointRadius: typeof s.pointRadius === "number" ? s.pointRadius : fallback.pointRadius,
					fill: s.fill === true,
					hidden: s.hidden === true,
				};
			})
		: [];

	return {
		version: CHART_DATA_VERSION,
		title: typeof raw.title === "string" ? raw.title : "",
		caption: typeof raw.caption === "string" ? raw.caption : "",
		kind: kind,
		source: {
			kind: source.kind === "remote" ? "remote" : "inline",
			columns: columns,
			rows: rows,
			fileName: typeof source.fileName === "string" ? source.fileName : undefined,
			sheetName: typeof source.sheetName === "string" ? source.sheetName : undefined,
			sheetNames: Array.isArray(source.sheetNames) ? source.sheetNames.map(String) : undefined,
			remote: source.remote && typeof source.remote === "object"
				? {
					...emptyRemoteSource(),
					...source.remote,
					headers: source.remote.headers && typeof source.remote.headers === "object"
						? source.remote.headers
						: {},
					method: source.remote.method === "POST" ? "POST" : "GET",
					refreshSeconds: typeof source.remote.refreshSeconds === "number"
						? source.remote.refreshSeconds
						: 0,
				}
				: undefined,
		},
		labelColumn: typeof raw.labelColumn === "string" ? raw.labelColumn : "",
		series: series,
		options: {
			height: typeof options.height === "number" && options.height > 0 ? options.height : base.options.height,
			legend: options.legend !== false,
			legendPosition: options.legendPosition || base.options.legendPosition,
			gridLines: options.gridLines !== false,
			xLabel: typeof options.xLabel === "string" ? options.xLabel : undefined,
			yLabel: typeof options.yLabel === "string" ? options.yLabel : undefined,
			xScale: options.xScale === "linear" || options.xScale === "time" ? options.xScale : "category",
			xScaleTimeUnit: typeof options.xScaleTimeUnit === "string" ? options.xScaleTimeUnit : base.options.xScaleTimeUnit,
			yScale: options.yScale === "logarithmic" ? "logarithmic" : "linear",
			stacked: options.stacked === true,
		},
	};
};

/** True when the block has enough configuration to draw something. */
export const chartIsRenderable = (data: ChartBlockData): boolean => {
	if (data.source.columns.length === 0) {
		return false;
	}
	return data.series.some((s) => !s.hidden && data.source.columns.indexOf(s.column) > -1);
};
