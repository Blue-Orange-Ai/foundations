import React from 'react';
import { render } from '@testing-library/react';
import { Timeline } from './Timeline';
import { ITimelineModel } from '../../interfaces/TimelineInterfaces';

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
});
