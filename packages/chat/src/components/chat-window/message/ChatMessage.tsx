import React from 'react';
import moment from 'moment';
import { Avatar } from '@blue-orange-ai/foundations-core';
import { IChatMessage, IChatUser } from '../../../interfaces/ChatInterfaces';

import './ChatMessage.css';

interface Props {
    message: IChatMessage;
    isConsecutive?: boolean;
    onReply?: (message: IChatMessage) => void;
    onReact?: (message: IChatMessage) => void;
    onAvatarClick?: (user: IChatUser) => void;
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
    children
}) => {

    const handleReply = () => {
        if (onReply) {
            onReply(message);
        }
    };

    const handleReact = () => {
        if (onReact) {
            onReact(message);
        }
    };

    const handleAvatarClick = () => {
        if (onAvatarClick) {
            onAvatarClick(message.sender);
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
                <button
                    className="blue-orange-chat-message-toolbar-btn"
                    onClick={handleReact}
                    title="React"
                >
                    <i className="ri-emoji-sticker-line" />
                </button>
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
                        dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                    {children}
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
                    dangerouslySetInnerHTML={{ __html: message.content }}
                />
                {children}
            </div>
        </div>
    );
};
