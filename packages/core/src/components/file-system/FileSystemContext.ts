import React from "react";

export enum IFileSystemOrderBy {
	UNSELECTED="UNSELECTED",
	NAME_DESC="NAME_DESC",
	NAME_ASC="NAME_ASC",
	LAST_MOD_DESC="LAST_MOD_DESC",
	LAST_MOD_ASC="LAST_MOD_ASC",
	FILE_TYPE_DESC="FILE_TYPE_DESC",
	FILE_TYPE_ASC="FILE_TYPE_ASC",
	FILE_SIZE_DESC="FILE_SIZE_DESC",
	FILE_SIZE_ASC="FILE_SIZE_ASC",
}

export enum IFileSystemType {
	FOLDER="FOLDER",
	FILE="FILE",
	PARENT_DIRECTORY="PARENT_DIRECTORY",
}

export interface IFileSystemItem {
	id?: string,
	indent: number,
	reference: string,
	type: IFileSystemType,
	label: string,
	description?: string,
	icon?: string,
	iconSize?: string,
	iconColor?: string,
	showDropdown?: boolean,
	dropdownOpen?: boolean,
	rename?: boolean,
	rowHeight?: number,
	cut?: boolean,
	copy?: boolean,
	/** Percentage between 0 and 100. Set it while the item is uploading to show a progress bar inside the row. */
	progress?: number,
	selected: boolean,
	size: number,
	lastModified: Date,
	fileType: string
}

export interface SelectedElementsPos {
	x: number,
	y: number
}

export interface FileSystemContextValue {
	registerItem: (item: IFileSystemItem) => void,
	unregisterItem: (item: IFileSystemItem) => void,
	getSelectedItems: () => Array<IFileSystemItem>,
	/** Columns the surrounding table renders, rows follow them unless they say otherwise. */
	showFileSize: boolean,
	showFileType: boolean,
	showLastModified: boolean,
	onClick?: (item: IFileSystemItem, pos: SelectedElementsPos) => void,
	onRightClick?: (items: Array<IFileSystemItem>, pos: SelectedElementsPos) => void,
	onDblClick?: (item: IFileSystemItem) => void,
}

/**
 * State of the surrounding file system table.
 *
 * Lives outside of the components so that rows can read the table they sit in
 * without the table and the row importing each other.
 */
export const FileSystemContext = React.createContext<FileSystemContextValue | null>(null);
