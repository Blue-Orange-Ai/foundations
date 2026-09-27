import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import { Avatar, EmojiWrapper, RichText, Button, ButtonType, ButtonSize, RenderRichText, RichTextDocument } from '@blue-orange-ai/foundations-core';
import { IChatMessage, IChatMessageBlock, IChatUser } from '../../../interfaces/ChatInterfaces';
import { isMessageContentEmpty, serializeMessageContent, trimTrailingEmptyParagraphs } from '../../../utils/messageContent';

import './ChatMessage.css';

const MAX_THREAD_AVATARS = 5;

interface Props {
    message: IChatMessage;
    isConsecutive?: boolean;
    currentUserId?: string;
    onReply?: (message: IChatMessage) => void;
    onReact?: (message: IChatMessage, emoji: string) => void;
    onEdit?: (message: IChatMessage, newContent: string) => void;
    onAvatarClick?: (user: IChatUser) => void;
    onThreadClick?: (message: IChatMessage) => void;
    onLinkedMessageClick?: (message: IChatMessage) => void;
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

const buildBlockSrcdoc = (block: IChatMessageBlock): string => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
${block.css || ''}
</style>
</head>
<body>
${block.html}
${block.js ? `<script>${block.js}<\/script>` : ''}
<script>
function notifyParentHeight() {
    var height = document.body.scrollHeight;
    window.parent.postMessage({ type: 'blue-orange-block-resize', height: height }, '*');
}
new MutationObserver(notifyParentHeight).observe(document.body, { childList: true, subtree: true, attributes: true });
window.addEventListener('load', notifyParentHeight);
notifyParentHeight();
<\/script>
</body>
</html>`;
};

const ChatMessageBlockFrame: React.FC<{ block: IChatMessageBlock }> = ({ block }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'blue-orange-block-resize' && iframeRef.current) {
                if (event.source === iframeRef.current.contentWindow) {
                    iframeRef.current.style.height = event.data.height + 'px';
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <iframe
            ref={iframeRef}
            className="blue-orange-chat-message-block-frame"
            srcDoc={buildBlockSrcdoc(block)}
            sandbox="allow-scripts"
            title="Message block"
        />
    );
};

export const ChatMessage: React.FC<Props> = ({
    message,
    isConsecutive = false,
    currentUserId,
    onReply,
    onReact,
    onEdit,
    onAvatarClick,
    onThreadClick,
    onLinkedMessageClick,
    children
}) => {
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState<RichTextDocument | string>('');
    // Parsed once per content, not on every render: legacy HTML goes through
    // the editor schema, which is not free, and a message list re-renders often.
    const content = useMemo(() => trimTrailingEmptyParagraphs(message.content), [message.content]);
    const linkedContent = useMemo(
        () => (message.replyTo ? trimTrailingEmptyParagraphs(message.replyTo.content) : undefined),
        [message.replyTo?.content]
    );

    const isOwnMessage = currentUserId != null && message.sender.user.id === currentUserId;

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

    const handleStartEdit = () => {
        setEditContent(message.content);
        setEditing(true);
    };

    const handleEditChange = useCallback((document: RichTextDocument) => {
        setEditContent(document);
    }, []);

    const handleSaveEdit = useCallback(() => {
        if (onEdit && !isMessageContentEmpty(editContent)) {
            onEdit(message, serializeMessageContent(editContent));
        }
        setEditing(false);
    }, [editContent, message, onEdit]);

    const handleCancelEdit = useCallback(() => {
        setEditing(false);
    }, []);

    const handleLinkedMessageClick = () => {
        if (message.replyTo && onLinkedMessageClick) {
            onLinkedMessageClick(message.replyTo);
        }
    };

    const renderReplyReference = () => {
        if (!message.replyTo) return null;
        const linked = message.replyTo;
        return (
            <div
                className="blue-orange-chat-message-linked"
                data-message-id={linked.id}
                onClick={handleLinkedMessageClick}
            >
                <div className="blue-orange-chat-message-linked-line" />
                <div className="blue-orange-chat-message-linked-content">
                    <div className="blue-orange-chat-message-linked-avatar">
                        <Avatar user={linked.sender.user} height={36} width={36} />
                    </div>
                    <div className="blue-orange-chat-message-linked-body">
                        <div className="blue-orange-chat-message-header">
                            <span className="blue-orange-chat-message-sender">
                                {linked.sender.user.name}
                            </span>
                            <span className="blue-orange-chat-message-timestamp">
                                {formatTimestamp(linked.timestamp)}
                            </span>
                        </div>
                        <div className="blue-orange-chat-message-content">
                            <RenderRichText content={linkedContent} />
                        </div>
                        {linked.edited && (
                            <span className="blue-orange-chat-message-edited">(edited)</span>
                        )}
                    </div>
                </div>
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

    const renderEditedLabel = () => {
        if (!message.edited) return null;
        return (
            <span className="blue-orange-chat-message-edited">(edited)</span>
        );
    };

    const renderEditMode = () => {
        return (
            <div className="blue-orange-chat-message-edit-container">
                <div className="blue-orange-chat-message-edit-editor">
                    <RichText
                        placeholder="Edit message..."
                        allowEmojis={true}
                        allowMentions={true}
                        displayFormatting={true}
                        singleLine={true}
                        content={message.content}
                        focus={true}
                        onChange={(_html, _mentions, _attachments, _uploading, document) => handleEditChange(document)}
                        onEnter={handleSaveEdit}
                    />
                </div>
                <div className="blue-orange-chat-message-edit-actions">
                    <Button
                        text="Cancel"
                        buttonType={ButtonType.SECONDARY}
                        size={ButtonSize.SMALL}
                        onClick={handleCancelEdit}
                    />
                    <Button
                        text="Save"
                        buttonType={ButtonType.PRIMARY}
                        size={ButtonSize.SMALL}
                        onClick={handleSaveEdit}
                    />
                </div>
            </div>
        );
    };

    const renderBlocks = () => {
        if (!message.blocks || message.blocks.length === 0) return null;
        return (
            <div className="blue-orange-chat-message-blocks">
                {message.blocks.map((block, index) => (
                    <ChatMessageBlockFrame key={`${message.id}-block-${index}`} block={block} />
                ))}
            </div>
        );
    };

    const renderContent = () => {
        if (editing) {
            return renderEditMode();
        }
        return (
            <>
                {/* Another member's words: rendered from the document, never as markup. */}
                <div className="blue-orange-chat-message-content">
                    <RenderRichText content={content} />
                </div>
                {renderEditedLabel()}
            </>
        );
    };

    const renderToolbar = () => {
        if (editing) return null;
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
                {isOwnMessage && onEdit && (
                    <button
                        className="blue-orange-chat-message-toolbar-btn"
                        onClick={handleStartEdit}
                        title="Edit"
                    >
                        <i className="ri-pencil-line" />
                    </button>
                )}
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
                    {renderContent()}
                    {renderBlocks()}
                    {children}
                    {renderThreadIndicator()}
                </div>
            </div>
        );
    }

    return (
        <div className="blue-orange-chat-message blue-orange-chat-message-group-start" data-message-id={message.id}>
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
                {renderContent()}
                {renderBlocks()}
                {children}
                {renderThreadIndicator()}
            </div>
        </div>
    );
};
