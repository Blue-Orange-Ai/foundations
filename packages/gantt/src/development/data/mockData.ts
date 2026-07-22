import moment from 'moment';
import {
    GanttLinkType,
    GanttTaskType,
    IGanttLink,
    IGanttTask,
} from '../../interfaces/GanttInterfaces';

/** A date `offset` days from the start of the current month, at midnight. */
const day = (offset: number): Date =>
    moment().startOf('month').add(offset, 'days').toDate();

/**
 * A realistic mock project used by the development workspace: a couple of
 * summary phases with nested tasks, a milestone and a chain of dependencies.
 */
export const mockTasks: IGanttTask[] = [
    { id: 'p1', text: 'Discovery', type: GanttTaskType.SUMMARY, open: true },
    { id: 't1', text: 'Stakeholder interviews', parent: 'p1', start: day(1), duration: 4, progress: 100 },
    { id: 't2', text: 'Requirements doc', parent: 'p1', start: day(5), duration: 3, progress: 80 },
    { id: 'm1', text: 'Sign-off', parent: 'p1', type: GanttTaskType.MILESTONE, start: day(8) },

    { id: 'p2', text: 'Design', type: GanttTaskType.SUMMARY, open: true },
    { id: 't3', text: 'Wireframes', parent: 'p2', start: day(9), duration: 5, progress: 60 },
    { id: 't4', text: 'Visual design', parent: 'p2', start: day(13), duration: 6, progress: 30 },
    { id: 't5', text: 'Design review', parent: 'p2', start: day(19), duration: 2, progress: 0 },

    { id: 'p3', text: 'Build', type: GanttTaskType.SUMMARY, open: true },
    { id: 't6', text: 'Front-end', parent: 'p3', start: day(20), duration: 10, progress: 10 },
    { id: 't7', text: 'Back-end', parent: 'p3', start: day(20), duration: 12, progress: 5 },
    { id: 't8', text: 'Integration', parent: 'p3', start: day(32), duration: 4, progress: 0 },
    { id: 'm2', text: 'Launch', type: GanttTaskType.MILESTONE, start: day(37) },
];

export const mockLinks: IGanttLink[] = [
    { id: 'l1', source: 't1', target: 't2', type: GanttLinkType.END_TO_START },
    { id: 'l2', source: 't2', target: 'm1', type: GanttLinkType.END_TO_START },
    { id: 'l3', source: 'm1', target: 't3', type: GanttLinkType.END_TO_START },
    { id: 'l4', source: 't3', target: 't4', type: GanttLinkType.END_TO_START },
    { id: 'l5', source: 't4', target: 't5', type: GanttLinkType.END_TO_START },
    { id: 'l6', source: 't5', target: 't6', type: GanttLinkType.END_TO_START },
    { id: 'l7', source: 't5', target: 't7', type: GanttLinkType.END_TO_START },
    { id: 'l8', source: 't6', target: 't8', type: GanttLinkType.END_TO_START },
    { id: 'l9', source: 't7', target: 't8', type: GanttLinkType.END_TO_START },
    { id: 'l10', source: 't8', target: 'm2', type: GanttLinkType.END_TO_START },
];
