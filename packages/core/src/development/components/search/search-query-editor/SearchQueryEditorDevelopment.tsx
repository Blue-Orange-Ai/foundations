import React, {useState} from "react";

import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {
	BlueOrangeSearchQuery,
	IBlueOrangeSearchIndex,
	SearchQueryEditor
} from "../../../../components/search/search-query-editor/SearchQueryEditor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";

interface Props {
}

export const SearchQueryEditorDevelopment: React.FC<Props> = ({}) => {

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

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Search Query Editor</PageHeading>
					<SearchQueryEditor index={index} onChange={queryChange} reportChangesOnSaveOnly={false} onSave={querySave}></SearchQueryEditor>
				</PaddedPage>
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
