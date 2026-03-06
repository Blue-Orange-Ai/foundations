import React, { useState, useCallback, useMemo } from 'react';
import { SideBarState } from '@blue-orange-ai/foundations-core';
import { ChatLayout } from '../../components/chat-layout/ChatLayout';
import {
    IChatGroup,
    IChatMessage,
    IChatUser,
    IChatConversation,
    IChatNavItem,
    ChatUserStatus
} from '../../interfaces/ChatInterfaces';
import {
    currentUser,
    mockGroups,
    messagesByConversation,
    allConversations,
    threadRepliesForMsg11,
} from '../data/mockData';

import './Workspace.css';

export const Workspace: React.FC = () => {
    const [activeConversation, setActiveConversation] = useState<IChatConversation | undefined>(
        allConversations[0]
    );
    const [messages, setMessages] = useState<IChatMessage[]>(
        messagesByConversation[allConversations[0].id] || []
    );
    const [detailUser, setDetailUser] = useState<IChatUser | null>(null);
    const [threadParent, setThreadParent] = useState<IChatMessage | null>(null);
    const [threadReplies, setThreadReplies] = useState<IChatMessage[]>([]);
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
        } else {
            setThreadReplies([]);
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
                onReplyToMessage={handleReplyToMessage}
                onAvatarClick={handleAvatarClick}
                threadParentMessage={threadParent || undefined}
                threadReplies={threadReplies}
                onSendThreadReply={handleSendThreadReply}
                onCloseThread={handleCloseThread}
                detailUser={detailUser || undefined}
                onCloseUserDetail={handleCloseUserDetail}
                onGroupToggle={handleGroupToggle}
            />
        </div>
    );
};
