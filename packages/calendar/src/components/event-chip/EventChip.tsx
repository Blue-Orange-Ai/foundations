import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import {
    eventResponseClass,
    eventResponseState,
    isAllDayEvent,
    resolveEventColors,
    zoned,
} from '../../utils/calendarUtils';
import './EventChip.css';

interface Props {
    event: ICalendarEvent;
    sources?: ICalendarSource[];
    /** IANA timezone the start time is shown in. Defaults to the browser's zone. */
    timezone?: string;
    /** Viewer's email, used to fade events not yet accepted. */
    currentUser?: string;
    onClick?: (event: ICalendarEvent) => void;
}

/**
 * A compact single-line representation of an event, used inside month-view day
 * cells. All-day events render as a solid coloured bar; timed events render with
 * a leading dot and their start time, matching Toast UI Calendar's month grid.
 */
export const EventChip: React.FC<Props> = ({
    event,
    sources = [],
    timezone,
    currentUser,
    onClick,
}) => {
    const allDay = isAllDayEvent(event, timezone);
    const colors = resolveEventColors(event, sources);
    const responseState = eventResponseState(event, currentUser);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick(event);
        }
    };

    const className = `blue-orange-calendar-event-chip no-select${
        allDay ? ' blue-orange-calendar-event-chip-allday' : ''
    }${eventResponseClass('blue-orange-calendar-event-chip', responseState)}`;

    const style: React.CSSProperties = allDay
        ? { backgroundColor: colors.backgroundColor, color: colors.color }
        : { color: colors.color };

    return (
        <div className={className} style={style} onClick={handleClick} title={event.title}>
            {!allDay && (
                <span
                    className="blue-orange-calendar-event-chip-dot"
                    style={{ backgroundColor: colors.borderColor }}
                />
            )}
            {!allDay && (
                <span className="blue-orange-calendar-event-chip-time">
                    {zoned(event.start, timezone).format('h:mm A')}
                </span>
            )}
            <span className="blue-orange-calendar-event-chip-title">{event.title}</span>
        </div>
    );
};
