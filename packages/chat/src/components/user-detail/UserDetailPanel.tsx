import React from "react";
import {Avatar} from "@blue-orange-ai/foundations-core";
import {ChatUserStatus, IChatUser} from "../../interfaces/ChatInterfaces";

import './UserDetailPanel.css';

interface Props {
    chatUser: IChatUser;
    onClose: () => void;
    children?: React.ReactNode;
}

const statusLabel: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: "Online",
    [ChatUserStatus.AWAY]: "Away",
    [ChatUserStatus.DND]: "Do Not Disturb",
    [ChatUserStatus.OFFLINE]: "Offline",
};

const statusColorClass: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: "blue-orange-chat-user-detail-status-dot--online",
    [ChatUserStatus.AWAY]: "blue-orange-chat-user-detail-status-dot--away",
    [ChatUserStatus.DND]: "blue-orange-chat-user-detail-status-dot--dnd",
    [ChatUserStatus.OFFLINE]: "blue-orange-chat-user-detail-status-dot--offline",
};

export const UserDetailPanel: React.FC<Props> = ({chatUser, onClose, children}) => {

    const isSnoozed = chatUser.snoozeUntil && new Date(chatUser.snoozeUntil) > new Date();

    const formatSnoozeTime = (date: Date): string => {
        const d = new Date(date);
        return d.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const formatPhone = (phone: { number?: string | null; code?: string | null } | undefined): string | null => {
        if (!phone || !phone.number) return null;
        return phone.code ? `+${phone.code} ${phone.number}` : phone.number;
    };

    return (
        <div className="blue-orange-chat-user-detail">
            <div className="blue-orange-chat-user-detail-header">
                <span className="blue-orange-chat-user-detail-header-title">Profile</span>
                <div className="blue-orange-chat-user-detail-close-btn" onClick={onClose}>
                    <i className="ri-close-line"></i>
                </div>
            </div>

            <div className="blue-orange-chat-user-detail-body">
                <div className="blue-orange-chat-user-detail-avatar">
                    <Avatar user={chatUser.user} height={120} width={120} />
                </div>

                <h2 className="blue-orange-chat-user-detail-name">{chatUser.user.name}</h2>

                <div className="blue-orange-chat-user-detail-status">
                    <span className={`blue-orange-chat-user-detail-status-dot ${statusColorClass[chatUser.status]}`}></span>
                    <span className="blue-orange-chat-user-detail-status-text">{statusLabel[chatUser.status]}</span>
                </div>

                <div className="blue-orange-chat-user-detail-info">
                    {chatUser.user.email && (
                        <div className="blue-orange-chat-user-detail-info-row">
                            <span className="blue-orange-chat-user-detail-info-label">Email</span>
                            <span className="blue-orange-chat-user-detail-info-value">{chatUser.user.email}</span>
                        </div>
                    )}
                    {chatUser.user.username && (
                        <div className="blue-orange-chat-user-detail-info-row">
                            <span className="blue-orange-chat-user-detail-info-label">Username</span>
                            <span className="blue-orange-chat-user-detail-info-value">{chatUser.user.username}</span>
                        </div>
                    )}
                    {formatPhone(chatUser.user.telephone) && (
                        <div className="blue-orange-chat-user-detail-info-row">
                            <span className="blue-orange-chat-user-detail-info-label">Phone</span>
                            <span className="blue-orange-chat-user-detail-info-value">{formatPhone(chatUser.user.telephone)}</span>
                        </div>
                    )}
                </div>

                {isSnoozed && chatUser.snoozeUntil && (
                    <div className="blue-orange-chat-user-detail-snooze">
                        <i className="ri-notification-off-line"></i>
                        <span>Notifications snoozed until {formatSnoozeTime(chatUser.snoozeUntil)}</span>
                    </div>
                )}

                {children && (
                    <div className="blue-orange-chat-user-detail-custom">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};
