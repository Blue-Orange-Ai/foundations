import {TooltipConfig, TooltipContext, TooltipDataPoint, TooltipField, TooltipFieldValue} from "../types/ChartTypes";

/**
 * Resolve a static-or-dynamic tooltip field value against the current context.
 */
export const resolveTooltipFieldValue = (
    value: TooltipFieldValue | undefined,
    context: TooltipContext
): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === "function") return value(context);
    return value;
};

/**
 * Normalise Chart.js tooltip data points into our library-agnostic shape so the
 * customisation callbacks never need to touch Chart.js internals.
 */
export const buildTooltipDataPoints = (tooltipModel: any): Array<TooltipDataPoint> => {
    const points = tooltipModel?.dataPoints ?? [];
    return points.map((dp: any) => {
        const dataset = dp.dataset ?? {};
        return {
            datasetLabel: dataset.label ?? "",
            value: dp.parsed?.y ?? dp.raw,
            formattedValue: dp.formattedValue,
            borderColor: dataset.borderColor,
            backgroundColor: dataset.backgroundColor,
            datasetIndex: dp.datasetIndex,
            index: dp.dataIndex,
            raw: dp.raw,
        } as TooltipDataPoint;
    });
};

/**
 * Extract the raw x value for the hovered position from the Chart.js tooltip
 * model. Prefers the title (respects category/time scales) and falls back to
 * the first data point.
 */
export const resolveTooltipXValue = (tooltipModel: any): any => {
    if (tooltipModel?.title && tooltipModel.title.length > 0) {
        return tooltipModel.title[0];
    }
    const dp = tooltipModel?.dataPoints?.[0];
    if (!dp) return undefined;
    return dp.parsed?.x ?? dp.label;
};

export interface BuildTooltipOptions {
    /** Class-name prefix, matching the existing CSS ("line" or "scatter"). */
    classPrefix?: string,
    /** Legacy prop: show the x value as a header. */
    showXValueInTooltip?: boolean,
    /** Legacy prop: formatter for the x value header. */
    xValueFormatter?: (value: any) => string,
    /** Full tooltip customisation config. */
    tooltip?: TooltipConfig,
}

const createColorDot = (border?: string, background?: string): HTMLElement => {
    const dot = document.createElement("div");
    dot.style.height = "10px";
    dot.style.width = "10px";
    dot.style.borderRadius = "50%";
    dot.style.border = "2px solid " + (border ?? "transparent");
    dot.style.backgroundColor = background ?? "transparent";
    dot.style.marginRight = "15px";
    return dot;
};

/**
 * Build the tooltip body DOM for a chart. This is the single, shared, testable
 * implementation used by every chart's external tooltip. When no `tooltip`
 * config (and no legacy x-value opts) is supplied it reproduces the original
 * default markup exactly, so behaviour is unchanged unless the caller opts in.
 */
export const buildTooltipContent = (tooltipModel: any, options: BuildTooltipOptions = {}): HTMLElement => {
    const prefix = options.classPrefix ?? "line";
    const cfg: TooltipConfig = options.tooltip ?? {};

    const dataPoints = buildTooltipDataPoints(tooltipModel);
    const xValueRaw = resolveTooltipXValue(tooltipModel);

    // Base formatted x (legacy formatter or String()).
    const baseXLabel =
        xValueRaw === undefined || xValueRaw === null
            ? ""
            : options.xValueFormatter
                ? options.xValueFormatter(xValueRaw)
                : String(xValueRaw);

    const context: TooltipContext = {
        xValue: xValueRaw,
        xLabel: baseXLabel,
        dataPoints,
    };

    const container = document.createElement("div");
    container.className = `blue-orange-charts-${prefix}-dataset-container`;

    // ---- X label header ----
    // Prefer the custom config; fall back to the legacy showXValueInTooltip.
    const hasCustomXLabel = cfg.xLabel !== undefined;
    const showXLabel = hasCustomXLabel
        ? cfg.showXLabel !== false
        : !!options.showXValueInTooltip;

    if (showXLabel) {
        const resolved = hasCustomXLabel
            ? resolveTooltipFieldValue(cfg.xLabel, context)
            : baseXLabel;

        if (resolved !== undefined && resolved !== null && resolved !== "") {
            const xValueHeader = document.createElement("div");
            xValueHeader.className = `blue-orange-chart-${prefix}-tooltip-x-value`;
            xValueHeader.style.fontWeight = "bold";
            xValueHeader.style.marginBottom = "6px";
            xValueHeader.style.paddingBottom = "3px";
            xValueHeader.style.borderBottom = "1px solid rgba(0,0,0,0.1)";
            xValueHeader.style.fontSize = "12px";
            xValueHeader.style.color = "white";
            xValueHeader.textContent = String(resolved);
            container.appendChild(xValueHeader);
        }
    }

    // ---- Per-dataset rows ----
    if (!cfg.hideDataPoints) {
        for (const dp of dataPoints) {
            const row = document.createElement("div");
            row.className = `blue-orange-charts-${prefix}-dataset-row`;

            row.appendChild(createColorDot(dp.borderColor, dp.backgroundColor));

            const label = cfg.yLabel ? cfg.yLabel(dp) : dp.datasetLabel;
            const value = cfg.valueFormatter ? cfg.valueFormatter(dp) : dp.formattedValue;

            const val = document.createElement("div");
            val.className = `blue-orange-chart-${prefix}-tooltip-value`;
            val.innerHTML =
                `<span class='blue-orange-chart-${prefix}-tooltip-dataset-label'>${label}:</span>${value}`;

            row.appendChild(val);
            container.appendChild(row);
        }
    }

    // ---- Extra static/dynamic fields ----
    if (cfg.fields && cfg.fields.length > 0) {
        for (const field of cfg.fields as Array<TooltipField>) {
            const label = resolveTooltipFieldValue(field.label, context);
            const value = resolveTooltipFieldValue(field.value, context);
            if ((label === undefined || label === "") && (value === undefined || value === "")) {
                continue;
            }

            const row = document.createElement("div");
            row.className = `blue-orange-charts-${prefix}-dataset-row blue-orange-charts-${prefix}-tooltip-field`;

            if (field.color) {
                row.appendChild(createColorDot(field.color, field.color));
            }

            const val = document.createElement("div");
            val.className = `blue-orange-chart-${prefix}-tooltip-value`;
            if (label !== undefined && label !== "") {
                val.innerHTML =
                    `<span class='blue-orange-chart-${prefix}-tooltip-dataset-label'>${label}:</span>${value ?? ""}`;
            } else {
                val.innerHTML = `${value ?? ""}`;
            }

            row.appendChild(val);
            container.appendChild(row);
        }
    }

    return container;
};
