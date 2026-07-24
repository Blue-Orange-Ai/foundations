import React from 'react';
import { render } from '@testing-library/react';
import { Timeline, TimelineHandle } from './Timeline';
import { ITimelineModel, TimelineTimeMode } from '../../interfaces/TimelineInterfaces';

/**
 * jsdom has no canvas backend, so stub a no-op 2D context. This lets the
 * component's draw path run end to end without throwing during tests.
 */
const stub2dContext = () => {
    const noop = () => undefined;
    return {
        setTransform: noop,
        clearRect: noop,
        fillRect: noop,
        strokeRect: noop,
        beginPath: noop,
        closePath: noop,
        moveTo: noop,
        lineTo: noop,
        arc: noop,
        arcTo: noop,
        rect: noop,
        fill: noop,
        stroke: noop,
        fillText: noop,
        setLineDash: noop,
        save: noop,
        restore: noop,
        translate: noop,
        scale: noop,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: 'left',
        textBaseline: 'alphabetic',
    } as unknown as CanvasRenderingContext2D;
};

beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (HTMLCanvasElement.prototype as any).getContext = jest.fn(() => stub2dContext());
});

const model: ITimelineModel = {
    rows: [
        { title: 'Row A', keyframes: [{ val: 0 }, { val: 1000 }] },
        { title: 'Row B', keyframes: [{ val: 500, group: 'g' }, { val: 1500, group: 'g' }], groups: [{ id: 'g' }] },
    ],
};

describe('Timeline', () => {
    it('renders a canvas', () => {
        const { container } = render(<Timeline model={model} options={{ max: 2000 }} />);
        expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('renders the labels column when rows have titles', () => {
        const { container } = render(<Timeline model={model} options={{ max: 2000 }} />);
        const labels = container.querySelectorAll('.blue-orange-timeline-label-title');
        expect(labels).toHaveLength(2);
        expect(labels[0]).toHaveTextContent('Row A');
    });

    it('hides the labels column when showLabels is false', () => {
        const { container } = render(
            <Timeline model={model} options={{ max: 2000 }} showLabels={false} />
        );
        expect(container.querySelector('.blue-orange-timeline-labels')).toBeNull();
    });

    it('applies the dark class', () => {
        const { container } = render(<Timeline model={model} dark />);
        expect(container.querySelector('.blue-orange-timeline-dark')).toBeInTheDocument();
    });

    it('renders in absolute (date) time mode without throwing', () => {
        const now = new Date(2022, 5, 1, 12, 0, 0).getTime();
        const dates: ITimelineModel = {
            rows: [{ title: 'Events', keyframes: [{ val: now - 86400000 }, { val: now }] }],
        };
        const { container } = render(
            <Timeline model={dates} timeMode={TimelineTimeMode.ABSOLUTE} options={{ now }} />
        );
        expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('exposes focusEvents / setTimeMode on the imperative handle', () => {
        const ref = React.createRef<TimelineHandle>();
        render(<Timeline ref={ref} model={model} />);
        expect(typeof ref.current?.focusEvents).toBe('function');
        expect(typeof ref.current?.setTimeMode).toBe('function');
        // Switching mode and focusing should not throw against the stub canvas.
        expect(() => {
            ref.current?.setTimeMode(TimelineTimeMode.ABSOLUTE);
            ref.current?.focusEvents();
        }).not.toThrow();
    });
});
