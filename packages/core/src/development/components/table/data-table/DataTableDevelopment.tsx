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

interface Props {
}

export const DataTableDevelopment: React.FC<Props> = ({}) => {
	const [resizableColumns, setResizableColumns] = useState<boolean>(true);
	const [reorderableColumns, setReorderableColumns] = useState<boolean>(true);
	const [cellsSelectable, setCellsSelectable] = useState<boolean>(true);
	const [rowSelectable, setRowSelectable] = useState<boolean>(false);
	const [enableInfiniteScroll, setEnableInfiniteScroll] = useState<boolean>(true);
	const [showLoadingRow, setShowLoadingRow] = useState<boolean>(false);
	const [endReachedCount, setEndReachedCount] = useState<number>(0);
	const [lastSelection, setLastSelection] = useState<Array<{rowIndex: number; colIndex: number}>>([]);
	const [lastRowSelection, setLastRowSelection] = useState<Array<number>>([]);
	const [lastClickedCell, setLastClickedCell] = useState<{cellIdx: number; rowIdx: number; position: DataTableCellClickPosition} | null>(null);
	const [lastRightClickedCell, setLastRightClickedCell] = useState<{cellIdx: number; rowIdx: number; position: DataTableCellClickPosition} | null>(null);

	const displaySchema: Array<TableField> = [
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
			"Test Struct (Multiple)": [{id: 1, tag: "a"}, {id: 2, tag: "b"}]
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
			"Test Struct (Multiple)": [{k: "v"}, {arr: [1, 2, 3]}]
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
			"Test Struct (Multiple)": [null, {ok: true}]
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
	});

	const [generatedRowsCount, setGeneratedRowsCount] = useState<number>(40);
	const isLoadingMoreRef = useRef<boolean>(false);

	const data = useMemo(() => {
		const generated = Array.from({length: generatedRowsCount}).map((_, i) => makeGeneratedRow(i + 1));
		return [...baseDemoData, ...generated];
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
					schema={displaySchema}
					data={data}
					loading={false}
					loadingPlaceholderRows={2}
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