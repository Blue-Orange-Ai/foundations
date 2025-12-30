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
import {SearchIndexEditor} from "../../../../components/search/search-index-editor/SearchIndexEditor";

interface Props {
}

export const SearchIndexEditorDevelopment: React.FC<Props> = ({}) => {


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<SearchIndexEditor></SearchIndexEditor>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{"Hello world"}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
