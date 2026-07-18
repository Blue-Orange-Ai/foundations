import React from "react";
import {render, act} from "@testing-library/react";
import MockChart from "../testUtils/chartMock";
import {makeDataPoint, makeTooltipModel} from "../testUtils/tooltipFixtures";
import {ScatterChart} from "./ScatterChart";
import {LegendPosition} from "../types/ChartTypes";

jest.mock("chart.js/auto", () => require("../testUtils/chartMock"));

const anyChart = MockChart as any;
const getConfig = () => anyChart.lastInstance.config;
const getExternalTooltip = () => getConfig().options.plugins.tooltip.external;

const invokeTooltip = (model: any) => {
    const chart = anyChart.lastInstance;
    act(() => {
        getExternalTooltip()({chart, tooltip: model});
    });
};

const dataset = [{label: "Points", data: [{x: 1, y: 2}], borderColor: "#2d88ff"}];

beforeAll(() => {
    (HTMLCanvasElement.prototype as any).getContext = jest.fn(() => ({canvas: document.createElement("canvas")}));
});

beforeEach(() => {
    anyChart.reset();
    document.body.querySelectorAll(".blue-orange-chart-scatter-tooltip").forEach((n) => n.remove());
});

describe("ScatterChart - rendering", () => {
    it("renders a canvas element", () => {
        const {container} = render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("renders a bottom legend container by default", () => {
        const {container} = render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-scatter-chart-legend-cont")).toBeInTheDocument();
    });

    it("hides the legend when legend is false", () => {
        const {container} = render(<ScatterChart dataset={dataset} legend={false} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-scatter-chart-legend-cont")).toBeNull();
    });

    it("renders a floating legend for corner positions", () => {
        const {container} = render(
            <ScatterChart dataset={dataset} legendPosition={LegendPosition.TOP_LEFT} animationTimeout={0}/>
        );
        expect(container.querySelector(".blue-orange-scatter-chart-floating-legend-cont")).toBeInTheDocument();
    });
});

describe("ScatterChart - Chart.js configuration", () => {
    it("creates a scatter chart", () => {
        render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        expect(getConfig().type).toBe("scatter");
    });

    it("defaults the interaction mode to nearest", () => {
        render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        expect(getConfig().options.interaction.mode).toBe("nearest");
    });

    it("passes axis titles and scale types", () => {
        render(<ScatterChart dataset={dataset} xLabel="X" yLabel="Y" xScale="linear" yScale="linear" animationTimeout={0}/>);
        const scales = getConfig().options.scales;
        expect(scales.x.title).toEqual({display: true, text: "X"});
        expect(scales.y.title).toEqual({display: true, text: "Y"});
        expect(scales.x.type).toBe("linear");
        expect(scales.y.type).toBe("linear");
    });

    it("passes datasets to the chart data", () => {
        render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        expect(getConfig().data.datasets).toBe(dataset);
    });
});

describe("ScatterChart - vertical cursor line", () => {
    it("registers the vertical line plugin", () => {
        render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        expect(getConfig().plugins.find((p: any) => p.id === "verticalCursorLine")).toBeTruthy();
    });

    it("draws when enabled with a dash pattern", () => {
        render(<ScatterChart dataset={dataset} verticalLine verticalLineDash={[2, 2]} animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 30, y: 30}, changed: false});
        plugin.afterDraw(chart);
        expect(chart.ctx.setLineDash).toHaveBeenCalledWith([2, 2]);
        expect(chart.ctx.stroke).toHaveBeenCalled();
    });
});

describe("ScatterChart - external tooltip", () => {
    it("renders default rows with the scatter class prefix", () => {
        render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint({datasetLabel: "Points", formattedValue: "7"})]));
        const tooltip = document.querySelector(".blue-orange-chart-scatter-tooltip");
        expect(tooltip).toBeTruthy();
        expect(tooltip!.querySelector(".blue-orange-charts-scatter-dataset-row")).toBeTruthy();
        expect(tooltip!.textContent).toContain("Points:7");
    });

    it("supports custom y labels", () => {
        render(<ScatterChart dataset={dataset} tooltip={{yLabel: () => "custom"}} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint({formattedValue: "9"})]));
        expect(document.querySelector(".blue-orange-chart-scatter-tooltip")!.textContent).toContain("custom:9");
    });

    it("hides the tooltip when opacity is 0", () => {
        render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint()]));
        const tooltip = document.querySelector(".blue-orange-chart-scatter-tooltip") as HTMLElement;
        invokeTooltip({...makeTooltipModel([makeDataPoint()]), opacity: 0});
        expect(tooltip.style.opacity).toBe("0");
    });
});

describe("ScatterChart - teardown", () => {
    it("destroys the chart on unmount", () => {
        const {unmount} = render(<ScatterChart dataset={dataset} animationTimeout={0}/>);
        const chart = anyChart.lastInstance;
        unmount();
        expect(chart.destroy).toHaveBeenCalled();
    });
});
