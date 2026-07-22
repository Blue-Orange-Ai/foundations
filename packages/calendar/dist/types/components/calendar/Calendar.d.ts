import React from 'react';
import { CalendarDeleteScope, CalendarEventResponse, CalendarNotifyScope, CalendarSeriesScope, CalendarSourceLayout, CalendarView, ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { IConferencingProvider, SlotMinutes, WeekStartDay } from '../../utils/calendarUtils';
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
    /**
     * Called when an event is deleted, with whether to remove it for everyone
     * and — for repeating events — whether to delete one occurrence or the series.
     */
    onEventDelete?: (event: ICalendarEvent, scope: CalendarDeleteScope, seriesScope?: CalendarSeriesScope) => void;
    /** Called when the Edit button is pressed, alongside the built-in edit form. */
    onEventEdit?: (event: ICalendarEvent) => void;
    /**
     * Called with the edited event when the edit form is saved. `meta.notify` is
     * set for email-backed events whose guest list changed; `meta.scope` and
     * `meta.occurrenceStart` are set when editing a repeating event.
     */
    onEventUpdate?: (event: ICalendarEvent, meta?: {
        notify?: CalendarNotifyScope;
        scope?: CalendarSeriesScope;
        occurrenceStart?: Date;
    }) => void;
    /** Called when the viewer responds to an invitation they do not own. */
    onEventRespond?: (event: ICalendarEvent, response: CalendarEventResponse, proposedTime?: {
        start: Date;
        end: Date;
    }) => void;
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
export declare const Calendar: React.FC<Props>;
export {};
