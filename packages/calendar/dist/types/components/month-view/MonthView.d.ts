import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { WeekStartDay } from '../../utils/calendarUtils';
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
/**
 * The month grid view: a weekday header row followed by a 6x7 grid of
 * {@link MonthDayCell} cells, matching Toast UI Calendar's month layout.
 */
export declare const MonthView: React.FC<Props>;
export {};
