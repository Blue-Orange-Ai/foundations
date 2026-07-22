import React from 'react';
import { Checkbox, Month } from '@blue-orange-ai/foundations-core';
import { ICalendarSource } from '../../interfaces/CalendarInterfaces';
import './CalendarSidePanel.css';

interface Props {
    /** Date the mini calendar highlights — the calendar's anchor date. */
    date: Date;
    sources?: ICalendarSource[];
    /** Ids of the sources currently being shown in the main view. */
    visibleSourceIds?: string[];
    /** Heading above the source list. */
    sourcesLabel?: string;
    onDateSelect: (date: Date) => void;
    onSourceToggle?: (sourceId: string, visible: boolean) => void;
}

/**
 * The panel that slides in from the left of the calendar: a mini month picker
 * for jumping to a date, and the list of shared calendars that can be toggled
 * on and off. A plain fixed-width column rather than a `VerticalSplitPage`,
 * since it is not resizable.
 */
export const CalendarSidePanel: React.FC<Props> = ({
    date,
    sources = [],
    visibleSourceIds,
    sourcesLabel = 'Shared calendars',
    onDateSelect,
    onSourceToggle,
}) => {
    const isVisible = (source: ICalendarSource) =>
        visibleSourceIds === undefined || visibleSourceIds.includes(source.id);

    return (
        <div className="blue-orange-calendar-side-panel">
            {/* The core month picker, stripped of its popover chrome by the
                surrounding class — core itself is left untouched. */}
            <div className="blue-orange-calendar-side-panel-month">
                <Month
                    // Core syncs the grid to a new `date` but not its month /
                    // year heading, so remount it when the month changes to keep
                    // the picker following the main view.
                    key={`${date.getFullYear()}-${date.getMonth()}`}
                    date={date}
                    showTime={false}
                    sundayStart={true}
                    onSelection={onDateSelect}
                />
            </div>
            {sources.length > 0 && (
                <div className="blue-orange-calendar-side-panel-sources">
                    <div className="blue-orange-calendar-side-panel-heading no-select">
                        {sourcesLabel}
                    </div>
                    {sources.map((source) => (
                        <label
                            key={source.id}
                            className="blue-orange-calendar-side-panel-source no-select"
                        >
                            <Checkbox
                                checked={isVisible(source)}
                                onCheckboxChange={(checked) =>
                                    onSourceToggle && onSourceToggle(source.id, checked)
                                }
                            />
                            <span
                                className="blue-orange-calendar-side-panel-source-dot"
                                style={{
                                    backgroundColor:
                                        source.borderColor ?? source.color ?? undefined,
                                }}
                            />
                            <span className="blue-orange-calendar-side-panel-source-name">
                                {source.name}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};
