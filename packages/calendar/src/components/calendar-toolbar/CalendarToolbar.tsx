import React from 'react';
import {
    Button,
    ButtonIcon,
    ButtonSize,
    ButtonType,
} from '@blue-orange-ai/foundations-core';
import { CalendarView } from '../../interfaces/CalendarInterfaces';
import { formatViewTitle } from '../../utils/calendarUtils';
import './CalendarToolbar.css';

interface Props {
    date: Date;
    view: CalendarView;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    onViewChange: (view: CalendarView) => void;
    /** When provided, a primary "New event" button is shown. */
    onCreate?: () => void;
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
    onPrev,
    onNext,
    onToday,
    onViewChange,
    onCreate,
}) => {
    return (
        <div className="blue-orange-calendar-toolbar">
            <div className="blue-orange-calendar-toolbar-left">
                <Button
                    text="Today"
                    buttonType={ButtonType.SECONDARY}
                    size={ButtonSize.SMALL}
                    onClick={onToday}
                />
                <div className="blue-orange-calendar-toolbar-nav">
                    <ButtonIcon icon="ri-arrow-left-s-line" label="Previous" onClick={onPrev} />
                    <ButtonIcon icon="ri-arrow-right-s-line" label="Next" onClick={onNext} />
                </div>
                <div className="blue-orange-calendar-toolbar-title no-select">
                    {formatViewTitle(date, view)}
                </div>
            </div>
            <div className="blue-orange-calendar-toolbar-right">
                <div className="blue-orange-calendar-toolbar-views">
                    {VIEW_OPTIONS.map((option) => (
                        <Button
                            key={option.view}
                            text={option.label}
                            buttonType={
                                option.view === view ? ButtonType.PRIMARY : ButtonType.SECONDARY
                            }
                            size={ButtonSize.SMALL}
                            onClick={() => onViewChange(option.view)}
                        />
                    ))}
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
