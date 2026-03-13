import React, { useEffect, useRef } from 'react';
import { IChatMessage, IChatUser } from '../../interfaces/ChatInterfaces';
import { ChatMessage } from '../chat-window/message/ChatMessage';
import { ChatInput } from '../chat-input/ChatInput';
import { TypingIndicator } from '../chat-window/typing-indicator/TypingIndicator';
import { DateSeparator } from '../chat-window/date-separator/DateSeparator';
import { shouldShowDateSeparator } from '../../utils/dateUtils';

import './ThreadPanel.css';

interface Props {
    parentMessage: IChatMessage;
    replies: IChatMessage[];
    onSendReply: (content: string, mentions: string[], attachments: any[]) => void;
    onClose: () => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loading?: boolean;
    typingUsers?: IChatUser[];
    currentUserId?: string;
    onReact?: (message: IChatMessage) => void;
    onAvatarClick?: (user: IChatUser) => void;
}

export const ThreadPanel: React.FC<Props> = ({
    parentMessage,
    replies,
    onSendReply,
    onClose,
    onLoadMore,
    hasMore = false,
    loading = false,
    typingUsers = [],
    currentUserId,
    onReact,
    onAvatarClick
}) => {
    const repliesEndRef = useRef<HTMLDivElement>(null);
    const repliesBodyRef = useRef<HTMLDivElement>(null);
    const prevReplyCountRef = useRef<number>(replies.length);

    useEffect(() => {
        if (replies.length > prevReplyCountRef.current) {
            repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevReplyCountRef.current = replies.length;
    }, [replies.length]);

    useEffect(() => {
        repliesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [parentMessage.id]);

    const handleScroll = () => {
        if (!onLoadMore || !hasMore || loading) return;
        const el = repliesBodyRef.current;
        if (el && el.scrollTop === 0) {
            onLoadMore();
        }
    };

    const renderReplies = () => {
        const elements: React.ReactNode[] = [];

        replies.forEach((reply, index) => {
            const prevDate = index > 0 ? replies[index - 1].timestamp : null;
            if (index > 0 && shouldShowDateSeparator(reply.timestamp, prevDate)) {
                elements.push(
                    <DateSeparator key={`date-${reply.id}`} date={reply.timestamp} />
                );
            }

            const isConsecutive =
                index > 0 &&
                replies[index - 1].sender.user.id === reply.sender.user.id &&
                !shouldShowDateSeparator(reply.timestamp, replies[index - 1].timestamp);

            elements.push(
                <ChatMessage
                    key={reply.id}
                    message={reply}
                    isConsecutive={isConsecutive}
                    onReact={onReact}
                    onAvatarClick={onAvatarClick}
                />
            );
        });

        return elements;
    };

    return (
        <div className="blue-orange-chat-thread-container">
            <div className="blue-orange-chat-thread-header">
                <div className="blue-orange-chat-thread-header-left">
                    <h3 className="blue-orange-chat-thread-title">Thread</h3>
                    {replies.length > 0 && (
                        <span className="blue-orange-chat-thread-reply-count">
                            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                    )}
                </div>
                <button
                    className="blue-orange-chat-thread-close-btn"
                    onClick={onClose}
                    aria-label="Close thread"
                >
                    <i className="ri-close-line" />
                </button>
            </div>

            <div
                className="blue-orange-chat-thread-body"
                ref={repliesBodyRef}
                onScroll={handleScroll}
            >
                <div className="blue-orange-chat-thread-parent">
                    <ChatMessage
                        message={parentMessage}
                        onReact={onReact}
                        onAvatarClick={onAvatarClick}
                    />
                </div>

                {replies.length > 0 && (
                    <div className="blue-orange-chat-thread-separator">
                        <hr className="blue-orange-chat-thread-separator-line" />
                        <span className="blue-orange-chat-thread-separator-text">
                            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                        <hr className="blue-orange-chat-thread-separator-line" />
                    </div>
                )}

                {loading && (
                    <div className="blue-orange-chat-thread-loading">Loading...</div>
                )}
                {renderReplies()}
                {typingUsers.length > 0 && (
                    <TypingIndicator typingUsers={typingUsers} />
                )}
                <div ref={repliesEndRef} />
            </div>

            <div className="blue-orange-chat-thread-input">
                <ChatInput
                    onSend={onSendReply}
                    placeholder="Reply..."
                />
            </div>
        </div>
    );
};
