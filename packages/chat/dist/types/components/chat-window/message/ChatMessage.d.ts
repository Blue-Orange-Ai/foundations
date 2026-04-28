import React from 'react';
import { IChatMessage, IChatUser } from '../../../interfaces/ChatInterfaces';
import './ChatMessage.css';
interface Props {
    message: IChatMessage;
    isConsecutive?: boolean;
    onReply?: (message: IChatMessage) => void;
    onReact?: (message: IChatMessage) => void;
    onAvatarClick?: (user: IChatUser) => void;
    children?: React.ReactNode;
}
export declare const ChatMessage: React.FC<Props>;
export {};
