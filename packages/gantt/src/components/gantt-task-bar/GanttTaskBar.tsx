import React, { useEffect, useRef, useState } from 'react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import moment from 'moment';
import { GanttTaskType, IGanttTask } from '../../interfaces/GanttInterfaces';
import { IBarGeometry, ITimeline, snapDate, xToDate } from '../../utils/ganttUtils';
import './GanttTaskBar.css';

type DragMode = 'move' | 'resize-start' | 'resize-end' | 'progress';

interface Props {
    task: IGanttTask;
    geometry: IBarGeometry;
    timeline: ITimeline;
    selected: boolean;
    /** Disable move / resize / progress / link interactions. */
    readonly?: boolean;
    onSelect: (id: string | number) => void;
    onOpenEditor: (id: string | number) => void;
    /** Committed when a move / resize finishes. */
    onChange: (id: string | number, start: Date, end: Date) => void;
    /** Committed when the progress handle is released. */
    onProgressChange: (id: string | number, progress: number) => void;
    /** Pointer went down on an end connector to begin drawing a dependency. */
    onLinkStart?: (
        id: string | number,
        side: 'start' | 'end',
        clientX: number,
        clientY: number
    ) => void;
    /** Whether this bar is a candidate drop target while a link is being drawn. */
    linkTarget?: boolean;
}

/**
 * A single task bar. Handles its own move / resize / progress dragging by
 * converting pixel deltas back to dates through the shared timeline, keeping a
 * live local draft while dragging and committing on release. Milestones render
 * as a diamond and summaries as a bracketed bar.
 *
 * Hover tooltips are driven by tippy.js — the same library the core
 * `SimpleTooltip` uses — attached directly to the bar so its absolute position
 * is preserved.
 */
export const GanttTaskBar: React.FC<Props> = ({
    task,
    geometry,
    timeline,
    selected,
    readonly,
    onSelect,
    onOpenEditor,
    onChange,
    onProgressChange,
    onLinkStart,
    linkTarget,
}) => {
    // Live draft applied while dragging so the bar tracks the pointer smoothly.
    const [draft, setDraft] = useState<{ x: number; width: number; progress?: number } | null>(
        null
    );
    const dragState = useRef<{
        mode: DragMode;
        startClientX: number;
        origX: number;
        origWidth: number;
        origProgress: number;
    } | null>(null);

    const barRef = useRef<HTMLDivElement | null>(null);
    const tippyRef = useRef<TippyInstance | null>(null);

    const isMilestone = task.type === GanttTaskType.MILESTONE;
    const isSummary = task.type === GanttTaskType.SUMMARY;
    const editable = !readonly && !task.readonly;

    const x = draft ? draft.x : geometry.x;
    const width = draft ? draft.width : geometry.width;
    const progress = draft?.progress ?? task.progress ?? 0;

    const tooltip = buildTooltip(task);

    // Tooltip: create once, keep its content in sync.
    useEffect(() => {
        if (!barRef.current) return;
        tippyRef.current = tippy(barRef.current, {
            content: tooltip,
            allowHTML: true,
            zIndex: 999999999999999,
        });
        return () => {
            tippyRef.current?.destroy();
            tippyRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        tippyRef.current?.setContent(tooltip);
    }, [tooltip]);

    // Global pointer listeners for the active drag, (re)bound when one starts.
    useEffect(() => {
        if (!draft) return;
        const handleMove = (e: PointerEvent) => {
            const state = dragState.current;
            if (!state) return;
            const dx = e.clientX - state.startClientX;
            if (state.mode === 'move') {
                setDraft({ x: state.origX + dx, width: state.origWidth });
            } else if (state.mode === 'resize-start') {
                const newX = Math.min(state.origX + dx, state.origX + state.origWidth - 4);
                setDraft({ x: newX, width: state.origWidth - (newX - state.origX) });
            } else if (state.mode === 'resize-end') {
                setDraft({ x: state.origX, width: Math.max(4, state.origWidth + dx) });
            } else if (state.mode === 'progress') {
                const filled = (state.origProgress / 100) * state.origWidth + dx;
                const pct = Math.max(0, Math.min(100, (filled / state.origWidth) * 100));
                setDraft({ x: state.origX, width: state.origWidth, progress: Math.round(pct) });
            }
        };
        const handleUp = () => {
            const state = dragState.current;
            dragState.current = null;
            setDraft((current) => {
                if (state && current) {
                    if (state.mode === 'progress') {
                        onProgressChange(task.id, current.progress ?? 0);
                    } else {
                        const start = snapDate(xToDate(current.x, timeline), timeline);
                        const end = snapDate(xToDate(current.x + current.width, timeline), timeline);
                        onChange(task.id, start, end);
                    }
                }
                return null;
            });
        };
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);
        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft !== null]);

    const beginDrag = (mode: DragMode) => (e: React.PointerEvent) => {
        if (!editable) return;
        if (mode === 'progress' && isMilestone) return;
        e.stopPropagation();
        e.preventDefault();
        dragState.current = {
            mode,
            startClientX: e.clientX,
            origX: geometry.x,
            origWidth: geometry.width,
            origProgress: task.progress ?? 0,
        };
        setDraft({ x: geometry.x, width: geometry.width, progress: task.progress ?? 0 });
    };

    const commonHandlers = {
        onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onSelect(task.id);
        },
        onDoubleClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onOpenEditor(task.id);
        },
    };

    const colorStyle = task.color
        ? ({ ['--gantt-bar-color' as any]: task.color } as React.CSSProperties)
        : {};

    if (isMilestone) {
        const style: React.CSSProperties = {
            left: x,
            top: geometry.y,
            width: geometry.height,
            height: geometry.height,
            ...colorStyle,
        };
        return (
            <div
                ref={barRef}
                className={
                    'blue-orange-gantt-milestone' +
                    (selected ? ' blue-orange-gantt-bar-selected' : '') +
                    (linkTarget ? ' blue-orange-gantt-bar-link-target' : '')
                }
                style={style}
                data-task-id={task.id}
                onPointerDown={beginDrag('move')}
                {...commonHandlers}
            >
                <div className="blue-orange-gantt-milestone-diamond" />
                <span className="blue-orange-gantt-milestone-label">{task.text}</span>
            </div>
        );
    }

    const style: React.CSSProperties = {
        left: x,
        top: geometry.y,
        width,
        height: geometry.height,
        ...colorStyle,
    };

    return (
        <div
            ref={barRef}
            className={
                (isSummary ? 'blue-orange-gantt-summary-bar' : 'blue-orange-gantt-bar') +
                (selected ? ' blue-orange-gantt-bar-selected' : '') +
                (linkTarget ? ' blue-orange-gantt-bar-link-target' : '')
            }
            style={style}
            data-task-id={task.id}
            onPointerDown={beginDrag('move')}
            {...commonHandlers}
        >
            <div className="blue-orange-gantt-bar-progress" style={{ width: `${progress}%` }} />
            {!isSummary && <span className="blue-orange-gantt-bar-label">{task.text}</span>}

            {editable && !isSummary && (
                <>
                    <div
                        className="blue-orange-gantt-bar-handle blue-orange-gantt-bar-handle-start"
                        onPointerDown={beginDrag('resize-start')}
                    />
                    <div
                        className="blue-orange-gantt-bar-handle blue-orange-gantt-bar-handle-end"
                        onPointerDown={beginDrag('resize-end')}
                    />
                    <div
                        className="blue-orange-gantt-bar-progress-handle"
                        style={{ left: `${progress}%` }}
                        onPointerDown={beginDrag('progress')}
                    />
                </>
            )}

            {editable && onLinkStart && (
                <>
                    <div
                        className="blue-orange-gantt-bar-connector blue-orange-gantt-bar-connector-start"
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onLinkStart(task.id, 'start', e.clientX, e.clientY);
                        }}
                    />
                    <div
                        className="blue-orange-gantt-bar-connector blue-orange-gantt-bar-connector-end"
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onLinkStart(task.id, 'end', e.clientX, e.clientY);
                        }}
                    />
                </>
            )}
        </div>
    );
};

/** Builds the hover tooltip HTML for a bar. */
function buildTooltip(task: IGanttTask): string {
    const lines: string[] = [`<strong>${escapeHtml(task.text)}</strong>`];
    if (task.start && task.end && task.type !== GanttTaskType.MILESTONE) {
        lines.push(
            `${moment(task.start).format('D MMM YYYY')} → ${moment(task.end).format('D MMM YYYY')}`
        );
    } else if (task.start) {
        lines.push(moment(task.start).format('D MMM YYYY'));
    }
    if (task.type !== GanttTaskType.MILESTONE && task.progress != null) {
        lines.push(`${task.progress}% complete`);
    }
    return lines.join('<br/>');
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
