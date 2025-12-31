import React, {useState, useMemo} from "react";

import './SearchInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SearchInput, SearchSuggestion, SearchSuggestionGroup} from "../../../../components/inputs/search/SearchInput";

interface Props {
}

interface SearchEvent {
    date: Date,
    query: string,
    source: 'typed' | 'suggestion'
}

export const SearchInputDevelopment: React.FC<Props> = ({}) => {

	const [query, setQuery] = useState<string>("Hello World");
	const [filterText, setFilterText] = useState<string>("");

    const [lastSearchEvent, setLastSearchEvent] = useState<SearchEvent>({
        date: new Date(),
        query: "Initial State",
        source: 'typed'
    })

    const allSuggestions: SearchSuggestionGroup[] = [
        {
            groupLabel: "Recent Searches",
            suggestions: [
                { label: "Dashboard analytics", value: "dashboard analytics", icon: "ri-dashboard-line" },
                { label: "User management", value: "user management", icon: "ri-user-line" },
                { label: "Settings page", value: "settings page", icon: "ri-settings-line" },
            ]
        },
        {
            groupLabel: "Popular",
            suggestions: [
                { label: "Getting started guide", value: "getting started guide", icon: "ri-book-open-line" },
                { label: "API documentation", value: "api documentation", icon: "ri-code-line" },
                { label: "Component library", value: "component library", icon: "ri-layout-line" },
            ]
        },
        {
            suggestions: [
                { label: "Help & Support", value: "help support", icon: "ri-question-line" },
            ]
        }
    ];

    const filteredSuggestions = useMemo(() => {
        if (!filterText.trim()) {
            return allSuggestions;
        }
        const lowerFilter = filterText.toLowerCase();
        return allSuggestions
            .map(group => ({
                ...group,
                suggestions: group.suggestions.filter(
                    s => s.label.toLowerCase().includes(lowerFilter) || 
                         s.value.toLowerCase().includes(lowerFilter)
                )
            }))
            .filter(group => group.suggestions.length > 0);
    }, [filterText]);

    const handleFilterChange = (value: string) => {
        setFilterText(value);
    };

    const handleSearchEvent = (query: string) => {
        setLastSearchEvent({
            date: new Date(),
            query: query,
            source: 'typed'
        })
    }

    const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
        setLastSearchEvent({
            date: new Date(),
            query: suggestion.value,
            source: 'suggestion'
        })
    }

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Search Input</PageHeading>
					<div style={{marginBottom: "20px"}}>
						<h4 style={{marginBottom: "8px"}}>Basic Search</h4>
						<SearchInput
							value={query}
							icon="ri-search-line"
							label="Search..."
							deletable={true}
							onSearchEvent={handleSearchEvent}
						/>
					</div>
					<div style={{marginBottom: "20px"}}>
						<h4 style={{marginBottom: "8px"}}>Search with Dynamic Filtered Suggestions</h4>
						<p style={{marginBottom: "8px", fontSize: "0.85rem", opacity: 0.7}}>
							Type to filter suggestions (e.g., "dash", "api", "guide")
						</p>
						<SearchInput
							icon="ri-search-line"
							label="Type to filter suggestions..."
							deletable={true}
							suggestionGroups={filteredSuggestions}
							onChange={handleFilterChange}
							onSearchEvent={handleSearchEvent}
							onSuggestionSelect={handleSuggestionSelect}
						/>
					</div>
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