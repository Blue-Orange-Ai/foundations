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

const HOUR = 3600000;
const DAY = 86400000;

/**
 * A sample model for the ABSOLUTE (date / timestamp) display mode. Values are
 * epoch milliseconds spread across the days either side of `now`, mixing events
 * that have already occurred with a few scheduled in the future — so the
 * infinite pan and the "Focus events" button have something to frame. Built
 * relative to the module's load time so the demo always straddles "now".
 */
export const mockDateModel = (now: number): ITimelineModel => ({
    rows: [
        {
            title: 'Deployments',
            keyframes: [
                { val: now - 6 * DAY - 2 * HOUR },
                { val: now - 3 * DAY },
                { val: now - 4 * HOUR },
                { val: now + 2 * DAY, style: undefined },
            ],
        },
        {
            title: 'Incidents',
            keyframes: [
                { val: now - 5 * DAY - 5 * HOUR, selected: true },
                { val: now - 26 * HOUR },
            ],
        },
        {
            title: 'Release (group)',
            groups: [{ id: 'release' }],
            keyframes: [
                { val: now - 2 * DAY, group: 'release' },
                { val: now - 1 * DAY - 3 * HOUR, group: 'release' },
                { val: now - 6 * HOUR, group: 'release' },
                { val: now + 12 * HOUR },
            ],
        },
        {
            title: 'Backups',
            keyframes: [
                { val: now - 7 * DAY },
                { val: now - 4 * DAY },
                { val: now - 1 * DAY },
                { val: now + 1 * DAY },
                { val: now + 4 * DAY },
            ],
        },
        {
            title: 'Reviews (locked)',
            keyframes: [
                { val: now - 5 * DAY, draggable: false },
                { val: now - 2 * DAY - 8 * HOUR, draggable: false },
                { val: now + 3 * DAY, draggable: false },
            ],
        },
    ],
});
