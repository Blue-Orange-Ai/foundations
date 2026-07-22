import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { GanttScaleUnit, IGanttLink } from '../../interfaces/GanttInterfaces';
import {
    IBarGeometry,
    IFlatTask,
    ITimeline,
    ROW_HEIGHT,
    dateToX,
    taskGeometry,
} from '../../utils/ganttUtils';
import { GanttTimeline } from '../gantt-timeline/GanttTimeline';
import { GanttTaskBar } from '../gantt-task-bar/GanttTaskBar';
import { GanttLinks } from '../gantt-links/GanttLinks';
import './GanttChart.css';

interface Props {
    timeline: ITimeline;
    rows: IFlatTask[];
    links: IGanttLink[];
    selectedId: string | number | null;
    readonly?: boolean;
    /** Show a vertical marker at the current date. */
    showToday?: boolean;
    /** Scroll container ref, owned by the parent for scroll syncing. */
    scrollRef: React.RefObject<HTMLDivElement>;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    onSelect: (id: string | number) => void;
    onOpenEditor: (id: string | number) => void;
    onChange: (id: string | number, start: Date, end: Date) => void;
    onProgressChange: (id: string | number, progress: number) => void;
    onLinkCreate?: (source: string | number, target: string | number) => void;
    onLinkClick?: (id: string | number) => void;
    onBackgroundClick?: () => void;
}

interface LinkDrag {
    source: string | number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    target: string | number | null;
}

/**
 * The chart body: timeline header, grid background (with weekend shading and a
 * today marker), dependency arrows and the task bars. Owns the drag-to-link
 * interaction, translating pointer positions into a source / target pair.
 */
export const GanttChart: React.FC<Props> = ({
    timeline,
    rows,
    links,
    selectedId,
    readonly,
    showToday = true,
    scrollRef,
    onScroll,
    onSelect,
    onOpenEditor,
    onChange,
    onProgressChange,
    onLinkCreate,
    onLinkClick,
    onBackgroundClick,
}) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [linkDrag, setLinkDrag] = useState<LinkDrag | null>(null);
    const linkDragRef = useRef<LinkDrag | null>(null);
    linkDragRef.current = linkDrag;

    const bodyHeight = rows.length * ROW_HEIGHT;

    // Geometry per visible task, and a lookup for the links overlay.
    const geometryById = new Map<string | number, IBarGeometry>();
    const bars = rows.map((row, index) => {
        const geometry = taskGeometry(row.task, index, timeline);
        geometryById.set(row.task.id, geometry);
        return { row, geometry };
    });

    const todayX = showToday ? dateToX(new Date(), timeline) : -1;
    const showTodayLine =
        showToday &&
        new Date().getTime() >= timeline.start.getTime() &&
        new Date().getTime() <= timeline.end.getTime();

    // ---- Drag-to-link ----
    const handleLinkStart = (
        id: string | number,
        side: 'start' | 'end',
        clientX: number,
        clientY: number
    ) => {
        if (!onLinkCreate || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const point = { x: clientX - rect.left, y: clientY - rect.top };
        setLinkDrag({ source: id, x1: point.x, y1: point.y, x2: point.x, y2: point.y, target: null });
    };

    useEffect(() => {
        if (!linkDrag) return;
        const handleMove = (e: PointerEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const target = taskIdAtPoint(e.clientX, e.clientY);
            setLinkDrag((prev) =>
                prev
                    ? {
                          ...prev,
                          x2: e.clientX - rect.left,
                          y2: e.clientY - rect.top,
                          target: target != null && target !== prev.source ? target : null,
                      }
                    : prev
            );
        };
        const handleUp = () => {
            const drag = linkDragRef.current;
            setLinkDrag(null);
            if (drag && drag.target != null && onLinkCreate) {
                onLinkCreate(drag.source, drag.target);
            }
        };
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);
        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linkDrag !== null]);

    return (
        <div
            className="blue-orange-gantt-chart-scroll"
            ref={scrollRef}
            onScroll={onScroll}
        >
            <div
                className="blue-orange-gantt-chart-header-sticky"
                style={{ width: timeline.width }}
            >
                <GanttTimeline timeline={timeline} />
            </div>

            <div
                className="blue-orange-gantt-chart-canvas"
                ref={canvasRef}
                style={{ width: timeline.width, height: bodyHeight }}
                onClick={(e) => {
                    if (e.target === canvasRef.current && onBackgroundClick) onBackgroundClick();
                }}
            >
                {/* Weekend column shading (only meaningful for hour / day scales). */}
                {(timeline.unit === GanttScaleUnit.DAY || timeline.unit === GanttScaleUnit.HOUR) &&
                    timeline.cells.map((cell, i) => {
                        const day = moment(cell.start).day();
                        if (day !== 0 && day !== 6) return null;
                        return (
                            <div
                                key={`we-${i}`}
                                className="blue-orange-gantt-weekend"
                                style={{ left: cell.x, width: cell.width, height: bodyHeight }}
                            />
                        );
                    })}

                {/* Vertical grid lines, one per bottom cell. */}
                {timeline.cells.map((cell, i) => (
                    <div
                        key={`v-${i}`}
                        className="blue-orange-gantt-grid-vline"
                        style={{ left: cell.x + cell.width, height: bodyHeight }}
                    />
                ))}

                {/* Horizontal row separators and hover striping. */}
                {rows.map((row, i) => (
                    <div
                        key={`h-${row.task.id}`}
                        className={
                            'blue-orange-gantt-grid-row' +
                            (row.task.id === selectedId ? ' blue-orange-gantt-grid-row-selected' : '')
                        }
                        style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}
                    />
                ))}

                {showTodayLine && (
                    <div
                        className="blue-orange-gantt-today-line"
                        style={{ left: todayX, height: bodyHeight }}
                    />
                )}

                <GanttLinks
                    links={links}
                    geometryById={geometryById}
                    width={timeline.width}
                    height={bodyHeight}
                    onLinkClick={onLinkClick}
                    draft={linkDrag}
                />

                {bars.map(({ row, geometry }) => (
                    <GanttTaskBar
                        key={row.task.id}
                        task={row.task}
                        geometry={geometry}
                        timeline={timeline}
                        selected={row.task.id === selectedId}
                        readonly={readonly}
                        onSelect={onSelect}
                        onOpenEditor={onOpenEditor}
                        onChange={onChange}
                        onProgressChange={onProgressChange}
                        onLinkStart={onLinkCreate ? handleLinkStart : undefined}
                        linkTarget={linkDrag?.target === row.task.id}
                    />
                ))}
            </div>
        </div>
    );
};

/** Finds the task id of the bar under a viewport point, if any. */
function taskIdAtPoint(clientX: number, clientY: number): string | number | null {
    const el = document.elementFromPoint(clientX, clientY);
    const barEl = el?.closest('[data-task-id]') as HTMLElement | null;
    if (!barEl) return null;
    return barEl.getAttribute('data-task-id');
}
