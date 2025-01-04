import React, {ReactEventHandler, useRef} from "react";

import './FileUploadBtn.css';

interface Props {
	accept: string;
	label?: string;
	icon?: boolean;
	isLoading?: boolean;
	onFileSelect?: (value: File) => void;
	style?: React.CSSProperties;
}

export const FileUploadBtn: React.FC<Props> = ({
												   accept,
												   onFileSelect,
												   label="Upload File",
												   icon=false,
												   isLoading=false,
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
			if (onFileSelect) {
				onFileSelect(file);
			}
		}
	};

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
		<div>
			<input
				type="file"
				ref={fileUploadElem}
				onChange={handleFileChange}
				style={{ display: 'none' }}
				accept={mimeTypes()}
			/>
			{isLoading &&
				<div className="default-file-upload-btn" style={style}>
					<i className="ri-loader-4-line rotate-spinner"></i>
				</div>
			}
			{!isLoading &&
				<button className="default-file-upload-btn"
						style={style}
						onClick={handleButtonClick}>
					{icon && <i className="ri-upload-2-line file-upload-margin-right"></i>}
					{label}
				</button>
			}
		</div>
	)
}