import React, { useEffect, useRef, useState } from 'react';
import tippy, { Instance } from 'tippy.js';
import { EmojiContainer } from '@blue-orange-ai/foundations-core';
import { createRoot, Root } from 'react-dom/client';
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
    const addButtonRef = useRef<HTMLButtonElement | null>(null);
    const tippyInstanceRef = useRef<Instance | null>(null);
    const rootRef = useRef<Root | null>(null);

    useEffect(() => {
        const current = addButtonRef.current;

        if (current) {
            const tooltipNode = document.createElement('div');

            const instance = tippy(current, {
                interactive: true,
                trigger: 'click',
                placement: 'bottom-start',
                appendTo: () => document.body,
                theme: 'light',
                animation: 'fade',
                render: () => {
                    if (!rootRef.current) {
                        rootRef.current = createRoot(tooltipNode);
                    }

                    rootRef.current.render(
                        <EmojiContainer
                            onSelection={(emoji) => {
                                if (onAddReaction) {
                                    onAddReaction(emoji.html);
                                }
                                tippyInstanceRef.current?.hide();
                            }}
                        />
                    );

                    return {
                        popper: tooltipNode,
                        onUpdate: () => {},
                        onDestroy: () => {
                            if (rootRef.current) {
                                rootRef.current.unmount();
                                rootRef.current = null;
                            }
                        }
                    };
                }
            });

            tippyInstanceRef.current = instance;

            return () => {
                tippyInstanceRef.current?.destroy();
                tippyInstanceRef.current = null;
            };
        }
    }, [onAddReaction]);

    if (reactions.length === 0) {
        return null;
    }

    const handleToggle = (emoji: string) => {
        if (onToggleReaction) {
            onToggleReaction(emoji);
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
            <button
                ref={addButtonRef}
                className="blue-orange-chat-reactions-add"
            >
                <i className="ri-add-line" />
            </button>
        </div>
    );
};
