import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineToolbar } from './TimelineToolbar';
import { TimelineInteractionMode } from '../../interfaces/TimelineInterfaces';

describe('TimelineToolbar', () => {
    it('renders the interaction mode buttons and highlights the active one', () => {
        const { container } = render(
            <TimelineToolbar mode={TimelineInteractionMode.PAN} onModeChange={() => undefined} />
        );
        expect(container.querySelector('.blue-orange-timeline-mode-active')).toBeInTheDocument();
    });

    it('fires onModeChange when a mode button is clicked', () => {
        const onModeChange = jest.fn();
        const { container } = render(
            <TimelineToolbar mode={TimelineInteractionMode.SELECTION} onModeChange={onModeChange} />
        );
        const buttons = container.querySelectorAll('.blue-orange-default-btn-icon');
        // Click the second mode button (Pan).
        fireEvent.click(buttons[1]);
        expect(onModeChange).toHaveBeenCalledWith(TimelineInteractionMode.PAN);
    });

    it('shows the formatted time when provided', () => {
        render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                time={2000}
            />
        );
        expect(screen.getByText('2s')).toBeInTheDocument();
    });
});
