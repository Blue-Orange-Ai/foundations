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
export const EventAvailabilityMark: React.FC<Props> = ({ availability, color }) => {
    const free = availability === CalendarEventAvailability.FREE;
    const accent = color ?? 'currentColor';
    return (
        <span
            className="blue-orange-calendar-availability-mark"
            title={free ? 'Free' : 'Busy'}
            style={{
                borderColor: accent,
                backgroundColor: free ? 'transparent' : accent,
            }}
        />
    );
};
