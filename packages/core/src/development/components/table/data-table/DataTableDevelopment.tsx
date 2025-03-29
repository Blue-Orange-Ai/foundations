import React from "react";

import './DataTableDevelopment.css'
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SimpleTooltip} from "../../../../components/tooltips/simple-tooltip/SimpleTooltip";
import {
	DataTable,
	TableField,
	TableFieldSortState,
	TableFieldType
} from "../../../../components/table/data-table/DataTable";
import {JsonObjectText} from "../../../../components/text-decorations/json-object-text/JsonObjectText";

interface Props {
}

export const DataTableDevelopment: React.FC<Props> = ({}) => {

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
			label: "Test Number",
			type: TableFieldType.NUMBER,
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
			label: "Test Currency",
			type: TableFieldType.CURRENCY,
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
	]

	return (
		<PaddedPage>
			<PageHeading>Data Table</PageHeading>
			<JsonObjectText obj={displaySchema}></JsonObjectText>
			<DataTable></DataTable>
		</PaddedPage>
	)
}