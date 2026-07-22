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
export declare enum CalendarView {
    MONTH = "month",
    WEEK = "week",
    DAY = "day"
}
/**
 * How an event is categorised on a time-grid based view.
 *
 * - `TIME`  -> a timed event that occupies a vertical slice of the day grid.
 * - `ALLDAY` -> a full-day event rendered in the all-day header row.
 */
export declare enum CalendarEventCategory {
    TIME = "time",
    ALLDAY = "allday"
}
/**
 * How the events of several {@link ICalendarSource}s share the view.
 *
 * - `OVERLAY` -> every calendar's events are drawn in the same grid.
 * - `SIDE_BY_SIDE` -> each calendar gets its own grid, placed side by side.
 */
export declare enum CalendarEventAvailability {
    BUSY = "busy",
    FREE = "free"
}
export declare enum CalendarSourceLayout {
    OVERLAY = "overlay",
    SIDE_BY_SIDE = "side-by-side"
}
/**
 * The viewer's response to an invitation. Events the viewer owns are always
 * treated as {@link CalendarEventResponse.ACCEPTED}.
 *
 * - `NEEDS_ACTION` -> invited but not yet responded (rendered faded).
 * - `ACCEPTED`     -> going.
 * - `DECLINED`     -> not going.
 * - `TENTATIVE`    -> maybe (rendered faded).
 */
export declare enum CalendarEventResponse {
    NEEDS_ACTION = "needs-action",
    ACCEPTED = "accepted",
    DECLINED = "declined",
    TENTATIVE = "tentative"
}
/**
 * Which guests a change to an event should notify. Surfaced when saving an
 * edited, email-backed event.
 */
export declare enum CalendarNotifyScope {
    /** Notify every guest on the event. */
    ALL = "all",
    /** Notify only guests added since the event was opened. */
    NEW = "new",
    /** Do not send any notifications. */
    NONE = "none"
}
/**
 * Whether a delete removes the event for every guest or only from the viewer's
 * own calendar.
 */
export declare enum CalendarDeleteScope {
    EVERYONE = "everyone",
    SELF = "self"
}
/**
 * How often an event repeats.
 *
 * - `DAILY`   -> every day.
 * - `WEEKLY`  -> every week on the event's weekday (or `byWeekday`).
 * - `MONTHLY` -> every month on the event's day of the month.
 * - `YEARLY`  -> every year on the event's date.
 * - `WEEKDAY` -> every weekday, Monday to Friday.
 * - `CUSTOM`  -> a custom interval / unit, with optional weekdays.
 */
export declare enum CalendarRecurrenceFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    WEEKDAY = "weekday",
    CUSTOM = "custom"
}
/** The unit a custom recurrence repeats by. */
export declare enum CalendarRecurrenceUnit {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}
/**
 * Whether an edit or delete applies to a single occurrence of a repeating event
 * or to the whole series.
 */
export declare enum CalendarSeriesScope {
    /** Just this one occurrence. */
    SINGLE = "single",
    /** Every occurrence in the series. */
    SERIES = "series"
}
/**
 * A repetition rule for an event. Modelled on a simplified subset of the iCal
 * RRULE so consumers can map it to a backend.
 */
export interface ICalendarRecurrence {
    frequency: CalendarRecurrenceFrequency;
    /** Repeat every `interval` units (custom recurrences). Defaults to 1. */
    interval?: number;
    /** Weekdays (0 = Sunday … 6 = Saturday) a weekly / custom rule repeats on. */
    byWeekday?: number[];
    /** The unit a `CUSTOM` recurrence repeats by. */
    customUnit?: CalendarRecurrenceUnit;
    /** Stop after this many occurrences. */
    count?: number;
    /** Stop repeating after this date. */
    until?: Date;
    /** Occurrence start times to skip (e.g. an occurrence deleted on its own). */
    exDates?: Date[];
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
    /** Whether the event marks its owner busy or free. */
    availability?: CalendarEventAvailability;
    /**
     * Minutes before the start a reminder should fire. `null` / `undefined`
     * means no reminder.
     */
    reminderMinutes?: number | null;
    /** Emails of the guests whose attendance is required. */
    requiredGuests?: string[];
    /** Emails of the guests whose attendance is optional. */
    optionalGuests?: string[];
    /** Id of the video conferencing provider attached to the event, if any. */
    conferencingProvider?: string;
    /** Email of the person who organised / owns the event. */
    organizer?: string;
    /**
     * Explicit ownership override. When set it wins over the `organizer` /
     * `currentUser` comparison used to decide whether the viewer owns the event.
     */
    isOwn?: boolean;
    /**
     * The viewer's response to the invitation. Ignored for events the viewer
     * owns (those are always treated as accepted).
     */
    response?: CalendarEventResponse;
    /** When set, the event repeats according to this rule. */
    recurrence?: ICalendarRecurrence;
    /**
     * Set on the occurrences generated from a recurring event: the id of the
     * master event they belong to. Absent on non-repeating events.
     */
    recurringEventId?: string;
    /** Arbitrary consumer supplied payload. */
    raw?: unknown;
}
