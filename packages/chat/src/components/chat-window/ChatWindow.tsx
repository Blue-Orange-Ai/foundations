import React, {useCallback, useEffect, useRef} from "react";
import './ChatWindow.css';
import {IChatMessage} from "../../interfaces/ChatInterfaces";

interface ChatWindowProps {
    messages: IChatMessage[];
    onLoadMore: () => void;
    loading: boolean;
    hasMore: boolean;
    children?: React.ReactNode;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    messages,
    onLoadMore,
    loading,
    hasMore,
    children
}) => {

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const prevMessagesLengthRef = useRef<number>(messages.length);

    const isNearBottom = useCallback((): boolean => {
        const container = scrollContainerRef.current;
        if (!container) return true;
        const threshold = 100;
        return container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
    }, []);

    const scrollToBottom = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, []);

    // Auto-scroll to bottom on new messages if user is near bottom
    useEffect(() => {
        const newLength = messages.length;
        const prevLength = prevMessagesLengthRef.current;

        if (newLength > prevLength) {
            // New messages were added at the end
            if (isNearBottom()) {
                // Use requestAnimationFrame to ensure DOM has updated
                requestAnimationFrame(() => {
                    scrollToBottom();
                });
            }
        }

        prevMessagesLengthRef.current = newLength;
    }, [messages, isNearBottom, scrollToBottom]);

    // Scroll to bottom on initial mount
    useEffect(() => {
        requestAnimationFrame(() => {
            scrollToBottom();
        });
    }, [scrollToBottom]);

    // IntersectionObserver for infinite scroll upward
    useEffect(() => {
        const sentinel = sentinelRef.current;
        const container = scrollContainerRef.current;
        if (!sentinel || !container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !loading) {
                    onLoadMore();
                }
            },
            {
                root: container,
                rootMargin: '100px 0px 0px 0px',
                threshold: 0
            }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loading, onLoadMore]);

    return (
        <div ref={scrollContainerRef} className="blue-orange-chat-window">
            <div className="blue-orange-chat-window-messages">
                {/* Sentinel element at top for infinite scroll */}
                <div ref={sentinelRef} className="blue-orange-chat-window-sentinel" />

                {/* Loading spinner at top */}
                {loading && (
                    <div className="blue-orange-chat-window-loading">
                        <div className="blue-orange-chat-window-spinner" />
                    </div>
                )}

                {/* Render message components passed as children */}
                {children}
            </div>
        </div>
    );
};
