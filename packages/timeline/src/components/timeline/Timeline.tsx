import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useRef,
} from 'react';
import './Timeline.css';
import {
    ITimelineContextMenuEvent,
    ITimelineDragEvent,
    ITimelineGroup,
    ITimelineKeyframe,
    ITimelineModel,
    ITimelineOptions,
    ITimelineRow,
    ITimelineScrollEvent,
    ITimelineSelectedEvent,
    ITimelineTimeChangedEvent,
    TimelineElementType,
    TimelineInteractionMode,
    TimelineKeyframeShape,
} from '../../interfaces/TimelineInterfaces';
import {
    allKeyframes,
    clamp,
    DEFAULT_TIMELINE_OPTIONS,
    defaultUnitFormatter,
    generateTicks,
    groupBounds,
    majorStep,
    modelMaxVal,
    modeAllowsSelection,
    modePansOnEmptyDrag,
    pxToVal,
    resolveKeyframeStyle,
    resolveTheme,
    rowLayout,
    snapValue,
    valToPx,
} from '../../utils/timelineUtils';

/**
 * Imperative handle exposed through a ref, mirroring the small control surface
 * of animation-timeline-control. Lets a parent drive the view without owning
 * every piece of state.
 */
export interface TimelineHandle {
    setTime: (val: number) => void;
    getTime: () => number;
    getModel: () => ITimelineModel;
    setZoom: (zoom: number) => void;
    getZoom: () => number;
    /** Zoom by a factor around the centre of the viewport. */
    zoomBy: (factor: number) => void;
    zoomToFit: () => void;
    setInteractionMode: (mode: TimelineInteractionMode) => void;
    selectAll: () => void;
    deselectAll: () => void;
    getSelected: () => ITimelineKeyframe[];
    /** Scroll so the given value is visible / centred. */
    scrollToVal: (val: number) => void;
    redraw: () => void;
}

export interface TimelineProps {
    model: ITimelineModel;
    options?: ITimelineOptions;
    /** Controlled current time (units). Uncontrolled if omitted. */
    time?: number;
    /** Convenience override for `options.interactionMode`. */
    interactionMode?: TimelineInteractionMode;
    /** Render with the dark palette. */
    dark?: boolean;
    /** Force the left labels column on/off. Auto-on when any row has a title. */
    showLabels?: boolean;
    className?: string;
    style?: React.CSSProperties;

    /** Fired after a drag mutates keyframe values, with the updated model. */
    onModelChange?: (model: ITimelineModel) => void;
    onTimeChanged?: (event: ITimelineTimeChangedEvent) => void;
    onSelected?: (event: ITimelineSelectedEvent) => void;
    onScroll?: (event: ITimelineScrollEvent) => void;
    onDragStarted?: (event: ITimelineDragEvent) => void;
    onDrag?: (event: ITimelineDragEvent) => void;
    onDragFinished?: (event: ITimelineDragEvent) => void;
    onKeyframeChanged?: (keyframe: ITimelineKeyframe) => void;
    onContextMenu?: (event: ITimelineContextMenuEvent) => void;
}

/** Deep-ish clone so interactive edits never mutate the caller's objects. */
const cloneModel = (model: ITimelineModel): ITimelineModel => ({
    rows: (model.rows ?? []).map((row) => ({
        ...row,
        keyframes: row.keyframes ? row.keyframes.map((k) => ({ ...k })) : undefined,
        groups: row.groups ? row.groups.map((g) => ({ ...g })) : undefined,
    })),
});

interface DragState {
    target: TimelineElementType;
    /** Pointer value on the axis when the drag began. */
    startVal: number;
    /** Keyframes being moved, paired with their value at drag start. */
    moving: { keyframe: ITimelineKeyframe; startVal: number }[];
    group?: ITimelineGroup;
    row?: ITimelineRow;
    /** Whether any movement has happened (to distinguish click vs drag). */
    moved: boolean;
    lastDelta: number;
}

interface PanState {
    startX: number;
    startY: number;
    startScrollLeft: number;
    startScrollTop: number;
}

interface RectState {
    startContentX: number;
    startContentY: number;
    curContentX: number;
    curContentY: number;
    additive: boolean;
}

/**
 * A fast, canvas-rendered timeline / keyframe editor closely modelled on
 * [animation-timeline-control](https://github.com/ievgennaida/animation-timeline-control):
 * a horizontally-scrolling ruler over stacked tracks of draggable keyframes,
 * with grouped keyframe ranges, a draggable time cursor, rubber-band multi
 * selection, snap, and zoom / pan interaction modes. Only the visible area is
 * drawn, so large models stay responsive.
 *
 * The control keeps its own working copy of the model, mutating keyframe values
 * during a drag and reporting the result through `onDrag` / `onModelChange`.
 */
export const Timeline = forwardRef<TimelineHandle, TimelineProps>((props, ref) => {
    const {
        model,
        options: optionsProp,
        time: timeProp,
        interactionMode: interactionModeProp,
        dark = false,
        showLabels: showLabelsProp,
        className,
        style,
    } = props;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const spacerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const labelsListRef = useRef<HTMLDivElement | null>(null);

    // Merge caller options over the defaults once per change.
    const options = useMemo<ITimelineOptions>(
        () => ({ ...DEFAULT_TIMELINE_OPTIONS, ...optionsProp }),
        [optionsProp]
    );

    const resolvedMode = interactionModeProp ?? options.interactionMode ?? TimelineInteractionMode.SELECTION;

    // Everything the imperative render/interaction code needs lives on this ref
    // so handlers never close over stale React state.
    const ctx = useRef({
        model: cloneModel(model),
        options,
        mode: resolvedMode,
        dark,
        zoom: options.zoom ?? 1,
        time: timeProp ?? 0,
        scrollLeft: 0,
        scrollTop: 0,
        drag: null as DragState | null,
        pan: null as PanState | null,
        rect: null as RectState | null,
        draggingTime: false,
        rafId: 0,
        // Latest callbacks, refreshed every render.
        props: props,
    });

    // Keep the mutable context in sync with incoming props each render.
    ctx.current.props = props;
    ctx.current.options = options;
    ctx.current.mode = resolvedMode;
    ctx.current.dark = dark;

    // Re-clone the working model whenever the caller swaps the model reference.
    const lastModelProp = useRef<ITimelineModel | null>(null);
    if (lastModelProp.current !== model) {
        lastModelProp.current = model;
        ctx.current.model = cloneModel(model);
    }

    // Sync the controlled time when the caller changes it.
    const lastTimeProp = useRef<number | undefined>(undefined);
    if (timeProp !== undefined && timeProp !== lastTimeProp.current) {
        lastTimeProp.current = timeProp;
        ctx.current.time = timeProp;
    }

    const showLabels = useMemo(() => {
        if (showLabelsProp !== undefined) {
            return showLabelsProp;
        }
        return model.rows.some((r) => r.title !== undefined && r.title !== '');
    }, [showLabelsProp, model]);

    const labelsWidth = showLabels ? options.labelsWidth || 160 : 0;

    // ---- geometry helpers (read live values off ctx) ------------------------

    const getMin = () => ctx.current.options.min ?? 0;
    const getMaxVal = () => {
        const opt = ctx.current.options.max;
        if (opt !== undefined) {
            return opt;
        }
        return Math.max(modelMaxVal(ctx.current.model), getMin() + 1);
    };
    const getLeftMargin = () => ctx.current.options.leftMargin ?? DEFAULT_TIMELINE_OPTIONS.leftMargin;
    const getHeaderHeight = () =>
        ctx.current.options.headerHeight ?? DEFAULT_TIMELINE_OPTIONS.headerHeight;

    const virtualWidth = () => {
        const zoom = ctx.current.zoom;
        const lm = getLeftMargin();
        const w = valToPx(getMaxVal(), zoom, lm, getMin()) + lm;
        const viewport = scrollRef.current?.clientWidth ?? 0;
        return Math.max(w, viewport);
    };
    const virtualHeight = () => {
        const layout = rowLayout(ctx.current.model, ctx.current.options);
        const h = getHeaderHeight() + layout.total + getHeaderHeight();
        const viewport = scrollRef.current?.clientHeight ?? 0;
        return Math.max(h, viewport);
    };

    // ---- drawing ------------------------------------------------------------

    const applyLayout = useCallback(() => {
        const spacer = spacerRef.current;
        if (spacer) {
            spacer.style.width = `${virtualWidth()}px`;
            spacer.style.height = `${virtualHeight()}px`;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const scroll = scrollRef.current;
        if (!canvas || !scroll) {
            return;
        }
        const c = ctx.current;
        const viewportW = scroll.clientWidth;
        const viewportH = scroll.clientHeight;
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

        if (canvas.width !== Math.round(viewportW * dpr) || canvas.height !== Math.round(viewportH * dpr)) {
            canvas.width = Math.round(viewportW * dpr);
            canvas.height = Math.round(viewportH * dpr);
            canvas.style.width = `${viewportW}px`;
            canvas.style.height = `${viewportH}px`;
        }
        canvas.style.transform = `translate(${c.scrollLeft}px, ${c.scrollTop}px)`;

        const g = canvas.getContext('2d');
        if (!g) {
            return;
        }
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, viewportW, viewportH);

        const theme = resolveTheme(rootRef.current, c.dark, c.options.colors);
        const zoom = c.zoom;
        const min = getMin();
        const lm = getLeftMargin();
        const headerH = getHeaderHeight();
        const scrollLeft = c.scrollLeft;
        const scrollTop = c.scrollTop;

        // Background
        g.fillStyle = theme.background;
        g.fillRect(0, 0, viewportW, viewportH);

        // --- rows -----------------------------------------------------------
        const layout = rowLayout(c.model, c.options);
        for (let i = 0; i < c.model.rows.length; i++) {
            const row = c.model.rows[i];
            if (row.hidden) {
                continue;
            }
            const rowTop = headerH + layout.offsets[i] - scrollTop;
            const h = layout.heights[i];
            if (rowTop + h < headerH || rowTop > viewportH) {
                continue; // virtualised: off-screen row
            }
            g.fillStyle =
                row.style?.backgroundColor ??
                (i % 2 === 0 ? theme.rowBackground : theme.rowAltBackground);
            g.fillRect(0, rowTop, viewportW, h);
            // Row separator
            g.strokeStyle = theme.border;
            g.lineWidth = 1;
            g.beginPath();
            g.moveTo(0, Math.round(rowTop + h) + 0.5);
            g.lineTo(viewportW, Math.round(rowTop + h) + 0.5);
            g.stroke();
        }

        // --- vertical grid lines (align to ruler ticks) ---------------------
        const step = majorStep(zoom, c.options.stepPx ?? DEFAULT_TIMELINE_OPTIONS.stepPx);
        const startVal = pxToVal(scrollLeft, zoom, lm, min);
        const endVal = pxToVal(scrollLeft + viewportW, zoom, lm, min);
        const ticks = generateTicks(startVal, endVal, step);
        g.strokeStyle = theme.tick;
        g.lineWidth = 1;
        for (let t = 0; t < ticks.length; t++) {
            const x = Math.round(valToPx(ticks[t], zoom, lm, min) - scrollLeft) + 0.5;
            g.beginPath();
            g.moveTo(x, headerH);
            g.lineTo(x, viewportH);
            g.stroke();
        }

        // --- groups (connecting bars) + keyframes ---------------------------
        for (let i = 0; i < c.model.rows.length; i++) {
            const row = c.model.rows[i];
            if (row.hidden) {
                continue;
            }
            const rowTop = headerH + layout.offsets[i] - scrollTop;
            const h = layout.heights[i];
            if (rowTop + h < headerH || rowTop > viewportH) {
                continue;
            }
            const centerY = rowTop + h / 2;

            // Group bars first, so keyframes render on top.
            const seenGroups: Record<string, boolean> = {};
            const kfs = row.keyframes ?? [];
            for (let k = 0; k < kfs.length; k++) {
                const gid = kfs[k].group;
                if (!gid || seenGroups[gid]) {
                    continue;
                }
                seenGroups[gid] = true;
                const bounds = groupBounds(row, gid);
                if (!bounds || bounds.min === bounds.max) {
                    continue;
                }
                const x1 = valToPx(bounds.min, zoom, lm, min) - scrollLeft;
                const x2 = valToPx(bounds.max, zoom, lm, min) - scrollLeft;
                const barH = Math.min(h - 8, 12);
                const groupObj = (row.groups ?? []).find((gg) => gg.id === gid);
                g.fillStyle = groupObj?.style?.fillColor ?? theme.group;
                const radius = Math.min(barH / 2, 6);
                roundRect(g, x1, centerY - barH / 2, x2 - x1, barH, radius);
                g.fill();
            }

            // Keyframes
            for (let k = 0; k < kfs.length; k++) {
                const kf = kfs[k];
                const x = valToPx(kf.val, zoom, lm, min) - scrollLeft;
                if (x < -20 || x > viewportW + 20) {
                    continue; // virtualised horizontally
                }
                const ks = resolveKeyframeStyle(kf, row, c.options, theme);
                g.fillStyle = kf.selected ? ks.selectedFillColor : ks.fillColor;
                g.strokeStyle = ks.strokeColor;
                g.lineWidth = kf.selected ? 2 : 1;
                drawKeyframe(g, x, centerY, ks.size, ks.shape);
                g.fill();
                g.stroke();
            }
        }

        // --- header / ruler -------------------------------------------------
        g.fillStyle = theme.headerBackground;
        g.fillRect(0, 0, viewportW, headerH);
        g.strokeStyle = theme.border;
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(0, headerH + 0.5);
        g.lineTo(viewportW, headerH + 0.5);
        g.stroke();

        const formatter = c.options.unitFormatter ?? defaultUnitFormatter;
        g.fillStyle = theme.label;
        g.strokeStyle = theme.tick;
        g.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        g.textBaseline = 'alphabetic';
        for (let t = 0; t < ticks.length; t++) {
            const x = Math.round(valToPx(ticks[t], zoom, lm, min) - scrollLeft) + 0.5;
            g.beginPath();
            g.moveTo(x, headerH - 6);
            g.lineTo(x, headerH);
            g.stroke();
            const label = formatter(ticks[t], step);
            g.textAlign = 'left';
            g.fillText(label, x + 3, headerH - 9);
            // Minor sub-ticks (quarter steps) for finer read-off.
            for (let s = 1; s < 4; s++) {
                const subX = Math.round(valToPx(ticks[t] + (step * s) / 4, zoom, lm, min) - scrollLeft) + 0.5;
                g.beginPath();
                g.moveTo(subX, headerH - 3);
                g.lineTo(subX, headerH);
                g.stroke();
            }
        }

        // --- time cursor ----------------------------------------------------
        const cursorX = valToPx(c.time, zoom, lm, min) - scrollLeft;
        if (cursorX >= -8 && cursorX <= viewportW + 8) {
            g.strokeStyle = theme.cursor;
            g.fillStyle = theme.cursor;
            g.lineWidth = 1;
            g.beginPath();
            g.moveTo(Math.round(cursorX) + 0.5, headerH);
            g.lineTo(Math.round(cursorX) + 0.5, viewportH);
            g.stroke();
            // Handle in the header
            g.beginPath();
            g.moveTo(cursorX - 5, 2);
            g.lineTo(cursorX + 5, 2);
            g.lineTo(cursorX + 5, headerH - 8);
            g.lineTo(cursorX, headerH - 2);
            g.lineTo(cursorX - 5, headerH - 8);
            g.closePath();
            g.fill();
        }

        // --- rubber-band selection rectangle --------------------------------
        if (c.rect) {
            const x1 = Math.min(c.rect.startContentX, c.rect.curContentX) - scrollLeft;
            const y1 = Math.min(c.rect.startContentY, c.rect.curContentY) - scrollTop;
            const x2 = Math.max(c.rect.startContentX, c.rect.curContentX) - scrollLeft;
            const y2 = Math.max(c.rect.startContentY, c.rect.curContentY) - scrollTop;
            g.fillStyle = theme.selection;
            g.strokeStyle = theme.selectionBorder;
            g.lineWidth = 1;
            g.fillRect(x1, y1, x2 - x1, y2 - y1);
            g.strokeRect(x1 + 0.5, y1 + 0.5, x2 - x1, y2 - y1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const schedule = useCallback(() => {
        if (ctx.current.rafId) {
            return;
        }
        ctx.current.rafId = requestAnimationFrame(() => {
            ctx.current.rafId = 0;
            draw();
        });
    }, [draw]);

    const syncLabels = useCallback(() => {
        const list = labelsListRef.current;
        if (list) {
            list.style.transform = `translateY(${-ctx.current.scrollTop}px)`;
        }
    }, []);

    const refresh = useCallback(() => {
        applyLayout();
        syncLabels();
        schedule();
    }, [applyLayout, syncLabels, schedule]);

    // ---- hit-testing --------------------------------------------------------

    interface Hit {
        type: TimelineElementType;
        row?: ITimelineRow;
        rowIndex?: number;
        keyframe?: ITimelineKeyframe;
        group?: ITimelineGroup;
        groupId?: string;
    }

    const screenToContent = (clientX: number, clientY: number): { x: number; y: number } => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: clientX - rect.left + ctx.current.scrollLeft,
            y: clientY - rect.top + ctx.current.scrollTop,
        };
    };

    const hitTest = (clientX: number, clientY: number): Hit => {
        const c = ctx.current;
        const rect = canvasRef.current!.getBoundingClientRect();
        const screenY = clientY - rect.top;
        const headerH = getHeaderHeight();
        const zoom = c.zoom;
        const min = getMin();
        const lm = getLeftMargin();
        const content = screenToContent(clientX, clientY);

        if (screenY <= headerH) {
            return { type: TimelineElementType.TIMELINE };
        }

        const layout = rowLayout(c.model, c.options);
        const contentRowY = content.y - headerH;
        for (let i = 0; i < c.model.rows.length; i++) {
            const row = c.model.rows[i];
            if (row.hidden) {
                continue;
            }
            const top = layout.offsets[i];
            const h = layout.heights[i];
            if (contentRowY < top || contentRowY > top + h) {
                continue;
            }
            const centerContentX = content.x;
            // Keyframe hit (search nearest within tolerance).
            const kfs = row.keyframes ?? [];
            let best: ITimelineKeyframe | undefined;
            let bestDist = Infinity;
            for (let k = 0; k < kfs.length; k++) {
                const kfX = valToPx(kfs[k].val, zoom, lm, min);
                const dist = Math.abs(kfX - centerContentX);
                const ks = resolveKeyframeStyle(kfs[k], row, c.options, {
                    keyframe: '',
                    keyframeSelected: '',
                    keyframeStroke: '',
                });
                if (dist <= ks.size + 4 && dist < bestDist) {
                    best = kfs[k];
                    bestDist = dist;
                }
            }
            if (best) {
                return { type: TimelineElementType.KEYFRAME, row, rowIndex: i, keyframe: best };
            }
            // Group bar hit.
            const seen: Record<string, boolean> = {};
            for (let k = 0; k < kfs.length; k++) {
                const gid = kfs[k].group;
                if (!gid || seen[gid]) {
                    continue;
                }
                seen[gid] = true;
                const bounds = groupBounds(row, gid);
                if (!bounds || bounds.min === bounds.max) {
                    continue;
                }
                const gx1 = valToPx(bounds.min, zoom, lm, min);
                const gx2 = valToPx(bounds.max, zoom, lm, min);
                if (centerContentX >= gx1 && centerContentX <= gx2) {
                    const group = (row.groups ?? []).find((gg) => gg.id === gid);
                    return { type: TimelineElementType.GROUP, row, rowIndex: i, group, groupId: gid };
                }
            }
            return { type: TimelineElementType.ROW, row, rowIndex: i };
        }
        return { type: TimelineElementType.ROW };
    };

    // ---- selection ----------------------------------------------------------

    const emitSelected = (changed: ITimelineKeyframe[]) => {
        const cb = ctx.current.props.onSelected;
        if (cb) {
            cb({ selected: allKeyframes(ctx.current.model).filter((k) => k.selected), changed });
        }
    };

    const setSelection = (target: ITimelineKeyframe | null, additive: boolean) => {
        const changed: ITimelineKeyframe[] = [];
        const kfs = allKeyframes(ctx.current.model);
        for (let i = 0; i < kfs.length; i++) {
            const kf = kfs[i];
            const selectable = kf.selectable !== false;
            let next = kf.selected;
            if (target && kf === target) {
                next = additive ? !kf.selected : true;
                if (!selectable) {
                    next = kf.selected;
                }
            } else if (!additive) {
                next = false;
            }
            if (next !== kf.selected) {
                kf.selected = next;
                changed.push(kf);
            }
        }
        if (changed.length) {
            emitSelected(changed);
        }
    };

    // ---- interaction handlers ----------------------------------------------

    const beginTimeDrag = (clientX: number) => {
        if (ctx.current.options.timelineDraggable === false) {
            return;
        }
        ctx.current.draggingTime = true;
        updateTimeFromPointer(clientX);
    };

    const updateTimeFromPointer = (clientX: number) => {
        const c = ctx.current;
        const content = screenToContent(clientX, 0);
        let val = pxToVal(content.x, c.zoom, getLeftMargin(), getMin());
        val = snapValue(val, c.options.snapStep ?? 0, !!c.options.snapEnabled);
        val = clamp(val, getMin(), getMaxVal());
        c.time = val;
        if (c.props.onTimeChanged) {
            c.props.onTimeChanged({ val, source: 'user' });
        }
        schedule();
    };

    const beginKeyframeDrag = (hit: Hit, additive: boolean) => {
        const c = ctx.current;
        const kf = hit.keyframe!;
        // Update selection: clicking an unselected keyframe selects it.
        if (!kf.selected && !additive) {
            setSelection(kf, false);
        } else if (additive) {
            setSelection(kf, true);
        }
        const draggable =
            c.options.keyframesDraggable !== false && kf.draggable !== false && kf.selectable !== false;
        if (!draggable) {
            schedule();
            return;
        }
        const selected = allKeyframes(c.model).filter((k) => k.selected && k.draggable !== false);
        const moving = (selected.length ? selected : [kf]).map((k) => ({ keyframe: k, startVal: k.val }));
        c.drag = {
            target: TimelineElementType.KEYFRAME,
            startVal: hit.keyframe!.val,
            moving,
            row: hit.row,
            moved: false,
            lastDelta: 0,
        };
    };

    const beginGroupDrag = (hit: Hit) => {
        const c = ctx.current;
        if (c.options.groupsDraggable === false) {
            return;
        }
        const bounds = groupBounds(hit.row!, hit.groupId!);
        if (!bounds) {
            return;
        }
        const moving = bounds.keyframes.map((k) => ({ keyframe: k, startVal: k.val }));
        // Select all keyframes of the group.
        const changed: ITimelineKeyframe[] = [];
        allKeyframes(c.model).forEach((k) => {
            const next = bounds.keyframes.indexOf(k) >= 0;
            if (next !== k.selected) {
                k.selected = next;
                changed.push(k);
            }
        });
        if (changed.length) {
            emitSelected(changed);
        }
        c.drag = {
            target: TimelineElementType.GROUP,
            startVal: bounds.min,
            moving,
            group: hit.group,
            row: hit.row,
            moved: false,
            lastDelta: 0,
        };
    };

    const onMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) {
            return;
        }
        const c = ctx.current;
        const mode = c.mode;
        const additive = e.ctrlKey || e.metaKey || e.shiftKey;
        canvasRef.current!.focus();

        if (mode === TimelineInteractionMode.NONE) {
            return;
        }

        // Full-canvas modes take precedence over what's under the pointer.
        if (mode === TimelineInteractionMode.ZOOM) {
            startZoomDrag(e);
            return;
        }
        if (mode === TimelineInteractionMode.NON_INTERACTIVE_PAN) {
            startPan(e);
            return;
        }

        const hit = hitTest(e.clientX, e.clientY);

        // Header: drag the time cursor.
        if (hit.type === TimelineElementType.TIMELINE) {
            beginTimeDrag(e.clientX);
            attachWindowListeners();
            return;
        }

        if (hit.type === TimelineElementType.KEYFRAME && modeAllowsSelection(mode)) {
            beginKeyframeDrag(hit, additive);
            attachWindowListeners();
            schedule();
            return;
        }
        if (hit.type === TimelineElementType.GROUP && modeAllowsSelection(mode)) {
            beginGroupDrag(hit);
            attachWindowListeners();
            schedule();
            return;
        }

        // Empty space.
        if (modePansOnEmptyDrag(mode)) {
            startPan(e);
            return;
        }
        // Selection mode: start a rubber-band and clear selection unless additive.
        if (!additive) {
            setSelection(null, false);
        }
        const content = screenToContent(e.clientX, e.clientY);
        c.rect = {
            startContentX: content.x,
            startContentY: content.y,
            curContentX: content.x,
            curContentY: content.y,
            additive,
        };
        attachWindowListeners();
        schedule();
    };

    const startPan = (e: MouseEvent) => {
        const scroll = scrollRef.current!;
        ctx.current.pan = {
            startX: e.clientX,
            startY: e.clientY,
            startScrollLeft: scroll.scrollLeft,
            startScrollTop: scroll.scrollTop,
        };
        attachWindowListeners();
    };

    const zoomDragRef = useRef<{ startX: number; startZoom: number; anchorVal: number } | null>(null);
    const startZoomDrag = (e: MouseEvent) => {
        const content = screenToContent(e.clientX, e.clientY);
        zoomDragRef.current = {
            startX: e.clientX,
            startZoom: ctx.current.zoom,
            anchorVal: pxToVal(content.x, ctx.current.zoom, getLeftMargin(), getMin()),
        };
        attachWindowListeners();
    };

    const applyZoom = (newZoom: number, anchorVal: number, anchorClientX: number) => {
        const c = ctx.current;
        const clamped = clamp(
            newZoom,
            c.options.zoomMin ?? DEFAULT_TIMELINE_OPTIONS.zoomMin,
            c.options.zoomMax ?? DEFAULT_TIMELINE_OPTIONS.zoomMax
        );
        c.zoom = clamped;
        applyLayout();
        // Keep anchorVal under the cursor: solve for the scrollLeft that places it there.
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const screenX = anchorClientX - rect.left;
        const desiredContentX = valToPx(anchorVal, clamped, getLeftMargin(), getMin());
        const scroll = scrollRef.current!;
        scroll.scrollLeft = clamp(desiredContentX - screenX, 0, Math.max(0, virtualWidth() - scroll.clientWidth));
        // scrollLeft change fires onScroll which updates ctx + redraws.
        schedule();
    };

    const onMouseMove = (e: MouseEvent) => {
        const c = ctx.current;

        if (c.draggingTime) {
            updateTimeFromPointer(e.clientX);
            return;
        }

        if (zoomDragRef.current) {
            const z = zoomDragRef.current;
            const dx = e.clientX - z.startX;
            const factor = Math.pow(1.01, -dx);
            applyZoom(z.startZoom * factor, z.anchorVal, z.startX);
            return;
        }

        if (c.pan) {
            const scroll = scrollRef.current!;
            scroll.scrollLeft = c.pan.startScrollLeft - (e.clientX - c.pan.startX);
            scroll.scrollTop = c.pan.startScrollTop - (e.clientY - c.pan.startY);
            return;
        }

        if (c.rect) {
            const content = screenToContent(e.clientX, e.clientY);
            c.rect.curContentX = content.x;
            c.rect.curContentY = content.y;
            updateRectSelection();
            schedule();
            return;
        }

        if (c.drag) {
            const content = screenToContent(e.clientX, e.clientY);
            const pointerVal = pxToVal(content.x, c.zoom, getLeftMargin(), getMin());
            let delta = pointerVal - c.drag.startVal;
            // Snap the delta so the anchored keyframe lands on the grid.
            if (c.options.snapEnabled && (c.options.snapStep ?? 0) > 0) {
                const anchorNew = snapValue(c.drag.startVal + delta, c.options.snapStep!, true);
                delta = anchorNew - c.drag.startVal;
            }
            if (delta !== c.drag.lastDelta) {
                c.drag.moved = true;
                c.drag.lastDelta = delta;
                for (let i = 0; i < c.drag.moving.length; i++) {
                    const m = c.drag.moving[i];
                    let v = m.startVal + delta;
                    const kfMin = m.keyframe.min ?? getMin();
                    const kfMax = m.keyframe.max ?? getMaxVal();
                    v = clamp(v, kfMin, kfMax);
                    m.keyframe.val = v;
                }
                const dragEvent: ITimelineDragEvent = {
                    keyframes: c.drag.moving.map((m) => m.keyframe),
                    group: c.drag.group,
                    target: c.drag.target,
                    val: pointerVal,
                    delta,
                };
                maybeFireDragStarted();
                if (c.props.onDrag) {
                    c.props.onDrag(dragEvent);
                }
                schedule();
            }
        }
    };

    const dragStartedFired = useRef(false);
    // Fire onDragStarted the first time real movement happens.
    const maybeFireDragStarted = () => {
        const c = ctx.current;
        if (c.drag && c.drag.moved && !dragStartedFired.current && c.props.onDragStarted) {
            dragStartedFired.current = true;
            c.props.onDragStarted({
                keyframes: c.drag.moving.map((m) => m.keyframe),
                group: c.drag.group,
                target: c.drag.target,
                val: c.drag.startVal + c.drag.lastDelta,
                delta: c.drag.lastDelta,
            });
        }
    };

    const updateRectSelection = () => {
        const c = ctx.current;
        if (!c.rect) {
            return;
        }
        const zoom = c.zoom;
        const min = getMin();
        const lm = getLeftMargin();
        const headerH = getHeaderHeight();
        const x1 = Math.min(c.rect.startContentX, c.rect.curContentX);
        const x2 = Math.max(c.rect.startContentX, c.rect.curContentX);
        const y1 = Math.min(c.rect.startContentY, c.rect.curContentY);
        const y2 = Math.max(c.rect.startContentY, c.rect.curContentY);
        const layout = rowLayout(c.model, c.options);
        const changed: ITimelineKeyframe[] = [];
        for (let i = 0; i < c.model.rows.length; i++) {
            const row = c.model.rows[i];
            if (row.hidden) {
                continue;
            }
            const rowTop = headerH + layout.offsets[i];
            const rowBottom = rowTop + layout.heights[i];
            const rowInY = rowBottom >= y1 && rowTop <= y2;
            const kfs = row.keyframes ?? [];
            for (let k = 0; k < kfs.length; k++) {
                const kf = kfs[k];
                const kfX = valToPx(kf.val, zoom, lm, min);
                const inRect = rowInY && kfX >= x1 && kfX <= x2 && kf.selectable !== false;
                const next = inRect ? true : c.rect.additive ? kf.selected : false;
                if (next !== kf.selected) {
                    kf.selected = next;
                    changed.push(kf);
                }
            }
        }
        if (changed.length) {
            emitSelected(changed);
        }
    };

    const onMouseUp = () => {
        const c = ctx.current;
        detachWindowListeners();

        if (c.draggingTime) {
            c.draggingTime = false;
        }
        if (zoomDragRef.current) {
            zoomDragRef.current = null;
        }
        if (c.pan) {
            c.pan = null;
        }
        if (c.rect) {
            c.rect = null;
            schedule();
        }
        if (c.drag) {
            const drag = c.drag;
            c.drag = null;
            if (drag.moved) {
                const dragEvent: ITimelineDragEvent = {
                    keyframes: drag.moving.map((m) => m.keyframe),
                    group: drag.group,
                    target: drag.target,
                    val: drag.startVal + drag.lastDelta,
                    delta: drag.lastDelta,
                };
                if (c.props.onDragFinished) {
                    c.props.onDragFinished(dragEvent);
                }
                if (c.props.onKeyframeChanged) {
                    drag.moving.forEach((m) => c.props.onKeyframeChanged!(m.keyframe));
                }
                if (c.props.onModelChange) {
                    c.props.onModelChange(c.model);
                }
            }
            dragStartedFired.current = false;
            schedule();
        }
    };

    const attachWindowListeners = () => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };
    const detachWindowListeners = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

    const onWheel = (e: WheelEvent) => {
        const c = ctx.current;
        if (c.mode === TimelineInteractionMode.ZOOM || e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const content = screenToContent(e.clientX, e.clientY);
            const anchorVal = pxToVal(content.x, c.zoom, getLeftMargin(), getMin());
            // Ctrl reverses direction, matching animation-timeline-control.
            const speed = c.options.zoomSpeed ?? DEFAULT_TIMELINE_OPTIONS.zoomSpeed;
            let direction = e.deltaY > 0 ? 1 : -1;
            if (e.ctrlKey && c.mode === TimelineInteractionMode.ZOOM) {
                direction = -direction;
            }
            const factor = 1 + direction * speed;
            applyZoom(c.zoom * factor, anchorVal, e.clientX);
        }
        // Otherwise let the scroll container handle wheel scrolling natively.
    };

    const onContextMenu = (e: MouseEvent) => {
        const c = ctx.current;
        if (!c.props.onContextMenu) {
            return;
        }
        const hit = hitTest(e.clientX, e.clientY);
        const content = screenToContent(e.clientX, e.clientY);
        const val = pxToVal(content.x, c.zoom, getLeftMargin(), getMin());
        c.props.onContextMenu({
            originalEvent: e as unknown as React.MouseEvent,
            val,
            target: hit.type,
            row: hit.row,
            keyframe: hit.keyframe,
        });
    };

    const onScrollEvent = () => {
        const scroll = scrollRef.current;
        if (!scroll) {
            return;
        }
        ctx.current.scrollLeft = scroll.scrollLeft;
        ctx.current.scrollTop = scroll.scrollTop;
        syncLabels();
        schedule();
        if (ctx.current.props.onScroll) {
            ctx.current.props.onScroll({
                scrollLeft: scroll.scrollLeft,
                scrollTop: scroll.scrollTop,
                zoom: ctx.current.zoom,
            });
        }
    };

    // ---- lifecycle ----------------------------------------------------------

    useLayoutEffect(() => {
        applyLayout();
        syncLabels();
        draw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const scroll = scrollRef.current;
        // `context` is the stable ctx ref object, safe to read in cleanup.
        const context = ctx.current;
        if (!canvas || !scroll) {
            return;
        }
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('wheel', onWheel, { passive: false });
        canvas.addEventListener('contextmenu', onContextMenu);
        scroll.addEventListener('scroll', onScrollEvent, { passive: true });

        let observer: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(() => {
                refresh();
            });
            observer.observe(scroll);
        }
        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('wheel', onWheel);
            canvas.removeEventListener('contextmenu', onContextMenu);
            scroll.removeEventListener('scroll', onScrollEvent);
            detachWindowListeners();
            if (observer) {
                observer.disconnect();
            }
            if (context.rafId) {
                cancelAnimationFrame(context.rafId);
                context.rafId = 0;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- imperative handle --------------------------------------------------

    useImperativeHandle(
        ref,
        (): TimelineHandle => ({
            setTime: (val: number) => {
                ctx.current.time = clamp(val, getMin(), getMaxVal());
                if (ctx.current.props.onTimeChanged) {
                    ctx.current.props.onTimeChanged({ val: ctx.current.time, source: 'setTime' });
                }
                schedule();
            },
            getTime: () => ctx.current.time,
            getModel: () => ctx.current.model,
            setZoom: (zoom: number) => {
                applyZoom(zoom, getMin(), canvasRef.current!.getBoundingClientRect().left);
            },
            getZoom: () => ctx.current.zoom,
            zoomBy: (factor: number) => {
                const scroll = scrollRef.current!;
                const rect = canvasRef.current!.getBoundingClientRect();
                const centerClientX = rect.left + scroll.clientWidth / 2;
                const content = screenToContent(centerClientX, 0);
                const anchorVal = pxToVal(content.x, ctx.current.zoom, getLeftMargin(), getMin());
                applyZoom(ctx.current.zoom * factor, anchorVal, centerClientX);
            },
            zoomToFit: () => {
                const scroll = scrollRef.current!;
                const range = getMaxVal() - getMin();
                if (range <= 0) {
                    return;
                }
                const usable = Math.max(1, scroll.clientWidth - 2 * getLeftMargin());
                applyZoom(range / usable, getMin(), canvasRef.current!.getBoundingClientRect().left);
                scroll.scrollLeft = 0;
            },
            setInteractionMode: (mode: TimelineInteractionMode) => {
                ctx.current.mode = mode;
            },
            selectAll: () => {
                const changed: ITimelineKeyframe[] = [];
                allKeyframes(ctx.current.model).forEach((k) => {
                    if (k.selectable !== false && !k.selected) {
                        k.selected = true;
                        changed.push(k);
                    }
                });
                if (changed.length) {
                    emitSelected(changed);
                }
                schedule();
            },
            deselectAll: () => {
                setSelection(null, false);
                schedule();
            },
            getSelected: () => allKeyframes(ctx.current.model).filter((k) => k.selected),
            scrollToVal: (val: number) => {
                const scroll = scrollRef.current!;
                const x = valToPx(val, ctx.current.zoom, getLeftMargin(), getMin());
                scroll.scrollLeft = clamp(
                    x - scroll.clientWidth / 2,
                    0,
                    Math.max(0, virtualWidth() - scroll.clientWidth)
                );
            },
            redraw: () => schedule(),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    );

    // ---- render -------------------------------------------------------------

    const headerH = getHeaderHeight();
    const rootClass = `blue-orange-timeline${dark ? ' blue-orange-timeline-dark' : ''}${
        className ? ' ' + className : ''
    }`;

    const layout = rowLayout(ctx.current.model, options);

    return (
        <div ref={rootRef} className={rootClass} style={style}>
            {showLabels && (
                <div className="blue-orange-timeline-labels" style={{ width: labelsWidth }}>
                    <div
                        className="blue-orange-timeline-labels-header"
                        style={{ height: headerH }}
                    />
                    <div
                        className="blue-orange-timeline-labels-viewport"
                        style={{ height: `calc(100% - ${headerH}px)` }}
                    >
                        <div ref={labelsListRef} className="blue-orange-timeline-labels-list">
                            {model.rows.map((row, i) =>
                                row.hidden ? null : (
                                    <div
                                        key={i}
                                        className="blue-orange-timeline-label no-select"
                                        style={{
                                            height: layout.heights[i],
                                            transform: `translateY(${layout.offsets[i]}px)`,
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                        }}
                                        title={row.title}
                                    >
                                        <span className="blue-orange-timeline-label-title">
                                            {row.title}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div ref={scrollRef} className="blue-orange-timeline-scroll" tabIndex={0}>
                <div ref={spacerRef} className="blue-orange-timeline-spacer" />
                <canvas ref={canvasRef} className="blue-orange-timeline-canvas" tabIndex={0} />
            </div>
        </div>
    );
});

Timeline.displayName = 'Timeline';

// ---- canvas primitives -----------------------------------------------------

function roundRect(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
): void {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    g.beginPath();
    g.moveTo(x + radius, y);
    g.arcTo(x + w, y, x + w, y + h, radius);
    g.arcTo(x + w, y + h, x, y + h, radius);
    g.arcTo(x, y + h, x, y, radius);
    g.arcTo(x, y, x + w, y, radius);
    g.closePath();
}

function drawKeyframe(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    shape: TimelineKeyframeShape
): void {
    g.beginPath();
    if (shape === TimelineKeyframeShape.CIRCLE) {
        g.arc(x, y, size, 0, Math.PI * 2);
    } else if (shape === TimelineKeyframeShape.RECT) {
        g.rect(x - size, y - size, size * 2, size * 2);
    } else {
        // Rhomb (default)
        g.moveTo(x, y - size);
        g.lineTo(x + size, y);
        g.lineTo(x, y + size);
        g.lineTo(x - size, y);
        g.closePath();
    }
}
