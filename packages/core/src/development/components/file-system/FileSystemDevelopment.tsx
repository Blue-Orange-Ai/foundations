import React, {useEffect, useState} from "react";

import './FileSystemDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {FileSystem, IFileSystemItem, IFileSystemType} from "../../../components/file-system/file-system/FileSystem";
import {FileSystemRow} from "../../../components/file-system/file-system-row/FileSystemRow";
import {IContextMenuItem, IContextMenuType} from "../../../components/contextmenu/contextmenu/ContextMenu";

interface Props {
}

export const FileSystemDevelopment: React.FC<Props> = ({}) => {

	const contextMenuItems: Array<IContextMenuItem> = [
		{type: IContextMenuType.HEADING, label: "Sort Direction", value:""},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.SEPARATOR, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
	]

	const fileSystemItemSeed: Array<IFileSystemItem> = [
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		}
	]

	// const fileSystemItems = useRef<Array<IFileSystemItem>>(fileSystemItemSeed);
	const [fileSystemItems, setFileSystemItems] = useState<Array<IFileSystemItem>>(fileSystemItemSeed);

	const [fileSystemRowLastSelected, setFileSystemRowLastSelected] = useState(-1);

	const clearAllSelectedRows = (items: Array<IFileSystemItem>) => {
		for (var i=0; i<items.length; i++) {
			items[i].selected = false;
		}
		return items;
	}

	const rowClickedDefault = (item: IFileSystemItem): Array<IFileSystemItem> => {
		var newItems = fileSystemItems;
		const itemIndex = newItems.indexOf(item);
		newItems = clearAllSelectedRows(newItems);
		setFileSystemRowLastSelected(itemIndex);
		newItems[itemIndex].selected = true;
		return newItems;
	}

	const rowClickedCtrl = (item: IFileSystemItem) => {
		var newItems: Array<IFileSystemItem> = [];
		const itemIndex = fileSystemItems.indexOf(item);
		setFileSystemRowLastSelected(itemIndex);
		for (var i=0; i < fileSystemItems.length; i++) {
			if (i == itemIndex) {
				var item = fileSystemItems[i];
				item.selected = !item.selected;
				newItems.push(item);
			} else {
				newItems.push(fileSystemItems[i]);
			}
		}
		return newItems;
	}

	const rowClickedShift = (item: IFileSystemItem) => {
		var newItems: Array<IFileSystemItem> = [];
		const itemIndex = fileSystemItems.indexOf(item);
		var started = false;
		for (var i=0; i < fileSystemItems.length; i++) {
			var item = fileSystemItems[i];
			if (i == itemIndex || i == fileSystemRowLastSelected) {
				started = !started;
				item.selected = true;
				newItems.push(item);
			} else if (started) {
				item.selected = true;
				newItems.push(item);
			} else {
				item.selected = false;
				newItems.push(item);
			}
		}
		return newItems;
	}

	const rowClicked = (item: IFileSystemItem, ctrlKey: boolean, shiftKey: boolean) => {
		var newItems: Array<IFileSystemItem> = [];
		if (!ctrlKey && !shiftKey) {
			newItems = rowClickedDefault(item);
		} else if (ctrlKey) {
			newItems = rowClickedCtrl(item);
		} else if (shiftKey) {
			newItems = rowClickedShift(item);
		}
		setFileSystemItems(newItems);
	}


	return (
		<PaddedPage>
			<PageHeading>File System</PageHeading>
			<FileSystem>
				{fileSystemItems.map((item, index) => (
					<FileSystemRow key={index} contextMenuItems={contextMenuItems} item={item} onClick={rowClicked}></FileSystemRow>
				))}
			</FileSystem>
		</PaddedPage>
	)
}