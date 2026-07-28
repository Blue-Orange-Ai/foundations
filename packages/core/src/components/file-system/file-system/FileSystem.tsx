import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";

import './FileSystem.css'
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {FileSystemRow} from "../file-system-row/FileSystemRow";
import {
	FileSystemContext,
	FileSystemContextValue,
	IFileSystemItem,
	IFileSystemOrderBy,
	IFileSystemType,
	SelectedElementsPos
} from "../FileSystemContext";

export {FileSystemContext, IFileSystemOrderBy, IFileSystemType} from "../FileSystemContext";
export type {FileSystemContextValue, IFileSystemItem, SelectedElementsPos} from "../FileSystemContext";

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
	/** When provided the column headers become clickable and toggle between ascending and descending. */
	orderByEvent?: (orderBy: IFileSystemOrderBy) => void,
	/**
	 * Renders a row above the children that navigates out of the folder being
	 * viewed. Set it while anything other than the root folder is on screen.
	 */
	showParentDirectory?: boolean,
	/** Label of the parent directory row, ".." is the convention inherited from DOS and windows explorer. */
	parentDirectoryLabel?: string,
	parentDirectoryIcon?: string,
	/** Fired when the parent directory row is double clicked. */
	parentDirectoryEvent?: () => void,
	/** Fired when a selection is dragged onto the parent directory row. */
	parentDirectoryDropEvent?: () => void,
	onClick?: (item: IFileSystemItem, pos: SelectedElementsPos) => void,
	onRightClick?: (items: Array<IFileSystemItem>, pos: SelectedElementsPos) => void,
	onDblClick?: (item: IFileSystemItem) => void,
}

export const FileSystem: React.FC<Props> = ({
										children,
										showHeader=true,
										showFileSize=true,
										showFileType=true,
										showLastModified=true,
										orderBy=IFileSystemOrderBy.UNSELECTED,
										copyEvent,
										cutEvent,
										pasteEvent,
										movingEvent,
										dropEvent,
										orderByEvent,
										showParentDirectory=false,
										parentDirectoryLabel="..",
										parentDirectoryIcon="ri-corner-left-up-line",
										parentDirectoryEvent,
										parentDirectoryDropEvent,
										onClick,
										onRightClick,
										onDblClick,
									}) => {

	const tableRef = useRef<HTMLTableElement>(null);

	const registeredItemsRef = useRef<Set<IFileSystemItem>>(new Set());

	const registerItem = useCallback((item: IFileSystemItem) => {
		registeredItemsRef.current.add(item);
	}, []);

	const unregisterItem = useCallback((item: IFileSystemItem) => {
		registeredItemsRef.current.delete(item);
	}, []);

	const getSelectedItems = useCallback(() => {
		return Array.from(registeredItemsRef.current).filter((item) => item.selected);
	}, []);

	const fileSystemContextValue = useMemo<FileSystemContextValue>(() => {
		return {
			registerItem,
			unregisterItem,
			getSelectedItems,
			showFileSize,
			showFileType,
			showLastModified,
			onClick,
			onRightClick,
			onDblClick,
		};
	}, [getSelectedItems, onClick, onDblClick, onRightClick, registerItem, unregisterItem, showFileSize, showFileType,
		showLastModified]);

	const mouseDownRef = useRef<boolean>(false);

	const showSelectedElementsRef = useRef<boolean>(false);

	const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false);

	const [elementsSelected, setElementsSelected] = useState(0);

	const [showSelectedElements, setShowSelectedElements] = useState(false);

	const [selectedElementsPos, setSelectedElementsPos] = useState<SelectedElementsPos>({x: 0, y: 0});

	const [dragOverState, setDragOverState] = useState<boolean>(false);

	const dropdownBtnStyle: React.CSSProperties = {
		height: "10px",
		width: "10px",
		border: "none",
		marginLeft: "15px"
	}

	const parentDirectoryItem = useMemo<IFileSystemItem>(() => {
		return {
			id: "blue-orange-file-system-parent-directory",
			reference: "blue-orange-file-system-parent-directory",
			indent: 0,
			type: IFileSystemType.PARENT_DIRECTORY,
			label: parentDirectoryLabel,
			icon: parentDirectoryIcon,
			selected: false,
			size: 0,
			lastModified: new Date(),
			fileType: ""
		};
	}, [parentDirectoryLabel, parentDirectoryIcon]);

	const headerSortable = orderByEvent != undefined;

	const toggleOrderBy = (ascOrderBy: IFileSystemOrderBy, descOrderBy: IFileSystemOrderBy) => {
		if (!orderByEvent) {
			return;
		}
		orderByEvent(orderBy == ascOrderBy ? descOrderBy : ascOrderBy);
	}

	const renderHeaderItem = (label: string, ascOrderBy: IFileSystemOrderBy, descOrderBy: IFileSystemOrderBy) => {
		return (
			<div
				className={headerSortable ? "blue-orange-file-system-header-row-item blue-orange-file-system-header-row-item-sortable" : "blue-orange-file-system-header-row-item"}
				onClick={() => toggleOrderBy(ascOrderBy, descOrderBy)}>
				<span>{label}</span>
				{headerSortable && orderBy != ascOrderBy && orderBy != descOrderBy &&
					<div className="blue-orange-file-system-header-row-item-hoverable">
						<ButtonIcon icon={"ri-arrow-down-s-line"} style={dropdownBtnStyle}></ButtonIcon>
					</div>
				}
				{orderBy == descOrderBy &&
					<ButtonIcon icon={"ri-arrow-down-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
				{orderBy == ascOrderBy &&
					<ButtonIcon icon={"ri-arrow-up-s-line"} style={dropdownBtnStyle}></ButtonIcon>}
			</div>
		)
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
		const handleKeyDown = (ev: any) => {
			const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);
			const controlOrCommandPressed = isMac ? ev.metaKey : ev.ctrlKey;
			if (ev.key === "Shift" && tableRef.current) {
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

		const handleKeyUp = (ev: any) => {
			if (ev.key === "Shift" && tableRef.current) {
				setIsShiftKeyPressed(false);
				tableRef.current.classList.remove("disable-text-selection");
			}
		};

		const handleMousemove = (ev: any) => {
			if (mouseDownRef.current && tableRef.current) {
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

		const handleMouseup = (ev: any) => {
			if (showSelectedElementsRef.current && tableRef.current) {
				tableRef.current.classList.remove("disable-text-selection");
				setShowSelectedElements(false);
				if (movingEvent) {
					movingEvent(false);
				}
			}
			showSelectedElementsRef.current = false;
			mouseDownRef.current = false;
		};

		const handleMousedown = (ev: any) => {
			if (!tableRef.current) {
				return;
			}

			const target = ev.target as HTMLElement | null;
			if (!target) {
				return;
			}

			if (!tableRef.current.contains(target)) {
				return;
			}

			const row = target.closest("tr");
			const tbody = tableRef.current.tBodies?.[0];
			if (!row || !tbody || !tbody.contains(row)) {
				return;
			}

			const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);
			const controlOrCommandPressed = isMac ? ev.metaKey : ev.ctrlKey;
			const isRowSelected = row.classList.contains("blue-orange-file-system-row-selected-style");

			if (!controlOrCommandPressed && !ev.shiftKey && !isRowSelected) {
				setElementsSelected(1);
			} else {
				const elementsWithClass = tableRef.current.querySelectorAll(".blue-orange-file-system-row-selected-style");
				setElementsSelected(elementsWithClass.length);
			}

			mouseDownRef.current = true;
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
		<FileSystemContext.Provider value={fileSystemContextValue}>
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
								{renderHeaderItem("Name", IFileSystemOrderBy.NAME_ASC, IFileSystemOrderBy.NAME_DESC)}
							</th>
							{showLastModified &&
								<th style={{minWidth: "136px"}}>
									{renderHeaderItem("Date Modified", IFileSystemOrderBy.LAST_MOD_ASC, IFileSystemOrderBy.LAST_MOD_DESC)}
								</th>
							}
							{showFileSize &&
								<th style={{minWidth: "80px"}}>
									{renderHeaderItem("Size", IFileSystemOrderBy.FILE_SIZE_ASC, IFileSystemOrderBy.FILE_SIZE_DESC)}
								</th>
							}
							{showFileType &&
								<th style={{minWidth: "80px"}}>
									{renderHeaderItem("Type", IFileSystemOrderBy.FILE_TYPE_ASC, IFileSystemOrderBy.FILE_TYPE_DESC)}
								</th>
							}
						</tr>
						</thead>
					}
					<tbody>
					{showParentDirectory &&
						<FileSystemRow
							item={parentDirectoryItem}
							contextMenuItems={[]}
							showFileSize={showFileSize}
							showFileType={showFileType}
							showLastModified={showLastModified}
							onDoubleClick={parentDirectoryEvent}
							onDrop={parentDirectoryDropEvent}></FileSystemRow>
					}
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
		</FileSystemContext.Provider>
	)
}