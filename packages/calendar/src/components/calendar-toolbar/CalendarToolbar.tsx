import React from 'react';
import {
    Button,
    ButtonIcon,
    ButtonSize,
    ButtonType,
} from '@blue-orange-ai/foundations-core';
import { CalendarView } from '../../interfaces/CalendarInterfaces';
import { formatViewTitle, WeekStartDay } from '../../utils/calendarUtils';
import './CalendarToolbar.css';

interface Props {
    date: Date;
    view: CalendarView;
    /** IANA timezone the title is rendered in. Defaults to the browser's zone. */
    timezone?: string;
    /** Day the week starts on, used to build the week-view title span. */
    weekStartsOn?: WeekStartDay;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    onViewChange: (view: CalendarView) => void;
    /** When provided, a primary "New event" button is shown. */
    onCreate?: () => void;
    /** When provided, a hamburger button toggling the side panel is shown. */
    onToggleSidePanel?: () => void;
}

const VIEW_OPTIONS: { view: CalendarView; label: string }[] = [
    { view: CalendarView.MONTH, label: 'Month' },
    { view: CalendarView.WEEK, label: 'Week' },
    { view: CalendarView.DAY, label: 'Day' },
];

/**
 * The calendar header / toolbar: navigation controls, the current period title
 * and the view switcher. Built entirely from Foundations core buttons so it
 * matches the rest of the design system.
 */
export const CalendarToolbar: React.FC<Props> = ({
    date,
    view,
    timezone,
    weekStartsOn = 0,
    onPrev,
    onNext,
    onToday,
    onViewChange,
    onCreate,
    onToggleSidePanel,
}) => {
    return (
        <div className="blue-orange-calendar-toolbar">
            <div className="blue-orange-calendar-toolbar-left">
                {onToggleSidePanel && (
                    <ButtonIcon
                        icon="ri-menu-line"
                        label="Calendars"
                        size={ButtonSize.SMALL}
                        onClick={onToggleSidePanel}
                    />
                )}
                <Button
                    text="Today"
                    buttonType={ButtonType.SECONDARY}
                    size={ButtonSize.SMALL}
                    onClick={onToday}
                />
                <div className="blue-orange-calendar-toolbar-nav">
                    <ButtonIcon
                        icon="ri-arrow-left-s-line"
                        label="Previous"
                        size={ButtonSize.SMALL}
                        onClick={onPrev}
                    />
                    <ButtonIcon
                        icon="ri-arrow-right-s-line"
                        label="Next"
                        size={ButtonSize.SMALL}
                        onClick={onNext}
                    />
                </div>
                <div className="blue-orange-calendar-toolbar-title no-select">
                    {formatViewTitle(date, view, timezone, weekStartsOn)}
                </div>
            </div>
            <div className="blue-orange-calendar-toolbar-right">
                <div className="blue-orange-calendar-toolbar-views">
                    {VIEW_OPTIONS.map((option) => {
                        const active = option.view === view;
                        return (
                            <Button
                                // The core Button caches its class name in state
                                // and only refreshes it when `isLoading` changes,
                                // so a changed `buttonType` alone never repaints
                                // it. Keying on `active` remounts the button so
                                // the selected view actually looks selected.
                                key={`${option.view}-${active}`}
                                text={option.label}
                                buttonType={active ? ButtonType.PRIMARY : ButtonType.SECONDARY}
                                size={ButtonSize.SMALL}
                                onClick={() => onViewChange(option.view)}
                            />
                        );
                    })}
                </div>
                {onCreate && (
                    <Button
                        text="New event"
                        icon="ri-add-line"
                        buttonType={ButtonType.PRIMARY}
                        size={ButtonSize.SMALL}
                        onClick={onCreate}
                    />
                )}
            </div>
        </div>
    );
};
