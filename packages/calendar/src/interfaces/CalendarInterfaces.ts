/**
 * Public interfaces for the Foundations Calendar package.
 *
 * The event shape mirrors the model used by Toast UI Calendar (nhn/tui.calendar)
 * so that consumers familiar with that library feel at home, while staying
 * dependency-free and aligned with the Foundations conventions.
 */

/**
 * The high level view the calendar is currently rendering.
 */
export enum CalendarView {
    MONTH = 'month',
    WEEK = 'week',
    DAY = 'day',
}

/**
 * How an event is categorised on a time-grid based view.
 *
 * - `TIME`  -> a timed event that occupies a vertical slice of the day grid.
 * - `ALLDAY` -> a full-day event rendered in the all-day header row.
 */
export enum CalendarEventCategory {
    TIME = 'time',
    ALLDAY = 'allday',
}

/**
 * A named calendar (a "source") that events can belong to. Provides the default
 * colours used when an individual event does not override them.
 */
export interface ICalendarSource {
    id: string;
    name: string;
    /** Text / border accent colour. */
    color?: string;
    /** Fill colour behind the event. */
    backgroundColor?: string;
    /** Left border accent colour used on time-grid events. */
    borderColor?: string;
}

/**
 * A single calendar event.
 */
export interface ICalendarEvent {
    id: string;
    /** Id of the {@link ICalendarSource} this event belongs to. */
    calendarId?: string;
    title: string;
    body?: string;
    location?: string;
    /** Inclusive start of the event. */
    start: Date;
    /** Exclusive end of the event. */
    end: Date;
    /** When true the event is rendered as an all-day / multi-day bar. */
    isAllday?: boolean;
    category?: CalendarEventCategory;
    /** Text colour override. */
    color?: string;
    /** Background colour override. */
    backgroundColor?: string;
    /** Left accent border colour override. */
    borderColor?: string;
    /** When true the event cannot be edited by the user. */
    isReadOnly?: boolean;
    /** Arbitrary consumer supplied payload. */
    raw?: unknown;
}
