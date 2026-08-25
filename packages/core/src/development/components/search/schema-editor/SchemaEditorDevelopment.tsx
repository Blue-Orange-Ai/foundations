import React, {useState} from "react";

import {SchemaEditor} from "../../../../components/search/schema-editor/SchemaEditor";
import {IBlueOrangeSearchSchema} from "../../../../components/search/search-query-editor/SearchQueryEditor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {SchemaPropertyType} from "@blue-orange-ai/foundations-clients";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SCHEMA_EDITOR_PROPS: Array<PropSpec> = [
	{
		name: "schema",
		type: "Schema",
		description: "The schema being edited. Left off, the editor starts from an empty one."
	},
	{
		name: "showHeader",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the bar above the fields."
	},
	{
		name: "headerTitle",
		type: "string",
		default: "\"Schema\"",
		control: "text",
		description: "What that bar reads."
	},
	{
		name: "headerDescription",
		type: "string",
		default: "\"Build a schema by adding fields\"",
		control: "text",
		description: "The line under it."
	},
	{
		name: "analyzers",
		type: "string[]",
		default: "[\"standard\"]",
		description: "The analyzers offered against a text field."
	},
	{
		name: "readOnly",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Shows the schema without letting it be changed."
	},
	{
		name: "onChange",
		type: "(schema: Schema) => void",
		description: "Fires with the whole schema on every change — unless reportChangesOnSaveOnly says otherwise."
	},
	{
		name: "reportChangesOnSaveOnly",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Holds the changes back until save, for an editor that should not report a half finished schema."
	},
	{
		name: "onSave",
		type: "(schema: Schema) => void",
		description: "Fires when save is used."
	}
];

interface Props {
}

export const SchemaEditorDevelopment: React.FC<Props> = ({}) => {

	const initialSchema: IBlueOrangeSearchSchema = {
		properties: [
			{ apiName: "name", displayName: "Name", type: SchemaPropertyType.TEXT, analyzer: "standard" },
			{ apiName: "status", displayName: "Status", type: SchemaPropertyType.KEYWORDS },
			{ apiName: "createdAt", displayName: "Created At", type: SchemaPropertyType.DATE },
			{ apiName: "age", displayName: "Age", type: SchemaPropertyType.INTEGER },
			{ apiName: "active", displayName: "Active", type: SchemaPropertyType.BOOLEAN },
			{ apiName: "location", displayName: "Location", type: SchemaPropertyType.GEO_POINT },
			{ apiName: "metadata", displayName: "Metadata", type: SchemaPropertyType.OBJECT },
			{ apiName: "embedding", displayName: "Embedding", type: SchemaPropertyType.VECTOR, dims: 384, similarity: "cosine" }
		]
	}

	const generateSchemaStr = (schema: IBlueOrangeSearchSchema) => {
		return JSON.stringify(schema, null, 2);
	}

	const [currentSchema, setCurrentSchema] = useState<IBlueOrangeSearchSchema>(initialSchema);
	const [schemaStr, setSchemaStr] = useState(generateSchemaStr(initialSchema));

	const schemaChange = (schema: IBlueOrangeSearchSchema) => {
		setCurrentSchema(schema);
		setSchemaStr(generateSchemaStr(schema));
	}

	const schemaSave = (schema: IBlueOrangeSearchSchema) => {
		setCurrentSchema(schema);
		setSchemaStr(generateSchemaStr(schema));
	}

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Schema Editor"
					description="A builder for a search index's schema: the fields it holds, their types, and the analyzer each text field is indexed with. It can report every change as it is made, or hold them until save."
					name="SchemaEditor"
					previewHeight={360}
					previewCentered={false}
					props={SCHEMA_EDITOR_PROPS}
					preview={values => (
						<div style={{width: "100%"}}>
							<SchemaEditor
								schema={currentSchema}
								showHeader={values.showHeader}
								headerTitle={values.headerTitle}
								headerDescription={values.headerDescription}
								readOnly={values.readOnly}
								reportChangesOnSaveOnly={values.reportChangesOnSaveOnly}
								onChange={() => {}}></SchemaEditor>
						</div>
					)}>
					<SchemaEditor schema={currentSchema} onChange={schemaChange} reportChangesOnSaveOnly={false} onSave={schemaSave}></SchemaEditor>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{schemaStr}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
