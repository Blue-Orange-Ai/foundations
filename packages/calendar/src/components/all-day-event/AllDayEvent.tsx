import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { resolveEventColors } from '../../utils/calendarUtils';
import './AllDayEvent.css';

interface Props {
    event: ICalendarEvent;
    sources?: ICalendarSource[];
    onClick?: (event: ICalendarEvent) => void;
}

/**
 * A full-width bar shown in the all-day header row of the week / day views for
 * all-day or multi-day events.
 */
export const AllDayEvent: React.FC<Props> = ({ event, sources = [], onClick }) => {
    const colors = resolveEventColors(event, sources);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick(event);
        }
    };

    return (
        <div
            className="blue-orange-calendar-allday-event no-select"
            style={{
                backgroundColor: colors.backgroundColor,
                color: colors.color,
                borderLeftColor: colors.borderColor,
            }}
            onClick={handleClick}
            title={event.title}
        >
            {event.title}
        </div>
    );
};
