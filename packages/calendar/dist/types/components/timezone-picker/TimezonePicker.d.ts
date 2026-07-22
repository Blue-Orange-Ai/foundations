import React from 'react';
import './TimezonePicker.css';
interface Props {
    /** Currently selected IANA name; falls back to the browser's zone. */
    timezone?: string;
    onSelect: (timezone: string) => void;
    onClose: () => void;
}
/**
 * Modal list of every IANA timezone, searchable by name or offset. Opened by
 * clicking the timezone label above the hour gutter.
 */
export declare const TimezonePicker: React.FC<Props>;
export {};
