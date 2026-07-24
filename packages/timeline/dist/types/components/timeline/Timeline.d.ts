import React from 'react';
import './Timeline.css';
import { ITimelineContextMenuEvent, ITimelineDragEvent, ITimelineKeyframe, ITimelineModel, ITimelineOptions, ITimelineScrollEvent, ITimelineSelectedEvent, ITimelineTimeChangedEvent, TimelineInteractionMode, TimelineTimeMode } from '../../interfaces/TimelineInterfaces';
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
    /**
     * Frame the events that have occurred (val ≤ now) — the primary way back to
     * your data in the infinitely-panning {@link TimelineTimeMode.ABSOLUTE} mode.
     * Falls back to all events when none have occurred yet. Works in either mode.
     */
    focusEvents: () => void;
    setInteractionMode: (mode: TimelineInteractionMode) => void;
    setTimeMode: (mode: TimelineTimeMode) => void;
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
    /** Convenience override for `options.timeMode`. */
    timeMode?: TimelineTimeMode;
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
export declare const Timeline: React.ForwardRefExoticComponent<TimelineProps & React.RefAttributes<TimelineHandle>>;
