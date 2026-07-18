/**
 * Builders for fake Chart.js tooltip models used across the chart tests.
 */

export interface FakeDataPointOptions {
    datasetLabel?: string;
    formattedValue?: string;
    borderColor?: string;
    backgroundColor?: string;
    datasetIndex?: number;
    dataIndex?: number;
    parsed?: { x?: any; y?: any };
    label?: string;
    raw?: any;
}

export const makeDataPoint = (opts: FakeDataPointOptions = {}) => ({
    dataset: {
        label: opts.datasetLabel ?? "Series",
        borderColor: opts.borderColor ?? "#2d88ff",
        backgroundColor: opts.backgroundColor ?? "rgba(45,136,255,0.3)",
    },
    formattedValue: opts.formattedValue ?? "42",
    datasetIndex: opts.datasetIndex ?? 0,
    dataIndex: opts.dataIndex ?? 0,
    parsed: opts.parsed ?? { x: 1719705600000, y: 42 },
    label: opts.label ?? "",
    raw: opts.raw ?? { x: 1719705600000, y: 42 },
});

export const makeTooltipModel = (
    dataPoints: Array<ReturnType<typeof makeDataPoint>>,
    title?: Array<string>
) => ({
    opacity: 1,
    body: dataPoints.map((dp) => ({ lines: [`${dp.dataset.label}: ${dp.formattedValue}`] })),
    title: title ?? [],
    dataPoints,
});
