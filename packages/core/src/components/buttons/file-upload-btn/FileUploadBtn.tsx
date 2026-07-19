import React, {ReactEventHandler, useRef} from "react";
import {ButtonSize} from "../button/Button";

import './FileUploadBtn.css';

interface Props {
	accept: string;
	label?: string;
	icon?: boolean;
	size?: ButtonSize;
	isLoading?: boolean;
	onFileSelect?: (value: File) => void;
	maxFileMgb?: number;
	style?: React.CSSProperties;
}

const sizeClassName: Record<ButtonSize, string> = {
	[ButtonSize.SMALL]: "default-file-upload-btn-sm",
	[ButtonSize.MEDIUM]: "",
	[ButtonSize.LARGE]: "default-file-upload-btn-lg",
};

export const FileUploadBtn: React.FC<Props> = ({
												   accept,
												   onFileSelect,
												   label="Upload File",
												   icon=false,
												   size=ButtonSize.MEDIUM,
												   isLoading=false,
												   maxFileMgb,
												   style={}}) => {

	const fileUploadElem = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		if (fileUploadElem !== null && fileUploadElem.current != null) {
			fileUploadElem.current.value = '';
			fileUploadElem.current.click();
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let file: File;
		if (event.target.files != null) {
			file = event.target.files[0];
			if (maxFileMgb != undefined && file.size > 1024 * 1024 * maxFileMgb) {
				alert('File is too large. Maximum size is ' + maxFileMgb + 'MB.');
			} else if (onFileSelect) {
				onFileSelect(file);
			}
		}
	};

	const btnClassName = "default-file-upload-btn" + (sizeClassName[size] ? " " + sizeClassName[size] : "");

	const mimeTypes = () => {
		if (accept.toLowerCase() == "pdf") {
			return "application/pdf";
		} else if (accept.toLowerCase() == "image") {
			return "image/*"
		} else if (accept.toLowerCase() == "audio") {
			return "audio/*";
		} else if (accept.toLowerCase() == "video") {
			return "video/*";
		}
		return "*/*";
	}

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<input
				type="file"
				ref={fileUploadElem}
				onChange={handleFileChange}
				style={{ display: 'none' }}
				accept={mimeTypes()}
			/>
			{isLoading &&
				<div className={btnClassName} style={style}>
					<i className="ri-loader-4-line rotate-spinner"></i>
				</div>
			}
			{!isLoading &&
				<button className={btnClassName}
						style={style}
						onClick={handleButtonClick}>
					{icon && <i className="ri-upload-2-line file-upload-margin-right"></i>}
					{label}
				</button>
			}
		</div>
	)
}