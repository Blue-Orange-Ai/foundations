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
    onMoreActions?: (e: React.MouseEvent) => void;
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
    onMoreActions,
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

    const iconWithChevron = icon ? (
        <span className="blue-orange-chat-sidebar-group-icon-wrapper">
            <i className={`${icon} blue-orange-chat-sidebar-group-icon`} />
            <i className={`${caretClass} blue-orange-chat-sidebar-group-caret`} />
        </span>
    ) : (
        <span className="blue-orange-chat-sidebar-group-icon-wrapper">
            <i className={`${caretClass} blue-orange-chat-sidebar-group-caret blue-orange-chat-sidebar-group-caret-always`} />
        </span>
    );

    const rightContent = (
        <span className="blue-orange-chat-sidebar-group-right">
            {onCreateNew && (
                <span
                    className="blue-orange-chat-sidebar-group-action-btn"
                    onClick={(e) => { e.stopPropagation(); onCreateNew(); }}
                >
                    <i className="ri-add-line" />
                </span>
            )}
            <span
                className="blue-orange-chat-sidebar-group-action-btn"
                onClick={(e) => { e.stopPropagation(); if (onMoreActions) onMoreActions(e); }}
            >
                <i className="ri-more-fill" />
            </span>
        </span>
    );

    return (
        <div className="blue-orange-chat-sidebar-group" onClick={handleToggle}>
            <SideBarBodyLabel
                label={label}
                icon={iconWithChevron}
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
