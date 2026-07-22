import React, { useState } from 'react';
import { Button, ButtonType, ButtonSize, Toggle } from '@blue-orange-ai/foundations-core';
import { Calendar } from '../../components/calendar/Calendar';
import {
    CalendarSeriesScope,
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

    const handleDelete = (
        event: ICalendarEvent,
        _scope?: unknown,
        seriesScope?: CalendarSeriesScope
    ) => {
        const masterId = event.recurringEventId ?? event.id;
        setEvents((prev) => {
            // Whole series (or a plain, non-repeating event): drop the master.
            if (!seriesScope || seriesScope === CalendarSeriesScope.SERIES) {
                return prev.filter((e) => e.id !== masterId);
            }
            // A single occurrence: exclude its start from the master's rule.
            return prev.map((e) =>
                e.id === masterId && e.recurrence
                    ? {
                          ...e,
                          recurrence: {
                              ...e.recurrence,
                              exDates: [...(e.recurrence.exDates ?? []), event.start],
                          },
                      }
                    : e
            );
        });
    };

    const handleCreate = (event: ICalendarEvent) => {
        setEvents((prev) => [...prev, event]);
    };

    const handleUpdate = (
        event: ICalendarEvent,
        meta?: { scope?: CalendarSeriesScope; occurrenceStart?: Date }
    ) => {
        const masterId = event.recurringEventId ?? event.id;
        setEvents((prev) => {
            // Not a recurring edit: replace the event outright.
            if (!meta?.scope) {
                return prev.map((e) => (e.id === masterId ? { ...event, id: masterId } : e));
            }
            // Whole series: apply the edited details to the master, keeping its
            // own schedule and recurrence so every occurrence still generates.
            if (meta.scope === CalendarSeriesScope.SERIES) {
                return prev.map((e) =>
                    e.id === masterId
                        ? {
                              ...e,
                              title: event.title,
                              body: event.body,
                              location: event.location,
                              color: event.color,
                              borderColor: event.borderColor,
                              availability: event.availability,
                              reminderMinutes: event.reminderMinutes,
                              requiredGuests: event.requiredGuests,
                              optionalGuests: event.optionalGuests,
                              conferencingProvider: event.conferencingProvider,
                          }
                        : e
                );
            }
            // Single occurrence: exclude the original occurrence from the series
            // and add the edited copy as a standalone, non-repeating event.
            const standalone: ICalendarEvent = {
                ...event,
                id: `${masterId}-exc-${(meta.occurrenceStart ?? event.start).getTime()}`,
                recurrence: undefined,
                recurringEventId: undefined,
            };
            const next = prev.map((e) =>
                e.id === masterId && e.recurrence
                    ? {
                          ...e,
                          recurrence: {
                              ...e.recurrence,
                              exDates: [
                                  ...(e.recurrence.exDates ?? []),
                                  meta.occurrenceStart ?? event.start,
                              ],
                          },
                      }
                    : e
            );
            return [...next, standalone];
        });
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
