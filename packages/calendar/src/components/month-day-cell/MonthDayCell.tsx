import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import {
    DEFAULT_NON_WORKING_DAYS,
    getEventsForDay,
    isNonWorkingDay,
    isSameMonth,
    isToday,
    isWeekend,
    zoned,
} from '../../utils/calendarUtils';
import { EventChip } from '../event-chip/EventChip';
import './MonthDayCell.css';

interface Props {
    date: Date;
    /** A date within the month currently being displayed. */
    monthDate: Date;
    events: ICalendarEvent[];
    sources?: ICalendarSource[];
    /** Maximum number of event chips to show before collapsing to "+N more". */
    maxVisibleEvents?: number;
    /** IANA timezone the cell is rendered in. Defaults to the browser's zone. */
    timezone?: string;
    /** Viewer's email, used to fade events not yet accepted. */
    currentUser?: string;
    /** Days of the week (0-6) given the non-working background. */
    nonWorkingDays?: number[];
    onEventClick?: (event: ICalendarEvent) => void;
    onDayClick?: (date: Date) => void;
    onMoreClick?: (date: Date, events: ICalendarEvent[]) => void;
}

/**
 * A single day cell of the month grid: shows the day number, a "today" marker,
 * and up to `maxVisibleEvents` event chips with an overflow indicator.
 */
export const MonthDayCell: React.FC<Props> = ({
    date,
    monthDate,
    events,
    sources = [],
    maxVisibleEvents = 3,
    timezone,
    currentUser,
    nonWorkingDays = DEFAULT_NON_WORKING_DAYS,
    onEventClick,
    onDayClick,
    onMoreClick,
}) => {
    const dayEvents = getEventsForDay(events, date, timezone);
    const visible = dayEvents.slice(0, maxVisibleEvents);
    const overflow = dayEvents.length - visible.length;

    const inMonth = isSameMonth(date, monthDate, timezone);
    const today = isToday(date, timezone);
    const weekend = isWeekend(date, timezone);
    const nonWorking = isNonWorkingDay(date, nonWorkingDays, timezone);

    const classNames = [
        'blue-orange-calendar-month-cell',
        !inMonth ? 'blue-orange-calendar-month-cell-other' : '',
        // Non-working days get their own wash, but only inside the current month
        // so the "other month" cells keep their muted look.
        nonWorking && inMonth ? 'blue-orange-calendar-month-cell-nonworking' : '',
        today ? 'blue-orange-calendar-month-cell-today' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const numberClassNames = [
        'blue-orange-calendar-month-cell-number',
        today ? 'blue-orange-calendar-month-cell-number-today' : '',
        weekend ? 'blue-orange-calendar-month-cell-number-weekend' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const handleDayClick = () => {
        if (onDayClick) {
            onDayClick(date);
        }
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onMoreClick) {
            onMoreClick(date, dayEvents);
        }
    };

    return (
        <div className={classNames} onClick={handleDayClick}>
            <div className="blue-orange-calendar-month-cell-header">
                <span className={numberClassNames}>{zoned(date, timezone).date()}</span>
            </div>
            <div className="blue-orange-calendar-month-cell-events">
                {visible.map((event) => (
                    <EventChip
                        key={event.id}
                        event={event}
                        sources={sources}
                        timezone={timezone}
                        currentUser={currentUser}
                        onClick={onEventClick}
                    />
                ))}
                {overflow > 0 && (
                    <div
                        className="blue-orange-calendar-month-cell-more no-select"
                        onClick={handleMoreClick}
                    >
                        +{overflow} more
                    </div>
                )}
            </div>
        </div>
    );
};
