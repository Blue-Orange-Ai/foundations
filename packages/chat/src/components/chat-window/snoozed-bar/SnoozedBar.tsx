import React, {FC, useState} from 'react';
import {IChatUser} from '../../../interfaces/ChatInterfaces';
import './SnoozedBar.css';

interface SnoozedBarProps {
    snoozedUsers: IChatUser[];
}

export const SnoozedBar: FC<SnoozedBarProps> = ({snoozedUsers}) => {
    const [expanded, setExpanded] = useState(false);

    if (snoozedUsers.length === 0) {
        return null;
    }

    const names = snoozedUsers.map(u => u.user.name);

    const formatNames = (): React.ReactNode => {
        if (names.length === 1) {
            return <span className="blue-orange-chat-snoozed-text">{names[0]} has notifications snoozed</span>;
        }

        if (names.length === 2) {
            return (
                <span className="blue-orange-chat-snoozed-text">
                    {names[0]} and {names[1]} have notifications snoozed
                </span>
            );
        }

        // 3+ users
        if (expanded) {
            const allButLast = names.slice(0, -1).join(', ');
            return (
                <span className="blue-orange-chat-snoozed-text">
                    {allButLast}, and {names[names.length - 1]} have notifications snoozed{' '}
                    <button
                        className="blue-orange-chat-snoozed-toggle"
                        onClick={() => setExpanded(false)}
                    >
                        show less
                    </button>
                </span>
            );
        }

        const othersCount = names.length - 2;
        return (
            <span className="blue-orange-chat-snoozed-text">
                {names[0]}, {names[1]}, and{' '}
                <button
                    className="blue-orange-chat-snoozed-toggle"
                    onClick={() => setExpanded(true)}
                >
                    {othersCount} {othersCount === 1 ? 'other' : 'others'}
                </button>
                {' '}have notifications snoozed
            </span>
        );
    };

    return (
        <div className="blue-orange-chat-snoozed-bar">
            <span className="blue-orange-chat-snoozed-pill">
                <i className="ri-notification-off-line blue-orange-chat-snoozed-icon" />
                {formatNames()}
            </span>
        </div>
    );
};
