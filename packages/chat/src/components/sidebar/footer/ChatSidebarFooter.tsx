import React from "react";
import {Avatar} from "@blue-orange-ai/foundations-core";
import {IChatUser, ChatUserStatus} from "../../../interfaces/ChatInterfaces";

import './ChatSidebarFooter.css';

interface Props {
    user: IChatUser;
    onStatusChange?: (status: ChatUserStatus) => void;
    onSettingsClick?: () => void;
    onProfileClick?: () => void;
    collapsed?: boolean;
}

const statusDotClass: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: "blue-orange-chat-sidebar-footer-status-online",
    [ChatUserStatus.AWAY]: "blue-orange-chat-sidebar-footer-status-away",
    [ChatUserStatus.DND]: "blue-orange-chat-sidebar-footer-status-dnd",
    [ChatUserStatus.OFFLINE]: "blue-orange-chat-sidebar-footer-status-offline",
};

const statusLabel: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: "Online",
    [ChatUserStatus.AWAY]: "Away",
    [ChatUserStatus.DND]: "Do Not Disturb",
    [ChatUserStatus.OFFLINE]: "Offline",
};

export const ChatSidebarFooter: React.FC<Props> = ({
    user,
    onStatusChange,
    onSettingsClick,
    onProfileClick,
    collapsed = false,
}) => {
    const isSnoozed = user.snoozeUntil && new Date(user.snoozeUntil) > new Date();

    const containerClasses = [
        "blue-orange-chat-sidebar-footer-container",
        collapsed ? "blue-orange-chat-sidebar-footer-collapsed" : "",
    ].filter(Boolean).join(" ");

    return (
        <div className={containerClasses}>
            <div
                className="blue-orange-chat-sidebar-footer-avatar-wrapper"
                onClick={onProfileClick}
            >
                <Avatar user={user.user} height={36} width={36} />
                <span
                    className={`blue-orange-chat-sidebar-footer-status-dot ${statusDotClass[user.status]}`}
                />
            </div>

            {!collapsed && (
                <>
                    <div className="blue-orange-chat-sidebar-footer-info">
                        <span className="blue-orange-chat-sidebar-footer-name">
                            {user.user.name}
                        </span>
                        <span className="blue-orange-chat-sidebar-footer-status-text">
                            {statusLabel[user.status]}
                            {isSnoozed && " (Snoozed)"}
                        </span>
                    </div>

                    <button
                        className="blue-orange-chat-sidebar-footer-settings-btn"
                        onClick={onSettingsClick}
                        type="button"
                    >
                        <i className="ri-settings-3-line" />
                    </button>
                </>
            )}
        </div>
    );
};
