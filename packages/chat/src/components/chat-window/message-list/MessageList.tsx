import React from 'react';
import { ChatMessage } from '../message/ChatMessage';
import { DateSeparator } from '../date-separator/DateSeparator';
import { MessageReactions } from '../message/reactions/MessageReactions';
import { IChatMessage, IChatUser } from '../../../interfaces/ChatInterfaces';
import { shouldShowDateSeparator } from '../../../utils/dateUtils';

const CONSECUTIVE_THRESHOLD_MS = 5 * 60 * 1000;

const isConsecutive = (message: IChatMessage, prevMessage: IChatMessage | null): boolean => {
    if (!prevMessage) return false;
    if (prevMessage.sender.user.id !== message.sender.user.id) return false;
    const timeDiff = new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime();
    if (timeDiff > CONSECUTIVE_THRESHOLD_MS) return false;
    if (shouldShowDateSeparator(message.timestamp, prevMessage.timestamp)) return false;
    return true;
};

interface Props {
    messages: IChatMessage[];
    currentUserId?: string;
    onReply?: (message: IChatMessage) => void;
    onReact?: (message: IChatMessage, emoji: string) => void;
    onEdit?: (message: IChatMessage, newContent: string) => void;
    onAvatarClick?: (user: IChatUser) => void;
    onLinkedMessageClick?: (message: IChatMessage) => void;
}

export const MessageList: React.FC<Props> = ({
    messages,
    currentUserId,
    onReply,
    onReact,
    onEdit,
    onAvatarClick,
    onLinkedMessageClick,
}) => {
    return (
        <>
            {messages.map((message, index) => {
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const prevDate = prevMessage ? prevMessage.timestamp : null;
                const consecutive = isConsecutive(message, prevMessage);
                return (
                    <React.Fragment key={message.id}>
                        {shouldShowDateSeparator(message.timestamp, prevDate) && (
                            <DateSeparator date={message.timestamp} />
                        )}
                        <ChatMessage
                            message={message}
                            isConsecutive={consecutive}
                            currentUserId={currentUserId}
                            onReply={onReply}
                            onReact={onReact ? (_msg, emoji) => onReact(message, emoji) : undefined}
                            onEdit={onEdit}
                            onAvatarClick={onAvatarClick}
                            onThreadClick={onReply}
                            onLinkedMessageClick={onLinkedMessageClick}
                        >
                            {message.reactions && message.reactions.length > 0 && (
                                <MessageReactions
                                    reactions={message.reactions}
                                    currentUserId={currentUserId!}
                                    onToggleReaction={(emoji) => onReact?.(message, emoji)}
                                    onAddReaction={(emoji) => onReact?.(message, emoji)}
                                />
                            )}
                        </ChatMessage>
                    </React.Fragment>
                );
            })}
        </>
    );
};
