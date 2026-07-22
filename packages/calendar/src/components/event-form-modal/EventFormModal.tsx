import React, { useMemo, useState } from 'react';
import {
    Button,
    ButtonIcon,
    ButtonSize,
    ButtonToggle,
    ButtonType,
    ColorPicker,
    DateInput,
    Dropdown,
    DropdownItemText,
    EmailRecipientInput,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalFooterRight,
    RichText,
} from '@blue-orange-ai/foundations-core';
import {
    CalendarEventAvailability,
    CalendarNotifyScope,
    CalendarRecurrenceFrequency,
    CalendarRecurrenceUnit,
    CalendarSeriesScope,
    ICalendarEvent,
    ICalendarRecurrence,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';
import {
    conferencingBlockHtml,
    DEFAULT_CONFERENCING_PROVIDERS,
    DEFAULT_REMINDER_MINUTES,
    IConferencingProvider,
    isRecurring,
    NEW_EVENT_TITLE,
    REMINDER_OPTIONS,
    stripConferencingBlock,
} from '../../utils/calendarUtils';
import moment from 'moment';
import './EventFormModal.css';

/** Sentinel used by the reminder dropdown for the custom option. */
const CUSTOM_REMINDER = 'custom';

const HOUR_MS = 60 * 60 * 1000;

interface Props {
    /** Start of the event being created. */
    start: Date;
    /** End of the event being created. */
    end: Date;
    sources?: ICalendarSource[];
    /** IANA timezone the calendar is rendered in (kept for API symmetry). */
    timezone?: string;
    /** Pre-filled title, defaulting to the placeholder used on the draft block. */
    defaultTitle?: string;
    /** When true, required / optional guest email fields are shown. */
    emailCompatibility?: boolean;
    /** Video conferencing providers offered above the description. */
    conferencingProviders?: IConferencingProvider[];
    /** Reminder applied when the form opens. */
    defaultReminderMinutes?: number | null;
    /**
     * `create` (default) builds a brand new event; `edit` prefills the form from
     * {@link initialEvent} and, for email-backed events, offers to notify guests
     * when the recipient lists change.
     */
    mode?: 'create' | 'edit';
    /** The event being edited, when `mode` is `edit`. */
    initialEvent?: ICalendarEvent;
    onCancel: () => void;
    /**
     * Called with the finished event. When editing an email-backed event whose
     * guest list changed, `meta.notify` records which guests to inform. When
     * editing a recurring event, `meta.scope` records whether the change applies
     * to this occurrence or the whole series, and `meta.occurrenceStart` is the
     * original start of the occurrence being edited.
     */
    onCreate: (
        event: ICalendarEvent,
        meta?: {
            notify?: CalendarNotifyScope;
            scope?: CalendarSeriesScope;
            occurrenceStart?: Date;
        }
    ) => void;
}

/** Sentinel for "does not repeat" in the recurrence dropdown. */
const NO_RECURRENCE = 'none';

const RECURRENCE_UNITS = [
    { value: CalendarRecurrenceUnit.DAY, label: 'days' },
    { value: CalendarRecurrenceUnit.WEEK, label: 'weeks' },
    { value: CalendarRecurrenceUnit.MONTH, label: 'months' },
    { value: CalendarRecurrenceUnit.YEAR, label: 'years' },
];

/** The single-letter weekday toggles used by the custom recurrence editor. */
const WEEKDAY_TOGGLES = [
    { value: 0, label: 'S' },
    { value: 1, label: 'M' },
    { value: 2, label: 'T' },
    { value: 3, label: 'W' },
    { value: 4, label: 'T' },
    { value: 5, label: 'F' },
    { value: 6, label: 'S' },
];

const REMINDER_UNITS = [
    { value: '1', label: 'minutes' },
    { value: '60', label: 'hours' },
    { value: '1440', label: 'days' },
];

/**
 * The full create form shown when a range is dragged out or the "New event"
 * button is pressed. Built entirely from Foundations core inputs.
 */
export const EventFormModal: React.FC<Props> = ({
    start,
    end,
    sources = [],
    defaultTitle = NEW_EVENT_TITLE,
    emailCompatibility = false,
    conferencingProviders = DEFAULT_CONFERENCING_PROVIDERS,
    defaultReminderMinutes = DEFAULT_REMINDER_MINUTES,
    mode = 'create',
    initialEvent,
    onCancel,
    onCreate,
}) => {
    const editing = mode === 'edit' && !!initialEvent;
    const [title, setTitle] = useState(
        editing ? initialEvent!.title : defaultTitle
    );

    // Events can span multiple days, so both ends are full dates edited through
    // the core date picker rather than a time-only field.
    const [startDate, setStartDate] = useState<Date>(editing ? initialEvent!.start : start);
    const [endDate, setEndDate] = useState<Date>(editing ? initialEvent!.end : end);

    const [location, setLocation] = useState(editing ? initialEvent!.location ?? '' : '');

    // The description the user has typed, kept in sync so a conferencing toggle
    // can re-seed the editor without losing it. `editorSeed` remounts the editor.
    const [descriptionHtml, setDescriptionHtml] = useState(
        editing ? initialEvent!.body ?? '' : ''
    );
    const [conferencing, setConferencing] = useState<string>(
        editing ? initialEvent!.conferencingProvider ?? '' : ''
    );
    const [editorSeed, setEditorSeed] = useState(0);
    const seededContent = useMemo(
        () => descriptionHtml,
        // Only re-read when we deliberately bump the seed, never on each keystroke.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editorSeed]
    );

    const [color, setColor] = useState(
        editing
            ? initialEvent!.borderColor ?? initialEvent!.color ?? ''
            : sources[0]?.borderColor ?? sources[0]?.color ?? ''
    );
    const [availability, setAvailability] = useState<CalendarEventAvailability>(
        editing
            ? initialEvent!.availability ?? CalendarEventAvailability.BUSY
            : CalendarEventAvailability.BUSY
    );

    const presetValues = REMINDER_OPTIONS.map((option) =>
        option.minutes == null ? 'null' : String(option.minutes)
    );
    const startingReminderMinutes = editing
        ? initialEvent!.reminderMinutes ?? null
        : defaultReminderMinutes;
    const initialReminder =
        startingReminderMinutes == null ? 'null' : String(startingReminderMinutes);
    const [reminderChoice, setReminderChoice] = useState(
        presetValues.includes(initialReminder) ? initialReminder : CUSTOM_REMINDER
    );
    const [customReminderValue, setCustomReminderValue] = useState(
        presetValues.includes(initialReminder) ? '30' : String(startingReminderMinutes ?? 30)
    );
    const [customReminderUnit, setCustomReminderUnit] = useState('1');

    // The recipient lists at open time, used to detect a change on save.
    const initialRequired = editing ? initialEvent!.requiredGuests ?? [] : [];
    const initialOptional = editing ? initialEvent!.optionalGuests ?? [] : [];
    const [requiredGuests, setRequiredGuests] = useState<string[]>(initialRequired);
    const [optionalGuests, setOptionalGuests] = useState<string[]>(initialOptional);

    // --- Recurrence.
    const initialRecurrence = editing ? initialEvent!.recurrence : undefined;
    const recurrenceToChoice = (rec?: ICalendarRecurrence): string => {
        if (!rec) {
            return NO_RECURRENCE;
        }
        return rec.frequency;
    };
    const [recurrenceChoice, setRecurrenceChoice] = useState<string>(
        recurrenceToChoice(initialRecurrence)
    );
    const [customInterval, setCustomInterval] = useState(
        String(initialRecurrence?.interval ?? 1)
    );
    const [customUnit, setCustomUnit] = useState<CalendarRecurrenceUnit>(
        initialRecurrence?.customUnit ?? CalendarRecurrenceUnit.WEEK
    );
    const [customWeekdays, setCustomWeekdays] = useState<number[]>(
        initialRecurrence?.byWeekday ?? [moment(editing ? initialEvent!.start : start).day()]
    );

    const toggleCustomWeekday = (day: number) => {
        setCustomWeekdays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)
        );
    };

    const buildRecurrence = (): ICalendarRecurrence | undefined => {
        switch (recurrenceChoice) {
            case CalendarRecurrenceFrequency.DAILY:
                return { frequency: CalendarRecurrenceFrequency.DAILY };
            case CalendarRecurrenceFrequency.WEEKLY:
                return {
                    frequency: CalendarRecurrenceFrequency.WEEKLY,
                    byWeekday: [moment(startDate).day()],
                };
            case CalendarRecurrenceFrequency.MONTHLY:
                return { frequency: CalendarRecurrenceFrequency.MONTHLY };
            case CalendarRecurrenceFrequency.YEARLY:
                return { frequency: CalendarRecurrenceFrequency.YEARLY };
            case CalendarRecurrenceFrequency.WEEKDAY:
                return { frequency: CalendarRecurrenceFrequency.WEEKDAY };
            case CalendarRecurrenceFrequency.CUSTOM: {
                const interval = Math.max(1, parseInt(customInterval, 10) || 1);
                return {
                    frequency: CalendarRecurrenceFrequency.CUSTOM,
                    interval,
                    customUnit,
                    byWeekday:
                        customUnit === CalendarRecurrenceUnit.WEEK && customWeekdays.length
                            ? customWeekdays
                            : undefined,
                };
            }
            default:
                return undefined;
        }
    };

    // The staged flow after Save: pick the series scope, then who to notify.
    const [pendingEvent, setPendingEvent] = useState<ICalendarEvent | null>(null);
    const [stage, setStage] = useState<'scope' | 'notify' | null>(null);
    const [chosenScope, setChosenScope] = useState<CalendarSeriesScope | undefined>(undefined);

    const handleStartChange = (date: Date) => {
        setStartDate(date);
        // Keep the end after the start; nudge it out to an hour if it slipped past.
        if (endDate.getTime() <= date.getTime()) {
            setEndDate(new Date(date.getTime() + HOUR_MS));
        }
    };

    const toggleConferencing = (providerId: string) => {
        const next = conferencing === providerId ? '' : providerId;
        setConferencing(next);
        // Rebuild the description: strip any old block, prepend the new one.
        const body = stripConferencingBlock(descriptionHtml);
        const provider = conferencingProviders.find((p) => p.id === next);
        setDescriptionHtml(provider ? conferencingBlockHtml(provider) + body : body);
        setEditorSeed((seed) => seed + 1);
    };

    const resolveReminderMinutes = (): number | null => {
        if (reminderChoice === CUSTOM_REMINDER) {
            const amount = parseInt(customReminderValue, 10);
            if (isNaN(amount) || amount <= 0) {
                return null;
            }
            return amount * parseInt(customReminderUnit, 10);
        }
        return reminderChoice === 'null' ? null : parseInt(reminderChoice, 10);
    };

    const buildEvent = (): ICalendarEvent => ({
        // Editing keeps the identity and any consumer fields not shown in the form.
        ...(editing ? initialEvent! : {}),
        id: editing ? initialEvent!.id : `event-${new Date().getTime()}`,
        title: title.trim() === '' ? defaultTitle : title.trim(),
        start: startDate,
        end: endDate,
        location: location.trim() === '' ? undefined : location.trim(),
        body: descriptionHtml.trim() === '' ? undefined : descriptionHtml,
        color: color.trim() === '' ? undefined : color,
        borderColor: color.trim() === '' ? undefined : color,
        availability,
        reminderMinutes: resolveReminderMinutes(),
        conferencingProvider: conferencing === '' ? undefined : conferencing,
        requiredGuests: emailCompatibility && requiredGuests.length ? requiredGuests : undefined,
        optionalGuests: emailCompatibility && optionalGuests.length ? optionalGuests : undefined,
        recurrence: buildRecurrence(),
        calendarId: editing
            ? initialEvent!.calendarId
            : sources.length > 0
              ? sources[0].id
              : undefined,
    });

    // The guest lists that were present when the form opened, vs. now.
    const guestsChanged = () => {
        const same = (a: string[], b: string[]) =>
            a.length === b.length && a.every((value) => b.includes(value));
        return !same(initialRequired, requiredGuests) || !same(initialOptional, optionalGuests);
    };

    const originalOccurrenceStart = editing ? initialEvent!.start : undefined;
    const needsNotify = () => editing && emailCompatibility && guestsChanged();
    const editingRecurring = editing && isRecurring(initialEvent!);

    const finalize = (event: ICalendarEvent, scope?: CalendarSeriesScope, notify?: CalendarNotifyScope) => {
        onCreate(event, {
            notify,
            scope,
            occurrenceStart: editingRecurring ? originalOccurrenceStart : undefined,
        });
    };

    const submit = () => {
        const event = buildEvent();
        // Editing a recurring event: ask which occurrences the change applies to.
        if (editingRecurring) {
            setPendingEvent(event);
            setStage('scope');
            return;
        }
        // Editing an email-backed event with a changed guest list: ask who to notify.
        if (needsNotify()) {
            setPendingEvent(event);
            setStage('notify');
            return;
        }
        finalize(event);
    };

    const chooseScope = (scope: CalendarSeriesScope) => {
        if (needsNotify()) {
            setChosenScope(scope);
            setStage('notify');
            return;
        }
        finalize(pendingEvent as ICalendarEvent, scope);
    };

    const chooseNotify = (notify: CalendarNotifyScope) => {
        finalize(pendingEvent as ICalendarEvent, chosenScope, notify);
    };

    const busy = availability === CalendarEventAvailability.BUSY;
    // No colour chosen yet -> fall back to the theme's event accent.
    const swatchColor = color.trim() !== '' ? color : 'var(--blue-orange-light-calendar-event-accent-color)';

    // New guests are those present now but not when the form opened.
    const newGuestCount =
        requiredGuests.filter((email) => !initialRequired.includes(email)).length +
        optionalGuests.filter((email) => !initialOptional.includes(email)).length;

    // Step shown when editing a recurring event: apply to this occurrence or all.
    if (stage === 'scope') {
        return (
            <Modal width={440} onClose={onCancel}>
                <div className="blue-orange-modal-header">
                    <div className="blue-orange-modal-header-label">Edit repeating event</div>
                    <div className="blue-orange-modal-header-close-btn">
                        <ButtonIcon
                            icon="ri-close-line"
                            style={{ backgroundColor: 'transparent' }}
                            onClick={onCancel}
                        />
                    </div>
                </div>
                <ModalBody>
                    <p className="blue-orange-calendar-event-form-notify-text">
                        This is a repeating event. Apply your changes to just this event or
                        the whole series?
                    </p>
                </ModalBody>
                <ModalFooter>
                    <ModalFooterRight>
                        <div className="blue-orange-calendar-event-form-actions">
                            <Button
                                text="This event"
                                buttonType={ButtonType.SECONDARY}
                                size={ButtonSize.SMALL}
                                onClick={() => chooseScope(CalendarSeriesScope.SINGLE)}
                            />
                            <Button
                                text="All events"
                                buttonType={ButtonType.PRIMARY}
                                size={ButtonSize.SMALL}
                                onClick={() => chooseScope(CalendarSeriesScope.SERIES)}
                            />
                        </div>
                    </ModalFooterRight>
                </ModalFooter>
            </Modal>
        );
    }

    // Step shown after saving an edited event whose guest list changed: choose
    // who to notify before the change is committed.
    if (stage === 'notify') {
        return (
            <Modal width={460} onClose={onCancel}>
                <div className="blue-orange-modal-header">
                    <div className="blue-orange-modal-header-label">Notify guests?</div>
                    <div className="blue-orange-modal-header-close-btn">
                        <ButtonIcon
                            icon="ri-close-line"
                            style={{ backgroundColor: 'transparent' }}
                            onClick={onCancel}
                        />
                    </div>
                </div>
                <ModalBody>
                    <p className="blue-orange-calendar-event-form-notify-text">
                        The guest list changed. Who would you like to notify?
                    </p>
                </ModalBody>
                <ModalFooter>
                    <ModalFooterRight>
                        <div className="blue-orange-calendar-event-form-actions">
                            <Button
                                text="Don't notify"
                                buttonType={ButtonType.SECONDARY}
                                size={ButtonSize.SMALL}
                                onClick={() => chooseNotify(CalendarNotifyScope.NONE)}
                            />
                            {newGuestCount > 0 && (
                                <Button
                                    text="New guests only"
                                    buttonType={ButtonType.SECONDARY}
                                    size={ButtonSize.SMALL}
                                    onClick={() => chooseNotify(CalendarNotifyScope.NEW)}
                                />
                            )}
                            <Button
                                text="Notify all guests"
                                buttonType={ButtonType.PRIMARY}
                                size={ButtonSize.SMALL}
                                onClick={() => chooseNotify(CalendarNotifyScope.ALL)}
                            />
                        </div>
                    </ModalFooterRight>
                </ModalFooter>
            </Modal>
        );
    }

    return (
        <Modal width={520} onClose={onCancel}>
            {/* Custom header so the live title and a colour swatch can sit next to
                the close button. */}
            <div className="blue-orange-modal-header">
                <div className="blue-orange-calendar-event-form-header-left">
                    <span
                        className="blue-orange-calendar-event-form-swatch"
                        style={{
                            borderColor: swatchColor,
                            backgroundColor: busy ? swatchColor : 'transparent',
                        }}
                    />
                    <div className="blue-orange-modal-header-label">
                        {title.trim() === '' ? defaultTitle : title}
                    </div>
                </div>
                <div className="blue-orange-modal-header-close-btn">
                    <ButtonIcon
                        icon="ri-close-line"
                        style={{ backgroundColor: 'transparent' }}
                        onClick={onCancel}
                    />
                </div>
            </div>
            <ModalBody>
                <div className="blue-orange-calendar-event-form">
                    <Input label="Title" value={title} focus={true} onChange={setTitle} />

                    <div className="blue-orange-calendar-event-form-field">
                        <div className="blue-orange-calendar-event-form-label">When</div>
                        <div className="blue-orange-calendar-event-form-when">
                            <DateInput
                                value={startDate}
                                showTime={true}
                                displayFormat="MMM D, YYYY h:mm A"
                                onChange={handleStartChange}
                            />
                            <span className="blue-orange-calendar-event-form-when-sep">–</span>
                            <DateInput
                                value={endDate}
                                showTime={true}
                                displayFormat="MMM D, YYYY h:mm A"
                                onChange={setEndDate}
                            />
                        </div>
                    </div>

                    {emailCompatibility && (
                        <>
                            <div className="blue-orange-calendar-event-form-field">
                                <div className="blue-orange-calendar-event-form-label">
                                    Required guests
                                </div>
                                <EmailRecipientInput
                                    placeholder="Required guests by email"
                                    initialEmails={initialRequired}
                                    onChange={setRequiredGuests}
                                />
                            </div>
                            <div className="blue-orange-calendar-event-form-field">
                                <div className="blue-orange-calendar-event-form-label">
                                    Optional guests
                                </div>
                                <EmailRecipientInput
                                    placeholder="Optional guests by email"
                                    initialEmails={initialOptional}
                                    onChange={setOptionalGuests}
                                />
                            </div>
                        </>
                    )}

                    <div className="blue-orange-calendar-event-form-field">
                        <div className="blue-orange-calendar-event-form-label">Repeat</div>
                        <Dropdown onSelection={(item) => setRecurrenceChoice(item.reference)}>
                            <DropdownItemText
                                label="Does not repeat"
                                value={NO_RECURRENCE}
                                selected={recurrenceChoice === NO_RECURRENCE}
                            />
                            <DropdownItemText
                                label="Daily"
                                value={CalendarRecurrenceFrequency.DAILY}
                                selected={recurrenceChoice === CalendarRecurrenceFrequency.DAILY}
                            />
                            <DropdownItemText
                                label={`Weekly on ${moment(startDate).format('dddd')}`}
                                value={CalendarRecurrenceFrequency.WEEKLY}
                                selected={recurrenceChoice === CalendarRecurrenceFrequency.WEEKLY}
                            />
                            <DropdownItemText
                                label="Monthly"
                                value={CalendarRecurrenceFrequency.MONTHLY}
                                selected={recurrenceChoice === CalendarRecurrenceFrequency.MONTHLY}
                            />
                            <DropdownItemText
                                label="Annually"
                                value={CalendarRecurrenceFrequency.YEARLY}
                                selected={recurrenceChoice === CalendarRecurrenceFrequency.YEARLY}
                            />
                            <DropdownItemText
                                label="Every weekday (Mon–Fri)"
                                value={CalendarRecurrenceFrequency.WEEKDAY}
                                selected={recurrenceChoice === CalendarRecurrenceFrequency.WEEKDAY}
                            />
                            <DropdownItemText
                                label="Custom…"
                                value={CalendarRecurrenceFrequency.CUSTOM}
                                selected={recurrenceChoice === CalendarRecurrenceFrequency.CUSTOM}
                            />
                        </Dropdown>
                        {recurrenceChoice === CalendarRecurrenceFrequency.CUSTOM && (
                            <div className="blue-orange-calendar-event-form-custom-recurrence">
                                <div className="blue-orange-calendar-event-form-custom-recurrence-row">
                                    <span className="blue-orange-calendar-event-form-custom-suffix">
                                        Every
                                    </span>
                                    <Input
                                        isNumber={true}
                                        value={customInterval}
                                        onChange={setCustomInterval}
                                        style={{ width: '70px' }}
                                    />
                                    <Dropdown
                                        onSelection={(item) =>
                                            setCustomUnit(item.reference as CalendarRecurrenceUnit)
                                        }
                                    >
                                        {RECURRENCE_UNITS.map((unit) => (
                                            <DropdownItemText
                                                key={unit.value}
                                                label={unit.label}
                                                value={unit.value}
                                                selected={unit.value === customUnit}
                                            />
                                        ))}
                                    </Dropdown>
                                </div>
                                {customUnit === CalendarRecurrenceUnit.WEEK && (
                                    <div className="blue-orange-calendar-event-form-weekdays">
                                        {WEEKDAY_TOGGLES.map((day, index) => (
                                            <button
                                                type="button"
                                                key={index}
                                                className={`blue-orange-calendar-event-form-weekday no-select${
                                                    customWeekdays.includes(day.value)
                                                        ? ' blue-orange-calendar-event-form-weekday-active'
                                                        : ''
                                                }`}
                                                onClick={() => toggleCustomWeekday(day.value)}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Input label="Location" value={location} onChange={setLocation} />

                    {conferencingProviders.length > 0 && (
                        <div className="blue-orange-calendar-event-form-field">
                            <div className="blue-orange-calendar-event-form-label">
                                Video conferencing
                            </div>
                            <div className="blue-orange-calendar-event-form-conferencing">
                                {conferencingProviders.map((provider) => (
                                    <button
                                        type="button"
                                        key={provider.id}
                                        className={`blue-orange-calendar-event-form-conf-btn no-select${
                                            conferencing === provider.id
                                                ? ' blue-orange-calendar-event-form-conf-btn-active'
                                                : ''
                                        }`}
                                        onClick={() => toggleConferencing(provider.id)}
                                    >
                                        {provider.icon && <i className={provider.icon} />}
                                        <span>{provider.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="blue-orange-calendar-event-form-field">
                        <div className="blue-orange-calendar-event-form-label">Description</div>
                        <RichText
                            key={editorSeed}
                            content={seededContent}
                            allowMentions={false}
                            allowEmojis={false}
                            placeholder="Add a description"
                            minEditorHeight={90}
                            onChange={(content) => setDescriptionHtml(content)}
                        />
                    </div>

                    <div className="blue-orange-calendar-event-form-row">
                        <div className="blue-orange-calendar-event-form-field blue-orange-calendar-event-form-colour">
                            <div className="blue-orange-calendar-event-form-label">Colour</div>
                            <ColorPicker value={color} onChange={setColor} />
                        </div>
                        <div className="blue-orange-calendar-event-form-field blue-orange-calendar-event-form-availability">
                            <div className="blue-orange-calendar-event-form-label">
                                Availability
                            </div>
                            <ButtonToggle
                                value={availability}
                                options={[
                                    { value: CalendarEventAvailability.BUSY, label: 'Busy' },
                                    { value: CalendarEventAvailability.FREE, label: 'Free' },
                                ]}
                                onChange={(value) =>
                                    setAvailability(value as CalendarEventAvailability)
                                }
                            />
                        </div>
                    </div>

                    <div className="blue-orange-calendar-event-form-field">
                        <div className="blue-orange-calendar-event-form-label">Notification</div>
                        <Dropdown onSelection={(item) => setReminderChoice(item.reference)}>
                            {REMINDER_OPTIONS.map((option) => {
                                const value = option.minutes == null ? 'null' : String(option.minutes);
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
                            <div className="blue-orange-calendar-event-form-custom-reminder">
                                <Input
                                    isNumber={true}
                                    value={customReminderValue}
                                    onChange={setCustomReminderValue}
                                    style={{ width: '80px' }}
                                />
                                <Dropdown onSelection={(item) => setCustomReminderUnit(item.reference)}>
                                    {REMINDER_UNITS.map((unit) => (
                                        <DropdownItemText
                                            key={unit.value}
                                            label={unit.label}
                                            value={unit.value}
                                            selected={unit.value === customReminderUnit}
                                        />
                                    ))}
                                </Dropdown>
                                <span className="blue-orange-calendar-event-form-custom-suffix">
                                    before
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <ModalFooterRight>
                    <div className="blue-orange-calendar-event-form-actions">
                        <Button
                            text="Cancel"
                            buttonType={ButtonType.SECONDARY}
                            size={ButtonSize.SMALL}
                            onClick={onCancel}
                        />
                        <Button
                            text={editing ? 'Save' : 'Create'}
                            buttonType={ButtonType.PRIMARY}
                            size={ButtonSize.SMALL}
                            onClick={submit}
                        />
                    </div>
                </ModalFooterRight>
            </ModalFooter>
        </Modal>
    );
};
