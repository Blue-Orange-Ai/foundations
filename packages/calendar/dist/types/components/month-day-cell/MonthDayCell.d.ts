import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
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
export declare const MonthDayCell: React.FC<Props>;
export {};
