import React from 'react';
import './TimelineToolbar.css';
import { TimelineInteractionMode, TimelineTimeMode } from '../../interfaces/TimelineInterfaces';
export interface TimelineToolbarProps {
    /** Current interaction mode (highlighted in the mode switch). */
    mode: TimelineInteractionMode;
    onModeChange: (mode: TimelineInteractionMode) => void;
    /**
     * Current time-display mode. When supplied together with `onTimeModeChange`,
     * a Relative / Date switch is rendered.
     */
    timeMode?: TimelineTimeMode;
    onTimeModeChange?: (mode: TimelineTimeMode) => void;
    /**
     * Frame the events that have occurred. Rendered as a "Focus events" button
     * when supplied — most useful alongside {@link TimelineTimeMode.ABSOLUTE},
     * whose axis pans infinitely.
     */
    onFocusEvents?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onZoomFit?: () => void;
    /** Playback controls. Rendered only when `onPlayPause` is supplied. */
    playing?: boolean;
    onPlayPause?: () => void;
    onStop?: () => void;
    /** Snap toggle. Rendered only when `onSnapChange` is supplied. */
    snapEnabled?: boolean;
    onSnapChange?: (enabled: boolean) => void;
    /** Current time to display, in the timeline's units. */
    time?: number;
    /** Formats the displayed time. Defaults to the seconds formatter. */
    timeFormatter?: (val: number) => string;
    dark?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * A ready-made toolbar for the {@link Timeline}, assembled entirely from core
 * Foundations controls (`ButtonIcon`, `Toggle`). Wire its callbacks to a
 * {@link TimelineHandle} for the common actions — switch interaction mode,
 * zoom in / out / to fit, play / pause and toggle snapping — or drop in your
 * own controls if you need something bespoke.
 */
export declare const TimelineToolbar: React.FC<TimelineToolbarProps>;
