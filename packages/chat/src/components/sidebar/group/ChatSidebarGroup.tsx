import React from "react";

import './ChatSidebarGroup.css';
import {ChatSidebarItem} from "../item/ChatSidebarItem";
import {IChatConversation} from "../../../interfaces/ChatInterfaces";

interface Props {
    label: string;
    conversations: IChatConversation[];
    collapsed?: boolean;
    onToggle?: () => void;
    onCreateNew?: () => void;
    icon?: string;
    activeConversationId?: string;
    onConversationClick?: (conversation: IChatConversation) => void;
    onConversationContextMenu?: (e: React.MouseEvent, conversation: IChatConversation) => void;
}

export const ChatSidebarGroup: React.FC<Props> = ({
    label,
    conversations,
    collapsed = false,
    onToggle,
    onCreateNew,
    icon,
    activeConversationId,
    onConversationClick,
    onConversationContextMenu
}) => {

    const sortedConversations = [...conversations].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );

    const chevronClass = collapsed
        ? "ri-arrow-right-s-line"
        : "ri-arrow-down-s-line";

    const bodyClassName = [
        "blue-orange-chat-sidebar-group-body",
        collapsed ? "blue-orange-chat-sidebar-group-body-collapsed" : ""
    ].filter(Boolean).join(" ");

    const handleHeaderClick = () => {
        if (onToggle) {
            onToggle();
        }
    };

    const handleCreateNew = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onCreateNew) {
            onCreateNew();
        }
    };

    return (
        <div className="blue-orange-chat-sidebar-group">
            <div className="blue-orange-chat-sidebar-group-header" onClick={handleHeaderClick}>
                <div className="blue-orange-chat-sidebar-group-chevron">
                    <i className={chevronClass} />
                </div>
                {icon && (
                    <div className="blue-orange-chat-sidebar-group-icon">
                        <i className={icon} />
                    </div>
                )}
                <div className="blue-orange-chat-sidebar-group-label">
                    {label}
                </div>
                {onCreateNew && (
                    <button
                        className="blue-orange-chat-sidebar-group-add"
                        onClick={handleCreateNew}
                    >
                        <i className="ri-add-line" />
                    </button>
                )}
            </div>
            <div className={bodyClassName}>
                {sortedConversations.map(conversation => (
                    <ChatSidebarItem
                        key={conversation.id}
                        conversation={conversation}
                        active={activeConversationId === conversation.id}
                        onClick={onConversationClick}
                        onContextMenu={onConversationContextMenu}
                    />
                ))}
            </div>
        </div>
    );
};
