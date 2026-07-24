import React from 'react';
import {
    ButtonIcon,
    ButtonDropdown,
    ButtonSize,
    ButtonType,
    DropdownItemText,
    Toggle,
} from '@blue-orange-ai/foundations-core';
import './TimelineToolbar.css';
import { TimelineInteractionMode, TimelineTimeMode } from '../../interfaces/TimelineInterfaces';
import { defaultDateFormatter, defaultUnitFormatter } from '../../utils/timelineUtils';

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

    /** Playback controls. The transport group is rendered when any of
     * `onPlayPause`, `onPrevEvent` or `onNextEvent` is supplied. */
    playing?: boolean;
    onPlayPause?: () => void;
    onStop?: () => void;
    /** Step the cursor to the previous / next event. Rendered as skip controls
     * flanking the play button when supplied. */
    onPrevEvent?: () => void;
    onNextEvent?: () => void;

    /**
     * Current playback-speed multiplier. When supplied together with
     * `onSpeedChange`, a speed button (e.g. `2×`) is rendered next to the
     * transport controls and cycles through {@link TimelineToolbarProps.speeds}
     * on click. Defaults to `1`.
     */
    speed?: number;
    onSpeedChange?: (speed: number) => void;
    /** Speed multipliers the speed button cycles through. Defaults to `[1, 2, 4]`. */
    speeds?: number[];

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
];

const TIME_MODES: { mode: TimelineTimeMode; icon: string; label: string }[] = [
    { mode: TimelineTimeMode.RELATIVE, icon: 'ri-time-line', label: 'Relative time' },
    { mode: TimelineTimeMode.ABSOLUTE, icon: 'ri-calendar-line', label: 'Date / time' },
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
    timeMode,
    onTimeModeChange,
    onFocusEvents,
    onZoomIn,
    onZoomOut,
    onZoomFit,
    playing = false,
    onPlayPause,
    onStop,
    onPrevEvent,
    onNextEvent,
    speed = 1,
    onSpeedChange,
    speeds = [1, 2, 4],
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

    const absolute = timeMode === TimelineTimeMode.ABSOLUTE;
    const formatTime = (val: number): string => {
        if (timeFormatter) {
            return timeFormatter(val);
        }
        return absolute ? defaultDateFormatter(val, 1000) : defaultUnitFormatter(val, 1000);
    };

    const formatSpeed = (val: number): string =>
        `${Number.isInteger(val) ? val : val.toFixed(2).replace(/\.?0+$/, '')}×`;
    // The dropdown reports the selected item's reference (its speed as a string).
    const handleSpeedSelect = (reference: string) => {
        const next = Number(reference);
        if (onSpeedChange && !Number.isNaN(next)) {
            onSpeedChange(next);
        }
    };

    return (
        <div className={rootClass} style={style}>
            {(onPlayPause || onPrevEvent || onNextEvent) && (
                <div className="blue-orange-timeline-toolbar-playback">
                    <div className="blue-orange-timeline-toolbar-group">
                        {onPrevEvent && (
                            <ButtonIcon
                                icon="ri-skip-back-line"
                                label="Previous event"
                                onClick={onPrevEvent}
                            />
                        )}
                        {onPlayPause && (
                            <ButtonIcon
                                icon={playing ? 'ri-pause-line' : 'ri-play-line'}
                                label={playing ? 'Pause' : 'Play'}
                                onClick={onPlayPause}
                            />
                        )}
                        {onNextEvent && (
                            <ButtonIcon
                                icon="ri-skip-forward-line"
                                label="Next event"
                                onClick={onNextEvent}
                            />
                        )}
                        {onStop && (
                            <ButtonIcon icon="ri-stop-line" label="Stop" onClick={onStop} />
                        )}
                    </div>
                </div>
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

            {onTimeModeChange && timeMode !== undefined && (
                <>
                    <div className="blue-orange-timeline-toolbar-separator" />
                    <div className="blue-orange-timeline-toolbar-group">
                        {TIME_MODES.map((m) => (
                            <ButtonIcon
                                key={m.mode}
                                icon={m.icon}
                                label={m.label}
                                className={
                                    timeMode === m.mode
                                        ? 'blue-orange-timeline-mode-active'
                                        : undefined
                                }
                                onClick={() => onTimeModeChange(m.mode)}
                            />
                        ))}
                    </div>
                </>
            )}

            {onFocusEvents && absolute && (
                <>
                    <div className="blue-orange-timeline-toolbar-separator" />
                    <div className="blue-orange-timeline-toolbar-group">
                        <ButtonIcon
                            icon="ri-focus-3-line"
                            label="Focus events"
                            onClick={onFocusEvents}
                        />
                    </div>
                </>
            )}

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

            {onSpeedChange && (
                <div className="blue-orange-timeline-toolbar-speed">
                    <ButtonDropdown
                        text={formatSpeed(speed)}
                        tooltip="Playback speed"
                        buttonType={ButtonType.CLEAR}
                        size={ButtonSize.MEDIUM}
                        onSelection={handleSpeedSelect}
                    >
                        {speeds.map((s) => (
                            <DropdownItemText
                                key={s}
                                label={formatSpeed(s)}
                                value={String(s)}
                                selected={s === speed}
                            />
                        ))}
                    </ButtonDropdown>
                </div>
            )}

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
