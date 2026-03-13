import React from 'react';
import { EmojiWrapper } from '@blue-orange-ai/foundations-core';
import { IChatReaction } from '../../../../interfaces/ChatInterfaces';

import './MessageReactions.css';

interface Props {
    reactions: IChatReaction[];
    currentUserId: string;
    onToggleReaction?: (emoji: string) => void;
    onAddReaction?: (emoji: string) => void;
}

export const MessageReactions: React.FC<Props> = ({
    reactions,
    currentUserId,
    onToggleReaction,
    onAddReaction
}) => {

    if (reactions.length === 0) {
        return null;
    }

    const handleToggle = (emoji: string) => {
        if (onToggleReaction) {
            onToggleReaction(emoji);
        }
    };

    const handleAddReaction = (emoji: string) => {
        if (onAddReaction) {
            onAddReaction(emoji);
        }
    };

    return (
        <div className="blue-orange-chat-reactions-container">
            {reactions.map((reaction) => {
                const isActive = reaction.userIds.includes(currentUserId);
                const className = isActive
                    ? 'blue-orange-chat-reactions-pill blue-orange-chat-reactions-pill-active'
                    : 'blue-orange-chat-reactions-pill';

                return (
                    <button
                        key={reaction.emoji}
                        className={className}
                        onClick={() => handleToggle(reaction.emoji)}
                    >
                        <span
                            className="blue-orange-chat-reactions-emoji"
                            dangerouslySetInnerHTML={{ __html: reaction.emoji }}
                        />
                        <span className="blue-orange-chat-reactions-count">
                            {reaction.userIds.length}
                        </span>
                    </button>
                );
            })}
            <EmojiWrapper onSelection={handleAddReaction}>
                <button className="blue-orange-chat-reactions-add">
                    <i className="ri-add-line" />
                </button>
            </EmojiWrapper>
        </div>
    );
};
