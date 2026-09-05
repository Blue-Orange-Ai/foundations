
export interface ChartDataset {
    label: string,
    data: Array<any>,
    borderColor?: string,
    backgroundColor?: string,
    borderWidth?: number,
    /** Dash pattern for the line, as Chart.js takes one. */
    borderDash?: Array<number>,
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

/**
 * The condition a single period of an uptime chart was in. These are the states
 * a status page reports against, so they map straight onto one.
 */
export enum UptimeStatus {
    /** Everything was working. */
    OPERATIONAL = "OPERATIONAL",
    /** Working, but slower or less reliably than it should have been. */
    DEGRADED = "DEGRADED",
    /** Some of the service was down. */
    PARTIAL_OUTAGE = "PARTIAL_OUTAGE",
    /** The service was down. */
    MAJOR_OUTAGE = "MAJOR_OUTAGE",
    /** Down on purpose — planned work. */
    MAINTENANCE = "MAINTENANCE",
    /** Nothing was recorded for this period. */
    NO_DATA = "NO_DATA"
}

/** One incident listed in an uptime bar's popup. */
export interface UptimeIncident {
    /** What happened, in a few words. */
    title: string,
    /** The state it put the service in — free text, e.g. "Degraded performance". */
    status?: string,
    /** How long it ran for, e.g. "14:02 – 15:20 UTC". */
    duration?: string,
    /** Overrides the dot colour, which otherwise follows the entry's status. */
    color?: string
}

/**
 * One bar of an uptime chart — a single period (a day, on a status page) and
 * how the service behaved during it.
 */
export interface UptimeEntry {
    /** The period the bar covers. A Date, or anything `new Date()` can read. */
    date: Date | string | number,
    /** How the service behaved. */
    status: UptimeStatus,
    /**
     * The percentage of the period the service was up. Shown in the popup, and
     * used for the overall figure when every entry carries one.
     */
    uptime?: number,
    /** Incidents to list in the popup. */
    incidents?: Array<UptimeIncident>,
    /** Overrides the bar colour that the status would otherwise resolve to. */
    color?: string,
    /** A line of free text under the status in the popup. */
    note?: string
}

/**
 * One day of a contribution chart — a single date and how much happened on it.
 * The count is what drives the square's shade; everything else is detail for
 * the popup.
 */
export interface ContributionEntry {
    /** The day this covers. A Date, or anything `new Date()` can read. */
    date: Date | string | number,
    /** How much happened that day. Zero and negative counts read as empty. */
    count: number,
    /**
     * Pins the square to a shade rather than letting the count decide, as an
     * index into the chart's `levelColors`. Useful when the server has already
     * banded the data.
     */
    level?: number,
    /** Overrides the square's colour outright. */
    color?: string,
    /** A line of free text under the count in the popup. */
    note?: string
}
