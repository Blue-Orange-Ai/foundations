import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventModal } from './EventModal';
import { ICalendarEvent } from '../../interfaces/CalendarInterfaces';

const event: ICalendarEvent = {
    id: '1',
    title: 'Design Review',
    start: new Date(2026, 6, 21, 13, 0, 0),
    end: new Date(2026, 6, 21, 14, 0, 0),
    location: 'Room 4',
    body: 'Review the new calendar package.',
};

describe('EventModal', () => {
    it('renders the event title and details', () => {
        render(<EventModal event={event} onClose={jest.fn()} />);
        expect(screen.getByText('Design Review')).toBeInTheDocument();
        expect(screen.getByText('Room 4')).toBeInTheDocument();
        expect(screen.getByText('Review the new calendar package.')).toBeInTheDocument();
    });

    it('renders the formatted time range', () => {
        render(<EventModal event={event} onClose={jest.fn()} />);
        expect(screen.getByText(/1:00 PM - 2:00 PM/)).toBeInTheDocument();
    });

    it('calls onDelete and onEdit', () => {
        const onDelete = jest.fn();
        const onEdit = jest.fn();
        render(
            <EventModal event={event} onClose={jest.fn()} onDelete={onDelete} onEdit={onEdit} />
        );
        fireEvent.click(screen.getByText('Delete'));
        fireEvent.click(screen.getByText('Edit'));
        expect(onDelete).toHaveBeenCalledWith(event);
        expect(onEdit).toHaveBeenCalledWith(event);
    });

    it('hides action buttons for read-only events', () => {
        render(
            <EventModal
                event={{ ...event, isReadOnly: true }}
                onClose={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
            />
        );
        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
});
