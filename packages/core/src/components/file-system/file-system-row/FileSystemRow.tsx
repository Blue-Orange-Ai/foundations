import React from "react";

import './FileSystemRow.css'
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {ContextMenu, IContextMenuItem} from "../../contextmenu/contextmenu/ContextMenu";
import {IFileSystemItem} from "../file-system/FileSystem";
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
	showFileSize?: boolean,
	showFileType?: boolean,
	showLastModified?: boolean,
	style?: React.CSSProperties,
}

export const FileSystemRow: React.FC<Props> = ({
												   item,
												   indent=0,
												   indentStep=20,
												   contextMenuItems=[],
												   contextMenuItemClicked,
												   onClick,
												   onDoubleClick,
												   onDrop,
												   showFileSize=true,
												   showFileType=true,
												   showLastModified=true, style={}}) => {

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

	const paddingLeft = 0 + indent * 20;

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

	const rowClicked = (ev: MouseEvent) => {
		if (onClick) {
			const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
			const controlOrCommandPressed = isMac ? ev.metaKey : ev.ctrlKey;
			if (controlOrCommandPressed || ev.shiftKey) {
				ev.preventDefault();
			}
			onClick(item, controlOrCommandPressed, ev.shiftKey);
		}
	}

	const rowRightClicked = () => {
		if (!item.selected && onClick) {
			onClick(item, false, false);
		}
	}

	const rowDoubleClicked = () => {
		if (onDoubleClick) {
			onDoubleClick(item);
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

	return (
		<tr
			className={item.selected ? "blue-orange-file-system-row-cont blue-orange-file-system-row-selected-style" : "blue-orange-file-system-row-cont"}
			onClick={rowClicked}
			onDoubleClick={rowDoubleClicked}
			onContextMenu={rowRightClicked}
			onMouseUp={handleDropEvent}
			style={style}>
			<td>
				<ContextMenu rightClick={true} items={contextMenuItems} onClick={contextMenuItemClickedFn}>
					<div className="blue-orange-file-system-row-item blue-orange-file-system-row-primary" style={{...primaryRowStyle, minHeight: item.rowHeight ? item.rowHeight + "px" : "32px"}}>
						<div className="blue-orange-file-system-primary-item">
							{item.showDropdown && <ButtonIcon icon={item.dropdownOpen ? folderOpenIcon : folderClosedIcon} style={dropdownBtnStyle}></ButtonIcon>}
							{item.icon &&
								<div className="blue-orange-file-system-row-icon">
									<i className={item.icon} style={{fontSize: item.iconSize ?? "1rem", color: item.iconColor ?? "unset"}}></i>
								</div>
							}
							<div className="blue-orange-file-system-row-content">
								{item.rename && <Input value={item.label} style={renameInputStyle}></Input>}
								{!item.rename &&
									<div className="blue-orange-file-system-row-content-title">{item.label}</div>
								}
								{item.description && <div className="blue-orange-file-system-row-content-secondary">{item.description}</div>}
							</div>
						</div>
					</div>
				</ContextMenu>
			</td>
			{showLastModified &&
				<td>
					<ContextMenu rightClick={true} items={contextMenuItems}>
						<div className="blue-orange-file-system-row-item blue-orange-file-system-row-secondary">
							{formatLastModifiedDate(item.lastModified)}
						</div>
					</ContextMenu>
				</td>
			}
			{showFileSize &&
				<td>
					<ContextMenu rightClick={true} items={contextMenuItems}>
						<div
							className="blue-orange-file-system-row-item blue-orange-file-system-row-secondary">{formatBytes(item.size, 2)}</div>
					</ContextMenu>
				</td>
			}
			{showFileType &&
				<td>
					<ContextMenu rightClick={true} items={contextMenuItems}>
						<div
							className="blue-orange-file-system-row-item blue-orange-file-system-row-secondary">{item.fileType}</div>
					</ContextMenu>
				</td>
			}
		</tr>
	)
}