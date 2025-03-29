import React from "react";

import {Table, TableTheme} from "../table/Table";
import {THead} from "../thead/THead";
import {Row} from "../row/Row";
import {HeaderCell} from "../cells/headercell/HeaderCell";
import {IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";
import {DropdownItemText} from "../../inputs/dropdown/items/DropdownItemText/DropdownItemText";

import './DataTable.css'
import {Cell} from "../cells/cell/Cell";
import {TBody} from "../tbody/TBody";
import {TextDataCell} from "../cells/text-data-cell/TextDataCell";
import {LoadingCell} from "../cells/loading-cell/LoadingCell";
import {DateDataCell} from "../cells/date-data-cell/DateDataCell";
import {CurrencyDataCell} from "../cells/currency-data-cell/CurrencyDataCell";
import {NumberDataCell} from "../cells/number-data-cell/NumberDataCell";
import {JsonObjDataCell} from "../cells/json-obj-data-cell/JsonObjDataCell";

export enum TableFieldType {
	STRING="STRING",
	NUMBER="NUMBER",
	DATE="DATE",
	CURRENCY="CURRENCY",
	STRUCT="STRUCT",
	GEO_POINT="GEO POINT",
}

export enum TableFieldSortState {
	SORTED_ASC="SORTED_ASC",
	SORTED_DESC="SORTED_DESC",
	UNSORTED="UNSORTED",
}

export interface TableField {
	label: string,
	type: TableFieldType,
	sortState: TableFieldSortState,
	sortable: boolean,
	filterable: boolean,
	statistics: boolean
}

export interface Dataset {
	schema: Array<TableField>
}

interface Props {
	loading?: boolean,
	loadingPlaceholderRows?: number
}

export const DataTable: React.FC<Props> = ({loading=false, loadingPlaceholderRows=10}) => {

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

	const contextMenuItems = [
		{type: IContextMenuType.HEADING, label: "Sort Direction", value:""},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.SEPARATOR, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
	]

	const generateContextItems = (tableField: TableField) => {
		const items = [];
		if (tableField.sortable) {
			items.push({type: IContextMenuType.HEADING, label: "Sort Direction", value:""});
			items.push({type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"});
			items.push({type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"});
		}
		if (tableField.filterable) {
			items.push({type: IContextMenuType.HEADING, label: "Filter", value:""});
			items.push({type: IContextMenuType.CONTENT, label: "Filter on value", icon: "ri-search-line", value: "SORT_ASC"});
		}
		if (tableField.statistics) {
			items.push({type: IContextMenuType.HEADING, label: "Statistics", value:""});
			items.push({type: IContextMenuType.CONTENT, label: "View Statistics", icon: "ri-bar-chart-horizontal-line", value: "SORT_ASC"});
		}
		return items
	}

	return (
		<>
			<div className="blue-orange-tables-data-table">
				<Table theme={TableTheme.DATASET}>
					<THead>
						<Row>
							{displaySchema.map((item, index) => (
								<>
									{loading &&
										<LoadingCell
											key={item.label + "-" + index}
											headerCell={true}></LoadingCell>
									}
									{!loading &&
										<HeaderCell
											dropdownItems={generateContextItems(item)}
											onDropdownSelected={(item: IContextMenuItem) => {
											}}>
											<div className="blue-orange-data-table-header-cell-group" style={{width: "50px"}}>
										<span
											className="blue-orange-data-table-header-cell-primary-text">{item.label}</span>
												<span
													className="blue-orange-data-table-header-cell-column-type">{item.type.toString()}</span>
											</div>
										</HeaderCell>
									}
								</>
							))}
						</Row>
					</THead>
					<TBody>
						<>
							{loading &&
								<>
									{Array.from({ length: loadingPlaceholderRows }).map((_, index) => (
										<>
											<Row hoverEffect={false}>
												{displaySchema.map((item, index) => (
													<>
														<LoadingCell></LoadingCell>
													</>
												))}
											</Row>
										</>
									))}
								</>
							}
							{!loading &&
								<Row hoverEffect={false}>
									<TextDataCell style={{width: "50px"}}
												  text={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}></TextDataCell>
									<NumberDataCell style={{width: "50px"}} value={15000.3338907}></NumberDataCell>
									<DateDataCell date={new Date()} style={{width: "50px"}} dateformat={"YYYY-MM-DD"}></DateDataCell>
									<CurrencyDataCell amount={10000} currency={"AUD"} style={{width: "50px"}}></CurrencyDataCell>
									<JsonObjDataCell style={{maxWidth: "200px", overflow: "hidden"}} obj={displaySchema}></JsonObjDataCell>
								</Row>
							}
						</>
					</TBody>
				</Table>
			</div>

		</>
	)
}