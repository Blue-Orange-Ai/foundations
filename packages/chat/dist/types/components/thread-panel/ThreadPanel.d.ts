import React from 'react';
import { IChatMessage, IChatUser } from '../../interfaces/ChatInterfaces';
import './ThreadPanel.css';
interface Props {
    parentMessage: IChatMessage;
    replies: IChatMessage[];
    onSendReply: (content: string, mentions: string[], attachments: any[]) => void;
    onClose: () => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loading?: boolean;
    typingUsers?: IChatUser[];
    currentUserId?: string;
    onReact?: (message: IChatMessage) => void;
    onAvatarClick?: (user: IChatUser) => void;
}
export declare const ThreadPanel: React.FC<Props>;
export {};
