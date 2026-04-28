import React, { useState, useCallback, useMemo } from 'react';
import { SideBarState, IContextMenuItem, IContextMenuType } from '@blue-orange-ai/foundations-core';
import { Media } from '@blue-orange-ai/foundations-clients';
import { ChatLayout } from '../../components/chat-layout/ChatLayout';
import {
    IChatGroup,
    IChatMessage,
    IChatUser,
    IChatConversation,
    IChatConversationSettings,
    IChatNavItem,
    IChatBookmark,
    IUserSettings,
    ChatConversationType,
    ChatMemberRole,
    ChatUserStatus
} from '../../interfaces/ChatInterfaces';
import {
    currentUser as initialCurrentUser,
    userDave,
    mockGroups,
    messagesByConversation,
    allConversations,
    allUsers,
    threadRepliesForMsg11,
} from '../data/mockData';

import './Workspace.css';

export const Workspace: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<IChatUser>(initialCurrentUser);
    const [activeConversation, setActiveConversation] = useState<IChatConversation | undefined>(
        allConversations[0]
    );
    const [messages, setMessages] = useState<IChatMessage[]>(
        messagesByConversation[allConversations[0].id] || []
    );
    const [detailUser, setDetailUser] = useState<IChatUser | null>(null);
    const [threadParent, setThreadParent] = useState<IChatMessage | null>(null);
    const [threadReplies, setThreadReplies] = useState<IChatMessage[]>([]);
    const [threadTypingUsers, setThreadTypingUsers] = useState<IChatUser[]>([]);
    const [groups, setGroups] = useState<IChatGroup[]>(mockGroups);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarState, setSidebarState] = useState<SideBarState>(SideBarState.OPEN);
    const [activeNavItemId, setActiveNavItemId] = useState<string | undefined>();

    // -- Nav items (Slack-style top navigation) --

    const navItems: IChatNavItem[] = useMemo(() => [
        {
            id: 'all-unreads',
            label: 'All unreads',
            icon: 'ri-mail-unread-line',
            onClick: () => {
                setActiveNavItemId('all-unreads');
                setActiveConversation(undefined);
            }
        },
        {
            id: 'threads',
            label: 'Threads',
            icon: 'ri-chat-thread-line',
            onClick: () => {
                setActiveNavItemId('threads');
                setActiveConversation(undefined);
            }
        },
        {
            id: 'mentions',
            label: 'Mentions & reactions',
            icon: 'ri-at-line',
            onClick: () => {
                setActiveNavItemId('mentions');
                setActiveConversation(undefined);
            }
        },
    ], []);

    // -- Conversation click --

    const handleConversationClick = useCallback((conversation: IChatConversation) => {
        setActiveConversation(conversation);
        setActiveNavItemId(undefined);
        setMessages(messagesByConversation[conversation.id] || []);
        setThreadParent(null);
        setThreadReplies([]);
        setDetailUser(null);
    }, []);

    // -- Send message --

    const handleSendMessage = useCallback(
        (content: string, _mentions: string[], _attachments: any[]) => {
            const newMessage: IChatMessage = {
                id: `msg-${Date.now()}`,
                content,
                sender: currentUser,
                timestamp: new Date(),
                reactions: [],
            };
            setMessages((prev) => [...prev, newMessage]);
        },
        []
    );

    // -- Edit message --

    const handleEditMessage = useCallback((message: IChatMessage, newContent: string) => {
        const updateMessages = (msgs: IChatMessage[]): IChatMessage[] =>
            msgs.map((msg) =>
                msg.id === message.id
                    ? { ...msg, content: newContent, edited: true }
                    : msg
            );
        setMessages(updateMessages);
        setThreadReplies(updateMessages);
    }, []);

    // -- Avatar click (show user detail panel) --

    const handleAvatarClick = useCallback((user: IChatUser) => {
        setDetailUser(user);
        setThreadParent(null);
    }, []);

    // -- Reply to message (show thread panel) --

    const handleReplyToMessage = useCallback((message: IChatMessage) => {
        setThreadParent(message);
        setDetailUser(null);

        if (message.id === 'msg-11') {
            setThreadReplies(threadRepliesForMsg11);
            setThreadTypingUsers([userDave]);
        } else {
            setThreadReplies([]);
            setThreadTypingUsers([]);
        }
    }, []);

    // -- Send thread reply --

    const handleSendThreadReply = useCallback(
        (content: string, _mentions: string[], _attachments: any[]) => {
            const reply: IChatMessage = {
                id: `thread-${Date.now()}`,
                content,
                sender: currentUser,
                timestamp: new Date(),
                reactions: [],
            };
            setThreadReplies((prev) => [...prev, reply]);
        },
        []
    );

    // -- Close panels --

    const handleCloseThread = useCallback(() => {
        setThreadParent(null);
        setThreadReplies([]);
        setThreadTypingUsers([]);
    }, []);

    const handleCloseUserDetail = useCallback(() => {
        setDetailUser(null);
    }, []);

    // -- React to message --

    const handleReactToMessage = useCallback((message: IChatMessage, emoji: string) => {
        if (!emoji) return;

        const toggleReaction = (msgs: IChatMessage[]): IChatMessage[] =>
            msgs.map((msg) => {
                if (msg.id !== message.id) return msg;

                const existingIdx = msg.reactions.findIndex((r) => r.emoji === emoji);
                let updatedReactions = [...msg.reactions];

                if (existingIdx >= 0) {
                    const reaction = updatedReactions[existingIdx];
                    const userId = currentUser.user.id!;
                    if (reaction.userIds.includes(userId)) {
                        const filtered = reaction.userIds.filter((id) => id !== userId);
                        if (filtered.length === 0) {
                            updatedReactions.splice(existingIdx, 1);
                        } else {
                            updatedReactions[existingIdx] = { ...reaction, userIds: filtered };
                        }
                    } else {
                        updatedReactions[existingIdx] = {
                            ...reaction,
                            userIds: [...reaction.userIds, userId],
                        };
                    }
                } else {
                    updatedReactions.push({ emoji, userIds: [currentUser.user.id!] });
                }

                return { ...msg, reactions: updatedReactions };
            });

        setMessages(toggleReaction);
        setThreadReplies(toggleReaction);
    }, []);

    // -- Group toggle --

    const handleGroupToggle = useCallback((label: string) => {
        setGroups((prev) =>
            prev.map((g) => (g.label === label ? { ...g, collapsed: !g.collapsed } : g))
        );
    }, []);

    // -- Sidebar state --

    const handleSidebarStateChange = useCallback((state: SideBarState) => {
        setSidebarState(state);
    }, []);

    // -- Search --

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    // Filter groups based on search
    const filteredGroups = useMemo(() => {
        if (!searchQuery.trim()) return groups;
        const q = searchQuery.toLowerCase();
        return groups.map((g) => ({
            ...g,
            conversations: g.conversations.filter((c) =>
                c.name.toLowerCase().includes(q)
            ),
        }));
    }, [groups, searchQuery]);

    // -- Typing and snoozed users for active conversation --

    const typingUsers = useMemo(() => {
        return activeConversation?.typingUsers || [];
    }, [activeConversation]);

    const snoozedUsers = useMemo(() => {
        if (!activeConversation) return [];
        return activeConversation.members.filter((m) => m.snoozeUntil && m.snoozeUntil > new Date());
    }, [activeConversation]);

    // -- Context menus --

    const groupContextMenuItems: IContextMenuItem[] = useMemo(() => [
        { type: IContextMenuType.HEADING, label: 'Channels', value: '' },
        { type: IContextMenuType.CONTENT, label: 'Create channel', icon: 'ri-add-line', value: 'create-channel' },
        { type: IContextMenuType.SEPARATOR, label: '' },
        { type: IContextMenuType.CONTENT, label: 'Collapse all', icon: 'ri-contract-up-down-line', value: 'collapse-all' },
        { type: IContextMenuType.CONTENT, label: 'Mark all as read', icon: 'ri-check-double-line', value: 'mark-all-read' },
    ], []);

    const handleGroupContextMenuClick = useCallback((item: IContextMenuItem, groupLabel: string) => {
        if (item.value === 'collapse-all') {
            setGroups((prev) => prev.map((g) => ({ ...g, collapsed: true })));
            return;
        }
        console.log(`[Workspace] Group "${groupLabel}" context menu:`, item.value);
    }, []);

    const getConversationContextMenuItems = useCallback((conversation: IChatConversation): IContextMenuItem[] => {
        const items: IContextMenuItem[] = [
            { type: IContextMenuType.HEADING, label: conversation.name, value: '' },
            { type: IContextMenuType.CONTENT, label: 'Mark as Read', icon: 'ri-check-line', value: 'mark-read' },
            { type: IContextMenuType.CONTENT, label: conversation.starred ? 'Unstar' : 'Star', icon: conversation.starred ? 'ri-star-fill' : 'ri-star-line', value: 'toggle-star' },
            { type: IContextMenuType.CONTENT, label: 'Mute Conversation', icon: 'ri-volume-mute-line', value: 'mute' },
            { type: IContextMenuType.SEPARATOR, label: '' },
            { type: IContextMenuType.CONTENT, label: 'Copy Link', icon: 'ri-link', value: 'copy-link' },
            { type: IContextMenuType.CONTENT, label: 'Move to...', icon: 'ri-folder-transfer-line', value: 'move' },
            { type: IContextMenuType.SEPARATOR, label: '' },
            { type: IContextMenuType.CONTENT, label: 'Leave Conversation', icon: 'ri-logout-box-line', value: 'leave' },
        ];
        if (conversation.type === ChatConversationType.CHANNEL && conversation.userCreated) {
            items.push({ type: IContextMenuType.SEPARATOR, label: '' });
            items.push({ type: IContextMenuType.CONTENT, label: 'Delete channel', icon: 'ri-delete-bin-7-line', value: 'delete-channel' });
        }
        return items;
    }, []);

    const handleConversationContextMenuClick = useCallback((item: IContextMenuItem, conversation: IChatConversation) => {
        if (item.value === 'delete-channel') {
            handleDeleteConversation(conversation.id);
            return;
        }
        console.log(`[Workspace] Conversation "${conversation.name}" context menu:`, item.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // -- Bookmarks --

    const handleAddBookmark = useCallback((conversationId: string, label: string, payload: { url: string } | { media: Media }) => {
        const newBookmark: IChatBookmark = 'media' in payload
            ? {
                  id: `bm-${Date.now()}`,
                  label,
                  url: payload.media.url,
                  media: payload.media,
              }
            : {
                  id: `bm-${Date.now()}`,
                  label,
                  url: payload.url,
              };
        setActiveConversation((prev) => {
            if (!prev || prev.id !== conversationId) return prev;
            return { ...prev, bookmarks: [...(prev.bookmarks || []), newBookmark] };
        });
    }, []);

    const handleRemoveBookmark = useCallback((conversationId: string, bookmarkId: string) => {
        setActiveConversation((prev) => {
            if (!prev || prev.id !== conversationId) return prev;
            return { ...prev, bookmarks: (prev.bookmarks || []).filter((bm) => bm.id !== bookmarkId) };
        });
    }, []);

    const handleBookmarkClick = useCallback((bookmark: IChatBookmark) => {
        window.open(bookmark.url, '_blank');
    }, []);

    // -- Conversation settings --

    const updateConversationEverywhere = useCallback((conversationId: string, updater: (c: IChatConversation) => IChatConversation) => {
        setActiveConversation((prev) => (prev && prev.id === conversationId ? updater(prev) : prev));
        setGroups((prev) => prev.map((group) => ({
            ...group,
            conversations: group.conversations.map((c) => (c.id === conversationId ? updater(c) : c)),
        })));
    }, []);

    const handleUpdateConversation = useCallback((conversationId: string, settings: IChatConversationSettings) => {
        updateConversationEverywhere(conversationId, (c) => ({
            ...c,
            name: settings.name,
            description: settings.description,
            isPrivate: settings.isPrivate,
        }));
    }, [updateConversationEverywhere]);

    const handleArchiveConversation = useCallback((conversationId: string) => {
        updateConversationEverywhere(conversationId, (c) => ({ ...c, archived: true }));
    }, [updateConversationEverywhere]);

    const handleCreateConversation = useCallback((userIds: string[], encrypted: boolean, firstMessage: { content: string; mentions: string[]; attachments: any[] }) => {
        if (userIds.length === 0) return;
        const selected = userIds
            .map((id) => allUsers.find((u) => u.user.id === id))
            .filter((u): u is IChatUser => !!u);
        if (selected.length === 0) return;

        const isDm = selected.length === 1;
        const otherNames = selected.map((u) => u.user.name).join(', ');
        const initialMessage: IChatMessage = {
            id: `msg-new-${Date.now()}`,
            content: firstMessage.content,
            sender: currentUser,
            timestamp: new Date(),
            reactions: [],
            attachments: firstMessage.attachments,
        };
        const newConversation: IChatConversation = {
            id: `conv-new-${Date.now()}`,
            name: isDm ? selected[0].user.name : otherNames,
            type: isDm ? ChatConversationType.DM : ChatConversationType.GROUP,
            members: [
                { ...currentUser, role: ChatMemberRole.ADMIN },
                ...selected.map((u) => ({ ...u, role: ChatMemberRole.PARTICIPANT })),
            ],
            lastMessage: initialMessage,
            unreadCount: 0,
            starred: false,
            encrypted,
        };

        const targetGroupLabel = 'Direct Messages';
        setGroups((prev) => prev.map((group) => (
            group.label === targetGroupLabel
                ? { ...group, conversations: [newConversation, ...group.conversations] }
                : group
        )));
        setActiveConversation(newConversation);
        setMessages([initialMessage]);
    }, [currentUser]);

    const handleCreateChannel = useCallback((
        name: string,
        userIds: string[],
        encrypted: boolean,
        firstMessage: { content: string; mentions: string[]; attachments: any[] },
        userCreated: boolean,
    ) => {
        const trimmedName = name.trim();
        if (!trimmedName || userIds.length === 0) return;
        const selected = userIds
            .map((id) => allUsers.find((u) => u.user.id === id))
            .filter((u): u is IChatUser => !!u);
        const initialMessage: IChatMessage = {
            id: `msg-channel-${Date.now()}`,
            content: firstMessage.content,
            sender: currentUser,
            timestamp: new Date(),
            reactions: [],
            attachments: firstMessage.attachments,
        };
        const newChannel: IChatConversation = {
            id: `conv-channel-${Date.now()}`,
            name: trimmedName,
            type: ChatConversationType.CHANNEL,
            members: [
                { ...currentUser, role: ChatMemberRole.ADMIN },
                ...selected.map((u) => ({ ...u, role: ChatMemberRole.PARTICIPANT })),
            ],
            lastMessage: initialMessage,
            unreadCount: 0,
            starred: false,
            encrypted,
            userCreated,
        };
        setGroups((prev) => prev.map((group) => (
            group.label === 'Channels'
                ? { ...group, conversations: [newChannel, ...group.conversations] }
                : group
        )));
        setActiveConversation(newChannel);
        setMessages([initialMessage]);
    }, [currentUser]);

    const handleUpdateUserSettings = useCallback((settings: IUserSettings) => {
        setCurrentUser((prev) => ({
            ...prev,
            user: {
                ...prev.user,
                name: settings.name,
                avatar: settings.avatar,
            },
            status: settings.status,
            statusText: settings.statusText,
            statusEmoji: settings.statusEmoji,
            notificationSettings: settings.notificationSettings,
        }));
    }, []);

    const handleAddMembers = useCallback((conversationId: string, userIds: string[]) => {
        if (userIds.length === 0) return;
        updateConversationEverywhere(conversationId, (c) => {
            const existingIds = new Set(c.members.map((m) => m.user.id));
            const additions = userIds
                .filter((id) => !existingIds.has(id))
                .map((id) => allUsers.find((u) => u.user.id === id))
                .filter((u): u is IChatUser => !!u)
                .map((u) => ({ ...u, role: ChatMemberRole.PARTICIPANT }));
            if (additions.length === 0) return c;
            return { ...c, members: [...c.members, ...additions] };
        });
    }, [updateConversationEverywhere]);

    const handleUpdateMemberRole = useCallback((conversationId: string, userId: string, role: ChatMemberRole) => {
        updateConversationEverywhere(conversationId, (c) => ({
            ...c,
            members: c.members.map((m) => (m.user.id === userId ? { ...m, role } : m)),
        }));
    }, [updateConversationEverywhere]);

    const handleDeleteConversation = useCallback((conversationId: string) => {
        setGroups((prev) => prev.map((group) => ({
            ...group,
            conversations: group.conversations.filter((c) => c.id !== conversationId),
        })));
        setActiveConversation((prev) => (prev && prev.id === conversationId ? undefined : prev));
        setMessages([]);
    }, []);

    // -- Placeholder handlers --

    const handleNewChat = useCallback(() => {
        console.log('[Workspace] New chat clicked');
    }, []);

    const handleStatusChange = useCallback((status: ChatUserStatus) => {
        console.log('[Workspace] Status changed to:', status);
    }, []);

    // -- Render --

    return (
        <div className="chat-dev-workspace">
            <ChatLayout
                groups={filteredGroups}
                messages={messages}
                currentUser={currentUser}
                activeConversation={activeConversation}
                typingUsers={typingUsers}
                snoozedUsers={snoozedUsers}
                workspaceName="Blue Orange AI"
                navItems={navItems}
                activeNavItemId={activeNavItemId}
                sidebarState={sidebarState}
                onSidebarStateChange={handleSidebarStateChange}
                onConversationClick={handleConversationClick}
                onSendMessage={handleSendMessage}
                onNewChat={handleNewChat}
                onSearch={handleSearch}
                onStatusChange={handleStatusChange}
                onReactToMessage={handleReactToMessage}
                onEditMessage={handleEditMessage}
                onReplyToMessage={handleReplyToMessage}
                onAvatarClick={handleAvatarClick}
                threadParentMessage={threadParent || undefined}
                threadReplies={threadReplies}
                onSendThreadReply={handleSendThreadReply}
                onCloseThread={handleCloseThread}
                threadTypingUsers={threadTypingUsers}
                detailUser={detailUser || undefined}
                onCloseUserDetail={handleCloseUserDetail}
                onGroupToggle={handleGroupToggle}
                groupContextMenuItems={groupContextMenuItems}
                onGroupContextMenuClick={handleGroupContextMenuClick}
                conversationContextMenuItems={getConversationContextMenuItems}
                onConversationContextMenuClick={handleConversationContextMenuClick}
                onAddBookmark={handleAddBookmark}
                onRemoveBookmark={handleRemoveBookmark}
                onBookmarkClick={handleBookmarkClick}
                onUpdateConversation={handleUpdateConversation}
                onArchiveConversation={handleArchiveConversation}
                onDeleteConversation={handleDeleteConversation}
                onUpdateMemberRole={handleUpdateMemberRole}
                onAddMembers={handleAddMembers}
                onUpdateUserSettings={handleUpdateUserSettings}
                onCreateConversation={handleCreateConversation}
                onCreateChannel={handleCreateChannel}
            />
        </div>
    );
};
