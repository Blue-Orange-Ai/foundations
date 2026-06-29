import React, { useMemo, useState } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    Avatar,
    SearchInput,
} from '@blue-orange-ai/foundations-core';
import { ChatMemberRole, IChatUser, ChatUserStatus } from '../../../interfaces/ChatInterfaces';

import './ChatMembersModal.css';

const statusLabel: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: 'Online',
    [ChatUserStatus.AWAY]: 'Away',
    [ChatUserStatus.DND]: 'Do Not Disturb',
    [ChatUserStatus.OFFLINE]: 'Offline',
};

const statusDotClass: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: 'blue-orange-chat-members-modal-status-dot--online',
    [ChatUserStatus.AWAY]: 'blue-orange-chat-members-modal-status-dot--away',
    [ChatUserStatus.DND]: 'blue-orange-chat-members-modal-status-dot--dnd',
    [ChatUserStatus.OFFLINE]: 'blue-orange-chat-members-modal-status-dot--offline',
};

const roleLabel: Record<ChatMemberRole, string> = {
    [ChatMemberRole.ADMIN]: 'Admin',
    [ChatMemberRole.PARTICIPANT]: 'Participant',
};

interface Props {
    members: IChatUser[];
    onClose: () => void;
    onMemberClick?: (user: IChatUser) => void;
    showRoles?: boolean;
}

export const ChatMembersModal: React.FC<Props> = ({
    members,
    onClose,
    onMemberClick,
    showRoles = false,
}) => {
    const [query, setQuery] = useState('');

    const filteredMembers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return members;
        return members.filter((m) => m.user.name.toLowerCase().includes(q));
    }, [members, query]);

    return (
        <Modal width={450} onClose={onClose}>
            <ModalHeader label={`Members (${members.length})`} onClose={onClose} />
            <ModalBody>
                <div className="blue-orange-chat-members-modal-search">
                    <SearchInput
                        label="Search members"
                        icon="ri-search-line"
                        value={query}
                        onChange={setQuery}
                        timeout={0}
                        deletable
                    />
                </div>
                <div className="blue-orange-chat-members-modal-list">
                    {filteredMembers.length === 0 ? (
                        <div className="blue-orange-chat-members-modal-empty">
                            No members match "{query}".
                        </div>
                    ) : (
                        filteredMembers.map((member) => (
                            <div
                                key={member.user.id}
                                className="blue-orange-chat-members-modal-item"
                                onClick={() => onMemberClick?.(member)}
                            >
                                <Avatar user={member.user} height={32} width={32} />
                                <div className="blue-orange-chat-members-modal-item-info">
                                    <span className="blue-orange-chat-members-modal-item-name">
                                        {member.user.name}
                                    </span>
                                    <span className="blue-orange-chat-members-modal-item-status">
                                        <span
                                            className={`blue-orange-chat-members-modal-status-dot ${statusDotClass[member.status]}`}
                                        />
                                        {statusLabel[member.status]}
                                    </span>
                                </div>
                                {showRoles && member.role && (
                                    <span className="blue-orange-chat-members-modal-item-role">
                                        {roleLabel[member.role]}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
};
