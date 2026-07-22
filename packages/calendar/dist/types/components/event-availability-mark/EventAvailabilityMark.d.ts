import React from 'react';
import { CalendarEventAvailability } from '../../interfaces/CalendarInterfaces';
import './EventAvailabilityMark.css';
interface Props {
    /** Availability of the event; treated as busy when omitted. */
    availability?: CalendarEventAvailability;
    /** Accent colour of the square. Falls back to the current text colour. */
    color?: string;
}
/**
 * A little square shown next to an event's title, mirroring the swatch in the
 * create modal: filled when the event marks its owner busy, an outline only
 * when it marks them free.
 */
export declare const EventAvailabilityMark: React.FC<Props>;
export {};
