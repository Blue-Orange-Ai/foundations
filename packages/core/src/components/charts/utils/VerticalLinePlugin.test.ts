import {createVerticalLinePlugin} from "./VerticalLinePlugin";
import {VerticalLineOptions} from "../types/ChartTypes";

const makeChart = () => ({
    chartArea: {left: 10, right: 190, top: 5, bottom: 95},
    ctx: {
        save: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
        setLineDash: jest.fn(),
        lineWidth: 1,
        strokeStyle: "#000",
    },
});

describe("createVerticalLinePlugin", () => {
    it("has the expected plugin id", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        expect(plugin.id).toBe("verticalCursorLine");
    });

    it("does nothing on events when disabled", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: false}));
        const chart = makeChart();
        const args: any = {event: {type: "mousemove", x: 50, y: 50}, changed: false};
        plugin.afterEvent(chart, args);
        expect(args.changed).toBe(false);
        expect(plugin._state.x).toBeNull();
    });

    it("tracks the cursor position on mousemove inside the chart area", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        const chart = makeChart();
        const args: any = {event: {type: "mousemove", x: 50, y: 50}, changed: false};
        plugin.afterEvent(chart, args);
        expect(plugin._state.x).toBe(50);
        expect(plugin._state.inside).toBe(true);
        expect(args.changed).toBe(true);
    });

    it("marks the cursor as outside when moving beyond the chart area", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        const chart = makeChart();
        const args: any = {event: {type: "mousemove", x: 5, y: 50}, changed: false};
        plugin.afterEvent(chart, args);
        expect(plugin._state.inside).toBe(false);
    });

    it("clears inside state on mouseout", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 50, y: 50}, changed: false});
        expect(plugin._state.inside).toBe(true);

        const args: any = {event: {type: "mouseout"}, changed: false};
        plugin.afterEvent(chart, args);
        expect(plugin._state.inside).toBe(false);
        expect(args.changed).toBe(true);
    });

    it("does nothing when event or chartArea is missing", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        expect(() => plugin.afterEvent({}, {event: null})).not.toThrow();
        expect(() => plugin.afterEvent({chartArea: null}, {event: {type: "mousemove"}})).not.toThrow();
    });

    it("draws a line at the tracked position when inside", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true, color: "blue", width: 3}));
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 60, y: 40}, changed: false});
        plugin.afterDraw(chart);

        expect(chart.ctx.save).toHaveBeenCalled();
        expect(chart.ctx.beginPath).toHaveBeenCalled();
        expect(chart.ctx.moveTo).toHaveBeenCalledWith(60, 5);
        expect(chart.ctx.lineTo).toHaveBeenCalledWith(60, 95);
        expect(chart.ctx.stroke).toHaveBeenCalled();
        expect(chart.ctx.restore).toHaveBeenCalled();
        expect(chart.ctx.lineWidth).toBe(3);
        expect(chart.ctx.strokeStyle).toBe("blue");
    });

    it("defaults to a red 1px line", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 60, y: 40}, changed: false});
        plugin.afterDraw(chart);
        expect(chart.ctx.strokeStyle).toBe("red");
        expect(chart.ctx.lineWidth).toBe(1);
    });

    it("clamps the line to the chart area bounds", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        const chart = makeChart();
        // Force an out-of-bounds x directly then draw (inside must be true to draw).
        plugin._state.x = 500;
        plugin._state.inside = true;
        plugin.afterDraw(chart);
        expect(chart.ctx.moveTo).toHaveBeenCalledWith(190, 5); // clamped to right edge
    });

    it("applies a dash pattern when provided", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true, dash: [4, 4]}));
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 60, y: 40}, changed: false});
        plugin.afterDraw(chart);
        expect(chart.ctx.setLineDash).toHaveBeenCalledWith([4, 4]);
    });

    it("does not draw when the cursor is outside", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        const chart = makeChart();
        plugin._state.x = 50;
        plugin._state.inside = false;
        plugin.afterDraw(chart);
        expect(chart.ctx.stroke).not.toHaveBeenCalled();
    });

    it("does not draw when disabled even if state is set", () => {
        let opts: VerticalLineOptions = {enabled: true};
        const plugin = createVerticalLinePlugin(() => opts);
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 60, y: 40}, changed: false});
        opts = {enabled: false};
        plugin.afterDraw(chart);
        expect(chart.ctx.stroke).not.toHaveBeenCalled();
    });

    it("reads options lazily so styling updates without recreating the plugin", () => {
        let opts: VerticalLineOptions = {enabled: true, color: "red"};
        const plugin = createVerticalLinePlugin(() => opts);
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 60, y: 40}, changed: false});

        opts = {enabled: true, color: "green"};
        plugin.afterDraw(chart);
        expect(chart.ctx.strokeStyle).toBe("green");
    });
});
