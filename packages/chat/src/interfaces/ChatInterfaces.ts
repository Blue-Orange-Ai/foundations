import React from "react";
import {User, Media} from "@blue-orange-ai/foundations-clients";

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

export interface IChatThread {
    replyCount: number;
    participants: IChatUser[];
    lastReplyTimestamp?: Date;
}

export interface IChatMessageBlock {
    html: string;
    css?: string;
    js?: string;
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
    thread?: IChatThread;
    blocks?: IChatMessageBlock[];
}

export interface IChatBookmark {
    id: string;
    label: string;
    url: string;
    media?: Media;
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
    encrypted?: boolean;
    bookmarks?: IChatBookmark[];
}

export interface IChatGroup {
    label: string;
    conversations: IChatConversation[];
    collapsed: boolean;
    icon?: string;
}

export interface IChatNavItem {
    id: string;
    label: string;
    icon: string;
    badge?: React.ReactNode;
    onClick?: () => void;
}
