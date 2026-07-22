import React from 'react';
import { ICalendarSource } from '../../interfaces/CalendarInterfaces';
import './CalendarSidePanel.css';
interface Props {
    /** Date the mini calendar highlights — the calendar's anchor date. */
    date: Date;
    sources?: ICalendarSource[];
    /** Ids of the sources currently being shown in the main view. */
    visibleSourceIds?: string[];
    /** Heading above the source list. */
    sourcesLabel?: string;
    onDateSelect: (date: Date) => void;
    onSourceToggle?: (sourceId: string, visible: boolean) => void;
}
/**
 * The panel that slides in from the left of the calendar: a mini month picker
 * for jumping to a date, and the list of shared calendars that can be toggled
 * on and off. A plain fixed-width column rather than a `VerticalSplitPage`,
 * since it is not resizable.
 */
export declare const CalendarSidePanel: React.FC<Props>;
export {};
