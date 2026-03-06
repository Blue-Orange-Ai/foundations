import React from "react";
import {
    SideBar,
    SideBarState,
    SideBarHeader,
    SideBarBody,
    SideBarFooter
} from "@blue-orange-ai/foundations-core";

import './ChatSidebar.css';

export { SideBarState as ChatSidebarState };

interface ChatSidebarProps {
    header: React.ReactNode;
    footer: React.ReactNode;
    navItems?: React.ReactNode;
    children: React.ReactNode;
    state: SideBarState;
    onStateChange?: (state: SideBarState) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    header,
    footer,
    navItems,
    children,
    state,
    onStateChange
}) => {
    return (
        <div className="blue-orange-chat-sidebar-wrapper">
            <SideBar
                state={state}
                changeState={onStateChange}
                resizable={true}
                filter={true}
            >
                <SideBarHeader>
                    {header}
                </SideBarHeader>
                <SideBarBody>
                    {navItems}
                    {children}
                </SideBarBody>
                <SideBarFooter>
                    {footer}
                </SideBarFooter>
            </SideBar>
        </div>
    );
};
