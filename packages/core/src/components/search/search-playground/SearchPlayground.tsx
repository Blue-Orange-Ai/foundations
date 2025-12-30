import React, {useEffect, useRef, useState} from "react";

import './SearchPlayground.css';
import {IBlueOrangeSearchIndex, SearchQueryEditor} from "../search-query-editor/SearchQueryEditor";
import {DataTable, TableField, TableFieldSortState, TableFieldType} from "../../table/data-table/DataTable";

interface Props {
}

export const SearchPlayground: React.FC<Props> = ({}) => {

    const index: IBlueOrangeSearchIndex = {
        name: "demo-index",
        displayName: "Demo Search Query",
        description: "Build a BlueOrange search Query using a schema",
        schema: {
            properties: [
                { apiName: "name", displayName: "Name", type: "TEXT" },
                { apiName: "status", displayName: "Status", type: "KEYWORDS" },
                { apiName: "createdAt", displayName: "Created At", type: "DATE" },
                { apiName: "age", displayName: "Age", type: "INTEGER" },
                { apiName: "active", displayName: "Active", type: "BOOLEAN" },
                { apiName: "location", displayName: "Location", type: "GEO_POINT" },
                { apiName: "metadata", displayName: "Metadata", type: "OBJECT" },
                { apiName: "embedding", displayName: "Embedding", type: "VECTOR" }
            ]
        }
    }

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

    return (
        <div className="blue-orange-search-playground">
            <div className="blue-orange-search-playground-query-cont">
                <SearchQueryEditor
                    showHeader={false}
                    index={index}
                    reportChangesOnSaveOnly={false}></SearchQueryEditor>
            </div>
            <div className="blue-orange-search-playground-body-cont">
                <DataTable
                    persistKey="datatable-development"
                    schema={displaySchema}
                    data={baseDemoData}
                    loading={false}
                    loadingPlaceholderRows={2}
                    showRowNumbers={false}
                    enableInfiniteScroll={true}
                    resizableColumns={true}
                    reorderableColumns={true}
                    cellsSelectable={false}
                    rowSelectable={true}
                    ></DataTable>
            </div>
        </div>
    )

};