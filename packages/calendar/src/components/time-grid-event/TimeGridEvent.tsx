import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import {
    formatEventTimeRange,
    ITimedEventLayout,
    resolveEventColors,
} from '../../utils/calendarUtils';
import './TimeGridEvent.css';

interface Props {
    layout: ITimedEventLayout;
    sources?: ICalendarSource[];
    onClick?: (event: ICalendarEvent) => void;
}

/**
 * A timed event rendered as an absolutely positioned block inside a day column
 * of the week / day time-grid views.
 */
export const TimeGridEvent: React.FC<Props> = ({ layout, sources = [], onClick }) => {
    const { event, top, height, leftPercent, widthPercent } = layout;
    const colors = resolveEventColors(event, sources);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick(event);
        }
    };

    const style: React.CSSProperties = {
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${leftPercent}% + 2px)`,
        width: `calc(${widthPercent}% - 4px)`,
        backgroundColor: colors.backgroundColor,
        borderLeftColor: colors.borderColor,
        color: colors.color,
    };

    const compact = height < 34;

    return (
        <div
            className={`blue-orange-calendar-time-event no-select${
                compact ? ' blue-orange-calendar-time-event-compact' : ''
            }`}
            style={style}
            onClick={handleClick}
            title={`${event.title} (${formatEventTimeRange(event)})`}
        >
            <div className="blue-orange-calendar-time-event-title">{event.title}</div>
            {!compact && (
                <div className="blue-orange-calendar-time-event-time">
                    {formatEventTimeRange(event)}
                </div>
            )}
        </div>
    );
};
