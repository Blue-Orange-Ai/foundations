import {createVerticalLinePlugin, resolvePixelToValue, resolveValueToPixel} from "./VerticalLinePlugin";
import {VerticalLineOptions} from "../types/ChartTypes";

const makeChart = (scaleOverrides: any = {}) => ({
    chartArea: {left: 10, right: 190, top: 5, bottom: 95},
    scales: {
        x: {
            type: "linear",
            getValueForPixel: (px: number) => px * 10,
            getPixelForValue: (v: number) => v / 10,
            getLabels: () => ["Jan", "Feb", "Mar"],
            getLabelForValue: (v: number) => ["Jan", "Feb", "Mar"][v],
            ...scaleOverrides,
        },
    },
    ctx: {
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        setLineDash: vi.fn(),
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

describe("resolveValueToPixel / resolvePixelToValue", () => {
    it("converts values via the linear x scale", () => {
        const chart = makeChart();
        expect(resolveValueToPixel(chart, 100)).toBe(10);
        expect(resolvePixelToValue(chart, 6)).toBe(60);
    });

    it("maps category labels through their index", () => {
        const chart = makeChart({
            type: "category",
            getPixelForValue: (idx: number) => idx * 50,
        });
        expect(resolveValueToPixel(chart, "Feb")).toBe(50);
    });

    it("returns the label (not the index) for category pixel lookups", () => {
        const chart = makeChart({
            type: "category",
            getValueForPixel: () => 2,
        });
        expect(resolvePixelToValue(chart, 123)).toBe("Mar");
    });

    it("returns null when there is no x scale", () => {
        expect(resolveValueToPixel({}, 5)).toBeNull();
        expect(resolvePixelToValue({}, 5)).toBeNull();
    });

    it("returns null for a NaN pixel result", () => {
        const chart = makeChart({getPixelForValue: () => NaN});
        expect(resolveValueToPixel(chart, 5)).toBeNull();
    });
});

describe("createVerticalLinePlugin - onCursorMove callback", () => {
    it("reports the resolved data value while moving inside the chart", () => {
        const onCursorMove = vi.fn();
        const plugin = createVerticalLinePlugin(() => ({enabled: true, onCursorMove}));
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 60, y: 40}, changed: false});
        expect(onCursorMove).toHaveBeenCalledWith({x: 600, pixelX: 60});
    });

    it("reports null once when the cursor leaves the chart area", () => {
        const onCursorMove = vi.fn();
        const plugin = createVerticalLinePlugin(() => ({enabled: true, onCursorMove}));
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 60, y: 40}, changed: false});
        onCursorMove.mockClear();

        // Move outside the chart area (x below left bound).
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 2, y: 40}, changed: false});
        expect(onCursorMove).toHaveBeenCalledWith(null);
        // A second outside move should not re-report null.
        onCursorMove.mockClear();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 1, y: 40}, changed: false});
        expect(onCursorMove).not.toHaveBeenCalled();
    });

    it("reports null on mouseout", () => {
        const onCursorMove = vi.fn();
        const plugin = createVerticalLinePlugin(() => ({enabled: true, onCursorMove}));
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 60, y: 40}, changed: false});
        onCursorMove.mockClear();
        plugin.afterEvent(chart, {event: {type: "mouseout"}, changed: false});
        expect(onCursorMove).toHaveBeenCalledWith(null);
    });

    it("still fires the callback when the line itself is disabled", () => {
        const onCursorMove = vi.fn();
        const plugin = createVerticalLinePlugin(() => ({enabled: false, onCursorMove}));
        const chart = makeChart();
        const args: any = {event: {type: "mousemove", x: 60, y: 40}, changed: false};
        plugin.afterEvent(chart, args);
        expect(onCursorMove).toHaveBeenCalledWith({x: 600, pixelX: 60});
        // But it does not force a redraw when the line is off.
        expect(args.changed).toBe(false);
    });
});

describe("createVerticalLinePlugin - external (synchronised) value", () => {
    it("draws at the external value's pixel when not hovering", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true, externalValue: 800}));
        const chart = makeChart(); // getPixelForValue(v) = v/10 => 80
        plugin.afterDraw(chart);
        expect(chart.ctx.moveTo).toHaveBeenCalledWith(80, 5);
        expect(chart.ctx.lineTo).toHaveBeenCalledWith(80, 95);
    });

    it("prefers the live hover position over the external value", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true, externalValue: 800}));
        const chart = makeChart();
        plugin.afterEvent(chart, {event: {type: "mousemove", x: 30, y: 40}, changed: false});
        plugin.afterDraw(chart);
        // Uses the hovered pixel (30), not the external value pixel (80).
        expect(chart.ctx.moveTo).toHaveBeenCalledWith(30, 5);
    });

    it("does not draw when neither hovering nor an external value is set", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true}));
        const chart = makeChart();
        plugin.afterDraw(chart);
        expect(chart.ctx.stroke).not.toHaveBeenCalled();
    });

    it("clamps the external value line to the chart area", () => {
        const plugin = createVerticalLinePlugin(() => ({enabled: true, externalValue: 9000}));
        const chart = makeChart(); // pixel would be 900, clamped to right=190
        plugin.afterDraw(chart);
        expect(chart.ctx.moveTo).toHaveBeenCalledWith(190, 5);
    });
});
