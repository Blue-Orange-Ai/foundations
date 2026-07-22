import moment from 'moment';
import {
    CalendarEventAvailability,
    CalendarEventCategory,
    CalendarEventResponse,
    CalendarRecurrenceFrequency,
    ICalendarEvent,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';

/** The signed-in user in the dev harness; events they organise are "theirs". */
export const CURRENT_USER = 'me@blueorange.ai';

export const mockSources: ICalendarSource[] = [
    {
        id: 'work',
        name: 'Work',
        color: '#1e40af',
        backgroundColor: '#ebf0fb',
        borderColor: 'dodgerblue',
    },
    {
        id: 'personal',
        name: 'Personal',
        color: '#166534',
        backgroundColor: '#dcfce7',
        borderColor: '#16a34b',
    },
    {
        id: 'focus',
        name: 'Focus',
        color: '#9a3412',
        backgroundColor: '#ffedd5',
        borderColor: '#f97317',
    },
];

/**
 * Builds a Date anchored to the current week so the development view always
 * shows populated data regardless of when it is opened. `dayOffset` is relative
 * to the start (Sunday) of the current week.
 */
const atWeek = (dayOffset: number, hour: number, minute = 0): Date =>
    moment().startOf('week').add(dayOffset, 'days').hour(hour).minute(minute).second(0).toDate();

export const mockEvents: ICalendarEvent[] = [
    {
        id: '1',
        calendarId: 'work',
        title: 'Team Standup',
        start: atWeek(1, 9, 0),
        end: atWeek(1, 9, 30),
        category: CalendarEventCategory.TIME,
        location: 'Zoom',
        // Organised by the viewer: always "accepted", editable and draggable.
        organizer: CURRENT_USER,
        reminderMinutes: 10,
        requiredGuests: ['alex@blueorange.ai', 'sam@blueorange.ai'],
        optionalGuests: ['jo@blueorange.ai'],
        // Repeats every weekday, Monday to Friday.
        recurrence: { frequency: CalendarRecurrenceFrequency.WEEKDAY },
    },
    {
        id: '2',
        calendarId: 'work',
        title: 'Design Review',
        start: atWeek(1, 13, 0),
        end: atWeek(1, 14, 30),
        category: CalendarEventCategory.TIME,
        body: '<p>Walk through the new calendar package UI.</p>',
        location: 'Room 4',
        // An invitation the viewer has not answered yet: renders faded.
        organizer: 'alex@blueorange.ai',
        response: CalendarEventResponse.NEEDS_ACTION,
        requiredGuests: [CURRENT_USER, 'alex@blueorange.ai'],
    },
    {
        id: '3',
        calendarId: 'focus',
        title: 'Deep Work: Calendar package',
        start: atWeek(2, 10, 0),
        end: atWeek(2, 12, 30),
        category: CalendarEventCategory.TIME,
    },
    {
        id: '4',
        calendarId: 'work',
        title: '1:1 with Alex',
        start: atWeek(2, 11, 0),
        end: atWeek(2, 11, 45),
        category: CalendarEventCategory.TIME,
        // Tentatively accepted: also renders faded until confirmed.
        organizer: 'alex@blueorange.ai',
        response: CalendarEventResponse.TENTATIVE,
    },
    {
        id: '5',
        calendarId: 'personal',
        title: 'Lunch with Sam',
        start: atWeek(3, 12, 0),
        end: atWeek(3, 13, 0),
        category: CalendarEventCategory.TIME,
        location: 'The Deli',
        // The viewer's own event, marked free rather than busy.
        organizer: CURRENT_USER,
        availability: CalendarEventAvailability.FREE,
    },
    {
        id: '6',
        calendarId: 'work',
        title: 'Sprint Planning',
        start: atWeek(3, 14, 0),
        end: atWeek(3, 15, 30),
        category: CalendarEventCategory.TIME,
        // Declined: shown faded and struck through.
        organizer: 'jo@blueorange.ai',
        response: CalendarEventResponse.DECLINED,
    },
    {
        id: '7',
        calendarId: 'personal',
        title: 'Gym',
        start: atWeek(4, 18, 0),
        end: atWeek(4, 19, 0),
        category: CalendarEventCategory.TIME,
        organizer: CURRENT_USER,
        // Repeats weekly on this weekday.
        recurrence: { frequency: CalendarRecurrenceFrequency.WEEKLY },
    },
    {
        id: '8',
        calendarId: 'work',
        title: 'Company Offsite',
        start: moment().startOf('week').add(4, 'days').startOf('day').toDate(),
        end: moment().startOf('week').add(5, 'days').endOf('day').toDate(),
        isAllday: true,
    },
    {
        id: '9',
        calendarId: 'focus',
        title: 'Review PRs',
        start: atWeek(2, 16, 0),
        end: atWeek(2, 17, 0),
        category: CalendarEventCategory.TIME,
    },
    {
        id: '10',
        calendarId: 'personal',
        title: 'Dentist',
        start: atWeek(5, 9, 30),
        end: atWeek(5, 10, 30),
        category: CalendarEventCategory.TIME,
    },
];
