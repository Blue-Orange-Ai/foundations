import React, { useState, useEffect, useContext } from "react";
import {
    SideBarBodyLabel,
    SideBarBodyItem,
    ContextMenu,
    IContextMenuItem,
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
    groupContextMenuItems?: IContextMenuItem[];
    onGroupContextMenuClick?: (item: IContextMenuItem) => void;
    conversationContextMenuItems?: (conversation: IChatConversation) => IContextMenuItem[];
    onConversationContextMenuClick?: (item: IContextMenuItem, conversation: IChatConversation) => void;
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
    onConversationContextMenu,
    groupContextMenuItems,
    onGroupContextMenuClick,
    conversationContextMenuItems,
    onConversationContextMenuClick
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

    const handleToggle = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest('.blue-orange-chat-sidebar-group-action-btn')) {
            return;
        }
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

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    const hasUnread = !isOpen && totalUnread > 0;

    const moreActionBtn = (
        <span
            className="blue-orange-chat-sidebar-group-action-btn"
            onClick={(e) => { if (onMoreActions) onMoreActions(e); }}
        >
            <i className="ri-more-fill" />
        </span>
    );

    const rightContent = (
        <span className="blue-orange-chat-sidebar-group-right">
            {hasUnread && (
                <span className="blue-orange-chat-sidebar-group-unread-badge">
                    {totalUnread}
                </span>
            )}
            {onCreateNew && (
                <span
                    className="blue-orange-chat-sidebar-group-action-btn"
                    onClick={(e) => { e.stopPropagation(); onCreateNew(); }}
                >
                    <i className="ri-add-line" />
                </span>
            )}
            {groupContextMenuItems && groupContextMenuItems.length > 0 ? (
                <ContextMenu
                    items={groupContextMenuItems}
                    onClick={onGroupContextMenuClick}
                >
                    {moreActionBtn}
                </ContextMenu>
            ) : moreActionBtn}
        </span>
    );

    const labelStyle: React.CSSProperties | undefined = hasUnread
        ? { fontWeight: 700, color: '#ffffff' }
        : undefined;

    const groupLabel = (
        <div onClick={handleToggle}>
            <SideBarBodyLabel
                label={label}
                icon={iconWithChevron}
                style={labelStyle}
                rightItems={rightContent}
            />
        </div>
    );

    return (
        <div className="blue-orange-chat-sidebar-group">
            {groupLabel}
            {isOpen && filteredConversations.map(conversation => {
                const isActive = activeConversationId === conversation.id;
                const hasUnreadItem = conversation.unreadCount > 0;
                const itemContextMenuItems = conversationContextMenuItems
                    ? conversationContextMenuItems(conversation)
                    : undefined;

                const conversationItem = (
                    <SideBarBodyItem
                        key={conversation.id}
                        label={conversation.name}
                        active={isActive}
                        focused={false}
                        icon={getConversationIcon(conversation)}
                        badge={getConversationBadge(conversation)}
                        defaultStyle={getConversationLabelStyle(conversation)}
                        activeStyle={{ fontWeight: hasUnreadItem ? 700 : 400, color: '#ffffff' }}
                        onClick={onConversationClick ? () => onConversationClick(conversation) : undefined}
                    />
                );

                if (itemContextMenuItems && itemContextMenuItems.length > 0) {
                    return (
                        <ContextMenu
                            key={conversation.id}
                            items={itemContextMenuItems}
                            onClick={(item) => onConversationContextMenuClick?.(item, conversation)}
                            rightClick={true}
                        >
                            {conversationItem}
                        </ContextMenu>
                    );
                }

                return conversationItem;
            })}
        </div>
    );
};
