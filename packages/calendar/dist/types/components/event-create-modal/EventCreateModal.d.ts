import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import './EventCreateModal.css';
interface Props {
    /** Start of the range the user dragged out. */
    start: Date;
    /** End of the range the user dragged out. */
    end: Date;
    sources?: ICalendarSource[];
    /** IANA timezone the range is shown in. Defaults to the browser's zone. */
    timezone?: string;
    /** Pre-filled title, defaulting to the placeholder used on the draft block. */
    defaultTitle?: string;
    onCancel: () => void;
    onCreate: (event: ICalendarEvent) => void;
}
/**
 * The create form shown once a drag selection on the time grid is released. The
 * time range is fixed to whatever was dragged; only the title is editable here.
 */
export declare const EventCreateModal: React.FC<Props>;
export {};
