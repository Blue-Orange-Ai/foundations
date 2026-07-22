import React from 'react';
import { HEADER_SCALE_HEIGHT, ITimeline } from '../../utils/ganttUtils';
import './GanttTimeline.css';

interface Props {
    timeline: ITimeline;
}

/**
 * The timeline header: one row per scale (e.g. a month row above a day row).
 * Purely presentational — every cell's pixel position comes from the shared
 * {@link ITimeline}, so it lines up exactly with the chart body below it.
 */
export const GanttTimeline: React.FC<Props> = ({ timeline }) => {
    return (
        <div
            className="blue-orange-gantt-timeline"
            style={{ width: timeline.width, height: timeline.headerRows.length * HEADER_SCALE_HEIGHT }}
        >
            {timeline.headerRows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="blue-orange-gantt-timeline-row"
                    style={{ height: HEADER_SCALE_HEIGHT }}
                >
                    {row.map((cell, cellIndex) => (
                        <div
                            key={cellIndex}
                            className="blue-orange-gantt-timeline-cell"
                            style={{ left: cell.x, width: cell.width }}
                            title={cell.label}
                        >
                            <span className="blue-orange-gantt-timeline-cell-label">
                                {cell.label}
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
