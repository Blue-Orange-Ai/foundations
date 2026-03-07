import moment from 'moment';
import { GanttViewMode } from '../types/GanttTypes';

export function dateToPixels(date: Date, chartStart: Date, viewMode: GanttViewMode, columnWidth: number): number {
    const m = moment(date);
    const start = moment(chartStart);
    if (viewMode === 'day') return m.diff(start, 'days') * columnWidth;
    if (viewMode === 'week') return (m.diff(start, 'days') / 7) * columnWidth;
    return m.diff(start, 'months', true) * columnWidth;
}
