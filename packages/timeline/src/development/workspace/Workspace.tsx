import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, ButtonType, ButtonSize, Toggle } from '@blue-orange-ai/foundations-core';
import { Timeline, TimelineHandle } from '../../components/timeline/Timeline';
import { TimelineToolbar } from '../../components/timeline-toolbar/TimelineToolbar';
import {
    ITimelineDragEvent,
    ITimelineModel,
    ITimelineSelectedEvent,
    TimelineInteractionMode,
    TimelineTimeMode,
} from '../../interfaces/TimelineInterfaces';
import { defaultDateFormatter } from '../../utils/timelineUtils';
import { mockDateModel, mockModel } from '../data/mockData';
import './Workspace.css';

/**
 * Local development harness for the timeline package. Renders the {@link Timeline}
 * with its {@link TimelineToolbar} over mock data, wires up every event so the
 * interactions can be exercised in the browser via `npm start`, and offers a
 * light/dark theme toggle. This file is not part of the library build.
 */
export const Workspace: React.FC = () => {
    const [dark, setDark] = useState(false);
    const [snap, setSnap] = useState(false);
    const [mode, setMode] = useState<TimelineInteractionMode>(TimelineInteractionMode.SELECTION);
    const [timeMode, setTimeMode] = useState<TimelineTimeMode>(TimelineTimeMode.RELATIVE);
    const [time, setTime] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [log, setLog] = useState<string[]>([]);

    // A fixed "now" and matching date model, established once so the demo is
    // stable across re-renders.
    const now = useRef<number>(Date.now()).current;
    const [relativeModel] = useState<ITimelineModel>(mockModel);
    const [dateModel] = useState<ITimelineModel>(() => mockDateModel(now));

    const absolute = timeMode === TimelineTimeMode.ABSOLUTE;
    const model = absolute ? dateModel : relativeModel;

    const timelineRef = useRef<TimelineHandle | null>(null);
    const rafRef = useRef<number>(0);
    const lastTsRef = useRef<number>(0);
    // Read inside the RAF loop so speed changes take effect without restarting it.
    const speedRef = useRef<number>(speed);
    speedRef.current = speed;

    const pushLog = useCallback((message: string) => {
        setLog((prev) => [message, ...prev].slice(0, 40));
    }, []);

    // Simple playback loop advancing the cursor while "playing" (relative mode
    // only — in absolute mode the cursor tracks a wall-clock timestamp instead).
    useEffect(() => {
        if (!playing || absolute) {
            return;
        }
        lastTsRef.current = 0;
        const tick = (ts: number) => {
            if (lastTsRef.current) {
                const dt = (ts - lastTsRef.current) * speedRef.current;
                setTime((t) => {
                    const next = t + dt;
                    if (next >= 10000) {
                        setPlaying(false);
                        return 10000;
                    }
                    return next;
                });
            }
            lastTsRef.current = ts;
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [playing, absolute]);

    // Switch the cursor between an elapsed-time origin and a wall-clock timestamp
    // when the display mode changes.
    const handleTimeModeChange = useCallback(
        (next: TimelineTimeMode) => {
            setPlaying(false);
            setTimeMode(next);
            setTime(next === TimelineTimeMode.ABSOLUTE ? now : 0);
        },
        [now]
    );

    // Sorted, de-duplicated event positions of the active model, used by the
    // skip-to-previous / skip-to-next transport controls.
    const eventTimes = useMemo(() => {
        const vals: number[] = [];
        model.rows.forEach((row) => row.keyframes?.forEach((kf) => vals.push(kf.val)));
        return Array.from(new Set(vals)).sort((a, b) => a - b);
    }, [model]);

    const goToPrevEvent = useCallback(() => {
        setPlaying(false);
        setTime((t) => [...eventTimes].reverse().find((v) => v < t) ?? t);
    }, [eventTimes]);

    const goToNextEvent = useCallback(() => {
        setPlaying(false);
        setTime((t) => eventTimes.find((v) => v > t) ?? t);
    }, [eventTimes]);

    const handleSelected = (e: ITimelineSelectedEvent) => {
        pushLog(`selected: ${e.selected.length} keyframe(s)`);
    };
    const handleDragFinished = (e: ITimelineDragEvent) => {
        pushLog(
            `drag ${e.target}: ${e.keyframes.length} keyframe(s), delta ${Math.round(e.delta)}`
        );
    };

    return (
        <div className={`timeline-workspace${dark ? ' dark' : ''}`}>
            <div className="timeline-workspace-topbar">
                <span className="timeline-workspace-title">Foundations Timeline</span>
                <div className="timeline-workspace-controls">
                    <label className="timeline-workspace-control">
                        <span>Snap 250ms</span>
                        <Toggle checked={snap} onChange={setSnap} />
                    </label>
                    <label className="timeline-workspace-control">
                        <span>Date / time</span>
                        <Toggle
                            checked={absolute}
                            onChange={(on) =>
                                handleTimeModeChange(
                                    on ? TimelineTimeMode.ABSOLUTE : TimelineTimeMode.RELATIVE
                                )
                            }
                        />
                    </label>
                    <Button
                        text={dark ? 'Light mode' : 'Dark mode'}
                        icon={dark ? 'ri-sun-line' : 'ri-moon-line'}
                        buttonType={ButtonType.SECONDARY}
                        size={ButtonSize.SMALL}
                        onClick={() => setDark((d) => !d)}
                    />
                </div>
            </div>
            <div className="timeline-workspace-stage">
                <TimelineToolbar
                    mode={mode}
                    onModeChange={(m) => {
                        setMode(m);
                        timelineRef.current?.setInteractionMode(m);
                    }}
                    timeMode={timeMode}
                    onFocusEvents={() => timelineRef.current?.focusEvents()}
                    onZoomIn={() => timelineRef.current?.zoomBy(0.8)}
                    onZoomOut={() => timelineRef.current?.zoomBy(1.25)}
                    onZoomFit={() => timelineRef.current?.zoomToFit()}
                    playing={playing}
                    onPlayPause={absolute ? undefined : () => setPlaying((p) => !p)}
                    onStop={
                        absolute
                            ? undefined
                            : () => {
                                  setPlaying(false);
                                  setTime(0);
                              }
                    }
                    onPrevEvent={goToPrevEvent}
                    onNextEvent={goToNextEvent}
                    speed={speed}
                    onSpeedChange={absolute ? undefined : setSpeed}
                    speeds={[1, 2, 4, 8]}
                    time={time}
                    timeFormatter={absolute ? (v) => defaultDateFormatter(v, 1000) : undefined}
                    dark={dark}
                />
                <Timeline
                    ref={timelineRef}
                    className="timeline-workspace-timeline"
                    model={model}
                    dark={dark}
                    time={time}
                    interactionMode={mode}
                    timeMode={timeMode}
                    options={
                        absolute
                            ? {
                                  timeMode: TimelineTimeMode.ABSOLUTE,
                                  now,
                                  labelsWidth: 140,
                                  snapEnabled: snap,
                                  snapStep: 3600000, // snap to the hour
                              }
                            : {
                                  max: 10000,
                                  snapEnabled: snap,
                                  snapStep: 250,
                              }
                    }
                    onTimeChanged={(e) => setTime(e.val)}
                    onSelected={handleSelected}
                    onDragFinished={handleDragFinished}
                    onContextMenu={(e) => {
                        e.originalEvent.preventDefault();
                        const at = absolute
                            ? defaultDateFormatter(e.val, 1000)
                            : `${Math.round(e.val)}ms`;
                        pushLog(`context menu on ${e.target} @ ${at}`);
                    }}
                />
                <div className="timeline-workspace-log">
                    {log.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};
