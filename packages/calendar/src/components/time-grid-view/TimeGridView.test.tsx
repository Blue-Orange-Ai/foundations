import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimeGridView } from './TimeGridView';
import { CalendarView, ICalendarEvent } from '../../interfaces/CalendarInterfaces';

const date = new Date('2026-07-21T00:00:00');

const events: ICalendarEvent[] = [
    {
        id: '1',
        title: 'Design Review',
        start: new Date(2026, 6, 21, 13, 0, 0),
        end: new Date(2026, 6, 21, 14, 0, 0),
    },
    {
        id: '2',
        title: 'All Hands',
        start: new Date(2026, 6, 21, 0, 0, 0),
        end: new Date(2026, 6, 21, 23, 59, 0),
        isAllday: true,
    },
];

describe('TimeGridView', () => {
    it('renders a single column in day view', () => {
        const { container } = render(
            <TimeGridView date={date} view={CalendarView.DAY} events={events} showNowIndicator={false} />
        );
        expect(
            container.querySelectorAll('.blue-orange-calendar-time-column').length
        ).toBe(1);
    });

    it('renders seven columns in week view', () => {
        const { container } = render(
            <TimeGridView date={date} view={CalendarView.WEEK} events={events} showNowIndicator={false} />
        );
        expect(
            container.querySelectorAll('.blue-orange-calendar-time-column').length
        ).toBe(7);
    });

    it('renders hour labels in the gutter', () => {
        render(
            <TimeGridView date={date} view={CalendarView.DAY} events={[]} showNowIndicator={false} />
        );
        expect(screen.getByText('1 AM')).toBeInTheDocument();
        expect(screen.getByText('11 PM')).toBeInTheDocument();
    });

    it('renders timed events', () => {
        render(
            <TimeGridView date={date} view={CalendarView.DAY} events={events} showNowIndicator={false} />
        );
        expect(screen.getByText('Design Review')).toBeInTheDocument();
    });

    it('renders all-day events in the all-day row', () => {
        render(
            <TimeGridView date={date} view={CalendarView.DAY} events={events} showNowIndicator={false} />
        );
        expect(screen.getByText('All day')).toBeInTheDocument();
        expect(screen.getByText('All Hands')).toBeInTheDocument();
    });
});
