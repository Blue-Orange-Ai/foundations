import React from 'react';

/**
 * Public interfaces for the Foundations Gantt package.
 *
 * The task / link / scale shapes mirror the model used by SVAR React Gantt
 * (svar-widgets/react-gantt) so consumers familiar with that library feel at
 * home, while staying dependency free (beyond `moment`, already used elsewhere
 * in Foundations) and aligned with the Foundations conventions.
 */

/**
 * How a task bar is drawn on the timeline.
 *
 * - `TASK`      -> a normal bar spanning `start` … `end`.
 * - `SUMMARY`   -> a parent / roll-up bar. Its span and progress are computed
 *                  from its children and it renders as a bracketed bar.
 * - `MILESTONE` -> a zero-duration marker rendered as a diamond at `start`.
 */
export enum GanttTaskType {
    TASK = 'task',
    SUMMARY = 'summary',
    MILESTONE = 'milestone',
}

/**
 * The unit a single timeline scale row counts in.
 */
export enum GanttScaleUnit {
    HOUR = 'hour',
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    QUARTER = 'quarter',
    YEAR = 'year',
}

/**
 * The kind of dependency a {@link IGanttLink} expresses, following the four
 * classic precedence relationships.
 *
 * - `END_TO_START`   -> target starts after source ends (the common case).
 * - `START_TO_START` -> target starts after source starts.
 * - `END_TO_END`     -> target ends after source ends.
 * - `START_TO_END`   -> target ends after source starts.
 */
export enum GanttLinkType {
    END_TO_START = 'e2s',
    START_TO_START = 's2s',
    END_TO_END = 'e2e',
    START_TO_END = 's2e',
}

/**
 * A single row in the Gantt chart.
 *
 * A task may specify any two of `start`, `end` and `duration`; the missing
 * value is derived (see `normalizeTasks` in the package utils). Summary tasks
 * do not need dates at all — their span is rolled up from their children.
 */
export interface IGanttTask {
    id: string | number;
    /** The label shown in the grid and (space permitting) on the bar. */
    text: string;
    /** Inclusive start of the task. */
    start?: Date;
    /** Exclusive end of the task. */
    end?: Date;
    /** Length of the task in days. Derived from `start`/`end` when omitted. */
    duration?: number;
    /** Completion as a percentage, `0`–`100`. */
    progress?: number;
    /** How the bar is drawn. Defaults to {@link GanttTaskType.TASK}. */
    type?: GanttTaskType;
    /** Id of the parent task, for hierarchical / summary grouping. */
    parent?: string | number;
    /** Whether a summary task's children are expanded. Defaults to `true`. */
    open?: boolean;
    /** Free-form details surfaced in the edit form and tooltip. */
    details?: string;
    /** Bar colour override (any CSS colour). */
    color?: string;
    /** When true the bar cannot be moved, resized or edited by the user. */
    readonly?: boolean;
    /** Arbitrary consumer supplied payload, untouched by the component. */
    raw?: unknown;
}

/**
 * A dependency arrow drawn between two tasks.
 */
export interface IGanttLink {
    id: string | number;
    /** Id of the task the arrow starts from. */
    source: string | number;
    /** Id of the task the arrow points to. */
    target: string | number;
    /** The precedence relationship. Defaults to {@link GanttLinkType.END_TO_START}. */
    type?: GanttLinkType;
}

/**
 * A column rendered in the data grid to the left of the timeline.
 */
export interface IGanttColumn {
    /** Field key. Built-in keys `text`, `start`, `end`, `duration`, `progress`
     *  and `add` (an "add sub-task" action) are understood; any other key falls
     *  back to `render`. */
    id: string;
    /** Column header label. */
    header: string;
    /** Fixed column width in pixels. */
    width?: number;
    /** Horizontal alignment of the cell content. Defaults to `left`. */
    align?: 'left' | 'center' | 'right';
    /** Custom cell renderer, overriding the built-in for the given `id`. */
    render?: (task: IGanttTask) => React.ReactNode;
}

/**
 * One scale row of the timeline header (e.g. the "day" row beneath a "month"
 * row).
 */
export interface IGanttScale {
    unit: GanttScaleUnit;
    /** How many `unit`s each cell spans. Defaults to `1`. */
    step?: number;
    /** A moment format string, or a function producing the cell label. */
    format: string | ((date: Date) => string);
}

/**
 * A named zoom level: the finest ("bottom") scale that drives cell width plus
 * the coarser header rows drawn above it.
 */
export interface IGanttZoomLevel {
    /** Label shown in the toolbar. */
    name: string;
    /** Width in pixels of a single bottom-scale cell. */
    cellWidth: number;
    /** The finest scale — its cells set the timeline's horizontal resolution. */
    bottom: IGanttScale;
    /** Coarser header rows drawn above the bottom scale, outermost first. */
    upper: IGanttScale[];
}
