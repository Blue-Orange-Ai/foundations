import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ButtonType, ButtonSize, Toggle } from '@blue-orange-ai/foundations-core';
import { Timeline, TimelineHandle } from '../../components/timeline/Timeline';
import { TimelineToolbar } from '../../components/timeline-toolbar/TimelineToolbar';
import {
    ITimelineDragEvent,
    ITimelineModel,
    ITimelineSelectedEvent,
    TimelineInteractionMode,
} from '../../interfaces/TimelineInterfaces';
import { mockModel } from '../data/mockData';
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
    const [time, setTime] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [model] = useState<ITimelineModel>(mockModel);
    const [log, setLog] = useState<string[]>([]);

    const timelineRef = useRef<TimelineHandle | null>(null);
    const rafRef = useRef<number>(0);
    const lastTsRef = useRef<number>(0);

    const pushLog = useCallback((message: string) => {
        setLog((prev) => [message, ...prev].slice(0, 40));
    }, []);

    // Simple playback loop advancing the cursor while "playing".
    useEffect(() => {
        if (!playing) {
            return;
        }
        lastTsRef.current = 0;
        const tick = (ts: number) => {
            if (lastTsRef.current) {
                const dt = ts - lastTsRef.current;
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
    }, [playing]);

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
                    onZoomIn={() => timelineRef.current?.zoomBy(0.8)}
                    onZoomOut={() => timelineRef.current?.zoomBy(1.25)}
                    onZoomFit={() => timelineRef.current?.zoomToFit()}
                    playing={playing}
                    onPlayPause={() => setPlaying((p) => !p)}
                    onStop={() => {
                        setPlaying(false);
                        setTime(0);
                    }}
                    snapEnabled={snap}
                    onSnapChange={setSnap}
                    time={time}
                    dark={dark}
                />
                <Timeline
                    ref={timelineRef}
                    className="timeline-workspace-timeline"
                    model={model}
                    dark={dark}
                    time={time}
                    interactionMode={mode}
                    options={{
                        max: 10000,
                        snapEnabled: snap,
                        snapStep: 250,
                    }}
                    onTimeChanged={(e) => setTime(e.val)}
                    onSelected={handleSelected}
                    onDragFinished={handleDragFinished}
                    onContextMenu={(e) => {
                        e.originalEvent.preventDefault();
                        pushLog(`context menu on ${e.target} @ ${Math.round(e.val)}ms`);
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
