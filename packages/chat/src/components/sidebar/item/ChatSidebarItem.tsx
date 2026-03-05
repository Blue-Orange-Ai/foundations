import React from "react";

import './ChatSidebarItem.css';
import {Avatar, AvatarList} from "@blue-orange-ai/foundations-core";
import {IChatConversation, ChatConversationType} from "../../../interfaces/ChatInterfaces";

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
    onContextMenu
}) => {

    const handleClick = () => {
        if (onClick) {
            onClick(conversation);
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        if (onContextMenu) {
            e.preventDefault();
            onContextMenu(e, conversation);
        }
    };

    const isTyping = conversation.typingUsers && conversation.typingUsers.length > 0;
    const hasUnread = conversation.unreadCount > 0;
    const isDM = conversation.type === ChatConversationType.DM;

    const lastMessagePreview = conversation.lastMessage
        ? conversation.lastMessage.content
        : "";

    const containerClassName = [
        "blue-orange-chat-sidebar-item",
        active ? "blue-orange-chat-sidebar-item-active" : ""
    ].filter(Boolean).join(" ");

    const nameClassName = [
        "blue-orange-chat-sidebar-item-name",
        hasUnread ? "blue-orange-chat-sidebar-item-name-unread" : ""
    ].filter(Boolean).join(" ");

    return (
        <div
            className={containerClassName}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
        >
            {/* LEFT: Avatar area */}
            <div className="blue-orange-chat-sidebar-item-avatar">
                {isDM ? (
                    <Avatar
                        user={conversation.members[0]?.user}
                        height={36}
                        width={36}
                    />
                ) : (
                    <AvatarList
                        users={conversation.members.map(m => m.user)}
                        height={36}
                        overflowNum={3}
                    />
                )}
                {isTyping && (
                    <div className="blue-orange-chat-sidebar-item-typing-overlay">
                        <div className="blue-orange-chat-sidebar-item-typing-dot" />
                        <div className="blue-orange-chat-sidebar-item-typing-dot" />
                        <div className="blue-orange-chat-sidebar-item-typing-dot" />
                    </div>
                )}
            </div>

            {/* MIDDLE: Name and preview */}
            <div className="blue-orange-chat-sidebar-item-content">
                <div className={nameClassName}>
                    {conversation.name}
                </div>
                {lastMessagePreview && (
                    <div className="blue-orange-chat-sidebar-item-preview">
                        {lastMessagePreview}
                    </div>
                )}
            </div>

            {/* RIGHT: Unread pill */}
            {hasUnread && (
                <div className="blue-orange-chat-sidebar-item-right">
                    <div className="blue-orange-chat-sidebar-item-unread-pill">
                        {conversation.unreadCount}
                    </div>
                </div>
            )}
        </div>
    );
};
