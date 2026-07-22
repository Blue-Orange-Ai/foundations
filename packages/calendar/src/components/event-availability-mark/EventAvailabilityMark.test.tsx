import React from 'react';
import { render } from '@testing-library/react';
import { EventAvailabilityMark } from './EventAvailabilityMark';
import { CalendarEventAvailability } from '../../interfaces/CalendarInterfaces';

describe('EventAvailabilityMark', () => {
    const mark = (container: HTMLElement) =>
        container.querySelector('.blue-orange-calendar-availability-mark') as HTMLElement;

    it('fills the square for a busy event', () => {
        const { container } = render(
            <EventAvailabilityMark
                availability={CalendarEventAvailability.BUSY}
                color="rgb(1, 2, 3)"
            />
        );
        expect(mark(container).style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(mark(container).title).toBe('Busy');
    });

    it('outlines the square for a free event', () => {
        const { container } = render(
            <EventAvailabilityMark
                availability={CalendarEventAvailability.FREE}
                color="rgb(1, 2, 3)"
            />
        );
        expect(mark(container).style.backgroundColor).toBe('transparent');
        expect(mark(container).style.borderColor).toBe('rgb(1, 2, 3)');
        expect(mark(container).title).toBe('Free');
    });

    it('treats a missing availability as busy', () => {
        const { container } = render(<EventAvailabilityMark color="rgb(1, 2, 3)" />);
        expect(mark(container).style.backgroundColor).toBe('rgb(1, 2, 3)');
    });
});
