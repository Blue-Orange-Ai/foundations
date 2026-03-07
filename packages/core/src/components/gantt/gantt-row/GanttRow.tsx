import React from 'react';
import moment from 'moment';
import { IGanttItem, GanttViewMode } from '../types/GanttTypes';
import { GanttBar } from '../gantt-bar/GanttBar';
import './GanttRow.css';

interface Props {
  item: IGanttItem;
  labelPanelWidth: number;
  chartStartDate: Date;
  chartEndDate: Date;
  columnWidth: number;
  viewMode: GanttViewMode;
  rowHeight: number;
  indentLevel: number;
  onClick?: (item: IGanttItem) => void;
}

function dateToPixels(
  date: Date,
  chartStart: Date,
  viewMode: GanttViewMode,
  columnWidth: number
): number {
  const m = moment(date);
  const start = moment(chartStart);
  if (viewMode === 'day') return m.diff(start, 'days') * columnWidth;
  if (viewMode === 'week') return (m.diff(start, 'days') / 7) * columnWidth;
  return m.diff(start, 'months', true) * columnWidth;
}

function getColumnCount(
  chartStartDate: Date,
  chartEndDate: Date,
  viewMode: GanttViewMode
): number {
  const start = moment(chartStartDate);
  const end = moment(chartEndDate);
  if (viewMode === 'day') return end.diff(start, 'days');
  if (viewMode === 'week') return Math.ceil(end.diff(start, 'days') / 7);
  return Math.ceil(end.diff(start, 'months', true));
}

export const GanttRow: React.FC<Props> = ({
  item,
  labelPanelWidth,
  chartStartDate,
  chartEndDate,
  columnWidth,
  viewMode,
  rowHeight,
  indentLevel,
  onClick,
}) => {
  const columnCount = getColumnCount(chartStartDate, chartEndDate, viewMode);
  // Each column boundary is simply i * columnWidth pixels from the start.
  const columnLines = Array.from({ length: columnCount }, (_, i) => i * columnWidth);

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div
      className="blue-orange-gantt-row"
      style={{ height: rowHeight + 'px' }}
      onClick={handleClick}
    >
      <div
        className="blue-orange-gantt-row-label-panel"
        style={{
          width: labelPanelWidth + 'px',
          minWidth: labelPanelWidth + 'px',
          paddingLeft: (12 + indentLevel * 16) + 'px',
        }}
      >
        <span className="blue-orange-gantt-row-label">{item.label}</span>
      </div>
      <div
        className="blue-orange-gantt-row-timeline"
      >
        {columnLines.map((left, i) => (
          <div
            key={i}
            className="blue-orange-gantt-col-line"
            style={{ left: left + 'px' }}
          />
        ))}
        <GanttBar
          item={item}
          chartStartDate={chartStartDate}
          columnWidth={columnWidth}
          viewMode={viewMode}
          rowHeight={rowHeight}
          onClick={onClick}
        />
      </div>
    </div>
  );
};
