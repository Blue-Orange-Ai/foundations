import React, { useState } from 'react';
import {
    ButtonIcon,
    TagInputUsers,
    Toggle,
} from '@blue-orange-ai/foundations-core';
import { ChatInput } from '../chat-input/ChatInput';

import './NewChatView.css';

export interface INewChatInitialMessage {
    content: string;
    mentions: string[];
    attachments: any[];
}

interface Props {
    onCreate: (userIds: string[], encrypted: boolean, firstMessage: INewChatInitialMessage) => void;
    onClose: () => void;
}

export const NewChatView: React.FC<Props> = ({ onCreate, onClose }) => {
    const [userIds, setUserIds] = useState<string[]>([]);
    const [encrypted, setEncrypted] = useState(false);

    const canCreate = userIds.length > 0;

    const handleSend = (content: string, mentions: string[], attachments: any[]) => {
        if (!canCreate) return;
        onCreate(userIds, encrypted, { content, mentions, attachments });
    };

    return (
        <div className="blue-orange-chat-new-chat-view">
            <div className="blue-orange-chat-new-chat-header">
                <span className="blue-orange-chat-new-chat-header-title">New chat</span>
                <ButtonIcon
                    icon="ri-close-line"
                    label="Cancel new chat"
                    onClick={onClose}
                />
            </div>
            <div className="blue-orange-chat-new-chat-banner">
                <span className="blue-orange-chat-new-chat-banner-heading">To:</span>
                <div className="blue-orange-chat-new-chat-banner-input">
                    <TagInputUsers
                        placeholder="Add people by name or email..."
                        onChange={setUserIds}
                    />
                </div>
            </div>
            <div className="blue-orange-chat-new-chat-body">
                <div className="blue-orange-chat-new-chat-section blue-orange-chat-new-chat-encryption-row">
                    <div className="blue-orange-chat-new-chat-encryption-info">
                        <div className="blue-orange-default-input-label-cont">
                            End-to-end encryption
                        </div>
                        <div className="blue-orange-chat-new-chat-helper">
                            Messages will be encrypted on your device and only readable by people in this
                            chat. This can only be enabled when creating the chat — it can't be turned on
                            later.
                        </div>
                    </div>
                    <Toggle checked={encrypted} onChange={setEncrypted} />
                </div>

                <div className="blue-orange-chat-new-chat-empty">
                    {canCreate
                        ? 'Type your first message below to start the chat.'
                        : 'Add at least one person above, then send your first message to start the chat.'}
                </div>
            </div>
            <ChatInput
                onSend={handleSend}
                placeholder={
                    canCreate
                        ? 'Type a message to start the chat...'
                        : 'Add at least one person to start the chat...'
                }
            />
        </div>
    );
};
