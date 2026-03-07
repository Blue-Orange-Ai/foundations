import React, { useMemo } from 'react';
import moment from 'moment';
import { GanttViewMode } from '../types/GanttTypes';
import './GanttTimeline.css';

interface Props {
  startDate: Date;
  endDate: Date;
  viewMode: GanttViewMode;
  columnWidth: number;
}

const GanttTimeline: React.FC<Props> = ({ startDate, endDate, viewMode, columnWidth }) => {
  const columns = useMemo(() => {
    const result: string[] = [];
    const cursor = moment(startDate);
    const end = moment(endDate);

    if (viewMode === 'day') {
      while (cursor.isSameOrBefore(end, 'day')) {
        result.push(cursor.format('ddd D'));
        cursor.add(1, 'day');
      }
    } else if (viewMode === 'week') {
      cursor.startOf('isoWeek');
      while (cursor.isSameOrBefore(end, 'day')) {
        result.push(cursor.format('[W]W MMM'));
        cursor.add(1, 'week');
      }
    } else {
      cursor.startOf('month');
      while (cursor.isSameOrBefore(end, 'month')) {
        result.push(cursor.format('MMM YYYY'));
        cursor.add(1, 'month');
      }
    }

    return result;
  }, [startDate, endDate, viewMode]);

  return (
    <div className="blue-orange-gantt-timeline">
      {columns.map((label, index) => (
        <div
          key={index}
          className="blue-orange-gantt-timeline-cell"
          style={{ width: columnWidth + 'px', minWidth: columnWidth + 'px' }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default GanttTimeline;
