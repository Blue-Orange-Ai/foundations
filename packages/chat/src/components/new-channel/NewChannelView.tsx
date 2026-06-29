import React, { useState } from 'react';
import {
    ButtonIcon,
    Input,
    TagInputUsers,
    Toggle,
} from '@blue-orange-ai/foundations-core';
import { ChatInput } from '../chat-input/ChatInput';

import './NewChannelView.css';

export interface INewChannelInitialMessage {
    content: string;
    mentions: string[];
    attachments: any[];
}

interface Props {
    headerLabel?: string;
    onCreate: (
        name: string,
        userIds: string[],
        encrypted: boolean,
        firstMessage: INewChannelInitialMessage,
    ) => void;
    onClose: () => void;
}

export const NewChannelView: React.FC<Props> = ({
    headerLabel = 'New channel',
    onCreate,
    onClose,
}) => {
    const [name, setName] = useState('');
    const [userIds, setUserIds] = useState<string[]>([]);
    const [encrypted, setEncrypted] = useState(false);

    const trimmedName = name.trim();
    const canCreate = trimmedName.length > 0 && userIds.length > 0;

    const handleSend = (content: string, mentions: string[], attachments: any[]) => {
        if (!canCreate) return;
        onCreate(trimmedName, userIds, encrypted, { content, mentions, attachments });
    };

    let helperText: string;
    if (!trimmedName && userIds.length === 0) {
        helperText = 'Name the channel and add at least one person, then send your first message to create it.';
    } else if (!trimmedName) {
        helperText = 'Name the channel, then send your first message to create it.';
    } else if (userIds.length === 0) {
        helperText = 'Add at least one person, then send your first message to create the channel.';
    } else {
        helperText = 'Type your first message below to create the channel.';
    }

    let placeholder: string;
    if (!trimmedName) {
        placeholder = 'Name the channel to start...';
    } else if (userIds.length === 0) {
        placeholder = 'Add at least one person to start the channel...';
    } else {
        placeholder = `Type a message to start #${trimmedName}...`;
    }

    return (
        <div className="blue-orange-chat-new-channel-view">
            <div className="blue-orange-chat-new-channel-header">
                <span className="blue-orange-chat-new-channel-header-title">{headerLabel}</span>
                <ButtonIcon
                    icon="ri-close-line"
                    label="Cancel new channel"
                    onClick={onClose}
                />
            </div>
            <div className="blue-orange-chat-new-channel-name-row">
                <Input
                    label="Channel name"
                    value={name}
                    onChange={setName}
                    placeholder="e.g. release-planning"
                    required
                />
            </div>
            <div className="blue-orange-chat-new-channel-banner">
                <span className="blue-orange-chat-new-channel-banner-heading">To:</span>
                <div className="blue-orange-chat-new-channel-banner-input">
                    <TagInputUsers
                        placeholder="Add people by name or email..."
                        onChange={setUserIds}
                    />
                </div>
            </div>
            <div className="blue-orange-chat-new-channel-body">
                <div className="blue-orange-chat-new-channel-encryption-row">
                    <div className="blue-orange-chat-new-channel-encryption-info">
                        <div className="blue-orange-default-input-label-cont">
                            End-to-end encryption
                        </div>
                        <div className="blue-orange-chat-new-channel-helper">
                            Messages will be encrypted on your device and only readable by people in this
                            channel. This can only be enabled at creation — it can't be turned on later.
                        </div>
                    </div>
                    <Toggle checked={encrypted} onChange={setEncrypted} />
                </div>

                <div className="blue-orange-chat-new-channel-empty">{helperText}</div>
            </div>
            <ChatInput onSend={handleSend} placeholder={placeholder} />
        </div>
    );
};
