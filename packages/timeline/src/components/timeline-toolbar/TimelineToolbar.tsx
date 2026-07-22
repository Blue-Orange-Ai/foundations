import React from 'react';
import { ButtonIcon, Toggle } from '@blue-orange-ai/foundations-core';
import './TimelineToolbar.css';
import { TimelineInteractionMode } from '../../interfaces/TimelineInterfaces';
import { defaultUnitFormatter } from '../../utils/timelineUtils';

export interface TimelineToolbarProps {
    /** Current interaction mode (highlighted in the mode switch). */
    mode: TimelineInteractionMode;
    onModeChange: (mode: TimelineInteractionMode) => void;

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

const MODES: { mode: TimelineInteractionMode; icon: string; label: string }[] = [
    { mode: TimelineInteractionMode.SELECTION, icon: 'ri-cursor-line', label: 'Select' },
    { mode: TimelineInteractionMode.PAN, icon: 'ri-drag-move-2-line', label: 'Pan' },
    { mode: TimelineInteractionMode.ZOOM, icon: 'ri-search-line', label: 'Zoom' },
];

/**
 * A ready-made toolbar for the {@link Timeline}, assembled entirely from core
 * Foundations controls (`ButtonIcon`, `Toggle`). Wire its callbacks to a
 * {@link TimelineHandle} for the common actions — switch interaction mode,
 * zoom in / out / to fit, play / pause and toggle snapping — or drop in your
 * own controls if you need something bespoke.
 */
export const TimelineToolbar: React.FC<TimelineToolbarProps> = ({
    mode,
    onModeChange,
    onZoomIn,
    onZoomOut,
    onZoomFit,
    playing = false,
    onPlayPause,
    onStop,
    snapEnabled = false,
    onSnapChange,
    time,
    timeFormatter,
    dark = false,
    className,
    style,
}) => {
    const rootClass = `blue-orange-timeline-toolbar${
        dark ? ' blue-orange-timeline-toolbar-dark' : ''
    }${className ? ' ' + className : ''}`;

    const formatTime = (val: number): string =>
        timeFormatter ? timeFormatter(val) : defaultUnitFormatter(val, 1000);

    return (
        <div className={rootClass} style={style}>
            {onPlayPause && (
                <>
                    <div className="blue-orange-timeline-toolbar-group">
                        <ButtonIcon
                            icon={playing ? 'ri-pause-line' : 'ri-play-line'}
                            label={playing ? 'Pause' : 'Play'}
                            onClick={onPlayPause}
                        />
                        {onStop && (
                            <ButtonIcon icon="ri-stop-line" label="Stop" onClick={onStop} />
                        )}
                    </div>
                    <div className="blue-orange-timeline-toolbar-separator" />
                </>
            )}

            <div className="blue-orange-timeline-toolbar-group">
                {MODES.map((m) => (
                    <ButtonIcon
                        key={m.mode}
                        icon={m.icon}
                        label={m.label}
                        className={
                            mode === m.mode ? 'blue-orange-timeline-mode-active' : undefined
                        }
                        onClick={() => onModeChange(m.mode)}
                    />
                ))}
            </div>

            {(onZoomOut || onZoomIn || onZoomFit) && (
                <>
                    <div className="blue-orange-timeline-toolbar-separator" />
                    <div className="blue-orange-timeline-toolbar-group">
                        {onZoomOut && (
                            <ButtonIcon
                                icon="ri-zoom-out-line"
                                label="Zoom out"
                                onClick={onZoomOut}
                            />
                        )}
                        {onZoomIn && (
                            <ButtonIcon
                                icon="ri-zoom-in-line"
                                label="Zoom in"
                                onClick={onZoomIn}
                            />
                        )}
                        {onZoomFit && (
                            <ButtonIcon
                                icon="ri-fullscreen-line"
                                label="Zoom to fit"
                                onClick={onZoomFit}
                            />
                        )}
                    </div>
                </>
            )}

            <div className="blue-orange-timeline-toolbar-spacer" />

            {onSnapChange && (
                <div className="blue-orange-timeline-toolbar-snap">
                    <span className="blue-orange-timeline-toolbar-snap-label no-select">Snap</span>
                    <Toggle checked={snapEnabled} onChange={onSnapChange} />
                </div>
            )}

            {time !== undefined && (
                <span className="blue-orange-timeline-toolbar-time no-select">
                    {formatTime(time)}
                </span>
            )}
        </div>
    );
};
