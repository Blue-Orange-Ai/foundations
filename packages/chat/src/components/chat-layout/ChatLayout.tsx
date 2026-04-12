import React, { useState, useCallback } from 'react';
import {
    SideBarState,
    SideBarBodyItem,
    VerticalSplitPage,
    SplitPageMajor,
    SplitPageMinor,
    SplitDirectionVerticalPage,
    IContextMenuItem,
} from '@blue-orange-ai/foundations-core';
import {
    IChatGroup,
    IChatMessage,
    IChatUser,
    IChatConversation,
    IChatNavItem,
    ChatUserStatus
} from '../../interfaces/ChatInterfaces';
import { ChatSidebar } from '../sidebar/ChatSidebar';
import { ChatSidebarHeader } from '../sidebar/header/ChatSidebarHeader';
import { ChatSidebarGroup } from '../sidebar/group/ChatSidebarGroup';
import { ChatSidebarFooter } from '../sidebar/footer/ChatSidebarFooter';
import { ChatWindow } from '../chat-window/ChatWindow';
import { ChatMessage } from '../chat-window/message/ChatMessage';
import { DateSeparator } from '../chat-window/date-separator/DateSeparator';
import { MessageReactions } from '../chat-window/message/reactions/MessageReactions';
import { ChatInput } from '../chat-input/ChatInput';
import { UserDetailPanel } from '../user-detail/UserDetailPanel';
import { ThreadPanel } from '../thread-panel/ThreadPanel';
import { shouldShowDateSeparator } from '../../utils/dateUtils';
import { Media } from '@blue-orange-ai/foundations-clients';

import './ChatLayout.css';

interface ChatLayoutProps {
    groups: IChatGroup[];
    messages: IChatMessage[];
    currentUser: IChatUser;
    activeConversation?: IChatConversation;
    typingUsers?: IChatUser[];
    snoozedUsers?: IChatUser[];
    workspaceName?: string;
    workspaceMedia?: Media;
    navItems?: IChatNavItem[];
    activeNavItemId?: string;
    sidebarState?: SideBarState;
    onSidebarStateChange?: (state: SideBarState) => void;
    onConversationClick?: (conversation: IChatConversation) => void;
    onSendMessage?: (content: string, mentions: string[], attachments: any[]) => void;
    onLoadMoreMessages?: () => void;
    hasMoreMessages?: boolean;
    loadingMessages?: boolean;
    onNewChat?: () => void;
    onSearch?: (query: string) => void;
    onStatusChange?: (status: ChatUserStatus) => void;
    onSettingsClick?: () => void;
    onProfileClick?: () => void;
    onWorkspaceClick?: () => void;
    onReactToMessage?: (message: IChatMessage, emoji: string) => void;
    onReplyToMessage?: (message: IChatMessage) => void;
    onEditMessage?: (message: IChatMessage, newContent: string) => void;
    onAvatarClick?: (user: IChatUser) => void;
    threadParentMessage?: IChatMessage;
    threadReplies?: IChatMessage[];
    onSendThreadReply?: (content: string, mentions: string[], attachments: any[]) => void;
    onCloseThread?: () => void;
    threadTypingUsers?: IChatUser[];
    detailUser?: IChatUser;
    onCloseUserDetail?: () => void;
    onGroupToggle?: (label: string) => void;
    onGroupCreateNew?: (label: string) => void;
    onConversationContextMenu?: (e: React.MouseEvent, conversation: IChatConversation) => void;
    groupContextMenuItems?: IContextMenuItem[];
    onGroupContextMenuClick?: (item: IContextMenuItem, groupLabel: string) => void;
    conversationContextMenuItems?: (conversation: IChatConversation) => IContextMenuItem[];
    onConversationContextMenuClick?: (item: IContextMenuItem, conversation: IChatConversation) => void;
}

const CONSECUTIVE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export const ChatLayout: React.FC<ChatLayoutProps> = ({
    groups,
    messages,
    currentUser,
    activeConversation,
    typingUsers = [],
    snoozedUsers = [],
    workspaceName = 'Chat',
    workspaceMedia,
    navItems = [],
    activeNavItemId,
    sidebarState = SideBarState.OPEN,
    onSidebarStateChange,
    onConversationClick,
    onSendMessage,
    onLoadMoreMessages,
    hasMoreMessages = false,
    loadingMessages = false,
    onNewChat,
    onSearch,
    onStatusChange,
    onSettingsClick,
    onProfileClick,
    onWorkspaceClick,
    onReactToMessage,
    onReplyToMessage,
    onEditMessage,
    onAvatarClick,
    threadParentMessage,
    threadReplies = [],
    onSendThreadReply,
    onCloseThread,
    threadTypingUsers = [],
    detailUser,
    onCloseUserDetail,
    onGroupToggle,
    onGroupCreateNew,
    onConversationContextMenu,
    groupContextMenuItems,
    onGroupContextMenuClick,
    conversationContextMenuItems,
    onConversationContextMenuClick
}) => {
    const [replyTo, setReplyTo] = useState<IChatMessage | null>(null);

    const handleReply = useCallback((message: IChatMessage) => {
        if (onReplyToMessage) {
            onReplyToMessage(message);
        } else {
            setReplyTo(message);
        }
    }, [onReplyToMessage]);

    const handleCancelReply = useCallback(() => {
        setReplyTo(null);
    }, []);

    const handleSend = useCallback((content: string, mentions: string[], attachments: any[]) => {
        if (onSendMessage) {
            onSendMessage(content, mentions, attachments);
        }
        setReplyTo(null);
    }, [onSendMessage]);

    const handleLoadMore = useCallback(() => {
        if (onLoadMoreMessages) {
            onLoadMoreMessages();
        }
    }, [onLoadMoreMessages]);

    const isConsecutive = (message: IChatMessage, prevMessage: IChatMessage | null): boolean => {
        if (!prevMessage) return false;
        if (prevMessage.sender.user.id !== message.sender.user.id) return false;
        const timeDiff = new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime();
        if (timeDiff > CONSECUTIVE_THRESHOLD_MS) return false;
        if (shouldShowDateSeparator(message.timestamp, prevMessage.timestamp)) return false;
        return true;
    };

    const renderMessages = () => {
        const elements: React.ReactNode[] = [];

        messages.forEach((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const prevDate = prevMessage ? prevMessage.timestamp : null;

            if (shouldShowDateSeparator(message.timestamp, prevDate)) {
                elements.push(
                    <DateSeparator key={`date-${message.id}`} date={message.timestamp} />
                );
            }

            const consecutive = isConsecutive(message, prevMessage);

            elements.push(
                <ChatMessage
                    key={message.id}
                    message={message}
                    isConsecutive={consecutive}
                    currentUserId={currentUser.user.id}
                    onReply={handleReply}
                    onReact={onReactToMessage ? (_msg, emoji) => onReactToMessage(message, emoji) : undefined}
                    onEdit={onEditMessage}
                    onAvatarClick={onAvatarClick}
                    onThreadClick={handleReply}
                >
                    {message.reactions && message.reactions.length > 0 && (
                        <MessageReactions
                            reactions={message.reactions}
                            currentUserId={currentUser.user.id!}
                            onToggleReaction={(emoji) => {
                                if (onReactToMessage) {
                                    onReactToMessage(message, emoji);
                                }
                            }}
                            onAddReaction={(emoji) => {
                                if (onReactToMessage) {
                                    onReactToMessage(message, emoji);
                                }
                            }}
                        />
                    )}
                </ChatMessage>
            );
        });

        return elements;
    };

    const renderNavItems = () => {
        if (navItems.length === 0) return null;

        return (
            <>
                {navItems.map(item => (
                    <SideBarBodyItem
                        key={item.id}
                        label={item.label}
                        sortable={false}
                        active={activeNavItemId === item.id}
                        focused={false}
                        icon={<i className={item.icon} />}
                        badge={item.badge}
                        onClick={item.onClick}
                    />
                ))}
            </>
        );
    };

    const renderSidebar = () => (
        <ChatSidebar
            state={sidebarState}
            onStateChange={onSidebarStateChange}
            header={
                <ChatSidebarHeader
                    workspaceName={workspaceName}
                    workspaceMedia={workspaceMedia}
                    sidebarState={sidebarState}
                    onStateChange={onSidebarStateChange}
                    onNewChat={onNewChat}
                    onWorkspaceClick={onWorkspaceClick}
                />
            }
            footer={
                <ChatSidebarFooter
                    user={currentUser}
                    onStatusChange={onStatusChange}
                    onSettingsClick={onSettingsClick}
                    onProfileClick={onProfileClick}
                />
            }
            navItems={renderNavItems()}
        >
            {groups.map((group) => (
                <ChatSidebarGroup
                    key={group.label}
                    label={group.label}
                    conversations={group.conversations}
                    collapsed={group.collapsed}
                    icon={group.icon}
                    activeConversationId={activeConversation?.id}
                    onConversationClick={onConversationClick}
                    onConversationContextMenu={onConversationContextMenu}
                    onToggle={onGroupToggle ? () => onGroupToggle(group.label) : undefined}
                    onCreateNew={onGroupCreateNew ? () => onGroupCreateNew(group.label) : undefined}
                    groupContextMenuItems={groupContextMenuItems}
                    onGroupContextMenuClick={onGroupContextMenuClick ? (item) => onGroupContextMenuClick(item, group.label) : undefined}
                    conversationContextMenuItems={conversationContextMenuItems}
                    onConversationContextMenuClick={onConversationContextMenuClick}
                />
            ))}
        </ChatSidebar>
    );

    const renderCenter = () => (
        <div className="blue-orange-chat-layout-center">
            {activeConversation ? (
                <>
                    <div className="blue-orange-chat-layout-conversation-header">
                        <span className="blue-orange-chat-layout-conversation-name">
                            {activeConversation.name}
                        </span>
                        <span className="blue-orange-chat-layout-member-count">
                            {activeConversation.members.length} {activeConversation.members.length === 1 ? 'member' : 'members'}
                        </span>
                    </div>
                    <ChatWindow
                        messages={messages}
                        onLoadMore={handleLoadMore}
                        loading={loadingMessages}
                        hasMore={hasMoreMessages}
                    >
                        {renderMessages()}
                    </ChatWindow>
                    <ChatInput
                        onSend={handleSend}
                        replyTo={replyTo}
                        onCancelReply={handleCancelReply}
                        typingUsers={typingUsers}
                        snoozedUsers={snoozedUsers}
                    />
                </>
            ) : (
                <div className="blue-orange-chat-layout-empty-state">
                    Select a conversation to start chatting
                </div>
            )}
        </div>
    );

    const hasRightPanel = !!detailUser || !!threadParentMessage;

    const renderRightPanel = () => {
        if (detailUser && onCloseUserDetail) {
            return (
                <UserDetailPanel
                    chatUser={detailUser}
                    onClose={onCloseUserDetail}
                />
            );
        }
        if (threadParentMessage && onSendThreadReply && onCloseThread) {
            return (
                <ThreadPanel
                    parentMessage={threadParentMessage}
                    replies={threadReplies}
                    onSendReply={onSendThreadReply}
                    onClose={onCloseThread}
                    typingUsers={threadTypingUsers}
                    currentUserId={currentUser.user.id}
                    onReact={onReactToMessage ? (msg, emoji) => onReactToMessage(msg, emoji) : undefined}
                    onEdit={onEditMessage}
                    onAvatarClick={onAvatarClick}
                />
            );
        }
        return null;
    };

    return (
        <div className="blue-orange-chat-layout-container">
            {renderSidebar()}
            {hasRightPanel ? (
                <VerticalSplitPage splitDirection={SplitDirectionVerticalPage.RIGHT} defaultWidth={562}>
                    <SplitPageMajor>
                        {renderCenter()}
                    </SplitPageMajor>
                    <SplitPageMinor>
                        {renderRightPanel()}
                    </SplitPageMinor>
                </VerticalSplitPage>
            ) : (
                renderCenter()
            )}
        </div>
    );
};
