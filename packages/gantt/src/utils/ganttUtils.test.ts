import {
    ZOOM_LEVELS,
    addUnits,
    applyTaskDates,
    buildTimeline,
    canLink,
    dateToX,
    diffDays,
    flattenTasks,
    getTaskRange,
    normalizeTask,
    snapDate,
    startOf,
    xToDate,
} from './ganttUtils';
import {
    GanttLinkType,
    GanttScaleUnit,
    GanttTaskType,
    IGanttTask,
} from '../interfaces/GanttInterfaces';

const d = (s: string) => new Date(s + 'T00:00:00');

describe('date helpers', () => {
    test('startOf snaps to the unit boundary', () => {
        expect(startOf(d('2026-03-17'), GanttScaleUnit.MONTH)).toEqual(d('2026-03-01'));
    });

    test('addUnits advances by whole units', () => {
        expect(addUnits(d('2026-03-01'), GanttScaleUnit.DAY, 5)).toEqual(d('2026-03-06'));
    });

    test('diffDays counts calendar days', () => {
        expect(diffDays(d('2026-03-01'), d('2026-03-08'))).toBe(7);
    });
});

describe('normalizeTask', () => {
    test('derives end from start + duration', () => {
        const t = normalizeTask({ id: 1, text: 'A', start: d('2026-03-01'), duration: 3 });
        expect(t.end).toEqual(d('2026-03-04'));
    });

    test('derives duration from start + end', () => {
        const t = normalizeTask({
            id: 1,
            text: 'A',
            start: d('2026-03-01'),
            end: d('2026-03-05'),
        });
        expect(t.duration).toBe(4);
    });

    test('collapses a milestone to zero length', () => {
        const t = normalizeTask({
            id: 1,
            text: 'M',
            type: GanttTaskType.MILESTONE,
            start: d('2026-03-01'),
        });
        expect(t.start).toEqual(t.end);
        expect(t.duration).toBe(0);
    });
});

describe('buildTimeline', () => {
    const zoom = ZOOM_LEVELS[1]; // Days

    test('covers the whole range with fixed-width cells', () => {
        const tl = buildTimeline(d('2026-03-01'), d('2026-03-10'), zoom);
        expect(tl.cells.length).toBeGreaterThanOrEqual(9);
        expect(tl.cellWidth).toBe(zoom.cellWidth);
        expect(tl.width).toBe(tl.cells.length * zoom.cellWidth);
    });

    test('builds a month header row above the day row', () => {
        const tl = buildTimeline(d('2026-03-01'), d('2026-03-31'), zoom);
        expect(tl.headerRows.length).toBe(2);
        expect(tl.headerRows[0][0].label).toContain('March');
    });

    test('dateToX and xToDate round-trip within a day', () => {
        const tl = buildTimeline(d('2026-03-01'), d('2026-03-31'), zoom);
        const x = dateToX(d('2026-03-10'), tl);
        const back = xToDate(x, tl);
        expect(Math.abs(back.getTime() - d('2026-03-10').getTime())).toBeLessThan(
            1000 * 60 * 60 * 2
        );
    });

    test('dateToX is monotonic and clamps outside the range', () => {
        const tl = buildTimeline(d('2026-03-01'), d('2026-03-31'), zoom);
        expect(dateToX(d('2026-01-01'), tl)).toBe(0);
        expect(dateToX(d('2026-12-01'), tl)).toBe(tl.width);
        expect(dateToX(d('2026-03-05'), tl)).toBeLessThan(dateToX(d('2026-03-06'), tl));
    });
});

describe('snapDate', () => {
    test('snaps to the nearest day boundary', () => {
        const tl = buildTimeline(d('2026-03-01'), d('2026-03-31'), ZOOM_LEVELS[1]);
        const snapped = snapDate(new Date('2026-03-10T20:00:00'), tl);
        expect(snapped).toEqual(d('2026-03-11'));
    });
});

describe('flattenTasks', () => {
    const tasks: IGanttTask[] = [
        { id: 'p', text: 'Parent', type: GanttTaskType.SUMMARY },
        { id: 'a', text: 'A', parent: 'p', start: d('2026-03-01'), duration: 4 },
        { id: 'b', text: 'B', parent: 'p', start: d('2026-03-03'), duration: 5, progress: 50 },
        { id: 'solo', text: 'Solo', start: d('2026-03-10'), duration: 2 },
    ];

    test('orders parents before their children', () => {
        const flat = flattenTasks(tasks);
        expect(flat.map((f) => f.task.id)).toEqual(['p', 'a', 'b', 'solo']);
        expect(flat[1].depth).toBe(1);
    });

    test('rolls up the summary span from its children', () => {
        const parent = flattenTasks(tasks).find((f) => f.task.id === 'p')!.task;
        expect(parent.start).toEqual(d('2026-03-01'));
        expect(parent.end).toEqual(d('2026-03-08'));
        expect(parent.type).toBe(GanttTaskType.SUMMARY);
    });

    test('hides children of a collapsed summary', () => {
        const collapsed = tasks.map((t) => (t.id === 'p' ? { ...t, open: false } : t));
        const flat = flattenTasks(collapsed);
        expect(flat.map((f) => f.task.id)).toEqual(['p', 'solo']);
    });
});

describe('getTaskRange', () => {
    test('pads around the tasks', () => {
        const range = getTaskRange([
            { id: 1, text: 'A', start: d('2026-03-10'), end: d('2026-03-12') },
        ]);
        expect(range.start.getTime()).toBeLessThan(d('2026-03-10').getTime());
        expect(range.end.getTime()).toBeGreaterThan(d('2026-03-12').getTime());
    });

    test('falls back to the current month with no dated tasks', () => {
        const range = getTaskRange([{ id: 1, text: 'A', type: GanttTaskType.SUMMARY }]);
        expect(range.start.getTime()).toBeLessThan(range.end.getTime());
    });
});

describe('applyTaskDates', () => {
    test('updates dates and keeps duration consistent', () => {
        const next = applyTaskDates(
            [{ id: 1, text: 'A', start: d('2026-03-01'), end: d('2026-03-03') }],
            1,
            d('2026-03-05'),
            d('2026-03-09')
        );
        expect(next[0].start).toEqual(d('2026-03-05'));
        expect(next[0].duration).toBe(4);
    });
});

describe('canLink', () => {
    const tasks: IGanttTask[] = [
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
        { id: 3, text: 'C' },
    ];

    test('rejects self links', () => {
        expect(canLink(tasks, [], 1, 1)).toBe(false);
    });

    test('rejects duplicate links', () => {
        const links = [{ id: 'l', source: 1, target: 2, type: GanttLinkType.END_TO_START }];
        expect(canLink(tasks, links, 1, 2)).toBe(false);
    });

    test('rejects links that would create a cycle', () => {
        const links = [
            { id: 'l1', source: 1, target: 2, type: GanttLinkType.END_TO_START },
            { id: 'l2', source: 2, target: 3, type: GanttLinkType.END_TO_START },
        ];
        expect(canLink(tasks, links, 3, 1)).toBe(false);
    });

    test('accepts a valid new link', () => {
        expect(canLink(tasks, [], 1, 2)).toBe(true);
    });
});
