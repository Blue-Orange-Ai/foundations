import React from 'react';
import moment from 'moment';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { getEventsForDay, isSameMonth, isToday, isWeekend } from '../../utils/calendarUtils';
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
    onEventClick,
    onDayClick,
    onMoreClick,
}) => {
    const dayEvents = getEventsForDay(events, date);
    const visible = dayEvents.slice(0, maxVisibleEvents);
    const overflow = dayEvents.length - visible.length;

    const inMonth = isSameMonth(date, monthDate);
    const today = isToday(date);
    const weekend = isWeekend(date);

    const classNames = [
        'blue-orange-calendar-month-cell',
        !inMonth ? 'blue-orange-calendar-month-cell-other' : '',
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
                <span className={numberClassNames}>{moment(date).date()}</span>
            </div>
            <div className="blue-orange-calendar-month-cell-events">
                {visible.map((event) => (
                    <EventChip
                        key={event.id}
                        event={event}
                        sources={sources}
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
