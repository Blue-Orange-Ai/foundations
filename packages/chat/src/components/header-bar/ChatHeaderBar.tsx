import React from "react";
import {
    SearchInput,
    SearchSuggestion,
    SearchSuggestionGroup,
} from "@blue-orange-ai/foundations-core";

import "./ChatHeaderBar.css";

interface Props {
    canUndo?: boolean;
    canRedo?: boolean;
    onUndo?: () => void;
    onRedo?: () => void;
    onSearch?: (value: string) => void;
    searchPlaceholder?: string;
    suggestionGroups?: SearchSuggestionGroup[];
    onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
    onHelpClick?: () => void;
    onLogoutClick?: () => void;
}

export const ChatHeaderBar: React.FC<Props> = ({
    canUndo = false,
    canRedo = false,
    onUndo,
    onRedo,
    onSearch,
    searchPlaceholder = "Search",
    suggestionGroups,
    onSuggestionSelect,
    onHelpClick,
    onLogoutClick,
}) => {
    return (
        <div className="blue-orange-chat-header-bar">
            <div className="blue-orange-chat-header-bar-left">
                <button
                    type="button"
                    className="blue-orange-chat-header-bar-btn"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Back"
                    aria-label="Back"
                >
                    <i className="ri-arrow-left-s-line" />
                </button>
                <button
                    type="button"
                    className="blue-orange-chat-header-bar-btn"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Forward"
                    aria-label="Forward"
                >
                    <i className="ri-arrow-right-s-line" />
                </button>
            </div>
            <div className="blue-orange-chat-header-bar-center">
                <SearchInput
                    label={searchPlaceholder}
                    icon="ri-search-line"
                    timeout={0}
                    onChange={onSearch}
                    onSearchEvent={onSearch}
                    suggestionGroups={suggestionGroups}
                    onSuggestionSelect={onSuggestionSelect}
                />
            </div>
            <div className="blue-orange-chat-header-bar-right">
                <button
                    type="button"
                    className="blue-orange-chat-header-bar-btn"
                    onClick={onHelpClick}
                    title="Help"
                    aria-label="Help"
                >
                    <i className="ri-question-line" />
                </button>
                <button
                    type="button"
                    className="blue-orange-chat-header-bar-btn"
                    onClick={onLogoutClick}
                    title="Log out"
                    aria-label="Log out"
                >
                    <i className="ri-logout-box-r-line" />
                </button>
            </div>
        </div>
    );
};
