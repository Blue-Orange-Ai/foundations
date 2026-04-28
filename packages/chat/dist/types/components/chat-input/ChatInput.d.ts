import React from "react";
import { IChatMessage } from "../../interfaces/ChatInterfaces";
import './ChatInput.css';
interface Props {
    onSend: (content: string, mentions: string[], attachments: any[]) => void;
    placeholder?: string;
    replyTo?: IChatMessage | null;
    onCancelReply?: () => void;
    users?: Array<{
        id: string;
        name: string;
    }>;
}
export declare const ChatInput: React.FC<Props>;
export {};
