import moment from 'moment';
import { CalendarView, ICalendarEvent, ICalendarSource } from '../interfaces/CalendarInterfaces';

/** Height in pixels of a single hour row in the time-grid views. */
export const HOUR_HEIGHT = 48;

/** Number of hours in a day. */
export const HOURS_IN_DAY = 24;

/**
 * Returns a 6x7 matrix of Dates representing the month grid that contains
 * `date`. The grid always starts on a Sunday and is padded with the trailing
 * days of the previous month and the leading days of the next month, exactly
 * like Toast UI Calendar's month view.
 */
export function getMonthMatrix(date: Date): Date[][] {
    const start = moment(date).startOf('month').startOf('week');
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
 * Returns the seven Dates (Sunday -> Saturday) of the week containing `date`.
 */
export function getWeekDays(date: Date): Date[] {
    const start = moment(date).startOf('week');
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

export function isSameDay(a: Date, b: Date): boolean {
    return moment(a).isSame(b, 'day');
}

export function isSameMonth(a: Date, b: Date): boolean {
    return moment(a).isSame(b, 'month');
}

export function isToday(date: Date): boolean {
    return moment(date).isSame(moment(), 'day');
}

export function isWeekend(date: Date): boolean {
    const day = moment(date).day();
    return day === 0 || day === 6;
}

/**
 * Builds the human readable title for the toolbar given the active view.
 */
export function formatViewTitle(date: Date, view: CalendarView): string {
    const m = moment(date);
    if (view === CalendarView.MONTH) {
        return m.format('MMMM YYYY');
    }
    if (view === CalendarView.DAY) {
        return m.format('dddd, MMMM D, YYYY');
    }
    // Week view -> show the span, collapsing shared month/year.
    const start = m.clone().startOf('week');
    const end = m.clone().endOf('week');
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
export function navigateDate(date: Date, view: CalendarView, amount: number): Date {
    const unit = view === CalendarView.MONTH ? 'month' : view === CalendarView.WEEK ? 'week' : 'day';
    return moment(date).add(amount, unit).toDate();
}

/** True when the event overlaps the calendar day `day` at all. */
export function eventOccursOnDay(event: ICalendarEvent, day: Date): boolean {
    const dayStart = moment(day).startOf('day');
    const dayEnd = moment(day).endOf('day');
    return moment(event.start).isSameOrBefore(dayEnd) && moment(event.end).isSameOrAfter(dayStart);
}

/** True when an event should be treated as an all-day / multi-day bar. */
export function isAllDayEvent(event: ICalendarEvent): boolean {
    if (event.isAllday) {
        return true;
    }
    // Events spanning more than one calendar day render as all-day bars.
    return !moment(event.start).isSame(event.end, 'day');
}

/**
 * Returns the events occurring on `day`, sorted by start time then by longest
 * duration first (so multi-day / earlier events sit at the top).
 */
export function getEventsForDay(events: ICalendarEvent[], day: Date): ICalendarEvent[] {
    return events
        .filter((e) => eventOccursOnDay(e, day))
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
export function minutesSinceStartOfDay(date: Date): number {
    const m = moment(date);
    return m.hours() * 60 + m.minutes();
}

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
export function layoutTimedEvents(events: ICalendarEvent[], day: Date): ITimedEventLayout[] {
    const dayStart = moment(day).startOf('day');
    const dayEnd = moment(day).endOf('day');

    const timed = events
        .filter((e) => !isAllDayEvent(e))
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
 * Resolves the colours to use for an event: explicit event colours win, then the
 * colours of its {@link ICalendarSource}, then `undefined` (letting the CSS
 * theme variables provide the default).
 */
export function resolveEventColors(
    event: ICalendarEvent,
    sources: ICalendarSource[] = []
): IResolvedEventColors {
    const source = sources.find((s) => s.id === event.calendarId);
    return {
        color: event.color ?? source?.color,
        backgroundColor: event.backgroundColor ?? source?.backgroundColor,
        borderColor: event.borderColor ?? source?.borderColor ?? event.color ?? source?.color,
    };
}

/** Formats the time range of an event, e.g. `9:00 AM - 10:30 AM`. */
export function formatEventTimeRange(event: ICalendarEvent): string {
    const start = moment(event.start);
    const end = moment(event.end);
    return `${start.format('h:mm A')} - ${end.format('h:mm A')}`;
}
