import React from 'react';
import moment from 'moment';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { getMonthMatrix } from '../../utils/calendarUtils';
import { MonthDayCell } from '../month-day-cell/MonthDayCell';
import './MonthView.css';

interface Props {
    date: Date;
    events: ICalendarEvent[];
    sources?: ICalendarSource[];
    maxVisibleEvents?: number;
    onEventClick?: (event: ICalendarEvent) => void;
    onDayClick?: (date: Date) => void;
    onMoreClick?: (date: Date, events: ICalendarEvent[]) => void;
}

const WEEKDAY_LABELS = moment.weekdaysShort();

/**
 * The month grid view: a weekday header row followed by a 6x7 grid of
 * {@link MonthDayCell} cells, matching Toast UI Calendar's month layout.
 */
export const MonthView: React.FC<Props> = ({
    date,
    events,
    sources = [],
    maxVisibleEvents = 3,
    onEventClick,
    onDayClick,
    onMoreClick,
}) => {
    const weeks = getMonthMatrix(date);

    return (
        <div className="blue-orange-calendar-month-view">
            <div className="blue-orange-calendar-month-weekdays no-select">
                {WEEKDAY_LABELS.map((label, index) => (
                    <div
                        key={label}
                        className={`blue-orange-calendar-month-weekday${
                            index === 0 || index === 6
                                ? ' blue-orange-calendar-month-weekday-weekend'
                                : ''
                        }`}
                    >
                        {label}
                    </div>
                ))}
            </div>
            <div className="blue-orange-calendar-month-grid">
                {weeks.map((week, wi) => (
                    <div className="blue-orange-calendar-month-row" key={wi}>
                        {week.map((day) => (
                            <MonthDayCell
                                key={day.toISOString()}
                                date={day}
                                monthDate={date}
                                events={events}
                                sources={sources}
                                maxVisibleEvents={maxVisibleEvents}
                                onEventClick={onEventClick}
                                onDayClick={onDayClick}
                                onMoreClick={onMoreClick}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
