import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    ButtonType,
    ButtonSize,
    ButtonIcon,
    ButtonToggle,
    EmojiWrapper,
    Input,
    TimeInput,
    Toggle,
} from '@blue-orange-ai/foundations-core';
import { Avatar as AvatarObj, User } from '@blue-orange-ai/foundations-clients';
import {
    ChatUserStatus,
    IChatUser,
    IUserNotificationSettings,
    IUserSettings,
} from '../../interfaces/ChatInterfaces';

import './UserSettingsView.css';

export const DEFAULT_STATUS_EMOJI: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: '&#x1F600;',
    [ChatUserStatus.AWAY]: '&#x1F319;',
    [ChatUserStatus.DND]: '&#x1F6AB;',
    [ChatUserStatus.OFFLINE]: '&#x1F4A4;',
};

const STATUS_LABEL: Record<ChatUserStatus, string> = {
    [ChatUserStatus.ONLINE]: 'Online',
    [ChatUserStatus.AWAY]: 'Away',
    [ChatUserStatus.DND]: 'Do Not Disturb',
    [ChatUserStatus.OFFLINE]: 'Offline',
};

const STATUS_OPTIONS = [
    { value: ChatUserStatus.ONLINE, label: 'Online', icon: 'ri-circle-fill' },
    { value: ChatUserStatus.AWAY, label: 'Away', icon: 'ri-time-line' },
    { value: ChatUserStatus.DND, label: 'DND', icon: 'ri-notification-off-line' },
    { value: ChatUserStatus.OFFLINE, label: 'Offline', icon: 'ri-circle-line' },
];

interface Props {
    user: IChatUser;
    onSave: (settings: IUserSettings) => void;
    onClose: () => void;
}

const PAUSE_FAR_FUTURE = () => new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);

export const UserSettingsView: React.FC<Props> = ({ user, onSave, onClose }) => {
    const [name, setName] = useState(user.user.name);
    const [avatar, setAvatar] = useState<AvatarObj | undefined>(user.user.avatar);
    const [status, setStatus] = useState<ChatUserStatus>(user.status);
    const [statusText, setStatusText] = useState(user.statusText ?? '');
    const [statusEmoji, setStatusEmoji] = useState(user.statusEmoji ?? '');

    const initialNotifications: IUserNotificationSettings = user.notificationSettings ?? {};
    const [quietStart, setQuietStart] = useState(initialNotifications.quietHoursStart ?? '22:00');
    const [quietEnd, setQuietEnd] = useState(initialNotifications.quietHoursEnd ?? '07:00');
    const [pausedUntil, setPausedUntil] = useState<Date | undefined>(initialNotifications.pausedUntil);

    useEffect(() => {
        setName(user.user.name);
        setAvatar(user.user.avatar);
        setStatus(user.status);
        setStatusText(user.statusText ?? '');
        setStatusEmoji(user.statusEmoji ?? '');
        const notifications = user.notificationSettings ?? {};
        setQuietStart(notifications.quietHoursStart ?? '22:00');
        setQuietEnd(notifications.quietHoursEnd ?? '07:00');
        setPausedUntil(notifications.pausedUntil);
    }, [user.user.id]);

    const isPaused = !!pausedUntil && pausedUntil.getTime() > Date.now();

    const effectiveEmoji = statusEmoji || DEFAULT_STATUS_EMOJI[status];

    const handlePauseToggle = (checked: boolean) => {
        setPausedUntil(checked ? PAUSE_FAR_FUTURE() : undefined);
    };

    const handleSave = () => {
        onSave({
            name: name.trim() || user.user.name || '',
            avatar,
            status,
            statusText: statusText.trim() ? statusText.trim() : undefined,
            statusEmoji: statusEmoji || undefined,
            notificationSettings: {
                quietHoursStart: quietStart || undefined,
                quietHoursEnd: quietEnd || undefined,
                pausedUntil,
            },
        });
    };

    const userForAvatar: User = { ...user.user, name, avatar };

    return (
        <div className="blue-orange-chat-user-settings-view">
            <div className="blue-orange-chat-user-settings-header">
                <span className="blue-orange-chat-user-settings-header-title">User settings</span>
                <ButtonIcon
                    icon="ri-close-line"
                    label="Close user settings"
                    onClick={onClose}
                />
            </div>
            <div className="blue-orange-chat-user-settings-body">
                <div className="blue-orange-chat-user-settings-profile-row">
                    <Avatar
                        user={userForAvatar}
                        edit
                        height={120}
                        width={120}
                        onChange={(next) => setAvatar(next)}
                    />
                    <div className="blue-orange-chat-user-settings-profile-fields">
                        <Input
                            label="Name"
                            value={name}
                            onChange={setName}
                            placeholder="Your name"
                            required
                        />
                    </div>
                </div>

                <div className="blue-orange-chat-user-settings-section">
                    <div className="blue-orange-default-input-label-cont">Status</div>
                    <div className="blue-orange-chat-user-settings-status-row">
                        <ButtonToggle
                            size={ButtonSize.SMALL}
                            value={status}
                            onChange={(v) => setStatus(v as ChatUserStatus)}
                            options={STATUS_OPTIONS}
                        />
                    </div>
                    <div className="blue-orange-chat-user-settings-status-message-row">
                        <EmojiWrapper onSelection={(emoji) => setStatusEmoji(emoji)}>
                            <button
                                type="button"
                                className="blue-orange-chat-user-settings-emoji-btn"
                                title="Pick a status emoji"
                            >
                                <span
                                    className="blue-orange-chat-user-settings-emoji"
                                    dangerouslySetInnerHTML={{ __html: effectiveEmoji }}
                                />
                            </button>
                        </EmojiWrapper>
                        <div className="blue-orange-chat-user-settings-status-text">
                            <Input
                                value={statusText}
                                onChange={setStatusText}
                                placeholder={`What's your status? (${STATUS_LABEL[status]})`}
                            />
                        </div>
                        {statusEmoji && (
                            <ButtonIcon
                                icon="ri-close-line"
                                label="Clear status emoji"
                                onClick={() => setStatusEmoji('')}
                            />
                        )}
                    </div>
                    <div className="blue-orange-chat-user-settings-helper">
                        Pick an emoji or we'll use the default for {STATUS_LABEL[status]}.
                    </div>
                </div>

                <div className="blue-orange-chat-user-settings-section">
                    <div className="blue-orange-default-input-label-cont">Notifications</div>
                    <div className="blue-orange-chat-user-settings-pause-row">
                        <div className="blue-orange-chat-user-settings-pause-info">
                            <div className="blue-orange-chat-user-settings-pause-title">Pause notifications</div>
                            <div className="blue-orange-chat-user-settings-helper">
                                Mute all notifications until you turn them back on.
                            </div>
                        </div>
                        <Toggle checked={isPaused} onChange={handlePauseToggle} />
                    </div>
                    <div className="blue-orange-chat-user-settings-quiet-hours">
                        <div className="blue-orange-default-input-label-cont">
                            Default quiet hours
                        </div>
                        <div className="blue-orange-chat-user-settings-quiet-hours-row">
                            <div className="blue-orange-chat-user-settings-time-field">
                                <TimeInput
                                    label="From"
                                    value={quietStart}
                                    onChange={setQuietStart}
                                />
                            </div>
                            <div className="blue-orange-chat-user-settings-time-field">
                                <TimeInput
                                    label="To"
                                    value={quietEnd}
                                    onChange={setQuietEnd}
                                />
                            </div>
                        </div>
                        <div className="blue-orange-chat-user-settings-helper">
                            Notifications are silenced between these times each day.
                        </div>
                    </div>
                </div>

                <div className="blue-orange-chat-user-settings-actions">
                    <Button
                        text="Save changes"
                        buttonType={ButtonType.PRIMARY}
                        size={ButtonSize.SMALL}
                        onClick={handleSave}
                        isDisabled={name.trim().length === 0}
                    />
                </div>
            </div>
        </div>
    );
};
