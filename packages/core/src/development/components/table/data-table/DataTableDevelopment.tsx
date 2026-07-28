import React, {useEffect, useMemo, useRef, useState} from "react";

import './DataTableDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {Checkbox} from "../../../../components/inputs/checkbox/Checkbox";
import {
	DataTable,
	DataTableCellClickPosition,
	TableField,
	TableFieldSortState,
	TableFieldType
} from "../../../../components/table/data-table/DataTable";
import {BaseData, BaseDataType, SearchRecord} from "@blue-orange-ai/foundations-clients";

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
	const [enableInfiniteScroll, setEnableInfiniteScroll] = useState<boolean>(true);
	const [showLoadingRow, setShowLoadingRow] = useState<boolean>(false);
	const [endReachedCount, setEndReachedCount] = useState<number>(0);
	const [lastSelection, setLastSelection] = useState<Array<{rowIndex: number; colIndex: number}>>([]);
	const [lastRowSelection, setLastRowSelection] = useState<Array<number>>([]);
	const [lastClickedCell, setLastClickedCell] = useState<{cellIdx: number; rowIdx: number; position: DataTableCellClickPosition} | null>(null);
	const [lastRightClickedCell, setLastRightClickedCell] = useState<{cellIdx: number; rowIdx: number; position: DataTableCellClickPosition} | null>(null);

	const displaySchema: Array<Omit<TableField, "apiName">> = [
		{
			label: "Test String",
			type: TableFieldType.STRING,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test String (Multiple)",
			type: TableFieldType.STRING,
			multipleValues: true,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Number",
			type: TableFieldType.NUMBER,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Number (Multiple)",
			type: TableFieldType.NUMBER,
			multipleValues: true,
			sortable: true,
			filterable: false,
			statistics: false,
			sortState: TableFieldSortState.UNSORTED
		},
		{
			label: "Test Date",
			type: TableFieldType.DATE,
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
		<PaddedPage>
			<PageHeading>Data Table</PageHeading>
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
			<div style={{marginBottom: 12, fontSize: 12, fontFamily: "monospace"}}>
				End reached count: {endReachedCount}
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
					onCellRightClick={(cellIdx, rowIdx, position) => setLastRightClickedCell({cellIdx, rowIdx, position})}></DataTable>
			</div>
		</PaddedPage>
	)
}