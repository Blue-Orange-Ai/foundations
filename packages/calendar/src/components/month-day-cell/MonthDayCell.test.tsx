import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthDayCell } from './MonthDayCell';
import { ICalendarEvent } from '../../interfaces/CalendarInterfaces';

const monthDate = new Date('2026-07-15T00:00:00');

const makeEvent = (id: string, hour: number): ICalendarEvent => ({
    id,
    title: `Event ${id}`,
    start: new Date(2026, 6, 15, hour, 0, 0),
    end: new Date(2026, 6, 15, hour + 1, 0, 0),
});

describe('MonthDayCell', () => {
    it('renders the day number', () => {
        render(<MonthDayCell date={new Date('2026-07-15T00:00:00')} monthDate={monthDate} events={[]} />);
        expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('renders event chips for the day', () => {
        const events = [makeEvent('1', 9), makeEvent('2', 11)];
        render(
            <MonthDayCell date={new Date('2026-07-15T00:00:00')} monthDate={monthDate} events={events} />
        );
        expect(screen.getByText('Event 1')).toBeInTheDocument();
        expect(screen.getByText('Event 2')).toBeInTheDocument();
    });

    it('collapses overflow events into a "+N more" indicator', () => {
        const events = [makeEvent('1', 8), makeEvent('2', 9), makeEvent('3', 10), makeEvent('4', 11)];
        render(
            <MonthDayCell
                date={new Date('2026-07-15T00:00:00')}
                monthDate={monthDate}
                events={events}
                maxVisibleEvents={2}
            />
        );
        expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('marks days outside the current month', () => {
        const { container } = render(
            <MonthDayCell date={new Date('2026-08-01T00:00:00')} monthDate={monthDate} events={[]} />
        );
        expect(
            container.querySelector('.blue-orange-calendar-month-cell-other')
        ).toBeInTheDocument();
    });

    it('fires onDayClick when the cell is clicked', () => {
        const onDayClick = vi.fn();
        render(
            <MonthDayCell
                date={new Date('2026-07-15T00:00:00')}
                monthDate={monthDate}
                events={[]}
                onDayClick={onDayClick}
            />
        );
        fireEvent.click(screen.getByText('15'));
        expect(onDayClick).toHaveBeenCalledTimes(1);
    });

    it('fires onEventClick without triggering onDayClick', () => {
        const onEventClick = vi.fn();
        const onDayClick = vi.fn();
        render(
            <MonthDayCell
                date={new Date('2026-07-15T00:00:00')}
                monthDate={monthDate}
                events={[makeEvent('1', 9)]}
                onEventClick={onEventClick}
                onDayClick={onDayClick}
            />
        );
        fireEvent.click(screen.getByText('Event 1'));
        expect(onEventClick).toHaveBeenCalledTimes(1);
        expect(onDayClick).not.toHaveBeenCalled();
    });
});
