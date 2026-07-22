import {
    effectiveResponse,
    eventResponseState,
    formatDuration,
    getWeekDays,
    isNonWorkingDay,
    isOwnEvent,
    resolveEventColors,
    tintBackground,
} from './calendarUtils';
import {
    CalendarEventResponse,
    ICalendarEvent,
    ICalendarSource,
} from '../interfaces/CalendarInterfaces';

const base: ICalendarEvent = {
    id: '1',
    title: 'Sync',
    start: new Date(2026, 6, 21, 9, 0, 0),
    end: new Date(2026, 6, 21, 10, 0, 0),
};

describe('isOwnEvent', () => {
    it('respects an explicit isOwn flag', () => {
        expect(isOwnEvent({ ...base, isOwn: false }, 'me@x.com')).toBe(false);
        expect(isOwnEvent({ ...base, isOwn: true, organizer: 'other@x.com' }, 'me@x.com')).toBe(
            true
        );
    });

    it('matches the organizer against the current user', () => {
        expect(isOwnEvent({ ...base, organizer: 'me@x.com' }, 'me@x.com')).toBe(true);
        expect(isOwnEvent({ ...base, organizer: 'boss@x.com' }, 'me@x.com')).toBe(false);
    });

    it('assumes ownership when no organizer is recorded', () => {
        expect(isOwnEvent(base, 'me@x.com')).toBe(true);
        expect(isOwnEvent(base)).toBe(true);
    });
});

describe('effectiveResponse', () => {
    it('treats owned events as accepted regardless of the response field', () => {
        expect(
            effectiveResponse(
                { ...base, response: CalendarEventResponse.NEEDS_ACTION },
                'me@x.com'
            )
        ).toBe(CalendarEventResponse.ACCEPTED);
    });

    it('falls back to needs-action for invitations with no response', () => {
        expect(effectiveResponse({ ...base, organizer: 'boss@x.com' }, 'me@x.com')).toBe(
            CalendarEventResponse.NEEDS_ACTION
        );
    });
});

describe('eventResponseState', () => {
    const invite = (response: CalendarEventResponse): ICalendarEvent => ({
        ...base,
        organizer: 'boss@x.com',
        response,
    });

    it('is confirmed for accepted / owned events', () => {
        expect(eventResponseState(base, 'me@x.com')).toBe('confirmed');
        expect(eventResponseState(invite(CalendarEventResponse.ACCEPTED), 'me@x.com')).toBe(
            'confirmed'
        );
    });

    it('is pending for not-yet-accepted invitations', () => {
        expect(eventResponseState(invite(CalendarEventResponse.NEEDS_ACTION), 'me@x.com')).toBe(
            'pending'
        );
        expect(eventResponseState(invite(CalendarEventResponse.TENTATIVE), 'me@x.com')).toBe(
            'pending'
        );
    });

    it('is declined for declined invitations', () => {
        expect(eventResponseState(invite(CalendarEventResponse.DECLINED), 'me@x.com')).toBe(
            'declined'
        );
    });
});

describe('getWeekDays', () => {
    // 2026-07-22 is a Wednesday.
    const wed = new Date(2026, 6, 22, 10, 0, 0);

    it('starts the week on Sunday by default', () => {
        const days = getWeekDays(wed);
        expect(days[0].getDay()).toBe(0);
        expect(days[6].getDay()).toBe(6);
        expect(days[0].getDate()).toBe(19);
    });

    it('starts the week on Monday when asked', () => {
        const days = getWeekDays(wed, undefined, 1);
        expect(days[0].getDay()).toBe(1);
        expect(days[6].getDay()).toBe(0);
        expect(days[0].getDate()).toBe(20);
    });
});

describe('isNonWorkingDay', () => {
    it('matches the configured days of the week', () => {
        const sat = new Date(2026, 6, 25);
        const mon = new Date(2026, 6, 27);
        expect(isNonWorkingDay(sat, [0, 6])).toBe(true);
        expect(isNonWorkingDay(mon, [0, 6])).toBe(false);
        expect(isNonWorkingDay(mon, [1])).toBe(true);
        expect(isNonWorkingDay(sat, [])).toBe(false);
    });
});

describe('tintBackground', () => {
    it('converts hex colours to a translucent rgba', () => {
        expect(tintBackground('#ff0000')).toBe('rgba(255, 0, 0, 0.16)');
        expect(tintBackground('#f00')).toBe('rgba(255, 0, 0, 0.16)');
    });

    it('blends non-hex colours with color-mix', () => {
        expect(tintBackground('dodgerblue')).toBe(
            'color-mix(in srgb, dodgerblue 16%, transparent)'
        );
    });
});

describe('resolveEventColors', () => {
    const source: ICalendarSource = {
        id: 'work',
        name: 'Work',
        color: '#1e40af',
        backgroundColor: '#ebf0fb',
        borderColor: 'dodgerblue',
    };

    it("derives the fill from the event's own colour", () => {
        const colors = resolveEventColors(
            { ...base, calendarId: 'work', color: '#ff0000', borderColor: '#ff0000' },
            [source]
        );
        expect(colors.backgroundColor).toBe('rgba(255, 0, 0, 0.16)');
        expect(colors.borderColor).toBe('#ff0000');
        expect(colors.color).toBe('#ff0000');
    });

    it('keeps the source background when the event has no colour of its own', () => {
        const colors = resolveEventColors({ ...base, calendarId: 'work' }, [source]);
        expect(colors.backgroundColor).toBe('#ebf0fb');
        expect(colors.borderColor).toBe('dodgerblue');
    });
});

describe('formatDuration', () => {
    it('formats minutes, hours and combinations', () => {
        expect(formatDuration(base.start, base.end)).toBe('1 hour');
        expect(
            formatDuration(new Date(2026, 6, 21, 9, 0), new Date(2026, 6, 21, 9, 30))
        ).toBe('30 minutes');
        expect(
            formatDuration(new Date(2026, 6, 21, 9, 0), new Date(2026, 6, 21, 10, 30))
        ).toBe('1 hour 30 minutes');
    });

    it('formats multi-day spans', () => {
        expect(
            formatDuration(new Date(2026, 6, 21, 9, 0), new Date(2026, 6, 23, 9, 0))
        ).toBe('2 days');
    });
});
