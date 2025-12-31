import React, {useState} from "react";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {HorizontalSplitPage} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	BlueOrangeSearchQuery,
	IBlueOrangeSearchIndex
} from "../../../../components/search/search-query-editor/SearchQueryEditor";
import {SearchQueryEditorSmall} from "../../../../components/search/search-query-editor-small/SearchQueryEditorSmall";

interface Props {}

export const SearchQueryEditorSmallDevelopment: React.FC<Props> = ({}) => {

	const index: IBlueOrangeSearchIndex = {
		name: "demo-index",
		displayName: "Demo Search Query",
		description: "Build a BlueOrange search Query using a schema",
		schema: {
			properties: [
				{ apiName: "name", displayName: "Name", type: "TEXT" },
				{ apiName: "status", displayName: "Status", type: "KEYWORDS" },
				{ apiName: "createdAt", displayName: "Created At", type: "DATE" },
				{ apiName: "age", displayName: "Age", type: "INTEGER" },
				{ apiName: "active", displayName: "Active", type: "BOOLEAN" },
				{ apiName: "location", displayName: "Location", type: "GEO_POINT" },
				{ apiName: "metadata", displayName: "Metadata", type: "OBJECT" },
				{ apiName: "embedding", displayName: "Embedding", type: "VECTOR" }
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
		rootCondition: { operand: "AND", components: [] }
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
			operand: "AND",
			components: [
				{
					termCondition: {
						field: "name",
						query: "John Doe",
						type: "PHRASE"
					}
				},
				{
					termCondition: {
						field: "status",
						query: "active",
						type: "PHRASE"
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
				<PaddedPage>
					<PageHeading>Search Query Editor Small</PageHeading>
					
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
				</PaddedPage>
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
