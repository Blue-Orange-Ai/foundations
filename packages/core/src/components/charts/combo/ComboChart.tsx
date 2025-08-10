import React, { useEffect, useRef, useState } from "react";
import "./ComboChart.css"; // reuse your styles
import Chart from "chart.js/auto";
import { LegendPosition } from "../types/ChartTypes";
import { v4 as uuidv4 } from "uuid";
import "chartjs-adapter-moment";

type AnyDataset = any;

interface Props {
    dataset: Array<AnyDataset>;
    labels?: Array<string>;
    gridLines?: boolean;
    xLabel?: string;
    xScale?: string;            // 'time' | 'linear' | 'category' | ...
    xScaleTimeUnit?: string;    // e.g. 'minute'
    yLabel?: string;
    yScale?: string;            // 'linear' | 'logarithmic' | ...
    height?: string;
    width?: string;
    fill?: any;                 // applied to line datasets
    tension?: number;
    interactionType?: "index" | "nearest";
    animationTimeout?: number;
    legend?: boolean;
    legendPosition?: LegendPosition;

    // Range selection
    rangeSelect?: boolean;
    onRangeSelected?: (startValue: any, endValue: any) => void;

    // Scatter visibility/UX
    scatterPointRadius?: number;       // default 3
    scatterPointHoverRadius?: number;  // default 5

    // Pin scatter point
    pinScatter?: boolean;              // default true
    pinnedPointRingExtraRadius?: number; // extra radius beyond point radius (default 4)
    pinnedPointBorderWidth?: number;     // ring stroke width (default 2)
}

export const ComboChart: React.FC<Props> = ({
                                                dataset,
                                                labels,
                                                gridLines = true,
                                                xLabel,
                                                xScale,
                                                xScaleTimeUnit = "minute",
                                                yLabel,
                                                yScale,
                                                height = "100%",
                                                width = "100%",
                                                fill = false,
                                                tension = 0.2,
                                                interactionType = "index",
                                                animationTimeout = 2000,
                                                legend = true,
                                                legendPosition = LegendPosition.BOTTOM,

                                                rangeSelect = false,
                                                onRangeSelected,

                                                scatterPointRadius = 3,
                                                scatterPointHoverRadius = 5,

                                                pinScatter = true,
                                                pinnedPointRingExtraRadius = 4,
                                                pinnedPointBorderWidth = 2,
                                            }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const datasetVisibility = useRef<boolean[]>([]);
    const initRef = useRef<boolean>(false);
    const uuid = uuidv4();

    // ---- Range selection state ----
    const dragRef = useRef<{ active: boolean; startX: number | null; endX: number | null }>({
        active: false,
        startX: null,
        endX: null,
    });

    // ---- Pinned scatter point state ----
    const pinnedRef = useRef<{ datasetIndex: number; index: number } | null>(null);

    const clearSelection = () => {
        dragRef.current = { active: false, startX: null, endX: null };
        chartInstanceRef.current?.draw();
    };

    const clearPinned = () => {
        if (pinnedRef.current) {
            pinnedRef.current = null;
            chartInstanceRef.current?.draw();
        }
    };

    const getPixelFromEvent = (e: PointerEvent | MouseEvent) => {
        const chart = chartInstanceRef.current as any;
        if (!chart) return null;
        const rect = chart.canvas.getBoundingClientRect();
        const clientX = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX;
        const clientY = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY;
        const x = (clientX - rect.left) * (chart.width / rect.width);
        const y = (clientY - rect.top) * (chart.height / rect.height);
        return { x, y };
    };

    const clampToChartAreaX = (px: number) => {
        const chart = chartInstanceRef.current as any;
        const ca = chart?.chartArea;
        if (!ca) return px;
        return Math.min(Math.max(px, ca.left), ca.right);
    };

    const isInsideChartArea = (x: number, y: number) => {
        const chart = chartInstanceRef.current as any;
        const ca = chart?.chartArea;
        if (!ca) return false;
        return x >= ca.left && x <= ca.right && y >= ca.top && y <= ca.bottom;
    };

    // ---- Range select handlers ----
    const onPointerDown = (e: PointerEvent) => {
        if (!rangeSelect) return;
        const coords = getPixelFromEvent(e);
        if (!coords) return;
        const { x, y } = coords;
        if (!isInsideChartArea(x, y)) return;
        dragRef.current.active = true;
        dragRef.current.startX = clampToChartAreaX(x);
        dragRef.current.endX = clampToChartAreaX(x);
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
        chartInstanceRef.current?.draw();
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!rangeSelect || !dragRef.current.active) return;
        const coords = getPixelFromEvent(e);
        if (!coords) return;
        dragRef.current.endX = clampToChartAreaX(coords.x);
        chartInstanceRef.current?.draw();
    };

    const finalizeSelection = () => {
        const chart = chartInstanceRef.current as any;
        if (!chart || !dragRef.current.startX || !dragRef.current.endX) return;
        const xMinPx = Math.min(dragRef.current.startX, dragRef.current.endX);
        const xMaxPx = Math.max(dragRef.current.startX, dragRef.current.endX);
        if (xMaxPx - xMinPx < 2) return clearSelection();
        const sc = chart.scales?.x;
        if (!sc) return clearSelection();
        const vMin = sc.getValueForPixel(xMinPx);
        const vMax = sc.getValueForPixel(xMaxPx);
        onRangeSelected?.(vMin, vMax);
        clearSelection();
    };

    const onPointerUp = () => {
        if (!rangeSelect || !dragRef.current.active) return;
        finalizeSelection();
    };

    const onPointerCancel = () => {
        if (!rangeSelect) return;
        clearSelection();
    };

    const onDblClick = () => {
        if (!rangeSelect) return;
        clearSelection();
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            clearSelection();
            clearPinned();
        }
    };

    // ---- Click to pin a scatter point ----
    const onCanvasClick = (e: MouseEvent) => {
        // ignore if a drag selection was active
        if (dragRef.current.active) return;

        if (!pinScatter || !chartInstanceRef.current) return;
        const chart = chartInstanceRef.current;

        // Find nearest element at click
        const elems = chart.getElementsAtEventForMode(e as unknown as Event, "nearest", { intersect: true }, true);
        if (!elems || !elems.length) {
            // click on empty space clears pin
            clearPinned();
            return;
        }

        const el = elems[0];
        const dsIndex = el.datasetIndex;
        const index = el.index;
        const ds: any = chart.data.datasets?.[dsIndex];

        // Only pin scatter points
        const isScatter = ds?.type === "scatter" || ds?.showLine === false;
        if (!isScatter) {
            clearPinned();
            return;
        }

        // Toggle pin if clicking the same point
        if (pinnedRef.current && pinnedRef.current.datasetIndex === dsIndex && pinnedRef.current.index === index) {
            clearPinned();
        } else {
            pinnedRef.current = { datasetIndex: dsIndex, index };
            chart.draw();
        }
    };

    // ---- Legend positioning ----
    const floatingLegendTopLeft: React.CSSProperties = { top: "20px", left: "20px" };
    const floatingLegendTopRight: React.CSSProperties = { top: "20px", right: "20px" };
    const floatingLegendBottomLeft: React.CSSProperties = { bottom: "20px", left: "20px" };
    const floatingLegendBottomRight: React.CSSProperties = { bottom: "20px", right: "20px" };

    const setLegendStyleValue = (): React.CSSProperties => {
        if (legendPosition === LegendPosition.TOP || legendPosition === LegendPosition.BOTTOM) return {};
        if (legendPosition === LegendPosition.TOP_RIGHT) return floatingLegendTopRight;
        if (legendPosition === LegendPosition.TOP_LEFT) return floatingLegendTopLeft;
        if (legendPosition === LegendPosition.BOTTOM_RIGHT) return floatingLegendBottomRight;
        return floatingLegendBottomLeft;
    };
    const [legendStyle] = useState<React.CSSProperties>(setLegendStyleValue());

    const getOrCreateLegendList = (chart: any, id: any) => {
        const legendContainer = document.getElementById(id);
        if (!legendContainer) return null;
        let listContainer = legendContainer.querySelector("ul");
        if (!listContainer) {
            listContainer = document.createElement("ul");
            listContainer.style.display = "flex";
            listContainer.style.flexDirection =
                legendPosition === LegendPosition.TOP || legendPosition === LegendPosition.BOTTOM ? "row" : "column";
            listContainer.style.margin = "0";
            listContainer.style.padding = "0";
            // @ts-ignore
            legendContainer.appendChild(listContainer);
        }
        return listContainer;
    };

    const htmlLegendPlugin = {
        id: "htmlLegend",
        afterUpdate(chart: any, _args: any, options: any) {
            const ul = getOrCreateLegendList(chart, options.containerID);
            if (!ul) return;
            while (ul.firstChild) ul.firstChild.remove();
            const items = chart.options.plugins.legend.labels.generateLabels(chart);
            // @ts-ignore
            items.forEach((item: any) => {
                const li = document.createElement("li");
                li.className = "blue-orange-line-chart-legend-item";
                li.style.alignItems = "center";
                li.style.cursor = "pointer";
                li.style.display = "flex";
                li.style.flexDirection = "row";
                li.style.marginLeft = "10px";

                li.onclick = () => {
                    const { type } = chart.config;
                    if (type === "pie" || type === "doughnut") {
                        chart.toggleDataVisibility(item.index);
                    } else {
                        chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                    }
                    const vis = datasetVisibility.current;
                    vis[item.datasetIndex] = !vis[item.datasetIndex];
                    datasetVisibility.current = vis;
                    (li.children[1] as HTMLElement).style.textDecoration = vis[item.datasetIndex] ? "" : "line-through";
                    chart.update();
                };

                const boxSpan = document.createElement("span");
                boxSpan.className = "blue-orange-line-chart-legend-item-color-span";
                boxSpan.style.background = item.fillStyle;
                boxSpan.style.borderColor = item.strokeStyle;
                boxSpan.style.borderWidth = item.lineWidth + "px";
                boxSpan.style.display = "inline-block";
                boxSpan.style.flexShrink = "0";

                const textContainer = document.createElement("p");
                textContainer.className = "blue-orange-line-chart-legend-item-text";
                textContainer.style.margin = "0";
                textContainer.style.padding = "0";
                textContainer.style.textDecoration = item.hidden ? "line-through" : "";
                textContainer.appendChild(document.createTextNode(item.text));

                li.appendChild(boxSpan);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        },
    };

    // ---- Selection overlay + tooltip suppression ----
    const selectionOverlayPlugin = {
        id: "xRangeSelectionOverlay",
        beforeEvent: (chart: any) => {
            if (dragRef.current.active) {
                chart.setActiveElements([]);
                chart.tooltip?.setActiveElements?.([], { x: 0, y: 0 });
            }
        },
        afterDraw: (chart: any) => {
            // draw selection band
            const { active, startX, endX } = dragRef.current;
            if (active && startX != null && endX != null) {
                const { ctx, chartArea } = chart;
                const x1 = Math.max(Math.min(startX, endX), chartArea.left);
                const x2 = Math.min(Math.max(startX, endX), chartArea.right);
                const w = Math.max(0, x2 - x1);
                if (w > 0) {
                    ctx.save();
                    ctx.fillStyle = "rgba(45, 136, 255, 0.15)";
                    ctx.fillRect(x1, chartArea.top, w, chartArea.bottom - chartArea.top);
                    ctx.strokeStyle = "rgba(45, 136, 255, 0.8)";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x1, chartArea.top, w, chartArea.bottom - chartArea.top);
                    ctx.restore();
                }
            }

            // draw pinned scatter ring
            if (pinnedRef.current) {
                const { datasetIndex, index } = pinnedRef.current;
                const meta = chart.getDatasetMeta(datasetIndex);
                const el = meta?.data?.[index];
                if (el && el.x != null && el.y != null && !meta.hidden) {
                    const ds = chart.data.datasets?.[datasetIndex] as any;
                    const radius = (el.options?.radius ?? scatterPointRadius) + pinnedPointRingExtraRadius;
                    const stroke = ds?.borderColor ?? ds?.pointBorderColor ?? "#333";

                    chart.ctx.save();
                    chart.ctx.beginPath();
                    chart.ctx.arc(el.x, el.y, radius, 0, Math.PI * 2);
                    chart.ctx.lineWidth = pinnedPointBorderWidth;
                    chart.ctx.strokeStyle = stroke;
                    chart.ctx.stroke();

                    // subtle inner ring for contrast
                    chart.ctx.beginPath();
                    chart.ctx.arc(el.x, el.y, radius + 2, 0, Math.PI * 2);
                    chart.ctx.lineWidth = 1;
                    chart.ctx.strokeStyle = "rgba(0,0,0,0.15)";
                    chart.ctx.stroke();
                    chart.ctx.restore();
                }
            }
        },
    };

    // ---- External tooltip (viewport safe + near caret + suppressed during drag) ----
    const externalTooltip = (context: any) => {
        // Hide completely while selecting a range
        if (dragRef.current.active) {
            const id = "blue-orange-chart-line-js-tooltip-" + uuid;
            const el = document.getElementById(id);
            if (el) el.style.opacity = "0";
            return;
        }

        let tooltipEl = document.getElementById("blue-orange-chart-line-js-tooltip-" + uuid);
        if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "blue-orange-chart-line-js-tooltip-" + uuid;
            tooltipEl.className = "blue-orange-chart-line-tooltip";
            const tooltipBody = document.createElement("div");
            tooltipBody.id = "blue-orange-chart-line-js-tooltip-body-" + uuid;
            tooltipBody.className = "blue-orange-chart-line-tooltip-body";
            tooltipEl.appendChild(tooltipBody);
            document.body.appendChild(tooltipEl);
        }

        const tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
        }

        // Build contents
        if (tooltipModel.body) {
            const selected = tooltipModel.dataPoints;
            const container = document.createElement("div");
            container.className = "blue-orange-charts-line-dataset-container";

            for (const dp of selected) {
                const dataset = dp.dataset;
                const borderColor = dataset.borderColor;
                const backgroundColor = dataset.backgroundColor;
                const formattedValue = dp.formattedValue;
                const datasetLabel = dataset.label ?? "";

                const row = document.createElement("div");
                row.className = "blue-orange-charts-line-dataset-row";

                const dot = document.createElement("div");
                dot.style.height = "10px";
                dot.style.width = "10px";
                dot.style.borderRadius = "50%";
                dot.style.border = "2px solid " + borderColor;
                dot.style.backgroundColor = backgroundColor;
                dot.style.marginRight = "15px";

                const val = document.createElement("div");
                val.className = "blue-orange-chart-line-tooltip-value";
                val.innerHTML = `<span class='blue-orange-chart-line-tooltip-dataset-label'>${datasetLabel}:</span>${formattedValue}`;

                row.appendChild(dot);
                row.appendChild(val);
                container.appendChild(row);
            }

            const bodyEl = document.getElementById("blue-orange-chart-line-js-tooltip-body-" + uuid) as HTMLElement;
            bodyEl.innerHTML = "";
            bodyEl.appendChild(container);
        }

        // Position (viewport clamped, hugging caret)
        const position = context.chart.canvas.getBoundingClientRect();
        const ptX = position.left + window.scrollX + tooltipModel.caretX;
        const ptY = position.top + window.scrollY + tooltipModel.caretY;

        tooltipEl.style.opacity = "1";
        tooltipEl.style.position = "absolute";
        tooltipEl.style.left = "0px";
        tooltipEl.style.top = "0px";

        const bounds = tooltipEl.getBoundingClientRect();
        const tw = bounds.width;
        const th = bounds.height;

        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const sx = window.scrollX;
        const sy = window.scrollY;

        const PAD = 8;
        const OFFSET = 12;

        // Horizontal: prefer right, fallback left, else clamp centered-ish
        let left = ptX + OFFSET;
        if (left + tw > sx + vw - PAD) {
            const leftAlt = ptX - tw - OFFSET;
            left = leftAlt >= sx + PAD ? leftAlt : Math.max(sx + PAD, Math.min(ptX - tw / 2, sx + vw - tw - PAD));
        }

        // Vertical: below if in top half; above if in bottom half
        const inBottomHalf = ptY - sy > vh / 2;
        let top = inBottomHalf ? ptY - th - OFFSET : ptY + OFFSET;
        if (top < sy + PAD) top = sy + PAD;
        if (top + th > sy + vh - PAD) top = sy + vh - th - PAD;

        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;
        tooltipEl.style.pointerEvents = "none";
    };

    // ---- Dataset mapping (keeps scatter visible, lines clean, respects visibility) ----
    const mapDataset = (ds: any, i?: number) => {
        const out = { ...ds };

        // Default render order (can be overridden by caller)
        if (out.type === "bar" && out.order === undefined) out.order = 0;
        if (out.type === "line" && out.order === undefined) out.order = 1;
        if (out.type === "scatter" && out.order === undefined) out.order = 2;

        if (out.type === "line") {
            out.fill = fill;
            if (out.pointRadius === undefined) out.pointRadius = 0;
            if (out.pointHoverRadius === undefined) out.pointHoverRadius = 0;
        }

        if (out.type === "scatter") {
            out.showLine = false;
            if (out.pointRadius === undefined) out.pointRadius = scatterPointRadius;
            if (out.pointHoverRadius === undefined) out.pointHoverRadius = scatterPointHoverRadius;
            if (out.pointBorderColor === undefined && out.borderColor) out.pointBorderColor = out.borderColor;
            if (out.pointBackgroundColor === undefined) {
                out.pointBackgroundColor = out.backgroundColor ?? out.borderColor ?? "#888";
            }
        }

        if (typeof i === "number" && typeof datasetVisibility.current[i] !== "undefined") {
            out.hidden = !datasetVisibility.current[i];
        }
        return out;
    };

    const updateChartData = () => {
        if (!chartInstanceRef.current || !initRef.current) return;
        const updated = dataset.map((ds, i) => mapDataset(ds, i));
        chartInstanceRef.current.data = { labels, datasets: updated } as any;
        (chartInstanceRef.current.options as any).animation = false;
        chartInstanceRef.current.update();

        // refresh custom legend
        // @ts-ignore
        if (chartInstanceRef.current.options.plugins?.htmlLegend?.afterUpdate) {
            // @ts-ignore
            chartInstanceRef.current.options.plugins.htmlLegend.afterUpdate(
                chartInstanceRef.current,
                {},
                { containerID: uuid }
            );
        }

        // If the pinned dataset is now hidden or changed length, unpin
        if (pinnedRef.current) {
            const { datasetIndex, index } = pinnedRef.current;
            const ds = updated[datasetIndex];
            if (!ds || ds.hidden || !chartInstanceRef.current.getDatasetMeta(datasetIndex).data[index]) {
                clearPinned();
            }
        }
    };

    useEffect(() => {
        if (!chartRef.current) return;

        if (datasetVisibility.current.length !== dataset.length) {
            datasetVisibility.current = dataset.map(() => true);
        }

        const ctx = chartRef.current.getContext("2d")!;
        const config: any = {
            type: "bar", // base; per-dataset type overrides
            data: {
                labels,
                datasets: dataset.map((ds, i) => mapDataset(ds, i)),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    htmlLegend: { containerID: uuid },
                    legend: { display: false },
                    tooltip: {
                        enabled: false, // handled externally
                        intersect: false,
                        mode: interactionType,
                        external: externalTooltip,
                    },
                },
                elements: {
                    line: { tension },
                    point: { radius: 0 }, // dataset-level overrides keep scatter visible
                },
                scales: {
                    y: {
                        type: yScale,
                        title: { display: yLabel !== undefined, text: yLabel },
                        grid: { display: gridLines },
                        ticks: { display: true },
                    },
                    x: {
                        title: { display: xLabel !== undefined, text: xLabel },
                        type: xScale, // 'time'|'linear'|'category'
                        time: { unit: xScaleTimeUnit },
                        grid: { display: gridLines },
                        ticks: { display: true },
                    },
                },
                interaction: {
                    intersect: false,
                    mode: interactionType,
                },
            },
            plugins: [htmlLegendPlugin, selectionOverlayPlugin],
        };

        chartInstanceRef.current = new Chart((ctx as CanvasRenderingContext2D), config);

        // Selection handlers
        const canvas = chartInstanceRef.current.canvas as HTMLCanvasElement;
        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerCancel);
        canvas.addEventListener("dblclick", onDblClick);
        window.addEventListener("keydown", onKeyDown);

        // Click-to-pin handler
        canvas.addEventListener("click", onCanvasClick);

        setTimeout(() => {
            initRef.current = true;
            updateChartData();
        }, animationTimeout);

        return () => {
            if (chartInstanceRef.current) {
                const c = chartInstanceRef.current.canvas as HTMLCanvasElement;
                c.removeEventListener("pointerdown", onPointerDown);
                c.removeEventListener("pointermove", onPointerMove);
                c.removeEventListener("pointerup", onPointerUp);
                c.removeEventListener("pointercancel", onPointerCancel);
                c.removeEventListener("dblclick", onDblClick);
                window.removeEventListener("keydown", onKeyDown);
                c.removeEventListener("click", onCanvasClick);
                chartInstanceRef.current.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        updateChartData();
    }, [dataset, labels]);

    return (
        <div className="blue-orange-line-chart-cont" style={{ height, width }}>
            {legend && legendPosition === LegendPosition.TOP && (
                <div id={uuid} className="blue-orange-line-chart-legend-cont"></div>
            )}
            <canvas ref={chartRef} />
            {legend && legendPosition === LegendPosition.BOTTOM && (
                <div id={uuid} className="blue-orange-line-chart-legend-cont"></div>
            )}
            {legend &&
                legendPosition !== LegendPosition.BOTTOM &&
                legendPosition !== LegendPosition.TOP && (
                    <div id={uuid} style={legendStyle} className="blue-orange-line-chart-floating-legend-cont"></div>
                )}
        </div>
    );
};
