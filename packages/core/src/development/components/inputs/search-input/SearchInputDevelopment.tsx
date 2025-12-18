import React, {useState} from "react";

import './SearchInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SearchInput} from "../../../../components/inputs/search/SearchInput";

interface Props {
}

interface SearchEvent {
    date: Date,
    query: string
}

export const SearchInputDevelopment: React.FC<Props> = ({}) => {

	const [query, setQuery] = useState<string>("Hello World");

    const [lastSearchEvent, setLastSearchEvent] = useState<SearchEvent>({
        date: new Date(),
        query: "Initial State"
    })

    const handleSearchEvent = (query: string) => {
        setLastSearchEvent({
            date: new Date(),
            query: query
        })
    }

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Search Input</PageHeading>
					<SearchInput
                        value={query}
                        icon="ri-search-line"
                        label="Search..."
                        deletable={true}
                        onSearchEvent={handleSearchEvent}></SearchInput>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(query, null, 4)}
					</div>
                    <div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
                        {JSON.stringify(lastSearchEvent, null, 4)}
                    </div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}