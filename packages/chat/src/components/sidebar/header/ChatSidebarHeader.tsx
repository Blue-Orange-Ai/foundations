import React from "react";
import {
    SideBarHeaderItem,
    SideBarState,
    ButtonIcon
} from "@blue-orange-ai/foundations-core";
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

export const ChatSidebarHeader: React.FC<ChatSidebarHeaderProps> = ({
    workspaceName,
    workspaceMedia,
    sidebarState,
    onStateChange,
    onNewChat,
    onWorkspaceClick
}) => {
    return (
        <SideBarHeaderItem
            label={workspaceName}
            labelStyle={{ fontWeight: 700, fontSize: '16px' }}
            state={sidebarState}
            media={workspaceMedia}
            headerItemClicked={onWorkspaceClick}
            changeState={onStateChange}
            action={
                onNewChat ? (
                    <ButtonIcon
                        icon="ri-edit-box-line"
                        onClick={onNewChat}
                    />
                ) : undefined
            }
        />
    );
};
