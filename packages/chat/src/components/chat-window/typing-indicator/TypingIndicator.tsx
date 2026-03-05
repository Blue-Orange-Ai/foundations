import React from 'react';
import {IChatUser} from '../../../interfaces/ChatInterfaces';
import './TypingIndicator.css';

interface TypingIndicatorProps {
    typingUsers: IChatUser[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({typingUsers}) => {
    if (!typingUsers || typingUsers.length === 0) {
        return null;
    }

    const getTypingText = (): string => {
        const count = typingUsers.length;
        if (count === 1) {
            return `${typingUsers[0].user.name} is typing`;
        }
        if (count === 2) {
            return `${typingUsers[0].user.name} and ${typingUsers[1].user.name} are typing`;
        }
        const othersCount = count - 2;
        return `${typingUsers[0].user.name}, ${typingUsers[1].user.name}, and ${othersCount} ${othersCount === 1 ? 'other is' : 'others are'} typing`;
    };

    return (
        <div className="blue-orange-chat-typing-container">
            <span className="blue-orange-chat-typing-text">{getTypingText()}</span>
            <span className="blue-orange-chat-typing-dots">
                <span className="blue-orange-chat-typing-dot"></span>
                <span className="blue-orange-chat-typing-dot"></span>
                <span className="blue-orange-chat-typing-dot"></span>
            </span>
        </div>
    );
};
