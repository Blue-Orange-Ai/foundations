import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {BaseDataType, SearchRecord} from "@blue-orange-ai/foundations-clients";

import {DataTable, TableField, TableFieldSortState, TableFieldType} from "./DataTable";
import {IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";

const schema: Array<TableField> = [
	{
		label: "Name",
		apiName: "name",
		type: TableFieldType.STRING,
		sortState: TableFieldSortState.UNSORTED,
		sortable: false,
		filterable: false,
		statistics: false,
	},
];

const row = (name: string): SearchRecord => ({
	primaryKey: {key: "name", type: BaseDataType.TEXT, value: name},
	properties: [{key: "name", type: BaseDataType.TEXT, value: name}],
} as SearchRecord);

const data = [row("Ada"), row("Grace")];

const rightClickFirstCell = () => {
	fireEvent.contextMenu(screen.getByText("Ada"));
};

describe("DataTable context menu", () => {

	it("shows only the built in items when no custom items are supplied", () => {
		render(<DataTable schema={schema} data={data}/>);
		rightClickFirstCell();

		expect(screen.getByText("Copy Cell Value")).toBeTruthy();
		expect(screen.queryByText("Archive")).toBeNull();
	});

	it("appends a static list of custom items after the built in ones", () => {
		const custom: Array<IContextMenuItem> = [
			{label: "Archive", type: IContextMenuType.CONTENT, value: {action: "archive"}},
			{label: "Delete", type: IContextMenuType.CONTENT, value: {action: "delete"}},
		];
		render(<DataTable schema={schema} data={data} contextMenuItems={custom}/>);
		rightClickFirstCell();

		expect(screen.getByText("Copy Cell Value")).toBeTruthy();
		expect(screen.getByText("Archive")).toBeTruthy();
		expect(screen.getByText("Delete")).toBeTruthy();
	});

	it("builds items per cell when given a function, with the cell's context", () => {
		render(
			<DataTable
				schema={schema}
				data={data}
				contextMenuItems={(context) => [
					{label: `Open ${context.cellValue}`, type: IContextMenuType.CONTENT, value: {action: "open"}},
				]}/>
		);
		rightClickFirstCell();

		expect(screen.getByText("Open Ada")).toBeTruthy();
	});

	it("drops the built in items when hideDefaultContextMenuItems is set", () => {
		render(
			<DataTable
				schema={schema}
				data={data}
				hideDefaultContextMenuItems={true}
				contextMenuItems={[{label: "Archive", type: IContextMenuType.CONTENT, value: {action: "archive"}}]}/>
		);
		rightClickFirstCell();

		expect(screen.getByText("Archive")).toBeTruthy();
		expect(screen.queryByText("Copy Cell Value")).toBeNull();
	});

	it("does not open an empty menu when everything is suppressed", () => {
		render(<DataTable schema={schema} data={data} hideDefaultContextMenuItems={true}/>);
		rightClickFirstCell();

		expect(document.querySelector(".blue-orange-default-context-menu")).toBeNull();
	});

	it("reports custom item clicks with the context of the originating cell", () => {
		const onContextMenuItemClick = vi.fn();
		render(
			<DataTable
				schema={schema}
				data={data}
				contextMenuItems={[{label: "Archive", type: IContextMenuType.CONTENT, value: {action: "archive"}}]}
				onContextMenuItemClick={onContextMenuItemClick}/>
		);
		rightClickFirstCell();
		fireEvent.click(screen.getByText("Archive"));

		expect(onContextMenuItemClick).toHaveBeenCalledTimes(1);
		const [item, context] = onContextMenuItemClick.mock.calls[0];
		expect(item.value.action).toEqual("archive");
		expect(context).toMatchObject({rowIdx: 0, colIdx: 0, isHeader: false, cellValue: "Ada"});
		expect(context.field?.apiName).toEqual("name");
	});

	it("does not report the table's own items to onContextMenuItemClick", () => {
		const onContextMenuItemClick = vi.fn();
		render(
			<DataTable
				schema={schema}
				data={data}
				contextMenuItems={[{label: "Archive", type: IContextMenuType.CONTENT, value: {action: "archive"}}]}
				onContextMenuItemClick={onContextMenuItemClick}/>
		);
		rightClickFirstCell();
		fireEvent.click(screen.getByText("Copy Row Data"));

		expect(onContextMenuItemClick).not.toHaveBeenCalled();
	});
});
