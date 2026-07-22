import React, { useState } from 'react';
import {
    Button,
    ButtonIcon,
    ButtonSize,
    ButtonType,
    Checkbox,
    ColorPicker,
    DateInput,
    Dropdown,
    DropdownItemText,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalFooterLeft,
    ModalFooterRight,
} from '@blue-orange-ai/foundations-core';
import {
    CalendarDeleteScope,
    CalendarEventAvailability,
    CalendarEventResponse,
    CalendarSeriesScope,
    ICalendarEvent,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';
import {
    describeRecurrence,
    effectiveResponse,
    formatDuration,
    formatEventWhen,
    isOwnEvent,
    isRecurring,
    REMINDER_OPTIONS,
    resolveEventColors,
} from '../../utils/calendarUtils';
import './EventModal.css';

/** Sentinel used by the reminder dropdown for the custom option. */
const CUSTOM_REMINDER = 'custom';

const REMINDER_UNITS = [
    { value: '1', label: 'minutes' },
    { value: '60', label: 'hours' },
    { value: '1440', label: 'days' },
];

const HOUR_MS = 60 * 60 * 1000;

interface Props {
    event: ICalendarEvent;
    sources?: ICalendarSource[];
    /** IANA timezone the times are shown in. Defaults to the browser's zone. */
    timezone?: string;
    /** Viewer's email, used to decide whether the event is the viewer's own. */
    currentUser?: string;
    /** When true, guest lists are shown for the viewer's own events. */
    emailCompatibility?: boolean;
    onClose: () => void;
    onEdit?: (event: ICalendarEvent) => void;
    /**
     * Called with the event, whether it should be removed for everyone, and —
     * for repeating events — whether to remove just this occurrence or the
     * whole series.
     */
    onDelete?: (
        event: ICalendarEvent,
        scope: CalendarDeleteScope,
        seriesScope?: CalendarSeriesScope
    ) => void;
    /**
     * Called when the viewer responds to an invitation. A proposed time is only
     * passed when the viewer declines and proposes an alternative.
     */
    onRespond?: (
        event: ICalendarEvent,
        response: CalendarEventResponse,
        proposedTime?: { start: Date; end: Date }
    ) => void;
    /** Called when the notification / reminder is changed. */
    onReminderChange?: (event: ICalendarEvent, minutes: number | null) => void;
    /**
     * Called when the viewer picks a colour for the event. Available for events
     * the viewer owns or was invited to, letting them colour the event in their
     * own calendar without opening the full edit form.
     */
    onColorChange?: (event: ICalendarEvent, color: string) => void;
}

/** Which of the modal's screens is showing. */
type Screen = 'detail' | 'delete' | 'decline';

/**
 * The event detail modal. Shows everything about an event and adapts its footer
 * to whether the viewer owns it: owners get edit / delete, invitees get
 * accept / decline / tentative (with an option to propose a new time). Built
 * entirely on the Foundations core {@link Modal}.
 */
export const EventModal: React.FC<Props> = ({
    event,
    sources = [],
    timezone,
    currentUser,
    emailCompatibility = false,
    onClose,
    onEdit,
    onDelete,
    onRespond,
    onReminderChange,
    onColorChange,
}) => {
    const [screen, setScreen] = useState<Screen>('detail');

    const colors = resolveEventColors(event, sources);
    const source = sources.find((s) => s.id === event.calendarId);
    const own = isOwnEvent(event, currentUser);
    const response = effectiveResponse(event, currentUser);
    const busy = (event.availability ?? CalendarEventAvailability.BUSY) === CalendarEventAvailability.BUSY;

    // The event's colour, tracked locally so the swatch and tag update as soon
    // as it is changed, before the consumer re-renders with the new event.
    const [color, setColor] = useState(colors.borderColor ?? '');
    const swatchColor =
        color.trim() !== '' ? color : 'var(--blue-orange-light-calendar-event-accent-color)';
    // Owners and invitees may recolour the event; plain read-only events cannot.
    const canRecolour = !!onColorChange && !event.isReadOnly;
    const handleColorChange = (value: string) => {
        setColor(value);
        if (onColorChange) {
            onColorChange(event, value);
        }
    };

    const requiredGuests = event.requiredGuests ?? [];
    const optionalGuests = event.optionalGuests ?? [];
    const hasGuests = requiredGuests.length > 0 || optionalGuests.length > 0;

    // --- Reminder (editable for every event, even ones the viewer does not own).
    const presetValues = REMINDER_OPTIONS.map((option) =>
        option.minutes == null ? 'null' : String(option.minutes)
    );
    const initialReminder =
        event.reminderMinutes == null ? 'null' : String(event.reminderMinutes);
    const [reminderChoice, setReminderChoice] = useState(
        presetValues.includes(initialReminder) ? initialReminder : CUSTOM_REMINDER
    );
    const [customReminderValue, setCustomReminderValue] = useState(
        presetValues.includes(initialReminder) ? '30' : String(event.reminderMinutes ?? 30)
    );
    const [customReminderUnit, setCustomReminderUnit] = useState('1');

    const resolveReminderMinutes = (
        choice: string,
        amount: string,
        unit: string
    ): number | null => {
        if (choice === CUSTOM_REMINDER) {
            const value = parseInt(amount, 10);
            if (isNaN(value) || value <= 0) {
                return null;
            }
            return value * parseInt(unit, 10);
        }
        return choice === 'null' ? null : parseInt(choice, 10);
    };

    const emitReminder = (choice: string, amount: string, unit: string) => {
        if (onReminderChange) {
            onReminderChange(event, resolveReminderMinutes(choice, amount, unit));
        }
    };

    const recurring = isRecurring(event);

    // --- Delete flow.
    const [deleteForEveryone, setDeleteForEveryone] = useState(hasGuests);
    // Repeating events default to deleting just the one occurrence.
    const [deleteSeries, setDeleteSeries] = useState(false);
    const confirmDelete = () => {
        if (onDelete) {
            onDelete(
                event,
                hasGuests && deleteForEveryone
                    ? CalendarDeleteScope.EVERYONE
                    : CalendarDeleteScope.SELF,
                recurring
                    ? deleteSeries
                        ? CalendarSeriesScope.SERIES
                        : CalendarSeriesScope.SINGLE
                    : undefined
            );
        }
    };

    // --- Decline / propose-a-new-time flow.
    const [proposing, setProposing] = useState(false);
    const [proposedStart, setProposedStart] = useState<Date>(event.start);
    const [proposedEnd, setProposedEnd] = useState<Date>(event.end);
    const handleProposedStart = (date: Date) => {
        setProposedStart(date);
        if (proposedEnd.getTime() <= date.getTime()) {
            setProposedEnd(new Date(date.getTime() + HOUR_MS));
        }
    };
    const respond = (value: CalendarEventResponse, withProposal = false) => {
        if (onRespond) {
            onRespond(
                event,
                value,
                withProposal ? { start: proposedStart, end: proposedEnd } : undefined
            );
        }
    };

    const responseChip = (() => {
        if (own) {
            return null;
        }
        const label: Record<CalendarEventResponse, string> = {
            [CalendarEventResponse.ACCEPTED]: 'Going',
            [CalendarEventResponse.DECLINED]: 'Declined',
            [CalendarEventResponse.TENTATIVE]: 'Maybe',
            [CalendarEventResponse.NEEDS_ACTION]: 'Awaiting your response',
        };
        return (
            <span
                className={`blue-orange-calendar-event-detail-response blue-orange-calendar-event-detail-response-${response}`}
            >
                {label[response]}
            </span>
        );
    })();

    // The header is shared across all three screens.
    const header = (
        <div className="blue-orange-modal-header">
            <div className="blue-orange-calendar-event-detail-header-left">
                <span
                    className="blue-orange-calendar-event-detail-swatch"
                    style={{
                        borderColor: swatchColor,
                        backgroundColor: busy ? swatchColor : 'transparent',
                    }}
                    title={busy ? 'Busy' : 'Free'}
                />
                <div className="blue-orange-modal-header-label">{event.title}</div>
            </div>
            <div className="blue-orange-modal-header-close-btn">
                <ButtonIcon
                    icon="ri-close-line"
                    style={{ backgroundColor: 'transparent' }}
                    onClick={onClose}
                />
            </div>
        </div>
    );

    if (screen === 'delete') {
        return (
            <Modal width={420} onClose={onClose}>
                {header}
                <ModalBody>
                    <div className="blue-orange-calendar-event-detail-confirm">
                        <p className="blue-orange-calendar-event-detail-confirm-text">
                            Are you sure you want to delete <strong>{event.title}</strong>?
                        </p>
                        {recurring && (
                            <label className="blue-orange-calendar-event-detail-confirm-choice">
                                <Checkbox
                                    checked={deleteSeries}
                                    onCheckboxChange={setDeleteSeries}
                                />
                                <span>Delete the entire series</span>
                            </label>
                        )}
                        {hasGuests && (
                            <label className="blue-orange-calendar-event-detail-confirm-choice">
                                <Checkbox
                                    checked={deleteForEveryone}
                                    onCheckboxChange={setDeleteForEveryone}
                                />
                                <span>Delete for everyone</span>
                            </label>
                        )}
                        <p className="blue-orange-calendar-event-detail-confirm-note">
                            This can&rsquo;t be undone.
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ModalFooterRight>
                        <div className="blue-orange-calendar-event-detail-btn-row">
                            <Button
                                text="Cancel"
                                buttonType={ButtonType.SECONDARY}
                                size={ButtonSize.SMALL}
                                onClick={() => setScreen('detail')}
                            />
                            <Button
                                text="Delete"
                                buttonType={ButtonType.DANGER}
                                size={ButtonSize.SMALL}
                                onClick={confirmDelete}
                            />
                        </div>
                    </ModalFooterRight>
                </ModalFooter>
            </Modal>
        );
    }

    if (screen === 'decline') {
        return (
            <Modal width={460} onClose={onClose}>
                {header}
                <ModalBody>
                    <div className="blue-orange-calendar-event-detail-confirm">
                        <p className="blue-orange-calendar-event-detail-confirm-text">
                            Decline <strong>{event.title}</strong>?
                        </p>
                        <label className="blue-orange-calendar-event-detail-confirm-choice">
                            <Checkbox checked={proposing} onCheckboxChange={setProposing} />
                            <span>Propose a new time</span>
                        </label>
                        {proposing && (
                            <div className="blue-orange-calendar-event-detail-propose">
                                <DateInput
                                    value={proposedStart}
                                    showTime={true}
                                    displayFormat="MMM D, YYYY h:mm A"
                                    onChange={handleProposedStart}
                                />
                                <span className="blue-orange-calendar-event-detail-propose-sep">
                                    –
                                </span>
                                <DateInput
                                    value={proposedEnd}
                                    showTime={true}
                                    displayFormat="MMM D, YYYY h:mm A"
                                    onChange={setProposedEnd}
                                />
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ModalFooterLeft>
                        <Button
                            text="Back"
                            buttonType={ButtonType.SECONDARY}
                            size={ButtonSize.SMALL}
                            onClick={() => setScreen('detail')}
                        />
                    </ModalFooterLeft>
                    <ModalFooterRight>
                        <Button
                            text={proposing ? 'Decline & propose' : 'Decline'}
                            buttonType={ButtonType.DANGER}
                            size={ButtonSize.SMALL}
                            onClick={() => respond(CalendarEventResponse.DECLINED, proposing)}
                        />
                    </ModalFooterRight>
                </ModalFooter>
            </Modal>
        );
    }

    const editable = own && !event.isReadOnly;

    return (
        <Modal width={440} onClose={onClose}>
            {header}
            <ModalBody>
                <div className="blue-orange-calendar-event-detail">
                    {/* On an email-backed event the guest lists come first. */}
                    {own && emailCompatibility && hasGuests && (
                        <div className="blue-orange-calendar-event-detail-row blue-orange-calendar-event-detail-row-top">
                            <i className="ri-group-line blue-orange-calendar-event-detail-icon" />
                            <div className="blue-orange-calendar-event-detail-guests">
                                {requiredGuests.length > 0 && (
                                    <div>
                                        <span className="blue-orange-calendar-event-detail-guests-label">
                                            Required
                                        </span>
                                        {requiredGuests.join(', ')}
                                    </div>
                                )}
                                {optionalGuests.length > 0 && (
                                    <div>
                                        <span className="blue-orange-calendar-event-detail-guests-label">
                                            Optional
                                        </span>
                                        {optionalGuests.join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* The calendar (source) tag. */}
                    <div className="blue-orange-calendar-event-detail-tags">
                        {source && (
                            <span
                                className="blue-orange-calendar-event-detail-tag"
                                style={{
                                    borderColor: swatchColor,
                                    color: swatchColor,
                                }}
                            >
                                <span
                                    className="blue-orange-calendar-event-detail-tag-dot"
                                    style={{ backgroundColor: swatchColor }}
                                />
                                {source.name}
                            </span>
                        )}
                        {responseChip}
                    </div>

                    {/* Colour — settable for events the viewer owns or was
                        invited to, so it can be coloured in their calendar. */}
                    {canRecolour && (
                        <div className="blue-orange-calendar-event-detail-row">
                            <i className="ri-palette-line blue-orange-calendar-event-detail-icon" />
                            <div className="blue-orange-calendar-event-detail-colour">
                                <ColorPicker value={color} onChange={handleColorChange} />
                            </div>
                        </div>
                    )}

                    {/* Time, then an easy-to-read duration. */}
                    <div className="blue-orange-calendar-event-detail-row blue-orange-calendar-event-detail-row-top">
                        <i className="ri-time-line blue-orange-calendar-event-detail-icon" />
                        <div>
                            <div className="blue-orange-calendar-event-detail-when">
                                {formatEventWhen(event, timezone)}
                            </div>
                            <div className="blue-orange-calendar-event-detail-duration">
                                {formatDuration(event.start, event.end, timezone)}
                            </div>
                        </div>
                    </div>

                    {/* Location — only when one was given. */}
                    {event.location && (
                        <div className="blue-orange-calendar-event-detail-row">
                            <i className="ri-map-pin-line blue-orange-calendar-event-detail-icon" />
                            <span>{event.location}</span>
                        </div>
                    )}

                    {/* Recurrence summary for repeating events. */}
                    {event.recurrence && (
                        <div className="blue-orange-calendar-event-detail-row">
                            <i className="ri-repeat-line blue-orange-calendar-event-detail-icon" />
                            <span>{describeRecurrence(event.recurrence, event.start, timezone)}</span>
                        </div>
                    )}

                    {/* Rendered description. */}
                    {event.body && (
                        <div
                            className="blue-orange-calendar-event-detail-body"
                            dangerouslySetInnerHTML={{ __html: event.body }}
                        />
                    )}

                    {/* Notification — editable for any event. */}
                    <div className="blue-orange-calendar-event-detail-row">
                        <i className="ri-notification-3-line blue-orange-calendar-event-detail-icon" />
                        <div className="blue-orange-calendar-event-detail-reminder">
                            <Dropdown
                                onSelection={(item) => {
                                    setReminderChoice(item.reference);
                                    emitReminder(item.reference, customReminderValue, customReminderUnit);
                                }}
                            >
                                {REMINDER_OPTIONS.map((option) => {
                                    const value =
                                        option.minutes == null ? 'null' : String(option.minutes);
                                    return (
                                        <DropdownItemText
                                            key={value}
                                            label={option.label}
                                            value={value}
                                            selected={value === reminderChoice}
                                        />
                                    );
                                })}
                                <DropdownItemText
                                    label="Custom…"
                                    value={CUSTOM_REMINDER}
                                    selected={reminderChoice === CUSTOM_REMINDER}
                                />
                            </Dropdown>
                            {reminderChoice === CUSTOM_REMINDER && (
                                <div className="blue-orange-calendar-event-detail-custom-reminder">
                                    <Input
                                        isNumber={true}
                                        value={customReminderValue}
                                        onChange={(value) => {
                                            setCustomReminderValue(value);
                                            emitReminder(reminderChoice, value, customReminderUnit);
                                        }}
                                        style={{ width: '80px' }}
                                    />
                                    <Dropdown
                                        onSelection={(item) => {
                                            setCustomReminderUnit(item.reference);
                                            emitReminder(reminderChoice, customReminderValue, item.reference);
                                        }}
                                    >
                                        {REMINDER_UNITS.map((unit) => (
                                            <DropdownItemText
                                                key={unit.value}
                                                label={unit.label}
                                                value={unit.value}
                                                selected={unit.value === customReminderUnit}
                                            />
                                        ))}
                                    </Dropdown>
                                    <span className="blue-orange-calendar-event-detail-custom-suffix">
                                        before
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ModalBody>
            {(editable || (!own && onRespond)) && (
                <ModalFooter>
                    {/* Invitees respond on the left. */}
                    <ModalFooterLeft>
                        {!own && onRespond && (
                            <div className="blue-orange-calendar-event-detail-btn-row">
                                <Button
                                    text="Accept"
                                    buttonType={
                                        response === CalendarEventResponse.ACCEPTED
                                            ? ButtonType.PRIMARY
                                            : ButtonType.SECONDARY
                                    }
                                    size={ButtonSize.SMALL}
                                    onClick={() => respond(CalendarEventResponse.ACCEPTED)}
                                />
                                <Button
                                    text="Tentative"
                                    buttonType={
                                        response === CalendarEventResponse.TENTATIVE
                                            ? ButtonType.PRIMARY
                                            : ButtonType.SECONDARY
                                    }
                                    size={ButtonSize.SMALL}
                                    onClick={() => respond(CalendarEventResponse.TENTATIVE)}
                                />
                                <Button
                                    text="Decline"
                                    buttonType={ButtonType.SECONDARY}
                                    size={ButtonSize.SMALL}
                                    onClick={() => setScreen('decline')}
                                />
                            </div>
                        )}
                    </ModalFooterLeft>
                    {/* Owners edit / delete on the right. */}
                    <ModalFooterRight>
                        {editable && (
                            <div className="blue-orange-calendar-event-detail-btn-row">
                                {onDelete && (
                                    <Button
                                        text="Delete"
                                        buttonType={ButtonType.DANGER}
                                        size={ButtonSize.SMALL}
                                        onClick={() => setScreen('delete')}
                                    />
                                )}
                                {onEdit && (
                                    <Button
                                        text="Edit"
                                        buttonType={ButtonType.PRIMARY}
                                        size={ButtonSize.SMALL}
                                        onClick={() => onEdit(event)}
                                    />
                                )}
                            </div>
                        )}
                    </ModalFooterRight>
                </ModalFooter>
            )}
        </Modal>
    );
};
