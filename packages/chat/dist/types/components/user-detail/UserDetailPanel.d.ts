import React from "react";
import { IChatUser } from "../../interfaces/ChatInterfaces";
import './UserDetailPanel.css';
interface Props {
    chatUser: IChatUser;
    onClose: () => void;
    children?: React.ReactNode;
}
export declare const UserDetailPanel: React.FC<Props>;
export {};
