import moment from 'moment';
import {
    GanttLinkType,
    GanttScaleUnit,
    GanttTaskType,
    IGanttLink,
    IGanttScale,
    IGanttTask,
    IGanttZoomLevel,
} from '../interfaces/GanttInterfaces';

/** Height in pixels of a single task / grid row. Shared by the grid and chart
 *  so their rows line up exactly. */
export const ROW_HEIGHT = 40;

/** Height in pixels of one scale row in the timeline header. */
export const HEADER_SCALE_HEIGHT = 30;

/** Vertical padding above and below a bar inside its row. */
export const BAR_VERTICAL_PADDING = 8;

/** The moment unit each {@link GanttScaleUnit} maps to. */
const MOMENT_UNIT: Record<GanttScaleUnit, moment.unitOfTime.DurationConstructor> = {
    [GanttScaleUnit.HOUR]: 'hour',
    [GanttScaleUnit.DAY]: 'day',
    [GanttScaleUnit.WEEK]: 'week',
    [GanttScaleUnit.MONTH]: 'month',
    [GanttScaleUnit.QUARTER]: 'quarter',
    [GanttScaleUnit.YEAR]: 'year',
};

/** Start of the `unit` period containing `date`. */
export function startOf(date: Date, unit: GanttScaleUnit): Date {
    return moment(date).startOf(MOMENT_UNIT[unit]).toDate();
}

/** `date` advanced by `amount` `unit`s (negative to go back). */
export function addUnits(date: Date, unit: GanttScaleUnit, amount: number): Date {
    return moment(date).add(amount, MOMENT_UNIT[unit]).toDate();
}

/** Whole `unit`s between `a` and `b` (may be fractional for sub-day work). */
export function diffUnits(a: Date, b: Date, unit: GanttScaleUnit): number {
    return moment(b).diff(moment(a), MOMENT_UNIT[unit], true);
}

/** Whole days between two dates, rounded to the nearest day. */
export function diffDays(a: Date, b: Date): number {
    return Math.round(moment(b).startOf('day').diff(moment(a).startOf('day'), 'days', true));
}

/**
 * The predefined zoom levels, coarsest last. The Gantt cycles through these
 * when the user zooms in / out. Index `1` ("Days") is the default.
 */
export const ZOOM_LEVELS: IGanttZoomLevel[] = [
    {
        name: 'Hours',
        cellWidth: 44,
        bottom: { unit: GanttScaleUnit.HOUR, format: 'HH' },
        upper: [{ unit: GanttScaleUnit.DAY, format: 'ddd, D MMM' }],
    },
    {
        name: 'Days',
        cellWidth: 42,
        bottom: { unit: GanttScaleUnit.DAY, format: 'D' },
        upper: [{ unit: GanttScaleUnit.MONTH, format: 'MMMM YYYY' }],
    },
    {
        name: 'Weeks',
        cellWidth: 60,
        bottom: { unit: GanttScaleUnit.WEEK, format: '[W]w' },
        upper: [{ unit: GanttScaleUnit.MONTH, format: 'MMM YYYY' }],
    },
    {
        name: 'Months',
        cellWidth: 90,
        bottom: { unit: GanttScaleUnit.MONTH, format: 'MMM' },
        upper: [{ unit: GanttScaleUnit.YEAR, format: 'YYYY' }],
    },
    {
        name: 'Quarters',
        cellWidth: 120,
        bottom: { unit: GanttScaleUnit.QUARTER, format: '[Q]Q' },
        upper: [{ unit: GanttScaleUnit.YEAR, format: 'YYYY' }],
    },
];

/** Formats a cell start date with a scale's `format` (moment string or fn). */
export function formatScale(date: Date, scale: IGanttScale): string {
    if (typeof scale.format === 'function') {
        return scale.format(date);
    }
    return moment(date).format(scale.format);
}

/** A single cell of a timeline scale row, positioned in pixels. */
export interface ITimeCell {
    /** Inclusive start of the cell. */
    start: Date;
    /** Exclusive end of the cell. */
    end: Date;
    /** Left offset in pixels from the start of the timeline. */
    x: number;
    /** Width of the cell in pixels. */
    width: number;
    /** Pre-formatted label for the cell. */
    label: string;
}

/** The fully positioned timeline: the bottom (driving) cells, the header rows
 *  built above them and the total pixel width. */
export interface ITimeline {
    start: Date;
    end: Date;
    /** Total width of the timeline in pixels. */
    width: number;
    cellWidth: number;
    unit: GanttScaleUnit;
    /** The finest scale cells; these carry the pixel geometry. */
    cells: ITimeCell[];
    /** Header rows, outermost first, then the bottom row last. */
    headerRows: ITimeCell[][];
}

/**
 * Builds a positioned timeline spanning `[rangeStart, rangeEnd)` at the given
 * zoom level. Bottom cells all have the same pixel width; header rows group the
 * bottom cells by their coarser unit. Because positions are derived by
 * interpolating inside the bottom cells (rather than a fixed px-per-ms), the
 * variable length of months and years is handled correctly.
 */
export function buildTimeline(
    rangeStart: Date,
    rangeEnd: Date,
    zoom: IGanttZoomLevel
): ITimeline {
    const unit = zoom.bottom.unit;
    const start = startOf(rangeStart, unit);
    // Ensure the timeline covers the whole final period.
    let end = startOf(rangeEnd, unit);
    if (end.getTime() < rangeEnd.getTime() || end.getTime() === start.getTime()) {
        end = addUnits(end, unit, 1);
    }

    const cells: ITimeCell[] = [];
    let cursor = start;
    let x = 0;
    // Guard against pathological ranges producing an unbounded loop.
    let guard = 0;
    while (cursor.getTime() < end.getTime() && guard < 100000) {
        const next = addUnits(cursor, unit, 1);
        cells.push({
            start: cursor,
            end: next,
            x,
            width: zoom.cellWidth,
            label: formatScale(cursor, zoom.bottom),
        });
        x += zoom.cellWidth;
        cursor = next;
        guard++;
    }

    const width = x;

    // Build each upper header row by grouping the bottom cells under the coarser
    // period they fall into.
    const headerRows: ITimeCell[][] = zoom.upper.map((scale) =>
        groupCells(cells, scale, end)
    );
    headerRows.push(cells);

    return { start, end, width, cellWidth: zoom.cellWidth, unit, cells, headerRows };
}

/** Groups bottom `cells` into coarser cells of `scale`, spanning the pixels of
 *  their members. */
function groupCells(cells: ITimeCell[], scale: IGanttScale, end: Date): ITimeCell[] {
    if (cells.length === 0) return [];
    const groups: ITimeCell[] = [];
    let current: ITimeCell | null = null;
    let currentKey = '';

    for (const cell of cells) {
        const periodStart = startOf(cell.start, scale.unit);
        const key = periodStart.toISOString();
        if (!current || key !== currentKey) {
            current = {
                start: periodStart,
                end: addUnits(periodStart, scale.unit, 1),
                x: cell.x,
                width: cell.width,
                label: formatScale(periodStart, scale),
            };
            currentKey = key;
            groups.push(current);
        } else {
            current.width += cell.width;
        }
    }
    return groups;
}

/**
 * Maps a date to an x pixel offset within `timeline`, interpolating inside the
 * bottom cell it falls in so sub-cell positions are exact. Dates outside the
 * range are clamped to the timeline edges.
 */
export function dateToX(date: Date, timeline: ITimeline): number {
    const t = date.getTime();
    const cells = timeline.cells;
    if (cells.length === 0) return 0;
    if (t <= cells[0].start.getTime()) return 0;
    const last = cells[cells.length - 1];
    if (t >= last.end.getTime()) return timeline.width;

    // Binary search for the cell containing `t`.
    let lo = 0;
    let hi = cells.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const cell = cells[mid];
        if (t < cell.start.getTime()) {
            hi = mid - 1;
        } else if (t >= cell.end.getTime()) {
            lo = mid + 1;
        } else {
            const span = cell.end.getTime() - cell.start.getTime();
            const frac = span === 0 ? 0 : (t - cell.start.getTime()) / span;
            return cell.x + frac * cell.width;
        }
    }
    return 0;
}

/**
 * The inverse of {@link dateToX}: maps an x pixel offset back to a date by
 * interpolating within the bottom cell at that offset.
 */
export function xToDate(x: number, timeline: ITimeline): Date {
    const cells = timeline.cells;
    if (cells.length === 0) return timeline.start;
    if (x <= 0) return cells[0].start;
    if (x >= timeline.width) return cells[cells.length - 1].end;

    const index = Math.min(cells.length - 1, Math.floor(x / timeline.cellWidth));
    const cell = cells[index];
    const frac = (x - cell.x) / cell.width;
    const span = cell.end.getTime() - cell.start.getTime();
    return new Date(cell.start.getTime() + frac * span);
}

/**
 * Snaps a date to the nearest boundary of the timeline's bottom unit. Used when
 * dragging / resizing so bars land on clean day (or hour, week, …) boundaries.
 */
export function snapDate(date: Date, timeline: ITimeline): Date {
    const unit = timeline.unit;
    const floor = startOf(date, unit);
    const next = addUnits(floor, unit, 1);
    const toFloor = date.getTime() - floor.getTime();
    const toNext = next.getTime() - date.getTime();
    return toNext < toFloor ? next : floor;
}

/**
 * Fills in the missing one of `start` / `end` / `duration` for a single task.
 * Duration is measured in days. Milestones collapse to a zero-length span.
 */
export function normalizeTask(task: IGanttTask): IGanttTask {
    const result = { ...task };
    if (result.type === GanttTaskType.MILESTONE) {
        const anchor = result.start ?? result.end ?? new Date();
        result.start = anchor;
        result.end = anchor;
        result.duration = 0;
        return result;
    }

    const hasStart = !!result.start;
    const hasEnd = !!result.end;
    const hasDuration = result.duration != null;

    if (hasStart && hasEnd) {
        result.duration = Math.max(0, diffDays(result.start!, result.end!));
    } else if (hasStart && hasDuration) {
        result.end = moment(result.start).add(result.duration, 'days').toDate();
    } else if (hasEnd && hasDuration) {
        result.start = moment(result.end).subtract(result.duration, 'days').toDate();
    } else if (hasStart) {
        result.duration = 1;
        result.end = moment(result.start).add(1, 'day').toDate();
    }
    return result;
}

/** A task augmented with its position in the hierarchy for rendering. */
export interface IFlatTask {
    task: IGanttTask;
    /** Nesting depth, `0` for a root task. */
    depth: number;
    /** Whether this task has children. */
    hasChildren: boolean;
    /** Whether this task is expanded (only meaningful when `hasChildren`). */
    open: boolean;
}

/**
 * Turns the flat task list into the ordered, visible rows to render.
 *
 * - Establishes parent → child order (roots in their original order, each
 *   followed by its descendants).
 * - Rolls up each summary task's `start` / `end` / `progress` from its children
 *   so parents always bracket their work.
 * - Hides the descendants of any collapsed (`open === false`) summary.
 *
 * The returned tasks are normalized copies; the input is not mutated.
 */
export function flattenTasks(tasks: IGanttTask[]): IFlatTask[] {
    const normalized = tasks.map(normalizeTask);
    const byId = new Map<string | number, IGanttTask>();
    const children = new Map<string | number, IGanttTask[]>();
    const roots: IGanttTask[] = [];

    for (const task of normalized) {
        byId.set(task.id, task);
        children.set(task.id, []);
    }
    for (const task of normalized) {
        if (task.parent != null && byId.has(task.parent)) {
            children.get(task.parent)!.push(task);
        } else {
            roots.push(task);
        }
    }

    // Roll up summary spans depth-first (children before parents).
    const rollup = (task: IGanttTask): void => {
        const kids = children.get(task.id)!;
        if (kids.length === 0) return;
        kids.forEach(rollup);
        const isSummary = task.type === GanttTaskType.SUMMARY || task.start == null;
        if (isSummary) {
            const starts = kids.map((k) => k.start).filter(Boolean) as Date[];
            const ends = kids.map((k) => k.end).filter(Boolean) as Date[];
            if (starts.length) {
                task.start = new Date(Math.min(...starts.map((d) => d.getTime())));
            }
            if (ends.length) {
                task.end = new Date(Math.max(...ends.map((d) => d.getTime())));
            }
            if (task.start && task.end) {
                task.duration = Math.max(0, diffDays(task.start, task.end));
            }
            // Duration-weighted average progress.
            let weighted = 0;
            let total = 0;
            for (const k of kids) {
                const w = Math.max(k.duration ?? 0, 0.0001);
                weighted += (k.progress ?? 0) * w;
                total += w;
            }
            task.progress = total > 0 ? Math.round(weighted / total) : task.progress ?? 0;
            task.type = GanttTaskType.SUMMARY;
        }
    };
    roots.forEach(rollup);

    const flat: IFlatTask[] = [];
    const walk = (task: IGanttTask, depth: number): void => {
        const kids = children.get(task.id)!;
        const hasChildren = kids.length > 0;
        const open = task.open !== false;
        flat.push({ task, depth, hasChildren, open });
        if (hasChildren && open) {
            kids.forEach((k) => walk(k, depth + 1));
        }
    };
    roots.forEach((r) => walk(r, 0));
    return flat;
}

/**
 * The overall date span the timeline should cover for a set of tasks, padded on
 * each side so bars do not touch the edges. Falls back to a month around today
 * when there are no dated tasks.
 */
export function getTaskRange(tasks: IGanttTask[], padUnits = 2): { start: Date; end: Date } {
    const starts: number[] = [];
    const ends: number[] = [];
    for (const task of tasks.map(normalizeTask)) {
        if (task.start) starts.push(task.start.getTime());
        if (task.end) ends.push(task.end.getTime());
    }
    if (starts.length === 0 || ends.length === 0) {
        return {
            start: moment().startOf('month').toDate(),
            end: moment().endOf('month').toDate(),
        };
    }
    const start = moment(Math.min(...starts)).subtract(padUnits, 'weeks').toDate();
    const end = moment(Math.max(...ends)).add(padUnits, 'weeks').toDate();
    return { start, end };
}

/** The geometry of a task bar in timeline pixel space. */
export interface IBarGeometry {
    x: number;
    width: number;
    y: number;
    height: number;
}

/** Computes the pixel rectangle of a task's bar at a given row index. */
export function taskGeometry(
    task: IGanttTask,
    rowIndex: number,
    timeline: ITimeline
): IBarGeometry {
    const y = rowIndex * ROW_HEIGHT + BAR_VERTICAL_PADDING;
    const height = ROW_HEIGHT - BAR_VERTICAL_PADDING * 2;
    if (task.type === GanttTaskType.MILESTONE || !task.start || !task.end) {
        const cx = task.start ? dateToX(task.start, timeline) : 0;
        return { x: cx - height / 2, width: height, y, height };
    }
    const x = dateToX(task.start, timeline);
    const end = dateToX(task.end, timeline);
    return { x, width: Math.max(end - x, 1), y, height };
}

/**
 * Re-parents / re-dates the tasks referenced by a moved or resized bar and
 * returns a new task array (input is not mutated). Duration is kept consistent.
 */
export function applyTaskDates(
    tasks: IGanttTask[],
    id: string | number,
    start: Date,
    end: Date
): IGanttTask[] {
    return tasks.map((t) => {
        if (t.id !== id) return t;
        const duration = Math.max(0, diffDays(start, end));
        return { ...t, start, end, duration };
    });
}

/**
 * Validates that a link can be added: both ends exist, they differ and the link
 * would not duplicate an existing one or create a cycle.
 */
export function canLink(
    tasks: IGanttTask[],
    links: IGanttLink[],
    source: string | number,
    target: string | number
): boolean {
    if (source === target) return false;
    const ids = new Set(tasks.map((t) => t.id));
    if (!ids.has(source) || !ids.has(target)) return false;
    if (links.some((l) => l.source === source && l.target === target)) return false;

    // Walk existing links forward from `target`; if we reach `source` the new
    // link would close a cycle.
    const adjacency = new Map<string | number, (string | number)[]>();
    for (const link of links) {
        if (!adjacency.has(link.source)) adjacency.set(link.source, []);
        adjacency.get(link.source)!.push(link.target);
    }
    const stack = [target];
    const seen = new Set<string | number>();
    while (stack.length) {
        const node = stack.pop()!;
        if (node === source) return false;
        if (seen.has(node)) continue;
        seen.add(node);
        for (const next of adjacency.get(node) ?? []) stack.push(next);
    }
    return true;
}

/** The two endpoints of a link on a task bar, in `{ start, end }` date terms. */
export function linkEndpoints(type: GanttLinkType | undefined): {
    from: 'start' | 'end';
    to: 'start' | 'end';
} {
    switch (type) {
        case GanttLinkType.START_TO_START:
            return { from: 'start', to: 'start' };
        case GanttLinkType.END_TO_END:
            return { from: 'end', to: 'end' };
        case GanttLinkType.START_TO_END:
            return { from: 'start', to: 'end' };
        case GanttLinkType.END_TO_START:
        default:
            return { from: 'end', to: 'start' };
    }
}
