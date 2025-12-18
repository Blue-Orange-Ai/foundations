import React, {useState} from "react";

import './FileInputDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FileInputWrapper} from "../../../../components/inputs/file-input-wrapper/FileInputWrapper";

interface Props {
}

export const FileInputDevelopment: React.FC<Props> = ({}) => {

	const [fileName, setFileName] = useState<string>("");

	const onFileSelect = (file: File) => {
		setFileName(file.name);
	}

	return (
		<PaddedPage>
			<PageHeading>File Input</PageHeading>
			<FileInputWrapper accept={"*"} onFileSelect={onFileSelect}>
				<div className="blue-orange-file-input-development-drop-zone">
					<div className="blue-orange-file-input-development-drop-zone-heading">Click to select a file</div>
					<div className="blue-orange-file-input-development-drop-zone-sub">Selected: {fileName ? fileName : "(none)"}</div>
				</div>
			</FileInputWrapper>
		</PaddedPage>
	)
}
