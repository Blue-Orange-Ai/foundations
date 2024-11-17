import React, {useEffect, useRef, useState} from "react";

import './FileSystem.css'
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";
import {Badge} from "../../text-decorations/badge/Badge";

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
	copyEvent?: () => void,
	cutEvent?: () => void,
	pasteEvent?: () => void,
	movingEvent?: (state: boolean) => void,
	dropEvent?: (files: FileList) => void,
}

interface SelectedElementsPos {
	x: number,
	y: number
}

export const FileSystem: React.FC<Props> = ({
												children,
												showHeader=true,
												showFileSize=true,
												showFileType=true,
												showLastModified=true,
												orderBy=IFileSystemOrderBy.UNSELECTED},
												copyEvent,
												cutEvent,
												pasteEvent,
												movingEvent,
												dropEvent,
											) => {

	const tableRef = useRef<HTMLTableElement>(null);

	const mouseDownRef = useRef<boolean>(false);

	const showSelectedElementsRef = useRef<boolean>(false);

	const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false);

	const [elementsSelected, setElementsSelected] = useState(0);

	const [showSelectedElements, setShowSelectedElements] = useState(false);

	const [selectedElementsPos, setSelectedElementsPos] = useState<SelectedElementsPos>({x: 0, y: 0});

	const [dragOverState, setDragOverState] = useState<boolean>(false);

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

	const handleDropEvent = (event: any) => {
		event.preventDefault();
		if (dropEvent) {
			const files: FileList = event.dataTransfer.files;
			dropEvent(files);
		}
		setDragOverState(false);
	}

	const handleDragOver = (event: any) => {
		event.preventDefault();
		setDragOverState(true);
	}

	const handleDragLeave = (event: any) => {
		event.preventDefault();
		setDragOverState(false);
	}

	useEffect(() => {
		const handleKeyDown = (ev) => {
			const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
			const controlOrCommandPressed = isMac ? ev.metaKey : ev.ctrlKey;
			if (ev.key === "Shift") {
				setIsShiftKeyPressed(true);
				tableRef.current.classList.add("disable-text-selection");
				ev.preventDefault();
			} else if (controlOrCommandPressed && ev.key == "c" && copyEvent) {
				copyEvent();
			} else if (controlOrCommandPressed && ev.key == "x" && cutEvent) {
				cutEvent()
			} else if (controlOrCommandPressed && ev.key == "v" && pasteEvent) {
				pasteEvent()
			}
		};

		const handleKeyUp = (ev) => {
			if (ev.key === "Shift") {
				setIsShiftKeyPressed(false);
				tableRef.current.classList.remove("disable-text-selection");
			}
		};

		const handleMousemove = (ev) => {
			if (mouseDownRef.current) {
				tableRef.current.classList.add("disable-text-selection");
				setSelectedElementsPos({
					x: ev.clientX,
					y: ev.clientY
				})
				setShowSelectedElements(true);
				showSelectedElementsRef.current = true;
				if (movingEvent) {
					movingEvent(true);
				}
			}
		};

		const handleMouseup = (ev) => {
			if (showSelectedElementsRef.current) {
				tableRef.current.classList.remove("disable-text-selection");
				setShowSelectedElements(false);
				if (movingEvent) {
					movingEvent(false);
				}
			}
			showSelectedElementsRef.current = false;
			mouseDownRef.current = false;
		};

		const handleMousedown = (ev) => {
			if (tableRef.current) {
				const elementsWithClass = tableRef.current.querySelectorAll(".blue-orange-file-system-row-selected-style");
				setElementsSelected(elementsWithClass.length);
				mouseDownRef.current = true;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("mousedown", handleMousedown);
		window.addEventListener("mouseup", handleMouseup);
		window.addEventListener("mousemove", handleMousemove);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("mousedown", handleMousedown);
			window.removeEventListener("mouseup", handleMouseup);
			window.removeEventListener("mousemove", handleMousemove);
		};
	}, []);

	return (
		<div
			className="blue-orange-file-system-cont"
			onDragOver={handleDragOver}
			onDrop={handleDropEvent}
			onDragLeave={handleDragLeave}>
			{showSelectedElements &&
				<div className="blue-orange-file-system-selected-pill" style={{left: selectedElementsPos.x + "px", top: selectedElementsPos.y}}>
					{elementsSelected} selected
				</div>
			}
			<table
				ref={tableRef}
				className="blue-orange-file-system-table">
				{showHeader &&
					<thead className="blue-orange-file-system-header-row">
					<tr>
						<th style={{width: "100%"}}>
							<ContextMenu items={contextMenuItems}>
								<div className="blue-orange-file-system-header-row-item">
									<span>Name</span>
									{orderBy != IFileSystemOrderBy.NAME_DESC && orderBy != IFileSystemOrderBy.NAME_ASC &&
										<div className="blue-orange-file-system-header-row-item-hoverable">
											<ButtonIcon icon={"ri-arrow-down-s-line"}
														style={dropdownBtnStyle}></ButtonIcon>
										</div>
									}

									{orderBy == IFileSystemOrderBy.NAME_DESC &&
										<ButtonIcon icon={"ri-arrow-down-s-line"}
													style={dropdownBtnStyle}></ButtonIcon>}
									{orderBy == IFileSystemOrderBy.NAME_ASC &&
										<ButtonIcon icon={"ri-arrow-up-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
								</div>
							</ContextMenu>
						</th>
						{showLastModified &&
							<th style={{minWidth: "136px"}}>
								<ContextMenu items={contextMenuItems}>
									<div className="blue-orange-file-system-header-row-item">
										<span>Date Modified</span>
										{orderBy == IFileSystemOrderBy.LAST_MOD_DESC &&
											<ButtonIcon icon={"ri-arrow-down-s-line"}
														style={dropdownBtnStyle}></ButtonIcon>}
										{orderBy == IFileSystemOrderBy.LAST_MOD_ASC &&
											<ButtonIcon icon={"ri-arrow-up-s-line"}
														style={dropdownBtnStyle}></ButtonIcon>}
									</div>
								</ContextMenu>
							</th>
						}
						{showFileSize &&
							<th style={{minWidth: "80px"}}>
								<div className="blue-orange-file-system-header-row-item">
									<span>Size</span>
									{orderBy == IFileSystemOrderBy.FILE_SIZE_DESC &&
										<ButtonIcon icon={"ri-arrow-down-s-line"}
													style={dropdownBtnStyle}></ButtonIcon>}
									{orderBy == IFileSystemOrderBy.FILE_SIZE_ASC &&
										<ButtonIcon icon={"ri-arrow-up-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
								</div>
							</th>
						}
						{showFileType &&
							<th style={{minWidth: "80px"}}>
								<div className="blue-orange-file-system-header-row-item">
									<span>Type</span>
									{orderBy == IFileSystemOrderBy.FILE_TYPE_DESC &&
										<ButtonIcon icon={"ri-arrow-down-s-line"}
													style={dropdownBtnStyle}></ButtonIcon>}
									{orderBy == IFileSystemOrderBy.FILE_TYPE_ASC &&
										<ButtonIcon icon={"ri-arrow-up-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
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
			{dragOverState &&
				<div
					className="blue-orange-file-system-drag-over-state">
					<div className="blue-orange-file-system-drop-file-icon-cont">
						<i className="ri-drop-fill"></i>
					</div>
					<div className="blue-orange-file-system-drop-file-text">Drop Files</div>
				</div>
			}
		</div>
	)
}