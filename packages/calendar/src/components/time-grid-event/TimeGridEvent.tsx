import React from 'react';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import {
    EVENT_RIGHT_GUTTER,
    eventResponseClass,
    eventResponseState,
    formatEventTimeRange,
    ITimedEventLayout,
    resolveEventColors,
} from '../../utils/calendarUtils';
import { EventAvailabilityMark } from '../event-availability-mark/EventAvailabilityMark';
import './TimeGridEvent.css';

interface Props {
    layout: ITimedEventLayout;
    sources?: ICalendarSource[];
    /** IANA timezone the times are shown in. Defaults to the browser's zone. */
    timezone?: string;
    /** Viewer's email, used to fade events not yet accepted. */
    currentUser?: string;
    /** Dims the block while its ghost is being dragged to a new slot. */
    dimmed?: boolean;
    /** Called on mouse down, letting the grid start a move-drag of this event. */
    onMouseDown?: (event: ICalendarEvent, e: React.MouseEvent) => void;
    onClick?: (event: ICalendarEvent) => void;
}

/**
 * A timed event rendered as an absolutely positioned block inside a day column
 * of the week / day time-grid views.
 */
export const TimeGridEvent: React.FC<Props> = ({
    layout,
    sources = [],
    timezone,
    currentUser,
    dimmed = false,
    onMouseDown,
    onClick,
}) => {
    const { event, top, height, leftPercent, widthPercent } = layout;
    const colors = resolveEventColors(event, sources);
    const responseState = eventResponseState(event, currentUser);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick(event);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (onMouseDown) {
            onMouseDown(event, e);
        }
    };

    // Events are laid out across the column minus a fixed gutter on the right, so
    // there is always a strip of bare column left to click on to create an event.
    const span = `(100% - ${EVENT_RIGHT_GUTTER}px)`;

    const style: React.CSSProperties = {
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${leftPercent / 100} * ${span} + 2px)`,
        width: `calc(${widthPercent / 100} * ${span} - 4px)`,
        backgroundColor: colors.backgroundColor,
        borderLeftColor: colors.borderColor,
        color: colors.color,
        ...(dimmed ? { opacity: 0.35 } : null),
        ...(onMouseDown ? { cursor: 'grab' } : null),
    };

    const compact = height < 34;

    return (
        <div
            className={`blue-orange-calendar-time-event no-select${
                compact ? ' blue-orange-calendar-time-event-compact' : ''
            }${eventResponseClass('blue-orange-calendar-time-event', responseState)}`}
            style={style}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            title={`${event.title} (${formatEventTimeRange(event, timezone)})`}
        >
            <div className="blue-orange-calendar-time-event-title">
                <EventAvailabilityMark
                    availability={event.availability}
                    color={colors.borderColor}
                />
                <span className="blue-orange-calendar-time-event-title-text">{event.title}</span>
            </div>
            {!compact && (
                <div className="blue-orange-calendar-time-event-time">
                    {formatEventTimeRange(event, timezone)}
                </div>
            )}
        </div>
    );
};
