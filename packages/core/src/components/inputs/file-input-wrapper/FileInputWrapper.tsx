import React, {ReactNode, useRef} from "react";

import './FileInputWrapper.css'

interface Props {
	children: ReactNode;
	accept: string;
	onFileSelect?: (value: File) => void;
	maxFileMgb?: number;
}

export const FileInputWrapper: React.FC<Props> = ({children, accept, onFileSelect, maxFileMgb}) => {

	const fileInputRef = useRef<HTMLInputElement>(null);

	const mimeTypes = () => {
		if (accept.toLowerCase() === "pdf") {
			return "application/pdf";
		} else if (accept.toLowerCase() === "image") {
			return "image/*";
		} else if (accept.toLowerCase() === "audio") {
			return "audio/*";
		} else if (accept.toLowerCase() === "video") {
			return "video/*";
		}
		return "*/*";
	};

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			if (maxFileMgb !== undefined && file.size > 1024 * 1024 * maxFileMgb) {
				alert('File is too large. Maximum size is ' + maxFileMgb + 'MB.');
			} else if (onFileSelect) {
				onFileSelect(file);
			}
		}
	};

	return (
		<div className="blue-orange-file-input-wrapper-cont">
			{children}
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{ display: 'none' }}
				accept={mimeTypes()}
			/>
			<div className="blue-orange-file-input-wrapper" onClick={handleClick}></div>
		</div>
	)
}