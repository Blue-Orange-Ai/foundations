import React from "react";
import { Avatar } from "@blue-orange-ai/foundations-core";
import { IChatUser, ChatUserStatus } from "../../../interfaces/ChatInterfaces";
import { DEFAULT_STATUS_EMOJI } from "../../user-settings/UserSettingsView";

import './ChatSidebarFooter.css';

interface Props {
    user: IChatUser;
    onStatusChange?: (status: ChatUserStatus) => void;
    onSettingsClick?: () => void;
    onProfileClick?: () => void;
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
}) => {
    const emoji = user.statusEmoji || DEFAULT_STATUS_EMOJI[user.status];
    const label = user.statusText || statusLabel[user.status];

    return (
        <div className="blue-orange-chat-sidebar-footer-container">
            <div
                className="blue-orange-chat-sidebar-footer-avatar-wrapper"
                onClick={onProfileClick}
            >
                <Avatar user={user.user} height={28} width={28} />
                <span
                    className={`blue-orange-chat-sidebar-footer-status-dot ${statusDotClass[user.status]}`}
                    tabIndex={0}
                >
                    <span className="blue-orange-chat-sidebar-footer-status-popover" role="tooltip">
                        <span
                            className="blue-orange-chat-sidebar-footer-status-popover-emoji"
                            dangerouslySetInnerHTML={{ __html: emoji }}
                        />
                        <span className="blue-orange-chat-sidebar-footer-status-popover-label">
                            {label}
                        </span>
                    </span>
                </span>
            </div>
            <div className="blue-orange-chat-sidebar-footer-info">
                <span className="blue-orange-chat-sidebar-footer-name">
                    {user.user.name}
                </span>
            </div>
            <button
                className="blue-orange-chat-sidebar-footer-settings-btn"
                onClick={onSettingsClick}
                type="button"
            >
                <i className="ri-settings-3-line" />
            </button>
        </div>
    );
};
