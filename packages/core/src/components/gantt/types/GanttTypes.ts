export type GanttViewMode = 'day' | 'week' | 'month';

export interface IGanttDependency {
    fromId: string;
    toId: string;
}

export interface IGanttItem {
    id: string;
    label: string;
    startDate: Date;
    endDate: Date;
    color?: string;
    groupId?: string;
}

export interface IGanttGroup {
    id: string;
    label: string;
    parentGroupId?: string;
    defaultOpen?: boolean;
}
