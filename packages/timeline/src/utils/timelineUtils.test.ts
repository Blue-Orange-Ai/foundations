import {
    allKeyframes,
    clamp,
    defaultDateFormatter,
    defaultUnitFormatter,
    eventsBounds,
    generateTicks,
    groupBounds,
    majorStep,
    majorTimeStep,
    modeAllowsSelection,
    modeIsAbsolute,
    modelMaxVal,
    modePansOnEmptyDrag,
    niceStep,
    niceTimeStep,
    pxToVal,
    resolveKeyframeStyle,
    rowLayout,
    snapValue,
    valToPx,
} from './timelineUtils';
import {
    ITimelineModel,
    ITimelineRow,
    TimelineInteractionMode,
    TimelineKeyframeShape,
    TimelineTimeMode,
} from '../interfaces/TimelineInterfaces';

describe('clamp', () => {
    it('bounds a value to the range', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-1, 0, 10)).toBe(0);
        expect(clamp(11, 0, 10)).toBe(10);
    });
    it('returns the value untouched when min > max', () => {
        expect(clamp(5, 10, 0)).toBe(5);
    });
});

describe('niceStep', () => {
    it('rounds up to 1/2/5 * 10^n', () => {
        expect(niceStep(1)).toBe(1);
        expect(niceStep(1.5)).toBe(2);
        expect(niceStep(3)).toBe(5);
        expect(niceStep(6)).toBe(10);
        expect(niceStep(230)).toBe(500);
    });
    it('guards against non-positive input', () => {
        expect(niceStep(0)).toBe(1);
        expect(niceStep(-5)).toBe(1);
    });
});

describe('majorStep', () => {
    it('produces a nice step near stepPx * zoom', () => {
        expect(majorStep(1, 120)).toBe(niceStep(120));
        expect(majorStep(10, 120)).toBe(niceStep(1200));
    });
});

describe('generateTicks', () => {
    it('produces ticks aligned to the step', () => {
        expect(generateTicks(0, 500, 100)).toEqual([0, 100, 200, 300, 400, 500]);
    });
    it('starts on the tick at or before startVal', () => {
        expect(generateTicks(150, 400, 100)).toEqual([100, 200, 300, 400]);
    });
    it('returns nothing for invalid input', () => {
        expect(generateTicks(0, 100, 0)).toEqual([]);
        expect(generateTicks(100, 0, 10)).toEqual([]);
    });
});

describe('snapValue', () => {
    it('snaps to the nearest multiple when enabled', () => {
        expect(snapValue(127, 50, true)).toBe(150);
        expect(snapValue(124, 50, true)).toBe(100);
    });
    it('is a no-op when disabled or step invalid', () => {
        expect(snapValue(127, 50, false)).toBe(127);
        expect(snapValue(127, 0, true)).toBe(127);
    });
});

describe('valToPx / pxToVal', () => {
    it('round-trips', () => {
        const zoom = 2;
        const lm = 18;
        const min = 0;
        const val = 1234;
        const px = valToPx(val, zoom, lm, min);
        expect(pxToVal(px, zoom, lm, min)).toBeCloseTo(val, 6);
    });
    it('honours the left margin and min offset', () => {
        expect(valToPx(0, 1, 18, 0)).toBe(18);
        expect(valToPx(100, 1, 18, 100)).toBe(18);
    });
});

describe('rowLayout', () => {
    const model: ITimelineModel = {
        rows: [{ height: 20 }, { hidden: true }, { height: 30 }],
    };
    it('stacks visible rows and skips hidden ones', () => {
        const layout = rowLayout(model, { rowsStyle: { height: 24, marginBottom: 2 } });
        expect(layout.offsets[0]).toBe(0);
        // Hidden row contributes no height, so the third row follows the first.
        expect(layout.offsets[2]).toBe(22);
        expect(layout.heights[1]).toBe(0);
        expect(layout.total).toBe(20 + 2 + 30 + 2);
    });
});

describe('modelMaxVal / allKeyframes', () => {
    const model: ITimelineModel = {
        rows: [
            { keyframes: [{ val: 100 }, { val: 900 }] },
            { keyframes: [{ val: 500 }] },
            {},
        ],
    };
    it('finds the largest keyframe value', () => {
        expect(modelMaxVal(model)).toBe(900);
    });
    it('flattens all keyframes', () => {
        expect(allKeyframes(model).map((k) => k.val)).toEqual([100, 900, 500]);
    });
});

describe('groupBounds', () => {
    const row: ITimelineRow = {
        keyframes: [
            { val: 200, group: 'a' },
            { val: 800, group: 'a' },
            { val: 500 },
        ],
    };
    it('returns the min/max of a group', () => {
        const bounds = groupBounds(row, 'a');
        expect(bounds).not.toBeNull();
        expect(bounds!.min).toBe(200);
        expect(bounds!.max).toBe(800);
        expect(bounds!.keyframes).toHaveLength(2);
    });
    it('returns null for an unknown group', () => {
        expect(groupBounds(row, 'zzz')).toBeNull();
    });
});

describe('resolveKeyframeStyle', () => {
    const theme = { keyframe: '#kf', keyframeSelected: '#sel', keyframeStroke: '#stroke' };
    it('walks the cascade keyframe -> row -> options -> theme', () => {
        const row: ITimelineRow = { style: { keyframesStyle: { size: 8 } } };
        const style = resolveKeyframeStyle(
            { val: 0 },
            row,
            { keyframesStyle: { shape: TimelineKeyframeShape.CIRCLE, size: 6 } },
            theme
        );
        expect(style.size).toBe(8); // row wins over options
        expect(style.shape).toBe(TimelineKeyframeShape.CIRCLE); // from options
        expect(style.fillColor).toBe('#kf'); // from theme
    });
    it('lets the keyframe override everything', () => {
        const style = resolveKeyframeStyle(
            { val: 0, style: { fillColor: '#custom', shape: TimelineKeyframeShape.RECT } },
            {},
            {},
            theme
        );
        expect(style.fillColor).toBe('#custom');
        expect(style.shape).toBe(TimelineKeyframeShape.RECT);
    });
});

describe('defaultUnitFormatter', () => {
    it('shows sub-second precision for fine steps', () => {
        expect(defaultUnitFormatter(1500, 250)).toBe('1.5s');
    });
    it('shows whole seconds for second-scale steps', () => {
        expect(defaultUnitFormatter(3000, 1000)).toBe('3s');
    });
    it('switches to m:ss for large values', () => {
        expect(defaultUnitFormatter(65000, 5000)).toBe('1:05');
    });
});

describe('niceTimeStep', () => {
    it('snaps up to clean time boundaries', () => {
        expect(niceTimeStep(900)).toBe(1000); // ~1s
        expect(niceTimeStep(45000)).toBe(60000); // 1 min
        expect(niceTimeStep(50 * 60000)).toBe(3600000); // 1 hour
        expect(niceTimeStep(20 * 3600000)).toBe(86400000); // 1 day
    });
    it('falls back to whole-year multiples beyond a year', () => {
        expect(niceTimeStep(1.5 * 31536000000)).toBe(2 * 31536000000);
    });
    it('guards against non-positive input', () => {
        expect(niceTimeStep(0)).toBe(1);
        expect(niceTimeStep(-10)).toBe(1);
    });
});

describe('majorTimeStep', () => {
    it('produces a nice duration near stepPx * zoom', () => {
        expect(majorTimeStep(1000, 60)).toBe(niceTimeStep(60000));
    });
});

describe('defaultDateFormatter', () => {
    // Constructed in local time and formatted in local time, so the assertions
    // hold in any timezone.
    const t = new Date(2021, 2, 4, 9, 5, 30, 120).getTime();
    it('shows milliseconds for sub-second steps', () => {
        expect(defaultDateFormatter(t, 100)).toBe('09:05:30.120');
    });
    it('shows clock time for second / minute steps', () => {
        expect(defaultDateFormatter(t, 1000)).toBe('09:05:30');
        expect(defaultDateFormatter(t, 60000)).toBe('09:05');
    });
    it('shows the date for day-scale steps', () => {
        expect(defaultDateFormatter(t, 86400000)).toBe('Mar 4');
    });
    it('shows month/year then year for coarse steps', () => {
        expect(defaultDateFormatter(t, 2592000000)).toBe('Mar 2021');
        expect(defaultDateFormatter(t, 31536000000)).toBe('2021');
    });
});

describe('eventsBounds', () => {
    const model: ITimelineModel = {
        rows: [{ keyframes: [{ val: 100 }, { val: 900 }] }, { keyframes: [{ val: 500 }] }, {}],
    };
    it('spans every event', () => {
        expect(eventsBounds(model)).toEqual({ min: 100, max: 900 });
    });
    it('limits to events at or before a cutoff', () => {
        expect(eventsBounds(model, 500)).toEqual({ min: 100, max: 500 });
    });
    it('returns null when nothing qualifies', () => {
        expect(eventsBounds(model, 50)).toBeNull();
        expect(eventsBounds({ rows: [{}] })).toBeNull();
    });
});

describe('modeIsAbsolute', () => {
    it('is true only for the ABSOLUTE mode', () => {
        expect(modeIsAbsolute(TimelineTimeMode.ABSOLUTE)).toBe(true);
        expect(modeIsAbsolute(TimelineTimeMode.RELATIVE)).toBe(false);
        expect(modeIsAbsolute(undefined)).toBe(false);
    });
});

describe('mode helpers', () => {
    it('identifies selection-capable modes', () => {
        expect(modeAllowsSelection(TimelineInteractionMode.SELECTION)).toBe(true);
        expect(modeAllowsSelection(TimelineInteractionMode.PAN)).toBe(true);
        expect(modeAllowsSelection(TimelineInteractionMode.ZOOM)).toBe(false);
    });
    it('identifies pan-on-empty-drag modes', () => {
        expect(modePansOnEmptyDrag(TimelineInteractionMode.PAN)).toBe(true);
        expect(modePansOnEmptyDrag(TimelineInteractionMode.NON_INTERACTIVE_PAN)).toBe(true);
        expect(modePansOnEmptyDrag(TimelineInteractionMode.SELECTION)).toBe(false);
    });
});
