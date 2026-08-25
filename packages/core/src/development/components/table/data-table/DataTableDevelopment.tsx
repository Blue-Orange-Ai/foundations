import React, {useEffect, useMemo, useRef, useState} from "react";

import './DataTableDevelopment.css'
import {Checkbox} from "../../../../components/inputs/checkbox/Checkbox";
import {
	DataTable,
	DataTableCellClickPosition,
	NumberCellStyle,
	TableField,
	TableFieldSortState,
	TableFieldType
} from "../../../../components/table/data-table/DataTable";
import {IContextMenuType} from "../../../../components/contextmenu/contextmenu/ContextMenu";
import {BaseData, BaseDataType, SearchRecord} from "@blue-orange-ai/foundations-clients";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const TABLE_FIELD_INTERFACE = {
	name: "TableField",
	description: "One column of the schema. Its type decides which cell the column is rendered with, and the rest describes what the column can do.",
	props: [
		{name: "label", type: "string", required: true, description: "The column heading."},
		{name: "apiName", type: "string", required: true, description: "The key the value is read from on each record."},
		{name: "type", type: "TableFieldType", required: true, description: "STRING, NUMBER, DATE, CURRENCY, STRUCT, GEO POINT or MARKDOWN — which cell the column uses."},
		{name: "sortState", type: "TableFieldSortState", required: true, description: "Whether the column is sorted, and which way."},
		{name: "sortable", type: "boolean", required: true, description: "Whether the heading offers to sort by this column."},
		{name: "filterable", type: "boolean", required: true, description: "Whether the column offers add as filter in its menu."},
		{name: "statistics", type: "boolean", required: true, description: "Whether the column offers its own statistics."},
		{name: "multipleValues", type: "boolean", description: "The column holds an array per row rather than one value."},
		{name: "dropDownItems", type: "IContextMenuItem[]", description: "Extra rows on this column's heading menu."},
		{name: "numberStyle", type: "NumberCellStyle", default: "NumberCellStyle.PLAIN", description: "How a NUMBER column is rendered — plain digits, locale formatted, or as money."},
		{name: "currency", type: "string", default: "\"AUD\"", description: "The ISO code for CURRENCY columns, and for NUMBER columns styled as currency."},
		{name: "dateFormat", type: "string", description: "A moment format for DATE columns. ISO when it is left off."},
		{name: "description", type: "string", description: "The second line under the heading. It falls back to the field type; pass an empty string to drop it."}
	] as Array<PropSpec>
};

const DATA_TABLE_PROPS: Array<PropSpec> = [
	{
		name: "schema",
		type: "Array<TableField>",
		required: true,
		description: "The columns, in the order they are shown."
	},
	{
		name: "data",
		type: "Array<SearchRecord>",
		required: true,
		description: "The rows. Each one carries a list of typed properties keyed by the schema's apiName."
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Replaces the rows with shimmering placeholders."
	},
	{
		name: "loadingPlaceholderRows",
		type: "number",
		default: "10",
		control: "slider",
		min: 1,
		max: 20,
		step: 1,
		description: "How many placeholder rows are drawn while loading."
	},
	{
		name: "showRowNumbers",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a numbered gutter down the left."
	},
	{
		name: "freezeHeader",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Keeps the heading row in place as the body scrolls."
	},
	{
		name: "freezeRowNumbers",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Keeps the numbered gutter in place as the table scrolls sideways."
	},
	{
		name: "persistKey",
		type: "string",
		description: "Remembers the column widths and order under this key, so the table comes back the way it was left."
	},
	{
		name: "enableInfiniteScroll",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Calls onEndReached as the bottom of the table comes into view."
	},
	{
		name: "onEndReached",
		type: "() => void",
		description: "Fires when the table has been scrolled to the end — where the next page is fetched."
	},
	{
		name: "showLoadingRow",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Draws a loading row at the foot while the next page is on its way."
	},
	{
		name: "resizableColumns",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a drag handle on each column's trailing edge."
	},
	{
		name: "reorderableColumns",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets a column be dragged into a new position."
	},
	{
		name: "cellsSelectable",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets a range of cells be selected, the way a spreadsheet does."
	},
	{
		name: "rowSelectable",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a checkbox on each row and reports the selection."
	},
	{
		name: "minColumnWidth",
		type: "number",
		default: "50",
		control: "number",
		description: "How narrow a column can be dragged, in pixels."
	},
	{
		name: "maxColumnWidth",
		type: "number",
		control: "number",
		description: "How wide a column can be dragged, in pixels."
	},
	{
		name: "onColumnOrderChange",
		type: "(previousIndex: number, newIndex: number, updatedSchema: Array<TableField>) => void",
		description: "Fires with the move that was made and the schema it produced."
	},
	{
		name: "onCellSelection",
		type: "(selection: Array<{rowIndex: number; colIndex: number}>) => void",
		description: "Fires with every cell in the current selection."
	},
	{
		name: "onRowSelectable",
		type: "(selection: Array<number>) => void",
		description: "Fires with the indexes of the selected rows."
	},
	{
		name: "onCellClick",
		type: "(colIdx: number, rowIdx: number, position: DataTableCellClickPosition) => void",
		description: "Fires with the cell that was clicked and where in it the click landed."
	},
	{
		name: "onCellRightClick",
		type: "(colIdx: number, rowIdx: number, position: DataTableCellClickPosition) => void",
		description: "The same for a right click, which is what opens the context menu."
	},
	{
		name: "onHeaderDropdownSelected",
		type: "(item: IContextMenuItem) => void",
		description: "Fires with whichever row of a column's heading menu was picked."
	},
	{
		name: "onAddAsFilter",
		type: "(field: TableField, values: string[], fieldType: TableFieldType) => void",
		description: "Fires when add as filter is chosen on a cell, with the field and the values to filter on."
	},
	{
		name: "contextMenuItems",
		type: "Array<IContextMenuItem> | ((context: DataTableContextMenuContext) => Array<IContextMenuItem> | undefined)",
		description: "Extra rows appended to the cell context menu, under a divider. Pass a function to vary them per cell — it runs on every right click and on every render while the menu is open, so keep it free of side effects."
	},
	{
		name: "hideDefaultContextMenuItems",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Drops the table's own copy and filter rows, leaving only the ones you supplied."
	},
	{
		name: "onContextMenuItemClick",
		type: "(item: IContextMenuItem, context: DataTableContextMenuContext) => void",
		description: "Fires when one of your own rows is clicked, with the cell the menu was opened on. The table's own rows never reach it."
	},
	{
		name: "renderColumnHeader",
		type: "(field: TableField, colIdx: number) => React.ReactNode",
		description: "Replaces the whole heading body. The sort arrows, the resize handle and the heading menu stay with the table."
	}
];

interface Props {
}

// The DataTable consumes SearchRecord rows (each a list of typed `properties`).
// These helpers turn the plain demo objects into that shape based on the schema.
const elementBaseType = (fieldType: TableFieldType): BaseDataType => {
	switch (fieldType) {
		case TableFieldType.NUMBER:
		case TableFieldType.CURRENCY:
			return BaseDataType.DOUBLE;
		case TableFieldType.DATE:
			return BaseDataType.DATE;
		case TableFieldType.GEO_POINT:
			return BaseDataType.GEO_POINT;
		case TableFieldType.STRUCT:
			return BaseDataType.OBJECT;
		default:
			return BaseDataType.TEXT;
	}
};

const scalarValue = (fieldType: TableFieldType, raw: any): string => {
	if (fieldType === TableFieldType.STRUCT) return JSON.stringify(raw);
	if (fieldType === TableFieldType.DATE) return raw instanceof Date ? raw.toISOString() : String(raw);
	return String(raw);
};

const toBaseData = (key: string, fieldType: TableFieldType, raw: any): BaseData => {
	if (raw === null || raw === undefined) {
		return {key, type: elementBaseType(fieldType)};
	}
	if (Array.isArray(raw)) {
		return {
			key,
			type: BaseDataType.ARRAY,
			array: raw.map((el) =>
				fieldType === TableFieldType.GEO_POINT
					? {key, type: BaseDataType.GEO_POINT, lat: el?.lat, lon: el?.lon}
					: {key, type: elementBaseType(fieldType), value: scalarValue(fieldType, el)}
			),
		};
	}
	if (fieldType === TableFieldType.GEO_POINT) {
		return {key, type: BaseDataType.GEO_POINT, lat: raw?.lat, lon: raw?.lon};
	}
	return {key, type: elementBaseType(fieldType), value: scalarValue(fieldType, raw)};
};

const toSearchRecord = (obj: any, schema: Array<TableField>): SearchRecord => {
	const properties = schema.map((field) => toBaseData(field.apiName, field.type, obj[field.apiName]));
	const primaryKey: BaseData = properties[0] ?? {key: "id", type: BaseDataType.TEXT, value: ""};
	return {primaryKey, title: primaryKey, properties};
};

export const DataTableDevelopment: React.FC<Props> = ({}) => {
	const [resizableColumns, setResizableColumns] = useState<boolean>(true);
	const [reorderableColumns, setReorderableColumns] = useState<boolean>(true);
	const [cellsSelectable, setCellsSelectable] = useState<boolean>(true);
	const [rowSelectable, setRowSelectable] = useState<boolean>(false);
	const [showRowNumbers, setShowRowNumbers] = useState<boolean>(true);
	const [freezeHeader, setFreezeHeader] = useState<boolean>(true);
	const [freezeRowNumbers, setFreezeRowNumbers] = useState<boolean>(true);
	const [enableInfiniteScroll, setEnableInfiniteScroll] = useState<boolean>(true);
	const [showLoadingRow, setShowLoadingRow] = useState<boolean>(false);
	const [customColumnHeaders, setCustomColumnHeaders] = useState<boolean>(false);
	const [endReachedCount, setEndReachedCount] = useState<number>(0);
	const [lastSelection, setLastSelection] = useState<Array<{rowIndex: number; colIndex: number}>>([]);
	const [lastRowSelection, setLastRowSelection] = useState<Array<number>>([]);
	const [lastClickedCell, setLastClickedCell] = useState<{cellIdx: number; rowIdx: number; position: DataTableCellClickPosition} | null>(null);
	const [lastRightClickedCell, setLastRightClickedCell] = useState<{cellIdx: number; rowIdx: number; position: DataTableCellClickPosition} | null>(null);
	const [customContextMenu, setCustomContextMenu] = useState<boolean>(false);
	const [hideDefaultContextMenuItems, setHideDefaultContextMenuItems] = useState<boolean>(false);
	const [lastCustomMenuAction, setLastCustomMenuAction] = useState<string>("");

	const displaySchema: Array<Omit<TableField, "apiName">> = [
		{
			// Describes itself rather than showing the field type under the label.
			label: "Test String",
			type: TableFieldType.STRING,
			description: "Free text, as typed",
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			// An empty description drops the second line entirely.
			label: "Test String (Multiple)",
			description: "",
			type: TableFieldType.STRING,
			multipleValues: true,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			// No numberStyle: renders the digits as they are — the default.
			label: "Test Number",
			type: TableFieldType.NUMBER,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			// Opted into locale formatting (thousands separators) via the schema.
			label: "Test Number (Multiple)",
			type: TableFieldType.NUMBER,
			numberStyle: NumberCellStyle.PRETTY,
			multipleValues: true,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			// Rendering style set in the schema rather than ISO default.
			label: "Test Date",
			type: TableFieldType.DATE,
			dateFormat: "DD MMM YYYY HH:mm",
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Date (Multiple)",
			type: TableFieldType.DATE,
			multipleValues: true,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Currency",
			type: TableFieldType.CURRENCY,
			currency: "USD",
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Currency (Multiple)",
			type: TableFieldType.CURRENCY,
			multipleValues: true,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Struct",
			type: TableFieldType.STRUCT,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		}
		,
		{
			label: "Test Struct (Multiple)",
			type: TableFieldType.STRUCT,
			multipleValues: true,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Markdown",
			type: TableFieldType.MARKDOWN,
			sortable: false,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Markdown (Multiple)",
			type: TableFieldType.MARKDOWN,
			multipleValues: true,
			sortable: false,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		}
	]

	const baseDemoData = [
		{
			"Test String": "Alpha",
			"Test String (Multiple)": ["Alpha", "Beta", "Gamma"],
			"Test Number": 1234.56,
			"Test Number (Multiple)": [1, 2.5, 3.14159],
			"Test Date": new Date("2025-01-15T10:00:00Z"),
			"Test Date (Multiple)": [new Date("2025-01-01T00:00:00Z"), new Date("2025-02-01T00:00:00Z")],
			"Test Currency": 99.95,
			"Test Currency (Multiple)": [10, 20.55, 3000],
			"Test Struct": {id: 1, name: "Alice", active: true},
			"Test Struct (Multiple)": [{id: 1, tag: "a"}, {id: 2, tag: "b"}],
			"Test Markdown": "**Bold text** and *italic* with `code`",
			"Test Markdown (Multiple)": ["# Heading", "- List item 1\n- List item 2"]
		},
		{
			"Test String": "Lorem ipsum",
			"Test String (Multiple)": ["One", "Two"],
			"Test Number": -42,
			"Test Number (Multiple)": [10, -20, 30],
			"Test Date": new Date(),
			"Test Date (Multiple)": [new Date("2024-12-31T00:00:00Z"), new Date()],
			"Test Currency": 15000.333,
			"Test Currency (Multiple)": [0, 0.01, 999999.99],
			"Test Struct": {nested: {a: 1, b: ["x", "y"]}},
			"Test Struct (Multiple)": [{k: "v"}, {arr: [1, 2, 3]}],
			"Test Markdown": "[Link](https://example.com) and ~~strikethrough~~",
			"Test Markdown (Multiple)": ["**First**", "*Second*", "`Third`"]
		},
		{
			"Test String": "",
			"Test String (Multiple)": [],
			"Test Number": 0,
			"Test Number (Multiple)": [],
			"Test Date": "invalid",
			"Test Date (Multiple)": ["invalid", "2025-03-01"],
			"Test Currency": "invalid",
			"Test Currency (Multiple)": ["invalid", 12.34],
			"Test Struct": null,
			"Test Struct (Multiple)": [null, {ok: true}],
			"Test Markdown": "Simple text with no formatting",
			"Test Markdown (Multiple)": []
		}
	]

	const makeGeneratedRow = (idx: number) => ({
		"Test String": `Generated ${idx}`,
		"Test String (Multiple)": [`Generated ${idx}`, `Tag ${idx % 5}`],
		"Test Number": idx,
		"Test Number (Multiple)": [idx, idx * 2, idx * 3],
		"Test Date": new Date(Date.now() - idx * 60_000),
		"Test Date (Multiple)": [new Date(Date.now() - idx * 60_000), new Date(Date.now() - idx * 120_000)],
		"Test Currency": (idx * 1.23) % 1000,
		"Test Currency (Multiple)": [idx * 0.1, idx * 0.2, idx * 0.3],
		"Test Struct": {id: idx, active: idx % 2 === 0},
		"Test Struct (Multiple)": [{id: idx, tag: "a"}, {id: idx + 1, tag: "b"}],
		"Test Markdown": `**Row ${idx}** with _emphasis_ and \`code\``,
		"Test Markdown (Multiple)": [`Item **${idx}**`, `Sub-item *${idx % 5}*`],
	});

	const [generatedRowsCount, setGeneratedRowsCount] = useState<number>(40);
	const isLoadingMoreRef = useRef<boolean>(false);

	// Derive the apiName from the label so plain-object rows can be keyed to columns.
	const schema: Array<TableField> = displaySchema.map((f) => ({...f, apiName: f.label}));

	const data = useMemo(() => {
		const generated = Array.from({length: generatedRowsCount}).map((_, i) => makeGeneratedRow(i + 1));
		return [...baseDemoData, ...generated].map((row) => toSearchRecord(row, schema));
	}, [generatedRowsCount]);

	useEffect(() => {
		if (!enableInfiniteScroll) {
			setShowLoadingRow(false);
			isLoadingMoreRef.current = false;
		}
	}, [enableInfiniteScroll]);

	const handleEndReached = () => {
		setEndReachedCount((c) => c + 1);
		if (!enableInfiniteScroll) {
			return;
		}
		if (isLoadingMoreRef.current) {
			return;
		}
		isLoadingMoreRef.current = true;
		setShowLoadingRow(true);

		window.setTimeout(() => {
			setGeneratedRowsCount((n) => n + 20);
			setShowLoadingRow(false);
			isLoadingMoreRef.current = false;
		}, 900);
	}

	return (
		<ComponentDoc
			title="Data Table"
			description="The dataset grid. It takes a schema of typed fields and a list of records, and renders each column with the cell its type calls for — frozen headers, resizable and reorderable columns, cell and row selection, infinite scroll, and a context menu that can be extended or replaced."
			name="DataTable"
			previewHeight={420}
			previewCentered={false}
			imports={["TableField", "TableFieldType", "TableFieldSortState"]}
			interfaces={[TABLE_FIELD_INTERFACE]}
			props={DATA_TABLE_PROPS}
			preview={values => (
				<div style={{height: "380px", overflowY: "auto", width: "100%", position: "relative"}}>
					<DataTable
						schema={schema}
						data={data}
						loading={values.loading}
						loadingPlaceholderRows={values.loadingPlaceholderRows}
						showRowNumbers={values.showRowNumbers}
						freezeHeader={values.freezeHeader}
						freezeRowNumbers={values.freezeRowNumbers}
						showLoadingRow={values.showLoadingRow}
						resizableColumns={values.resizableColumns}
						reorderableColumns={values.reorderableColumns}
						cellsSelectable={values.cellsSelectable}
						rowSelectable={values.rowSelectable}
						minColumnWidth={values.minColumnWidth}
						maxColumnWidth={values.maxColumnWidth}
						hideDefaultContextMenuItems={values.hideDefaultContextMenuItems}></DataTable>
				</div>
			)}>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={resizableColumns} onCheckboxChange={setResizableColumns}></Checkbox>
				<span style={{marginLeft: 8}}>Resizable columns</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={reorderableColumns} onCheckboxChange={setReorderableColumns}></Checkbox>
				<span style={{marginLeft: 8}}>Reorderable columns</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={cellsSelectable} onCheckboxChange={setCellsSelectable}></Checkbox>
				<span style={{marginLeft: 8}}>Cells selectable</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={rowSelectable} onCheckboxChange={setRowSelectable}></Checkbox>
				<span style={{marginLeft: 8}}>Row selectable</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={enableInfiniteScroll} onCheckboxChange={setEnableInfiniteScroll}></Checkbox>
				<span style={{marginLeft: 8}}>Enable infinite scroll</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={showRowNumbers} onCheckboxChange={setShowRowNumbers}></Checkbox>
				<span style={{marginLeft: 8}}>Show row numbers</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={freezeHeader} onCheckboxChange={setFreezeHeader}></Checkbox>
				<span style={{marginLeft: 8}}>Freeze header row</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={freezeRowNumbers} onCheckboxChange={setFreezeRowNumbers}></Checkbox>
				<span style={{marginLeft: 8}}>Freeze row numbers</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={customColumnHeaders} onCheckboxChange={setCustomColumnHeaders}></Checkbox>
				<span style={{marginLeft: 8}}>Custom column headers (renderColumnHeader)</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={customContextMenu} onCheckboxChange={setCustomContextMenu}></Checkbox>
				<span style={{marginLeft: 8}}>Custom context menu items (contextMenuItems)</span>
			</div>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={hideDefaultContextMenuItems} onCheckboxChange={setHideDefaultContextMenuItems}></Checkbox>
				<span style={{marginLeft: 8}}>Hide default context menu items</span>
			</div>
			<div style={{marginBottom: 12, fontSize: 12, fontFamily: "monospace"}}>
				End reached count: {endReachedCount}
			</div>
			<div style={{marginBottom: 12, fontSize: 12, fontFamily: "monospace"}}>
				Last custom menu action: {lastCustomMenuAction || "-"}
			</div>
			<div style={{marginBottom: 12, fontSize: 12, fontFamily: "monospace"}}>
				Rows: {data.length} {showLoadingRow ? "(loading...)" : ""}
			</div>
			<div style={{marginBottom: 12, fontSize: 12, fontFamily: "monospace"}}>
				Last selection: {JSON.stringify(lastSelection)}
			</div>
			<div style={{marginBottom: 12, fontSize: 12, fontFamily: "monospace"}}>
				Last row selection: {JSON.stringify(lastRowSelection)}
			</div>
			<div style={{marginBottom: 12, fontSize: 12, fontFamily: "monospace"}}>
				Last clicked cell: {JSON.stringify(lastClickedCell)}
			</div>
			<div style={{marginBottom: 12, fontSize: 12, fontFamily: "monospace"}}>
				Last right clicked cell: {JSON.stringify(lastRightClickedCell)}
			</div>
			<div style={{height: 420, overflowY: "auto", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 6, position: "relative"}}>
				<DataTable
					persistKey="datatable-development"
					schema={schema}
					data={data}
					loading={false}
					loadingPlaceholderRows={2}
					showRowNumbers={showRowNumbers}
					freezeHeader={freezeHeader}
					freezeRowNumbers={freezeRowNumbers}
					enableInfiniteScroll={enableInfiniteScroll}
					onEndReached={handleEndReached}
					showLoadingRow={showLoadingRow}
					resizableColumns={resizableColumns}
					reorderableColumns={reorderableColumns}
					cellsSelectable={cellsSelectable}
					rowSelectable={rowSelectable}
					onCellSelection={(selection) => setLastSelection(selection)}
					onRowSelectable={(selection) => setLastRowSelection(selection)}
					onCellClick={(cellIdx, rowIdx, position) => setLastClickedCell({cellIdx, rowIdx, position})}
					onCellRightClick={(cellIdx, rowIdx, position) => setLastRightClickedCell({cellIdx, rowIdx, position})}
					hideDefaultContextMenuItems={hideDefaultContextMenuItems}
					contextMenuItems={customContextMenu
						? (context) => {
							if (context.isHeader) {
								return [{
									label: `Hide "${context.field?.label}"`,
									icon: "ri-eye-off-line",
									type: IContextMenuType.CONTENT,
									value: {action: "hideColumn", colIdx: context.colIdx}
								}];
							}
							return [
								{
									label: "Open record",
									icon: "ri-external-link-line",
									type: IContextMenuType.CONTENT,
									value: {action: "openRecord", rowIdx: context.rowIdx}
								},
								{
									label: "Share",
									icon: "ri-share-line",
									type: IContextMenuType.GROUP,
									children: [
										{label: "Email", type: IContextMenuType.CONTENT, value: {action: "shareEmail"}},
										{label: "Slack", type: IContextMenuType.CONTENT, value: {action: "shareSlack"}},
									]
								},
								{
									label: `Delete ${context.selectedRows.length > 1 ? `${context.selectedRows.length} rows` : "row"}`,
									icon: "ri-delete-bin-line",
									type: IContextMenuType.CONTENT,
									value: {action: "delete", rowIdx: context.rowIdx}
								},
							];
						}
						: undefined}
					onContextMenuItemClick={(item, context) => {
						setLastCustomMenuAction(`${item.value?.action} @ row ${context.rowIdx}, col ${context.colIdx} (${context.cellValue ?? "header"})`);
					}}
					renderColumnHeader={customColumnHeaders
						? (field, colIdx) => (
							<div className="blue-orange-data-table-header-cell-group">
								<span className="blue-orange-data-table-header-cell-primary-text">
									<i className="ri-price-tag-3-line" style={{marginRight: 4}}></i>
									{field.label.toUpperCase()}
								</span>
								<span className="blue-orange-data-table-header-cell-column-type">column {colIdx + 1}</span>
							</div>
						)
						: undefined}></DataTable>
			</div>
		</ComponentDoc>
	)
}