import React from "react";

import {Table, TableTheme} from "../table/Table";
import {THead} from "../thead/THead";
import {Row} from "../row/Row";
import {HeaderCell} from "../cells/headercell/HeaderCell";
import {IContextMenuItem} from "../../contextmenu/contextmenu/ContextMenu";

import './DataTable.css'
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
	statistics: boolean,
	multipleValues?: boolean,
    dropDownItems?: IContextMenuItem[]
}

interface Props {
	schema: Array<TableField>,
    data: Array<any>,
    loading?: boolean,
	loadingPlaceholderRows?: number
}

export const DataTable: React.FC<Props> = ({
                                               schema,
                                               data,
                                               loading=false,
                                               loadingPlaceholderRows=10}) => {

	const getCellValue = (row: any, field: TableField, colIdx: number) => {
		if (Array.isArray(row)) {
			return row[colIdx];
		}
		if (row && typeof row === "object") {
			if (Object.prototype.hasOwnProperty.call(row, field.label)) {
				return row[field.label];
			}
		}
		return row;
	}

	return (
		<>
			<div className="blue-orange-tables-data-table">
				<Table theme={TableTheme.DATASET}>
					<THead>
						<Row>
							{schema.map((item, index) => (
								<React.Fragment key={item.label + "-" + index}>
									{loading &&
										<LoadingCell
											key={item.label + "-" + index}
											headerCell={true}></LoadingCell>
									}
									{!loading &&
										<HeaderCell
											dropdownItems={item.dropDownItems}
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
								</React.Fragment>
							))}
						</Row>
					</THead>
					<TBody>
						{loading &&
							Array.from({ length: loadingPlaceholderRows }).map((_, index) => (
								<Row key={"loading-row-" + index} hoverEffect={false}>
									{schema.map((item, colIdx) => (
										<LoadingCell key={"loading-cell-" + index + "-" + colIdx}></LoadingCell>
									))}
								</Row>
							))
						}
						{!loading &&
							<>
								{data.map((d, rowIdx) => (
									<Row key={"row-" + rowIdx} hoverEffect={false}>
                                            {schema.map((item, colIdx) => (
										<React.Fragment key={"cell-" + rowIdx + "-" + colIdx}>
											{(() => {
												const cellValue = getCellValue(d, item, colIdx);
												return (
													<>
                                                    {item.type == TableFieldType.STRING &&
                                                        <TextDataCell style={{width: "50px"}}
															  text={cellValue}
															  multipleValues={item.multipleValues}></TextDataCell>
                                                    }
                                                    {item.type == TableFieldType.NUMBER &&
                                                        <NumberDataCell style={{width: "50px"}}
															  value={cellValue}
															  multipleValues={item.multipleValues}></NumberDataCell>
                                                    }
                                                    {item.type == TableFieldType.DATE &&
                                                        <DateDataCell style={{width: "50px"}}
																date={cellValue}
																multipleValues={item.multipleValues}></DateDataCell>
                                                    }
                                                    {item.type == TableFieldType.CURRENCY &&
                                                        <CurrencyDataCell style={{width: "50px"}}
															  amount={cellValue} currency={"AUD"}
															  multipleValues={item.multipleValues}></CurrencyDataCell>
                                                    }
                                                    {item.type == TableFieldType.STRUCT &&
                                                        <JsonObjDataCell style={{width: "50px"}}
																  obj={cellValue}
																  multipleValues={item.multipleValues}></JsonObjDataCell>
                                                    }
													</>
												);
											})()}
										</React.Fragment>
                                            ))}

                                            {/*<TextDataCell style={{width: "50px"}}*/}
                                            {/*              dropdownItems={contextMenuItems}*/}
                                            {/*              text={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}></TextDataCell>*/}
                                            {/*<NumberDataCell style={{width: "50px"}} value={15000.3338907}></NumberDataCell>*/}
                                            {/*<DateDataCell date={new Date()} style={{width: "50px"}} dateformat={"YYYY-MM-DD"}></DateDataCell>*/}
                                            {/*<CurrencyDataCell amount={10000} currency={"AUD"} style={{width: "50px"}}></CurrencyDataCell>*/}
                                            {/*<JsonObjDataCell style={{maxWidth: "200px", overflow: "hidden"}} obj={displaySchema}></JsonObjDataCell>*/}
                                        </Row>
                                    ))}
								</>
							}
						</TBody>
				</Table>
			</div>

		</>
	)
}