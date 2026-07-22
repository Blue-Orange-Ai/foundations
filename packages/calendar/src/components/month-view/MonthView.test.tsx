import React from 'react';
import { render, screen } from '@testing-library/react';
import { MonthView } from './MonthView';
import { ICalendarEvent } from '../../interfaces/CalendarInterfaces';

const events: ICalendarEvent[] = [
    {
        id: '1',
        title: 'Kickoff',
        start: new Date(2026, 6, 15, 10, 0, 0),
        end: new Date(2026, 6, 15, 11, 0, 0),
    },
];

describe('MonthView', () => {
    it('renders weekday headers', () => {
        render(<MonthView date={new Date('2026-07-15T00:00:00')} events={[]} />);
        expect(screen.getByText('Sun')).toBeInTheDocument();
        expect(screen.getByText('Sat')).toBeInTheDocument();
    });

    it('renders 42 day cells (6 weeks)', () => {
        const { container } = render(
            <MonthView date={new Date('2026-07-15T00:00:00')} events={[]} />
        );
        expect(container.querySelectorAll('.blue-orange-calendar-month-cell').length).toBe(42);
    });

    it('renders events in the grid', () => {
        render(<MonthView date={new Date('2026-07-15T00:00:00')} events={events} />);
        expect(screen.getByText('Kickoff')).toBeInTheDocument();
    });
});
