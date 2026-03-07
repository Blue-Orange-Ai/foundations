import React from 'react';
import moment from 'moment';
import { IGanttItem, GanttViewMode } from '../types/GanttTypes';
import { SimpleTooltip } from '../../tooltips/simple-tooltip/SimpleTooltip';
import { dateToPixels } from '../utils/ganttUtils';
import './GanttBar.css';

interface Props {
    item: IGanttItem;
    chartStartDate: Date;
    columnWidth: number;
    viewMode: GanttViewMode;
    rowHeight: number;
    onClick?: (item: IGanttItem) => void;
}

export const GanttBar: React.FC<Props> = ({ item, chartStartDate, columnWidth, viewMode, rowHeight, onClick }) => {
    const left = dateToPixels(item.startDate, chartStartDate, viewMode, columnWidth);
    const width = dateToPixels(item.endDate, chartStartDate, viewMode, columnWidth) - left;
    const height = rowHeight * 0.7;
    const top = rowHeight * 0.15;
    const backgroundColor = item.color ?? '#4A90D9';

    const tooltipLabel =
        item.label +
        ' | ' +
        moment(item.startDate).format('DD MMM YYYY') +
        ' \u2192 ' +
        moment(item.endDate).format('DD MMM YYYY');

    return (
        <SimpleTooltip label={tooltipLabel}>
            <div
                className="blue-orange-gantt-bar"
                style={{ left, width, top, height, backgroundColor }}
                onClick={() => onClick?.(item)}
            >
                <span className="blue-orange-gantt-bar-label">{item.label}</span>
            </div>
        </SimpleTooltip>
    );
};
