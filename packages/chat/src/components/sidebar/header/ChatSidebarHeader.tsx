import React, { useState } from "react";

import './ChatSidebarHeader.css';

interface ChatSidebarHeaderProps {
    children?: React.ReactNode;
    onNewChat?: () => void;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    showSearch?: boolean;
    showNewChat?: boolean;
}

export const ChatSidebarHeader: React.FC<ChatSidebarHeaderProps> = ({
    children,
    onNewChat,
    onSearch,
    searchPlaceholder = "Search conversations...",
    showSearch = true,
    showNewChat = true
}) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleClearSearch = () => {
        setSearchValue("");
        if (onSearch) {
            onSearch("");
        }
    };

    return (
        <div className="blue-orange-chat-sidebar-header-container">
            <div className="blue-orange-chat-sidebar-header-top-row">
                <div className="blue-orange-chat-sidebar-header-actions">
                    {children}
                </div>
                {showNewChat && (
                    <button
                        className="blue-orange-chat-sidebar-header-new-chat-btn"
                        onClick={onNewChat}
                        title="New Chat"
                    >
                        <i className="ri-edit-box-line"></i>
                    </button>
                )}
            </div>
            {showSearch && (
                <div className="blue-orange-chat-sidebar-header-search">
                    <i className="ri-search-line blue-orange-chat-sidebar-header-search-icon"></i>
                    <input
                        type="text"
                        className="blue-orange-chat-sidebar-header-search-input"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    {searchValue.length > 0 && (
                        <button
                            className="blue-orange-chat-sidebar-header-search-clear"
                            onClick={handleClearSearch}
                            title="Clear search"
                        >
                            <i className="ri-close-line"></i>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
