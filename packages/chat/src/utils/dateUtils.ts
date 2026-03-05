import moment from 'moment';

/**
 * Formats a date for display in a date separator.
 *
 * - Today -> "Today"
 * - Yesterday -> "Yesterday"
 * - Within last 7 days -> Day name (e.g., "Wednesday")
 * - Within current year -> "March 5" (month + day)
 * - Older -> "March 5, 2025" (month + day + year)
 */
export function formatDateSeparator(date: Date): string {
    const m = moment(date);
    const now = moment();

    if (m.isSame(now, 'day')) {
        return 'Today';
    }

    if (m.isSame(now.clone().subtract(1, 'day'), 'day')) {
        return 'Yesterday';
    }

    if (m.isAfter(now.clone().subtract(7, 'days'), 'day')) {
        return m.format('dddd');
    }

    if (m.isSame(now, 'year')) {
        return m.format('MMMM D');
    }

    return m.format('MMMM D, YYYY');
}

/**
 * Determines whether a date separator should be shown between two messages.
 *
 * Returns true if:
 * - previous is null (first message)
 * - current and previous are on different calendar days
 */
export function shouldShowDateSeparator(current: Date, previous: Date | null): boolean {
    if (previous === null) {
        return true;
    }

    return !moment(current).isSame(moment(previous), 'day');
}
