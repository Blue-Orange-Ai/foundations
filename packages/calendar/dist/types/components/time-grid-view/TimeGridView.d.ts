import React from 'react';
import { CalendarView, ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { WeekStartDay, SlotMinutes } from '../../utils/calendarUtils';
import './TimeGridView.css';
interface Props {
    date: Date;
    /** Either {@link CalendarView.WEEK} or {@link CalendarView.DAY}. */
    view: CalendarView;
    events: ICalendarEvent[];
    sources?: ICalendarSource[];
    /** When true (default) a red line marks the current time. */
    showNowIndicator?: boolean;
    /**
     * When true (default) the grid is scrolled to the current time the first
     * time it is mounted, rather than opening at midnight.
     */
    scrollToCurrentTime?: boolean;
    /**
     * Granularity of the grid rows. `60` (default) draws one row per hour;
     * `30` subdivides each hour into two half-hour rows and labels both.
     */
    slotMinutes?: SlotMinutes;
    /** Viewer's email, used to fade unaccepted events and gate event dragging. */
    currentUser?: string;
    /** Day the week starts on: 0 (Sunday, default) … 6 (Saturday). */
    weekStartsOn?: WeekStartDay;
    /** Days of the week (0-6) given the non-working background. */
    nonWorkingDays?: number[];
    onEventClick?: (event: ICalendarEvent) => void;
    onDayHeaderClick?: (date: Date) => void;
    /**
     * Called with the selected range when the user presses down on an empty part
     * of a day column and drags. Dragging is disabled when this is omitted.
     */
    onRangeSelect?: (start: Date, end: Date) => void;
    /**
     * Called when the viewer drags one of their own events to a new time / day.
     * Enables event dragging when provided.
     */
    onEventMove?: (event: ICalendarEvent, start: Date, end: Date) => void;
    /** Title shown on the draft event block while dragging. */
    newEventTitle?: string;
    /**
     * IANA timezone the grid is rendered in, e.g. `Europe/London`. Defaults to
     * the browser's zone.
     */
    timezone?: string;
    /**
     * Overrides the label shown above the hour gutter, which otherwise shows the
     * timezone's UTC offset, e.g. `GMT+1`. Pass an empty string to hide it.
     */
    timezoneLabel?: string;
    /** When provided, the timezone label becomes clickable. */
    onTimezoneClick?: () => void;
}
/**
 * Shared time-grid based view used for both the week and day views. Renders a
 * left hour gutter, an all-day header row, and one column per day containing
 * absolutely positioned {@link TimeGridEvent} blocks.
 */
export declare const TimeGridView: React.FC<Props>;
export {};
