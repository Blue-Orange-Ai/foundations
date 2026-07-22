import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventModal } from './EventModal';
import {
    CalendarDeleteScope,
    CalendarEventResponse,
    ICalendarEvent,
} from '../../interfaces/CalendarInterfaces';

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

    it('renders the formatted time range and a readable duration', () => {
        render(<EventModal event={event} onClose={jest.fn()} />);
        expect(screen.getByText(/1:00 PM - 2:00 PM/)).toBeInTheDocument();
        expect(screen.getByText('1 hour')).toBeInTheDocument();
    });

    it('calls onEdit for an owned event', () => {
        const onEdit = jest.fn();
        render(<EventModal event={event} onClose={jest.fn()} onEdit={onEdit} />);
        fireEvent.click(screen.getByText('Edit'));
        expect(onEdit).toHaveBeenCalledWith(event);
    });

    it('confirms before deleting and reports the scope', () => {
        const onDelete = jest.fn();
        render(<EventModal event={event} onClose={jest.fn()} onDelete={onDelete} />);

        // First press opens the confirmation screen rather than deleting.
        fireEvent.click(screen.getByText('Delete'));
        expect(onDelete).not.toHaveBeenCalled();
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();

        // Confirming deletes. With no guests the scope is "self".
        fireEvent.click(screen.getByText('Delete'));
        expect(onDelete).toHaveBeenCalledWith(event, CalendarDeleteScope.SELF);
    });

    it('offers a "delete for everyone" choice when the event has guests', () => {
        const onDelete = jest.fn();
        const withGuests: ICalendarEvent = { ...event, requiredGuests: ['a@b.com'] };
        render(<EventModal event={withGuests} onClose={jest.fn()} onDelete={onDelete} />);

        fireEvent.click(screen.getByText('Delete'));
        expect(screen.getByText('Delete for everyone')).toBeInTheDocument();
        // Defaults to everyone when guests are present.
        fireEvent.click(screen.getByText('Delete'));
        expect(onDelete).toHaveBeenCalledWith(withGuests, CalendarDeleteScope.EVERYONE);
    });

    it('shows accept / decline / tentative for an invitation the viewer does not own', () => {
        const onRespond = jest.fn();
        const invite: ICalendarEvent = {
            ...event,
            organizer: 'boss@corp.com',
            response: CalendarEventResponse.NEEDS_ACTION,
        };
        render(
            <EventModal
                event={invite}
                currentUser="me@corp.com"
                onClose={jest.fn()}
                onRespond={onRespond}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );
        // No owner controls.
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        // Response controls instead.
        fireEvent.click(screen.getByText('Accept'));
        expect(onRespond).toHaveBeenCalledWith(invite, CalendarEventResponse.ACCEPTED, undefined);
    });

    it('lets a decline propose a new time', () => {
        const onRespond = jest.fn();
        const invite: ICalendarEvent = { ...event, organizer: 'boss@corp.com' };
        render(
            <EventModal
                event={invite}
                currentUser="me@corp.com"
                onClose={jest.fn()}
                onRespond={onRespond}
            />
        );
        fireEvent.click(screen.getByText('Decline'));
        fireEvent.click(screen.getByText('Propose a new time'));
        fireEvent.click(screen.getByText('Decline & propose'));
        expect(onRespond).toHaveBeenCalledTimes(1);
        const [, response, proposed] = onRespond.mock.calls[0];
        expect(response).toBe(CalendarEventResponse.DECLINED);
        expect(proposed).toEqual({ start: invite.start, end: invite.end });
    });

    it('lets the viewer colour an invitation they received', () => {
        const onColorChange = jest.fn();
        const invite: ICalendarEvent = { ...event, organizer: 'boss@corp.com' };
        render(
            <EventModal
                event={invite}
                currentUser="me@corp.com"
                onClose={jest.fn()}
                onColorChange={onColorChange}
            />
        );
        const colorInput = screen.getByPlaceholderText('#e0e1e2') as HTMLInputElement;
        fireEvent.change(colorInput, { target: { value: '#ff0000' } });
        expect(onColorChange).toHaveBeenCalledWith(invite, '#ff0000');
    });

    it('does not offer a colour control for read-only events', () => {
        render(
            <EventModal
                event={{ ...event, isReadOnly: true }}
                onClose={jest.fn()}
                onColorChange={jest.fn()}
            />
        );
        expect(screen.queryByPlaceholderText('#e0e1e2')).not.toBeInTheDocument();
    });

    it('hides owner controls for read-only events', () => {
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
