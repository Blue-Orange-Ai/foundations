import React from "react";
import {render, act} from "@testing-library/react";
import MockChart from "../testUtils/chartMock";
import {makeDataPoint, makeTooltipModel} from "../testUtils/tooltipFixtures";
import {LineChart} from "./LineChart";
import {LegendPosition} from "../types/ChartTypes";

// Replace Chart.js with the recording mock.
jest.mock("chart.js/auto", () => require("../testUtils/chartMock"));
jest.mock("chartjs-adapter-moment", () => ({}), {virtual: true});

const anyChart = MockChart as any;

// Grab the external tooltip callback from the most recently created chart.
const getExternalTooltip = () => anyChart.lastInstance.config.options.plugins.tooltip.external;
const getConfig = () => anyChart.lastInstance.config;

const invokeTooltip = (model: any) => {
    const chart = anyChart.lastInstance;
    act(() => {
        getExternalTooltip()({chart, tooltip: model});
    });
};

const dataset = [{label: "CPU", data: [{x: 1, y: 2}], borderColor: "#2d88ff"}];

beforeAll(() => {
    // jsdom has no canvas 2D context; return a stub so Chart(ctx) doesn't warn.
    (HTMLCanvasElement.prototype as any).getContext = jest.fn(() => ({canvas: document.createElement("canvas")}));
});

beforeEach(() => {
    anyChart.reset();
    document.body.querySelectorAll(".blue-orange-chart-line-tooltip").forEach((n) => n.remove());
});

describe("LineChart - rendering", () => {
    it("renders a canvas element", () => {
        const {container} = render(<LineChart dataset={dataset} animationTimeout={0}/>);
        expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("renders the root container class", () => {
        const {container} = render(<LineChart dataset={dataset} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-line-chart-cont")).toBeInTheDocument();
    });

    it("renders a bottom legend container by default", () => {
        const {container} = render(<LineChart dataset={dataset} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-line-chart-legend-cont")).toBeInTheDocument();
    });

    it("does not render a legend when legend is false", () => {
        const {container} = render(<LineChart dataset={dataset} legend={false} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-line-chart-legend-cont")).toBeNull();
        expect(container.querySelector(".blue-orange-line-chart-floating-legend-cont")).toBeNull();
    });

    it("renders a floating legend container for corner positions", () => {
        const {container} = render(
            <LineChart dataset={dataset} legendPosition={LegendPosition.TOP_RIGHT} animationTimeout={0}/>
        );
        expect(container.querySelector(".blue-orange-line-chart-floating-legend-cont")).toBeInTheDocument();
    });

    it("applies height and width to the container", () => {
        const {container} = render(<LineChart dataset={dataset} height="300px" width="50%" animationTimeout={0}/>);
        const cont = container.querySelector(".blue-orange-line-chart-cont") as HTMLElement;
        expect(cont.style.height).toBe("300px");
        expect(cont.style.width).toBe("50%");
    });
});

describe("LineChart - Chart.js configuration", () => {
    it("creates a line chart", () => {
        render(<LineChart dataset={dataset} animationTimeout={0}/>);
        expect(anyChart.lastInstance).toBeTruthy();
        expect(getConfig().type).toBe("line");
    });

    it("passes axis titles from props", () => {
        render(<LineChart dataset={dataset} xLabel="Time" yLabel="Value" animationTimeout={0}/>);
        const scales = getConfig().options.scales;
        expect(scales.x.title).toEqual({display: true, text: "Time"});
        expect(scales.y.title).toEqual({display: true, text: "Value"});
    });

    it("hides axis titles when labels are not provided", () => {
        render(<LineChart dataset={dataset} animationTimeout={0}/>);
        const scales = getConfig().options.scales;
        expect(scales.x.title.display).toBe(false);
        expect(scales.y.title.display).toBe(false);
    });

    it("toggles grid line display", () => {
        render(<LineChart dataset={dataset} gridLines={false} animationTimeout={0}/>);
        const scales = getConfig().options.scales;
        expect(scales.x.grid.display).toBe(false);
        expect(scales.y.grid.display).toBe(false);
    });

    it("uses the given interaction mode", () => {
        render(<LineChart dataset={dataset} interactionType="nearest" animationTimeout={0}/>);
        expect(getConfig().options.interaction.mode).toBe("nearest");
    });

    it("applies the tension prop", () => {
        render(<LineChart dataset={dataset} tension={0.5} animationTimeout={0}/>);
        expect(getConfig().options.elements.line.tension).toBe(0.5);
    });
});

describe("LineChart - vertical cursor line", () => {
    it("registers the vertical line plugin", () => {
        render(<LineChart dataset={dataset} animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        expect(plugin).toBeTruthy();
    });

    it("is disabled by default", () => {
        render(<LineChart dataset={dataset} animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        const args: any = {event: {type: "mousemove", x: 50, y: 50}, changed: false};
        plugin.afterEvent(chart, args);
        expect(args.changed).toBe(false);
    });

    it("draws a customised line when enabled", () => {
        render(
            <LineChart
                dataset={dataset}
                verticalLine
                verticalLineColor="green"
                verticalLineWidth={2}
                animationTimeout={0}
            />
        );
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 50, y: 50}, changed: false});
        plugin.afterDraw(chart);
        expect(chart.ctx.stroke).toHaveBeenCalled();
        expect(chart.ctx.strokeStyle).toBe("green");
        expect(chart.ctx.lineWidth).toBe(2);
    });
});

describe("LineChart - cursor synchronisation", () => {
    it("reports the cursor position via onCursorMove", () => {
        const onCursorMove = jest.fn();
        render(<LineChart dataset={dataset} onCursorMove={onCursorMove} animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 50, y: 50}, changed: false});
        expect(onCursorMove).toHaveBeenCalledWith({x: 50, pixelX: 50});
    });

    it("reports null when the pointer leaves", () => {
        const onCursorMove = jest.fn();
        render(<LineChart dataset={dataset} onCursorMove={onCursorMove} animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 50, y: 50}, changed: false});
        onCursorMove.mockClear();
        plugin.afterEvent(chart, {event: {type: "mouseout"}, changed: false});
        expect(onCursorMove).toHaveBeenCalledWith(null);
    });

    it("draws a programmatic crosshair at the controlled cursorValue", () => {
        render(<LineChart dataset={dataset} verticalLine cursorValue={40} animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        // No hover — the line is driven purely by cursorValue (pixel === value in the mock).
        plugin.afterDraw(chart);
        expect(chart.ctx.moveTo).toHaveBeenCalledWith(40, chart.chartArea.top);
    });

    it("redraws when the controlled cursorValue changes", () => {
        const {rerender} = render(<LineChart dataset={dataset} verticalLine cursorValue={10} animationTimeout={0}/>);
        const chart = anyChart.lastInstance;
        chart.draw.mockClear();
        rerender(<LineChart dataset={dataset} verticalLine cursorValue={80} animationTimeout={0}/>);
        expect(chart.draw).toHaveBeenCalled();
    });
});

describe("LineChart - external tooltip", () => {
    it("creates a tooltip element with default rows", () => {
        render(<LineChart dataset={dataset} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint({datasetLabel: "CPU", formattedValue: "12"})]));
        const tooltip = document.querySelector(".blue-orange-chart-line-tooltip");
        expect(tooltip).toBeTruthy();
        expect(tooltip!.textContent).toContain("CPU:12");
    });

    it("hides the tooltip when opacity is 0", () => {
        render(<LineChart dataset={dataset} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint()]));
        const tooltip = document.querySelector(".blue-orange-chart-line-tooltip") as HTMLElement;
        expect(tooltip.style.opacity).toBe("1");
        invokeTooltip({...makeTooltipModel([makeDataPoint()]), opacity: 0});
        expect(tooltip.style.opacity).toBe("0");
    });

    it("renders a custom static x label", () => {
        render(<LineChart dataset={dataset} tooltip={{xLabel: "My Header"}} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint()], ["2024-06-30"]));
        const header = document.querySelector(".blue-orange-chart-line-tooltip-x-value");
        expect(header!.textContent).toBe("My Header");
    });

    it("renders custom y labels and appended fields", () => {
        render(
            <LineChart
                dataset={dataset}
                tooltip={{
                    yLabel: (dp) => dp.datasetLabel.toUpperCase(),
                    fields: [{label: "Note", value: (c) => `pts:${c.dataPoints.length}`}],
                }}
                animationTimeout={0}
            />
        );
        invokeTooltip(makeTooltipModel([makeDataPoint({datasetLabel: "cpu", formattedValue: "5"})]));
        const tooltip = document.querySelector(".blue-orange-chart-line-tooltip")!;
        expect(tooltip.textContent).toContain("CPU:5");
        expect(tooltip.textContent).toContain("Note:pts:1");
    });
});

describe("LineChart - updates & teardown", () => {
    it("reuses the same chart instance when the dataset prop changes", () => {
        const {rerender} = render(<LineChart dataset={dataset} animationTimeout={0}/>);
        const chart = anyChart.lastInstance;
        rerender(<LineChart dataset={[{label: "MEM", data: [{x: 1, y: 9}]}]} animationTimeout={0}/>);
        // The instance is reused (not recreated) across dataset changes.
        expect(anyChart.instances.length).toBe(1);
        expect(chart.destroy).not.toHaveBeenCalled();
    });

    it("destroys the chart on unmount", () => {
        const {unmount} = render(<LineChart dataset={dataset} animationTimeout={0}/>);
        const chart = anyChart.lastInstance;
        unmount();
        expect(chart.destroy).toHaveBeenCalled();
    });
});
