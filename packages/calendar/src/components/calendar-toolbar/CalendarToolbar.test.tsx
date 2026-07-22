import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarToolbar } from './CalendarToolbar';
import { CalendarView } from '../../interfaces/CalendarInterfaces';

const baseProps = {
    date: new Date('2026-07-21T00:00:00'),
    view: CalendarView.MONTH,
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onToday: jest.fn(),
    onViewChange: jest.fn(),
};

describe('CalendarToolbar', () => {
    it('renders the formatted period title', () => {
        render(<CalendarToolbar {...baseProps} />);
        expect(screen.getByText('July 2026')).toBeInTheDocument();
    });

    it('renders the view switcher options', () => {
        render(<CalendarToolbar {...baseProps} />);
        expect(screen.getByText('Month')).toBeInTheDocument();
        expect(screen.getByText('Week')).toBeInTheDocument();
        expect(screen.getByText('Day')).toBeInTheDocument();
    });

    it('calls onToday when Today is clicked', () => {
        const onToday = jest.fn();
        render(<CalendarToolbar {...baseProps} onToday={onToday} />);
        fireEvent.click(screen.getByText('Today'));
        expect(onToday).toHaveBeenCalledTimes(1);
    });

    it('calls onViewChange with the selected view', () => {
        const onViewChange = jest.fn();
        render(<CalendarToolbar {...baseProps} onViewChange={onViewChange} />);
        fireEvent.click(screen.getByText('Week'));
        expect(onViewChange).toHaveBeenCalledWith(CalendarView.WEEK);
    });

    it('shows the create button only when onCreate is provided', () => {
        const { rerender } = render(<CalendarToolbar {...baseProps} />);
        expect(screen.queryByText('New event')).not.toBeInTheDocument();
        rerender(<CalendarToolbar {...baseProps} onCreate={jest.fn()} />);
        expect(screen.getByText('New event')).toBeInTheDocument();
    });

    it('marks the active view button and follows a view change', () => {
        const { container, rerender } = render(
            <CalendarToolbar {...baseProps} view={CalendarView.WEEK} />
        );
        const primary = () =>
            Array.from(
                container.querySelectorAll(
                    '.blue-orange-calendar-toolbar-views .foundations-primary-btn'
                )
            ).map((node) => node.textContent);

        expect(primary()).toEqual(['Week']);

        rerender(<CalendarToolbar {...baseProps} view={CalendarView.DAY} />);
        expect(primary()).toEqual(['Day']);
    });
});
