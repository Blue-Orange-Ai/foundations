/// <reference types="moment" />
import moment from 'moment-timezone';
import { CalendarEventResponse, CalendarView, ICalendarEvent, ICalendarRecurrence, ICalendarSource } from '../interfaces/CalendarInterfaces';
/** Height in pixels of a single hour row in the time-grid views. */
export declare const HOUR_HEIGHT = 48;
/** Number of hours in a day. */
export declare const HOURS_IN_DAY = 24;
/**
 * Wraps a value in a moment pinned to `timezone` (an IANA name such as
 * `Europe/London`), falling back to the browser's zone when it is omitted.
 *
 * Every day boundary, position and label in the calendar goes through this, so
 * passing a timezone down renders the whole calendar in that zone.
 */
export declare function zoned(value?: moment.MomentInput, timezone?: string): moment.Moment;
/**
 * The day of the week a calendar week starts on: `0` (Sunday, the default)
 * through `6` (Saturday). `1` starts the week on Monday.
 */
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/**
 * The start of the week containing `m`, honouring an arbitrary
 * {@link WeekStartDay} rather than moment's locale default.
 */
export declare function startOfWeek(m: moment.Moment, weekStartsOn?: WeekStartDay): moment.Moment;
/**
 * Returns a 6x7 matrix of Dates representing the month grid that contains
 * `date`. The grid starts on `weekStartsOn` (Sunday by default) and is padded
 * with the trailing days of the previous month and the leading days of the next
 * month, exactly like Toast UI Calendar's month view.
 */
export declare function getMonthMatrix(date: Date, timezone?: string, weekStartsOn?: WeekStartDay): Date[][];
/**
 * Returns the seven Dates of the week containing `date`, starting on
 * `weekStartsOn` (Sunday by default).
 */
export declare function getWeekDays(date: Date, timezone?: string, weekStartsOn?: WeekStartDay): Date[];
/** Returns an array of hour numbers, `0` through `23`. */
export declare function getDayHours(): number[];
/** Formats an hour (0-23) as a 12h label, e.g. `9 AM`, `12 PM`, `11 PM`. */
export declare function formatHourLabel(hour: number): string;
/**
 * Granularity of the time-grid rows, in minutes. `60` draws one row per hour,
 * `30` subdivides each hour into two half-hour rows.
 */
export type SlotMinutes = 30 | 60;
/** Formats an hour/minute pair as a 12h label, e.g. `9 AM`, `9:30 AM`. */
export declare function formatSlotLabel(hour: number, minute: number): string;
export declare function isSameDay(a: Date, b: Date, timezone?: string): boolean;
export declare function isSameMonth(a: Date, b: Date, timezone?: string): boolean;
export declare function isToday(date: Date, timezone?: string): boolean;
export declare function isWeekend(date: Date, timezone?: string): boolean;
/** The days of the week treated as non-working by default: Saturday & Sunday. */
export declare const DEFAULT_NON_WORKING_DAYS: number[];
/**
 * True when `date` falls on one of `nonWorkingDays` (an array of day-of-week
 * numbers, `0` = Sunday … `6` = Saturday), so the day can be given its own
 * background.
 */
export declare function isNonWorkingDay(date: Date, nonWorkingDays: number[], timezone?: string): boolean;
/**
 * Builds the human readable title for the toolbar given the active view.
 */
export declare function formatViewTitle(date: Date, view: CalendarView, timezone?: string, weekStartsOn?: WeekStartDay): string;
/**
 * Moves `date` forwards (`amount = 1`) or backwards (`amount = -1`) by one unit
 * of the active view.
 */
export declare function navigateDate(date: Date, view: CalendarView, amount: number, timezone?: string): Date;
/** True when the event overlaps the calendar day `day` at all. */
export declare function eventOccursOnDay(event: ICalendarEvent, day: Date, timezone?: string): boolean;
/** True when an event should be treated as an all-day / multi-day bar. */
export declare function isAllDayEvent(event: ICalendarEvent, timezone?: string): boolean;
/**
 * Returns the events occurring on `day`, sorted by start time then by longest
 * duration first (so multi-day / earlier events sit at the top).
 */
export declare function getEventsForDay(events: ICalendarEvent[], day: Date, timezone?: string): ICalendarEvent[];
/** Minutes elapsed since the start of `date`'s calendar day (0 - 1440). */
export declare function minutesSinceStartOfDay(date: Date, timezone?: string): number;
/**
 * Width in pixels kept free on the right of every day column so the column
 * background is always clickable, however many events are laid out on it.
 */
export declare const EVENT_RIGHT_GUTTER = 14;
/**
 * Geometry describing where a timed event should be painted inside a day column.
 * `top` and `height` are pixel values; `left` and `width` are percentages of the
 * column so that overlapping events sit side by side.
 */
export interface ITimedEventLayout {
    event: ICalendarEvent;
    top: number;
    height: number;
    leftPercent: number;
    widthPercent: number;
}
/**
 * Computes the vertical position and side-by-side placement for the timed
 * events on a single day. Overlapping events are split into equal width columns
 * following the same greedy algorithm Toast UI Calendar uses.
 */
export declare function layoutTimedEvents(events: ICalendarEvent[], day: Date, timezone?: string): ITimedEventLayout[];
/** Resolved colours for an event, falling back to its source then to defaults. */
export interface IResolvedEventColors {
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
}
/**
 * Turns an accent colour into the translucent fill used behind an event, so an
 * event given its own colour reads as that colour rather than keeping its
 * source's background. Hex values are converted to `rgba`; anything else (named
 * colours, `rgb(...)`, …) is blended with `color-mix`.
 */
export declare function tintBackground(color: string, alpha?: number): string;
/**
 * Resolves the colours to use for an event: explicit event colours win, then the
 * colours of its {@link ICalendarSource}, then `undefined` (letting the CSS
 * theme variables provide the default).
 *
 * When the event carries its own colour but no explicit background, the fill is
 * derived from that colour so the event renders in it. Events with no colour of
 * their own keep their source's background — the behaviour that lets overlapping
 * shared calendars stay distinguishable.
 */
export declare function resolveEventColors(event: ICalendarEvent, sources?: ICalendarSource[]): IResolvedEventColors;
/** Formats the time range of an event, e.g. `9:00 AM - 10:30 AM`. */
export declare function formatEventTimeRange(event: ICalendarEvent, timezone?: string): string;
/** Formats a start / end pair, e.g. `9:00 AM - 10:30 AM`. */
export declare function formatTimeRange(start: Date, end: Date, timezone?: string): string;
/**
 * The browser's IANA timezone name, e.g. `Europe/London`. Falls back to an
 * empty string in environments without `Intl`.
 */
export declare function getTimezoneName(): string;
/**
 * Short label for a zone's UTC offset, e.g. `GMT`, `GMT+1`, `GMT+5:30`. Uses
 * the browser's zone when `timezone` is omitted.
 */
export declare function formatTimezoneLabel(date?: Date, timezone?: string): string;
/** A timezone the user can pick, ready to list in the picker. */
export interface ITimezoneOption {
    /** IANA name, e.g. `Europe/London`. */
    name: string;
    /** Human readable name, e.g. `Europe / London`. */
    label: string;
    /** Current UTC offset label, e.g. `GMT+1`. */
    offsetLabel: string;
    /** Current UTC offset in minutes, used to order the list. */
    offsetMinutes: number;
}
/**
 * Every IANA timezone moment knows about, ordered west to east and annotated
 * with its current offset.
 */
export declare function getTimezoneOptions(date?: Date): ITimezoneOption[];
/** Granularity a drag selection snaps to, in minutes. */
export declare const SELECTION_SNAP_MINUTES = 15;
/** Title used for an event that has not been given one yet. */
export declare const NEW_EVENT_TITLE = "New event";
/** A reminder offset the user can choose in the event form. */
export interface IReminderOption {
    /** Minutes before the event start; null means "no reminder". */
    minutes: number | null;
    label: string;
}
/** The built-in reminder presets, in ascending order. */
export declare const REMINDER_OPTIONS: IReminderOption[];
/** Default reminder applied to a fresh event: 30 minutes before. */
export declare const DEFAULT_REMINDER_MINUTES = 30;
/** A video conferencing provider that can be attached to an event. */
export interface IConferencingProvider {
    /** Stable id stored on the event, e.g. `teams`. */
    id: string;
    /** Display name, e.g. `Microsoft Teams`. */
    name: string;
    /** Remix icon class shown on the toggle. */
    icon?: string;
}
/** Providers offered by default when the calendar enables conferencing. */
export declare const DEFAULT_CONFERENCING_PROVIDERS: IConferencingProvider[];
/**
 * The description block seeded into the editor for a conferencing provider.
 * Wrapped in a marker so it can be swapped out when the provider changes.
 */
export declare function conferencingBlockHtml(provider: IConferencingProvider): string;
/** Strips any previously seeded conferencing block from description HTML. */
export declare function stripConferencingBlock(html: string): string;
/**
 * Rounds `date` up to the next whole hour in `timezone`, the default start for
 * an event created from the "New event" button.
 */
export declare function nextHour(date: Date, timezone?: string): Date;
/** The date / time strings a native date+time input pair needs, in `timezone`. */
export declare function toInputValues(date: Date, timezone?: string): {
    date: string;
    time: string;
};
/** Rebuilds a Date from a `YYYY-MM-DD` date and `HH:mm` time in `timezone`. */
export declare function fromInputValues(dateStr: string, timeStr: string, timezone?: string): Date;
/**
 * The inclusive date range a view covers, used to expand recurring events only
 * as far as the visible grid. Month spans the full 6-week matrix.
 */
export declare function getViewRange(date: Date, view: CalendarView, timezone?: string, weekStartsOn?: WeekStartDay): {
    start: Date;
    end: Date;
};
/**
 * Expands every recurring event in `events` into its individual occurrences that
 * fall within `[rangeStart, rangeEnd]`. Non-repeating events pass through
 * unchanged. Each generated occurrence carries `recurringEventId` (the master's
 * id) and a unique `id`, and keeps the master's duration.
 */
export declare function expandRecurringEvents(events: ICalendarEvent[], rangeStart: Date, rangeEnd: Date, timezone?: string): ICalendarEvent[];
/** True when `event` repeats or is one occurrence of a repeating series. */
export declare function isRecurring(event: ICalendarEvent): boolean;
/** A short, human readable summary of a recurrence rule, e.g. `Weekly on Monday`. */
export declare function describeRecurrence(recurrence: ICalendarRecurrence, baseDate?: Date, timezone?: string): string;
/** True when `value` looks like a plausible email address. */
export declare function isValidEmail(value: string): boolean;
/**
 * Rounds an offset in minutes to the nearest {@link SELECTION_SNAP_MINUTES},
 * clamped to the bounds of a single day.
 */
export declare function snapMinutes(minutes: number, step?: number): number;
/** Combines a calendar day with an offset in minutes into a Date. */
export declare function dateAtMinutes(day: Date, minutes: number, timezone?: string): Date;
/**
 * Whether the viewer owns `event`. An explicit `isOwn` flag wins; otherwise the
 * event is owned when its `organizer` matches `currentUser`. With no organizer
 * recorded at all the event is assumed to be the viewer's own.
 */
export declare function isOwnEvent(event: ICalendarEvent, currentUser?: string): boolean;
/**
 * The viewer's effective response to `event`. Events the viewer owns are always
 * treated as accepted; everything else falls back to `needs-action`.
 */
export declare function effectiveResponse(event: ICalendarEvent, currentUser?: string): CalendarEventResponse;
/**
 * How an event should read visually given the viewer's response.
 *
 * - `confirmed` -> owned or accepted; drawn at full strength.
 * - `pending`   -> invited but not yet accepted (needs-action / tentative); faded.
 * - `declined`  -> declined; faded and struck through.
 */
export type EventResponseState = 'confirmed' | 'pending' | 'declined';
export declare function eventResponseState(event: ICalendarEvent, currentUser?: string): EventResponseState;
/**
 * Builds the class suffix appended to an event block for its response state, so
 * pending / declined events can be faded via CSS. Returns `''` for confirmed.
 */
export declare function eventResponseClass(base: string, state: EventResponseState): string;
/**
 * A human readable duration for an event, e.g. `30 minutes`, `1 hour`,
 * `1 hour 30 minutes`, `2 days`.
 */
export declare function formatDuration(start: Date, end: Date, timezone?: string): string;
/**
 * The long "when" line shown in the event detail modal, matching the format
 * previously built inline: a single day / time range or a multi-day span.
 */
export declare function formatEventWhen(event: ICalendarEvent, timezone?: string): string;
/** The label of the {@link REMINDER_OPTIONS} preset for `minutes`, or a fallback. */
export declare function formatReminderLabel(minutes: number | null | undefined): string;
