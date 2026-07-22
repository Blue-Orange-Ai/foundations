import React from 'react';
import moment from 'moment';
import { GanttTaskType, IGanttColumn, IGanttTask } from '../../interfaces/GanttInterfaces';
import { IFlatTask, ROW_HEIGHT } from '../../utils/ganttUtils';
import './GanttGrid.css';

interface Props {
    columns: IGanttColumn[];
    rows: IFlatTask[];
    /** Height of the grid header, matched to the timeline header for alignment. */
    headerHeight: number;
    selectedId: string | number | null;
    readonly?: boolean;
    bodyRef: React.RefObject<HTMLDivElement>;
    onBodyScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    onToggle: (id: string | number) => void;
    onSelect: (id: string | number) => void;
    onOpenEditor: (id: string | number) => void;
    onAddChild?: (parentId: string | number) => void;
}

/**
 * The data grid rendered to the left of the timeline. Rows share {@link ROW_HEIGHT}
 * with the chart so the two panes line up. Summary rows show an expand / collapse
 * caret and their children are indented by depth.
 */
export const GanttGrid: React.FC<Props> = ({
    columns,
    rows,
    headerHeight,
    selectedId,
    readonly,
    bodyRef,
    onBodyScroll,
    onToggle,
    onSelect,
    onOpenEditor,
    onAddChild,
}) => {
    const totalWidth = columns.reduce((sum, c) => sum + (c.width ?? 140), 0);

    return (
        <div className="blue-orange-gantt-grid" style={{ width: totalWidth }}>
            <div
                className="blue-orange-gantt-grid-header"
                style={{ height: headerHeight, width: totalWidth }}
            >
                {columns.map((col) => (
                    <div
                        key={col.id}
                        className="blue-orange-gantt-grid-header-cell"
                        style={{ width: col.width ?? 140, textAlign: col.align ?? 'left' }}
                    >
                        {col.header}
                    </div>
                ))}
            </div>

            <div className="blue-orange-gantt-grid-body" ref={bodyRef} onScroll={onBodyScroll}>
                {rows.map((row) => (
                    <div
                        key={row.task.id}
                        className={
                            'blue-orange-gantt-grid-data-row' +
                            (row.task.id === selectedId
                                ? ' blue-orange-gantt-grid-data-row-selected'
                                : '')
                        }
                        style={{ height: ROW_HEIGHT }}
                        onClick={() => onSelect(row.task.id)}
                        onDoubleClick={() => onOpenEditor(row.task.id)}
                    >
                        {columns.map((col) => (
                            <div
                                key={col.id}
                                className="blue-orange-gantt-grid-cell"
                                style={{ width: col.width ?? 140, textAlign: col.align ?? 'left' }}
                            >
                                {renderCell(col, row, {
                                    readonly,
                                    onToggle,
                                    onAddChild,
                                })}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

function renderCell(
    col: IGanttColumn,
    row: IFlatTask,
    actions: {
        readonly?: boolean;
        onToggle: (id: string | number) => void;
        onAddChild?: (parentId: string | number) => void;
    }
): React.ReactNode {
    const { task } = row;
    if (col.render) return col.render(task);

    switch (col.id) {
        case 'text':
            return (
                <div
                    className="blue-orange-gantt-grid-text"
                    style={{ paddingLeft: row.depth * 16 }}
                >
                    {row.hasChildren ? (
                        <button
                            type="button"
                            className="blue-orange-gantt-grid-caret"
                            onClick={(e) => {
                                e.stopPropagation();
                                actions.onToggle(task.id);
                            }}
                            aria-label={row.open ? 'Collapse' : 'Expand'}
                        >
                            <i
                                className={
                                    row.open ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'
                                }
                            />
                        </button>
                    ) : (
                        <span className="blue-orange-gantt-grid-caret-spacer" />
                    )}
                    <i className={typeIcon(task) + ' blue-orange-gantt-grid-type-icon'} />
                    <span className="blue-orange-gantt-grid-text-label" title={task.text}>
                        {task.text}
                    </span>
                </div>
            );
        case 'start':
            return task.start ? moment(task.start).format('D MMM YYYY') : '';
        case 'end':
            return task.end ? moment(task.end).format('D MMM YYYY') : '';
        case 'duration':
            return task.type === GanttTaskType.MILESTONE ? '—' : `${task.duration ?? 0}d`;
        case 'progress':
            return task.type === GanttTaskType.MILESTONE ? '—' : `${task.progress ?? 0}%`;
        case 'add':
            return actions.onAddChild && !actions.readonly ? (
                <button
                    type="button"
                    className="blue-orange-gantt-grid-add"
                    onClick={(e) => {
                        e.stopPropagation();
                        actions.onAddChild!(task.id);
                    }}
                    aria-label="Add sub-task"
                >
                    <i className="ri-add-line" />
                </button>
            ) : null;
        default:
            return null;
    }
}

function typeIcon(task: IGanttTask): string {
    switch (task.type) {
        case GanttTaskType.SUMMARY:
            return 'ri-folder-line';
        case GanttTaskType.MILESTONE:
            return 'ri-flag-line';
        default:
            return 'ri-checkbox-blank-circle-line';
    }
}
