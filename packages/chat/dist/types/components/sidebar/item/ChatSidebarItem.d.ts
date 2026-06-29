import React from "react";
import { IChatConversation } from "../../../interfaces/ChatInterfaces";
import './ChatSidebarItem.css';
interface Props {
    conversation: IChatConversation;
    active?: boolean;
    onClick?: (conversation: IChatConversation) => void;
    onContextMenu?: (e: React.MouseEvent, conversation: IChatConversation) => void;
}
export declare const ChatSidebarItem: React.FC<Props>;
export {};
