/**
 * A lightweight Chart.js mock used by the chart component unit tests.
 *
 * Chart.js needs a real 2D canvas context which jsdom does not provide, so we
 * replace `chart.js/auto` with this stand-in. It records the config passed to
 * the constructor (scales, plugins, tooltip callbacks, ...) so tests can assert
 * on how each chart wrapper translates its props into Chart.js configuration,
 * and it exposes enough surface (canvas, chartArea, scales) for the wrappers'
 * plugins and event handlers to run.
 *
 * Use via:  vi.mock('chart.js/auto', () => require('<path>/testUtils/chartMock'));
 */

const makeCtx = () => ({
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    arc: vi.fn(),
    setLineDash: vi.fn(),
    lineWidth: 1,
    strokeStyle: "#000",
    fillStyle: "#000",
});

class MockChart {
    constructor(ctx, config) {
        this.passedCtx = ctx;
        this.config = config;
        this.data = config.data;
        this.options = config.options;
        // Provide a real canvas element so event listeners can be attached.
        this.canvas = (ctx && ctx.canvas) || document.createElement("canvas");
        this.ctx = makeCtx();
        this.width = 200;
        this.height = 100;
        this.chartArea = { left: 0, right: 200, top: 0, bottom: 100, width: 200, height: 100 };
        this.scales = {
            x: {
                type: (config.options && config.options.scales && config.options.scales.x && config.options.scales.x.type) || "linear",
                getValueForPixel: (px) => px,
                getPixelForValue: (v) => v,
                getLabels: () => (config.data && config.data.labels) || [],
                getLabelForValue: (v) => v,
            },
            y: {
                getValueForPixel: (px) => px,
                getPixelForValue: (v) => v,
            },
        };

        // Mirror real Chart.js: once destroyed the canvas context is torn down,
        // so draw()/update() blow up (the "Cannot read properties of null" crash
        // seen in the browser). This lets tests catch draws on a stale instance.
        this.destroyed = false;
        this.update = vi.fn(() => {
            if (this.destroyed) throw new Error("Cannot read properties of null (reading 'ownerDocument')");
        });
        this.destroy = vi.fn(() => {
            this.destroyed = true;
            this.ctx = null;
        });
        this.draw = vi.fn(() => {
            if (this.destroyed) throw new Error("Cannot read properties of null (reading 'save')");
        });
        this.setActiveElements = vi.fn();
        this.setDatasetVisibility = vi.fn();
        this.isDatasetVisible = vi.fn(() => true);
        this.toggleDataVisibility = vi.fn();
        this.getDatasetMeta = vi.fn(() => ({ data: [], hidden: false }));
        this.getElementsAtEventForMode = vi.fn(() => []);
        this.tooltip = { setActiveElements: vi.fn() };

        MockChart.instances.push(this);
        MockChart.lastInstance = this;
    }
}

MockChart.instances = [];
MockChart.lastInstance = null;
MockChart.reset = () => {
    MockChart.instances = [];
    MockChart.lastInstance = null;
};

export default MockChart;
export { MockChart };
