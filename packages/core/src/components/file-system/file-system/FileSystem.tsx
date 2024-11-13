import React from "react";

import './FileSystem.css'
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";

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
	rowHeight?: number,
	selected: boolean,
	size: number,
	lastModified: Date,
	fileType: string
}

interface Props {
	children: React.ReactNode,
	showHeader?: boolean,
	showFileSize?: boolean,
	showFileType?: boolean,
	showLastModified?: boolean,
	orderBy?: IFileSystemOrderBy,
}

export const FileSystem: React.FC<Props> = ({
												children,
												showHeader=true,
												showFileSize=true,
												showFileType=true,
												showLastModified=true,
												orderBy=IFileSystemOrderBy.UNSELECTED}) => {

	const contextMenuItems: Array<IContextMenuItem> = [
		{type: IContextMenuType.HEADING, label: "Sort Direction", value:""},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.SEPARATOR, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
	]

	const dropdownBtnStyle: React.CSSProperties = {
		height: "10px",
		width: "10px",
		border: "none",
		marginLeft: "15px"
	}

	return (
		<table className="blue-orange-file-system-table">
			{showHeader &&
				<thead className="blue-orange-file-system-header-row">
				<tr>
					<th style={{width: "100%"}}>
						<ContextMenu items={contextMenuItems}>
							<div className="blue-orange-file-system-header-row-item">
								<span>Name</span>
								{orderBy != IFileSystemOrderBy.NAME_DESC && orderBy != IFileSystemOrderBy.NAME_ASC &&
									<div className="blue-orange-file-system-header-row-item-hoverable">
										<ButtonIcon icon={"ri-arrow-down-s-line"} style={dropdownBtnStyle}></ButtonIcon>
									</div>
								}

								{orderBy == IFileSystemOrderBy.NAME_DESC &&
									<ButtonIcon icon={"ri-arrow-down-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
								{orderBy == IFileSystemOrderBy.NAME_ASC && <ButtonIcon icon={"ri-arrow-up-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
							</div>
						</ContextMenu>
					</th>
					{showLastModified &&
						<th style={{minWidth: "136px"}}>
							<ContextMenu items={contextMenuItems}>
								<div className="blue-orange-file-system-header-row-item">
									<span>Date Modified</span>
									{orderBy == IFileSystemOrderBy.LAST_MOD_DESC && <ButtonIcon icon={"ri-arrow-down-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
									{orderBy == IFileSystemOrderBy.LAST_MOD_ASC && <ButtonIcon icon={"ri-arrow-up-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
								</div>
							</ContextMenu>
						</th>
					}
					{showFileSize &&
						<th style={{minWidth: "80px"}}>
							<div className="blue-orange-file-system-header-row-item">
								<span>Size</span>
								{orderBy == IFileSystemOrderBy.FILE_SIZE_DESC && <ButtonIcon icon={"ri-arrow-down-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
								{orderBy == IFileSystemOrderBy.FILE_SIZE_ASC && <ButtonIcon icon={"ri-arrow-up-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
							</div>
						</th>
					}
					{showFileType &&
						<th style={{minWidth: "80px"}}>
							<div className="blue-orange-file-system-header-row-item">
								<span>Type</span>
								{orderBy == IFileSystemOrderBy.FILE_TYPE_DESC && <ButtonIcon icon={"ri-arrow-down-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
								{orderBy == IFileSystemOrderBy.FILE_TYPE_ASC && <ButtonIcon icon={"ri-arrow-up-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
							</div>
						</th>
					}
				</tr>
				</thead>
			}
			<tbody>
			{children}
			</tbody>
		</table>
	)
}