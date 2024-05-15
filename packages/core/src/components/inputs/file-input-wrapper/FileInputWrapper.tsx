import React, {ReactNode, useEffect, useRef, useState, MouseEvent as ReactMouseEvent} from "react";

import './FileInputWrapper.css'
import {FileUploadBtn} from "../../buttons/file-upload-btn/FileUploadBtn";

interface Props {
	children: ReactNode;
	accept: string;
	onFileSelect?: (value: File) => void;
	maxFileMgb?: number;
}
export const FileInputWrapper: React.FC<Props> = ({children, accept, onFileSelect, maxFileMgb}) => {

	const style: React.CSSProperties = {
		opacity: 0,
		height: "100%",
		width: "100%"
	}

	return (
		<div className="blue-orange-file-input-wrapper-cont">
			{children}
			<div className="blue-orange-file-input-wrapper">
				<FileUploadBtn
					accept={accept}
					onFileSelect={onFileSelect}
					maxFileMgb={maxFileMgb}
					style={style}></FileUploadBtn>
			</div>
		</div>
	)
}