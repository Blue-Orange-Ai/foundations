import React from 'react';
import moment from 'moment';
import { IGanttDependency, IGanttItem, GanttViewMode } from '../types/GanttTypes';
import './GanttDependencyLayer.css';

interface Props {
  dependencies: IGanttDependency[];
  items: IGanttItem[];
  chartStartDate: Date;
  columnWidth: number;
  viewMode: GanttViewMode;
  rowHeight: number;
  visibleItemIds: string[];
  timelineHeaderHeight: number;
}

function dateToPixels(date: Date, chartStart: Date, viewMode: GanttViewMode, columnWidth: number): number {
  const m = moment(date);
  const start = moment(chartStart);
  if (viewMode === 'day') return m.diff(start, 'days') * columnWidth;
  if (viewMode === 'week') return (m.diff(start, 'days') / 7) * columnWidth;
  return m.diff(start, 'months', true) * columnWidth;
}

export const GanttDependencyLayer: React.FC<Props> = ({
  dependencies,
  items,
  chartStartDate,
  columnWidth,
  viewMode,
  rowHeight,
  visibleItemIds,
  timelineHeaderHeight,
}) => {
  const paths = dependencies.map((dep, index) => {
    const { fromId, toId } = dep;

    const fromIndex = visibleItemIds.indexOf(fromId);
    const toIndex = visibleItemIds.indexOf(toId);

    if (fromIndex === -1 || toIndex === -1) {
      return null;
    }

    const fromItem = items.find((it) => it.id === fromId);
    const toItem = items.find((it) => it.id === toId);

    if (!fromItem || !toItem) {
      return null;
    }

    const fromX = dateToPixels(fromItem.endDate, chartStartDate, viewMode, columnWidth);
    const fromY = timelineHeaderHeight + fromIndex * rowHeight + rowHeight / 2;
    const toX = dateToPixels(toItem.startDate, chartStartDate, viewMode, columnWidth);
    const toY = timelineHeaderHeight + toIndex * rowHeight + rowHeight / 2;

    const midX = (fromX + toX) / 2;

    const d = `M ${fromX},${fromY} H ${midX} V ${toY} H ${toX}`;

    return (
      <path
        key={`${fromId}-${toId}-${index}`}
        d={d}
        stroke="#E74C3C"
        strokeWidth={1.5}
        fill="none"
        markerEnd="url(#gantt-arrow)"
      />
    );
  });

  return (
    <svg className="blue-orange-gantt-dependency-layer">
      <defs>
        <marker
          id="gantt-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill="#E74C3C" />
        </marker>
      </defs>
      {paths}
    </svg>
  );
};
