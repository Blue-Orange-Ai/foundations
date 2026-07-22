import { ITimelineModel } from '../../interfaces/TimelineInterfaces';

/**
 * A sample animation model for the local development harness — a handful of
 * tracks with individual keyframes and a couple of grouped ranges, spread over
 * ten seconds (values are milliseconds).
 */
export const mockModel: ITimelineModel = {
    rows: [
        {
            title: 'Camera',
            keyframes: [
                { val: 0 },
                { val: 1500 },
                { val: 4000 },
                { val: 9000 },
            ],
        },
        {
            title: 'Opacity',
            keyframes: [
                { val: 500 },
                { val: 2500 },
                { val: 6000 },
            ],
        },
        {
            title: 'Position (group)',
            groups: [{ id: 'move' }],
            keyframes: [
                { val: 1000, group: 'move' },
                { val: 3000, group: 'move' },
                { val: 5200, group: 'move' },
                { val: 7500 },
            ],
        },
        {
            title: 'Scale',
            keyframes: [
                { val: 0, style: { shape: undefined } },
                { val: 2000 },
                { val: 3500, selected: true },
                { val: 8000 },
            ],
        },
        {
            title: 'Rotation',
            keyframes: [
                { val: 800 },
                { val: 4200 },
                { val: 4700 },
                { val: 6800 },
                { val: 9500 },
            ],
        },
        {
            title: 'Color (locked)',
            keyframes: [
                { val: 1200, draggable: false },
                { val: 5000, draggable: false },
                { val: 8800, draggable: false },
            ],
        },
    ],
};
