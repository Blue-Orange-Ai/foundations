import React, { useEffect, useRef, useState } from 'react';
import {
    CalendarView,
    ICalendarEvent,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';
import {
    dateAtMinutes,
    EVENT_RIGHT_GUTTER,
    getDayHours,
    getEventsForDay,
    getWeekDays,
    formatSlotLabel,
    formatTimeRange,
    formatTimezoneLabel,
    getTimezoneName,
    DEFAULT_NON_WORKING_DAYS,
    HOUR_HEIGHT,
    HOURS_IN_DAY,
    isAllDayEvent,
    isNonWorkingDay,
    isOwnEvent,
    isToday,
    isWeekend,
    layoutTimedEvents,
    WeekStartDay,
    minutesSinceStartOfDay,
    NEW_EVENT_TITLE,
    SELECTION_SNAP_MINUTES,
    SlotMinutes,
    snapMinutes,
    zoned,
} from '../../utils/calendarUtils';
import { TimeGridEvent } from '../time-grid-event/TimeGridEvent';
import { AllDayEvent } from '../all-day-event/AllDayEvent';
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

const HOURS = getDayHours();

/** A range being drawn out by the user, in minutes from the start of its day. */
interface IDragSelection {
    dayIndex: number;
    anchorMinutes: number;
    currentMinutes: number;
}

/** Pixels the pointer must travel before a press turns into a range selection. */
const DRAG_THRESHOLD = 4;

/** The snapped minute offset within a day column that `clientY` points at. */
function minutesAtPointer(column: HTMLElement, clientY: number): number {
    const rect = column.getBoundingClientRect();
    return snapMinutes(((clientY - rect.top) / HOUR_HEIGHT) * 60);
}

/**
 * Shared time-grid based view used for both the week and day views. Renders a
 * left hour gutter, an all-day header row, and one column per day containing
 * absolutely positioned {@link TimeGridEvent} blocks.
 */
export const TimeGridView: React.FC<Props> = ({
    date,
    view,
    events,
    sources = [],
    showNowIndicator = true,
    scrollToCurrentTime = true,
    slotMinutes = 60,
    currentUser,
    weekStartsOn = 0,
    nonWorkingDays = DEFAULT_NON_WORKING_DAYS,
    onEventClick,
    onDayHeaderClick,
    onRangeSelect,
    onEventMove,
    newEventTitle = NEW_EVENT_TITLE,
    timezone,
    timezoneLabel,
    onTimezoneClick,
}) => {
    const days =
        view === CalendarView.DAY ? [date] : getWeekDays(date, timezone, weekStartsOn);
    const halfHour = slotMinutes === 30;
    // The hour keeps its height either way, so event positions are unaffected.
    const halfHourHeight = HOUR_HEIGHT / 2;

    // Tick every minute so the "now" indicator keeps moving.
    const [now, setNow] = useState<Date>(() => new Date());
    useEffect(() => {
        if (!showNowIndicator) {
            return;
        }
        const interval = setInterval(() => setNow(new Date()), 60 * 1000);
        return () => clearInterval(interval);
    }, [showNowIndicator]);

    // Open on the current time rather than at midnight. Only done once, so
    // navigating between days keeps wherever the user has scrolled to.
    const bodyRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const body = bodyRef.current;
        if (!scrollToCurrentTime || !body) {
            return;
        }
        const nowOffset = (minutesSinceStartOfDay(new Date(), timezone) / 60) * HOUR_HEIGHT;
        // Sit the current time a third of the way down, so the hours just gone
        // stay visible above it.
        body.scrollTop = Math.max(0, nowOffset - body.clientHeight / 3);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Range currently being dragged out, and the live pointer bookkeeping behind
    // it. The latter lives in a ref so the window listeners always see it.
    const [selection, setSelection] = useState<IDragSelection | null>(null);
    const dragRef = useRef<{
        dayIndex: number;
        column: HTMLElement;
        originY: number;
        anchorMinutes: number;
        started: boolean;
    } | null>(null);
    const daysRef = useRef(days);
    daysRef.current = days;
    const timezoneRef = useRef(timezone);
    timezoneRef.current = timezone;

    // The columns container, so a move-drag can map the pointer to a day/time.
    const columnsRef = useRef<HTMLDivElement | null>(null);

    // Event currently being dragged to a new slot, plus its live ghost position.
    const [moveDrag, setMoveDrag] = useState<{
        eventId: string;
        dayIndex: number;
        startMinutes: number;
        durationMinutes: number;
    } | null>(null);
    const moveRef = useRef<{
        event: ICalendarEvent;
        originX: number;
        originY: number;
        grabOffsetMinutes: number;
        durationMinutes: number;
        started: boolean;
    } | null>(null);
    // Set briefly after a move so the trailing click does not open the modal.
    const suppressClickRef = useRef(false);

    // Maps a pointer position onto a { dayIndex, minutes } slot in the grid.
    const pointerSlot = (clientX: number, clientY: number) => {
        const container = columnsRef.current;
        if (!container) {
            return { dayIndex: 0, minutes: 0 };
        }
        const rect = container.getBoundingClientRect();
        const count = daysRef.current.length;
        const columnWidth = rect.width / count;
        const dayIndex = Math.min(
            count - 1,
            Math.max(0, Math.floor((clientX - rect.left) / columnWidth))
        );
        const minutes = snapMinutes(((clientY - rect.top) / HOUR_HEIGHT) * 60);
        return { dayIndex, minutes };
    };

    useEffect(() => {
        if (!onEventMove) {
            return;
        }

        const handleMove = (e: MouseEvent) => {
            const drag = moveRef.current;
            if (!drag) {
                return;
            }
            if (!drag.started) {
                if (
                    Math.abs(e.clientX - drag.originX) < DRAG_THRESHOLD &&
                    Math.abs(e.clientY - drag.originY) < DRAG_THRESHOLD
                ) {
                    return;
                }
                drag.started = true;
            }
            const { dayIndex, minutes } = pointerSlot(e.clientX, e.clientY);
            const maxStart = HOURS_IN_DAY * 60 - drag.durationMinutes;
            const startMinutes = Math.min(Math.max(0, minutes - drag.grabOffsetMinutes), maxStart);
            setMoveDrag({
                eventId: drag.event.id,
                dayIndex,
                startMinutes,
                durationMinutes: drag.durationMinutes,
            });
        };

        const handleUp = (e: MouseEvent) => {
            const drag = moveRef.current;
            moveRef.current = null;
            setMoveDrag(null);
            if (!drag || !drag.started) {
                return;
            }
            // A real move happened: swallow the click that follows the mouseup.
            suppressClickRef.current = true;
            const { dayIndex, minutes } = pointerSlot(e.clientX, e.clientY);
            const maxStart = HOURS_IN_DAY * 60 - drag.durationMinutes;
            const startMinutes = Math.min(Math.max(0, minutes - drag.grabOffsetMinutes), maxStart);
            const day = daysRef.current[dayIndex];
            const start = dateAtMinutes(day, startMinutes, timezoneRef.current);
            const end = new Date(start.getTime() + drag.durationMinutes * 60 * 1000);
            onEventMove(drag.event, start, end);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onEventMove]);

    // Whether the viewer may drag `event` — their own, editable, timed events.
    const canMove = (event: ICalendarEvent) =>
        !!onEventMove && isOwnEvent(event, currentUser) && !event.isReadOnly;

    const handleEventMouseDown = (event: ICalendarEvent, e: React.MouseEvent) => {
        if (e.button !== 0 || !canMove(event)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const { minutes } = pointerSlot(e.clientX, e.clientY);
        const eventStartMinutes = minutesSinceStartOfDay(event.start, timezoneRef.current);
        const durationMinutes = Math.max(
            SELECTION_SNAP_MINUTES,
            zoned(event.end, timezoneRef.current).diff(zoned(event.start, timezoneRef.current), 'minutes')
        );
        moveRef.current = {
            event,
            originX: e.clientX,
            originY: e.clientY,
            grabOffsetMinutes: minutes - eventStartMinutes,
            durationMinutes,
            started: false,
        };
    };

    // Opens the detail modal on click, unless a drag just moved the event.
    const handleEventClick = (event: ICalendarEvent) => {
        if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
        }
        if (onEventClick) {
            onEventClick(event);
        }
    };

    useEffect(() => {
        if (!onRangeSelect) {
            return;
        }

        const handleMove = (e: MouseEvent) => {
            const drag = dragRef.current;
            if (!drag) {
                return;
            }
            if (!drag.started) {
                if (Math.abs(e.clientY - drag.originY) < DRAG_THRESHOLD) {
                    return;
                }
                drag.started = true;
            }
            setSelection({
                dayIndex: drag.dayIndex,
                anchorMinutes: drag.anchorMinutes,
                currentMinutes: minutesAtPointer(drag.column, e.clientY),
            });
        };

        const handleUp = (e: MouseEvent) => {
            const drag = dragRef.current;
            dragRef.current = null;
            setSelection(null);
            if (!drag || !drag.started) {
                return;
            }
            const day = daysRef.current[drag.dayIndex];
            const released = minutesAtPointer(drag.column, e.clientY);
            const start = Math.min(drag.anchorMinutes, released);
            // A range dragged back to where it started still gets one slot.
            const end = Math.max(Math.max(drag.anchorMinutes, released), start + SELECTION_SNAP_MINUTES);
            onRangeSelect(
                dateAtMinutes(day, start, timezoneRef.current),
                dateAtMinutes(day, end, timezoneRef.current)
            );
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [onRangeSelect]);

    const handleColumnMouseDown = (e: React.MouseEvent<HTMLDivElement>, dayIndex: number) => {
        // Left button only, and never when the press lands on an existing event.
        if (!onRangeSelect || e.button !== 0) {
            return;
        }
        if ((e.target as HTMLElement).closest('.blue-orange-calendar-time-event')) {
            return;
        }
        const column = e.currentTarget;
        // Keeps the browser from text-selecting the grid as the pointer moves.
        e.preventDefault();
        dragRef.current = {
            dayIndex,
            column,
            originY: e.clientY,
            anchorMinutes: minutesAtPointer(column, e.clientY),
            started: false,
        };
    };

    const hasAllDay = days.some((day) =>
        getEventsForDay(events, day, timezone).some((e) => isAllDayEvent(e, timezone))
    );

    const nowTop = (minutesSinceStartOfDay(now, timezone) / 60) * HOUR_HEIGHT;
    const zoneLabel = timezoneLabel ?? formatTimezoneLabel(date, timezone);
    const gridClass =
        view === CalendarView.DAY
            ? 'blue-orange-calendar-time-grid blue-orange-calendar-time-grid-day'
            : 'blue-orange-calendar-time-grid';

    return (
        <div className={gridClass}>
            {/* Day header row */}
            <div className="blue-orange-calendar-time-header no-select">
                <div className="blue-orange-calendar-time-gutter-corner">
                    {zoneLabel !== '' &&
                        (onTimezoneClick ? (
                            <button
                                type="button"
                                className="blue-orange-calendar-time-timezone blue-orange-calendar-time-timezone-button"
                                title={`${timezone ?? getTimezoneName()} — click to change`}
                                onClick={onTimezoneClick}
                            >
                                {zoneLabel}
                            </button>
                        ) : (
                            <span
                                className="blue-orange-calendar-time-timezone"
                                title={timezone ?? getTimezoneName()}
                            >
                                {zoneLabel}
                            </span>
                        ))}
                </div>
                <div className="blue-orange-calendar-time-header-days">
                    {days.map((day) => {
                        const today = isToday(day, timezone);
                        const weekend = isWeekend(day, timezone);
                        const headerClass = [
                            'blue-orange-calendar-time-header-day',
                            today ? 'blue-orange-calendar-time-header-day-today' : '',
                            isNonWorkingDay(day, nonWorkingDays, timezone)
                                ? 'blue-orange-calendar-time-header-day-nonworking'
                                : '',
                        ]
                            .filter(Boolean)
                            .join(' ');
                        const numberClass = [
                            'blue-orange-calendar-time-header-number',
                            today ? 'blue-orange-calendar-time-header-number-today' : '',
                            weekend ? 'blue-orange-calendar-time-header-number-weekend' : '',
                        ]
                            .filter(Boolean)
                            .join(' ');
                        return (
                            <div
                                key={day.toISOString()}
                                className={headerClass}
                                onClick={() => onDayHeaderClick && onDayHeaderClick(day)}
                            >
                                <span className="blue-orange-calendar-time-header-weekday">
                                    {zoned(day, timezone).format('ddd')}
                                </span>
                                <span className={numberClass}>{zoned(day, timezone).date()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* All-day events — floated over the top of the time body rather than
                occupying a reserved row of their own. */}
            {hasAllDay && (
                <div className="blue-orange-calendar-time-allday">
                    <div className="blue-orange-calendar-time-allday-floating">
                        <div className="blue-orange-calendar-time-gutter-spacer" />
                        <div className="blue-orange-calendar-time-allday-days">
                            {days.map((day) => (
                                <div
                                    key={day.toISOString()}
                                    className={`blue-orange-calendar-time-allday-cell${
                                        isNonWorkingDay(day, nonWorkingDays, timezone)
                                            ? ' blue-orange-calendar-time-allday-cell-nonworking'
                                            : ''
                                    }`}
                                >
                                    {getEventsForDay(events, day, timezone)
                                        .filter((e) => isAllDayEvent(e, timezone))
                                        .map((event) => (
                                            <AllDayEvent
                                                key={event.id}
                                                event={event}
                                                sources={sources}
                                                currentUser={currentUser}
                                                onClick={onEventClick}
                                            />
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Scrollable time body */}
            <div className="blue-orange-calendar-time-body" ref={bodyRef}>
                <div className="blue-orange-calendar-time-gutter no-select">
                    {HOURS.map((hour) => (
                        <div
                            key={hour}
                            className="blue-orange-calendar-time-gutter-hour"
                            style={{ height: `${HOUR_HEIGHT}px` }}
                        >
                            {hour > 0 && (
                                <span className="blue-orange-calendar-time-gutter-hour-label">
                                    {formatSlotLabel(hour, 0)}
                                </span>
                            )}
                            {halfHour && (
                                <span
                                    className="blue-orange-calendar-time-gutter-hour-label blue-orange-calendar-time-gutter-half-label"
                                    style={{ top: `${halfHourHeight - 7}px` }}
                                >
                                    {formatSlotLabel(hour, 30)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="blue-orange-calendar-time-columns" ref={columnsRef}>
                    {days.map((day, dayIndex) => {
                        const layouts = layoutTimedEvents(
                            getEventsForDay(events, day, timezone),
                            day,
                            timezone
                        );
                        const draft =
                            selection && selection.dayIndex === dayIndex
                                ? {
                                      start: Math.min(
                                          selection.anchorMinutes,
                                          selection.currentMinutes
                                      ),
                                      end: Math.max(
                                          selection.anchorMinutes,
                                          selection.currentMinutes
                                      ),
                                  }
                                : null;
                        const columnClass = [
                            'blue-orange-calendar-time-column',
                            isToday(day, timezone) ? 'blue-orange-calendar-time-column-today' : '',
                            isNonWorkingDay(day, nonWorkingDays, timezone)
                                ? 'blue-orange-calendar-time-column-nonworking'
                                : '',
                        ]
                            .filter(Boolean)
                            .join(' ');
                        return (
                            <div
                                key={day.toISOString()}
                                className={columnClass}
                                onMouseDown={(e) => handleColumnMouseDown(e, dayIndex)}
                            >
                                {HOURS.map((hour) => (
                                    <div
                                        key={hour}
                                        className="blue-orange-calendar-time-slot"
                                        style={{ height: `${HOUR_HEIGHT}px` }}
                                    >
                                        {halfHour && (
                                            <div
                                                className="blue-orange-calendar-time-slot-half"
                                                style={{ height: `${halfHourHeight}px` }}
                                            />
                                        )}
                                    </div>
                                ))}
                                {layouts.map((layout) => (
                                    <TimeGridEvent
                                        key={layout.event.id}
                                        layout={layout}
                                        sources={sources}
                                        timezone={timezone}
                                        currentUser={currentUser}
                                        dimmed={moveDrag?.eventId === layout.event.id}
                                        onMouseDown={
                                            canMove(layout.event) ? handleEventMouseDown : undefined
                                        }
                                        onClick={handleEventClick}
                                    />
                                ))}
                                {moveDrag && moveDrag.dayIndex === dayIndex && (
                                    <div
                                        className="blue-orange-calendar-time-event blue-orange-calendar-time-event-draft blue-orange-calendar-time-event-moving no-select"
                                        style={{
                                            top: `${(moveDrag.startMinutes / 60) * HOUR_HEIGHT}px`,
                                            height: `${
                                                (moveDrag.durationMinutes / 60) * HOUR_HEIGHT
                                            }px`,
                                            left: '2px',
                                            width: `calc(100% - ${EVENT_RIGHT_GUTTER + 4}px)`,
                                        }}
                                    >
                                        <div className="blue-orange-calendar-time-event-title">
                                            {events.find((e) => e.id === moveDrag.eventId)?.title}
                                        </div>
                                        <div className="blue-orange-calendar-time-event-time">
                                            {formatTimeRange(
                                                dateAtMinutes(day, moveDrag.startMinutes, timezone),
                                                dateAtMinutes(
                                                    day,
                                                    moveDrag.startMinutes + moveDrag.durationMinutes,
                                                    timezone
                                                ),
                                                timezone
                                            )}
                                        </div>
                                    </div>
                                )}
                                {draft && (
                                    <div
                                        className="blue-orange-calendar-time-event blue-orange-calendar-time-event-draft no-select"
                                        style={{
                                            top: `${(draft.start / 60) * HOUR_HEIGHT}px`,
                                            height: `${
                                                (Math.max(
                                                    draft.end - draft.start,
                                                    SELECTION_SNAP_MINUTES
                                                ) /
                                                    60) *
                                                HOUR_HEIGHT
                                            }px`,
                                            left: '2px',
                                            width: `calc(100% - ${EVENT_RIGHT_GUTTER + 4}px)`,
                                        }}
                                    >
                                        <div className="blue-orange-calendar-time-event-title">
                                            {newEventTitle}
                                        </div>
                                        <div className="blue-orange-calendar-time-event-time">
                                            {formatTimeRange(
                                                dateAtMinutes(day, draft.start, timezone),
                                                dateAtMinutes(
                                                    day,
                                                    Math.max(
                                                        draft.end,
                                                        draft.start + SELECTION_SNAP_MINUTES
                                                    ),
                                                    timezone
                                                ),
                                                timezone
                                            )}
                                        </div>
                                    </div>
                                )}
                                {showNowIndicator && isToday(day, timezone) && (
                                    <div
                                        className="blue-orange-calendar-time-now"
                                        style={{ top: `${nowTop}px` }}
                                    >
                                        <span className="blue-orange-calendar-time-now-dot" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
