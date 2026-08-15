import React from "react";
import {render, act} from "@testing-library/react";
import MockChart from "../testUtils/chartMock";
import {makeDataPoint, makeTooltipModel} from "../testUtils/tooltipFixtures";
import {BarChart} from "./BarChart";
import {LegendPosition} from "../types/ChartTypes";

vi.mock("chart.js/auto", () => vi.importActual("../testUtils/chartMock"));

const anyChart = MockChart as any;
const getConfig = () => anyChart.lastInstance.config;
const getExternalTooltip = () => getConfig().options.plugins.tooltip.external;

const invokeTooltip = (model: any) => {
    const chart = anyChart.lastInstance;
    act(() => {
        getExternalTooltip()({chart, tooltip: model});
    });
};

const dataset = [{label: "Sales", data: [1, 2, 3], borderColor: "#2d88ff"}];
const labels = ["Jan", "Feb", "Mar"];

beforeAll(() => {
    (HTMLCanvasElement.prototype as any).getContext = vi.fn(() => ({canvas: document.createElement("canvas")}));
});

beforeEach(() => {
    anyChart.reset();
    document.body.querySelectorAll(".blue-orange-chart-line-tooltip").forEach((n) => n.remove());
});

describe("BarChart - rendering", () => {
    it("renders a canvas element", () => {
        const {container} = render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("renders the root container class", () => {
        const {container} = render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-bar-chart-cont")).toBeInTheDocument();
    });

    it("renders a bottom legend container by default", () => {
        const {container} = render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-bar-chart-legend-cont")).toBeInTheDocument();
    });

    it("hides the legend when legend is false", () => {
        const {container} = render(<BarChart dataset={dataset} labels={labels} legend={false} animationTimeout={0}/>);
        expect(container.querySelector(".blue-orange-bar-chart-legend-cont")).toBeNull();
    });

    it("renders a floating legend for corner positions", () => {
        const {container} = render(
            <BarChart dataset={dataset} labels={labels} legendPosition={LegendPosition.BOTTOM_LEFT} animationTimeout={0}/>
        );
        expect(container.querySelector(".blue-orange-bar-chart-floating-legend-cont")).toBeInTheDocument();
    });
});

describe("BarChart - Chart.js configuration", () => {
    it("creates a bar chart", () => {
        render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        expect(getConfig().type).toBe("bar");
    });

    it("applies indexAxis for horizontal bars", () => {
        render(<BarChart dataset={dataset} labels={labels} indexAxis="y" animationTimeout={0}/>);
        expect(getConfig().options.indexAxis).toBe("y");
    });

    it("defaults indexAxis to x", () => {
        render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        expect(getConfig().options.indexAxis).toBe("x");
    });

    it("passes axis titles", () => {
        render(<BarChart dataset={dataset} labels={labels} xLabel="Month" yLabel="Units" animationTimeout={0}/>);
        const scales = getConfig().options.scales;
        // toMatchObject, not toEqual: applyChartTheme also stamps the active
        // theme's `color` onto each axis title (see utils/ChartTheme).
        expect(scales.x.title).toMatchObject({display: true, text: "Month"});
        expect(scales.y.title).toMatchObject({display: true, text: "Units"});
    });

    it("passes labels to the chart data", () => {
        render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        expect(getConfig().data.labels).toEqual(labels);
    });

    it("toggles grid lines", () => {
        render(<BarChart dataset={dataset} labels={labels} gridLines={false} animationTimeout={0}/>);
        expect(getConfig().options.scales.x.grid.display).toBe(false);
    });
});

describe("BarChart - vertical cursor line", () => {
    it("registers the vertical line plugin", () => {
        render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        expect(getConfig().plugins.find((p: any) => p.id === "verticalCursorLine")).toBeTruthy();
    });

    it("draws when enabled", () => {
        render(<BarChart dataset={dataset} labels={labels} verticalLine verticalLineColor="#123456" animationTimeout={0}/>);
        const plugin = getConfig().plugins.find((p: any) => p.id === "verticalCursorLine");
        const chart = anyChart.lastInstance;
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 40, y: 40}, changed: false});
        plugin.afterDraw(chart);
        expect(chart.ctx.stroke).toHaveBeenCalled();
        expect(chart.ctx.strokeStyle).toBe("#123456");
    });
});

describe("BarChart - external tooltip", () => {
    it("renders default rows", () => {
        render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint({datasetLabel: "Sales", formattedValue: "3"})], ["Mar"]));
        const tooltip = document.querySelector(".blue-orange-chart-line-tooltip");
        expect(tooltip!.textContent).toContain("Sales:3");
    });

    it("supports the legacy x-value header", () => {
        render(<BarChart dataset={dataset} labels={labels} showXValueInTooltip animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint({datasetLabel: "Sales"})], ["Mar"]));
        const header = document.querySelector(".blue-orange-chart-line-tooltip-x-value");
        expect(header!.textContent).toBe("Mar");
    });

    it("supports custom tooltip fields", () => {
        render(
            <BarChart
                dataset={dataset}
                labels={labels}
                tooltip={{fields: [{label: "Static", value: "field"}]}}
                animationTimeout={0}
            />
        );
        invokeTooltip(makeTooltipModel([makeDataPoint()], ["Mar"]));
        expect(document.querySelector(".blue-orange-chart-line-tooltip")!.textContent).toContain("Static:field");
    });

    it("hides the tooltip when opacity is 0", () => {
        render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        invokeTooltip(makeTooltipModel([makeDataPoint()], ["Mar"]));
        const tooltip = document.querySelector(".blue-orange-chart-line-tooltip") as HTMLElement;
        invokeTooltip({...makeTooltipModel([makeDataPoint()], ["Mar"]), opacity: 0});
        expect(tooltip.style.opacity).toBe("0");
    });
});

describe("BarChart - teardown", () => {
    it("destroys the chart on unmount", () => {
        const {unmount} = render(<BarChart dataset={dataset} labels={labels} animationTimeout={0}/>);
        const chart = anyChart.lastInstance;
        unmount();
        expect(chart.destroy).toHaveBeenCalled();
    });
});
