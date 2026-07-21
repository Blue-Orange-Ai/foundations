import moment from 'moment';
import {
    CalendarEventCategory,
    ICalendarEvent,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';

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
    },
    {
        id: '2',
        calendarId: 'work',
        title: 'Design Review',
        start: atWeek(1, 13, 0),
        end: atWeek(1, 14, 30),
        category: CalendarEventCategory.TIME,
        body: 'Walk through the new calendar package UI.',
        location: 'Room 4',
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
    },
    {
        id: '5',
        calendarId: 'personal',
        title: 'Lunch with Sam',
        start: atWeek(3, 12, 0),
        end: atWeek(3, 13, 0),
        category: CalendarEventCategory.TIME,
        location: 'The Deli',
    },
    {
        id: '6',
        calendarId: 'work',
        title: 'Sprint Planning',
        start: atWeek(3, 14, 0),
        end: atWeek(3, 15, 30),
        category: CalendarEventCategory.TIME,
    },
    {
        id: '7',
        calendarId: 'personal',
        title: 'Gym',
        start: atWeek(4, 18, 0),
        end: atWeek(4, 19, 0),
        category: CalendarEventCategory.TIME,
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
