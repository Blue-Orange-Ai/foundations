import React, {useState} from "react";

import './FileInputDevelopment.css'
import {FileInputWrapper} from "../../../../components/inputs/file-input-wrapper/FileInputWrapper";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const FILE_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "Whatever should act as the picker. Clicking anywhere in it opens the file dialog."
	},
	{
		name: "accept",
		type: "string",
		required: true,
		control: "select",
		value: "image",
		options: [
			{label: "Anything", value: "*"},
			{label: "image", value: "image"},
			{label: "pdf", value: "pdf"},
			{label: "audio", value: "audio"},
			{label: "video", value: "video"}
		],
		description: "What the dialog will offer. The named types are mapped to their mime types; anything else is passed straight through."
	},
	{
		name: "onFileSelect",
		type: "(value: File) => void",
		description: "Fires with the chosen file, once it has passed the size check."
	},
	{
		name: "maxFileMgb",
		type: "number",
		control: "number",
		description: "Largest file accepted, in megabytes. Anything bigger is rejected before onFileSelect."
	}
];

interface Props {
}

export const FileInputDevelopment: React.FC<Props> = ({}) => {

	const [fileName, setFileName] = useState<string>("");

	const onFileSelect = (file: File) => {
		setFileName(file.name);
	}

	return (
		<ComponentDoc
			title="File Input"
			description="Turns whatever it wraps into a file picker — a drop zone, a card, a row in a list. It holds the hidden input and the size check, and hands back the file that was chosen."
			name="FileInputWrapper"
			previewHeight={200}
			previewCentered={false}
			props={FILE_INPUT_PROPS}
			snippetChildren={() => "<div className={\"drop-zone\"}>Click to choose a file</div>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<FileInputWrapper
						accept={values.accept}
						maxFileMgb={values.maxFileMgb}
						onFileSelect={() => {}}>
						<div className="blue-orange-file-input-development-drop-zone">
							Click to choose a file
						</div>
					</FileInputWrapper>
				</div>
			)}>
			<FileInputWrapper accept={"*"} onFileSelect={onFileSelect}>
				<div className="blue-orange-file-input-development-drop-zone">
					<div className="blue-orange-file-input-development-drop-zone-heading">Click to select a file</div>
					<div className="blue-orange-file-input-development-drop-zone-sub">Selected: {fileName ? fileName : "(none)"}</div>
				</div>
			</FileInputWrapper>
		</ComponentDoc>
	)
}
