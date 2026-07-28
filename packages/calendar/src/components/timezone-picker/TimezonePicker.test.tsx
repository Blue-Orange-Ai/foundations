import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TimezonePicker } from './TimezonePicker';
import { getTimezoneName } from '../../utils/calendarUtils';

describe('TimezonePicker', () => {
    it('ticks the selected timezone and keeps it at the top of the list', () => {
        const { container } = render(
            <TimezonePicker timezone="Asia/Tokyo" onSelect={vi.fn()} onClose={vi.fn()} />
        );
        const options = container.querySelectorAll(
            '.blue-orange-calendar-timezone-picker-option'
        );
        expect(options[0]).toHaveTextContent('Asia / Tokyo');
        expect(
            options[0].querySelector('.blue-orange-calendar-timezone-picker-option-tick')
        ).toBeInTheDocument();
        // Exactly one row is ticked.
        expect(
            container.querySelectorAll('.blue-orange-calendar-timezone-picker-option-tick').length
        ).toBe(1);
    });

    it('moves the tick to whichever zone the search turns up and selects it', () => {
        const onSelect = vi.fn();
        render(<TimezonePicker timezone="Asia/Tokyo" onSelect={onSelect} onClose={vi.fn()} />);
        fireEvent.change(screen.getByPlaceholderText('Search timezones...'), {
            target: { value: 'Tokyo' },
        });
        fireEvent.click(screen.getByText('Asia / Tokyo'));
        expect(onSelect).toHaveBeenCalledWith('Asia/Tokyo');
    });

    it('selects the device timezone from the footer button', () => {
        const onSelect = vi.fn();
        render(<TimezonePicker timezone="Asia/Tokyo" onSelect={onSelect} onClose={vi.fn()} />);
        fireEvent.click(screen.getByText('Current timezone'));
        expect(onSelect).toHaveBeenCalledWith(getTimezoneName());
    });
});
