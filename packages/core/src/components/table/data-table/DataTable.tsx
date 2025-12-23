import React, {useEffect, useRef, useState} from "react";

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
	loadingPlaceholderRows?: number,
	resizableColumns?: boolean,
	minColumnWidth?: number,
	maxColumnWidth?: number
}

export const DataTable: React.FC<Props> = ({
                                               schema,
                                               data,
                                               loading=false,
                                               loadingPlaceholderRows=10,
												resizableColumns=false,
												minColumnWidth=50,
												maxColumnWidth}) => {

	const clampWidth = (width: number): number => {
		const next = Math.max(minColumnWidth, width);
		if (typeof maxColumnWidth === "number") {
			return Math.min(maxColumnWidth, next);
		}
		return next;
	}

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

	const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});
	const [resizeGuideLeft, setResizeGuideLeft] = useState<number | null>(null);
	const resizingRef = useRef<{
		colIdx: number;
		startX: number;
		startWidth: number;
		currentWidth: number;
		startLeft: number;
	} | null>(null);
	const tableContainerRef = useRef<HTMLDivElement | null>(null);
	const headerCellRefs = useRef<Record<number, HTMLTableCellElement | null>>({});

	useEffect(() => {
		const el = tableContainerRef.current;
		if (!el) {
			return;
		}
		const onScroll = () => {
			const r = resizingRef.current;
			if (!r) {
				return;
			}
			const cellEl = headerCellRefs.current[r.colIdx];
			const containerEl = tableContainerRef.current;
			if (!cellEl || !containerEl) {
				return;
			}
			const rect = cellEl.getBoundingClientRect();
			const containerRect = containerEl.getBoundingClientRect();
			const left = rect.left - containerRect.left + containerEl.scrollLeft;
			resizingRef.current = {...r, startLeft: left};
			setResizeGuideLeft(left + r.currentWidth);
		};
		el.addEventListener("scroll", onScroll, {passive: true});
		return () => {
			el.removeEventListener("scroll", onScroll as any);
		};
	}, [resizableColumns]);

	useEffect(() => {
		return () => {
			document.body.style.userSelect = "";
		};
	}, []);

	useEffect(() => {
		if (!resizableColumns) {
			setResizeGuideLeft(null);
			resizingRef.current = null;
		}
	}, [resizableColumns]);

	useEffect(() => {
		if (!resizableColumns) {
			return;
		}
		const raf = window.requestAnimationFrame(() => {
			setColumnWidths((prev) => {
				let changed = false;
				const next: Record<number, number> = {...prev};
				for (let colIdx = 0; colIdx < schema.length; colIdx++) {
					const existing = next[colIdx];
					if (typeof existing === "number") {
						const clamped = clampWidth(existing);
						if (clamped !== existing) {
							next[colIdx] = clamped;
							changed = true;
						}
						continue;
					}

					const cellEl = headerCellRefs.current[colIdx];
					if (!cellEl) {
						continue;
					}
					const measured = cellEl.getBoundingClientRect().width;
					next[colIdx] = clampWidth(measured);
					changed = true;
				}
				return changed ? next : prev;
			});
		});
		return () => {
			window.cancelAnimationFrame(raf);
		};
	}, [resizableColumns, schema.length, minColumnWidth, maxColumnWidth]);

	const setHeaderCellRef = (colIdx: number) => (el: HTMLTableCellElement | null) => {
		headerCellRefs.current[colIdx] = el;
	}

	const beginResize = (colIdx: number) => (e: React.MouseEvent) => {
		if (!resizableColumns) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();

		const cellEl = headerCellRefs.current[colIdx];
		const containerEl = tableContainerRef.current;
		if (!cellEl || !containerEl) {
			return;
		}

		const rect = cellEl.getBoundingClientRect();
		const containerRect = containerEl.getBoundingClientRect();
		const currentWidth = clampWidth(columnWidths[colIdx] ?? rect.width);

		const startLeft = rect.left - containerRect.left + containerEl.scrollLeft;
		resizingRef.current = {
			colIdx,
			startX: e.clientX,
			startWidth: currentWidth,
			currentWidth,
			startLeft,
		};
		setResizeGuideLeft(startLeft + currentWidth);
		document.body.style.userSelect = "none";

		const onMouseMove = (ev: MouseEvent) => {
			const r = resizingRef.current;
			if (!r) {
				return;
			}
			const delta = ev.clientX - r.startX;
			const nextWidth = clampWidth(r.startWidth + delta);
			resizingRef.current = {...r, currentWidth: nextWidth};
			setResizeGuideLeft(r.startLeft + nextWidth);
		};

		const onMouseUp = (ev: MouseEvent) => {
			const r = resizingRef.current;
			if (r) {
				setColumnWidths((prev) => ({...prev, [r.colIdx]: r.currentWidth}));
			}
			setResizeGuideLeft(null);
			resizingRef.current = null;
			document.body.style.userSelect = "";
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
	}

	const getColumnStyle = (colIdx: number): React.CSSProperties => {
		const w = columnWidths[colIdx];
		const style: React.CSSProperties = {
			minWidth: minColumnWidth,
		};
		if (typeof maxColumnWidth === "number") {
			style.maxWidth = maxColumnWidth;
		}
		if (typeof w === "number") {
			style.width = clampWidth(w);
		}
		return style;
	}

	return (
		<>
			<div className="blue-orange-tables-data-table">
				<Table
					containerRef={tableContainerRef}
					theme={TableTheme.DATASET}
					tableStyle={resizableColumns ? ({tableLayout: "fixed"} as React.CSSProperties) : undefined}
					overlay={resizeGuideLeft !== null ? <div className="blue-orange-data-table-resize-guide" style={{left: resizeGuideLeft}}></div> : null}>
					<THead>
						<Row>
							{schema.map((item, index) => (
								<React.Fragment key={item.label + "-" + index}>
									{loading &&
										<LoadingCell
											key={item.label + "-" + index}
											style={getColumnStyle(index)}
											headerCell={true}></LoadingCell>
									}
									{!loading &&
										<HeaderCell
											dropdownItems={item.dropDownItems}
											style={getColumnStyle(index)}
											cellRef={setHeaderCellRef(index)}
											resizable={resizableColumns}
											onResizeMouseDown={beginResize(index)}
											onDropdownSelected={(item: IContextMenuItem) => {
											}}>
											<div className="blue-orange-data-table-header-cell-group">
										        <span className="blue-orange-data-table-header-cell-primary-text">{item.label}</span>
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
										<LoadingCell key={"loading-cell-" + index + "-" + colIdx} style={getColumnStyle(colIdx)}></LoadingCell>
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
												const cellStyle = getColumnStyle(colIdx);
												return (
													<>
                                                    {item.type == TableFieldType.STRING &&
															<TextDataCell style={{...cellStyle}}
															  text={cellValue}
															  multipleValues={item.multipleValues}></TextDataCell>
                                                    }
                                                    {item.type == TableFieldType.NUMBER &&
															<NumberDataCell style={{...cellStyle}}
															  value={cellValue}
															  multipleValues={item.multipleValues}></NumberDataCell>
                                                    }
                                                    {item.type == TableFieldType.DATE &&
															<DateDataCell style={{...cellStyle}}
																date={cellValue}
																multipleValues={item.multipleValues}></DateDataCell>
                                                    }
                                                    {item.type == TableFieldType.CURRENCY &&
															<CurrencyDataCell style={{...cellStyle}}
															  amount={cellValue} currency={"AUD"}
															  multipleValues={item.multipleValues}></CurrencyDataCell>
                                                    }
                                                    {item.type == TableFieldType.STRUCT &&
															<JsonObjDataCell style={{...cellStyle}}
																  obj={cellValue}
																  multipleValues={item.multipleValues}></JsonObjDataCell>
                                                    }
													</>
												);
											})()}
										</React.Fragment>
                                            ))}

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