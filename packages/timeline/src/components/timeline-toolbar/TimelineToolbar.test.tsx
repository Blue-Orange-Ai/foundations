import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineToolbar } from './TimelineToolbar';
import { TimelineInteractionMode, TimelineTimeMode } from '../../interfaces/TimelineInterfaces';

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

    it('renders the time-mode switch and fires onTimeModeChange', () => {
        const onTimeModeChange = jest.fn();
        const { container } = render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                timeMode={TimelineTimeMode.RELATIVE}
                onTimeModeChange={onTimeModeChange}
            />
        );
        // The two time-mode buttons follow the three interaction-mode buttons.
        const buttons = container.querySelectorAll('.blue-orange-default-btn-icon');
        fireEvent.click(buttons[4]); // Date / time
        expect(onTimeModeChange).toHaveBeenCalledWith(TimelineTimeMode.ABSOLUTE);
    });

    it('shows the Focus events button only in absolute mode', () => {
        const onFocusEvents = jest.fn();
        const { rerender, container } = render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                timeMode={TimelineTimeMode.RELATIVE}
                onFocusEvents={onFocusEvents}
            />
        );
        expect(container.querySelector('.ri-focus-3-line')).toBeNull();
        rerender(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                timeMode={TimelineTimeMode.ABSOLUTE}
                onFocusEvents={onFocusEvents}
            />
        );
        const focusBtn = container.querySelector('.ri-focus-3-line');
        expect(focusBtn).not.toBeNull();
        fireEvent.click(focusBtn!.closest('.blue-orange-default-btn-icon')!);
        expect(onFocusEvents).toHaveBeenCalled();
    });

    it('formats the time as a date in absolute mode', () => {
        const t = new Date(2021, 2, 4, 9, 5, 30).getTime();
        render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                timeMode={TimelineTimeMode.ABSOLUTE}
                time={t}
            />
        );
        expect(screen.getByText('09:05:30')).toBeInTheDocument();
    });
});
