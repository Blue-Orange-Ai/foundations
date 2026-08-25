import React, {useState} from "react";

import {
	BlueOrangeSearchQuery,
	IBlueOrangeSearchIndex,
	SearchQueryEditor,
	BlueOrangeSearchQueryOperand
} from "../../../../components/search/search-query-editor/SearchQueryEditor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {SchemaPropertyType} from "@blue-orange-ai/foundations-clients";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SEARCH_QUERY_EDITOR_PROPS: Array<PropSpec> = [
	{
		name: "index",
		type: "Index",
		required: true,
		description: "The index being queried. Its schema decides which fields the conditions can name."
	},
	{
		name: "query",
		type: "BlueOrangeSearchQuery",
		description: "The query being edited. Left off, the editor starts from an empty root group."
	},
	{
		name: "page",
		type: "number",
		default: "1",
		control: "number",
		description: "The page of results the query asks for."
	},
	{
		name: "size",
		type: "number",
		default: "25",
		control: "number",
		description: "How many results a page holds."
	},
	{
		name: "filter",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Runs the query as a filter — matching without scoring."
	},
	{
		name: "minimumShouldMatch",
		type: "number",
		default: "1",
		control: "number",
		description: "How many of the optional clauses have to match."
	},
	{
		name: "analyzer",
		type: "string",
		control: "text",
		description: "The analyzer the text conditions are run through."
	},
	{
		name: "showHeader",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the bar above the conditions."
	},
	{
		name: "onChange",
		type: "(query: BlueOrangeSearchQuery) => void",
		description: "Fires with the whole query on every change."
	},
	{
		name: "reportChangesOnSaveOnly",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Holds the changes back until save."
	},
	{
		name: "onSave",
		type: "(query: BlueOrangeSearchQuery) => void",
		description: "Fires when save is used."
	}
];

interface Props {
}

export const SearchQueryEditorDevelopment: React.FC<Props> = ({}) => {

	const index: IBlueOrangeSearchIndex = {
		name: "demo-index",
		displayName: "Demo Search Query",
		description: "Build a BlueOrange search Query using a schema",
		schema: {
			properties: [
				{ apiName: "name", displayName: "Name", type: SchemaPropertyType.TEXT },
				{ apiName: "status", displayName: "Status", type: SchemaPropertyType.KEYWORDS },
				{ apiName: "createdAt", displayName: "Created At", type: SchemaPropertyType.DATE },
				{ apiName: "age", displayName: "Age", type: SchemaPropertyType.INTEGER },
				{ apiName: "active", displayName: "Active", type: SchemaPropertyType.BOOLEAN },
				{ apiName: "location", displayName: "Location", type: SchemaPropertyType.GEO_POINT },
				{ apiName: "metadata", displayName: "Metadata", type: SchemaPropertyType.OBJECT },
				{ apiName: "embedding", displayName: "Embedding", type: SchemaPropertyType.VECTOR }
			]
		}
	}

	const generateQueryStr = (query: BlueOrangeSearchQuery) => {
		return JSON.stringify(query, null, 2);
	}

	const [query, setQuery] = useState<BlueOrangeSearchQuery>({
		index: index.name,
		page: 1,
		size: 25,
		filter: false,
		minimumShouldMatch: 1,
		rootCondition: { operand: BlueOrangeSearchQueryOperand.AND, components: [] }
	});

	const [queryStr, setQueryStr] = useState(generateQueryStr(query));

	const queryChange = (q: BlueOrangeSearchQuery) => {
		setQuery(q);
		setQueryStr(generateQueryStr(q));
	}

	const querySave = (q: BlueOrangeSearchQuery) => {
		setQuery(q);
		setQueryStr(generateQueryStr(q));
	}

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Search Query Editor"
					description="A builder for a BlueOrange search query: conditions over the index's fields, grouped and joined by AND or OR. The index's schema is what decides which fields can be queried and how."
					name="SearchQueryEditor"
					previewHeight={360}
					previewCentered={false}
					props={SEARCH_QUERY_EDITOR_PROPS}
					preview={values => (
						<div style={{width: "100%"}}>
							<SearchQueryEditor
								index={index}
								page={values.page}
								size={values.size}
								filter={values.filter}
								minimumShouldMatch={values.minimumShouldMatch}
								analyzer={values.analyzer}
								showHeader={values.showHeader}
								reportChangesOnSaveOnly={values.reportChangesOnSaveOnly}
								onChange={() => {}}></SearchQueryEditor>
						</div>
					)}>
					<SearchQueryEditor index={index} onChange={queryChange} reportChangesOnSaveOnly={false} onSave={querySave}></SearchQueryEditor>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{queryStr}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>

	)
}
