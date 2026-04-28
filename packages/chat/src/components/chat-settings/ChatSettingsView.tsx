import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    ButtonType,
    ButtonSize,
    ButtonIcon,
    ButtonToggle,
    Input,
    TagInputUsers,
    TextArea,
    Toggle,
    Modal,
    ModalHeader,
    ModalBody,
    ModalDescription,
    ModalFooter,
    ModalFooterRight,
} from '@blue-orange-ai/foundations-core';
import {
    ChatConversationType,
    ChatMemberRole,
    ChatUserStatus,
    IChatConversation,
    IChatConversationSettings,
    IChatUser,
} from '../../interfaces/ChatInterfaces';

import './ChatSettingsView.css';

const statusLabel: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: 'Online',
    [ChatUserStatus.AWAY]: 'Away',
    [ChatUserStatus.DND]: 'Do Not Disturb',
    [ChatUserStatus.OFFLINE]: 'Offline',
};

const statusDotClass: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: 'blue-orange-chat-settings-status-dot--online',
    [ChatUserStatus.AWAY]: 'blue-orange-chat-settings-status-dot--away',
    [ChatUserStatus.DND]: 'blue-orange-chat-settings-status-dot--dnd',
    [ChatUserStatus.OFFLINE]: 'blue-orange-chat-settings-status-dot--offline',
};

const ROLE_OPTIONS = [
    { value: ChatMemberRole.PARTICIPANT, label: 'Participant' },
    { value: ChatMemberRole.ADMIN, label: 'Admin' },
];

interface Props {
    conversation: IChatConversation;
    onSave: (settings: IChatConversationSettings) => void;
    onArchive: () => void;
    onDelete: () => void;
    onClose: () => void;
    onUpdateMemberRole?: (userId: string, role: ChatMemberRole) => void;
    onAddMembers?: (userIds: string[]) => void;
}

export const ChatSettingsView: React.FC<Props> = ({
    conversation,
    onSave,
    onArchive,
    onDelete,
    onClose,
    onUpdateMemberRole,
    onAddMembers,
}) => {
    const isChannel = conversation.type === ChatConversationType.CHANNEL;
    const isDm = conversation.type === ChatConversationType.DM;
    const [pendingAddIds, setPendingAddIds] = useState<string[]>([]);
    const [addInputKey, setAddInputKey] = useState(0);

    const handleAddMembers = () => {
        if (pendingAddIds.length === 0) return;
        onAddMembers?.(pendingAddIds);
        setPendingAddIds([]);
        setAddInputKey((k) => k + 1);
    };
    const [name, setName] = useState(conversation.name);
    const [description, setDescription] = useState(conversation.description ?? '');
    const [isPrivate, setIsPrivate] = useState(!!conversation.isPrivate);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        setName(conversation.name);
        setDescription(conversation.description ?? '');
        setIsPrivate(!!conversation.isPrivate);
    }, [conversation.id, conversation.name, conversation.description, conversation.isPrivate]);

    const isDirty =
        name.trim() !== conversation.name ||
        description !== (conversation.description ?? '') ||
        isPrivate !== !!conversation.isPrivate;

    const canSave = name.trim().length > 0 && isDirty;

    const handleSave = () => {
        if (!canSave) return;
        onSave({
            name: name.trim(),
            description: description.trim() ? description.trim() : undefined,
            isPrivate,
        });
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        onDelete();
    };

    return (
        <div className="blue-orange-chat-settings-view">
            <div className="blue-orange-chat-settings-header">
                <span className="blue-orange-chat-settings-header-title">Settings</span>
                <ButtonIcon
                    icon="ri-close-line"
                    label="Close settings"
                    onClick={onClose}
                />
            </div>
            <div className="blue-orange-chat-settings-body">
                <div className="blue-orange-chat-settings-section">
                    <Input
                        label="Title"
                        value={name}
                        onChange={setName}
                        placeholder="Conversation title"
                        required
                    />
                </div>
                <div className="blue-orange-chat-settings-section">
                    <TextArea
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="What is this conversation about?"
                    />
                </div>
                <div className="blue-orange-chat-settings-section blue-orange-chat-settings-toggle-row">
                    <div className="blue-orange-chat-settings-toggle-info">
                        <div className="blue-orange-default-input-label-cont">Private</div>
                        <div className="blue-orange-chat-settings-toggle-help">
                            Only invited members can find or join this conversation.
                        </div>
                    </div>
                    <Toggle checked={isPrivate} onChange={setIsPrivate} />
                </div>

                <div className="blue-orange-chat-settings-section">
                    <div className="blue-orange-default-input-label-cont">
                        Members ({conversation.members.length})
                    </div>
                    {!isDm && (
                        <div className="blue-orange-chat-settings-members-add-row">
                            <div className="blue-orange-chat-settings-members-add-input">
                                <TagInputUsers
                                    key={addInputKey}
                                    placeholder="Search users to add..."
                                    onChange={setPendingAddIds}
                                />
                            </div>
                            <Button
                                text="Add"
                                buttonType={ButtonType.PRIMARY}
                                size={ButtonSize.MEDIUM}
                                onClick={handleAddMembers}
                                isDisabled={pendingAddIds.length === 0}
                            />
                        </div>
                    )}
                    <div
                        className={
                            'blue-orange-chat-settings-members-table' +
                            (isChannel ? ' blue-orange-chat-settings-members-table--with-role' : '')
                        }
                    >
                        <div className="blue-orange-chat-settings-members-header">
                            <span className="blue-orange-chat-settings-members-col-name">Name</span>
                            <span className="blue-orange-chat-settings-members-col-status">Status</span>
                            {isChannel && (
                                <span className="blue-orange-chat-settings-members-col-role">Role</span>
                            )}
                        </div>
                        {conversation.members.map((member: IChatUser) => {
                            const role = member.role ?? ChatMemberRole.PARTICIPANT;
                            return (
                                <div
                                    key={member.user.id}
                                    className="blue-orange-chat-settings-members-row"
                                >
                                    <div className="blue-orange-chat-settings-members-col-name">
                                        <Avatar user={member.user} height={28} width={28} />
                                        <span className="blue-orange-chat-settings-members-name-text">
                                            {member.user.name}
                                        </span>
                                    </div>
                                    <span className="blue-orange-chat-settings-members-col-status">
                                        <span
                                            className={`blue-orange-chat-settings-status-dot ${statusDotClass[member.status]}`}
                                        />
                                        {statusLabel[member.status]}
                                    </span>
                                    {isChannel && (
                                        <span className="blue-orange-chat-settings-members-col-role">
                                            <ButtonToggle
                                                size={ButtonSize.SMALL}
                                                value={role}
                                                onChange={(v) => {
                                                    if (member.user.id) {
                                                        onUpdateMemberRole?.(member.user.id, v as ChatMemberRole);
                                                    }
                                                }}
                                                options={ROLE_OPTIONS}
                                            />
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="blue-orange-chat-settings-danger-zone">
                    <div className="blue-orange-chat-settings-danger-title">Danger zone</div>
                    <div className="blue-orange-chat-settings-danger-row">
                        <div className="blue-orange-chat-settings-danger-info">
                            <div className="blue-orange-chat-settings-danger-row-title">Archive conversation</div>
                            <div className="blue-orange-chat-settings-danger-row-description">
                                Hide this conversation from active lists. It can be restored later.
                            </div>
                        </div>
                        <Button
                            text={conversation.archived ? 'Archived' : 'Archive'}
                            buttonType={ButtonType.SECONDARY}
                            size={ButtonSize.SMALL}
                            onClick={onArchive}
                            isDisabled={!!conversation.archived}
                        />
                    </div>
                    <div className="blue-orange-chat-settings-danger-row">
                        <div className="blue-orange-chat-settings-danger-info">
                            <div className="blue-orange-chat-settings-danger-row-title">Delete conversation</div>
                            <div className="blue-orange-chat-settings-danger-row-description">
                                Permanently delete this conversation and all of its messages.
                            </div>
                        </div>
                        <Button
                            text="Delete"
                            buttonType={ButtonType.DANGER}
                            size={ButtonSize.SMALL}
                            onClick={() => setShowDeleteModal(true)}
                        />
                    </div>
                </div>

                <div className="blue-orange-chat-settings-actions">
                    <Button
                        text="Save changes"
                        buttonType={ButtonType.PRIMARY}
                        size={ButtonSize.SMALL}
                        onClick={handleSave}
                        isDisabled={!canSave}
                    />
                </div>
            </div>

            {showDeleteModal && (
                <Modal width={420} onClose={() => setShowDeleteModal(false)}>
                    <ModalHeader label="Delete conversation" onClose={() => setShowDeleteModal(false)} />
                    <ModalBody>
                        <ModalDescription
                            description={`Are you sure you want to delete "${conversation.name}"? This cannot be undone — all messages and bookmarks will be removed.`}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterRight>
                            <div className="blue-orange-chat-settings-delete-modal-btns">
                                <Button
                                    text="Cancel"
                                    buttonType={ButtonType.SECONDARY}
                                    size={ButtonSize.SMALL}
                                    onClick={() => setShowDeleteModal(false)}
                                />
                                <Button
                                    text="Delete"
                                    buttonType={ButtonType.DANGER}
                                    size={ButtonSize.SMALL}
                                    onClick={handleConfirmDelete}
                                />
                            </div>
                        </ModalFooterRight>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
};
