import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeGridEvent } from './TimeGridEvent';
import {
    CalendarEventAvailability,
    ICalendarEvent,
} from '../../interfaces/CalendarInterfaces';
import { ITimedEventLayout } from '../../utils/calendarUtils';

const event: ICalendarEvent = {
    id: '1',
    title: 'Design Review',
    start: new Date('2026-07-21T13:00:00'),
    end: new Date('2026-07-21T14:00:00'),
};

const layout: ITimedEventLayout = {
    event,
    top: 624,
    height: 48,
    leftPercent: 0,
    widthPercent: 100,
};

describe('TimeGridEvent', () => {
    it('renders the event title', () => {
        render(<TimeGridEvent layout={layout} />);
        expect(screen.getByText('Design Review')).toBeInTheDocument();
    });

    it('renders the time range when tall enough', () => {
        render(<TimeGridEvent layout={layout} />);
        expect(screen.getByText('1:00 PM - 2:00 PM')).toBeInTheDocument();
    });

    it('hides the time range for compact (short) events', () => {
        render(<TimeGridEvent layout={{ ...layout, height: 20 }} />);
        expect(screen.queryByText('1:00 PM - 2:00 PM')).not.toBeInTheDocument();
    });

    it('positions itself using the layout geometry', () => {
        const { container } = render(<TimeGridEvent layout={layout} />);
        const el = container.querySelector('.blue-orange-calendar-time-event') as HTMLElement;
        expect(el.style.top).toBe('624px');
        expect(el.style.height).toBe('48px');
    });

    it('fires onClick with the event', () => {
        const onClick = jest.fn();
        render(<TimeGridEvent layout={layout} onClick={onClick} />);
        fireEvent.click(screen.getByText('Design Review'));
        expect(onClick).toHaveBeenCalledWith(event);
    });

    it('shows a filled availability mark for a busy event', () => {
        const { container } = render(
            <TimeGridEvent
                layout={{
                    ...layout,
                    event: { ...event, availability: CalendarEventAvailability.BUSY },
                }}
            />
        );
        const mark = container.querySelector(
            '.blue-orange-calendar-availability-mark'
        ) as HTMLElement;
        expect(mark).toBeInTheDocument();
        expect(mark.title).toBe('Busy');
        expect(mark.style.backgroundColor).not.toBe('transparent');
    });

    it('shows an outlined availability mark for a free event', () => {
        const { container } = render(
            <TimeGridEvent
                layout={{
                    ...layout,
                    event: { ...event, availability: CalendarEventAvailability.FREE },
                }}
            />
        );
        const mark = container.querySelector(
            '.blue-orange-calendar-availability-mark'
        ) as HTMLElement;
        expect(mark.title).toBe('Free');
        expect(mark.style.backgroundColor).toBe('transparent');
    });
});
