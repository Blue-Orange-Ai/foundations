import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { ITimedEventLayout } from '../../utils/calendarUtils';
import './TimeGridEvent.css';
interface Props {
    layout: ITimedEventLayout;
    sources?: ICalendarSource[];
    /** IANA timezone the times are shown in. Defaults to the browser's zone. */
    timezone?: string;
    /** Viewer's email, used to fade events not yet accepted. */
    currentUser?: string;
    /** Dims the block while its ghost is being dragged to a new slot. */
    dimmed?: boolean;
    /** Called on mouse down, letting the grid start a move-drag of this event. */
    onMouseDown?: (event: ICalendarEvent, e: React.MouseEvent) => void;
    onClick?: (event: ICalendarEvent) => void;
}
/**
 * A timed event rendered as an absolutely positioned block inside a day column
 * of the week / day time-grid views.
 */
export declare const TimeGridEvent: React.FC<Props>;
export {};
