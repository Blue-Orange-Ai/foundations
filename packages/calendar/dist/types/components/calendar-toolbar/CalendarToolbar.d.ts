import React from 'react';
import { CalendarView } from '../../interfaces/CalendarInterfaces';
import { WeekStartDay } from '../../utils/calendarUtils';
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
/**
 * The calendar header / toolbar: navigation controls, the current period title
 * and the view switcher. Built entirely from Foundations core buttons so it
 * matches the rest of the design system.
 */
export declare const CalendarToolbar: React.FC<Props>;
export {};
