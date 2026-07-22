import moment from 'moment-timezone';
import momentTz from 'moment-timezone';
import {
    CalendarEventResponse,
    CalendarRecurrenceFrequency,
    CalendarRecurrenceUnit,
    CalendarView,
    ICalendarEvent,
    ICalendarRecurrence,
    ICalendarSource,
} from '../interfaces/CalendarInterfaces';

/** Height in pixels of a single hour row in the time-grid views. */
export const HOUR_HEIGHT = 48;

/** Number of hours in a day. */
export const HOURS_IN_DAY = 24;

/**
 * Wraps a value in a moment pinned to `timezone` (an IANA name such as
 * `Europe/London`), falling back to the browser's zone when it is omitted.
 *
 * Every day boundary, position and label in the calendar goes through this, so
 * passing a timezone down renders the whole calendar in that zone.
 */
export function zoned(value?: moment.MomentInput, timezone?: string): moment.Moment {
    if (value === undefined) {
        return timezone ? moment.tz(timezone) : moment();
    }
    return timezone ? moment.tz(value, timezone) : moment(value);
}

/**
 * The day of the week a calendar week starts on: `0` (Sunday, the default)
 * through `6` (Saturday). `1` starts the week on Monday.
 */
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * The start of the week containing `m`, honouring an arbitrary
 * {@link WeekStartDay} rather than moment's locale default.
 */
export function startOfWeek(m: moment.Moment, weekStartsOn: WeekStartDay = 0): moment.Moment {
    const diff = (m.day() - weekStartsOn + 7) % 7;
    return m.clone().subtract(diff, 'days').startOf('day');
}

/**
 * Returns a 6x7 matrix of Dates representing the month grid that contains
 * `date`. The grid starts on `weekStartsOn` (Sunday by default) and is padded
 * with the trailing days of the previous month and the leading days of the next
 * month, exactly like Toast UI Calendar's month view.
 */
export function getMonthMatrix(
    date: Date,
    timezone?: string,
    weekStartsOn: WeekStartDay = 0
): Date[][] {
    const start = startOfWeek(zoned(date, timezone).startOf('month'), weekStartsOn);
    const weeks: Date[][] = [];
    const cursor = start.clone();
    for (let w = 0; w < 6; w++) {
        const week: Date[] = [];
        for (let d = 0; d < 7; d++) {
            week.push(cursor.toDate());
            cursor.add(1, 'day');
        }
        weeks.push(week);
    }
    return weeks;
}

/**
 * Returns the seven Dates of the week containing `date`, starting on
 * `weekStartsOn` (Sunday by default).
 */
export function getWeekDays(
    date: Date,
    timezone?: string,
    weekStartsOn: WeekStartDay = 0
): Date[] {
    const start = startOfWeek(zoned(date, timezone), weekStartsOn);
    return Array.from({ length: 7 }, (_, i) => start.clone().add(i, 'day').toDate());
}

/** Returns an array of hour numbers, `0` through `23`. */
export function getDayHours(): number[] {
    return Array.from({ length: HOURS_IN_DAY }, (_, i) => i);
}

/** Formats an hour (0-23) as a 12h label, e.g. `9 AM`, `12 PM`, `11 PM`. */
export function formatHourLabel(hour: number): string {
    return moment().hour(hour).minute(0).format('h A');
}

/**
 * Granularity of the time-grid rows, in minutes. `60` draws one row per hour,
 * `30` subdivides each hour into two half-hour rows.
 */
export type SlotMinutes = 30 | 60;

/** Formats an hour/minute pair as a 12h label, e.g. `9 AM`, `9:30 AM`. */
export function formatSlotLabel(hour: number, minute: number): string {
    const time = moment().hour(hour).minute(minute);
    return minute === 0 ? time.format('h A') : time.format('h:mm A');
}

export function isSameDay(a: Date, b: Date, timezone?: string): boolean {
    return zoned(a, timezone).isSame(b, 'day');
}

export function isSameMonth(a: Date, b: Date, timezone?: string): boolean {
    return zoned(a, timezone).isSame(b, 'month');
}

export function isToday(date: Date, timezone?: string): boolean {
    return zoned(date, timezone).isSame(zoned(undefined, timezone), 'day');
}

export function isWeekend(date: Date, timezone?: string): boolean {
    const day = zoned(date, timezone).day();
    return day === 0 || day === 6;
}

/** The days of the week treated as non-working by default: Saturday & Sunday. */
export const DEFAULT_NON_WORKING_DAYS: number[] = [0, 6];

/**
 * True when `date` falls on one of `nonWorkingDays` (an array of day-of-week
 * numbers, `0` = Sunday … `6` = Saturday), so the day can be given its own
 * background.
 */
export function isNonWorkingDay(
    date: Date,
    nonWorkingDays: number[],
    timezone?: string
): boolean {
    return nonWorkingDays.includes(zoned(date, timezone).day());
}

/**
 * Builds the human readable title for the toolbar given the active view.
 */
export function formatViewTitle(
    date: Date,
    view: CalendarView,
    timezone?: string,
    weekStartsOn: WeekStartDay = 0
): string {
    const m = zoned(date, timezone);
    if (view === CalendarView.MONTH) {
        return m.format('MMMM YYYY');
    }
    if (view === CalendarView.DAY) {
        return m.format('dddd, MMMM D, YYYY');
    }
    // Week view -> show the span, collapsing shared month/year.
    const start = startOfWeek(m, weekStartsOn);
    const end = start.clone().add(6, 'days');
    if (start.isSame(end, 'month')) {
        return `${start.format('MMMM D')} - ${end.format('D, YYYY')}`;
    }
    if (start.isSame(end, 'year')) {
        return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
    }
    return `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`;
}

/**
 * Moves `date` forwards (`amount = 1`) or backwards (`amount = -1`) by one unit
 * of the active view.
 */
export function navigateDate(
    date: Date,
    view: CalendarView,
    amount: number,
    timezone?: string
): Date {
    const unit = view === CalendarView.MONTH ? 'month' : view === CalendarView.WEEK ? 'week' : 'day';
    return zoned(date, timezone).add(amount, unit).toDate();
}

/** True when the event overlaps the calendar day `day` at all. */
export function eventOccursOnDay(event: ICalendarEvent, day: Date, timezone?: string): boolean {
    const dayStart = zoned(day, timezone).startOf('day');
    const dayEnd = zoned(day, timezone).endOf('day');
    return moment(event.start).isSameOrBefore(dayEnd) && moment(event.end).isSameOrAfter(dayStart);
}

/** True when an event should be treated as an all-day / multi-day bar. */
export function isAllDayEvent(event: ICalendarEvent, timezone?: string): boolean {
    if (event.isAllday) {
        return true;
    }
    // Events spanning more than one calendar day render as all-day bars.
    return !zoned(event.start, timezone).isSame(event.end, 'day');
}

/**
 * Returns the events occurring on `day`, sorted by start time then by longest
 * duration first (so multi-day / earlier events sit at the top).
 */
export function getEventsForDay(
    events: ICalendarEvent[],
    day: Date,
    timezone?: string
): ICalendarEvent[] {
    return events
        .filter((e) => eventOccursOnDay(e, day, timezone))
        .sort((a, b) => {
            const startDiff = moment(a.start).valueOf() - moment(b.start).valueOf();
            if (startDiff !== 0) {
                return startDiff;
            }
            const aDur = moment(a.end).valueOf() - moment(a.start).valueOf();
            const bDur = moment(b.end).valueOf() - moment(b.start).valueOf();
            return bDur - aDur;
        });
}

/** Minutes elapsed since the start of `date`'s calendar day (0 - 1440). */
export function minutesSinceStartOfDay(date: Date, timezone?: string): number {
    const m = zoned(date, timezone);
    return m.hours() * 60 + m.minutes();
}

/**
 * Width in pixels kept free on the right of every day column so the column
 * background is always clickable, however many events are laid out on it.
 */
export const EVENT_RIGHT_GUTTER = 14;

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
export function layoutTimedEvents(
    events: ICalendarEvent[],
    day: Date,
    timezone?: string
): ITimedEventLayout[] {
    const dayStart = zoned(day, timezone).startOf('day');
    const dayEnd = zoned(day, timezone).endOf('day');

    const timed = events
        .filter((e) => !isAllDayEvent(e, timezone))
        .sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf());

    // Assign each event to the first free column; a fresh cluster starts once no
    // active event overlaps the current one.
    const columns: ICalendarEvent[][] = [];
    const columnIndexByEvent = new Map<string, number>();
    const clusterByEvent = new Map<string, ICalendarEvent[]>();

    let cluster: ICalendarEvent[] = [];
    let clusterEnd: moment.Moment | null = null;

    const flush = () => {
        cluster.forEach((e) => clusterByEvent.set(e.id, cluster));
        cluster = [];
        columns.length = 0;
    };

    timed.forEach((event) => {
        const start = moment.max(moment(event.start), dayStart);
        if (clusterEnd && start.isSameOrAfter(clusterEnd)) {
            flush();
            clusterEnd = null;
        }

        let placed = false;
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const last = col[col.length - 1];
            if (moment.min(moment(last.end), dayEnd).isSameOrBefore(start)) {
                col.push(event);
                columnIndexByEvent.set(event.id, i);
                placed = true;
                break;
            }
        }
        if (!placed) {
            columns.push([event]);
            columnIndexByEvent.set(event.id, columns.length - 1);
        }

        cluster.push(event);
        const end = moment.min(moment(event.end), dayEnd);
        clusterEnd = clusterEnd ? moment.max(clusterEnd, end) : end;
    });
    flush();

    return timed.map((event) => {
        const start = moment.max(moment(event.start), dayStart);
        const end = moment.min(moment(event.end), dayEnd);
        const startMinutes = start.diff(dayStart, 'minutes');
        const durationMinutes = Math.max(15, end.diff(start, 'minutes'));

        const clusterEvents = clusterByEvent.get(event.id) ?? [event];
        const clusterColumns = new Set<number>();
        clusterEvents.forEach((e) => clusterColumns.add(columnIndexByEvent.get(e.id) ?? 0));
        const columnCount = Math.max(1, clusterColumns.size);
        const columnIndex = columnIndexByEvent.get(event.id) ?? 0;

        return {
            event,
            top: (startMinutes / 60) * HOUR_HEIGHT,
            height: (durationMinutes / 60) * HOUR_HEIGHT,
            leftPercent: (columnIndex / columnCount) * 100,
            widthPercent: (1 / columnCount) * 100,
        };
    });
}

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
export function tintBackground(color: string, alpha = 0.16): string {
    const hex = color.trim();
    const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
    if (match) {
        let value = match[1];
        if (value.length === 3) {
            value = value
                .split('')
                .map((c) => c + c)
                .join('');
        }
        const r = parseInt(value.slice(0, 2), 16);
        const g = parseInt(value.slice(2, 4), 16);
        const b = parseInt(value.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}

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
export function resolveEventColors(
    event: ICalendarEvent,
    sources: ICalendarSource[] = []
): IResolvedEventColors {
    const source = sources.find((s) => s.id === event.calendarId);
    // A colour set on the event itself, ignoring any inherited from its source.
    const ownColor = event.color ?? event.borderColor;
    return {
        color: event.color ?? source?.color,
        backgroundColor:
            event.backgroundColor ??
            (ownColor ? tintBackground(ownColor) : source?.backgroundColor),
        borderColor: event.borderColor ?? source?.borderColor ?? event.color ?? source?.color,
    };
}

/** Formats the time range of an event, e.g. `9:00 AM - 10:30 AM`. */
export function formatEventTimeRange(event: ICalendarEvent, timezone?: string): string {
    return formatTimeRange(event.start, event.end, timezone);
}

/** Formats a start / end pair, e.g. `9:00 AM - 10:30 AM`. */
export function formatTimeRange(start: Date, end: Date, timezone?: string): string {
    return `${zoned(start, timezone).format('h:mm A')} - ${zoned(end, timezone).format('h:mm A')}`;
}

/**
 * The browser's IANA timezone name, e.g. `Europe/London`. Falls back to an
 * empty string in environments without `Intl`.
 */
export function getTimezoneName(): string {
    return moment.tz.guess() ?? '';
}

/**
 * Short label for a zone's UTC offset, e.g. `GMT`, `GMT+1`, `GMT+5:30`. Uses
 * the browser's zone when `timezone` is omitted.
 */
export function formatTimezoneLabel(date: Date = new Date(), timezone?: string): string {
    const offsetMinutes = zoned(date, timezone).utcOffset();
    if (offsetMinutes === 0) {
        return 'GMT';
    }
    const sign = offsetMinutes > 0 ? '+' : '-';
    const abs = Math.abs(offsetMinutes);
    const hours = Math.floor(abs / 60);
    const minutes = abs % 60;
    return `GMT${sign}${hours}${minutes === 0 ? '' : `:${`${minutes}`.padStart(2, '0')}`}`;
}

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
export function getTimezoneOptions(date: Date = new Date()): ITimezoneOption[] {
    return moment.tz
        .names()
        .map((name) => ({
            name,
            label: name.replace(/_/g, ' ').replace(/\//g, ' / '),
            offsetLabel: formatTimezoneLabel(date, name),
            offsetMinutes: zoned(date, name).utcOffset(),
        }))
        .sort((a, b) =>
            a.offsetMinutes === b.offsetMinutes
                ? a.name.localeCompare(b.name)
                : a.offsetMinutes - b.offsetMinutes
        );
}

/** Granularity a drag selection snaps to, in minutes. */
export const SELECTION_SNAP_MINUTES = 15;

/** Title used for an event that has not been given one yet. */
export const NEW_EVENT_TITLE = 'New event';

/** A reminder offset the user can choose in the event form. */
export interface IReminderOption {
    /** Minutes before the event start; null means "no reminder". */
    minutes: number | null;
    label: string;
}

/** The built-in reminder presets, in ascending order. */
export const REMINDER_OPTIONS: IReminderOption[] = [
    { minutes: null, label: 'None' },
    { minutes: 5, label: '5 minutes before' },
    { minutes: 10, label: '10 minutes before' },
    { minutes: 15, label: '15 minutes before' },
    { minutes: 30, label: '30 minutes before' },
    { minutes: 60, label: '1 hour before' },
    { minutes: 1440, label: '1 day before' },
];

/** Default reminder applied to a fresh event: 30 minutes before. */
export const DEFAULT_REMINDER_MINUTES = 30;

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
export const DEFAULT_CONFERENCING_PROVIDERS: IConferencingProvider[] = [
    { id: 'teams', name: 'Microsoft Teams', icon: 'ri-microsoft-line' },
    { id: 'meet', name: 'Google Meet', icon: 'ri-google-line' },
    { id: 'zoom', name: 'Zoom', icon: 'ri-vidicon-line' },
];

/**
 * The description block seeded into the editor for a conferencing provider.
 * Wrapped in a marker so it can be swapped out when the provider changes.
 */
export function conferencingBlockHtml(provider: IConferencingProvider): string {
    return (
        `<p data-conferencing="${provider.id}">\u{1F4F9} ${provider.name} meeting` +
        ` — a joining link will be added when the event is saved.</p>`
    );
}

/** Strips any previously seeded conferencing block from description HTML. */
export function stripConferencingBlock(html: string): string {
    return html.replace(/<p data-conferencing="[^"]*">.*?<\/p>/g, '');
}

/**
 * Rounds `date` up to the next whole hour in `timezone`, the default start for
 * an event created from the "New event" button.
 */
export function nextHour(date: Date, timezone?: string): Date {
    return zoned(date, timezone).minutes(0).seconds(0).milliseconds(0).add(1, 'hour').toDate();
}

/** The date / time strings a native date+time input pair needs, in `timezone`. */
export function toInputValues(date: Date, timezone?: string): { date: string; time: string } {
    const m = zoned(date, timezone);
    return { date: m.format('YYYY-MM-DD'), time: m.format('HH:mm') };
}

/** Rebuilds a Date from a `YYYY-MM-DD` date and `HH:mm` time in `timezone`. */
export function fromInputValues(dateStr: string, timeStr: string, timezone?: string): Date {
    const base = `${dateStr} ${timeStr}`;
    const m = timezone
        ? momentTz.tz(base, 'YYYY-MM-DD HH:mm', timezone)
        : moment(base, 'YYYY-MM-DD HH:mm');
    return m.toDate();
}

/**
 * The inclusive date range a view covers, used to expand recurring events only
 * as far as the visible grid. Month spans the full 6-week matrix.
 */
export function getViewRange(
    date: Date,
    view: CalendarView,
    timezone?: string,
    weekStartsOn: WeekStartDay = 0
): { start: Date; end: Date } {
    if (view === CalendarView.MONTH) {
        const matrix = getMonthMatrix(date, timezone, weekStartsOn);
        return {
            start: zoned(matrix[0][0], timezone).startOf('day').toDate(),
            end: zoned(matrix[5][6], timezone).endOf('day').toDate(),
        };
    }
    if (view === CalendarView.DAY) {
        return {
            start: zoned(date, timezone).startOf('day').toDate(),
            end: zoned(date, timezone).endOf('day').toDate(),
        };
    }
    const days = getWeekDays(date, timezone, weekStartsOn);
    return {
        start: zoned(days[0], timezone).startOf('day').toDate(),
        end: zoned(days[6], timezone).endOf('day').toDate(),
    };
}

/** Safety cap on how many occurrences a single rule is scanned / produced. */
const RECURRENCE_SCAN_CAP = 4000;

/**
 * Expands every recurring event in `events` into its individual occurrences that
 * fall within `[rangeStart, rangeEnd]`. Non-repeating events pass through
 * unchanged. Each generated occurrence carries `recurringEventId` (the master's
 * id) and a unique `id`, and keeps the master's duration.
 */
export function expandRecurringEvents(
    events: ICalendarEvent[],
    rangeStart: Date,
    rangeEnd: Date,
    timezone?: string
): ICalendarEvent[] {
    const result: ICalendarEvent[] = [];
    for (const event of events) {
        if (!event.recurrence) {
            result.push(event);
            continue;
        }
        for (const occurrence of expandOne(event, rangeStart, rangeEnd, timezone)) {
            result.push(occurrence);
        }
    }
    return result;
}

function expandOne(
    event: ICalendarEvent,
    rangeStartDate: Date,
    rangeEndDate: Date,
    timezone?: string
): ICalendarEvent[] {
    const rec = event.recurrence as ICalendarRecurrence;
    const base = zoned(event.start, timezone);
    const durationMs = event.end.getTime() - event.start.getTime();
    const rangeStart = zoned(rangeStartDate, timezone);
    const rangeEnd = zoned(rangeEndDate, timezone);
    const until = rec.until ? zoned(rec.until, timezone) : null;
    const count = rec.count ?? Infinity;
    const interval = Math.max(1, rec.interval ?? 1);
    const exDates = (rec.exDates ?? []).map((d) => zoned(d, timezone));
    const isExcluded = (m: moment.Moment) => exDates.some((x) => x.isSame(m, 'minute'));

    const instances: ICalendarEvent[] = [];
    let produced = 0;

    // Emits one occurrence; returns false once the series is exhausted.
    const emit = (startM: moment.Moment): boolean => {
        if (startM.isAfter(rangeEnd)) {
            return false;
        }
        if (until && startM.isAfter(until)) {
            return false;
        }
        if (produced >= count) {
            return false;
        }
        produced += 1;
        if (!isExcluded(startM)) {
            const startDate = startM.toDate();
            const endMs = startDate.getTime() + durationMs;
            // Keep occurrences that overlap the range at all.
            if (startM.isSameOrBefore(rangeEnd) && endMs >= rangeStart.valueOf()) {
                instances.push({
                    ...event,
                    id: `${event.id}::${startM.valueOf()}`,
                    start: startDate,
                    end: new Date(endMs),
                    recurringEventId: event.id,
                });
            }
        }
        return instances.length < RECURRENCE_SCAN_CAP;
    };

    // Resolve the stepping strategy.
    let unit: 'day' | 'week' | 'month' | 'year' = 'day';
    let weekdays: number[] | null = null;
    let weekdayOnly = false;
    let step = interval;

    switch (rec.frequency) {
        case CalendarRecurrenceFrequency.DAILY:
            unit = 'day';
            break;
        case CalendarRecurrenceFrequency.WEEKDAY:
            unit = 'day';
            step = 1;
            weekdayOnly = true;
            break;
        case CalendarRecurrenceFrequency.WEEKLY:
            unit = 'week';
            weekdays = rec.byWeekday?.length ? rec.byWeekday : [base.day()];
            break;
        case CalendarRecurrenceFrequency.MONTHLY:
            unit = 'month';
            break;
        case CalendarRecurrenceFrequency.YEARLY:
            unit = 'year';
            break;
        case CalendarRecurrenceFrequency.CUSTOM:
            unit = (rec.customUnit as 'day' | 'week' | 'month' | 'year') ?? 'week';
            if (unit === 'week') {
                weekdays = rec.byWeekday?.length ? rec.byWeekday : [base.day()];
            }
            break;
    }

    const noCount = count === Infinity;

    if (unit === 'week' && weekdays) {
        const sorted = [...weekdays].sort((a, b) => a - b);
        // Sunday 00:00 of the base week, so `+wd days` lands on the weekday.
        let blockStart = base.clone().subtract(base.day(), 'days').startOf('day');
        if (noCount && blockStart.clone().add(6, 'days').isBefore(rangeStart)) {
            const weeks = Math.floor(rangeStart.diff(blockStart, 'weeks') / step);
            if (weeks > 0) {
                blockStart.add(weeks * step, 'weeks');
            }
        }
        for (let scanned = 0; scanned < RECURRENCE_SCAN_CAP; scanned += 1) {
            if (blockStart.isAfter(rangeEnd)) {
                break;
            }
            let stop = false;
            for (const wd of sorted) {
                const occ = blockStart
                    .clone()
                    .add(wd, 'days')
                    .hour(base.hour())
                    .minute(base.minute())
                    .second(base.second())
                    .millisecond(base.millisecond());
                if (occ.isBefore(base)) {
                    continue;
                }
                if (!emit(occ)) {
                    stop = true;
                    break;
                }
            }
            if (stop) {
                break;
            }
            blockStart.add(step, 'weeks');
        }
        return instances;
    }

    // Simple stepping strategies (day / weekday / month / year).
    const momentUnit = unit === 'day' ? 'days' : unit === 'month' ? 'months' : 'years';
    let cursor = base.clone();
    if (noCount && cursor.isBefore(rangeStart)) {
        if (unit === 'day' && !weekdayOnly) {
            const days = Math.floor(
                rangeStart.clone().startOf('day').diff(cursor.clone().startOf('day'), 'days') / step
            );
            if (days > 0) {
                cursor.add(days * step, 'days');
            }
        } else if (unit === 'month' || unit === 'year') {
            const diff = Math.floor(rangeStart.diff(cursor, momentUnit) / step);
            if (diff > 0) {
                cursor.add(diff * step, momentUnit);
            }
        }
    }
    for (let scanned = 0; scanned < RECURRENCE_SCAN_CAP; scanned += 1) {
        if (cursor.isAfter(rangeEnd)) {
            break;
        }
        if (weekdayOnly && (cursor.day() === 0 || cursor.day() === 6)) {
            cursor.add(1, 'days');
            continue;
        }
        if (!cursor.isBefore(base) && !emit(cursor.clone())) {
            break;
        }
        cursor.add(step, momentUnit);
    }
    return instances;
}

/** True when `event` repeats or is one occurrence of a repeating series. */
export function isRecurring(event: ICalendarEvent): boolean {
    return !!event.recurrence || !!event.recurringEventId;
}

/** A short, human readable summary of a recurrence rule, e.g. `Weekly on Monday`. */
export function describeRecurrence(
    recurrence: ICalendarRecurrence,
    baseDate?: Date,
    timezone?: string
): string {
    const dayName = (d: number) => moment().day(d).format('dddd');
    const listDays = (days: number[]) =>
        [...days].sort((a, b) => a - b).map(dayName).join(', ');

    switch (recurrence.frequency) {
        case CalendarRecurrenceFrequency.DAILY:
            return 'Daily';
        case CalendarRecurrenceFrequency.WEEKDAY:
            return 'Every weekday (Mon–Fri)';
        case CalendarRecurrenceFrequency.WEEKLY: {
            const days = recurrence.byWeekday?.length
                ? recurrence.byWeekday
                : baseDate
                  ? [zoned(baseDate, timezone).day()]
                  : [];
            return days.length ? `Weekly on ${listDays(days)}` : 'Weekly';
        }
        case CalendarRecurrenceFrequency.MONTHLY:
            return 'Monthly';
        case CalendarRecurrenceFrequency.YEARLY:
            return 'Annually';
        case CalendarRecurrenceFrequency.CUSTOM: {
            const n = Math.max(1, recurrence.interval ?? 1);
            const unit = recurrence.customUnit ?? CalendarRecurrenceUnit.WEEK;
            const unitLabel = n === 1 ? unit : `${unit}s`;
            let summary = `Every ${n} ${unitLabel}`;
            if (unit === CalendarRecurrenceUnit.WEEK && recurrence.byWeekday?.length) {
                summary += ` on ${listDays(recurrence.byWeekday)}`;
            }
            return summary;
        }
        default:
            return 'Repeats';
    }
}

/** True when `value` looks like a plausible email address. */
export function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Rounds an offset in minutes to the nearest {@link SELECTION_SNAP_MINUTES},
 * clamped to the bounds of a single day.
 */
export function snapMinutes(minutes: number, step: number = SELECTION_SNAP_MINUTES): number {
    const snapped = Math.round(minutes / step) * step;
    return Math.min(HOURS_IN_DAY * 60, Math.max(0, snapped));
}

/** Combines a calendar day with an offset in minutes into a Date. */
export function dateAtMinutes(day: Date, minutes: number, timezone?: string): Date {
    return zoned(day, timezone).startOf('day').add(minutes, 'minutes').toDate();
}

/**
 * Whether the viewer owns `event`. An explicit `isOwn` flag wins; otherwise the
 * event is owned when its `organizer` matches `currentUser`. With no organizer
 * recorded at all the event is assumed to be the viewer's own.
 */
export function isOwnEvent(event: ICalendarEvent, currentUser?: string): boolean {
    if (event.isOwn !== undefined) {
        return event.isOwn;
    }
    if (event.organizer) {
        return currentUser !== undefined && event.organizer === currentUser;
    }
    return true;
}

/**
 * The viewer's effective response to `event`. Events the viewer owns are always
 * treated as accepted; everything else falls back to `needs-action`.
 */
export function effectiveResponse(
    event: ICalendarEvent,
    currentUser?: string
): CalendarEventResponse {
    if (isOwnEvent(event, currentUser)) {
        return CalendarEventResponse.ACCEPTED;
    }
    return event.response ?? CalendarEventResponse.NEEDS_ACTION;
}

/**
 * How an event should read visually given the viewer's response.
 *
 * - `confirmed` -> owned or accepted; drawn at full strength.
 * - `pending`   -> invited but not yet accepted (needs-action / tentative); faded.
 * - `declined`  -> declined; faded and struck through.
 */
export type EventResponseState = 'confirmed' | 'pending' | 'declined';

export function eventResponseState(
    event: ICalendarEvent,
    currentUser?: string
): EventResponseState {
    const response = effectiveResponse(event, currentUser);
    if (response === CalendarEventResponse.ACCEPTED) {
        return 'confirmed';
    }
    if (response === CalendarEventResponse.DECLINED) {
        return 'declined';
    }
    return 'pending';
}

/**
 * Builds the class suffix appended to an event block for its response state, so
 * pending / declined events can be faded via CSS. Returns `''` for confirmed.
 */
export function eventResponseClass(base: string, state: EventResponseState): string {
    if (state === 'pending') {
        return ` ${base}-pending`;
    }
    if (state === 'declined') {
        return ` ${base}-declined`;
    }
    return '';
}

/**
 * A human readable duration for an event, e.g. `30 minutes`, `1 hour`,
 * `1 hour 30 minutes`, `2 days`.
 */
export function formatDuration(start: Date, end: Date, timezone?: string): string {
    const totalMinutes = Math.max(0, zoned(end, timezone).diff(zoned(start, timezone), 'minutes'));
    if (totalMinutes === 0) {
        return '0 minutes';
    }
    const plural = (value: number, unit: string) => `${value} ${unit}${value === 1 ? '' : 's'}`;

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    // Whole days (and day-plus-hours) read better without a trailing "0 minutes".
    if (days > 0) {
        const parts = [plural(days, 'day')];
        if (hours > 0) {
            parts.push(plural(hours, 'hour'));
        }
        if (minutes > 0) {
            parts.push(plural(minutes, 'minute'));
        }
        return parts.join(' ');
    }
    const parts: string[] = [];
    if (hours > 0) {
        parts.push(plural(hours, 'hour'));
    }
    if (minutes > 0) {
        parts.push(plural(minutes, 'minute'));
    }
    return parts.join(' ');
}

/**
 * The long "when" line shown in the event detail modal, matching the format
 * previously built inline: a single day / time range or a multi-day span.
 */
export function formatEventWhen(event: ICalendarEvent, timezone?: string): string {
    const start = zoned(event.start, timezone);
    const end = zoned(event.end, timezone);
    if (isAllDayEvent(event, timezone)) {
        return start.isSame(end, 'day')
            ? start.format('dddd, MMMM D, YYYY')
            : `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`;
    }
    return `${start.format('dddd, MMMM D')} · ${start.format('h:mm A')} - ${end.format('h:mm A')}`;
}

/** The label of the {@link REMINDER_OPTIONS} preset for `minutes`, or a fallback. */
export function formatReminderLabel(minutes: number | null | undefined): string {
    if (minutes == null) {
        return 'None';
    }
    const preset = REMINDER_OPTIONS.find((option) => option.minutes === minutes);
    if (preset) {
        return preset.label;
    }
    if (minutes % 1440 === 0) {
        const days = minutes / 1440;
        return `${days} day${days === 1 ? '' : 's'} before`;
    }
    if (minutes % 60 === 0) {
        const hours = minutes / 60;
        return `${hours} hour${hours === 1 ? '' : 's'} before`;
    }
    return `${minutes} minute${minutes === 1 ? '' : 's'} before`;
}
