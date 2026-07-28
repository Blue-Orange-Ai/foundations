import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventFormModal } from './EventFormModal';
import {
    CalendarEventAvailability,
    ICalendarEvent,
} from '../../interfaces/CalendarInterfaces';

const start = new Date(2026, 6, 22, 9, 0, 0);
const end = new Date(2026, 6, 22, 10, 0, 0);

describe('EventFormModal', () => {
    it('renders the full field set', () => {
        render(<EventFormModal start={start} end={end} onCancel={vi.fn()} onCreate={vi.fn()} />);
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('When')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Colour')).toBeInTheDocument();
        expect(screen.getByText('Availability')).toBeInTheDocument();
        expect(screen.getByText('Notification')).toBeInTheDocument();
        expect(screen.getByText('Video conferencing')).toBeInTheDocument();
    });

    it('hides guest fields unless email compatibility is on', () => {
        const { rerender } = render(
            <EventFormModal start={start} end={end} onCancel={vi.fn()} onCreate={vi.fn()} />
        );
        expect(screen.queryByText('Required guests')).not.toBeInTheDocument();

        rerender(
            <EventFormModal
                start={start}
                end={end}
                emailCompatibility={true}
                onCancel={vi.fn()}
                onCreate={vi.fn()}
            />
        );
        expect(screen.getByText('Required guests')).toBeInTheDocument();
        expect(screen.getByText('Optional guests')).toBeInTheDocument();
    });

    it('builds an event with the defaults on submit', () => {
        const onCreate = vi.fn();
        render(<EventFormModal start={start} end={end} onCancel={vi.fn()} onCreate={onCreate} />);
        fireEvent.click(screen.getByText('Create'));

        expect(onCreate).toHaveBeenCalledTimes(1);
        const event = onCreate.mock.calls[0][0];
        expect(event.title).toBe('New event');
        expect(event.start).toEqual(start);
        expect(event.end).toEqual(end);
        expect(event.availability).toBe(CalendarEventAvailability.BUSY);
        // Default reminder is 30 minutes before.
        expect(event.reminderMinutes).toBe(30);
    });

    it('mirrors the title into the modal header as it is edited', () => {
        const { container } = render(
            <EventFormModal start={start} end={end} onCancel={vi.fn()} onCreate={vi.fn()} />
        );
        const header = container.querySelector('.blue-orange-modal-header-label') as HTMLElement;
        expect(header).toHaveTextContent('New event');

        const titleInput = container.querySelector('.blue-orange-input') as HTMLInputElement;
        fireEvent.change(titleInput, { target: { value: 'Sprint planning' } });
        expect(header).toHaveTextContent('Sprint planning');
    });

    it('fills the header swatch when busy and outlines it when free', () => {
        const { container } = render(
            <EventFormModal
                start={start}
                end={end}
                sources={[{ id: 'w', name: 'Work', borderColor: 'rgb(1, 2, 3)' }]}
                onCancel={vi.fn()}
                onCreate={vi.fn()}
            />
        );
        const swatch = container.querySelector(
            '.blue-orange-calendar-event-form-swatch'
        ) as HTMLElement;
        // Busy by default: filled.
        expect(swatch.style.backgroundColor).toBe('rgb(1, 2, 3)');

        fireEvent.click(screen.getByText('Free'));
        // Free: transparent fill, colour kept on the border.
        expect(swatch.style.backgroundColor).toBe('transparent');
        expect(swatch.style.borderColor).toBe('rgb(1, 2, 3)');
    });

    it('prefills fields and saves an edited event under the same id', () => {
        const onCreate = vi.fn();
        const initialEvent: ICalendarEvent = {
            id: 'evt-42',
            title: 'Standup',
            start,
            end,
            location: 'Room 1',
            calendarId: 'work',
            availability: CalendarEventAvailability.FREE,
        };
        const { container } = render(
            <EventFormModal
                mode="edit"
                initialEvent={initialEvent}
                start={start}
                end={end}
                onCancel={vi.fn()}
                onCreate={onCreate}
            />
        );
        const header = container.querySelector('.blue-orange-modal-header-label') as HTMLElement;
        expect(header).toHaveTextContent('Standup');
        // The primary button reads "Save" when editing.
        fireEvent.click(screen.getByText('Save'));
        expect(onCreate).toHaveBeenCalledTimes(1);
        const saved = onCreate.mock.calls[0][0];
        expect(saved.id).toBe('evt-42');
        expect(saved.title).toBe('Standup');
        expect(saved.calendarId).toBe('work');
        expect(saved.availability).toBe(CalendarEventAvailability.FREE);
    });

    it('places the guest fields directly under the When block', () => {
        const { container } = render(
            <EventFormModal
                start={start}
                end={end}
                emailCompatibility={true}
                onCancel={vi.fn()}
                onCreate={vi.fn()}
            />
        );
        const labels = Array.from(
            container.querySelectorAll('.blue-orange-calendar-event-form-label')
        ).map((node) => node.textContent);
        const whenAt = labels.indexOf('When');
        expect(labels[whenAt + 1]).toBe('Required guests');
        expect(labels[whenAt + 2]).toBe('Optional guests');
    });
});
