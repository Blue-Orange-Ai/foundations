import React from "react";
import { IChatConversation } from "../../../interfaces/ChatInterfaces";
import './ChatSidebarGroup.css';
interface Props {
    label: string;
    conversations: IChatConversation[];
    collapsed?: boolean;
    onToggle?: () => void;
    onCreateNew?: () => void;
    icon?: string;
    activeConversationId?: string;
    onConversationClick?: (conversation: IChatConversation) => void;
    onConversationContextMenu?: (e: React.MouseEvent, conversation: IChatConversation) => void;
}
export declare const ChatSidebarGroup: React.FC<Props>;
export {};
