import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

    it('draws hourly rows only by default', () => {
        const { container } = render(
            <TimeGridView date={date} view={CalendarView.DAY} events={[]} showNowIndicator={false} />
        );
        expect(
            container.querySelectorAll('.blue-orange-calendar-time-slot-half').length
        ).toBe(0);
        expect(screen.queryByText('1:30 AM')).not.toBeInTheDocument();
    });

    it('subdivides each hour when slotMinutes is 30', () => {
        const { container } = render(
            <TimeGridView
                date={date}
                view={CalendarView.DAY}
                events={[]}
                showNowIndicator={false}
                slotMinutes={30}
            />
        );
        expect(
            container.querySelectorAll('.blue-orange-calendar-time-slot-half').length
        ).toBe(24);
        expect(screen.getByText('12:30 AM')).toBeInTheDocument();
        expect(screen.getByText('11:30 PM')).toBeInTheDocument();
    });

    it('floats all-day events over the time body', () => {
        const { container } = render(
            <TimeGridView date={date} view={CalendarView.DAY} events={events} showNowIndicator={false} />
        );
        expect(screen.getByText('All Hands')).toBeInTheDocument();
        expect(
            container.querySelector('.blue-orange-calendar-time-allday-floating')
        ).toBeInTheDocument();
    });

    it('labels the gutter corner with the timezone', () => {
        const { container } = render(
            <TimeGridView
                date={date}
                view={CalendarView.DAY}
                events={[]}
                showNowIndicator={false}
                timezoneLabel="GMT+1"
            />
        );
        const corner = container.querySelector('.blue-orange-calendar-time-gutter-corner');
        expect(corner).toHaveTextContent('GMT+1');
    });

    it('hides the timezone label when it is blank', () => {
        const { container } = render(
            <TimeGridView
                date={date}
                view={CalendarView.DAY}
                events={[]}
                showNowIndicator={false}
                timezoneLabel=""
            />
        );
        expect(
            container.querySelector('.blue-orange-calendar-time-timezone')
        ).not.toBeInTheDocument();
    });

    it('opens scrolled to the current time', () => {
        const { container } = render(
            <TimeGridView date={date} view={CalendarView.DAY} events={[]} showNowIndicator={false} />
        );
        const body = container.querySelector('.blue-orange-calendar-time-body') as HTMLElement;
        const now = new Date();
        // jsdom gives the body no height, so the offset is the raw "now" position.
        expect(body.scrollTop).toBe(((now.getHours() * 60 + now.getMinutes()) / 60) * 48);
    });

    it('stays at the top when scrollToCurrentTime is false', () => {
        const { container } = render(
            <TimeGridView
                date={date}
                view={CalendarView.DAY}
                events={[]}
                showNowIndicator={false}
                scrollToCurrentTime={false}
            />
        );
        const body = container.querySelector('.blue-orange-calendar-time-body') as HTMLElement;
        expect(body.scrollTop).toBe(0);
    });

    // jsdom reports a zeroed bounding rect, so clientY is the column offset and
    // 48px (HOUR_HEIGHT) of travel is exactly one hour.
    describe('drag to create', () => {
        it('draws a draft event while dragging', () => {
            const { container } = render(
                <TimeGridView
                    date={date}
                    view={CalendarView.DAY}
                    events={[]}
                    showNowIndicator={false}
                    onRangeSelect={jest.fn()}
                />
            );
            const column = container.querySelector('.blue-orange-calendar-time-column')!;
            fireEvent.mouseDown(column, { button: 0, clientY: 96 });
            fireEvent.mouseMove(window, { clientY: 144 });

            expect(screen.getByText('New event')).toBeInTheDocument();
            expect(screen.getByText('2:00 AM - 3:00 AM')).toBeInTheDocument();
        });

        it('reports the dragged range on release and clears the draft', () => {
            const onRangeSelect = jest.fn();
            const { container } = render(
                <TimeGridView
                    date={date}
                    view={CalendarView.DAY}
                    events={[]}
                    showNowIndicator={false}
                    onRangeSelect={onRangeSelect}
                />
            );
            const column = container.querySelector('.blue-orange-calendar-time-column')!;
            fireEvent.mouseDown(column, { button: 0, clientY: 96 });
            fireEvent.mouseMove(window, { clientY: 144 });
            fireEvent.mouseUp(window, { clientY: 144 });

            expect(onRangeSelect).toHaveBeenCalledTimes(1);
            const [start, end] = onRangeSelect.mock.calls[0];
            expect(start).toEqual(new Date(2026, 6, 21, 2, 0, 0));
            expect(end).toEqual(new Date(2026, 6, 21, 3, 0, 0));
            expect(screen.queryByText('New event')).not.toBeInTheDocument();
        });

        it('ignores a press that never moves', () => {
            const onRangeSelect = jest.fn();
            const { container } = render(
                <TimeGridView
                    date={date}
                    view={CalendarView.DAY}
                    events={[]}
                    showNowIndicator={false}
                    onRangeSelect={onRangeSelect}
                />
            );
            const column = container.querySelector('.blue-orange-calendar-time-column')!;
            fireEvent.mouseDown(column, { button: 0, clientY: 96 });
            fireEvent.mouseUp(window, { clientY: 96 });

            expect(onRangeSelect).not.toHaveBeenCalled();
        });

        it('does not start a selection from an existing event', () => {
            const onRangeSelect = jest.fn();
            render(
                <TimeGridView
                    date={date}
                    view={CalendarView.DAY}
                    events={events}
                    showNowIndicator={false}
                    onRangeSelect={onRangeSelect}
                />
            );
            fireEvent.mouseDown(screen.getByText('Design Review'), { button: 0, clientY: 96 });
            fireEvent.mouseMove(window, { clientY: 144 });
            fireEvent.mouseUp(window, { clientY: 144 });

            expect(onRangeSelect).not.toHaveBeenCalled();
        });
    });

    it('renders event times in the given timezone', () => {
        const utcEvent: ICalendarEvent[] = [
            {
                id: 'tz',
                title: 'Standup',
                start: new Date('2026-07-21T09:00:00Z'),
                end: new Date('2026-07-21T10:00:00Z'),
            },
        ];
        render(
            <TimeGridView
                date={new Date('2026-07-21T00:00:00Z')}
                view={CalendarView.DAY}
                events={utcEvent}
                showNowIndicator={false}
                timezone="Europe/London"
            />
        );
        expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument();
        expect(screen.getByText('GMT+1')).toBeInTheDocument();
    });
});
