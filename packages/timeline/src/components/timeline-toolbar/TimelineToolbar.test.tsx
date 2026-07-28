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
        const onModeChange = vi.fn();
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
        const onTimeModeChange = vi.fn();
        const { container } = render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                timeMode={TimelineTimeMode.RELATIVE}
                onTimeModeChange={onTimeModeChange}
            />
        );
        // The two time-mode buttons follow the two interaction-mode buttons.
        const buttons = container.querySelectorAll('.blue-orange-default-btn-icon');
        fireEvent.click(buttons[3]); // Date / time
        expect(onTimeModeChange).toHaveBeenCalledWith(TimelineTimeMode.ABSOLUTE);
    });

    it('renders only Select and Pan interaction modes (no Zoom mode)', () => {
        const { container } = render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
            />
        );
        const group = container.querySelector('.blue-orange-timeline-toolbar-group')!;
        expect(group.querySelector('.ri-cursor-line')).not.toBeNull();
        expect(group.querySelector('.ri-drag-move-2-line')).not.toBeNull();
        // The former "Zoom" interaction mode used the search icon.
        expect(group.querySelector('.ri-search-line')).toBeNull();
    });

    it('renders skip-to-previous / skip-to-next event controls flanking play', () => {
        const onPrevEvent = vi.fn();
        const onNextEvent = vi.fn();
        const { container } = render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                onPlayPause={() => undefined}
                onPrevEvent={onPrevEvent}
                onNextEvent={onNextEvent}
            />
        );
        const group = container.querySelector(
            '.blue-orange-timeline-toolbar-playback .blue-orange-timeline-toolbar-group'
        )!;
        const children = Array.from(group.children);
        const prevIdx = children.findIndex((c) => c.querySelector('.ri-skip-back-line'));
        const playIdx = children.findIndex((c) => c.querySelector('.ri-play-line'));
        const nextIdx = children.findIndex((c) => c.querySelector('.ri-skip-forward-line'));
        expect(prevIdx).toBeLessThan(playIdx);
        expect(playIdx).toBeLessThan(nextIdx);
        fireEvent.click(children[prevIdx]);
        fireEvent.click(children[nextIdx]);
        expect(onPrevEvent).toHaveBeenCalled();
        expect(onNextEvent).toHaveBeenCalled();
    });

    it('shows the Focus events button only in absolute mode', () => {
        const onFocusEvents = vi.fn();
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

    it('renders the speed dropdown showing the current multiplier', () => {
        const { container } = render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                onPlayPause={() => undefined}
                speed={2}
                onSpeedChange={() => undefined}
                speeds={[1, 2, 4]}
            />
        );
        const speed = container.querySelector('.blue-orange-timeline-toolbar-speed');
        expect(speed).not.toBeNull();
        expect(speed).toHaveTextContent('2×');
    });

    it('places the speed dropdown outside the centered transport group', () => {
        const { container } = render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                onPlayPause={() => undefined}
                onStop={() => undefined}
                speed={1}
                onSpeedChange={() => undefined}
                speeds={[1, 2, 4]}
            />
        );
        const transport = container.querySelector('.blue-orange-timeline-toolbar-playback')!;
        // The transport group keeps only the play/stop controls, centered.
        expect(transport.querySelector('.blue-orange-timeline-toolbar-speed')).toBeNull();
        // The speed dropdown lives on the right, after the flexible spacer.
        const spacer = container.querySelector('.blue-orange-timeline-toolbar-spacer')!;
        const speed = container.querySelector('.blue-orange-timeline-toolbar-speed')!;
        expect(speed).not.toBeNull();
        expect(
            spacer.compareDocumentPosition(speed) & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
    });

    it('does not render the speed dropdown without onSpeedChange', () => {
        const { container } = render(
            <TimelineToolbar
                mode={TimelineInteractionMode.SELECTION}
                onModeChange={() => undefined}
                onPlayPause={() => undefined}
            />
        );
        expect(container.querySelector('.blue-orange-timeline-toolbar-speed')).toBeNull();
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
