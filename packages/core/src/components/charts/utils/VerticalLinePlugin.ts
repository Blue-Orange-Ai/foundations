import {CursorPosition, VerticalLineOptions} from "../types/ChartTypes";

const DEFAULT_COLOR = "red";
const DEFAULT_WIDTH = 1;

/**
 * Internal mutable state tracking the cursor position for the vertical line.
 * Exposed on the returned plugin (as `_state`) purely to make unit testing the
 * afterEvent/afterDraw behaviour straightforward.
 */
export interface VerticalLineState {
    x: number | null,
    inside: boolean,
    /** Whether an "outside" (null) position has already been reported. */
    reportedOutside: boolean,
}

export interface VerticalLinePlugin {
    id: string,
    _state: VerticalLineState,
    afterEvent(chart: any, args: any): void,
    afterDraw(chart: any): void,
}

/**
 * Convert an x-axis data value into a pixel position, handling category scales
 * (where the value is a label that must be mapped to its index).
 */
export const resolveValueToPixel = (chart: any, value: any): number | null => {
    const scale = chart?.scales?.x;
    if (!scale) return null;
    if (
        scale.type === "category" &&
        typeof value === "string" &&
        typeof scale.getLabels === "function"
    ) {
        const labels = scale.getLabels() as any[];
        const idx = labels.indexOf(value);
        if (idx >= 0) return scale.getPixelForValue(idx);
    }
    const px = scale.getPixelForValue(value);
    return typeof px === "number" && !isNaN(px) ? px : null;
};

/**
 * Convert a pixel position into an x-axis data value, returning the label for
 * category scales rather than the numeric index.
 */
export const resolvePixelToValue = (chart: any, pixel: number): any => {
    const scale = chart?.scales?.x;
    if (!scale) return null;
    const raw = scale.getValueForPixel(pixel);
    if (
        scale.type === "category" &&
        typeof raw === "number" &&
        typeof scale.getLabelForValue === "function"
    ) {
        return scale.getLabelForValue(raw);
    }
    return raw;
};

/**
 * Create a Chart.js plugin that draws a vertical line across the chart area.
 *
 * The line is drawn at either:
 *  - the live cursor position while the pointer is inside this chart, or
 *  - the externally-supplied `externalValue` (an x data value) otherwise —
 *    which lets a parent synchronise a crosshair across charts sharing an axis.
 *
 * As the pointer moves it also reports the resolved position via `onCursorMove`
 * (and null on leave), so a parent can broadcast it to sibling charts.
 *
 * Options are read lazily via the getter so styling, the external value and the
 * callback can all change without recreating the chart.
 */
export const createVerticalLinePlugin = (
    getOptions: () => VerticalLineOptions
): VerticalLinePlugin => {
    const state: VerticalLineState = {x: null, inside: false, reportedOutside: true};

    const report = (opts: VerticalLineOptions, position: CursorPosition | null) => {
        if (typeof opts.onCursorMove === "function") {
            opts.onCursorMove(position);
        }
    };

    return {
        id: "verticalCursorLine",
        _state: state,

        afterEvent(chart: any, args: any) {
            const opts = getOptions();
            if (!opts) return;
            const hasCallback = typeof opts.onCursorMove === "function";
            // Nothing to do if the line is off and no one is listening.
            if (!opts.enabled && !hasCallback) return;

            const event = args?.event;
            const chartArea = chart?.chartArea;
            if (!event || !chartArea) return;

            const type = event.type;
            if (type === "mousemove" || type === "pointermove") {
                const x = event.x;
                const y = event.y;
                const inside =
                    x >= chartArea.left &&
                    x <= chartArea.right &&
                    y >= chartArea.top &&
                    y <= chartArea.bottom;
                state.x = x;
                state.inside = inside;
                // Redraw so the line tracks the cursor.
                if (opts.enabled) args.changed = true;

                if (hasCallback) {
                    if (inside) {
                        state.reportedOutside = false;
                        report(opts, {x: resolvePixelToValue(chart, x), pixelX: x});
                    } else if (!state.reportedOutside) {
                        state.reportedOutside = true;
                        report(opts, null);
                    }
                }
            } else if (type === "mouseout" || type === "pointerout" || type === "pointercancel") {
                if (state.inside && opts.enabled) args.changed = true;
                state.inside = false;
                if (hasCallback && !state.reportedOutside) {
                    state.reportedOutside = true;
                    report(opts, null);
                }
            }
        },

        afterDraw(chart: any) {
            const opts = getOptions();
            if (!opts || !opts.enabled) return;

            const chartArea = chart?.chartArea;
            const ctx = chart?.ctx;
            if (!chartArea || !ctx) return;

            // Prefer the live cursor while hovering this chart; otherwise fall
            // back to the externally-supplied value (synchronised crosshair).
            let pixelX: number | null = null;
            if (state.inside && state.x != null) {
                pixelX = state.x;
            } else if (opts.externalValue !== undefined && opts.externalValue !== null) {
                pixelX = resolveValueToPixel(chart, opts.externalValue);
            }
            if (pixelX == null) return;

            const x = Math.min(Math.max(pixelX, chartArea.left), chartArea.right);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, chartArea.top);
            ctx.lineTo(x, chartArea.bottom);
            ctx.lineWidth = opts.width ?? DEFAULT_WIDTH;
            ctx.strokeStyle = opts.color ?? DEFAULT_COLOR;
            if (opts.dash && opts.dash.length > 0 && typeof ctx.setLineDash === "function") {
                ctx.setLineDash(opts.dash);
            }
            ctx.stroke();
            ctx.restore();
        },
    };
};
