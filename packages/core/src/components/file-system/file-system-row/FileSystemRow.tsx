import React, {useContext, useEffect, useRef} from "react";

import './FileSystemRow.css'
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {ContextMenu, IContextMenuItem} from "../../contextmenu/contextmenu/ContextMenu";
import {FileSystemContext, IFileSystemItem, IFileSystemType} from "../FileSystemContext";
import moment from 'moment';
import {Input} from "../../inputs/input/Input";

interface Props {
	item: IFileSystemItem,
	indent?: number,
	indentStep?: number,
	contextMenuItems?: Array<IContextMenuItem>,
	contextMenuItemClicked?: (item: IContextMenuItem) => void,
	onClick?: (item: IFileSystemItem, ctrlKey: boolean, shiftKey: boolean) => void,
	onDoubleClick?: (item: IFileSystemItem) => void,
	onDrop?: () => void,
	/** Fired when the folder expand/collapse chevron is clicked (requires item.showDropdown). */
	onDropdownClick?: (item: IFileSystemItem) => void,
	/** Fired when the inline rename editor is committed with enter or by losing focus (requires item.rename). */
	onRenameComplete?: (item: IFileSystemItem, label: string) => void,
	/** Columns default to the ones the surrounding FileSystem renders. */
	showFileSize?: boolean,
	showFileType?: boolean,
	showLastModified?: boolean,
	style?: React.CSSProperties,
}

export const FileSystemRow: React.FC<Props> = ({
												   item,
												   indent=0,
												   contextMenuItems=[],
												   contextMenuItemClicked,
												   onClick,
												   onDoubleClick,
												   onDrop,
												   onDropdownClick,
												   onRenameComplete,
												   showFileSize,
												   showFileType,
												   showLastModified, style={}}) => {

	const selectionHandledOnMouseDownRef = useRef(false);

	const fileSystemContext = useContext(FileSystemContext);

	// A row on its own shows every column, inside a table it follows the columns the table renders.
	const showFileSizeColumn = showFileSize ?? fileSystemContext?.showFileSize ?? true;

	const showFileTypeColumn = showFileType ?? fileSystemContext?.showFileType ?? true;

	const showLastModifiedColumn = showLastModified ?? fileSystemContext?.showLastModified ?? true;

	useEffect(() => {
		if (!fileSystemContext) {
			return;
		}
		fileSystemContext.registerItem(item);
		return () => {
			fileSystemContext.unregisterItem(item);
		};
	}, [fileSystemContext, item]);

	const getPagePosFromRect = (rect: DOMRect) => {
		return {
			x: rect.left,
			y: rect.top,
		};
	};

	const dropdownBtnStyle: React.CSSProperties = {
		height: "15px",
		width: "15px",
		border: "none",
		marginLeft: "0px",
		marginRight: "4px",
	}

	const renameInputStyle: React.CSSProperties = {
		height: "16px"
	}

	// The row that walks back up the tree has no meaningful date, size or type of its own.
	const isParentDirectory = item.type === IFileSystemType.PARENT_DIRECTORY;

	const paddingLeft = 10 + indent * 20;

	const folderClosedIcon = "ri-arrow-right-s-line";

	const folderOpenIcon = "ri-arrow-drop-down-line";

	const primaryRowStyle: React.CSSProperties = {
		paddingLeft: paddingLeft + "px"
	}

	const formatBytes = (bytes: number, decimals: number = 2): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
	}

	const rowClicked = (ev: React.MouseEvent<HTMLTableRowElement>) => {
		const selectionHandled = selectionHandledOnMouseDownRef.current;
		if (selectionHandled) {
			selectionHandledOnMouseDownRef.current = false;
		}

		if (!selectionHandled && onClick) {
			const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
			const controlOrCommandPressed = isMac ? ev.metaKey : ev.ctrlKey;
			if (controlOrCommandPressed || ev.shiftKey) {
				ev.preventDefault();
			}
			onClick(item, controlOrCommandPressed, ev.shiftKey);
		}

		if (fileSystemContext?.onClick) {
			const rect = ev.currentTarget.getBoundingClientRect();
			fileSystemContext.onClick(item, getPagePosFromRect(rect));
		}
	}

	const rowMouseDown = (ev: React.MouseEvent<HTMLTableRowElement>) => {
		if (!onClick) {
			return;
		}
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
		const controlOrCommandPressed = isMac ? ev.metaKey : ev.ctrlKey;

		if (!controlOrCommandPressed && !ev.shiftKey && !item.selected) {
			onClick(item, false, false);
			selectionHandledOnMouseDownRef.current = true;
		}
	}

	const rowRightClicked = (ev: React.MouseEvent<HTMLTableRowElement>) => {
		ev.preventDefault();
		const rect = ev.currentTarget.getBoundingClientRect();
		const pos = getPagePosFromRect(rect);

		if (fileSystemContext?.onRightClick) {
			const items = item.selected
				? (fileSystemContext.getSelectedItems() || [item])
				: [item];
			fileSystemContext.onRightClick(items, pos);
		}

		if (!item.selected && onClick) {
			onClick(item, false, false);
		}
	}

	const rowDoubleClicked = () => {
		if (onDoubleClick) {
			onDoubleClick(item);
		}
		if (fileSystemContext?.onDblClick) {
			fileSystemContext.onDblClick(item);
		}
	}

	const formatLastModifiedDate = (d: Date) => {
		return moment(d).format('DD/MM/YY');
	}

	const contextMenuItemClickedFn = (item: IContextMenuItem) => {
		if (contextMenuItemClicked) {
			contextMenuItemClicked(item);
		}
	}

	const handleDropEvent = () => {
		if (onDrop) {
			onDrop()
		}
	}

	const dropdownClicked = (ev: React.MouseEvent<HTMLDivElement>) => {
		ev.stopPropagation();
		if (onDropdownClick) {
			onDropdownClick(item);
		}
	}

	const renameValueRef = useRef<string>(item.label);

	const renameCompletedRef = useRef<boolean>(false);

	useEffect(() => {
		if (item.rename) {
			renameValueRef.current = item.label;
			renameCompletedRef.current = false;
		}
	}, [item.rename, item.label]);

	// Enter and the following blur both signal completion, only the first one counts.
	const renameCompleted = () => {
		if (renameCompletedRef.current) {
			return;
		}
		renameCompletedRef.current = true;
		if (onRenameComplete) {
			onRenameComplete(item, renameValueRef.current);
		}
	}

	return (
		<tr
			className={item.selected ? "blue-orange-file-system-row-cont blue-orange-file-system-row-selected-style" : "blue-orange-file-system-row-cont"}
			onMouseDown={rowMouseDown}
			onClick={rowClicked}
			onDoubleClick={rowDoubleClicked}
			onContextMenu={rowRightClicked}
			onMouseUp={handleDropEvent}
			style={style}>
			<td>
				<ContextMenu rightClick={true} items={contextMenuItems} onClick={contextMenuItemClickedFn}>
					<div className="blue-orange-file-system-row-item blue-orange-file-system-row-primary" style={{...primaryRowStyle, minHeight: item.rowHeight ? item.rowHeight + "px" : "32px"}}>
						<div className="blue-orange-file-system-primary-item">
							{item.showDropdown &&
								<div onMouseDown={(ev) => ev.stopPropagation()} onClick={dropdownClicked}>
									<ButtonIcon icon={item.dropdownOpen ? folderOpenIcon : folderClosedIcon} style={dropdownBtnStyle}></ButtonIcon>
								</div>
							}
							{item.icon &&
								<div className="blue-orange-file-system-row-icon">
									<i className={item.icon} style={{fontSize: item.iconSize ?? "1rem", color: item.iconColor ?? "unset"}}></i>
								</div>
							}
							<div className="blue-orange-file-system-row-content">
								{item.rename &&
									<div onMouseDown={(ev) => ev.stopPropagation()} onClick={(ev) => ev.stopPropagation()}>
										<Input
											value={item.label}
											focus={true}
											style={renameInputStyle}
											onChange={(value) => renameValueRef.current = value}
											enterEvent={renameCompleted}
											focusOut={renameCompleted}></Input>
									</div>
								}
								{!item.rename &&
									<div className="blue-orange-file-system-row-content-title">{item.label}</div>
								}
								{item.description && <div className="blue-orange-file-system-row-content-secondary">{item.description}</div>}
								{item.progress != undefined &&
									<div className="blue-orange-file-system-row-progress">
										<div
											className="blue-orange-file-system-row-progress-bar"
											style={{width: Math.max(0, Math.min(100, item.progress)) + "%"}}></div>
									</div>
								}
							</div>
						</div>
					</div>
				</ContextMenu>
			</td>
			{showLastModifiedColumn &&
				<td>
					<ContextMenu rightClick={true} items={contextMenuItems}>
						<div className="blue-orange-file-system-row-item blue-orange-file-system-row-secondary">
							{!isParentDirectory && formatLastModifiedDate(item.lastModified)}
						</div>
					</ContextMenu>
				</td>
			}
			{showFileSizeColumn &&
				<td>
					<ContextMenu rightClick={true} items={contextMenuItems}>
						<div
							className="blue-orange-file-system-row-item blue-orange-file-system-row-secondary">{isParentDirectory ? "" : formatBytes(item.size, 2)}</div>
					</ContextMenu>
				</td>
			}
			{showFileTypeColumn &&
				<td>
					<ContextMenu rightClick={true} items={contextMenuItems}>
						<div
							className="blue-orange-file-system-row-item blue-orange-file-system-row-secondary">{isParentDirectory ? "" : item.fileType}</div>
					</ContextMenu>
				</td>
			}
		</tr>
	)
}