import React, {useCallback, useRef, useState} from "react";
import {RichText} from "@blue-orange-ai/foundations-core";
import {IChatMessage, IChatUser} from "../../interfaces/ChatInterfaces";
import {SnoozedBar} from "../chat-window/snoozed-bar/SnoozedBar";
import {v4 as uuidv4} from "uuid";

import './ChatInput.css';

interface Props {
    onSend: (content: string, mentions: string[], attachments: any[]) => void;
    placeholder?: string;
    replyTo?: IChatMessage | null;
    onCancelReply?: () => void;
    users?: Array<{ id: string; name: string }>;
    typingUsers?: IChatUser[];
    snoozedUsers?: IChatUser[];
}

export const ChatInput: React.FC<Props> = ({
    onSend,
    placeholder = "Type a message...",
    replyTo,
    onCancelReply,
    users,
    typingUsers = [],
    snoozedUsers = []
}) => {
    const [content, setContent] = useState("");
    const [mentions, setMentions] = useState<string[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [clearState, setClearState] = useState("");

    const handleChange = useCallback((
        newContent: string,
        newMentions: string[],
        newAttachments: any[],
        filesUploading: boolean
    ) => {
        setContent(newContent);
        setMentions(newMentions);
        setAttachments(newAttachments);
    }, []);

    const isContentEmpty = (html: string): boolean => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || "";
        return text.trim().length === 0;
    };

    const stripTrailingEmptyParagraphs = (html: string): string => {
        return html.replace(/(<p>(\s|<br\s*\/?>)*<\/p>)+$/gi, "");
    };

    const handleSend = useCallback(() => {
        if (isContentEmpty(content) && attachments.length === 0) {
            return;
        }
        const cleanedContent = stripTrailingEmptyParagraphs(content);
        onSend(cleanedContent, mentions, attachments);
        setContent("");
        setMentions([]);
        setAttachments([]);
        setClearState(uuidv4());
    }, [content, mentions, attachments, onSend]);

    const truncateContent = (text: string, maxLength: number = 80): string => {
        const tmp = document.createElement("div");
        tmp.innerHTML = text;
        const plainText = tmp.textContent || tmp.innerText || "";
        if (plainText.length <= maxLength) {
            return plainText;
        }
        return plainText.substring(0, maxLength) + "...";
    };

    const getTypingText = (): string | null => {
        if (!typingUsers || typingUsers.length === 0) return null;
        const count = typingUsers.length;
        if (count === 1) return `${typingUsers[0].user.name} is typing...`;
        if (count === 2) return `${typingUsers[0].user.name} and ${typingUsers[1].user.name} are typing...`;
        const othersCount = count - 2;
        return `${typingUsers[0].user.name}, ${typingUsers[1].user.name}, and ${othersCount} ${othersCount === 1 ? 'other is' : 'others are'} typing...`;
    };

    const typingText = getTypingText();

    return (
        <div className="blue-orange-chat-input-wrapper">
            {snoozedUsers.length > 0 && (
                <SnoozedBar snoozedUsers={snoozedUsers} />
            )}
            <div className="blue-orange-chat-input-container">
                {replyTo && (
                    <div className="blue-orange-chat-input-reply-banner">
                        <div className="blue-orange-chat-input-reply-content">
                            <span className="blue-orange-chat-input-reply-label">
                                Replying to <strong>{replyTo.sender.user.name}</strong>
                            </span>
                            <span className="blue-orange-chat-input-reply-snippet">
                                {truncateContent(replyTo.content)}
                            </span>
                        </div>
                        <button
                            className="blue-orange-chat-input-reply-close"
                            onClick={onCancelReply}
                            aria-label="Cancel reply"
                        >
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                )}
                <div className="blue-orange-chat-input-editor-row">
                    <div className="blue-orange-chat-input-editor">
                        <RichText
                            placeholder={placeholder}
                            allowEmojis={true}
                            allowMentions={true}
                            displayFormatting={true}
                            singleLine={true}
                            clearState={clearState}
                            onChange={handleChange}
                            onEnter={handleSend}
                        />
                    </div>
                    <button
                        className={`blue-orange-chat-input-send-btn ${
                            !isContentEmpty(content) || attachments.length > 0
                                ? "blue-orange-chat-input-send-btn-active"
                                : ""
                        }`}
                        onClick={handleSend}
                        aria-label="Send message"
                    >
                        <i className="ri-send-plane-2-fill"></i>
                    </button>
                </div>
            </div>
            {typingText && (
                <div className="blue-orange-chat-input-typing">
                    {typingText}
                </div>
            )}
        </div>
    );
};
