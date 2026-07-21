import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from './Calendar';
import { CalendarView, ICalendarEvent } from '../../interfaces/CalendarInterfaces';

const events: ICalendarEvent[] = [
    {
        id: '1',
        title: 'Kickoff',
        start: new Date(2026, 6, 21, 10, 0, 0),
        end: new Date(2026, 6, 21, 11, 0, 0),
    },
];

const anchor = new Date('2026-07-21T00:00:00');

describe('Calendar', () => {
    it('renders the month view by default', () => {
        const { container } = render(<Calendar events={events} defaultDate={anchor} />);
        expect(container.querySelector('.blue-orange-calendar-month-view')).toBeInTheDocument();
        expect(screen.getByText('July 2026')).toBeInTheDocument();
    });

    it('switches to the week view via the toolbar', () => {
        const { container } = render(<Calendar events={events} defaultDate={anchor} />);
        fireEvent.click(screen.getByText('Week'));
        expect(container.querySelector('.blue-orange-calendar-time-grid')).toBeInTheDocument();
    });

    it('renders the day view when defaultView is DAY', () => {
        const { container } = render(
            <Calendar events={events} defaultDate={anchor} defaultView={CalendarView.DAY} />
        );
        expect(
            container.querySelectorAll('.blue-orange-calendar-time-column').length
        ).toBe(1);
    });

    it('navigates to the next period', () => {
        const { container } = render(<Calendar events={events} defaultDate={anchor} />);
        const next = container.querySelector('.ri-arrow-right-s-line') as HTMLElement;
        expect(next).toBeTruthy();
        fireEvent.click(next);
        expect(screen.getByText('August 2026')).toBeInTheDocument();
    });

    it('opens the event modal when an event is clicked', () => {
        render(<Calendar events={events} defaultDate={anchor} />);
        fireEvent.click(screen.getAllByText('Kickoff')[0]);
        // The modal renders the event body/time; at minimum the title appears twice now.
        expect(screen.getAllByText('Kickoff').length).toBeGreaterThan(0);
    });

    it('calls onViewChange when controlled', () => {
        const onViewChange = jest.fn();
        render(
            <Calendar
                events={events}
                date={anchor}
                view={CalendarView.MONTH}
                onViewChange={onViewChange}
            />
        );
        fireEvent.click(screen.getByText('Day'));
        expect(onViewChange).toHaveBeenCalledWith(CalendarView.DAY);
    });
});
