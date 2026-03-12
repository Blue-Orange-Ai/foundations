import React, { useState, useEffect, useContext } from "react";
import {
    SideBarBodyLabel,
    SideBarBodyItem,
} from "@blue-orange-ai/foundations-core";
import {
    getConversationIcon,
    getConversationBadge,
    getConversationLabelStyle
} from "../item/ChatSidebarItem";
import { IChatConversation } from "../../../interfaces/ChatInterfaces";
import { ChatSidebarContext } from "../ChatSidebar";

import './ChatSidebarGroup.css';

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
    const { filterQuery } = useContext(ChatSidebarContext);

    const filteredConversations = filterQuery.trim()
        ? conversations.filter(c =>
            c.name.toLowerCase().includes(filterQuery.trim().toLowerCase())
        )
        : conversations;

    const [isOpen, setIsOpen] = useState(!collapsed);

    useEffect(() => {
        setIsOpen(!collapsed);
    }, [collapsed]);

    const handleToggle = () => {
        const next = !isOpen;
        setIsOpen(next);
        if (onToggle) {
            onToggle();
        }
    };

    const caretClass = isOpen
        ? "ri-arrow-down-s-line"
        : "ri-arrow-right-s-line";

    const rightContent = (
        <span className="blue-orange-chat-sidebar-group-right">
            {onCreateNew && (
                <span
                    className="blue-orange-chat-sidebar-group-add-btn"
                    onClick={(e) => { e.stopPropagation(); onCreateNew(); }}
                >
                    <i className="ri-add-line" />
                </span>
            )}
            <i className={`${caretClass} blue-orange-chat-sidebar-group-caret`} />
        </span>
    );

    return (
        <div className="blue-orange-chat-sidebar-group">
            <SideBarBodyLabel
                label={label}
                icon={icon ? <i className={`${icon} blue-orange-chat-sidebar-group-icon`} /> : undefined}
                onClick={handleToggle}
                rightItems={rightContent}
            />
            {isOpen && filteredConversations.map(conversation => {
                const isActive = activeConversationId === conversation.id;
                const hasUnread = conversation.unreadCount > 0;

                return (
                    <SideBarBodyItem
                        key={conversation.id}
                        label={conversation.name}
                        active={isActive}
                        focused={false}
                        icon={getConversationIcon(conversation)}
                        badge={getConversationBadge(conversation)}
                        defaultStyle={getConversationLabelStyle(conversation)}
                        activeStyle={{ fontWeight: hasUnread ? 700 : 400, color: '#ffffff' }}
                        onClick={onConversationClick ? () => onConversationClick(conversation) : undefined}
                    />
                );
            })}
        </div>
    );
};
