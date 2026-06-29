import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Avatar } from '@blue-orange-ai/foundations-core';
import {
    IChatConversation,
    IChatMessage,
    IChatUser,
    ChatConversationType,
} from '../../interfaces/ChatInterfaces';
import { ChatWindow } from '../chat-window/ChatWindow';
import { ChatInput } from '../chat-input/ChatInput';
import { MessageList } from '../chat-window/message-list/MessageList';

import './AllUnreadsView.css';

export interface IUnreadMessageItem {
    message: IChatMessage;
    conversation: IChatConversation;
}

interface Props {
    unreadMessages: IUnreadMessageItem[];
    messagesByConversation: Record<string, IChatMessage[]>;
    currentUser: IChatUser;
    initialFocusedConversationId?: string;
    onSendMessage?: (conversationId: string, content: string, mentions: string[], attachments: any[]) => void;
    onReactToMessage?: (message: IChatMessage, emoji: string) => void;
    onReplyToMessage?: (message: IChatMessage) => void;
    onEditMessage?: (message: IChatMessage, newContent: string) => void;
    onAvatarClick?: (user: IChatUser) => void;
    onLinkedMessageClick?: (message: IChatMessage) => void;
}

const conversationIcon = (conversation: IChatConversation) => {
    if (conversation.type === ChatConversationType.CHANNEL) return 'ri-hashtag';
    if (conversation.type === ChatConversationType.GROUP) return 'ri-team-line';
    return 'ri-chat-1-line';
};

const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html;
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || '').trim();
};

export const AllUnreadsView: React.FC<Props> = ({
    unreadMessages,
    messagesByConversation,
    currentUser,
    initialFocusedConversationId,
    onSendMessage,
    onReactToMessage,
    onReplyToMessage,
    onEditMessage,
    onAvatarClick,
    onLinkedMessageClick,
}) => {
    const [focusedId, setFocusedId] = useState<string | undefined>(
        initialFocusedConversationId ?? unreadMessages[0]?.conversation.id,
    );

    useEffect(() => {
        if (!focusedId && unreadMessages.length > 0) {
            setFocusedId(unreadMessages[0].conversation.id);
        }
    }, [unreadMessages, focusedId]);

    const focusedConversation = useMemo(
        () => unreadMessages.find((u) => u.conversation.id === focusedId)?.conversation,
        [unreadMessages, focusedId],
    );

    const focusedMessages = useMemo(
        () => (focusedId ? messagesByConversation[focusedId] ?? [] : []),
        [focusedId, messagesByConversation],
    );

    const handleSend = (content: string, mentions: string[], attachments: any[]) => {
        if (!focusedId) return;
        onSendMessage?.(focusedId, content, mentions, attachments);
    };

    return (
        <div className="blue-orange-chat-all-unreads-view">
            <div className="blue-orange-chat-all-unreads-list">
                <div className="blue-orange-chat-all-unreads-list-header">
                    All unreads ({unreadMessages.length})
                </div>
                {unreadMessages.length === 0 ? (
                    <div className="blue-orange-chat-all-unreads-list-empty">
                        Nothing unread. You're all caught up.
                    </div>
                ) : (
                    unreadMessages.map((item) => {
                        const isFocused = item.conversation.id === focusedId;
                        const senderName = item.message.sender.user.name;
                        const preview = stripHtml(item.message.content);
                        return (
                            <button
                                key={`${item.conversation.id}-${item.message.id}`}
                                type="button"
                                className={
                                    'blue-orange-chat-all-unreads-list-item' +
                                    (isFocused ? ' blue-orange-chat-all-unreads-list-item--focused' : '')
                                }
                                onClick={() => setFocusedId(item.conversation.id)}
                            >
                                <Avatar user={item.message.sender.user} height={32} width={32} />
                                <div className="blue-orange-chat-all-unreads-list-item-body">
                                    <div className="blue-orange-chat-all-unreads-list-item-header">
                                        <span className="blue-orange-chat-all-unreads-list-item-conv">
                                            <i className={conversationIcon(item.conversation)} />
                                            {item.conversation.name}
                                        </span>
                                        <span className="blue-orange-chat-all-unreads-list-item-time">
                                            {moment(item.message.timestamp).format('MMM D, h:mm A')}
                                        </span>
                                    </div>
                                    <div className="blue-orange-chat-all-unreads-list-item-sender">
                                        {senderName}
                                    </div>
                                    <div className="blue-orange-chat-all-unreads-list-item-preview">
                                        {preview || 'No content'}
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
            <div className="blue-orange-chat-all-unreads-chat">
                {focusedConversation ? (
                    <>
                        <div className="blue-orange-chat-all-unreads-chat-header">
                            <i className={conversationIcon(focusedConversation)} />
                            <span>{focusedConversation.name}</span>
                        </div>
                        <ChatWindow messages={focusedMessages} loading={false} hasMore={false} onLoadMore={() => {}}>
                            <MessageList
                                messages={focusedMessages}
                                currentUserId={currentUser.user.id}
                                onReply={onReplyToMessage}
                                onReact={onReactToMessage}
                                onEdit={onEditMessage}
                                onAvatarClick={onAvatarClick}
                                onLinkedMessageClick={onLinkedMessageClick}
                            />
                        </ChatWindow>
                        <ChatInput onSend={handleSend} />
                    </>
                ) : (
                    <div className="blue-orange-chat-all-unreads-chat-empty">
                        Select a message to view the conversation.
                    </div>
                )}
            </div>
        </div>
    );
};
