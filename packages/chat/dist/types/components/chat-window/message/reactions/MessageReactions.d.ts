import React from 'react';
import { IChatReaction } from '../../../../interfaces/ChatInterfaces';
import './MessageReactions.css';
interface Props {
    reactions: IChatReaction[];
    currentUserId: string;
    onToggleReaction?: (emoji: string) => void;
    onAddReaction?: (emoji: string) => void;
}
export declare const MessageReactions: React.FC<Props>;
export {};
