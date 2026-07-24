/**
 * Pure helpers for the Foundations Timeline. Everything here is free of React
 * and of the canvas so it can be unit tested in isolation: coordinate maths,
 * ruler tick generation, snapping, value formatting and theme resolution.
 */
import { ITimelineColors, ITimelineGroup, ITimelineKeyframe, ITimelineModel, ITimelineOptions, ITimelineRow, TimelineInteractionMode, TimelineKeyframeShape, TimelineTimeMode } from '../interfaces/TimelineInterfaces';
/** Clamp `value` into the inclusive `[min, max]` range. */
export declare const clamp: (value: number, min: number, max: number) => number;
/** The default options merged under every consumer-supplied option object. */
export declare const DEFAULT_TIMELINE_OPTIONS: Required<Omit<ITimelineOptions, 'max' | 'colors' | 'unitFormatter' | 'now' | 'dateFormatter'>>;
/**
 * The height a row occupies including its bottom margin. Reads the row's own
 * override first, then the model-wide `rowsStyle`.
 */
export declare const rowHeight: (row: ITimelineRow, options: ITimelineOptions) => number;
/**
 * Vertical offset (px, from the top of the content area, header excluded) of
 * each visible row, plus the total content height. Hidden rows are skipped.
 */
export declare const rowLayout: (model: ITimelineModel, options: ITimelineOptions) => {
    offsets: number[];
    heights: number[];
    total: number;
};
/** Convert a value on the time axis into a content-space x coordinate (px). */
export declare const valToPx: (val: number, zoom: number, leftMargin: number, min: number) => number;
/** Convert a content-space x coordinate (px) back into a value. */
export declare const pxToVal: (px: number, zoom: number, leftMargin: number, min: number) => number;
/**
 * Pick a "nice" step (1 / 2 / 5 x a power of ten) that is at least `rawStep`.
 * Used to keep ruler ticks on human-friendly round values.
 */
export declare const niceStep: (rawStep: number) => number;
/**
 * The value distance between two major ruler ticks, chosen so ticks land
 * roughly `stepPx` pixels apart at the current zoom.
 */
export declare const majorStep: (zoom: number, stepPx: number) => number;
/**
 * The major-tick values visible between `startVal` and `endVal` (inclusive of
 * the tick just before `startVal` so partial labels still draw).
 */
export declare const generateTicks: (startVal: number, endVal: number, step: number) => number[];
/** Snap a value to the nearest multiple of `step` (when snapping is enabled). */
export declare const snapValue: (val: number, step: number, enabled: boolean) => number;
/**
 * Default tick label formatter. Treats values as milliseconds and renders them
 * on a seconds scale (e.g. `1.5s`, `250ms`, `1:05.0`), adapting the precision to
 * the tick spacing. Override via {@link ITimelineOptions.unitFormatter}.
 */
export declare const defaultUnitFormatter: (val: number, stepUnits: number) => string;
/**
 * Pick a human-friendly duration (ms) at least as large as `rawStepMs`, used to
 * keep ABSOLUTE-mode ruler ticks on clean time boundaries. Beyond a year it
 * falls back to whole-year multiples via {@link niceStep}.
 */
export declare const niceTimeStep: (rawStepMs: number) => number;
/** The ABSOLUTE-mode analogue of {@link majorStep}: a nice duration near stepPx. */
export declare const majorTimeStep: (zoom: number, stepPx: number) => number;
/**
 * Default ABSOLUTE-mode tick formatter. Treats values as epoch milliseconds and
 * renders a date / clock-time label whose granularity follows the tick spacing:
 * sub-second → `HH:MM:SS.mmm`, seconds → `HH:MM:SS`, minutes/hours → `HH:MM`,
 * days → `Mon D`, months → `Mon YYYY`, years → `YYYY`. Override via
 * {@link ITimelineOptions.dateFormatter}.
 */
export declare const defaultDateFormatter: (val: number, stepUnits: number) => string;
/**
 * The bounding range of the events (keyframes) in the model. When `upTo` is
 * given, only events at or before it are considered — used to frame the events
 * that "have occurred" relative to now. Returns `null` when nothing qualifies.
 */
export declare const eventsBounds: (model: ITimelineModel, upTo?: number) => {
    min: number;
    max: number;
} | null;
/** True when the given time mode treats the axis as unbounded (infinite pan). */
export declare const modeIsAbsolute: (mode: TimelineTimeMode | undefined) => boolean;
/** Resolve the effective keyframe shape/size/colour, walking the cascade. */
export interface ResolvedKeyframeStyle {
    shape: TimelineKeyframeShape;
    size: number;
    fillColor: string;
    selectedFillColor: string;
    strokeColor: string;
}
/**
 * Resolve a keyframe's effective shape/size/colours by walking the cascade
 * keyframe -> group -> row -> options -> theme. `theme` supplies the final
 * colour fallbacks so keyframes match the light/dark palette by default.
 */
export declare const resolveKeyframeStyle: (keyframe: ITimelineKeyframe, row: ITimelineRow, options: ITimelineOptions, theme: {
    keyframe: string;
    keyframeSelected: string;
    keyframeStroke: string;
}) => ResolvedKeyframeStyle;
/**
 * The largest value referenced by any keyframe in the model. Used to size the
 * scrollable area when `options.max` is not given.
 */
export declare const modelMaxVal: (model: ITimelineModel) => number;
/** Collect every keyframe across every row into a single flat array. */
export declare const allKeyframes: (model: ITimelineModel) => ITimelineKeyframe[];
/** The min / max value of a group's keyframes, or null if it has none. */
export declare const groupBounds: (row: ITimelineRow, groupId: string) => {
    min: number;
    max: number;
    keyframes: ITimelineKeyframe[];
} | null;
/** Find a declared group object on a row, if any. */
export declare const findGroup: (row: ITimelineRow, groupId: string) => ITimelineGroup | undefined;
/**
 * Read a CSS custom property from an element, falling back to a default when the
 * element is missing or the variable is unset. Lets the canvas honour the same
 * light/dark theme variables the rest of Foundations uses.
 */
export declare const cssVar: (el: HTMLElement | null, name: string, fallback: string) => string;
/** Fully-resolved colour set the renderer consumes. */
export interface ResolvedTheme {
    background: string;
    headerBackground: string;
    border: string;
    tick: string;
    label: string;
    rowBackground: string;
    rowAltBackground: string;
    rowHoverBackground: string;
    keyframe: string;
    keyframeSelected: string;
    keyframeStroke: string;
    group: string;
    cursor: string;
    now: string;
    selection: string;
    selectionBorder: string;
}
/**
 * Resolve the palette: explicit `colors` win, otherwise the matching
 * `--blue-orange-{light}-timeline-*` CSS variable, otherwise a hard default.
 * The `dark` flag selects which variable name to read.
 */
export declare const resolveTheme: (el: HTMLElement | null, dark: boolean, colors?: ITimelineColors) => ResolvedTheme;
/** True when the given interaction mode lets the user select keyframes. */
export declare const modeAllowsSelection: (mode: TimelineInteractionMode) => boolean;
/** True when dragging empty space should pan the view in the given mode. */
export declare const modePansOnEmptyDrag: (mode: TimelineInteractionMode) => boolean;
