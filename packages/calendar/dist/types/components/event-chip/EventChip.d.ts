import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
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
export declare const EventChip: React.FC<Props>;
export {};
