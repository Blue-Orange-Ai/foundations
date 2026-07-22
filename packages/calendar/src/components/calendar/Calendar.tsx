import React, { useState } from 'react';
import {
    CalendarDeleteScope,
    CalendarEventResponse,
    CalendarNotifyScope,
    CalendarSourceLayout,
    CalendarView,
    ICalendarEvent,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';
import {
    DEFAULT_NON_WORKING_DAYS,
    DEFAULT_REMINDER_MINUTES,
    getTimezoneName,
    IConferencingProvider,
    navigateDate,
    nextHour,
    SlotMinutes,
    WeekStartDay,
} from '../../utils/calendarUtils';
import { CalendarToolbar } from '../calendar-toolbar/CalendarToolbar';
import { MonthView } from '../month-view/MonthView';
import { TimeGridView } from '../time-grid-view/TimeGridView';
import { EventModal } from '../event-modal/EventModal';
import { EventFormModal } from '../event-form-modal/EventFormModal';
import { TimezonePicker } from '../timezone-picker/TimezonePicker';
import { CalendarSidePanel } from '../side-panel/CalendarSidePanel';
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
    /** Open the week / day grid scrolled to the current time. Defaults to true. */
    scrollToCurrentTime?: boolean;
    /**
     * Row granularity of the week / day grid. `60` (default) draws one row per
     * hour; `30` subdivides each hour into half-hour rows.
     */
    slotMinutes?: SlotMinutes;
    /** Max event chips per month-view day cell before collapsing to "+N more". */
    maxVisibleMonthEvents?: number;
    /**
     * Day the week starts on: `0` (Sunday, default) … `6` (Saturday). Set to `1`
     * to start weeks on Monday.
     */
    weekStartsOn?: WeekStartDay;
    /**
     * Days of the week, `0` (Sunday) … `6` (Saturday), drawn with the
     * non-working-day background. Defaults to the weekend (`[0, 6]`); pass an
     * empty array to render every day the same.
     */
    nonWorkingDays?: number[];
    /** When true, a built-in detail modal opens when an event is clicked. */
    useEventModal?: boolean;
    /**
     * When true (default) pressing and dragging on an empty part of a week / day
     * column draws out a new event and opens the create modal on release.
     */
    enableDragCreate?: boolean;
    /** Title used for the draft event while dragging and in the create modal. */
    newEventTitle?: string;
    /**
     * Timezone label shown above the hour gutter in the week / day views.
     * Defaults to the timezone's UTC offset; pass an empty string to hide it.
     */
    timezoneLabel?: string;
    /** Controlled IANA timezone the calendar renders in, e.g. `Europe/London`. */
    timezone?: string;
    /** Initial timezone when uncontrolled. Defaults to the browser's zone. */
    defaultTimezone?: string;
    /**
     * When true (default) clicking the timezone label opens a picker. Set to
     * false to leave the label read-only.
     */
    allowTimezoneChange?: boolean;
    /**
     * When true (default) the toolbar shows a hamburger button that toggles the
     * left side panel holding the mini month picker and the shared calendars.
     */
    showSidePanelToggle?: boolean;
    /** Whether the side panel starts open. Defaults to false. */
    defaultSidePanelOpen?: boolean;
    /** Heading above the source list in the side panel. */
    sourcesLabel?: string;
    /**
     * How the shared calendars share the view: `OVERLAY` (default) draws them
     * all in one grid, `SIDE_BY_SIDE` gives each its own grid.
     */
    sourceLayout?: CalendarSourceLayout;
    /** Heading of the side-by-side pane holding events with no calendar. */
    unassignedLabel?: string;
    /**
     * Controlled list of source ids whose events are shown. When omitted the
     * calendar tracks the checkboxes itself and every source starts visible.
     */
    visibleSourceIds?: string[];
    /**
     * When true (default) the toolbar shows a "New event" button that opens the
     * built-in create form.
     */
    showCreateButton?: boolean;
    /**
     * When true, the create form gains required / optional guest email fields.
     * Off by default so calendars that are not email-backed stay simple.
     */
    emailCompatibility?: boolean;
    /**
     * Video conferencing providers offered in the create form. Defaults to
     * Teams / Meet / Zoom; pass an empty array to hide the section.
     */
    conferencingProviders?: IConferencingProvider[];
    /** Reminder pre-selected on a new event, in minutes. Defaults to 30. */
    defaultReminderMinutes?: number | null;
    /**
     * The viewer's email. Used to decide which events the viewer owns (owned
     * events are always "accepted" and draggable) and to fade invitations the
     * viewer has not yet accepted.
     */
    currentUser?: string;
    /**
     * When true (default) the viewer can drag their own events in the week / day
     * views to a new time; dropping opens the edit form pre-filled with the new
     * time so the move can be confirmed or cancelled.
     */
    enableEventDrag?: boolean;

    onDateChange?: (date: Date) => void;
    onViewChange?: (view: CalendarView) => void;
    onEventClick?: (event: ICalendarEvent) => void;
    onDayClick?: (date: Date) => void;
    onCreate?: (date: Date) => void;
    /** Called with the range a drag selection covered, before any modal opens. */
    onRangeSelect?: (start: Date, end: Date) => void;
    /** Called with the new event once the create modal is submitted. */
    onEventCreate?: (event: ICalendarEvent) => void;
    /** Called with the IANA name whenever the timezone is changed. */
    onTimezoneChange?: (timezone: string) => void;
    /** Called with the ids still visible whenever a shared calendar is toggled. */
    onVisibleSourcesChange?: (sourceIds: string[]) => void;
    /** Called when an event is deleted, with whether to remove it for everyone. */
    onEventDelete?: (event: ICalendarEvent, scope: CalendarDeleteScope) => void;
    /** Called when the Edit button is pressed, alongside the built-in edit form. */
    onEventEdit?: (event: ICalendarEvent) => void;
    /**
     * Called with the edited event when the edit form is saved. `notify` is set
     * for email-backed events whose guest list changed.
     */
    onEventUpdate?: (event: ICalendarEvent, notify?: CalendarNotifyScope) => void;
    /** Called when the viewer responds to an invitation they do not own. */
    onEventRespond?: (
        event: ICalendarEvent,
        response: CalendarEventResponse,
        proposedTime?: { start: Date; end: Date }
    ) => void;
    /** Called when an event's reminder / notification is changed in the modal. */
    onEventReminderChange?: (event: ICalendarEvent, minutes: number | null) => void;
    /**
     * Called when the viewer sets a colour on an event from the detail modal.
     * Available for events they own or were invited to.
     */
    onEventColorChange?: (event: ICalendarEvent, color: string) => void;
    /** Called after a drag-move is confirmed by saving the edit form. */
    onEventMove?: (event: ICalendarEvent, start: Date, end: Date) => void;
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
    scrollToCurrentTime = true,
    slotMinutes = 60,
    maxVisibleMonthEvents = 3,
    weekStartsOn = 0,
    nonWorkingDays = DEFAULT_NON_WORKING_DAYS,
    useEventModal = true,
    enableDragCreate = true,
    newEventTitle,
    timezoneLabel,
    timezone,
    defaultTimezone,
    allowTimezoneChange = true,
    showSidePanelToggle = true,
    defaultSidePanelOpen = false,
    sourcesLabel,
    sourceLayout = CalendarSourceLayout.OVERLAY,
    unassignedLabel = 'Other',
    visibleSourceIds,
    showCreateButton = true,
    emailCompatibility = false,
    conferencingProviders,
    defaultReminderMinutes = DEFAULT_REMINDER_MINUTES,
    currentUser,
    enableEventDrag = true,
    onDateChange,
    onViewChange,
    onEventClick,
    onDayClick,
    onCreate,
    onRangeSelect,
    onEventCreate,
    onTimezoneChange,
    onVisibleSourcesChange,
    onEventDelete,
    onEventEdit,
    onEventUpdate,
    onEventRespond,
    onEventReminderChange,
    onEventColorChange,
    onEventMove,
}) => {
    const [internalDate, setInternalDate] = useState<Date>(defaultDate ?? new Date());
    const [internalView, setInternalView] = useState<CalendarView>(defaultView);
    const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(null);
    const [draftRange, setDraftRange] = useState<{ start: Date; end: Date } | null>(null);
    // The event currently open in the edit form (via Edit, or a drag-to-move).
    const [editingEvent, setEditingEvent] = useState<ICalendarEvent | null>(null);
    const [internalTimezone, setInternalTimezone] = useState<string>(
        defaultTimezone ?? getTimezoneName()
    );
    const [pickingTimezone, setPickingTimezone] = useState(false);
    const [sidePanelOpen, setSidePanelOpen] = useState(defaultSidePanelOpen);
    const [internalVisibleSources, setInternalVisibleSources] = useState<string[]>(() =>
        sources.map((source) => source.id)
    );

    const activeDate = date ?? internalDate;
    const activeView = view ?? internalView;
    const activeTimezone = timezone ?? internalTimezone;
    const activeVisibleSources = visibleSourceIds ?? internalVisibleSources;

    // Events with no source always show; the rest follow their checkbox.
    const visibleEvents = events.filter(
        (event) => !event.calendarId || activeVisibleSources.includes(event.calendarId)
    );

    const handleSourceToggle = (sourceId: string, visible: boolean) => {
        const next = visible
            ? [...activeVisibleSources.filter((id) => id !== sourceId), sourceId]
            : activeVisibleSources.filter((id) => id !== sourceId);
        if (visibleSourceIds === undefined) {
            setInternalVisibleSources(next);
        }
        if (onVisibleSourcesChange) {
            onVisibleSourcesChange(next);
        }
    };

    const updateTimezone = (next: string) => {
        if (timezone === undefined) {
            setInternalTimezone(next);
        }
        setPickingTimezone(false);
        if (onTimezoneChange) {
            onTimezoneChange(next);
        }
    };

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

    const handlePrev = () =>
        updateDate(navigateDate(activeDate, activeView, -1, activeTimezone));
    const handleNext = () => updateDate(navigateDate(activeDate, activeView, 1, activeTimezone));
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

    const handleRangeSelect = (start: Date, end: Date) => {
        if (onRangeSelect) {
            onRangeSelect(start, end);
        }
        if (useEventModal) {
            setDraftRange({ start, end });
        }
    };

    // The "New event" button opens the same form on a default one-hour slot,
    // starting at the next whole hour of the active date.
    const handleToolbarCreate = () => {
        if (onCreate) {
            onCreate(activeDate);
        }
        if (useEventModal) {
            const start = nextHour(activeDate, activeTimezone);
            setDraftRange({ start, end: new Date(start.getTime() + 60 * 60 * 1000) });
        }
    };

    const handleCreateEvent = (event: ICalendarEvent) => {
        setDraftRange(null);
        if (onEventCreate) {
            onEventCreate(event);
        }
    };

    // The edit form's save routes here. In edit mode it updates; a drag-to-move
    // that the user chose to save also lands here as an update.
    const handleSaveEdit = (event: ICalendarEvent, meta?: { notify?: CalendarNotifyScope }) => {
        setEditingEvent(null);
        if (onEventUpdate) {
            onEventUpdate(event, meta?.notify);
        }
    };

    const handleEditEvent = (event: ICalendarEvent) => {
        setSelectedEvent(null);
        setEditingEvent(event);
        if (onEventEdit) {
            onEventEdit(event);
        }
    };

    // Dragging one of the viewer's own events opens the edit form pre-filled with
    // the new time, so the move can be reviewed and cancelled (leaving it put) or
    // saved. The consumer is told the intended move up front for optimistic UIs.
    const handleEventMove = (event: ICalendarEvent, start: Date, end: Date) => {
        if (onEventMove) {
            onEventMove(event, start, end);
        }
        setEditingEvent({ ...event, start, end });
    };

    const handleDeleteEvent = (event: ICalendarEvent, scope: CalendarDeleteScope) => {
        setSelectedEvent(null);
        if (onEventDelete) {
            onEventDelete(event, scope);
        }
    };

    const handleRespondEvent = (
        event: ICalendarEvent,
        response: CalendarEventResponse,
        proposedTime?: { start: Date; end: Date }
    ) => {
        setSelectedEvent(null);
        if (onEventRespond) {
            onEventRespond(event, response, proposedTime);
        }
    };

    // One pane per visible calendar when they are shown side by side. Events
    // with no calendar of their own get a pane at the end rather than vanishing.
    const buildPanes = () => {
        const panes = sources
            .filter((source) => activeVisibleSources.includes(source.id))
            .map((source) => ({
                key: source.id,
                name: source.name,
                color: source.borderColor ?? source.color,
                events: visibleEvents.filter((event) => event.calendarId === source.id),
            }));
        const unassigned = visibleEvents.filter((event) => !event.calendarId);
        if (unassigned.length > 0) {
            panes.push({
                key: '__unassigned',
                name: unassignedLabel,
                color: undefined,
                events: unassigned,
            });
        }
        return panes;
    };

    const renderView = (paneEvents: ICalendarEvent[], hideTimezoneLabel = false) =>
        activeView === CalendarView.MONTH ? (
            <MonthView
                date={activeDate}
                events={paneEvents}
                sources={sources}
                maxVisibleEvents={maxVisibleMonthEvents}
                timezone={activeTimezone}
                currentUser={currentUser}
                weekStartsOn={weekStartsOn}
                nonWorkingDays={nonWorkingDays}
                onEventClick={handleEventClick}
                onDayClick={handleDayClick}
                onMoreClick={handleDrillToDay}
            />
        ) : (
            <TimeGridView
                date={activeDate}
                view={activeView}
                events={paneEvents}
                sources={sources}
                showNowIndicator={showNowIndicator}
                scrollToCurrentTime={scrollToCurrentTime}
                slotMinutes={slotMinutes}
                currentUser={currentUser}
                weekStartsOn={weekStartsOn}
                nonWorkingDays={nonWorkingDays}
                onEventClick={handleEventClick}
                onDayHeaderClick={handleDrillToDay}
                onRangeSelect={enableDragCreate ? handleRangeSelect : undefined}
                onEventMove={
                    enableEventDrag && (useEventModal || onEventMove)
                        ? handleEventMove
                        : undefined
                }
                newEventTitle={newEventTitle}
                timezone={activeTimezone}
                // Only the leftmost grid carries the timezone control, so it is
                // not repeated once per calendar.
                timezoneLabel={hideTimezoneLabel ? '' : timezoneLabel}
                onTimezoneClick={
                    allowTimezoneChange && !hideTimezoneLabel
                        ? () => setPickingTimezone(true)
                        : undefined
                }
            />
        );

    // Clicking a day header in the week/month view drills into the day view.
    const handleDrillToDay = (day: Date) => {
        updateDate(day);
        updateView(CalendarView.DAY);
    };

    const panes = buildPanes();
    // Falling back to one grid keeps a single calendar from growing a pane
    // header it does not need.
    const sideBySide = sourceLayout === CalendarSourceLayout.SIDE_BY_SIDE && panes.length > 1;

    return (
        <div className="blue-orange-calendar">
            {showToolbar && (
                <CalendarToolbar
                    date={activeDate}
                    view={activeView}
                    timezone={activeTimezone}
                    weekStartsOn={weekStartsOn}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onToday={handleToday}
                    onViewChange={updateView}
                    onCreate={
                        showCreateButton && (useEventModal || onCreate)
                            ? handleToolbarCreate
                            : undefined
                    }
                    onToggleSidePanel={
                        showSidePanelToggle ? () => setSidePanelOpen((open) => !open) : undefined
                    }
                />
            )}
            <div className="blue-orange-calendar-body">
                {sidePanelOpen && (
                    <CalendarSidePanel
                        date={activeDate}
                        sources={sources}
                        visibleSourceIds={activeVisibleSources}
                        sourcesLabel={sourcesLabel}
                        onDateSelect={updateDate}
                        onSourceToggle={handleSourceToggle}
                    />
                )}
                {sideBySide ? (
                    <div className="blue-orange-calendar-panes">
                        {panes.map((pane, index) => (
                            <div className="blue-orange-calendar-pane" key={pane.key}>
                                <div className="blue-orange-calendar-pane-header no-select">
                                    <span
                                        className="blue-orange-calendar-pane-dot"
                                        style={{ backgroundColor: pane.color }}
                                    />
                                    <span className="blue-orange-calendar-pane-name">
                                        {pane.name}
                                    </span>
                                </div>
                                {renderView(pane.events, index > 0)}
                            </div>
                        ))}
                    </div>
                ) : (
                    renderView(visibleEvents)
                )}
            </div>
            {draftRange && (
                <EventFormModal
                    start={draftRange.start}
                    end={draftRange.end}
                    sources={sources}
                    timezone={activeTimezone}
                    defaultTitle={newEventTitle}
                    emailCompatibility={emailCompatibility}
                    conferencingProviders={conferencingProviders}
                    defaultReminderMinutes={defaultReminderMinutes}
                    onCancel={() => setDraftRange(null)}
                    onCreate={handleCreateEvent}
                />
            )}
            {editingEvent && (
                <EventFormModal
                    mode="edit"
                    initialEvent={editingEvent}
                    start={editingEvent.start}
                    end={editingEvent.end}
                    sources={sources}
                    timezone={activeTimezone}
                    emailCompatibility={emailCompatibility}
                    conferencingProviders={conferencingProviders}
                    defaultReminderMinutes={defaultReminderMinutes}
                    onCancel={() => setEditingEvent(null)}
                    onCreate={handleSaveEdit}
                />
            )}
            {pickingTimezone && (
                <TimezonePicker
                    timezone={activeTimezone}
                    onSelect={updateTimezone}
                    onClose={() => setPickingTimezone(false)}
                />
            )}
            {useEventModal && selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    sources={sources}
                    timezone={activeTimezone}
                    currentUser={currentUser}
                    emailCompatibility={emailCompatibility}
                    onClose={() => setSelectedEvent(null)}
                    onEdit={handleEditEvent}
                    onDelete={onEventDelete ? handleDeleteEvent : undefined}
                    onRespond={onEventRespond ? handleRespondEvent : undefined}
                    onReminderChange={onEventReminderChange}
                    onColorChange={onEventColorChange}
                />
            )}
        </div>
    );
};
