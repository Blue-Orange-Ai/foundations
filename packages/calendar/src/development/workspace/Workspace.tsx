import React, { useState } from 'react';
import { Button, ButtonType, ButtonSize, Toggle } from '@blue-orange-ai/foundations-core';
import { Calendar } from '../../components/calendar/Calendar';
import {
    CalendarSourceLayout,
    CalendarView,
    ICalendarEvent,
} from '../../interfaces/CalendarInterfaces';
import { CURRENT_USER, mockEvents, mockSources } from '../data/mockData';
import './Workspace.css';

/**
 * Local development harness for the calendar package. Renders the {@link Calendar}
 * with mock data and a light/dark theme toggle so components can be previewed in
 * the browser via `npm start`. This file is not part of the library build.
 */
export const Workspace: React.FC = () => {
    const [dark, setDark] = useState(false);
    const [halfHourSlots, setHalfHourSlots] = useState(false);
    const [mondayStart, setMondayStart] = useState(false);
    // Start with the calendars laid out side by side, and a single calendar
    // selected — toggling more on in the side panel adds their grids alongside.
    const [sideBySide, setSideBySide] = useState(true);
    const [emailCompatibility, setEmailCompatibility] = useState(false);
    const [events, setEvents] = useState<ICalendarEvent[]>(mockEvents);
    const [visibleSources, setVisibleSources] = useState<string[]>([mockSources[0].id]);

    const handleDelete = (event: ICalendarEvent) => {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
    };

    const handleCreate = (event: ICalendarEvent) => {
        setEvents((prev) => [...prev, event]);
    };

    const handleUpdate = (event: ICalendarEvent) => {
        setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    };

    const handleRespond = (event: ICalendarEvent, response: ICalendarEvent['response']) => {
        setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, response } : e)));
    };

    const handleReminderChange = (event: ICalendarEvent, reminderMinutes: number | null) => {
        setEvents((prev) =>
            prev.map((e) => (e.id === event.id ? { ...e, reminderMinutes } : e))
        );
    };

    const handleColorChange = (event: ICalendarEvent, color: string) => {
        setEvents((prev) =>
            prev.map((e) => (e.id === event.id ? { ...e, color, borderColor: color } : e))
        );
    };

    return (
        <div className={`calendar-workspace${dark ? ' dark' : ''}`}>
            <div className="calendar-workspace-topbar">
                <span className="calendar-workspace-title">Foundations Calendar</span>
                <div className="calendar-workspace-controls">
                    <label className="calendar-workspace-control">
                        <span className="calendar-workspace-control-label">30 min slots</span>
                        <Toggle checked={halfHourSlots} onChange={setHalfHourSlots} />
                    </label>
                    <label className="calendar-workspace-control">
                        <span className="calendar-workspace-control-label">Start Monday</span>
                        <Toggle checked={mondayStart} onChange={setMondayStart} />
                    </label>
                    <label className="calendar-workspace-control">
                        <span className="calendar-workspace-control-label">
                            Calendars side by side
                        </span>
                        <Toggle checked={sideBySide} onChange={setSideBySide} />
                    </label>
                    <label className="calendar-workspace-control">
                        <span className="calendar-workspace-control-label">Email guests</span>
                        <Toggle checked={emailCompatibility} onChange={setEmailCompatibility} />
                    </label>
                    <Button
                        text={dark ? 'Light mode' : 'Dark mode'}
                        icon={dark ? 'ri-sun-line' : 'ri-moon-line'}
                        buttonType={ButtonType.SECONDARY}
                        size={ButtonSize.SMALL}
                        onClick={() => setDark((d) => !d)}
                    />
                </div>
            </div>
            <div className="calendar-workspace-stage">
                <Calendar
                    events={events}
                    sources={mockSources}
                    defaultView={CalendarView.WEEK}
                    slotMinutes={halfHourSlots ? 30 : 60}
                    weekStartsOn={mondayStart ? 1 : 0}
                    sourceLayout={
                        sideBySide
                            ? CalendarSourceLayout.SIDE_BY_SIDE
                            : CalendarSourceLayout.OVERLAY
                    }
                    emailCompatibility={emailCompatibility}
                    currentUser={CURRENT_USER}
                    visibleSourceIds={visibleSources}
                    onVisibleSourcesChange={setVisibleSources}
                    defaultSidePanelOpen={true}
                    onEventDelete={handleDelete}
                    onEventCreate={handleCreate}
                    onEventUpdate={handleUpdate}
                    onEventRespond={handleRespond}
                    onEventReminderChange={handleReminderChange}
                    onEventColorChange={handleColorChange}
                />
            </div>
        </div>
    );
};
