import React, {useState} from "react";

import './FileUploadTableDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FileUploadTable, FileUploadItem} from "../../../../components/inputs/file-upload-table/FileUploadTable";

interface Props {
}

export const FileUploadTableDevelopment: React.FC<Props> = ({}) => {

	const [files, setFiles] = useState<FileUploadItem[]>([]);
	const [restrictedFiles, setRestrictedFiles] = useState<FileUploadItem[]>([]);

	return (
		<PaddedPage>
			<PageHeading>File Upload Table</PageHeading>
			
			<div className="blue-orange-file-upload-table-development">
				<h3>Basic File Upload</h3>
				<p>Drag and drop any files into the table below:</p>
				<FileUploadTable
					files={files}
					onFilesChange={setFiles}
				/>
			</div>

			<div className="blue-orange-file-upload-table-development">
				<h3>Restricted File Types (PDF, PNG, JPG only)</h3>
				<p>Only PDF, PNG, and JPG files are accepted. Other file types will show an error:</p>
				<FileUploadTable
					files={restrictedFiles}
					onFilesChange={setRestrictedFiles}
					acceptedFileTypes={['.pdf', '.png', '.jpg', '.jpeg']}
					maxFileSizeMb={5}
					minHeight="300px"
				/>
			</div>
		</PaddedPage>
	)
}
