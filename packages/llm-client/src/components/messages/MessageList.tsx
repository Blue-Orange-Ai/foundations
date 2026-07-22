import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ChatMessage } from '../../interfaces/ChatInterfaces';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import './MessageList.css';

interface Props {
    messages: ChatMessage[];
    isRunning: boolean;
    logo?: string;
    logoIsSvg?: boolean;
    onRegenerate?: (messageId: string) => void;
    onFeedback?: (messageId: string, value: 'up' | 'down') => void;
    feedback?: Record<string, 'up' | 'down'>;
}

/**
 * Scrollable transcript. Sticks to the bottom while new content streams in, but
 * releases the moment the user scrolls up (so reading history isn't yanked
 * away), and offers a scroll-to-bottom affordance to re-engage follow mode.
 */
export const MessageList: React.FC<Props> = ({
    messages,
    isRunning,
    logo,
    logoIsSvg,
    onRegenerate,
    onFeedback,
    feedback,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [following, setFollowing] = useState(true);
    const followingRef = useRef(true);
    followingRef.current = following;

    const atBottom = (): boolean => {
        const el = scrollRef.current;
        if (!el) return true;
        return el.scrollHeight - el.clientHeight - el.scrollTop < 60;
    };

    const onScroll = () => {
        const next = atBottom();
        if (next !== followingRef.current) setFollowing(next);
    };

    // Keep pinned to the bottom while following.
    useLayoutEffect(() => {
        if (followingRef.current) {
            bottomRef.current?.scrollIntoView({ block: 'end' });
        }
    }, [messages]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const scrollToBottom = () => {
        setFollowing(true);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id;

    return (
        <div className="blue-orange-llm-message-list" ref={scrollRef}>
            <div className="blue-orange-llm-message-list-inner">
                {messages.map((message) =>
                    message.role === 'user' ? (
                        <UserMessage key={message.id} message={message} />
                    ) : (
                        <AssistantMessage
                            key={message.id}
                            message={message}
                            isLast={message.id === lastAssistantId}
                            logo={logo}
                            logoIsSvg={logoIsSvg}
                            onRegenerate={
                                !isRunning && onRegenerate ? onRegenerate : undefined
                            }
                            onFeedback={onFeedback}
                            feedback={feedback?.[message.id]}
                        />
                    ),
                )}
                <div ref={bottomRef} className="blue-orange-llm-message-list-anchor" />
            </div>

            {!following && (
                <button
                    type="button"
                    className="blue-orange-llm-scroll-bottom"
                    onClick={scrollToBottom}
                    aria-label="Scroll to bottom"
                >
                    <i className="ri-arrow-down-line" />
                </button>
            )}
        </div>
    );
};
