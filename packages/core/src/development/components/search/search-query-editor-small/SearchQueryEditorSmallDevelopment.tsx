import React, {useState} from "react";
import {HorizontalSplitPage} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	BlueOrangeSearchQuery,
	IBlueOrangeSearchIndex,
	BlueOrangeSearchQueryOperand,
	BlueOrangeSearchQueryTermType
} from "../../../../components/search/search-query-editor/SearchQueryEditor";
import {SearchQueryEditorSmall} from "../../../../components/search/search-query-editor-small/SearchQueryEditorSmall";
import {SchemaPropertyType} from "@blue-orange-ai/foundations-clients";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SEARCH_QUERY_EDITOR_SMALL_PROPS: Array<PropSpec> = [
	{
		name: "index",
		type: "IBlueOrangeSearchIndex",
		required: true,
		description: "The index being queried. Its schema decides which fields the conditions can name."
	},
	{
		name: "query",
		type: "BlueOrangeSearchQuery",
		description: "The query being edited."
	},
	{
		name: "placeholder",
		type: "string",
		default: "\"Click to edit search query...\"",
		control: "text",
		description: "What the field reads while the query is empty."
	},
	{
		name: "popupMaxHeight",
		type: "number",
		default: "400",
		control: "slider",
		min: 200,
		max: 800,
		step: 20,
		description: "How tall the popup gets before it scrolls."
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
		default: "false",
		control: "toggle",
		description: "Shows the bar above the conditions inside the popup."
	},
	{
		name: "onChange",
		type: "(query: BlueOrangeSearchQuery) => void",
		description: "Fires with the whole query when it changes."
	},
	{
		name: "reportChangesOnSaveOnly",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Holds the changes back until the popup is saved, which is what keeps a half built query out of the search."
	},
	{
		name: "onSave",
		type: "(query: BlueOrangeSearchQuery) => void",
		description: "Fires when save is used."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the field."
	}
];

interface Props {}

export const SearchQueryEditorSmallDevelopment: React.FC<Props> = ({}) => {

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

	// Pre-populated example query
	const [exampleQuery] = useState<BlueOrangeSearchQuery>({
		index: index.name,
		page: 1,
		size: 25,
		filter: false,
		minimumShouldMatch: 1,
		rootCondition: {
			operand: BlueOrangeSearchQueryOperand.AND,
			components: [
				{
					termCondition: {
						field: "name",
						query: "John Doe",
						type: BlueOrangeSearchQueryTermType.PHRASE
					}
				},
				{
					termCondition: {
						field: "status",
						query: "active",
						type: BlueOrangeSearchQueryTermType.PHRASE
					}
				},
				{
					numericCondition: {
						field: "age",
						gte: "18",
						lte: "65"
					}
				}
			]
		}
	});

	const [exampleQueryStr, setExampleQueryStr] = useState(generateQueryStr(exampleQuery));
	const [currentExampleQuery, setCurrentExampleQuery] = useState(exampleQuery);

	const exampleQueryChange = (q: BlueOrangeSearchQuery) => {
		setCurrentExampleQuery(q);
		setExampleQueryStr(generateQueryStr(q));
	}

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Search Query Editor Small"
					description="The query editor collapsed to a single field. It reads back the query it holds, and opens the full builder in a popup when it is clicked — for a search bar that has to sit in a toolbar rather than take a page."
					name="SearchQueryEditorSmall"
					previewHeight={200}
					previewCentered={false}
					props={SEARCH_QUERY_EDITOR_SMALL_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "560px"}}>
							<SearchQueryEditorSmall
								index={index}
								page={values.page}
								size={values.size}
								filter={values.filter}
								minimumShouldMatch={values.minimumShouldMatch}
								analyzer={values.analyzer}
								showHeader={values.showHeader}
								placeholder={values.placeholder}
								popupMaxHeight={values.popupMaxHeight}
								reportChangesOnSaveOnly={values.reportChangesOnSaveOnly}
								onChange={() => {}}></SearchQueryEditorSmall>
						</div>
					)}>
					
					<div style={{marginBottom: "30px"}}>
						<h3 style={{marginBottom: "10px", fontSize: "14px", fontWeight: 600}}>Empty Query (Click to add conditions)</h3>
						<SearchQueryEditorSmall
							index={index}
							query={query}
							onChange={queryChange}
							onSave={querySave}
							placeholder="Click to build a search query..."
						/>
					</div>

					<div style={{marginBottom: "30px"}}>
						<h3 style={{marginBottom: "10px", fontSize: "14px", fontWeight: 600}}>Pre-populated Query (Shows Sourcegraph-style display)</h3>
						<SearchQueryEditorSmall
							index={index}
							query={currentExampleQuery}
							onChange={exampleQueryChange}
							onSave={exampleQueryChange}
							placeholder="Click to edit search query..."
						/>
					</div>

					<div style={{marginBottom: "30px"}}>
						<h3 style={{marginBottom: "10px", fontSize: "14px", fontWeight: 600}}>Custom Width (400px)</h3>
						<SearchQueryEditorSmall
							index={index}
							style={{maxWidth: "400px"}}
							placeholder="Narrow search input..."
						/>
					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Empty Query Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "12px", marginBottom: "30px"}}>
						{queryStr}
					</div>
					<div style={{marginBottom: "20px"}}>Pre-populated Query Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "12px"}}>
						{exampleQueryStr}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
