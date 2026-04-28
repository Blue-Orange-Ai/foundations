import React from "react";
import { IChatUser, ChatUserStatus } from "../../../interfaces/ChatInterfaces";
import './ChatSidebarFooter.css';
interface Props {
    user: IChatUser;
    onStatusChange?: (status: ChatUserStatus) => void;
    onSettingsClick?: () => void;
    onProfileClick?: () => void;
}
export declare const ChatSidebarFooter: React.FC<Props>;
export {};
