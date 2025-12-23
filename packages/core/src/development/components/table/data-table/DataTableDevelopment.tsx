import React, {useState} from "react";

import './DataTableDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {Checkbox} from "../../../../components/inputs/checkbox/Checkbox";
import {
	DataTable,
	TableField,
	TableFieldSortState,
	TableFieldType
} from "../../../../components/table/data-table/DataTable";

interface Props {
}

export const DataTableDevelopment: React.FC<Props> = ({}) => {
	const [resizableColumns, setResizableColumns] = useState<boolean>(true);

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

	const demoData = [
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

	return (
		<PaddedPage>
			<PageHeading>Data Table</PageHeading>
			<div style={{marginBottom: 12}}>
				<Checkbox checked={resizableColumns} onCheckboxChange={setResizableColumns}></Checkbox>
				<span style={{marginLeft: 8}}>Resizable columns</span>
			</div>
			<DataTable schema={displaySchema} data={demoData} loading={false} loadingPlaceholderRows={2} resizableColumns={resizableColumns}></DataTable>
		</PaddedPage>
	)
}