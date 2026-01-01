import React, {useState, useCallback} from "react";

import './FileUploadTable.css'
import {Table, TableTheme} from "../../table/table/Table";
import {THead} from "../../table/thead/THead";
import {TBody} from "../../table/tbody/TBody";
import {Row} from "../../table/row/Row";
import {HeaderCell} from "../../table/cells/headercell/HeaderCell";
import {TextDataCell} from "../../table/cells/text-data-cell/TextDataCell";
import {PrimaryCell} from "../../table/cells/primarycell/PrimaryCell";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";

export interface FileUploadItem {
	id: string;
	file: File;
	hasError: boolean;
	errorMessage?: string;
}

interface Props {
	files: FileUploadItem[];
	onFilesChange: (files: FileUploadItem[]) => void;
	acceptedFileTypes?: string[];
	maxFileSizeMb?: number;
	disabled?: boolean;
	minHeight?: string;
}

export const FileUploadTable: React.FC<Props> = ({
	files,
	onFilesChange,
	acceptedFileTypes,
	maxFileSizeMb,
	disabled = false,
	minHeight = "200px",
}) => {

	const [dragOverState, setDragOverState] = useState<boolean>(false);

	const generateId = (): string => {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	};

	const formatBytes = (bytes: number, decimals: number = 2): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
	};

	const getFileExtension = (filename: string): string => {
		const parts = filename.split('.');
		if (parts.length > 1) {
			return parts[parts.length - 1].toLowerCase();
		}
		return '';
	};

	const getFileType = (file: File): string => {
		const extension = getFileExtension(file.name);
		if (extension) {
			return extension.toUpperCase();
		}
		if (file.type) {
			const typeParts = file.type.split('/');
			return typeParts[typeParts.length - 1].toUpperCase();
		}
		return 'Unknown';
	};

	const validateFile = (file: File): { hasError: boolean; errorMessage?: string } => {
		if (acceptedFileTypes && acceptedFileTypes.length > 0) {
			const fileExtension = getFileExtension(file.name);
			const normalizedAcceptedTypes = acceptedFileTypes.map(t => t.toLowerCase().replace('.', ''));
			if (!normalizedAcceptedTypes.includes(fileExtension)) {
				return {
					hasError: true,
					errorMessage: `File type ".${fileExtension}" is not allowed. Accepted types: ${acceptedFileTypes.join(', ')}`
				};
			}
		}

		if (maxFileSizeMb !== undefined && file.size > maxFileSizeMb * 1024 * 1024) {
			return {
				hasError: true,
				errorMessage: `File size exceeds maximum allowed size of ${maxFileSizeMb}MB`
			};
		}

		return { hasError: false };
	};

	const processFiles = useCallback((fileList: FileList) => {
		const newFiles: FileUploadItem[] = [];
		
		for (let i = 0; i < fileList.length; i++) {
			const file = fileList[i];
			const validation = validateFile(file);
			newFiles.push({
				id: generateId(),
				file,
				hasError: validation.hasError,
				errorMessage: validation.errorMessage,
			});
		}

		onFilesChange([...files, ...newFiles]);
	}, [files, onFilesChange, acceptedFileTypes, maxFileSizeMb]);

	const handleDropEvent = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (disabled) return;
		
		const droppedFiles = event.dataTransfer.files;
		if (droppedFiles.length > 0) {
			processFiles(droppedFiles);
		}
		setDragOverState(false);
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (!disabled) {
			setDragOverState(true);
		}
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragOverState(false);
	};

	const handleDeleteFile = (fileId: string) => {
		if (disabled) return;
		const updatedFiles = files.filter(f => f.id !== fileId);
		onFilesChange(updatedFiles);
	};

	const getFileIcon = (file: File): string => {
		const extension = getFileExtension(file.name);
		const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
		const documentExtensions = ['pdf', 'doc', 'docx'];
		const spreadsheetExtensions = ['xls', 'xlsx', 'csv'];
		const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
		
		if (imageExtensions.includes(extension)) {
			return 'ri-image-line';
		} else if (documentExtensions.includes(extension)) {
			return 'ri-file-text-line';
		} else if (spreadsheetExtensions.includes(extension)) {
			return 'ri-file-excel-line';
		} else if (archiveExtensions.includes(extension)) {
			return 'ri-file-zip-line';
		}
		return 'ri-file-line';
	};

	const deleteButtonStyle: React.CSSProperties = {
		height: "24px",
		width: "24px",
	};

	const containerStyle: React.CSSProperties = {
		minHeight: minHeight,
	};

	return (
		<div
			className="blue-orange-file-upload-table-cont"
			style={containerStyle}
			onDragOver={handleDragOver}
			onDrop={handleDropEvent}
			onDragLeave={handleDragLeave}
		>
			<Table theme={TableTheme.OBJECT_LIST}>
				<THead>
					<tr>
						<HeaderCell>
							<div className="blue-orange-file-upload-table-header">Filename</div>
						</HeaderCell>
						<HeaderCell>
							<div className="blue-orange-file-upload-table-header">Type</div>
						</HeaderCell>
						<HeaderCell>
							<div className="blue-orange-file-upload-table-header">Size</div>
						</HeaderCell>
						<HeaderCell style={{width: "80px"}}>
							<div className="blue-orange-file-upload-table-header">Delete</div>
						</HeaderCell>
					</tr>
				</THead>
				<TBody>
					{files.length === 0 && !dragOverState && (
						<tr>
							<td colSpan={4} className="blue-orange-file-upload-table-empty">
								<div className="blue-orange-file-upload-table-empty-content">
									<i className="ri-upload-cloud-line"></i>
									<span>Drag and drop files here</span>
								</div>
							</td>
						</tr>
					)}
					{files.map((fileItem) => (
						<Row
							key={fileItem.id}
							background={fileItem.hasError ? "rgba(220, 53, 69, 0.1)" : "transparent"}
							hoverBackgroundColor={fileItem.hasError ? "rgba(220, 53, 69, 0.15)" : "#e0e1e2"}
						>
							<PrimaryCell
								text={fileItem.file.name}
								secondaryText={fileItem.hasError ? fileItem.errorMessage : undefined}
							/>
							<TextDataCell text={getFileType(fileItem.file)} />
							<TextDataCell text={formatBytes(fileItem.file.size)} />
							<td className="blue-orange-file-upload-table-action-cell">
								<ButtonIcon
									icon="ri-delete-bin-line"
									label="Delete"
									onClick={() => handleDeleteFile(fileItem.id)}
									style={deleteButtonStyle}
									isDisabled={disabled}
								/>
							</td>
						</Row>
					))}
				</TBody>
			</Table>
			{dragOverState && (
				<div className="blue-orange-file-upload-table-drag-over-state">
					<div className="blue-orange-file-upload-table-drop-icon-cont">
						<i className="ri-drop-fill"></i>
					</div>
					<div className="blue-orange-file-upload-table-drop-text">Drop Files</div>
				</div>
			)}
		</div>
	);
};
