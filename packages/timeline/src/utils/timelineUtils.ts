/**
 * Pure helpers for the Foundations Timeline. Everything here is free of React
 * and of the canvas so it can be unit tested in isolation: coordinate maths,
 * ruler tick generation, snapping, value formatting and theme resolution.
 */
import {
    ITimelineColors,
    ITimelineGroup,
    ITimelineKeyframe,
    ITimelineModel,
    ITimelineOptions,
    ITimelineRow,
    TimelineInteractionMode,
    TimelineKeyframeShape,
    TimelineTimeMode,
} from '../interfaces/TimelineInterfaces';

/** Clamp `value` into the inclusive `[min, max]` range. */
export const clamp = (value: number, min: number, max: number): number => {
    if (min > max) {
        return value;
    }
    return Math.min(Math.max(value, min), max);
};

/** The default options merged under every consumer-supplied option object. */
export const DEFAULT_TIMELINE_OPTIONS: Required<
    Omit<ITimelineOptions, 'max' | 'colors' | 'unitFormatter' | 'now' | 'dateFormatter'>
> = {
    zoom: 1,
    zoomMin: 0.01,
    // Wide enough to zoom from milliseconds out to a multi-year date span, so
    // ABSOLUTE mode works without a bespoke bound. Harmless for RELATIVE mode.
    zoomMax: 1_000_000_000,
    zoomSpeed: 0.15,
    min: 0,
    timeMode: TimelineTimeMode.RELATIVE,
    headerHeight: 30,
    leftMargin: 18,
    labelsWidth: 0,
    rowsStyle: { height: 24, marginBottom: 2 },
    keyframesDraggable: true,
    groupsDraggable: true,
    timelineDraggable: true,
    snapStep: 0,
    snapEnabled: false,
    stepPx: 120,
    interactionMode: TimelineInteractionMode.SELECTION,
    keyframesStyle: { shape: TimelineKeyframeShape.RHOMB, size: 6 },
};

/**
 * The height a row occupies including its bottom margin. Reads the row's own
 * override first, then the model-wide `rowsStyle`.
 */
export const rowHeight = (row: ITimelineRow, options: ITimelineOptions): number => {
    const base =
        row.height ??
        row.style?.height ??
        options.rowsStyle?.height ??
        DEFAULT_TIMELINE_OPTIONS.rowsStyle.height!;
    return base;
};

/**
 * Vertical offset (px, from the top of the content area, header excluded) of
 * each visible row, plus the total content height. Hidden rows are skipped.
 */
export const rowLayout = (
    model: ITimelineModel,
    options: ITimelineOptions
): { offsets: number[]; heights: number[]; total: number } => {
    const margin = options.rowsStyle?.marginBottom ?? DEFAULT_TIMELINE_OPTIONS.rowsStyle.marginBottom!;
    const offsets: number[] = [];
    const heights: number[] = [];
    let y = 0;
    for (let i = 0; i < model.rows.length; i++) {
        const row = model.rows[i];
        if (row.hidden) {
            offsets.push(y);
            heights.push(0);
            continue;
        }
        const h = rowHeight(row, options);
        offsets.push(y);
        heights.push(h);
        y += h + margin;
    }
    return { offsets, heights, total: y };
};

/** Convert a value on the time axis into a content-space x coordinate (px). */
export const valToPx = (val: number, zoom: number, leftMargin: number, min: number): number => {
    return leftMargin + (val - min) / zoom;
};

/** Convert a content-space x coordinate (px) back into a value. */
export const pxToVal = (px: number, zoom: number, leftMargin: number, min: number): number => {
    return (px - leftMargin) * zoom + min;
};

/**
 * Pick a "nice" step (1 / 2 / 5 x a power of ten) that is at least `rawStep`.
 * Used to keep ruler ticks on human-friendly round values.
 */
export const niceStep = (rawStep: number): number => {
    if (!isFinite(rawStep) || rawStep <= 0) {
        return 1;
    }
    const exponent = Math.floor(Math.log10(rawStep));
    const power = Math.pow(10, exponent);
    const fraction = rawStep / power;
    let niceFraction: number;
    if (fraction <= 1) {
        niceFraction = 1;
    } else if (fraction <= 2) {
        niceFraction = 2;
    } else if (fraction <= 5) {
        niceFraction = 5;
    } else {
        niceFraction = 10;
    }
    return niceFraction * power;
};

/**
 * The value distance between two major ruler ticks, chosen so ticks land
 * roughly `stepPx` pixels apart at the current zoom.
 */
export const majorStep = (zoom: number, stepPx: number): number => {
    return niceStep(stepPx * zoom);
};

/**
 * The major-tick values visible between `startVal` and `endVal` (inclusive of
 * the tick just before `startVal` so partial labels still draw).
 */
export const generateTicks = (startVal: number, endVal: number, step: number): number[] => {
    if (step <= 0 || !isFinite(step) || endVal < startVal) {
        return [];
    }
    const ticks: number[] = [];
    const first = Math.floor(startVal / step) * step;
    // Guard against pathological zooms producing a runaway loop.
    const maxTicks = 10000;
    let count = 0;
    for (let v = first; v <= endVal && count < maxTicks; v += step, count++) {
        // Snap away tiny floating point drift so labels read cleanly.
        ticks.push(Math.round(v / step) * step);
    }
    return ticks;
};

/** Snap a value to the nearest multiple of `step` (when snapping is enabled). */
export const snapValue = (val: number, step: number, enabled: boolean): number => {
    if (!enabled || step <= 0) {
        return val;
    }
    return Math.round(val / step) * step;
};

/** Round-trip helper: number of decimals worth showing for a given step size. */
const decimalsForStep = (step: number): number => {
    if (step >= 1) {
        return 0;
    }
    return Math.min(6, Math.ceil(-Math.log10(step)));
};

/**
 * Default tick label formatter. Treats values as milliseconds and renders them
 * on a seconds scale (e.g. `1.5s`, `250ms`, `1:05.0`), adapting the precision to
 * the tick spacing. Override via {@link ITimelineOptions.unitFormatter}.
 */
export const defaultUnitFormatter = (val: number, stepUnits: number): string => {
    const seconds = val / 1000;
    const stepSeconds = stepUnits / 1000;
    // Sub-second granularity: show milliseconds directly.
    if (stepSeconds < 1) {
        const decimals = decimalsForStep(stepSeconds);
        return `${seconds.toFixed(decimals)}s`;
    }
    // Minute+ ranges read better as m:ss.
    if (Math.abs(seconds) >= 60) {
        const sign = seconds < 0 ? '-' : '';
        const abs = Math.abs(seconds);
        const minutes = Math.floor(abs / 60);
        const rem = abs - minutes * 60;
        const secStr = rem < 10 ? `0${rem.toFixed(0)}` : rem.toFixed(0);
        return `${sign}${minutes}:${secStr}`;
    }
    return `${seconds.toFixed(0)}s`;
};

// ---- absolute (date) axis --------------------------------------------------

/**
 * Candidate "nice" step durations (milliseconds) for the ABSOLUTE-mode ruler,
 * chosen so ticks land on human-friendly boundaries — seconds, minutes, hours,
 * days, weeks — rather than the arbitrary 1/2/5 decades used for a plain number
 * axis. Ascending; {@link niceTimeStep} picks the first that clears the raw step.
 */
const NICE_TIME_STEPS_MS = [
    1, 2, 5, 10, 20, 50, 100, 200, 500, // sub-second
    1000, 2000, 5000, 10000, 15000, 30000, // seconds
    60000, 120000, 300000, 600000, 900000, 1800000, // minutes
    3600000, 7200000, 10800000, 21600000, 43200000, // hours
    86400000, 172800000, 604800000, // days / week
    2592000000, 7776000000, // ~month / ~quarter (30 / 90 days)
    31536000000, // ~year (365 days)
];

const MS_PER_YEAR = 31536000000;

/**
 * Pick a human-friendly duration (ms) at least as large as `rawStepMs`, used to
 * keep ABSOLUTE-mode ruler ticks on clean time boundaries. Beyond a year it
 * falls back to whole-year multiples via {@link niceStep}.
 */
export const niceTimeStep = (rawStepMs: number): number => {
    if (!isFinite(rawStepMs) || rawStepMs <= 0) {
        return 1;
    }
    for (let i = 0; i < NICE_TIME_STEPS_MS.length; i++) {
        if (NICE_TIME_STEPS_MS[i] >= rawStepMs) {
            return NICE_TIME_STEPS_MS[i];
        }
    }
    return niceStep(rawStepMs / MS_PER_YEAR) * MS_PER_YEAR;
};

/** The ABSOLUTE-mode analogue of {@link majorStep}: a nice duration near stepPx. */
export const majorTimeStep = (zoom: number, stepPx: number): number => {
    return niceTimeStep(stepPx * zoom);
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad2 = (n: number): string => (n < 10 ? '0' + n : '' + n);
const pad3 = (n: number): string => (n < 10 ? '00' + n : n < 100 ? '0' + n : '' + n);

/**
 * Default ABSOLUTE-mode tick formatter. Treats values as epoch milliseconds and
 * renders a date / clock-time label whose granularity follows the tick spacing:
 * sub-second → `HH:MM:SS.mmm`, seconds → `HH:MM:SS`, minutes/hours → `HH:MM`,
 * days → `Mon D`, months → `Mon YYYY`, years → `YYYY`. Override via
 * {@link ITimelineOptions.dateFormatter}.
 */
export const defaultDateFormatter = (val: number, stepUnits: number): string => {
    const d = new Date(val);
    if (stepUnits < 1000) {
        return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}.${pad3(
            d.getMilliseconds()
        )}`;
    }
    if (stepUnits < 60000) {
        return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
    }
    if (stepUnits < 86400000) {
        return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    }
    if (stepUnits < 2592000000) {
        return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
    }
    if (stepUnits < MS_PER_YEAR) {
        return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    }
    return `${d.getFullYear()}`;
};

/**
 * The bounding range of the events (keyframes) in the model. When `upTo` is
 * given, only events at or before it are considered — used to frame the events
 * that "have occurred" relative to now. Returns `null` when nothing qualifies.
 */
export const eventsBounds = (
    model: ITimelineModel,
    upTo?: number
): { min: number; max: number } | null => {
    let min = Infinity;
    let max = -Infinity;
    let found = false;
    for (let r = 0; r < model.rows.length; r++) {
        const kfs = model.rows[r].keyframes;
        if (!kfs) {
            continue;
        }
        for (let k = 0; k < kfs.length; k++) {
            const val = kfs[k].val;
            if (upTo !== undefined && val > upTo) {
                continue;
            }
            if (val < min) {
                min = val;
            }
            if (val > max) {
                max = val;
            }
            found = true;
        }
    }
    return found ? { min, max } : null;
};

/** True when the given time mode treats the axis as unbounded (infinite pan). */
export const modeIsAbsolute = (mode: TimelineTimeMode | undefined): boolean => {
    return mode === TimelineTimeMode.ABSOLUTE;
};

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
export const resolveKeyframeStyle = (
    keyframe: ITimelineKeyframe,
    row: ITimelineRow,
    options: ITimelineOptions,
    theme: { keyframe: string; keyframeSelected: string; keyframeStroke: string }
): ResolvedKeyframeStyle => {
    const group = keyframe.group ? findGroup(row, keyframe.group) : undefined;
    const kf = keyframe.style;
    const groupKf = group?.style;
    const rowKf = row.style?.keyframesStyle;
    const optKf = options.keyframesStyle;
    return {
        shape:
            kf?.shape ??
            rowKf?.shape ??
            optKf?.shape ??
            DEFAULT_TIMELINE_OPTIONS.keyframesStyle.shape!,
        size:
            kf?.size ??
            rowKf?.size ??
            optKf?.size ??
            DEFAULT_TIMELINE_OPTIONS.keyframesStyle.size!,
        fillColor:
            kf?.fillColor ??
            groupKf?.fillColor ??
            rowKf?.fillColor ??
            optKf?.fillColor ??
            theme.keyframe,
        selectedFillColor:
            kf?.selectedFillColor ??
            rowKf?.selectedFillColor ??
            optKf?.selectedFillColor ??
            theme.keyframeSelected,
        strokeColor:
            kf?.strokeColor ??
            rowKf?.strokeColor ??
            optKf?.strokeColor ??
            theme.keyframeStroke,
    };
};

/**
 * The largest value referenced by any keyframe in the model. Used to size the
 * scrollable area when `options.max` is not given.
 */
export const modelMaxVal = (model: ITimelineModel): number => {
    let max = 0;
    for (let r = 0; r < model.rows.length; r++) {
        const kfs = model.rows[r].keyframes;
        if (!kfs) {
            continue;
        }
        for (let k = 0; k < kfs.length; k++) {
            if (kfs[k].val > max) {
                max = kfs[k].val;
            }
        }
    }
    return max;
};

/** Collect every keyframe across every row into a single flat array. */
export const allKeyframes = (model: ITimelineModel): ITimelineKeyframe[] => {
    const out: ITimelineKeyframe[] = [];
    for (let r = 0; r < model.rows.length; r++) {
        const kfs = model.rows[r].keyframes;
        if (!kfs) {
            continue;
        }
        for (let k = 0; k < kfs.length; k++) {
            out.push(kfs[k]);
        }
    }
    return out;
};

/** The min / max value of a group's keyframes, or null if it has none. */
export const groupBounds = (
    row: ITimelineRow,
    groupId: string
): { min: number; max: number; keyframes: ITimelineKeyframe[] } | null => {
    const kfs = (row.keyframes ?? []).filter((k) => k.group === groupId);
    if (kfs.length === 0) {
        return null;
    }
    let min = kfs[0].val;
    let max = kfs[0].val;
    for (let i = 1; i < kfs.length; i++) {
        if (kfs[i].val < min) {
            min = kfs[i].val;
        }
        if (kfs[i].val > max) {
            max = kfs[i].val;
        }
    }
    return { min, max, keyframes: kfs };
};

/** Find a declared group object on a row, if any. */
export const findGroup = (row: ITimelineRow, groupId: string): ITimelineGroup | undefined => {
    return (row.groups ?? []).find((g) => g.id === groupId);
};

/**
 * Read a CSS custom property from an element, falling back to a default when the
 * element is missing or the variable is unset. Lets the canvas honour the same
 * light/dark theme variables the rest of Foundations uses.
 */
export const cssVar = (
    el: HTMLElement | null,
    name: string,
    fallback: string
): string => {
    if (!el || typeof getComputedStyle === 'undefined') {
        return fallback;
    }
    const value = getComputedStyle(el).getPropertyValue(name).trim();
    return value.length > 0 ? value : fallback;
};

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
export const resolveTheme = (
    el: HTMLElement | null,
    dark: boolean,
    colors?: ITimelineColors
): ResolvedTheme => {
    const scheme = dark ? 'dark' : 'light';
    const v = (key: string, fallback: string): string =>
        cssVar(el, `--blue-orange-${scheme}-timeline-${key}`, fallback);
    const c = colors ?? {};
    return {
        background: c.background ?? v('background-color', dark ? '#1c1c1e' : '#ffffff'),
        headerBackground: c.headerBackground ?? v('header-background-color', dark ? '#242426' : '#fafafa'),
        border: c.border ?? v('border-color', dark ? '#34343a' : '#e0e1e2'),
        tick: c.tick ?? v('tick-color', dark ? '#4a4a50' : '#c4c4c8'),
        label: c.label ?? v('label-color', dark ? '#a1a1aa' : '#71717a'),
        rowBackground: c.rowBackground ?? v('row-background-color', dark ? '#1c1c1e' : '#ffffff'),
        rowAltBackground: c.rowAltBackground ?? v('row-alt-background-color', dark ? '#232326' : '#f7f7f9'),
        rowHoverBackground:
            c.rowHoverBackground ?? v('row-hover-background-color', dark ? '#26303f' : '#eef2fb'),
        keyframe: c.keyframe ?? v('keyframe-color', dark ? '#60a5fa' : '#2563eb'),
        keyframeSelected:
            c.keyframeSelected ?? v('keyframe-selected-color', dark ? '#fb7185' : '#e11d48'),
        keyframeStroke: c.keyframeStroke ?? v('keyframe-stroke-color', dark ? '#1c1c1e' : '#ffffff'),
        group: c.group ?? v('group-color', dark ? '#3b527d' : '#93b4f7'),
        cursor: c.cursor ?? v('cursor-color', dark ? '#fb7185' : '#e11d48'),
        now: c.now ?? v('now-color', dark ? '#34d399' : '#059669'),
        selection: c.selection ?? v('selection-color', dark ? 'rgba(96, 165, 250, 0.22)' : 'rgba(37, 99, 235, 0.18)'),
        selectionBorder:
            c.selectionBorder ?? v('selection-border-color', dark ? '#60a5fa' : '#2563eb'),
    };
};

/** True when the given interaction mode lets the user select keyframes. */
export const modeAllowsSelection = (mode: TimelineInteractionMode): boolean => {
    return mode === TimelineInteractionMode.SELECTION || mode === TimelineInteractionMode.PAN;
};

/** True when dragging empty space should pan the view in the given mode. */
export const modePansOnEmptyDrag = (mode: TimelineInteractionMode): boolean => {
    return (
        mode === TimelineInteractionMode.PAN ||
        mode === TimelineInteractionMode.NON_INTERACTIVE_PAN
    );
};
