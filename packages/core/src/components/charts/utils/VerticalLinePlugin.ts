import {VerticalLineOptions} from "../types/ChartTypes";

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
}

export interface VerticalLinePlugin {
    id: string,
    _state: VerticalLineState,
    afterEvent(chart: any, args: any): void,
    afterDraw(chart: any): void,
}

/**
 * Create a Chart.js plugin that draws a vertical line following the cursor's x
 * position across the chart area. Enabled/styled via the options getter so the
 * host component can update styling without recreating the chart.
 *
 * The line only renders while the cursor is inside the chart area, and forces a
 * redraw on move so the line tracks the cursor smoothly.
 */
export const createVerticalLinePlugin = (
    getOptions: () => VerticalLineOptions
): VerticalLinePlugin => {
    const state: VerticalLineState = {x: null, inside: false};

    return {
        id: "verticalCursorLine",
        _state: state,

        afterEvent(chart: any, args: any) {
            const opts = getOptions();
            if (!opts || !opts.enabled) return;

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
                if (state.inside !== inside) {
                    state.inside = inside;
                }
                // Force Chart.js to redraw so the line tracks the cursor.
                args.changed = true;
            } else if (type === "mouseout" || type === "pointerout" || type === "pointercancel") {
                if (state.inside) {
                    state.inside = false;
                    args.changed = true;
                }
            }
        },

        afterDraw(chart: any) {
            const opts = getOptions();
            if (!opts || !opts.enabled) return;
            if (!state.inside || state.x == null) return;

            const chartArea = chart?.chartArea;
            const ctx = chart?.ctx;
            if (!chartArea || !ctx) return;

            const x = Math.min(Math.max(state.x, chartArea.left), chartArea.right);

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
