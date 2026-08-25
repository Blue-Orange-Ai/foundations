import React, {useState} from "react";

import './JsonSchemaEditorDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {JsonSchemaEditor} from "../../../../components/inputs/json-schema-editor/JsonSchemaEditor";
import {JsonSchemaField, JsonSchemaFieldType} from "../../../../components/inputs/json-schema-editor/JsonSchemaTypes";
import {toJsonSchema} from "../../../../components/inputs/json-schema-editor/JsonSchemaConversion";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";
import {ButtonSize} from "../../../../components/buttons/button/Button";

const DEMO_JSON_SCHEMA: JsonSchemaField[] = [];

const JSON_SCHEMA_EDITOR_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "JsonSchemaField[]",
		default: "[]",
		description: "The fields of the schema. They nest, so this is a tree rather than a flat list."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Response shape",
		description: "The label above the editor."
	},
	{
		name: "maxDepth",
		type: "number",
		default: "5",
		control: "slider",
		min: 1,
		max: 8,
		step: 1,
		description: "How many levels of fields are allowed, counting the root list."
	},
	{
		name: "allowJsonImport",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Offers a link beside the label that opens a window for pasting an example object. The fields read out of it replace the schema."
	},
	{
		name: "jsonImportLabel",
		type: "string",
		default: "\"Infer from JSON\"",
		control: "text",
		description: "The wording of that link."
	},
	{
		name: "buttonSize",
		type: "ButtonSize",
		default: "ButtonSize.SMALL",
		defaultValue: ButtonSize.SMALL,
		control: "select",
		options: [
			{label: "Small", value: ButtonSize.SMALL, code: "ButtonSize.SMALL"},
			{label: "Medium", value: ButtonSize.MEDIUM, code: "ButtonSize.MEDIUM"},
			{label: "Large", value: ButtonSize.LARGE, code: "ButtonSize.LARGE"}
		],
		description: "How large the add field buttons are."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the editor out and stops fields being added or removed."
	},
	{
		name: "onChange",
		type: "(value: JsonSchemaField[]) => void",
		description: "Fires with the whole schema whenever any field changes."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the editor."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	},
	...validationProps("JsonSchemaField[]")
];

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
				<ComponentDoc
					title="JSON Schema Editor"
					description="A field for describing the shape of an object: a list of named, typed fields that can nest. It can also read a schema out of a pasted example, which is usually quicker than declaring one by hand."
					name="JsonSchemaEditor"
					previewHeight={300}
					previewCentered={false}
					imports={["JsonSchemaField", "ButtonSize"]}
					props={JSON_SCHEMA_EDITOR_PROPS}
					preview={values => (
						<div style={{width: "100%"}}>
							<JsonSchemaEditor
								value={DEMO_JSON_SCHEMA}
								label={values.label}
								maxDepth={values.maxDepth}
								allowJsonImport={values.allowJsonImport}
								jsonImportLabel={values.jsonImportLabel}
								buttonSize={values.buttonSize}
								help={values.help}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></JsonSchemaEditor>
						</div>
					)}>
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
				</ComponentDoc>
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
