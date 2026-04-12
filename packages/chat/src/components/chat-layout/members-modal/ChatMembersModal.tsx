import React, { useState, useCallback } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalFooterRight,
    Avatar,
    TagInputUsers,
    Button,
    ButtonType,
    ButtonSize,
} from '@blue-orange-ai/foundations-core';
import { IChatUser, ChatUserStatus } from '../../../interfaces/ChatInterfaces';

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

interface Props {
    members: IChatUser[];
    onClose: () => void;
    onMemberClick?: (user: IChatUser) => void;
    onAddMembers?: (userIds: string[]) => void;
}

export const ChatMembersModal: React.FC<Props> = ({
    members,
    onClose,
    onMemberClick,
    onAddMembers,
}) => {
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const handleTagChange = useCallback((userIds: string[]) => {
        setSelectedUserIds(userIds);
    }, []);

    const handleAddMembers = () => {
        if (onAddMembers && selectedUserIds.length > 0) {
            onAddMembers(selectedUserIds);
        }
    };

    return (
        <Modal width={450} onClose={onClose}>
            <ModalHeader label="Members" onClose={onClose} />
            <ModalBody>
                <div className="blue-orange-chat-members-modal-add-section">
                    <div className="blue-orange-chat-members-modal-add-label">Add members</div>
                    <TagInputUsers
                        placeholder="Search users to add..."
                        onChange={handleTagChange}
                    />
                </div>
                <div className="blue-orange-chat-members-modal-list">
                    {members.map((member) => (
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
                        </div>
                    ))}
                </div>
            </ModalBody>
            <ModalFooter>
                <ModalFooterRight>
                    <div className="blue-orange-chat-members-modal-footer-btns">
                        <Button
                            text="Cancel"
                            buttonType={ButtonType.SECONDARY}
                            size={ButtonSize.SMALL}
                            onClick={onClose}
                        />
                        <Button
                            text="Add"
                            buttonType={ButtonType.PRIMARY}
                            size={ButtonSize.SMALL}
                            onClick={handleAddMembers}
                            isDisabled={selectedUserIds.length === 0}
                        />
                    </div>

                </ModalFooterRight>
            </ModalFooter>
        </Modal>
    );
};
