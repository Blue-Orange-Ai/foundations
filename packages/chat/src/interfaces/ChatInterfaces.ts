import {User} from "@blue-orange-ai/foundations-clients";

export enum ChatConversationType {
    DM = "DM",
    GROUP = "GROUP",
    CHANNEL = "CHANNEL"
}

export enum ChatUserStatus {
    ONLINE = "ONLINE",
    AWAY = "AWAY",
    DND = "DND",
    OFFLINE = "OFFLINE"
}

export interface IChatUser {
    user: User;
    status: ChatUserStatus;
    snoozeUntil?: Date;
}

export interface IChatReaction {
    emoji: string;
    userIds: string[];
}

export interface IChatMessage {
    id: string;
    content: string;
    sender: IChatUser;
    timestamp: Date;
    reactions: IChatReaction[];
    replyTo?: IChatMessage;
    attachments?: string[];
    edited?: boolean;
}

export interface IChatConversation {
    id: string;
    name: string;
    type: ChatConversationType;
    members: IChatUser[];
    lastMessage?: IChatMessage;
    unreadCount: number;
    starred: boolean;
    typingUsers?: IChatUser[];
}

export interface IChatGroup {
    label: string;
    conversations: IChatConversation[];
    collapsed: boolean;
    icon?: string;
}
