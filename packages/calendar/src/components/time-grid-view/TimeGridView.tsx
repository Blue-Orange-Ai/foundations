import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
    CalendarView,
    ICalendarEvent,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';
import {
    getDayHours,
    getEventsForDay,
    getWeekDays,
    formatHourLabel,
    HOUR_HEIGHT,
    isAllDayEvent,
    isToday,
    isWeekend,
    layoutTimedEvents,
    minutesSinceStartOfDay,
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
    onEventClick?: (event: ICalendarEvent) => void;
    onDayHeaderClick?: (date: Date) => void;
}

const HOURS = getDayHours();

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
    onEventClick,
    onDayHeaderClick,
}) => {
    const days = view === CalendarView.DAY ? [date] : getWeekDays(date);

    // Tick every minute so the "now" indicator keeps moving.
    const [now, setNow] = useState<Date>(() => new Date());
    useEffect(() => {
        if (!showNowIndicator) {
            return;
        }
        const interval = setInterval(() => setNow(new Date()), 60 * 1000);
        return () => clearInterval(interval);
    }, [showNowIndicator]);

    const hasAllDay = days.some((day) =>
        getEventsForDay(events, day).some((e) => isAllDayEvent(e))
    );

    const nowTop = (minutesSinceStartOfDay(now) / 60) * HOUR_HEIGHT;
    const gridClass =
        view === CalendarView.DAY
            ? 'blue-orange-calendar-time-grid blue-orange-calendar-time-grid-day'
            : 'blue-orange-calendar-time-grid';

    return (
        <div className={gridClass}>
            {/* Day header row */}
            <div className="blue-orange-calendar-time-header no-select">
                <div className="blue-orange-calendar-time-gutter-corner" />
                <div className="blue-orange-calendar-time-header-days">
                    {days.map((day) => {
                        const today = isToday(day);
                        const weekend = isWeekend(day);
                        const headerClass = [
                            'blue-orange-calendar-time-header-day',
                            today ? 'blue-orange-calendar-time-header-day-today' : '',
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
                                    {moment(day).format('ddd')}
                                </span>
                                <span className={numberClass}>{moment(day).date()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* All-day row */}
            {hasAllDay && (
                <div className="blue-orange-calendar-time-allday">
                    <div className="blue-orange-calendar-time-gutter-label no-select">All day</div>
                    <div className="blue-orange-calendar-time-allday-days">
                        {days.map((day) => (
                            <div
                                key={day.toISOString()}
                                className="blue-orange-calendar-time-allday-cell"
                            >
                                {getEventsForDay(events, day)
                                    .filter((e) => isAllDayEvent(e))
                                    .map((event) => (
                                        <AllDayEvent
                                            key={event.id}
                                            event={event}
                                            sources={sources}
                                            onClick={onEventClick}
                                        />
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Scrollable time body */}
            <div className="blue-orange-calendar-time-body">
                <div className="blue-orange-calendar-time-gutter no-select">
                    {HOURS.map((hour) => (
                        <div
                            key={hour}
                            className="blue-orange-calendar-time-gutter-hour"
                            style={{ height: `${HOUR_HEIGHT}px` }}
                        >
                            {hour > 0 && (
                                <span className="blue-orange-calendar-time-gutter-hour-label">
                                    {formatHourLabel(hour)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="blue-orange-calendar-time-columns">
                    {days.map((day) => {
                        const layouts = layoutTimedEvents(getEventsForDay(events, day), day);
                        const columnClass = [
                            'blue-orange-calendar-time-column',
                            isToday(day) ? 'blue-orange-calendar-time-column-today' : '',
                        ]
                            .filter(Boolean)
                            .join(' ');
                        return (
                            <div key={day.toISOString()} className={columnClass}>
                                {HOURS.map((hour) => (
                                    <div
                                        key={hour}
                                        className="blue-orange-calendar-time-slot"
                                        style={{ height: `${HOUR_HEIGHT}px` }}
                                    />
                                ))}
                                {layouts.map((layout) => (
                                    <TimeGridEvent
                                        key={layout.event.id}
                                        layout={layout}
                                        sources={sources}
                                        onClick={onEventClick}
                                    />
                                ))}
                                {showNowIndicator && isToday(day) && (
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
