import React from "react";
import {render, act} from "@testing-library/react";
import MockChart from "../testUtils/chartMock";
import {makeDataPoint, makeTooltipModel} from "../testUtils/tooltipFixtures";
import {ComboChart} from "./ComboChart";

jest.mock("chart.js/auto", () => require("../testUtils/chartMock"));
jest.mock("chartjs-adapter-moment", () => ({}), {virtual: true});

const anyChart = MockChart as any;
const getConfig = () => anyChart.lastInstance.config;
const getExternalTooltip = () => getConfig().options.plugins.tooltip.external;

const invokeTooltip = (model: any) => {
    const chart = anyChart.lastInstance;
    act(() => {
        getExternalTooltip()({chart, tooltip: model});
    });
};

const lineDatasets = [
    {type: "line", label: "CPU", data: [{x: 1, y: 2}], borderColor: "#2d88ff"},
    {type: "line", label: "MEM", data: [{x: 1, y: 3}], borderColor: "#ff9900"},
];

beforeAll(() => {
    (HTMLCanvasElement.prototype as any).getContext = jest.fn(() => ({canvas: document.createElement("canvas")}));
});

beforeEach(() => {
    anyChart.reset();
    document.body.querySelectorAll(".blue-orange-chart-line-tooltip").forEach((n) => n.remove());
});

describe("ComboChart - rendering", () => {
    it("renders a canvas element", () => {
        const {container} = render(<ComboChart dataset={lineDatasets} animationTimeout={0}/>);
        expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("renders the container and legend", () => {
        const {container} = render(<ComboChart dataset={lineDatasets} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-line-chart-cont")).toBeInTheDocument();
        expect(container.querySelector(".blue-orange-line-chart-legend-cont")).toBeInTheDocument();
    });
});

describe("ComboChart - Chart.js configuration", () => {
    it("uses bar as the base chart type", () => {
        render(<ComboChart dataset={lineDatasets} animationTimeout={0}/>);
        expect(getConfig().type).toBe("bar");
    });

    it("does not stack axes by default", () => {
        render(<ComboChart dataset={lineDatasets} animationTimeout={0}/>);
        expect(getConfig().options.scales.y.stacked).toBe(false);
        expect(getConfig().options.scales.x.stacked).toBe(false);
    });

    it("stacks the y axis when stackedAreas is enabled", () => {
        render(<ComboChart dataset={lineDatasets} stackedAreas animationTimeout={0}/>);
        expect(getConfig().options.scales.y.stacked).toBe(true);
    });

    it("stacks both axes for stacked bars", () => {
        const bars = [{type: "bar", label: "A", data: [1]}, {type: "bar", label: "B", data: [2]}];
        render(<ComboChart dataset={bars} stackedBars animationTimeout={0}/>);
        expect(getConfig().options.scales.y.stacked).toBe(true);
        expect(getConfig().options.scales.x.stacked).toBe(true);
    });
});

describe("ComboChart - dataset mapping", () => {
    it("fills line datasets to origin and stacks them for stacked areas", () => {
        render(<ComboChart dataset={lineDatasets} stackedAreas stackId="grp" animationTimeout={0}/>);
        const mapped = getConfig().data.datasets;
        expect(mapped[0].fill).toBe("origin");
        expect(mapped[0].stack).toBe("grp");
        expect(mapped[1].fill).toBe("origin");
    });

    it("applies the fill prop to lines when not stacking areas", () => {
        render(<ComboChart dataset={lineDatasets} fill="start" animationTimeout={0}/>);
        const mapped = getConfig().data.datasets;
        expect(mapped[0].fill).toBe("start");
    });

    it("configures scatter datasets with showLine=false", () => {
        const withScatter = [{type: "scatter", label: "S", data: [{x: 1, y: 2}], borderColor: "#000"}];
        render(<ComboChart dataset={withScatter} animationTimeout={0}/>);
        const mapped = getConfig().data.datasets;
        expect(mapped[0].showLine).toBe(false);
    });
});

describe("ComboChart - vertical cursor line (stacked areas)", () => {
    it("registers the vertical line plugin", () => {
        render(<ComboChart dataset={lineDatasets} stackedAreas animationTimeout={0}/>);
        expect(getConfig().plugins.find((p: any) => p.id === "verticalCursorLine")).toBeTruthy();
    });

    it("is disabled by default", () => {
        render(<ComboChart dataset={lineDatasets} stackedAreas animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        const args: any = {event: {type: "mousemove", x: 40, y: 40}, changed: false};
        plugin.afterEvent(chart, args);
        expect(args.changed).toBe(false);
    });

    it("draws a red line by default when enabled", () => {
        render(<ComboChart dataset={lineDatasets} stackedAreas verticalLine animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 40, y: 40}, changed: false});
        plugin.afterDraw(chart);
        expect(chart.ctx.stroke).toHaveBeenCalled();
        expect(chart.ctx.strokeStyle).toBe("red");
    });

    it("uses a customised colour and width", () => {
        render(
            <ComboChart
                dataset={lineDatasets}
                stackedAreas
                verticalLine
                verticalLineColor="#00ff00"
                verticalLineWidth={4}
                animationTimeout={0}
            />
        );
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 40, y: 40}, changed: false});
        plugin.afterDraw(chart);
        expect(chart.ctx.strokeStyle).toBe("#00ff00");
        expect(chart.ctx.lineWidth).toBe(4);
    });
});

describe("ComboChart - external tooltip", () => {
    it("renders default rows", () => {
        render(<ComboChart dataset={lineDatasets} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint({datasetLabel: "CPU", formattedValue: "2"})]));
        const tooltip = document.querySelector(".blue-orange-chart-line-tooltip");
        expect(tooltip!.textContent).toContain("CPU:2");
    });

    it("supports the legacy showXValueInTooltip with formatter", () => {
        render(
            <ComboChart
                dataset={lineDatasets}
                showXValueInTooltip
                xValueFormatter={(v) => `t=${v}`}
                animationTimeout={0}
            />
        );
        invokeTooltip(makeTooltipModel([makeDataPoint({parsed: {x: 100, y: 2}})]));
        const header = document.querySelector(".blue-orange-chart-line-tooltip-x-value");
        expect(header!.textContent).toBe("t=100");
    });

    it("supports a dynamic custom x label", () => {
        render(
            <ComboChart
                dataset={lineDatasets}
                tooltip={{xLabel: (c) => `series:${c.dataPoints.length}`}}
                animationTimeout={0}
            />
        );
        invokeTooltip(
            makeTooltipModel([makeDataPoint(), makeDataPoint({datasetIndex: 1})], ["2024"])
        );
        expect(document.querySelector(".blue-orange-chart-line-tooltip-x-value")!.textContent).toBe("series:2");
    });

    it("supports hideDataPoints with custom fields only", () => {
        render(
            <ComboChart
                dataset={lineDatasets}
                tooltip={{hideDataPoints: true, fields: [{label: "Summary", value: "ok"}]}}
                animationTimeout={0}
            />
        );
        invokeTooltip(makeTooltipModel([makeDataPoint({datasetLabel: "CPU"})]));
        const tooltip = document.querySelector(".blue-orange-chart-line-tooltip")!;
        expect(tooltip.textContent).not.toContain("CPU");
        expect(tooltip.textContent).toContain("Summary:ok");
    });

    it("hides the tooltip when opacity is 0", () => {
        render(<ComboChart dataset={lineDatasets} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint()]));
        const tooltip = document.querySelector(".blue-orange-chart-line-tooltip") as HTMLElement;
        invokeTooltip({...makeTooltipModel([makeDataPoint()]), opacity: 0});
        expect(tooltip.style.opacity).toBe("0");
    });
});

describe("ComboChart - teardown", () => {
    it("destroys the chart on unmount", () => {
        const {unmount} = render(<ComboChart dataset={lineDatasets} animationTimeout={0}/>);
        const chart = anyChart.lastInstance;
        unmount();
        expect(chart.destroy).toHaveBeenCalled();
    });
});
