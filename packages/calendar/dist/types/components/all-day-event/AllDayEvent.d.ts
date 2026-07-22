import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
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
export declare const AllDayEvent: React.FC<Props>;
export {};
