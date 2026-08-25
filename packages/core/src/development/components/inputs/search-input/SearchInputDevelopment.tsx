import React, {useState, useMemo} from "react";

import './SearchInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SearchInput, SearchSuggestion, SearchSuggestionGroup} from "../../../../components/inputs/search/SearchInput";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const DEMO_SUGGESTIONS: SearchSuggestionGroup[] = [
	{
		groupLabel: "Sites",
		suggestions: [
			{label: "Melbourne Depot", value: "melbourne", icon: "ri-map-pin-2-line"},
			{label: "Geelong Yard", value: "geelong", icon: "ri-map-pin-2-line"}
		]
	},
	{
		groupLabel: "Runs",
		suggestions: [
			{label: "Nightly ingest", value: "nightly", icon: "ri-play-list-line"}
		]
	}
];

const SEARCH_SUGGESTION_INTERFACE = {
	name: "SearchSuggestion",
	description: "One row of the suggestion list. Groups of them are handed in through suggestionGroups, each with an optional label of its own.",
	props: [
		{name: "label", type: "string", required: true, description: "What the row reads."},
		{name: "value", type: "string", required: true, description: "What comes back through onSuggestionSelect."},
		{name: "icon", type: "string", description: "A remixicon class shown before the label."}
	] as Array<PropSpec>
};

const SEARCH_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "What is in the field."
	},
	{
		name: "label",
		type: "string",
		default: "\"Filter by keyword\"",
		control: "text",
		description: "The label above the field."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-search-line",
		description: "A remixicon class shown inside the field."
	},
	{
		name: "deletable",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a clear button on the field once there is something in it."
	},
	{
		name: "timeout",
		type: "number",
		default: "500",
		control: "slider",
		min: 0,
		max: 2000,
		step: 100,
		description: "How long typing has to stop for before onSearchEvent fires, in milliseconds."
	},
	{
		name: "suggestionGroups",
		type: "SearchSuggestionGroup[]",
		description: "Rows to drop under the field as it is typed in."
	},
	{
		name: "onChange",
		type: "(value: string) => void",
		description: "Fires on every keystroke."
	},
	{
		name: "onSearchEvent",
		type: "(value: string) => void",
		description: "Fires once typing has stopped for `timeout` — this is the one to run the search on."
	},
	{
		name: "onSuggestionSelect",
		type: "(suggestion: SearchSuggestion) => void",
		description: "Fires with whichever suggestion was picked."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the field."
	},
	{
		name: "showSuggestions",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — hands the field two groups of suggestions."
	},
	...validationProps()
];

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
				<ComponentDoc
					title="Search Input"
					description="A keyword field that waits for typing to stop before it reports — the timeout is what keeps a search from firing on every keystroke. It can also drop a list of suggestions under itself, grouped where that helps."
					name="SearchInput"
					previewHeight={200}
					previewCentered={false}
					imports={["SearchSuggestionGroup"]}
					interfaces={[SEARCH_SUGGESTION_INTERFACE]}
					props={SEARCH_INPUT_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "420px"}}>
							<SearchInput
								value={values.value}
								label={values.label}
								icon={values.icon}
								deletable={values.deletable}
								timeout={values.timeout}
								suggestionGroups={values.showSuggestions ? DEMO_SUGGESTIONS : undefined}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></SearchInput>
						</div>
					)}>
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
				</ComponentDoc>
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