import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventChip } from './EventChip';
import { CalendarEventCategory, ICalendarEvent } from '../../interfaces/CalendarInterfaces';

const timedEvent: ICalendarEvent = {
    id: '1',
    title: 'Standup',
    start: new Date('2026-07-21T09:00:00'),
    end: new Date('2026-07-21T09:30:00'),
    category: CalendarEventCategory.TIME,
};

const allDayEvent: ICalendarEvent = {
    id: '2',
    title: 'Company Offsite',
    start: new Date('2026-07-21T00:00:00'),
    end: new Date('2026-07-21T23:59:59'),
    isAllday: true,
};

describe('EventChip', () => {
    it('renders the event title', () => {
        render(<EventChip event={timedEvent} />);
        expect(screen.getByText('Standup')).toBeInTheDocument();
    });

    it('shows the start time for timed events', () => {
        render(<EventChip event={timedEvent} />);
        expect(screen.getByText('9:00 AM')).toBeInTheDocument();
    });

    it('does not show a time for all-day events', () => {
        render(<EventChip event={allDayEvent} />);
        expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument();
        expect(screen.getByText('Company Offsite')).toBeInTheDocument();
    });

    it('fires onClick with the event', () => {
        const onClick = jest.fn();
        render(<EventChip event={timedEvent} onClick={onClick} />);
        fireEvent.click(screen.getByText('Standup'));
        expect(onClick).toHaveBeenCalledWith(timedEvent);
    });

    it('applies the all-day modifier class', () => {
        const { container } = render(<EventChip event={allDayEvent} />);
        expect(
            container.querySelector('.blue-orange-calendar-event-chip-allday')
        ).toBeInTheDocument();
    });
});
