import React, { useState } from 'react';
import {
    CalendarView,
    ICalendarEvent,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';
import { navigateDate } from '../../utils/calendarUtils';
import { CalendarToolbar } from '../calendar-toolbar/CalendarToolbar';
import { MonthView } from '../month-view/MonthView';
import { TimeGridView } from '../time-grid-view/TimeGridView';
import { EventModal } from '../event-modal/EventModal';
import './Calendar.css';

interface Props {
    events: ICalendarEvent[];
    sources?: ICalendarSource[];

    /** Controlled anchor date. Falls back to `defaultDate` / today. */
    date?: Date;
    defaultDate?: Date;
    /** Controlled view. Falls back to `defaultView` / month. */
    view?: CalendarView;
    defaultView?: CalendarView;

    /** Hide the built-in toolbar when embedding a custom header. */
    showToolbar?: boolean;
    /** Show the red "current time" line in the time-grid views. */
    showNowIndicator?: boolean;
    /** Max event chips per month-view day cell before collapsing to "+N more". */
    maxVisibleMonthEvents?: number;
    /** When true, a built-in detail modal opens when an event is clicked. */
    useEventModal?: boolean;

    onDateChange?: (date: Date) => void;
    onViewChange?: (view: CalendarView) => void;
    onEventClick?: (event: ICalendarEvent) => void;
    onDayClick?: (date: Date) => void;
    onCreate?: (date: Date) => void;
    onEventDelete?: (event: ICalendarEvent) => void;
    onEventEdit?: (event: ICalendarEvent) => void;
}

/**
 * The top-level calendar component. Composes the toolbar with the active view
 * (month, week or day) and manages navigation / view state, either in a
 * controlled or uncontrolled fashion. Modelled on Toast UI Calendar
 * (nhn/tui.calendar) but built entirely from Foundations primitives.
 */
export const Calendar: React.FC<Props> = ({
    events,
    sources = [],
    date,
    defaultDate,
    view,
    defaultView = CalendarView.MONTH,
    showToolbar = true,
    showNowIndicator = true,
    maxVisibleMonthEvents = 3,
    useEventModal = true,
    onDateChange,
    onViewChange,
    onEventClick,
    onDayClick,
    onCreate,
    onEventDelete,
    onEventEdit,
}) => {
    const [internalDate, setInternalDate] = useState<Date>(defaultDate ?? new Date());
    const [internalView, setInternalView] = useState<CalendarView>(defaultView);
    const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(null);

    const activeDate = date ?? internalDate;
    const activeView = view ?? internalView;

    const updateDate = (next: Date) => {
        if (date === undefined) {
            setInternalDate(next);
        }
        if (onDateChange) {
            onDateChange(next);
        }
    };

    const updateView = (next: CalendarView) => {
        if (view === undefined) {
            setInternalView(next);
        }
        if (onViewChange) {
            onViewChange(next);
        }
    };

    const handlePrev = () => updateDate(navigateDate(activeDate, activeView, -1));
    const handleNext = () => updateDate(navigateDate(activeDate, activeView, 1));
    const handleToday = () => updateDate(new Date());

    const handleEventClick = (event: ICalendarEvent) => {
        if (useEventModal) {
            setSelectedEvent(event);
        }
        if (onEventClick) {
            onEventClick(event);
        }
    };

    const handleDayClick = (day: Date) => {
        if (onDayClick) {
            onDayClick(day);
        }
    };

    // Clicking a day header in the week/month view drills into the day view.
    const handleDrillToDay = (day: Date) => {
        updateDate(day);
        updateView(CalendarView.DAY);
    };

    return (
        <div className="blue-orange-calendar">
            {showToolbar && (
                <CalendarToolbar
                    date={activeDate}
                    view={activeView}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onToday={handleToday}
                    onViewChange={updateView}
                    onCreate={onCreate ? () => onCreate(activeDate) : undefined}
                />
            )}
            <div className="blue-orange-calendar-body">
                {activeView === CalendarView.MONTH ? (
                    <MonthView
                        date={activeDate}
                        events={events}
                        sources={sources}
                        maxVisibleEvents={maxVisibleMonthEvents}
                        onEventClick={handleEventClick}
                        onDayClick={handleDayClick}
                        onMoreClick={handleDrillToDay}
                    />
                ) : (
                    <TimeGridView
                        date={activeDate}
                        view={activeView}
                        events={events}
                        sources={sources}
                        showNowIndicator={showNowIndicator}
                        onEventClick={handleEventClick}
                        onDayHeaderClick={handleDrillToDay}
                    />
                )}
            </div>
            {useEventModal && selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    sources={sources}
                    onClose={() => setSelectedEvent(null)}
                    onDelete={
                        onEventDelete
                            ? (event) => {
                                  onEventDelete(event);
                                  setSelectedEvent(null);
                              }
                            : undefined
                    }
                    onEdit={
                        onEventEdit
                            ? (event) => {
                                  onEventEdit(event);
                                  setSelectedEvent(null);
                              }
                            : undefined
                    }
                />
            )}
        </div>
    );
};
