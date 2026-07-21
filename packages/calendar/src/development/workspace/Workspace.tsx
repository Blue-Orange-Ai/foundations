import React, { useState } from 'react';
import { Button, ButtonType, ButtonSize } from '@blue-orange-ai/foundations-core';
import { Calendar } from '../../components/calendar/Calendar';
import { CalendarView, ICalendarEvent } from '../../interfaces/CalendarInterfaces';
import { mockEvents, mockSources } from '../data/mockData';
import './Workspace.css';

/**
 * Local development harness for the calendar package. Renders the {@link Calendar}
 * with mock data and a light/dark theme toggle so components can be previewed in
 * the browser via `npm start`. This file is not part of the library build.
 */
export const Workspace: React.FC = () => {
    const [dark, setDark] = useState(false);
    const [events, setEvents] = useState<ICalendarEvent[]>(mockEvents);

    const handleDelete = (event: ICalendarEvent) => {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
    };

    return (
        <div className={`calendar-workspace${dark ? ' dark' : ''}`}>
            <div className="calendar-workspace-topbar">
                <span className="calendar-workspace-title">Foundations Calendar</span>
                <Button
                    text={dark ? 'Light mode' : 'Dark mode'}
                    icon={dark ? 'ri-sun-line' : 'ri-moon-line'}
                    buttonType={ButtonType.SECONDARY}
                    size={ButtonSize.SMALL}
                    onClick={() => setDark((d) => !d)}
                />
            </div>
            <div className="calendar-workspace-stage">
                <Calendar
                    events={events}
                    sources={mockSources}
                    defaultView={CalendarView.WEEK}
                    onEventDelete={handleDelete}
                    onCreate={() => {
                        /* Wire up a create flow in a real app. */
                    }}
                />
            </div>
        </div>
    );
};
