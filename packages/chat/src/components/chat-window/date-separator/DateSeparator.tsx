import React from 'react';
import { formatDateSeparator } from '../../../utils/dateUtils';
import './DateSeparator.css';

interface DateSeparatorProps {
    date: Date;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
    return (
        <div className="blue-orange-chat-date-separator">
            <hr className="blue-orange-chat-date-separator-line" />
            <span className="blue-orange-chat-date-separator-label">
                {formatDateSeparator(date)}
            </span>
            <hr className="blue-orange-chat-date-separator-line" />
        </div>
    );
};

export { DateSeparator, DateSeparatorProps };
