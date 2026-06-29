import React from "react";
import './ChatWindow.css';
import { IChatMessage } from "../../interfaces/ChatInterfaces";
interface ChatWindowProps {
    messages: IChatMessage[];
    onLoadMore: () => void;
    loading: boolean;
    hasMore: boolean;
    children?: React.ReactNode;
}
export declare const ChatWindow: React.FC<ChatWindowProps>;
export {};
