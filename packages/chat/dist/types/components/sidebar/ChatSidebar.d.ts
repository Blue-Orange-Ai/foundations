import React from "react";
import { SideBarState } from "@blue-orange-ai/foundations-core";
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
export declare const ChatSidebar: React.FC<ChatSidebarProps>;
