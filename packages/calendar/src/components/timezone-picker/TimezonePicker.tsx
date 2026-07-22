import React, { useMemo, useState } from 'react';
import {
    Button,
    ButtonSize,
    ButtonType,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalFooterRight,
    ModalHeader,
} from '@blue-orange-ai/foundations-core';
import { getTimezoneOptions, getTimezoneName } from '../../utils/calendarUtils';
import './TimezonePicker.css';

interface Props {
    /** Currently selected IANA name; falls back to the browser's zone. */
    timezone?: string;
    onSelect: (timezone: string) => void;
    onClose: () => void;
}

/** Zones listed before the search narrows things down. */
const VISIBLE_LIMIT = 60;

/**
 * Modal list of every IANA timezone, searchable by name or offset. Opened by
 * clicking the timezone label above the hour gutter.
 */
export const TimezonePicker: React.FC<Props> = ({ timezone, onSelect, onClose }) => {
    const [query, setQuery] = useState('');
    const active = timezone ?? getTimezoneName();

    // The full list is ~600 zones, so it is built once and then filtered.
    const options = useMemo(() => getTimezoneOptions(), []);

    const search = query.trim().toLowerCase();
    const matches = useMemo(() => {
        if (search === '') {
            // Keep the selected zone at the top so its tick is always in view,
            // however far down the full list it would otherwise sit.
            const selected = options.filter((option) => option.name === active);
            const rest = options.filter((option) => option.name !== active);
            return [...selected, ...rest.slice(0, VISIBLE_LIMIT)];
        }
        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(search) ||
                option.offsetLabel.toLowerCase().includes(search)
        );
    }, [options, search, active]);

    const deviceTimezone = getTimezoneName();

    return (
        <Modal width={420} onClose={onClose}>
            <ModalHeader label="Timezone" onClose={onClose} />
            <ModalBody>
                <Input
                    placeholder="Search timezones..."
                    value={query}
                    focus={true}
                    onChange={setQuery}
                />
                <div className="blue-orange-calendar-timezone-picker-list">
                    {matches.map((option) => (
                        <button
                            key={option.name}
                            type="button"
                            className={`blue-orange-calendar-timezone-picker-option${
                                option.name === active
                                    ? ' blue-orange-calendar-timezone-picker-option-active'
                                    : ''
                            }`}
                            onClick={() => onSelect(option.name)}
                        >
                            <span className="blue-orange-calendar-timezone-picker-option-label">
                                {option.name === active && (
                                    <i className="ri-check-line blue-orange-calendar-timezone-picker-option-tick" />
                                )}
                                {option.label}
                            </span>
                            <span className="blue-orange-calendar-timezone-picker-option-offset">
                                {option.offsetLabel}
                            </span>
                        </button>
                    ))}
                    {matches.length === 0 && (
                        <div className="blue-orange-calendar-timezone-picker-empty">
                            No timezones match "{query}"
                        </div>
                    )}
                    {search === '' && options.length > VISIBLE_LIMIT && (
                        <div className="blue-orange-calendar-timezone-picker-empty">
                            Search to see all {options.length} timezones
                        </div>
                    )}
                </div>
            </ModalBody>
            <ModalFooter>
                <ModalFooterRight>
                    <Button
                        text="Current timezone"
                        icon="ri-map-pin-time-line"
                        buttonType={
                            deviceTimezone === active ? ButtonType.SECONDARY : ButtonType.PRIMARY
                        }
                        size={ButtonSize.SMALL}
                        onClick={() => onSelect(deviceTimezone)}
                    />
                </ModalFooterRight>
            </ModalFooter>
        </Modal>
    );
};
