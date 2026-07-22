import React from 'react';
import moment from 'moment';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { DEFAULT_NON_WORKING_DAYS, getMonthMatrix, WeekStartDay } from '../../utils/calendarUtils';
import { MonthDayCell } from '../month-day-cell/MonthDayCell';
import './MonthView.css';

interface Props {
    date: Date;
    events: ICalendarEvent[];
    sources?: ICalendarSource[];
    maxVisibleEvents?: number;
    /** IANA timezone the grid is rendered in. Defaults to the browser's zone. */
    timezone?: string;
    /** Viewer's email, used to fade events not yet accepted. */
    currentUser?: string;
    /** Day the week starts on: 0 (Sunday, default) … 6 (Saturday). */
    weekStartsOn?: WeekStartDay;
    /** Days of the week (0-6) given the non-working background. */
    nonWorkingDays?: number[];
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
    timezone,
    currentUser,
    weekStartsOn = 0,
    nonWorkingDays = DEFAULT_NON_WORKING_DAYS,
    onEventClick,
    onDayClick,
    onMoreClick,
}) => {
    const weeks = getMonthMatrix(date, timezone, weekStartsOn);
    // The weekday columns, rotated so the header starts on `weekStartsOn`.
    const weekdays = Array.from({ length: 7 }, (_, i) => {
        const day = (weekStartsOn + i) % 7;
        return { day, label: WEEKDAY_LABELS[day] };
    });

    return (
        <div className="blue-orange-calendar-month-view">
            <div className="blue-orange-calendar-month-weekdays no-select">
                {weekdays.map(({ day, label }) => (
                    <div
                        key={day}
                        className={`blue-orange-calendar-month-weekday${
                            day === 0 || day === 6
                                ? ' blue-orange-calendar-month-weekday-weekend'
                                : ''
                        }${
                            nonWorkingDays.includes(day)
                                ? ' blue-orange-calendar-month-weekday-nonworking'
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
                                timezone={timezone}
                                currentUser={currentUser}
                                nonWorkingDays={nonWorkingDays}
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
