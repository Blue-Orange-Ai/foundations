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
 * Use via:  jest.mock('chart.js/auto', () => require('<path>/testUtils/chartMock'));
 */

const makeCtx = () => ({
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    arc: jest.fn(),
    setLineDash: jest.fn(),
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

        this.update = jest.fn();
        this.destroy = jest.fn();
        this.draw = jest.fn();
        this.setActiveElements = jest.fn();
        this.setDatasetVisibility = jest.fn();
        this.isDatasetVisible = jest.fn(() => true);
        this.toggleDataVisibility = jest.fn();
        this.getDatasetMeta = jest.fn(() => ({ data: [], hidden: false }));
        this.getElementsAtEventForMode = jest.fn(() => []);
        this.tooltip = { setActiveElements: jest.fn() };

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

module.exports = { __esModule: true, default: MockChart };
