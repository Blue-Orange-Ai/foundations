/**
 * Formats a date for display in a date separator.
 *
 * - Today -> "Today"
 * - Yesterday -> "Yesterday"
 * - Within last 7 days -> Day name (e.g., "Wednesday")
 * - Within current year -> "March 5" (month + day)
 * - Older -> "March 5, 2025" (month + day + year)
 */
export declare function formatDateSeparator(date: Date): string;
/**
 * Determines whether a date separator should be shown between two messages.
 *
 * Returns true if:
 * - previous is null (first message)
 * - current and previous are on different calendar days
 */
export declare function shouldShowDateSeparator(current: Date, previous: Date | null): boolean;
