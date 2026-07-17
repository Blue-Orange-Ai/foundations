
export interface ChartDataset {
    label: string,
    data: Array<any>,
    borderColor?: string,
    backgroundColor?: string,
    borderWidth?: number,
    fill?: boolean | string,
    axis?: string,
    borderRadius?: number,
    borderSkipped?: false,
    yAxisID?: string,
}

export enum LegendPosition {
    TOP,
    BOTTOM,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

/**
 * A single data point as surfaced to the tooltip customisation callbacks.
 * This is a lightweight, library-agnostic view over Chart.js' internal tooltip
 * data point so consumers don't have to know about Chart.js internals.
 */
export interface TooltipDataPoint {
    /** The dataset label (e.g. "CPU %"). */
    datasetLabel: string,
    /** The parsed y value for this point (falls back to the raw value). */
    value: any,
    /** The value as formatted by Chart.js (respects the scale/ticks formatting). */
    formattedValue: string,
    /** The dataset border colour. */
    borderColor?: string,
    /** The dataset background colour. */
    backgroundColor?: string,
    /** Index of the dataset this point belongs to. */
    datasetIndex: number,
    /** Index of the point within the dataset. */
    index: number,
    /** The raw, unparsed data entry for this point. */
    raw: any,
}

/**
 * Context passed to every dynamic tooltip field callback. Gives consumers full
 * access to the hovered x value and every data point at that position so they
 * can render the tooltip however they like.
 */
export interface TooltipContext {
    /** The raw x value at the hovered position (timestamp, category, number, ...). */
    xValue: any,
    /** The x value formatted to a string (via xValueFormatter, or String()). */
    xLabel: string,
    /** Every data point at the hovered x position. */
    dataPoints: Array<TooltipDataPoint>,
}

/**
 * A tooltip field value may be a static string or a function computed from the
 * current hover context. This is what enables both "static and dynamic fields".
 */
export type TooltipFieldValue = string | ((context: TooltipContext) => string);

/**
 * An extra row rendered in the tooltip. Either side (label/value) may be static
 * or dynamic. Use this to add arbitrary annotations to the tooltip.
 */
export interface TooltipField {
    /** Optional label shown in bold before the value. Static or dynamic. */
    label?: TooltipFieldValue,
    /** The field value. Static or dynamic. */
    value?: TooltipFieldValue,
    /** Optional colour swatch shown before the label. */
    color?: string,
}

/**
 * Full control over how the tooltip renders its X and Y labels plus any extra
 * static/dynamic fields. Every property is optional — when omitted the tooltip
 * renders exactly as it did before (backwards compatible).
 */
export interface TooltipConfig {
    /**
     * Custom X label (the tooltip header). Static string or a function of the
     * hover context. When provided the header is shown by default.
     */
    xLabel?: TooltipFieldValue,
    /** Explicitly show/hide the X label header. Defaults to true when xLabel is set. */
    showXLabel?: boolean,
    /**
     * Override the per-point label (defaults to the dataset label). Dynamic:
     * receives each data point.
     */
    yLabel?: (dataPoint: TooltipDataPoint) => string,
    /**
     * Override the per-point value rendering (defaults to Chart.js'
     * formattedValue). Dynamic: receives each data point.
     */
    valueFormatter?: (dataPoint: TooltipDataPoint) => string,
    /** Additional static/dynamic rows appended below the data points. */
    fields?: Array<TooltipField>,
    /** Hide the default per-dataset rows and render only custom fields. */
    hideDataPoints?: boolean,
}

/**
 * The cursor position reported by a chart as the pointer moves across it. The
 * `x` value is the resolved x-axis *data value* (timestamp, category label,
 * number, ...) so it can be matched across charts that share the same x axis.
 */
export interface CursorPosition {
    /** The x-axis data value under the cursor. */
    x: any,
    /** The pixel x position within the chart (canvas coordinate space). */
    pixelX: number,
}

/**
 * Options for the optional vertical cursor line that follows the mouse. Useful
 * on stacked area charts where blended, semi-transparent fills make it hard to
 * read the granular x position under the cursor, and for synchronising a
 * crosshair across several charts that share the same x axis.
 */
export interface VerticalLineOptions {
    /** Whether the vertical line is drawn. */
    enabled: boolean,
    /** Line colour. Defaults to "red". */
    color?: string,
    /** Line width in pixels. Defaults to 1. */
    width?: number,
    /** Optional dash pattern, e.g. [4, 4] for a dashed line. */
    dash?: Array<number>,
    /**
     * Externally-controlled x-axis *data value* at which to draw the line, even
     * when the pointer is not over this chart. Set this from another chart's
     * onCursorMove callback to show a synchronised crosshair. null/undefined
     * hides the externally-driven line.
     */
    externalValue?: any,
    /**
     * Fired as the pointer moves over the chart (with the resolved position) and
     * once with null when it leaves. Wire this into sibling charts' externalValue
     * to synchronise the crosshair across charts sharing an x axis.
     */
    onCursorMove?: (position: CursorPosition | null) => void,
}
