import {
    buildTooltipContent,
    buildTooltipDataPoints,
    resolveTooltipFieldValue,
    resolveTooltipXValue,
} from "./ChartTooltip";
import {TooltipConfig, TooltipContext} from "../types/ChartTypes";
import {makeDataPoint, makeTooltipModel} from "../testUtils/tooltipFixtures";

describe("resolveTooltipFieldValue", () => {
    const ctx: TooltipContext = {xValue: 5, xLabel: "5", dataPoints: []};

    it("returns undefined for undefined input", () => {
        expect(resolveTooltipFieldValue(undefined, ctx)).toBeUndefined();
    });

    it("returns a static string unchanged", () => {
        expect(resolveTooltipFieldValue("hello", ctx)).toBe("hello");
    });

    it("invokes a function with the context", () => {
        const fn = jest.fn((c: TooltipContext) => `x=${c.xLabel}`);
        expect(resolveTooltipFieldValue(fn, ctx)).toBe("x=5");
        expect(fn).toHaveBeenCalledWith(ctx);
    });
});

describe("buildTooltipDataPoints", () => {
    it("maps Chart.js data points into the library-agnostic shape", () => {
        const model = makeTooltipModel([
            makeDataPoint({
                datasetLabel: "CPU",
                formattedValue: "88",
                borderColor: "#f00",
                backgroundColor: "#0f0",
                datasetIndex: 2,
                dataIndex: 7,
                parsed: {x: 10, y: 88},
                raw: {x: 10, y: 88},
            }),
        ]);

        const points = buildTooltipDataPoints(model);
        expect(points).toHaveLength(1);
        expect(points[0]).toMatchObject({
            datasetLabel: "CPU",
            value: 88,
            formattedValue: "88",
            borderColor: "#f00",
            backgroundColor: "#0f0",
            datasetIndex: 2,
            index: 7,
        });
    });

    it("falls back to raw value when parsed.y is missing", () => {
        const dp: any = makeDataPoint({parsed: {x: 1} as any, raw: 99});
        const points = buildTooltipDataPoints({dataPoints: [dp]});
        expect(points[0].value).toBe(99);
    });

    it("returns an empty array when there are no data points", () => {
        expect(buildTooltipDataPoints({})).toEqual([]);
    });
});

describe("resolveTooltipXValue", () => {
    it("prefers the tooltip title", () => {
        const model = makeTooltipModel([makeDataPoint()], ["2024-06-30"]);
        expect(resolveTooltipXValue(model)).toBe("2024-06-30");
    });

    it("falls back to the parsed x of the first point", () => {
        const model = makeTooltipModel([makeDataPoint({parsed: {x: 123, y: 4}})]);
        expect(resolveTooltipXValue(model)).toBe(123);
    });

    it("returns undefined when there is nothing to resolve", () => {
        expect(resolveTooltipXValue({})).toBeUndefined();
    });
});

describe("buildTooltipContent - default behaviour", () => {
    it("renders one row per data point with dataset label and value", () => {
        const model = makeTooltipModel([
            makeDataPoint({datasetLabel: "CPU", formattedValue: "12"}),
            makeDataPoint({datasetLabel: "MEM", formattedValue: "34", datasetIndex: 1}),
        ]);

        const el = buildTooltipContent(model, {classPrefix: "line"});
        const rows = el.querySelectorAll(".blue-orange-charts-line-dataset-row");
        expect(rows).toHaveLength(2);
        expect(el.textContent).toContain("CPU:12");
        expect(el.textContent).toContain("MEM:34");
    });

    it("uses the given class prefix", () => {
        const model = makeTooltipModel([makeDataPoint()]);
        const el = buildTooltipContent(model, {classPrefix: "scatter"});
        expect(el.className).toBe("blue-orange-charts-scatter-dataset-container");
        expect(el.querySelector(".blue-orange-charts-scatter-dataset-row")).toBeTruthy();
    });

    it("does not render an x-value header by default", () => {
        const model = makeTooltipModel([makeDataPoint()], ["2024-06-30"]);
        const el = buildTooltipContent(model, {classPrefix: "line"});
        expect(el.querySelector(".blue-orange-chart-line-tooltip-x-value")).toBeNull();
    });

    it("renders a colour dot styled from the dataset colours", () => {
        const model = makeTooltipModel([
            makeDataPoint({borderColor: "rgb(255, 0, 0)", backgroundColor: "rgb(0, 255, 0)"}),
        ]);
        const el = buildTooltipContent(model, {classPrefix: "line"});
        const dot = el.querySelector(".blue-orange-charts-line-dataset-row div") as HTMLElement;
        expect(dot.style.backgroundColor).toBe("rgb(0, 255, 0)");
        expect(dot.style.border).toContain("rgb(255, 0, 0)");
    });
});

describe("buildTooltipContent - legacy x-value header", () => {
    it("renders the x-value header when showXValueInTooltip is true", () => {
        const model = makeTooltipModel([makeDataPoint()], ["2024-06-30"]);
        const el = buildTooltipContent(model, {classPrefix: "line", showXValueInTooltip: true});
        const header = el.querySelector(".blue-orange-chart-line-tooltip-x-value");
        expect(header).toBeTruthy();
        expect(header!.textContent).toBe("2024-06-30");
    });

    it("applies the xValueFormatter to the header", () => {
        const model = makeTooltipModel([makeDataPoint({parsed: {x: 1719705600000, y: 1}})]);
        const el = buildTooltipContent(model, {
            classPrefix: "line",
            showXValueInTooltip: true,
            xValueFormatter: (v) => `ts:${v}`,
        });
        expect(el.querySelector(".blue-orange-chart-line-tooltip-x-value")!.textContent).toBe(
            "ts:1719705600000"
        );
    });

    it("omits the header when the x-value is empty", () => {
        const dp = makeDataPoint({parsed: {y: 1} as any, label: ""});
        const model: any = {opacity: 1, body: [{lines: ["a: 1"]}], title: [], dataPoints: [dp]};
        const el = buildTooltipContent(model, {classPrefix: "line", showXValueInTooltip: true});
        expect(el.querySelector(".blue-orange-chart-line-tooltip-x-value")).toBeNull();
    });
});

describe("buildTooltipContent - custom x label", () => {
    it("renders a static custom x label", () => {
        const model = makeTooltipModel([makeDataPoint()], ["2024-06-30"]);
        const tooltip: TooltipConfig = {xLabel: "Custom Header"};
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        expect(el.querySelector(".blue-orange-chart-line-tooltip-x-value")!.textContent).toBe(
            "Custom Header"
        );
    });

    it("renders a dynamic x label computed from context", () => {
        const model = makeTooltipModel(
            [makeDataPoint({datasetLabel: "A"}), makeDataPoint({datasetLabel: "B", datasetIndex: 1})],
            ["2024-06-30"]
        );
        const tooltip: TooltipConfig = {
            xLabel: (c) => `${c.xLabel} (${c.dataPoints.length} series)`,
        };
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        expect(el.querySelector(".blue-orange-chart-line-tooltip-x-value")!.textContent).toBe(
            "2024-06-30 (2 series)"
        );
    });

    it("hides the custom x label when showXLabel is false", () => {
        const model = makeTooltipModel([makeDataPoint()], ["2024-06-30"]);
        const tooltip: TooltipConfig = {xLabel: "Header", showXLabel: false};
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        expect(el.querySelector(".blue-orange-chart-line-tooltip-x-value")).toBeNull();
    });

    it("custom x label takes precedence over the legacy formatter", () => {
        const model = makeTooltipModel([makeDataPoint()], ["raw"]);
        const el = buildTooltipContent(model, {
            classPrefix: "line",
            showXValueInTooltip: true,
            xValueFormatter: () => "legacy",
            tooltip: {xLabel: "custom"},
        });
        expect(el.querySelector(".blue-orange-chart-line-tooltip-x-value")!.textContent).toBe("custom");
    });
});

describe("buildTooltipContent - custom y label and value", () => {
    it("overrides the per-point label via yLabel", () => {
        const model = makeTooltipModel([makeDataPoint({datasetLabel: "CPU", formattedValue: "12"})]);
        const tooltip: TooltipConfig = {yLabel: (dp) => dp.datasetLabel.toLowerCase()};
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        expect(el.textContent).toContain("cpu:12");
    });

    it("overrides the value via valueFormatter", () => {
        const model = makeTooltipModel([makeDataPoint({datasetLabel: "CPU", formattedValue: "12"})]);
        const tooltip: TooltipConfig = {valueFormatter: (dp) => `${dp.value}%`};
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        expect(el.textContent).toContain("CPU:42%");
    });

    it("passes the data point to the callbacks", () => {
        const model = makeTooltipModel([
            makeDataPoint({datasetLabel: "CPU", formattedValue: "12", datasetIndex: 3, dataIndex: 9}),
        ]);
        const yLabel = jest.fn(() => "label");
        buildTooltipContent(model, {classPrefix: "line", tooltip: {yLabel}});
        expect(yLabel).toHaveBeenCalledWith(
            expect.objectContaining({datasetLabel: "CPU", datasetIndex: 3, index: 9})
        );
    });
});

describe("buildTooltipContent - extra fields", () => {
    it("appends static fields", () => {
        const model = makeTooltipModel([makeDataPoint()]);
        const tooltip: TooltipConfig = {fields: [{label: "Note", value: "hello"}]};
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        const fields = el.querySelectorAll(".blue-orange-charts-line-tooltip-field");
        expect(fields).toHaveLength(1);
        expect(fields[0].textContent).toContain("Note:hello");
    });

    it("appends dynamic fields computed from context", () => {
        const model = makeTooltipModel([
            makeDataPoint({formattedValue: "10"}),
            makeDataPoint({formattedValue: "20", datasetIndex: 1}),
        ]);
        const tooltip: TooltipConfig = {
            fields: [
                {
                    label: "Total",
                    value: (c) =>
                        String(c.dataPoints.reduce((s, dp) => s + Number(dp.formattedValue), 0)),
                },
            ],
        };
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        expect(el.textContent).toContain("Total:30");
    });

    it("renders a value-only field without a label span", () => {
        const model = makeTooltipModel([makeDataPoint()]);
        const tooltip: TooltipConfig = {fields: [{value: "standalone"}]};
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        const field = el.querySelector(".blue-orange-charts-line-tooltip-field")!;
        expect(field.textContent).toBe("standalone");
        expect(field.querySelector(".blue-orange-chart-line-tooltip-dataset-label")).toBeNull();
    });

    it("skips fields that resolve to nothing", () => {
        const model = makeTooltipModel([makeDataPoint()]);
        const tooltip: TooltipConfig = {fields: [{label: "", value: ""}]};
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        expect(el.querySelector(".blue-orange-charts-line-tooltip-field")).toBeNull();
    });

    it("renders a colour swatch when a field colour is given", () => {
        const model = makeTooltipModel([makeDataPoint()]);
        const tooltip: TooltipConfig = {fields: [{label: "L", value: "V", color: "rgb(1, 2, 3)"}]};
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        const dot = el.querySelector(".blue-orange-charts-line-tooltip-field div") as HTMLElement;
        expect(dot.style.backgroundColor).toBe("rgb(1, 2, 3)");
    });
});

describe("buildTooltipContent - hideDataPoints", () => {
    it("omits the default rows but keeps custom fields", () => {
        const model = makeTooltipModel([makeDataPoint({datasetLabel: "CPU"})]);
        const tooltip: TooltipConfig = {
            hideDataPoints: true,
            fields: [{label: "Only", value: "field"}],
        };
        const el = buildTooltipContent(model, {classPrefix: "line", tooltip});
        expect(el.querySelector(".blue-orange-charts-line-dataset-row.blue-orange-charts-line-tooltip-field")).toBeTruthy();
        // The single row present is the field row, not a dataset row.
        expect(el.textContent).not.toContain("CPU");
        expect(el.textContent).toContain("Only:field");
    });
});
