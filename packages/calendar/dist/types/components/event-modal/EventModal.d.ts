import React from 'react';
import { CalendarDeleteScope, CalendarEventResponse, CalendarSeriesScope, ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import './EventModal.css';
interface Props {
    event: ICalendarEvent;
    sources?: ICalendarSource[];
    /** IANA timezone the times are shown in. Defaults to the browser's zone. */
    timezone?: string;
    /** Viewer's email, used to decide whether the event is the viewer's own. */
    currentUser?: string;
    /** When true, guest lists are shown for the viewer's own events. */
    emailCompatibility?: boolean;
    onClose: () => void;
    onEdit?: (event: ICalendarEvent) => void;
    /**
     * Called with the event, whether it should be removed for everyone, and —
     * for repeating events — whether to remove just this occurrence or the
     * whole series.
     */
    onDelete?: (event: ICalendarEvent, scope: CalendarDeleteScope, seriesScope?: CalendarSeriesScope) => void;
    /**
     * Called when the viewer responds to an invitation. A proposed time is only
     * passed when the viewer declines and proposes an alternative.
     */
    onRespond?: (event: ICalendarEvent, response: CalendarEventResponse, proposedTime?: {
        start: Date;
        end: Date;
    }) => void;
    /** Called when the notification / reminder is changed. */
    onReminderChange?: (event: ICalendarEvent, minutes: number | null) => void;
    /**
     * Called when the viewer picks a colour for the event. Available for events
     * the viewer owns or was invited to, letting them colour the event in their
     * own calendar without opening the full edit form.
     */
    onColorChange?: (event: ICalendarEvent, color: string) => void;
}
/**
 * The event detail modal. Shows everything about an event and adapts its footer
 * to whether the viewer owns it: owners get edit / delete, invitees get
 * accept / decline / tentative (with an option to propose a new time). Built
 * entirely on the Foundations core {@link Modal}.
 */
export declare const EventModal: React.FC<Props>;
export {};
