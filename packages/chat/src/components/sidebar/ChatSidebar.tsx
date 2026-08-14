import React, { createContext, useContext, useState } from "react";
import {
    SideBar,
    SideBarState,
    SideBarHeader,
    SideBarBody,
    SideBarFooter,
    Input
} from "@blue-orange-ai/foundations-core";

import './ChatSidebar.css';

export { SideBarState as ChatSidebarState };

interface ChatSidebarContextValue {
    filterQuery: string;
}

export const ChatSidebarContext = createContext<ChatSidebarContextValue>({ filterQuery: '' });

export const useChatSidebarFilter = () => useContext(ChatSidebarContext);

interface ChatSidebarProps {
    header: React.ReactNode;
    footer: React.ReactNode;
    navItems?: React.ReactNode;
    /** Consumer supplied entries rendered between the nav items and the conversation groups */
    customItems?: React.ReactNode;
    children: React.ReactNode;
    state: SideBarState;
    onStateChange?: (state: SideBarState) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    header,
    footer,
    navItems,
    customItems,
    children,
    state,
    onStateChange
}) => {
    const [filterQuery, setFilterQuery] = useState('');

    return (
        <ChatSidebarContext.Provider value={{ filterQuery }}>
            <div className="blue-orange-chat-sidebar-wrapper">
                <SideBar
                    state={state}
                    changeState={onStateChange}
                    resizable={true}
                    filter={false}
                >
                    <SideBarHeader>
                        {header}
                    </SideBarHeader>
                    <SideBarBody>
                        {state === SideBarState.OPEN && (
                            <div className="blue-orange-sidebar-body-filter">
                                <Input
                                    value={filterQuery}
                                    placeholder={"Filter..."}
                                    style={{height: "32px", fontSize: "14px"}}
                                    onChange={setFilterQuery}
                                />
                            </div>
                        )}
                        {navItems}
                        {customItems}
                        {children}
                    </SideBarBody>
                    <SideBarFooter>
                        {footer}
                    </SideBarFooter>
                </SideBar>
            </div>
        </ChatSidebarContext.Provider>
    );
};
