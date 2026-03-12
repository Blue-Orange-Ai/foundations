import React, {useCallback, useRef, useState} from "react";
import {RichText} from "@blue-orange-ai/foundations-core";
import {IChatMessage} from "../../interfaces/ChatInterfaces";
import {v4 as uuidv4} from "uuid";

import './ChatInput.css';

interface Props {
    onSend: (content: string, mentions: string[], attachments: any[]) => void;
    placeholder?: string;
    replyTo?: IChatMessage | null;
    onCancelReply?: () => void;
    users?: Array<{ id: string; name: string }>;
}

export const ChatInput: React.FC<Props> = ({
    onSend,
    placeholder = "Type a message...",
    replyTo,
    onCancelReply,
    users
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

    const handleSend = useCallback(() => {
        if (isContentEmpty(content) && attachments.length === 0) {
            return;
        }
        onSend(content, mentions, attachments);
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

    return (
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
    );
};
