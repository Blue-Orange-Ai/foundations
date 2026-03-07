import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { IGanttItem, IGanttGroup, IGanttDependency, GanttViewMode } from '../types/GanttTypes';
import { GanttTimeline } from '../gantt-timeline/GanttTimeline';
import { GanttRow } from '../gantt-row/GanttRow';
import { GanttGroup } from '../gantt-group/GanttGroup';
import { GanttDependencyLayer } from '../gantt-dependency-layer/GanttDependencyLayer';
import { GanttTodayLine } from '../gantt-today-line/GanttTodayLine';
import './GanttChart.css';

interface Props {
  items: IGanttItem[];
  groups?: IGanttGroup[];
  dependencies?: IGanttDependency[];
  viewMode?: GanttViewMode;
  showTodayLine?: boolean;
  labelPanelWidth?: number;
  columnWidth?: number;
  rowHeight?: number;
  onBarClick?: (item: IGanttItem) => void;
}

const DEFAULT_COLUMN_WIDTHS: Record<GanttViewMode, number> = {
  day: 40,
  week: 120,
  month: 160,
};

export const GanttChart: React.FC<Props> = ({
  items,
  groups = [],
  dependencies = [],
  viewMode = 'week',
  showTodayLine = true,
  labelPanelWidth = 240,
  columnWidth,
  rowHeight = 40,
  onBarClick,
}) => {
  const effectiveColumnWidth = columnWidth ?? DEFAULT_COLUMN_WIDTHS[viewMode];

  const chartStartDate = useMemo(() => {
    if (items.length === 0) return new Date();
    const minDate = moment.min(items.map(i => moment(i.startDate)));
    if (viewMode === 'day') return minDate.clone().subtract(1, 'day').startOf('day').toDate();
    if (viewMode === 'week') return minDate.clone().subtract(1, 'week').startOf('week').toDate();
    return minDate.clone().subtract(1, 'month').startOf('month').toDate();
  }, [items, viewMode]);

  const chartEndDate = useMemo(() => {
    if (items.length === 0) return new Date();
    const maxDate = moment.max(items.map(i => moment(i.endDate)));
    if (viewMode === 'day') return maxDate.clone().add(1, 'day').endOf('day').toDate();
    if (viewMode === 'week') return maxDate.clone().add(1, 'week').endOf('week').toDate();
    return maxDate.clone().add(1, 'month').endOf('month').toDate();
  }, [items, viewMode]);

  const [groupOpenState, setGroupOpenState] = useState<Record<string, boolean>>(() => {
    return Object.fromEntries(groups.map(g => [g.id, g.defaultOpen ?? true]));
  });

  const toggleGroup = (groupId: string) => {
    setGroupOpenState(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const timelineHeaderHeight = 40;

  const topLevelGroups = useMemo(() => groups.filter(g => !g.parentGroupId), [groups]);
  const ungroupedItems = useMemo(() => items.filter(i => !i.groupId), [items]);

  // Collect visible item IDs by walking the render tree
  const visibleItemIds = useMemo(() => {
    const ids: string[] = [];

    const collectGroupItems = (group: IGanttGroup) => {
      if (!groupOpenState[group.id]) return;
      items.filter(i => i.groupId === group.id).forEach(i => ids.push(i.id));
      groups.filter(g => g.parentGroupId === group.id).forEach(child => collectGroupItems(child));
    };

    topLevelGroups.forEach(g => collectGroupItems(g));
    ungroupedItems.forEach(i => ids.push(i.id));

    return ids;
  }, [items, groups, groupOpenState, topLevelGroups, ungroupedItems]);

  const totalChartBodyHeight = visibleItemIds.length * rowHeight;

  const renderGroup = (group: IGanttGroup, depth: number): React.ReactNode => {
    const isOpen = groupOpenState[group.id] ?? true;
    const childItems = items.filter(i => i.groupId === group.id);
    const childGroups = groups.filter(g => g.parentGroupId === group.id);

    return (
      <GanttGroup
        key={group.id}
        group={group}
        labelPanelWidth={labelPanelWidth}
        rowHeight={rowHeight}
        indentLevel={depth}
        isOpen={isOpen}
        onToggle={() => toggleGroup(group.id)}
      >
        {isOpen && (
          <>
            {childItems.map(item => (
              <GanttRow
                key={item.id}
                item={item}
                labelPanelWidth={labelPanelWidth}
                chartStartDate={chartStartDate}
                chartEndDate={chartEndDate}
                columnWidth={effectiveColumnWidth}
                viewMode={viewMode}
                rowHeight={rowHeight}
                indentLevel={depth + 1}
                onClick={onBarClick}
              />
            ))}
            {childGroups.map(child => renderGroup(child, depth + 1))}
          </>
        )}
      </GanttGroup>
    );
  };

  return (
    <div className="blue-orange-gantt-chart">
      <div className="blue-orange-gantt-chart-header-row">
        <div
          className="blue-orange-gantt-chart-label-header"
          style={{ width: labelPanelWidth, minWidth: labelPanelWidth }}
        />
        <div className="blue-orange-gantt-chart-timeline-scroll">
          <GanttTimeline
            startDate={chartStartDate}
            endDate={chartEndDate}
            viewMode={viewMode}
            columnWidth={effectiveColumnWidth}
          />
        </div>
      </div>

      <div className="blue-orange-gantt-chart-body">
        <div className="blue-orange-gantt-chart-timeline-panel">
          {topLevelGroups.map(group => renderGroup(group, 0))}
          {ungroupedItems.map(item => (
            <GanttRow
              key={item.id}
              item={item}
              labelPanelWidth={labelPanelWidth}
              chartStartDate={chartStartDate}
              chartEndDate={chartEndDate}
              columnWidth={effectiveColumnWidth}
              viewMode={viewMode}
              rowHeight={rowHeight}
              indentLevel={0}
              onClick={onBarClick}
            />
          ))}

          <GanttDependencyLayer
            dependencies={dependencies}
            items={items}
            chartStartDate={chartStartDate}
            columnWidth={effectiveColumnWidth}
            viewMode={viewMode}
            rowHeight={rowHeight}
            visibleItemIds={visibleItemIds}
            timelineHeaderHeight={timelineHeaderHeight}
          />

          {showTodayLine && (
            <GanttTodayLine
              chartStartDate={chartStartDate}
              chartEndDate={chartEndDate}
              columnWidth={effectiveColumnWidth}
              viewMode={viewMode}
              totalHeight={totalChartBodyHeight}
            />
          )}
        </div>
      </div>
    </div>
  );
};
