import React from 'react';
import moment from 'moment';
import { Avatar, EmojiWrapper } from '@blue-orange-ai/foundations-core';
import { IChatMessage, IChatUser } from '../../../interfaces/ChatInterfaces';

import './ChatMessage.css';

const MAX_THREAD_AVATARS = 5;

interface Props {
    message: IChatMessage;
    isConsecutive?: boolean;
    onReply?: (message: IChatMessage) => void;
    onReact?: (message: IChatMessage, emoji: string) => void;
    onAvatarClick?: (user: IChatUser) => void;
    onThreadClick?: (message: IChatMessage) => void;
    children?: React.ReactNode;
}

const formatTimestamp = (date: Date): string => {
    const m = moment(date);
    if (m.isSame(moment(), 'day')) {
        return m.format('h:mm A');
    }
    return m.format('MMM D, h:mm A');
};

const formatShortTimestamp = (date: Date): string => {
    return moment(date).format('h:mm');
};

const stripTrailingEmptyParagraphs = (html: string): string => {
    return html.replace(/(<p>(\s|<br\s*\/?>)*<\/p>)+$/gi, '');
};

const truncateContent = (content: string, maxLength: number): string => {
    const text = content.replace(/<[^>]*>/g, '');
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
};

export const ChatMessage: React.FC<Props> = ({
    message,
    isConsecutive = false,
    onReply,
    onReact,
    onAvatarClick,
    onThreadClick,
    children
}) => {

    const handleReply = () => {
        if (onReply) {
            onReply(message);
        }
    };

    const handleAvatarClick = () => {
        if (onAvatarClick) {
            onAvatarClick(message.sender);
        }
    };

    const handleEmojiSelection = (emoji: string) => {
        if (onReact) {
            onReact(message, emoji);
        }
    };

    const renderReplyReference = () => {
        if (!message.replyTo) return null;
        return (
            <div
                className="blue-orange-chat-message-reply-ref"
                data-message-id={message.replyTo.id}
            >
                <span className="blue-orange-chat-message-reply-ref-sender">
                    {message.replyTo.sender.user.name}
                </span>
                <span className="blue-orange-chat-message-reply-ref-content">
                    {truncateContent(message.replyTo.content, 50)}
                </span>
            </div>
        );
    };

    const handleThreadClick = () => {
        if (onThreadClick) {
            onThreadClick(message);
        }
    };

    const renderThreadIndicator = () => {
        if (!message.thread || message.thread.replyCount === 0) return null;
        const { replyCount, participants, lastReplyTimestamp } = message.thread;
        const shown = participants.slice(0, MAX_THREAD_AVATARS);
        const replyLabel = replyCount === 1 ? '1 reply' : `${replyCount} replies`;

        return (
            <div
                className="blue-orange-chat-message-thread-indicator"
                onClick={handleThreadClick}
            >
                <div className="blue-orange-chat-message-thread-avatars">
                    {shown.map((participant) => (
                        <Avatar
                            key={participant.user.id}
                            user={participant.user}
                            height={20}
                            width={20}
                        />
                    ))}
                </div>
                <span className="blue-orange-chat-message-thread-count">
                    {replyLabel}
                </span>
                {lastReplyTimestamp && (
                    <span className="blue-orange-chat-message-thread-last-reply">
                        Last reply {formatTimestamp(lastReplyTimestamp)}
                    </span>
                )}
            </div>
        );
    };

    const renderToolbar = () => {
        return (
            <div className="blue-orange-chat-message-toolbar">
                <button
                    className="blue-orange-chat-message-toolbar-btn"
                    onClick={handleReply}
                    title="Reply"
                >
                    <i className="ri-reply-line" />
                </button>
                <EmojiWrapper onSelection={handleEmojiSelection}>
                    <button
                        className="blue-orange-chat-message-toolbar-btn"
                        title="React"
                    >
                        <i className="ri-emoji-sticker-line" />
                    </button>
                </EmojiWrapper>
                <button
                    className="blue-orange-chat-message-toolbar-btn"
                    title="More options"
                >
                    <i className="ri-more-line" />
                </button>
            </div>
        );
    };

    if (isConsecutive) {
        return (
            <div className="blue-orange-chat-message blue-orange-chat-message-consecutive" data-message-id={message.id}>
                {renderToolbar()}
                <span className="blue-orange-chat-message-consecutive-timestamp">
                    {formatShortTimestamp(message.timestamp)}
                </span>
                <div className="blue-orange-chat-message-body">
                    {renderReplyReference()}
                    <div
                        className="blue-orange-chat-message-content"
                        dangerouslySetInnerHTML={{ __html: stripTrailingEmptyParagraphs(message.content) }}
                    />
                    {children}
                    {renderThreadIndicator()}
                </div>
            </div>
        );
    }

    return (
        <div className="blue-orange-chat-message" data-message-id={message.id}>
            {renderToolbar()}
            <div className="blue-orange-chat-message-avatar" onClick={handleAvatarClick}>
                <Avatar user={message.sender.user} height={36} width={36} />
            </div>
            <div className="blue-orange-chat-message-body">
                <div className="blue-orange-chat-message-header">
                    <span className="blue-orange-chat-message-sender">
                        {message.sender.user.name}
                    </span>
                    <span className="blue-orange-chat-message-timestamp">
                        {formatTimestamp(message.timestamp)}
                    </span>
                </div>
                {renderReplyReference()}
                <div
                    className="blue-orange-chat-message-content"
                    dangerouslySetInnerHTML={{ __html: stripTrailingEmptyParagraphs(message.content) }}
                />
                {children}
                {renderThreadIndicator()}
            </div>
        </div>
    );
};
