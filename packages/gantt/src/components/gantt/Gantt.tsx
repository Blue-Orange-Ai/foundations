import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
    GanttLinkType,
    GanttTaskType,
    IGanttColumn,
    IGanttLink,
    IGanttTask,
} from '../../interfaces/GanttInterfaces';
import {
    ZOOM_LEVELS,
    applyTaskDates,
    buildTimeline,
    canLink,
    dateToX,
    flattenTasks,
    getTaskRange,
    HEADER_SCALE_HEIGHT,
} from '../../utils/ganttUtils';
import { GanttToolbar } from '../gantt-toolbar/GanttToolbar';
import { GanttGrid } from '../gantt-grid/GanttGrid';
import { GanttChart } from '../gantt-chart/GanttChart';
import { GanttTaskForm } from '../gantt-task-form/GanttTaskForm';
import './Gantt.css';

/** The default data-grid columns shown to the left of the timeline. */
export const DEFAULT_GANTT_COLUMNS: IGanttColumn[] = [
    { id: 'text', header: 'Task name', width: 220 },
    { id: 'start', header: 'Start', width: 108 },
    { id: 'duration', header: 'Days', width: 64, align: 'center' },
    { id: 'add', header: '', width: 40, align: 'center' },
];

interface Props {
    /** The tasks to render. */
    tasks: IGanttTask[];
    /** Dependency links between tasks. */
    links?: IGanttLink[];
    /** Grid columns. Defaults to {@link DEFAULT_GANTT_COLUMNS}. */
    columns?: IGanttColumn[];
    /** Name of the initial zoom level (see `ZOOM_LEVELS`). Defaults to "Days". */
    defaultZoom?: string;
    /** Disable all editing interactions (drag, resize, form, linking). */
    readonly?: boolean;
    /** Show the built-in toolbar. Defaults to true. */
    showToolbar?: boolean;
    /** Show the vertical "today" marker. Defaults to true. */
    showToday?: boolean;
    /** Open the built-in create / edit form on double-click. Defaults to true. */
    useTaskForm?: boolean;

    /**
     * Called with the full next task array on any change. When provided the
     * component is controlled — feed the new array back through `tasks`. When
     * omitted the component keeps its own internal copy.
     */
    onTasksChange?: (tasks: IGanttTask[]) => void;
    /** Called with the full next link array on any change (see `onTasksChange`). */
    onLinksChange?: (links: IGanttLink[]) => void;
    /** Fired when a task's selection changes (null when cleared). */
    onSelect?: (task: IGanttTask | null) => void;
    /** Fired when a task is double-clicked, before the built-in form opens. */
    onTaskDoubleClick?: (task: IGanttTask) => void;
}

/**
 * The Foundations Gantt chart: a hierarchical, interactive project timeline with
 * a data grid, drag / resize / progress editing, dependency links, milestones,
 * summary roll-ups and zoomable time scales.
 *
 * Works both controlled (pass `tasks` + `onTasksChange`) and uncontrolled (pass
 * an initial `tasks` and let it manage its own state). All chrome is built from
 * Foundations core components so it matches the rest of the design system.
 */
export const Gantt: React.FC<Props> = ({
    tasks,
    links,
    columns = DEFAULT_GANTT_COLUMNS,
    defaultZoom = 'Days',
    readonly,
    showToolbar = true,
    showToday = true,
    useTaskForm = true,
    onTasksChange,
    onLinksChange,
    onSelect,
    onTaskDoubleClick,
}) => {
    const tasksControlled = onTasksChange != null;
    const linksControlled = onLinksChange != null;

    const [internalTasks, setInternalTasks] = useState<IGanttTask[]>(tasks);
    const [internalLinks, setInternalLinks] = useState<IGanttLink[]>(links ?? []);
    const currentTasks = tasksControlled ? tasks : internalTasks;
    const currentLinks = linksControlled ? links ?? [] : internalLinks;

    const commitTasks = useCallback(
        (next: IGanttTask[]) => {
            if (tasksControlled) onTasksChange!(next);
            else setInternalTasks(next);
        },
        [tasksControlled, onTasksChange]
    );
    const commitLinks = useCallback(
        (next: IGanttLink[]) => {
            if (linksControlled) onLinksChange!(next);
            else setInternalLinks(next);
        },
        [linksControlled, onLinksChange]
    );

    const [zoomIndex, setZoomIndex] = useState(() => {
        const idx = ZOOM_LEVELS.findIndex((z) => z.name === defaultZoom);
        return idx >= 0 ? idx : 1;
    });
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [editing, setEditing] = useState<{ task: IGanttTask; isNew: boolean } | null>(null);

    const gridBodyRef = useRef<HTMLDivElement>(null);
    const chartScrollRef = useRef<HTMLDivElement>(null);
    const syncingScroll = useRef(false);
    const didInitialScroll = useRef(false);

    const zoom = ZOOM_LEVELS[zoomIndex];
    const rows = useMemo(() => flattenTasks(currentTasks), [currentTasks]);
    const range = useMemo(() => getTaskRange(currentTasks), [currentTasks]);
    const timeline = useMemo(
        () => buildTimeline(range.start, range.end, zoom),
        [range.start, range.end, zoom]
    );
    const headerHeight = timeline.headerRows.length * HEADER_SCALE_HEIGHT;

    // ---- Scroll syncing between the grid body and the chart ----
    const handleChartScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (syncingScroll.current) {
            syncingScroll.current = false;
            return;
        }
        if (gridBodyRef.current) {
            syncingScroll.current = true;
            gridBodyRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    };
    const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (syncingScroll.current) {
            syncingScroll.current = false;
            return;
        }
        if (chartScrollRef.current) {
            syncingScroll.current = true;
            chartScrollRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    };

    // Scroll the timeline to today (or the first task) on first render.
    useEffect(() => {
        if (didInitialScroll.current || !chartScrollRef.current) return;
        didInitialScroll.current = true;
        const anchor =
            currentTasks.map((t) => t.start).filter(Boolean).length > 0
                ? new Date(
                      Math.min(
                          ...(currentTasks
                              .map((t) => t.start)
                              .filter(Boolean) as Date[]).map((d) => d.getTime())
                      )
                  )
                : new Date();
        chartScrollRef.current.scrollLeft = Math.max(0, dateToX(anchor, timeline) - 48);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- Selection ----
    const handleSelect = (id: string | number) => {
        setSelectedId(id);
        onSelect?.(currentTasks.find((t) => t.id === id) ?? null);
    };
    const clearSelection = () => {
        setSelectedId(null);
        onSelect?.(null);
    };

    // ---- Hierarchy ----
    const handleToggle = (id: string | number) => {
        commitTasks(
            currentTasks.map((t) =>
                t.id === id ? { ...t, open: t.open === false } : t
            )
        );
    };
    const setAllOpen = (open: boolean) => {
        commitTasks(currentTasks.map((t) => ({ ...t, open })));
    };

    // ---- Bar edits ----
    const handleDateChange = (id: string | number, start: Date, end: Date) => {
        commitTasks(applyTaskDates(currentTasks, id, start, end));
    };
    const handleProgressChange = (id: string | number, progress: number) => {
        commitTasks(currentTasks.map((t) => (t.id === id ? { ...t, progress } : t)));
    };

    // ---- Create / edit / delete ----
    const openEditor = (id: string | number) => {
        const task = currentTasks.find((t) => t.id === id);
        if (!task) return;
        onTaskDoubleClick?.(task);
        if (useTaskForm && !readonly) setEditing({ task, isNew: false });
    };
    const handleCreate = () => {
        const start = moment().startOf('day').toDate();
        setEditing({
            task: {
                id: uuid(),
                text: '',
                type: GanttTaskType.TASK,
                start,
                duration: 3,
                progress: 0,
            },
            isNew: true,
        });
    };
    const handleAddChild = (parentId: string | number) => {
        const parent = currentTasks.find((t) => t.id === parentId);
        const start = parent?.start ?? moment().startOf('day').toDate();
        // Ensure the parent renders as an expanded summary once it has a child.
        if (parent && parent.type !== GanttTaskType.SUMMARY) {
            commitTasks(
                currentTasks.map((t) =>
                    t.id === parentId ? { ...t, type: GanttTaskType.SUMMARY, open: true } : t
                )
            );
        }
        setEditing({
            task: {
                id: uuid(),
                text: '',
                type: GanttTaskType.TASK,
                parent: parentId,
                start,
                duration: 2,
                progress: 0,
            },
            isNew: true,
        });
    };
    const handleSaveTask = (task: IGanttTask) => {
        if (editing?.isNew) {
            commitTasks([...currentTasks, task]);
        } else {
            commitTasks(currentTasks.map((t) => (t.id === task.id ? task : t)));
        }
        setEditing(null);
        setSelectedId(task.id);
    };
    const handleDeleteTask = (id: string | number) => {
        const toRemove = collectDescendants(currentTasks, id);
        commitTasks(currentTasks.filter((t) => !toRemove.has(t.id)));
        commitLinks(
            currentLinks.filter((l) => !toRemove.has(l.source) && !toRemove.has(l.target))
        );
        if (selectedId != null && toRemove.has(selectedId)) clearSelection();
        setEditing(null);
    };

    // ---- Links ----
    const handleLinkCreate = (source: string | number, target: string | number) => {
        if (!canLink(currentTasks, currentLinks, source, target)) return;
        commitLinks([
            ...currentLinks,
            { id: uuid(), source, target, type: GanttLinkType.END_TO_START },
        ]);
    };
    const handleLinkClick = (id: string | number) => {
        if (readonly) return;
        commitLinks(currentLinks.filter((l) => l.id !== id));
    };

    // ---- Toolbar ----
    const handleToday = () => {
        if (chartScrollRef.current) {
            chartScrollRef.current.scrollLeft = Math.max(0, dateToX(new Date(), timeline) - 120);
        }
    };

    return (
        <div className="blue-orange-gantt">
            {showToolbar && (
                <GanttToolbar
                    zoom={zoom}
                    canZoomIn={zoomIndex > 0}
                    canZoomOut={zoomIndex < ZOOM_LEVELS.length - 1}
                    readonly={readonly}
                    onZoomIn={() => setZoomIndex((i) => Math.max(0, i - 1))}
                    onZoomOut={() => setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
                    onToday={handleToday}
                    onExpandAll={() => setAllOpen(true)}
                    onCollapseAll={() => setAllOpen(false)}
                    onCreate={readonly ? undefined : handleCreate}
                />
            )}

            <div className="blue-orange-gantt-body">
                <GanttGrid
                    columns={columns}
                    rows={rows}
                    headerHeight={headerHeight}
                    selectedId={selectedId}
                    readonly={readonly}
                    bodyRef={gridBodyRef}
                    onBodyScroll={handleGridScroll}
                    onToggle={handleToggle}
                    onSelect={handleSelect}
                    onOpenEditor={openEditor}
                    onAddChild={readonly ? undefined : handleAddChild}
                />

                <GanttChart
                    timeline={timeline}
                    rows={rows}
                    links={currentLinks}
                    selectedId={selectedId}
                    readonly={readonly}
                    showToday={showToday}
                    scrollRef={chartScrollRef}
                    onScroll={handleChartScroll}
                    onSelect={handleSelect}
                    onOpenEditor={openEditor}
                    onChange={handleDateChange}
                    onProgressChange={handleProgressChange}
                    onLinkCreate={readonly ? undefined : handleLinkCreate}
                    onLinkClick={readonly ? undefined : handleLinkClick}
                    onBackgroundClick={clearSelection}
                />
            </div>

            {editing && (
                <GanttTaskForm
                    task={editing.task}
                    isNew={editing.isNew}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    onClose={() => setEditing(null)}
                />
            )}
        </div>
    );
};

/** The id set of a task plus all of its (transitive) descendants. */
function collectDescendants(
    tasks: IGanttTask[],
    rootId: string | number
): Set<string | number> {
    const childrenOf = new Map<string | number, (string | number)[]>();
    for (const t of tasks) {
        if (t.parent != null) {
            if (!childrenOf.has(t.parent)) childrenOf.set(t.parent, []);
            childrenOf.get(t.parent)!.push(t.id);
        }
    }
    const result = new Set<string | number>();
    const stack = [rootId];
    while (stack.length) {
        const id = stack.pop()!;
        if (result.has(id)) continue;
        result.add(id);
        for (const child of childrenOf.get(id) ?? []) stack.push(child);
    }
    return result;
}
