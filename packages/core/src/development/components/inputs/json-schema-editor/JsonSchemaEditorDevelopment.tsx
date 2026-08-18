import React, {useState} from "react";

import './JsonSchemaEditorDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {JsonSchemaEditor} from "../../../../components/inputs/json-schema-editor/JsonSchemaEditor";
import {JsonSchemaField, JsonSchemaFieldType} from "../../../../components/inputs/json-schema-editor/JsonSchemaTypes";
import {toJsonSchema} from "../../../../components/inputs/json-schema-editor/JsonSchemaConversion";

interface Props {
}

export const JsonSchemaEditorDevelopment: React.FC<Props> = ({}) => {

	const [fields, setFields] = useState<JsonSchemaField[]>([
		{key: "id", type: JsonSchemaFieldType.UUID, array: false},
		{key: "name", type: JsonSchemaFieldType.STRING, array: false},
		{key: "score", type: JsonSchemaFieldType.DOUBLE, array: false},
		{key: "tags", type: JsonSchemaFieldType.STRING, array: true},
		{
			key: "address", type: JsonSchemaFieldType.OBJECT, array: false, fields: [
				{key: "line1", type: JsonSchemaFieldType.STRING, array: false},
				{key: "postcode", type: JsonSchemaFieldType.STRING, array: false}
			]
		},
		{
			key: "orders", type: JsonSchemaFieldType.OBJECT, array: true, fields: [
				{key: "reference", type: JsonSchemaFieldType.STRING, array: false},
				{key: "placed", type: JsonSchemaFieldType.DATE_TIME, array: false},
				{
					key: "lines", type: JsonSchemaFieldType.OBJECT, array: true, fields: [
						{key: "sku", type: JsonSchemaFieldType.STRING, array: false},
						{key: "quantity", type: JsonSchemaFieldType.INTEGER, array: false}
					]
				}
			]
		}
	]);

	const [empty, setEmpty] = useState<JsonSchemaField[]>([]);

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Json Schema Editor</PageHeading>
					<div className="json-schema-editor-development-cont">
						<JsonSchemaEditor
							label="Customer schema"
							value={fields}
							onChange={setFields}
							required={true}
							allowJsonImport={true}
							help="Name each field, pick its Java type and flag whether it holds a list. Struct fields nest."></JsonSchemaEditor>
						<JsonSchemaEditor
							label="Empty schema (max depth 2)"
							value={empty}
							maxDepth={2}
							onChange={setEmpty}
							allowJsonImport={true}
							jsonImportLabel="Paste an example"
							help="Struct is not offered once the depth limit is reached."></JsonSchemaEditor>
						<JsonSchemaEditor
							label="Disabled"
							value={fields}
							disabled={true}></JsonSchemaEditor>
					</div>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						<div style={{marginBottom: "16px"}}>
							<strong>JSON Schema:</strong>
							<br/>
							{JSON.stringify(toJsonSchema(fields), null, 2)}
						</div>
						<div>
							<strong>Fields:</strong>
							<br/>
							{JSON.stringify(fields, null, 2)}
						</div>
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
