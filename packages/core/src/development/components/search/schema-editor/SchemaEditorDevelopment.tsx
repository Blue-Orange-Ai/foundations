import React, {useState} from "react";

import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SchemaEditor} from "../../../../components/search/schema-editor/SchemaEditor";
import {IBlueOrangeSearchSchema} from "../../../../components/search/search-query-editor/SearchQueryEditor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";

interface Props {
}

export const SchemaEditorDevelopment: React.FC<Props> = ({}) => {

	const initialSchema: IBlueOrangeSearchSchema = {
		properties: [
			{ apiName: "name", displayName: "Name", type: "TEXT", analyzer: "standard" },
			{ apiName: "status", displayName: "Status", type: "KEYWORDS" },
			{ apiName: "createdAt", displayName: "Created At", type: "DATE" },
			{ apiName: "age", displayName: "Age", type: "INTEGER" },
			{ apiName: "active", displayName: "Active", type: "BOOLEAN" },
			{ apiName: "location", displayName: "Location", type: "GEO_POINT" },
			{ apiName: "metadata", displayName: "Metadata", type: "OBJECT" },
			{ apiName: "embedding", displayName: "Embedding", type: "VECTOR", dims: 384, similarity: "cosine" }
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
				<PaddedPage>
					<PageHeading>Schema Editor</PageHeading>
					<SchemaEditor schema={currentSchema} onChange={schemaChange} reportChangesOnSaveOnly={false} onSave={schemaSave}></SchemaEditor>
				</PaddedPage>
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
