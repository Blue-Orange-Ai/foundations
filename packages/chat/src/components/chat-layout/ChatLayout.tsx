import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
    SideBarState,
    SideBarBodyItem,
    VerticalSplitPage,
    SplitPageMajor,
    SplitPageMinor,
    SplitDirectionVerticalPage,
    IContextMenuItem,
    IContextMenuType,
    ContextMenu,
    SearchSuggestion,
    SearchSuggestionGroup,
} from '@blue-orange-ai/foundations-core';
import {
    IChatGroup,
    IChatMessage,
    IChatUser,
    IChatConversation,
    IChatConversationSettings,
    IChatNavItem,
    IChatCustomPage,
    IChatBookmark,
    IUserSettings,
    ChatConversationType,
    ChatMemberRole,
    ChatUserStatus
} from '../../interfaces/ChatInterfaces';
import { ChatSidebar } from '../sidebar/ChatSidebar';
import { ChatSidebarHeader } from '../sidebar/header/ChatSidebarHeader';
import { ChatSidebarGroup } from '../sidebar/group/ChatSidebarGroup';
import { ChatSidebarCustomPages } from '../sidebar/custom-pages/ChatSidebarCustomPages';
import { ChatSidebarFooter } from '../sidebar/footer/ChatSidebarFooter';
import { ChatWindow } from '../chat-window/ChatWindow';
import { ChatMessage } from '../chat-window/message/ChatMessage';
import { DateSeparator } from '../chat-window/date-separator/DateSeparator';
import { MessageReactions } from '../chat-window/message/reactions/MessageReactions';
import { ChatInput } from '../chat-input/ChatInput';
import { UserDetailPanel } from '../user-detail/UserDetailPanel';
import { ThreadPanel } from '../thread-panel/ThreadPanel';
import { ChatMembersModal } from './members-modal/ChatMembersModal';
import { BookmarksView } from '../bookmarks/BookmarksView';
import { ChatSettingsView } from '../chat-settings/ChatSettingsView';
import { UserSettingsView } from '../user-settings/UserSettingsView';
import { NewChatView, INewChatInitialMessage } from '../new-chat/NewChatView';
import { NewChannelView, INewChannelInitialMessage } from '../new-channel/NewChannelView';
import { ChatHeaderBar } from '../header-bar/ChatHeaderBar';
import { AllUnreadsView, IUnreadMessageItem } from '../all-unreads/AllUnreadsView';
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
    /** Consumer supplied pages listed as top level sidebar items and rendered in the content area when selected */
    customPages?: IChatCustomPage[];
    /** Controls which custom page is open. Leave unset to let the layout track it internally */
    activeCustomPageId?: string;
    onCustomPageClick?: (page: IChatCustomPage) => void;
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
    onLinkedMessageClick?: (message: IChatMessage) => void;
    onUpdateMemberRole?: (conversationId: string, userId: string, role: ChatMemberRole) => void;
    onAddMembers?: (conversationId: string, userIds: string[]) => void;
    onAddBookmark?: (conversationId: string, label: string, payload: { url: string } | { media: Media }) => void;
    onRemoveBookmark?: (conversationId: string, bookmarkId: string) => void;
    onBookmarkClick?: (bookmark: IChatBookmark) => void;
    onUpdateConversation?: (conversationId: string, settings: IChatConversationSettings) => void;
    onArchiveConversation?: (conversationId: string) => void;
    onDeleteConversation?: (conversationId: string) => void;
    onUpdateUserSettings?: (settings: IUserSettings) => void;
    onCreateConversation?: (userIds: string[], encrypted: boolean, firstMessage: INewChatInitialMessage) => void;
    onCreateChannel?: (
        name: string,
        userIds: string[],
        encrypted: boolean,
        firstMessage: INewChannelInitialMessage,
        userCreated: boolean,
    ) => void;
    onHeaderSearch?: (query: string) => void;
    headerSearchSuggestions?: SearchSuggestionGroup[];
    onHeaderSuggestionSelect?: (suggestion: SearchSuggestion) => void;
    onHelpClick?: () => void;
    onLogoutClick?: () => void;
    unreadMessages?: IUnreadMessageItem[];
    messagesByConversation?: Record<string, IChatMessage[]>;
    onSendMessageToConversation?: (conversationId: string, content: string, mentions: string[], attachments: any[]) => void;
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
    customPages = [],
    activeCustomPageId,
    onCustomPageClick,
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
    onConversationContextMenuClick,
    onLinkedMessageClick,
    onUpdateMemberRole,
    onAddMembers,
    onAddBookmark,
    onRemoveBookmark,
    onBookmarkClick,
    onUpdateConversation,
    onArchiveConversation,
    onDeleteConversation,
    onUpdateUserSettings,
    onCreateConversation,
    onCreateChannel,
    onHeaderSearch,
    headerSearchSuggestions,
    onHeaderSuggestionSelect,
    onHelpClick,
    onLogoutClick,
    unreadMessages = [],
    messagesByConversation = {},
    onSendMessageToConversation
}) => {
    const [replyTo, setReplyTo] = useState<IChatMessage | null>(null);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showBookmarksView, setShowBookmarksView] = useState(false);
    const [showSettingsView, setShowSettingsView] = useState(false);
    const [showUserSettingsView, setShowUserSettingsView] = useState(false);
    const [showNewChatView, setShowNewChatView] = useState(false);
    const [newChannelMode, setNewChannelMode] = useState<null | { userCreated: boolean }>(null);
    const [internalCustomPageId, setInternalCustomPageId] = useState<string | undefined>();

    const openCustomPageId = activeCustomPageId ?? internalCustomPageId;
    const activeCustomPage = customPages.find((p) => p.id === openCustomPageId);

    useEffect(() => {
        setShowBookmarksView(false);
        setShowSettingsView(false);
        setShowNewChatView(false);
        setNewChannelMode(null);
        setInternalCustomPageId(undefined);
    }, [activeConversation?.id]);

    const handleCustomPageClick = useCallback((page: IChatCustomPage) => {
        setShowBookmarksView(false);
        setShowSettingsView(false);
        setShowUserSettingsView(false);
        setShowNewChatView(false);
        setNewChannelMode(null);
        setInternalCustomPageId(page.id);
        onCustomPageClick?.(page);
    }, [onCustomPageClick]);

    const handleSidebarSettingsClick = useCallback(() => {
        setShowBookmarksView(false);
        setShowSettingsView(false);
        setShowNewChatView(false);
        setInternalCustomPageId(undefined);
        setShowUserSettingsView(true);
        onSettingsClick?.();
    }, [onSettingsClick]);

    const handleNewChatClick = useCallback(() => {
        setShowBookmarksView(false);
        setShowSettingsView(false);
        setShowUserSettingsView(false);
        setNewChannelMode(null);
        setInternalCustomPageId(undefined);
        setShowNewChatView(true);
        onNewChat?.();
    }, [onNewChat]);

    // -- Navigation history (conversation IDs) --
    const [navHistory, setNavHistory] = useState<{ stack: string[]; index: number }>({ stack: [], index: -1 });
    const navigatingRef = useRef(false);

    useEffect(() => {
        const id = activeConversation?.id;
        if (!id) return;
        if (navigatingRef.current) {
            navigatingRef.current = false;
            return;
        }
        setNavHistory((prev) => {
            const truncated = prev.stack.slice(0, prev.index + 1);
            if (truncated[truncated.length - 1] === id) return prev;
            const stack = [...truncated, id];
            return { stack, index: stack.length - 1 };
        });
    }, [activeConversation?.id]);

    const allConversationsById = useMemo(() => {
        const map = new Map<string, IChatConversation>();
        groups.forEach((g) => g.conversations.forEach((c) => map.set(c.id, c)));
        return map;
    }, [groups]);

    const navigateTo = useCallback((id: string) => {
        const conv = allConversationsById.get(id);
        if (!conv) return;
        navigatingRef.current = true;
        onConversationClick?.(conv);
    }, [allConversationsById, onConversationClick]);

    const handleUndo = useCallback(() => {
        setNavHistory((prev) => {
            if (prev.index <= 0) return prev;
            const nextIndex = prev.index - 1;
            const targetId = prev.stack[nextIndex];
            navigateTo(targetId);
            return { ...prev, index: nextIndex };
        });
    }, [navigateTo]);

    const handleRedo = useCallback(() => {
        setNavHistory((prev) => {
            if (prev.index >= prev.stack.length - 1) return prev;
            const nextIndex = prev.index + 1;
            const targetId = prev.stack[nextIndex];
            navigateTo(targetId);
            return { ...prev, index: nextIndex };
        });
    }, [navigateTo]);

    const canUndo = navHistory.index > 0;
    const canRedo = navHistory.index < navHistory.stack.length - 1;

    const handleGroupCtxMenuClickWrapped = useCallback((item: IContextMenuItem, groupLabel: string) => {
        if (item.value === 'create-channel' || item.value === 'create-system-channel') {
            setShowBookmarksView(false);
            setShowSettingsView(false);
            setShowUserSettingsView(false);
            setShowNewChatView(false);
            setInternalCustomPageId(undefined);
            setNewChannelMode({ userCreated: item.value === 'create-channel' });
            return;
        }
        onGroupContextMenuClick?.(item, groupLabel);
    }, [onGroupContextMenuClick]);

    const headerMenuItems: IContextMenuItem[] = [
        { label: 'Settings', type: IContextMenuType.CONTENT, icon: 'ri-settings-3-line' },
        { label: 'Bookmarks', type: IContextMenuType.CONTENT, icon: 'ri-bookmark-line' },
    ];

    const handleHeaderMenuClick = useCallback((item: IContextMenuItem) => {
        if (item.label === 'Settings') {
            setShowBookmarksView(false);
            setShowSettingsView(true);
        } else if (item.label === 'Bookmarks') {
            setShowSettingsView(false);
            setShowBookmarksView(true);
        }
    }, []);

    const handleReply = useCallback((message: IChatMessage) => {
        if (onReplyToMessage) {
            onReplyToMessage(message);
        } else {
            setReplyTo(message);
        }
    }, [onReplyToMessage]);

    const handleLinkedMessageClick = useCallback((linkedMessage: IChatMessage) => {
        if (onLinkedMessageClick) {
            onLinkedMessageClick(linkedMessage);
        } else {
            const el = document.querySelector(`[data-message-id="${linkedMessage.id}"]`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [onLinkedMessageClick]);

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
                    onLinkedMessageClick={handleLinkedMessageClick}
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

    const handleNavItemClick = useCallback((item: IChatNavItem) => {
        setInternalCustomPageId(undefined);
        item.onClick?.();
    }, []);

    const handleConversationClick = useCallback((conversation: IChatConversation) => {
        setInternalCustomPageId(undefined);
        onConversationClick?.(conversation);
    }, [onConversationClick]);

    const renderNavItems = () => {
        if (navItems.length === 0) return null;

        return (
            <>
                {navItems.map(item => (
                    <SideBarBodyItem
                        key={item.id}
                        label={item.label}
                        sortable={false}
                        active={!activeCustomPage && activeNavItemId === item.id}
                        focused={false}
                        icon={<i className={item.icon} />}
                        badge={item.badge}
                        onClick={() => handleNavItemClick(item)}
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
                    onNewChat={handleNewChatClick}
                    onWorkspaceClick={onWorkspaceClick}
                />
            }
            footer={
                <ChatSidebarFooter
                    user={currentUser}
                    onStatusChange={onStatusChange}
                    onSettingsClick={handleSidebarSettingsClick}
                    onProfileClick={onProfileClick}
                />
            }
            navItems={renderNavItems()}
            customItems={
                customPages.length > 0 ? (
                    <ChatSidebarCustomPages
                        pages={customPages}
                        activePageId={activeCustomPage?.id}
                        onPageClick={handleCustomPageClick}
                    />
                ) : undefined
            }
        >
            {groups.map((group) => (
                <ChatSidebarGroup
                    key={group.label}
                    label={group.label}
                    conversations={group.conversations}
                    collapsed={group.collapsed}
                    icon={group.icon}
                    activeConversationId={activeCustomPage ? undefined : activeConversation?.id}
                    onConversationClick={handleConversationClick}
                    onConversationContextMenu={onConversationContextMenu}
                    onToggle={onGroupToggle ? () => onGroupToggle(group.label) : undefined}
                    onCreateNew={onGroupCreateNew ? () => onGroupCreateNew(group.label) : undefined}
                    groupContextMenuItems={groupContextMenuItems}
                    onGroupContextMenuClick={(item) => handleGroupCtxMenuClickWrapped(item, group.label)}
                    conversationContextMenuItems={conversationContextMenuItems}
                    onConversationContextMenuClick={onConversationContextMenuClick}
                />
            ))}
        </ChatSidebar>
    );

    const renderCenter = () => (
        <div className="blue-orange-chat-layout-center">
            {activeCustomPage ? (
                <div className="blue-orange-chat-layout-custom-page">
                    {activeCustomPage.page}
                </div>
            ) : activeNavItemId === 'all-unreads' && !newChannelMode && !showNewChatView && !showUserSettingsView && !showSettingsView && !showBookmarksView ? (
                <AllUnreadsView
                    unreadMessages={unreadMessages}
                    messagesByConversation={messagesByConversation}
                    currentUser={currentUser}
                    onSendMessage={onSendMessageToConversation}
                    onReactToMessage={onReactToMessage}
                    onReplyToMessage={onReplyToMessage}
                    onEditMessage={onEditMessage}
                    onAvatarClick={onAvatarClick}
                    onLinkedMessageClick={handleLinkedMessageClick}
                />
            ) : newChannelMode ? (
                <NewChannelView
                    headerLabel={newChannelMode.userCreated ? 'New channel' : 'New system channel'}
                    onCreate={(name, userIds, encrypted, firstMessage) => {
                        onCreateChannel?.(name, userIds, encrypted, firstMessage, newChannelMode.userCreated);
                        setNewChannelMode(null);
                    }}
                    onClose={() => setNewChannelMode(null)}
                />
            ) : showNewChatView ? (
                <NewChatView
                    onCreate={(userIds, encrypted, firstMessage) => {
                        onCreateConversation?.(userIds, encrypted, firstMessage);
                        setShowNewChatView(false);
                    }}
                    onClose={() => setShowNewChatView(false)}
                />
            ) : showUserSettingsView ? (
                <UserSettingsView
                    user={currentUser}
                    onSave={(settings) => {
                        onUpdateUserSettings?.(settings);
                        setShowUserSettingsView(false);
                    }}
                    onClose={() => setShowUserSettingsView(false)}
                />
            ) : activeConversation ? (
                <>
                    <div className="blue-orange-chat-layout-conversation-header">
                        <span className="blue-orange-chat-layout-conversation-name">
                            {activeConversation.name}
                        </span>
                        <span
                            className="blue-orange-chat-layout-member-count blue-orange-chat-layout-member-count-clickable"
                            onClick={() => setShowMembersModal(true)}
                        >
                            {activeConversation.members.length} {activeConversation.members.length === 1 ? 'member' : 'members'}
                        </span>
                        <div className="blue-orange-chat-layout-conversation-header-actions">
                            {activeConversation.encrypted && (
                                <span className="blue-orange-chat-layout-encryption-icon" title="End-to-end encrypted">
                                    <i className="ri-lock-line" />
                                </span>
                            )}
                            <ContextMenu
                                items={headerMenuItems}
                                onClick={handleHeaderMenuClick}
                                width={200}
                            >
                                <button className="blue-orange-chat-layout-more-btn">
                                    <i className="ri-more-2-fill" />
                                </button>
                            </ContextMenu>
                        </div>
                    </div>
                    {activeConversation.bookmarks && activeConversation.bookmarks.length > 0 && (
                        <div className="blue-orange-chat-layout-bookmarks-bar">
                            {activeConversation.bookmarks.map((bm) => (
                                <span
                                    key={bm.id}
                                    className="blue-orange-chat-layout-bookmark-chip"
                                    onClick={() => onBookmarkClick?.(bm)}
                                >
                                    <i className={bm.media ? 'ri-file-line' : 'ri-bookmark-fill'} />
                                    {bm.label}
                                </span>
                            ))}
                        </div>
                    )}
                    {showSettingsView ? (
                        <ChatSettingsView
                            conversation={activeConversation}
                            onSave={(settings) => onUpdateConversation?.(activeConversation.id, settings)}
                            onArchive={() => onArchiveConversation?.(activeConversation.id)}
                            onDelete={() => {
                                onDeleteConversation?.(activeConversation.id);
                                setShowSettingsView(false);
                            }}
                            onUpdateMemberRole={(userId, role) => onUpdateMemberRole?.(activeConversation.id, userId, role)}
                            onAddMembers={(userIds) => onAddMembers?.(activeConversation.id, userIds)}
                            onClose={() => setShowSettingsView(false)}
                        />
                    ) : showBookmarksView ? (
                        <BookmarksView
                            bookmarks={activeConversation.bookmarks ?? []}
                            onAddBookmark={(label, payload) => onAddBookmark?.(activeConversation.id, label, payload)}
                            onRemoveBookmark={(bmId) => onRemoveBookmark?.(activeConversation.id, bmId)}
                            onClose={() => setShowBookmarksView(false)}
                        />
                    ) : (
                        <>
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
                    )}
                </>
            ) : (
                <div className="blue-orange-chat-layout-empty-state">
                    Select a conversation to start chatting
                </div>
            )}
        </div>
    );

    // Settings views take over the full content area: suppress the right panel
    // (thread / user detail) while one is open. The panel state itself lives in
    // the parent and is untouched, so the panel reappears when settings closes.
    const hasRightPanel =
        (!!detailUser || !!threadParentMessage) && !showSettingsView && !showUserSettingsView;

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
        <div className="blue-orange-chat-layout-app">
            {renderSidebar()}
            <div className="blue-orange-chat-layout-main">
                <ChatHeaderBar
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onSearch={onHeaderSearch}
                    suggestionGroups={headerSearchSuggestions}
                    onSuggestionSelect={onHeaderSuggestionSelect}
                    onHelpClick={onHelpClick}
                    onLogoutClick={onLogoutClick}
                />
                <div className="blue-orange-chat-layout-container">
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
                {showMembersModal && activeConversation && (
                    <ChatMembersModal
                        members={activeConversation.members}
                        onClose={() => setShowMembersModal(false)}
                        onMemberClick={onAvatarClick}
                        showRoles={activeConversation.type === ChatConversationType.CHANNEL}
                    />
                )}
                </div>
            </div>
        </div>
    );
};
