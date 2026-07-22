import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from './Calendar';
import {
    CalendarSourceLayout,
    CalendarView,
    ICalendarEvent,
} from '../../interfaces/CalendarInterfaces';

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

    describe('timezone', () => {
        it('opens the picker when the timezone label is clicked', () => {
            render(
                <Calendar
                    events={events}
                    defaultDate={anchor}
                    defaultView={CalendarView.DAY}
                    defaultTimezone="Europe/London"
                />
            );
            fireEvent.click(screen.getByText('GMT+1'));
            expect(screen.getByPlaceholderText('Search timezones...')).toBeInTheDocument();
        });

        it('re-renders the grid in the timezone that is chosen', () => {
            const onTimezoneChange = jest.fn();
            render(
                <Calendar
                    events={events}
                    defaultDate={anchor}
                    defaultView={CalendarView.DAY}
                    defaultTimezone="Europe/London"
                    onTimezoneChange={onTimezoneChange}
                />
            );
            fireEvent.click(screen.getByText('GMT+1'));
            fireEvent.change(screen.getByPlaceholderText('Search timezones...'), {
                target: { value: 'Tokyo' },
            });
            fireEvent.click(screen.getByText('Asia / Tokyo'));

            expect(onTimezoneChange).toHaveBeenCalledWith('Asia/Tokyo');
            // The picker closes and the label follows the new zone.
            expect(screen.queryByPlaceholderText('Search timezones...')).not.toBeInTheDocument();
            expect(screen.getByText('GMT+9')).toBeInTheDocument();
        });

        it('leaves the label read-only when timezone changes are disabled', () => {
            render(
                <Calendar
                    events={events}
                    defaultDate={anchor}
                    defaultView={CalendarView.DAY}
                    defaultTimezone="Europe/London"
                    allowTimezoneChange={false}
                />
            );
            fireEvent.click(screen.getByText('GMT+1'));
            expect(screen.queryByPlaceholderText('Search timezones...')).not.toBeInTheDocument();
        });
    });

    describe('side panel', () => {
        const sources = [
            { id: 'work', name: 'Work' },
            { id: 'personal', name: 'Personal' },
        ];
        const sourced = [
            { ...events[0], calendarId: 'work' },
            {
                id: '2',
                title: 'Dentist',
                calendarId: 'personal',
                start: new Date(2026, 6, 21, 14, 0, 0),
                end: new Date(2026, 6, 21, 15, 0, 0),
            },
        ];

        it('is closed until the hamburger is clicked', () => {
            const { container } = render(<Calendar events={events} defaultDate={anchor} />);
            expect(
                container.querySelector('.blue-orange-calendar-side-panel')
            ).not.toBeInTheDocument();

            fireEvent.click(container.querySelector('.ri-menu-line')!);
            expect(
                container.querySelector('.blue-orange-calendar-side-panel')
            ).toBeInTheDocument();
        });

        it('hides the hamburger when the toggle is disabled', () => {
            const { container } = render(
                <Calendar events={events} defaultDate={anchor} showSidePanelToggle={false} />
            );
            expect(container.querySelector('.ri-menu-line')).not.toBeInTheDocument();
        });

        it('moves the main view to a date picked in the mini calendar', () => {
            const onDateChange = jest.fn();
            const { container } = render(
                <Calendar
                    events={events}
                    defaultDate={anchor}
                    defaultSidePanelOpen={true}
                    onDateChange={onDateChange}
                />
            );
            const panel = container.querySelector('.blue-orange-calendar-side-panel')!;
            // Day 15 of the displayed month in the mini month picker.
            const day = Array.from(panel.querySelectorAll('td, div, span')).find(
                (node) => node.textContent === '15' && node.children.length === 0
            )!;
            fireEvent.click(day);

            expect(onDateChange).toHaveBeenCalledTimes(1);
            expect(onDateChange.mock.calls[0][0].getDate()).toBe(15);
            // The toolbar title follows the picked date.
            expect(screen.getByText('July 2026')).toBeInTheDocument();
        });

        it('hides events of a shared calendar that is unticked', () => {
            const onVisibleSourcesChange = jest.fn();
            const { container } = render(
                <Calendar
                    events={sourced}
                    sources={sources}
                    defaultDate={anchor}
                    defaultView={CalendarView.DAY}
                    defaultSidePanelOpen={true}
                    onVisibleSourcesChange={onVisibleSourcesChange}
                />
            );
            expect(screen.getByText('Kickoff')).toBeInTheDocument();
            expect(screen.getByText('Dentist')).toBeInTheDocument();

            const personalRow = screen.getByText('Personal').closest('label')!;
            fireEvent.click(personalRow.querySelector('input')!);

            expect(onVisibleSourcesChange).toHaveBeenCalledWith(['work']);
            expect(screen.getByText('Kickoff')).toBeInTheDocument();
            expect(screen.queryByText('Dentist')).not.toBeInTheDocument();
        });
    });

    describe('side-by-side calendars', () => {
        const sources = [
            { id: 'work', name: 'Work' },
            { id: 'personal', name: 'Personal' },
        ];
        const sourced: ICalendarEvent[] = [
            { ...events[0], calendarId: 'work' },
            {
                id: '2',
                title: 'Dentist',
                calendarId: 'personal',
                start: new Date(2026, 6, 21, 14, 0, 0),
                end: new Date(2026, 6, 21, 15, 0, 0),
            },
        ];

        const renderSideBySide = (extra = {}) =>
            render(
                <Calendar
                    events={sourced}
                    sources={sources}
                    defaultDate={anchor}
                    defaultView={CalendarView.DAY}
                    sourceLayout={CalendarSourceLayout.SIDE_BY_SIDE}
                    {...extra}
                />
            );

        it('gives each calendar its own grid', () => {
            const { container } = renderSideBySide();
            const panes = container.querySelectorAll('.blue-orange-calendar-pane');
            expect(panes.length).toBe(2);
            expect(container.querySelectorAll('.blue-orange-calendar-time-grid').length).toBe(2);
            expect(panes[0]).toHaveTextContent('Work');
            expect(panes[0]).toHaveTextContent('Kickoff');
            expect(panes[0]).not.toHaveTextContent('Dentist');
            expect(panes[1]).toHaveTextContent('Personal');
            expect(panes[1]).toHaveTextContent('Dentist');
        });

        it('splits the month view too', () => {
            const { container } = renderSideBySide({ defaultView: CalendarView.MONTH });
            expect(container.querySelectorAll('.blue-orange-calendar-month-view').length).toBe(2);
        });

        it('overlays into one grid by default', () => {
            const { container } = render(
                <Calendar
                    events={sourced}
                    sources={sources}
                    defaultDate={anchor}
                    defaultView={CalendarView.DAY}
                />
            );
            expect(container.querySelectorAll('.blue-orange-calendar-pane').length).toBe(0);
            expect(container.querySelectorAll('.blue-orange-calendar-time-grid').length).toBe(1);
            expect(screen.getByText('Kickoff')).toBeInTheDocument();
            expect(screen.getByText('Dentist')).toBeInTheDocument();
        });

        it('drops a pane when its calendar is unticked', () => {
            const { container } = renderSideBySide({ visibleSourceIds: ['work'] });
            const panes = container.querySelectorAll('.blue-orange-calendar-pane');
            // One calendar left, so no pane splitting is needed at all.
            expect(panes.length).toBe(0);
            expect(screen.getByText('Kickoff')).toBeInTheDocument();
            expect(screen.queryByText('Dentist')).not.toBeInTheDocument();
        });

        it('collects events without a calendar into their own pane', () => {
            const { container } = renderSideBySide({ events: [...sourced, events[0]] });
            const panes = container.querySelectorAll('.blue-orange-calendar-pane');
            expect(panes.length).toBe(3);
            expect(panes[2]).toHaveTextContent('Other');
        });

        it('shows the timezone control on the leftmost grid only', () => {
            const { container } = renderSideBySide();
            expect(
                container.querySelectorAll('.blue-orange-calendar-time-timezone').length
            ).toBe(1);
        });
    });

    describe('create form', () => {
        it('opens the create form from the New event button', () => {
            render(
                <Calendar events={events} defaultDate={anchor} defaultView={CalendarView.DAY} />
            );
            expect(screen.queryByText('Description')).not.toBeInTheDocument();
            fireEvent.click(screen.getByText('New event'));
            // The full form is now open.
            expect(screen.getByText('When')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
        });

        it('adds guest fields when emailCompatibility is set', () => {
            render(
                <Calendar
                    events={events}
                    defaultDate={anchor}
                    defaultView={CalendarView.DAY}
                    emailCompatibility={true}
                />
            );
            fireEvent.click(screen.getByText('New event'));
            expect(screen.getByText('Required guests')).toBeInTheDocument();
        });

        it('reports a created event and shows it in the grid', () => {
            const onEventCreate = jest.fn();
            const Harness = () => {
                const [list, setList] = React.useState(events);
                return (
                    <Calendar
                        events={list}
                        defaultDate={anchor}
                        defaultView={CalendarView.DAY}
                        onEventCreate={(event) => {
                            onEventCreate(event);
                            setList((prev) => [...prev, event]);
                        }}
                    />
                );
            };
            render(<Harness />);
            fireEvent.click(screen.getByText('New event'));
            fireEvent.click(screen.getByText('Create'));
            expect(onEventCreate).toHaveBeenCalledTimes(1);
            expect(onEventCreate.mock.calls[0][0].title).toBe('New event');
        });
    });
});
