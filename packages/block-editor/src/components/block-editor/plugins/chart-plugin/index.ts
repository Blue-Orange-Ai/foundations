// Public surface of the chart block plugin.
//
// The plugin is registered with the primitives block editor through
// `options.additionalPlugins`; BlueOrangeBlockEditorWrapper does that for you
// when `enableCharts` is left on, and everything here is exported so a host
// that builds its own editor options can register it directly.

import "./ChartPlugin.css";

export {CHART_BLOCK_TYPE, ChartPlugin, chartPluginEntry, insertChartBlock} from "./ChartPlugin";
export {ChartBlockController} from "./ChartBlockController";
export {chartToHtml, chartToMarkdown} from "./chartExport";
export {
	CHART_COLOR_PALETTE,
	CHART_DATA_VERSION,
	CHART_LINE_STYLE_DASH,
	chartIsRenderable,
	createSeries,
	emptyChartData,
	emptyRemoteSource,
	migrateChartData,
	withAlpha,
} from "./ChartBlockTypes";
export type {
	ChartBlockData,
	ChartDataSource,
	ChartDataTable,
	ChartDisplayOptions,
	ChartKind,
	ChartLegendPosition,
	ChartLineStyle,
	ChartRemoteResponse,
	ChartRemoteSource,
	ChartSeries,
	ChartSeriesKind,
	ChartSourceKind,
	ChartXScale,
	ChartYScale,
} from "./ChartBlockTypes";
export {
	addSeries,
	applyKind,
	applyTable,
	moveSeries,
	removeSeries,
	unusedColumns,
	updateSeries,
} from "./chartConfigOps";
export type {ChartTableMeta} from "./chartConfigOps";
export {detectDelimiter, parseCsv, parseDelimitedRows} from "./data/csv";
export {columnIsNumeric, gridToTable, uniqueColumnNames} from "./data/tabular";
export {columnIndexFromRef, excelSerialToIso, parseXlsx} from "./data/xlsx";
export type {XlsxWorkbook} from "./data/xlsx";
export {fetchRemoteTable, remoteResponseToTable, selectPath} from "./data/remote";
export {CHART_UPLOAD_ACCEPT, parseUploadedFile} from "./data/upload";
export type {ChartUploadResult} from "./data/upload";
export {ChartBlockView} from "./view/ChartBlockView";
export {ChartConfigModal} from "./view/ChartConfigModal";
export {ChartRenderer} from "./view/ChartRenderer";
export {chartDatasets, chartLabels, rendersAsCombo, visibleSeries} from "./view/chartDatasets";
