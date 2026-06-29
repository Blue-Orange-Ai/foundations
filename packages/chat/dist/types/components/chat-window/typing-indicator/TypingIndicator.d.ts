import React from 'react';
import { IChatUser } from '../../../interfaces/ChatInterfaces';
import './TypingIndicator.css';
interface TypingIndicatorProps {
    typingUsers: IChatUser[];
}
export declare const TypingIndicator: React.FC<TypingIndicatorProps>;
export {};
