import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { eventResponseClass, eventResponseState, resolveEventColors } from '../../utils/calendarUtils';
import { EventAvailabilityMark } from '../event-availability-mark/EventAvailabilityMark';
import './AllDayEvent.css';

interface Props {
    event: ICalendarEvent;
    sources?: ICalendarSource[];
    /** Viewer's email, used to fade events not yet accepted. */
    currentUser?: string;
    onClick?: (event: ICalendarEvent) => void;
}

/**
 * A full-width bar shown in the all-day header row of the week / day views for
 * all-day or multi-day events.
 */
export const AllDayEvent: React.FC<Props> = ({ event, sources = [], currentUser, onClick }) => {
    const colors = resolveEventColors(event, sources);
    const responseState = eventResponseState(event, currentUser);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick(event);
        }
    };

    return (
        <div
            className={`blue-orange-calendar-allday-event no-select${eventResponseClass(
                'blue-orange-calendar-allday-event',
                responseState
            )}`}
            style={{
                backgroundColor: colors.backgroundColor,
                color: colors.color,
                borderLeftColor: colors.borderColor,
            }}
            onClick={handleClick}
            title={event.title}
        >
            <EventAvailabilityMark availability={event.availability} color={colors.borderColor} />
            <span className="blue-orange-calendar-allday-event-text">{event.title}</span>
        </div>
    );
};
