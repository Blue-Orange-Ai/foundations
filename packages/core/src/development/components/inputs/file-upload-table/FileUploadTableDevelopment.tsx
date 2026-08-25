import React, {useState} from "react";

import './FileUploadTableDevelopment.css'
import {FileUploadTable, FileUploadItem} from "../../../../components/inputs/file-upload-table/FileUploadTable";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const FILE_UPLOAD_ITEM_INTERFACE = {
	name: "FileUploadItem",
	description: "One row of the list. The table sets hasError and errorMessage itself when a file fails its checks.",
	props: [
		{name: "id", type: "string", required: true, description: "Identifies the row."},
		{name: "file", type: "File", required: true, description: "The file itself."},
		{name: "hasError", type: "boolean", required: true, description: "Whether the file failed a check."},
		{name: "errorMessage", type: "string", description: "Why it failed."}
	] as Array<PropSpec>
};

const FILE_UPLOAD_TABLE_PROPS: Array<PropSpec> = [
	{
		name: "files",
		type: "FileUploadItem[]",
		required: true,
		description: "The files in the list. The table is controlled, so this is the parent's to hold."
	},
	{
		name: "onFilesChange",
		type: "(files: FileUploadItem[]) => void",
		required: true,
		description: "Fires with the whole list whenever a file is added or removed."
	},
	{
		name: "acceptedFileTypes",
		type: "string[]",
		description: "Mime types the table will take. Anything else is added with an error against it."
	},
	{
		name: "maxFileSizeMb",
		type: "number",
		control: "number",
		description: "Largest file accepted, in megabytes."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the table out and stops files being added or removed."
	},
	{
		name: "minHeight",
		type: "string",
		default: "\"200px\"",
		control: "text",
		description: "A floor under the table's height, so an empty list still reads as a drop target."
	},
	{
		name: "restrictTypes",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — restricts the table to PNG, JPEG and PDF."
	}
];

interface Props {
}

export const FileUploadTableDevelopment: React.FC<Props> = ({}) => {

	const [files, setFiles] = useState<FileUploadItem[]>([]);
	const [restrictedFiles, setRestrictedFiles] = useState<FileUploadItem[]>([]);

	return (
		<ComponentDoc
			title="File Upload Table"
			description="A list of files waiting to be uploaded, with the ones that failed their checks marked and removable. It is controlled — the list is the parent's to hold — so the same table serves a drop zone, a picker or a paste."
			name="FileUploadTable"
			previewHeight={280}
			previewCentered={false}
			imports={["FileUploadItem"]}
			interfaces={[FILE_UPLOAD_ITEM_INTERFACE]}
			props={FILE_UPLOAD_TABLE_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<FileUploadTable
						files={[]}
						acceptedFileTypes={values.restrictTypes ? ["image/png", "image/jpeg", "application/pdf"] : undefined}
						maxFileSizeMb={values.maxFileSizeMb}
						disabled={values.disabled}
						minHeight={values.minHeight}
						onFilesChange={() => {}}></FileUploadTable>
				</div>
			)}>
			
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
		</ComponentDoc>
	)
}
