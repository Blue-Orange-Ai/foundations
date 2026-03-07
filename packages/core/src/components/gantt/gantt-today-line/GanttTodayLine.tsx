import React from 'react';
import { GanttViewMode } from '../types/GanttTypes';
import { SimpleTooltip } from '../../tooltips/simple-tooltip/SimpleTooltip';
import { dateToPixels } from '../utils/ganttUtils';
import './GanttTodayLine.css';

interface Props {
    chartStartDate: Date;
    chartEndDate: Date;
    columnWidth: number;
    viewMode: GanttViewMode;
    totalHeight: number;
}

export const GanttTodayLine: React.FC<Props> = ({ chartStartDate, chartEndDate, columnWidth, viewMode, totalHeight }) => {
    const today = new Date();

    if (today < chartStartDate || today > chartEndDate) {
        return null;
    }

    const left = dateToPixels(today, chartStartDate, viewMode, columnWidth);

    return (
        <div className="blue-orange-gantt-today-line-wrapper" style={{ left }}>
            <SimpleTooltip label="Today">
                <div
                    className="blue-orange-gantt-today-line"
                    style={{ height: totalHeight }}
                />
            </SimpleTooltip>
        </div>
    );
};
