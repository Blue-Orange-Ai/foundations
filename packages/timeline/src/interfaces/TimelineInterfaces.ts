/**
 * Public interfaces for the Foundations Timeline package.
 *
 * The data model mirrors the one used by
 * [animation-timeline-control](https://github.com/ievgennaida/animation-timeline-control)
 * — a model is a list of rows, each row owns a list of keyframes, and keyframes
 * may be tied together into groups — so consumers familiar with that library
 * feel at home, while the implementation stays dependency-free and aligned with
 * the Foundations conventions.
 */
import type React from 'react';

/**
 * How the timeline reacts to pointer input. Switch at runtime through the
 * {@link ITimelineOptions.interactionMode} option (or the toolbar).
 *
 * - `SELECTION`         -> click / rubber-band select keyframes, drag them.
 * - `PAN`               -> drag empty space to pan, keyframes stay interactive.
 * - `NON_INTERACTIVE_PAN` -> drag anywhere to pan, keyframes are inert.
 * - `ZOOM`              -> drag / wheel zooms towards the cursor.
 * - `NONE`              -> read only, only the wheel scrolls.
 */
export enum TimelineInteractionMode {
    SELECTION = 'selection',
    PAN = 'pan',
    NON_INTERACTIVE_PAN = 'nonInteractivePan',
    ZOOM = 'zoom',
    NONE = 'none',
}

/**
 * How the time axis is interpreted and labelled.
 *
 * - `RELATIVE` -> values are treated as a duration from the axis origin and the
 *   ruler reads as elapsed time (e.g. `1.5s`, `1:05`). The axis is bounded by
 *   `min` / `max` and pans within that range. This is the default.
 * - `ABSOLUTE` -> values are treated as absolute timestamps (epoch milliseconds
 *   by default) and the ruler reads as dates / clock times. The axis is
 *   unbounded, so the view pans infinitely left and right, a "now" marker is
 *   drawn, and {@link TimelineHandle.focusEvents} can frame the events that have
 *   occurred.
 */
export enum TimelineTimeMode {
    RELATIVE = 'relative',
    ABSOLUTE = 'absolute',
}

/**
 * The shape a keyframe (or group) is drawn with.
 */
export enum TimelineKeyframeShape {
    RHOMB = 'rhomb',
    CIRCLE = 'circle',
    RECT = 'rect',
}

/**
 * What the pointer is currently over. Reported on {@link ITimelineContextMenuEvent}
 * and used internally for hit-testing.
 */
export enum TimelineElementType {
    KEYFRAME = 'keyframe',
    GROUP = 'group',
    ROW = 'row',
    TIMELINE = 'timeline',
}

/** Per-keyframe visual overrides. Cascade: keyframe -> group -> row -> options. */
export interface ITimelineKeyframeStyle {
    shape?: TimelineKeyframeShape;
    /** Radius (rhomb / circle) or half-size (rect) in pixels. */
    size?: number;
    fillColor?: string;
    selectedFillColor?: string;
    strokeColor?: string;
}

/** Per-row visual overrides. */
export interface ITimelineRowStyle {
    height?: number;
    backgroundColor?: string;
    keyframesStyle?: ITimelineKeyframeStyle;
    groupFillColor?: string;
}

/**
 * A single keyframe. `val` is the only required field and places the keyframe on
 * the time axis (in the timeline's units, milliseconds by default). Everything
 * else is optional metadata that mirrors animation-timeline-control.
 */
export interface ITimelineKeyframe {
    /** Position on the time axis, in units. */
    val: number;
    /** Ties this keyframe to a {@link ITimelineGroup} so it drags as a range. */
    group?: string;
    selected?: boolean;
    /** Default `true`. When `false` the keyframe cannot be selected. */
    selectable?: boolean;
    /** Default `true`. When `false` the keyframe cannot be dragged. */
    draggable?: boolean;
    /** Clamp the value while dragging. */
    min?: number;
    max?: number;
    style?: ITimelineKeyframeStyle;
    /** Arbitrary consumer payload, never touched by the control. */
    data?: unknown;
}

/**
 * Groups let several keyframes on the same row move together as a connected
 * range. A group is referenced by {@link ITimelineKeyframe.group} matching its
 * {@link ITimelineGroup.id}. Declaring the group object is optional — a bare id
 * on the keyframes is enough — but it lets you carry per-group style / flags.
 */
export interface ITimelineGroup {
    id: string;
    draggable?: boolean;
    selected?: boolean;
    style?: { fillColor?: string; height?: number };
    data?: unknown;
}

/** One track. Owns its keyframes and optionally the groups that connect them. */
export interface ITimelineRow {
    keyframes?: ITimelineKeyframe[];
    groups?: ITimelineGroup[];
    /** Shown in the (optional) left labels column. */
    title?: string;
    /** Row height in pixels. Falls back to {@link ITimelineRowsStyle.height}. */
    height?: number;
    hidden?: boolean;
    /** Default `true`. */
    draggable?: boolean;
    /** Default `true`. */
    selectable?: boolean;
    style?: ITimelineRowStyle;
    data?: unknown;
}

/** The full data model handed to the control. */
export interface ITimelineModel {
    rows: ITimelineRow[];
}

/** Defaults applied to every row. */
export interface ITimelineRowsStyle {
    height?: number;
    marginBottom?: number;
}

/** Colours the canvas reads. Any omitted value falls back to the CSS variable. */
export interface ITimelineColors {
    background?: string;
    headerBackground?: string;
    border?: string;
    tick?: string;
    label?: string;
    rowBackground?: string;
    rowAltBackground?: string;
    rowHoverBackground?: string;
    keyframe?: string;
    keyframeSelected?: string;
    keyframeStroke?: string;
    group?: string;
    cursor?: string;
    /** Colour of the "now" marker drawn in {@link TimelineTimeMode.ABSOLUTE}. */
    now?: string;
    selection?: string;
    selectionBorder?: string;
}

/**
 * Everything configurable about the control. All fields are optional; the
 * component fills in sensible defaults (see `DEFAULT_TIMELINE_OPTIONS`).
 */
export interface ITimelineOptions {
    /** Units per pixel. Larger = more zoomed out. */
    zoom?: number;
    zoomMin?: number;
    zoomMax?: number;
    /** Multiplier applied per wheel notch when zooming. */
    zoomSpeed?: number;

    /**
     * How the time axis is interpreted and labelled. Defaults to
     * {@link TimelineTimeMode.RELATIVE}. Switch to {@link TimelineTimeMode.ABSOLUTE}
     * to treat values as timestamps, label the ruler with dates, and pan
     * infinitely.
     */
    timeMode?: TimelineTimeMode;

    /**
     * The "now" reference value (in units) used in {@link TimelineTimeMode.ABSOLUTE}
     * to draw the current-time marker and to decide which events "have
     * occurred". Defaults to `Date.now()` (epoch milliseconds), re-read as the
     * canvas draws so the marker stays live.
     */
    now?: number;

    /**
     * Lower / upper bound of the time axis, in units. `min` defaults to 0 and
     * doubles as the axis origin for coordinate maths. In
     * {@link TimelineTimeMode.ABSOLUTE} the axis is unbounded, so `max` is
     * ignored for panning; `min` is still used as the (stable) origin.
     */
    min?: number;
    max?: number;

    /** Height of the ruler / header, in pixels. */
    headerHeight?: number;
    /** Padding (px) kept to the left of `min` so keyframes at 0 aren't clipped. */
    leftMargin?: number;
    /** Width (px) of the left labels column. 0 (default) hides it. */
    labelsWidth?: number;

    rowsStyle?: ITimelineRowsStyle;

    /** Master switches — mirror animation-timeline-control. */
    keyframesDraggable?: boolean;
    groupsDraggable?: boolean;
    timelineDraggable?: boolean;

    /** Snap dragged keyframes to a grid of this many units. 0 disables snapping. */
    snapStep?: number;
    snapEnabled?: boolean;

    /** Approximate pixel spacing between major ruler ticks. */
    stepPx?: number;

    interactionMode?: TimelineInteractionMode;

    /** Default keyframe drawing, overridable per row / group / keyframe. */
    keyframesStyle?: ITimelineKeyframeStyle;

    colors?: ITimelineColors;

    /**
     * Formats a tick's value into its label in {@link TimelineTimeMode.RELATIVE}.
     * Defaults to a seconds formatter.
     */
    unitFormatter?: (val: number, stepUnits: number) => string;

    /**
     * Formats a tick's value into its label in {@link TimelineTimeMode.ABSOLUTE}.
     * Defaults to a date / clock-time formatter that adapts to the tick spacing.
     */
    dateFormatter?: (val: number, stepUnits: number) => string;
}

/** Common payload shared by the drag lifecycle events. */
export interface ITimelineDragEvent {
    /** The keyframes affected by the drag. */
    keyframes: ITimelineKeyframe[];
    /** The group being dragged, when a whole group is moved. */
    group?: ITimelineGroup;
    /** Element kind that started the drag. */
    target: TimelineElementType;
    /** Current pointer value on the time axis. */
    val: number;
    /** Delta applied to the affected keyframes since drag start, in units. */
    delta: number;
}

export interface ITimelineTimeChangedEvent {
    val: number;
    /** `true` when the change came from the user dragging the cursor. */
    source: 'user' | 'setTime';
}

export interface ITimelineSelectedEvent {
    selected: ITimelineKeyframe[];
    /** Every keyframe whose `selected` flag changed in this event. */
    changed: ITimelineKeyframe[];
}

export interface ITimelineScrollEvent {
    scrollLeft: number;
    scrollTop: number;
    zoom: number;
}

export interface ITimelineContextMenuEvent {
    /** Native event, so consumers can position their own menu / preventDefault. */
    originalEvent: React.MouseEvent;
    val: number;
    target: TimelineElementType;
    row?: ITimelineRow;
    keyframe?: ITimelineKeyframe;
}
