import React from "react";
import { SideBarBodyItem, Avatar } from "@blue-orange-ai/foundations-core";
import { IChatConversation, ChatConversationType, ChatUserStatus } from "../../../interfaces/ChatInterfaces";

import './ChatSidebarItem.css';

const getStatusClass = (status: ChatUserStatus): string => {
    switch (status) {
        case ChatUserStatus.ONLINE:
            return 'blue-orange-chat-sidebar-item-status-online';
        case ChatUserStatus.AWAY:
            return 'blue-orange-chat-sidebar-item-status-away';
        case ChatUserStatus.DND:
            return 'blue-orange-chat-sidebar-item-status-dnd';
        case ChatUserStatus.OFFLINE:
        default:
            return 'blue-orange-chat-sidebar-item-status-offline';
    }
};

export const getConversationIcon = (conversation: IChatConversation): React.ReactNode => {
    if (conversation.type === ChatConversationType.CHANNEL) {
        return <i className="ri-hashtag blue-orange-chat-sidebar-item-channel-icon" />;
    }

    // Group DM — group icon
    if (conversation.type === ChatConversationType.GROUP) {
        return <i className="ri-group-line blue-orange-chat-sidebar-item-channel-icon" />;
    }

    // DM — show avatar with presence status overlay
    if (conversation.type === ChatConversationType.DM) {
        const otherMember = conversation.members.length >= 2
            ? conversation.members[1]
            : conversation.members[0];

        if (otherMember) {
            const statusClass = getStatusClass(otherMember.status);
            return (
                <div className="blue-orange-chat-sidebar-item-avatar-wrapper">
                    <Avatar user={otherMember.user} height={20} width={20} />
                    <span className={`blue-orange-chat-sidebar-item-avatar-status ${statusClass}`} />
                </div>
            );
        }
    }

    return <i className="ri-chat-1-line" />;
};

export const getConversationBadge = (conversation: IChatConversation): React.ReactNode | undefined => {
    const hasUnread = conversation.unreadCount > 0;
    const isTyping = conversation.typingUsers && conversation.typingUsers.length > 0;

    if (hasUnread) {
        return (
            <span className="blue-orange-chat-sidebar-item-unread-badge">
                {conversation.unreadCount}
            </span>
        );
    }

    if (isTyping) {
        return (
            <span className="blue-orange-chat-sidebar-item-typing-badge">
                <span className="blue-orange-chat-sidebar-item-typing-dot" />
                <span className="blue-orange-chat-sidebar-item-typing-dot" />
                <span className="blue-orange-chat-sidebar-item-typing-dot" />
            </span>
        );
    }

    return undefined;
};

export const getConversationLabelStyle = (conversation: IChatConversation): React.CSSProperties => {
    return conversation.unreadCount > 0
        ? { fontWeight: 700, color: '#ffffff' }
        : {};
};

interface Props {
    conversation: IChatConversation;
    active?: boolean;
    onClick?: (conversation: IChatConversation) => void;
    onContextMenu?: (e: React.MouseEvent, conversation: IChatConversation) => void;
}

export const ChatSidebarItem: React.FC<Props> = ({
    conversation,
    active = false,
    onClick,
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(conversation);
        }
    };

    const hasUnread = conversation.unreadCount > 0;

    return (
        <SideBarBodyItem
            label={conversation.name}
            active={active}
            focused={false}
            icon={getConversationIcon(conversation)}
            badge={getConversationBadge(conversation)}
            defaultStyle={getConversationLabelStyle(conversation)}
            activeStyle={{ fontWeight: hasUnread ? 700 : 400, color: '#ffffff' }}
            onClick={handleClick}
        />
    );
};
