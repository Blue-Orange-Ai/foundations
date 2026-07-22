import React from 'react';
import { CalendarNotifyScope, CalendarSeriesScope, ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { IConferencingProvider } from '../../utils/calendarUtils';
import './EventFormModal.css';
interface Props {
    /** Start of the event being created. */
    start: Date;
    /** End of the event being created. */
    end: Date;
    sources?: ICalendarSource[];
    /** IANA timezone the calendar is rendered in (kept for API symmetry). */
    timezone?: string;
    /** Pre-filled title, defaulting to the placeholder used on the draft block. */
    defaultTitle?: string;
    /** When true, required / optional guest email fields are shown. */
    emailCompatibility?: boolean;
    /** Video conferencing providers offered above the description. */
    conferencingProviders?: IConferencingProvider[];
    /** Reminder applied when the form opens. */
    defaultReminderMinutes?: number | null;
    /**
     * `create` (default) builds a brand new event; `edit` prefills the form from
     * {@link initialEvent} and, for email-backed events, offers to notify guests
     * when the recipient lists change.
     */
    mode?: 'create' | 'edit';
    /** The event being edited, when `mode` is `edit`. */
    initialEvent?: ICalendarEvent;
    onCancel: () => void;
    /**
     * Called with the finished event. When editing an email-backed event whose
     * guest list changed, `meta.notify` records which guests to inform. When
     * editing a recurring event, `meta.scope` records whether the change applies
     * to this occurrence or the whole series, and `meta.occurrenceStart` is the
     * original start of the occurrence being edited.
     */
    onCreate: (event: ICalendarEvent, meta?: {
        notify?: CalendarNotifyScope;
        scope?: CalendarSeriesScope;
        occurrenceStart?: Date;
    }) => void;
}
/**
 * The full create form shown when a range is dragged out or the "New event"
 * button is pressed. Built entirely from Foundations core inputs.
 */
export declare const EventFormModal: React.FC<Props>;
export {};
