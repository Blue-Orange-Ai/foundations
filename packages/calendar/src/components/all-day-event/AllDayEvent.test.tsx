import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AllDayEvent } from './AllDayEvent';
import { ICalendarEvent } from '../../interfaces/CalendarInterfaces';

const event: ICalendarEvent = {
    id: '1',
    title: 'Conference',
    start: new Date('2026-07-20T00:00:00'),
    end: new Date('2026-07-22T23:59:59'),
    isAllday: true,
};

describe('AllDayEvent', () => {
    it('renders the event title', () => {
        render(<AllDayEvent event={event} />);
        expect(screen.getByText('Conference')).toBeInTheDocument();
    });

    it('fires onClick with the event', () => {
        const onClick = jest.fn();
        render(<AllDayEvent event={event} onClick={onClick} />);
        fireEvent.click(screen.getByText('Conference'));
        expect(onClick).toHaveBeenCalledWith(event);
    });

    it('applies a source colour override', () => {
        const { container } = render(
            <AllDayEvent
                event={{ ...event, backgroundColor: 'rgb(255, 0, 0)' }}
            />
        );
        const el = container.querySelector('.blue-orange-calendar-allday-event') as HTMLElement;
        expect(el.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });
});
