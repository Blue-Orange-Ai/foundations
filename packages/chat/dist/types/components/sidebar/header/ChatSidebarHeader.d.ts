import React from "react";
import { SideBarState } from "@blue-orange-ai/foundations-core";
import { Media } from "@blue-orange-ai/foundations-clients";
import './ChatSidebarHeader.css';
interface ChatSidebarHeaderProps {
    workspaceName: string;
    workspaceMedia?: Media;
    sidebarState: SideBarState;
    onStateChange?: (state: SideBarState) => void;
    onNewChat?: () => void;
    onWorkspaceClick?: () => void;
}
export declare const ChatSidebarHeader: React.FC<ChatSidebarHeaderProps>;
export {};
