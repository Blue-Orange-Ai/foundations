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
    ICalendarEvent,
    ICalendarSource,
} from '../../interfaces/CalendarInterfaces';
import {
    conferencingBlockHtml,
    DEFAULT_CONFERENCING_PROVIDERS,
    DEFAULT_REMINDER_MINUTES,
    IConferencingProvider,
    NEW_EVENT_TITLE,
    REMINDER_OPTIONS,
    stripConferencingBlock,
} from '../../utils/calendarUtils';
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
     * guest list changed, `meta.notify` records which guests to inform.
     */
    onCreate: (event: ICalendarEvent, meta?: { notify?: CalendarNotifyScope }) => void;
}

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

    // While a notify choice is being made, the built event waits here.
    const [pendingNotify, setPendingNotify] = useState<ICalendarEvent | null>(null);

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

    const submit = () => {
        const event = buildEvent();
        // Only editing an email-backed event with a changed guest list needs the
        // "notify who?" step; every other save goes straight through.
        if (editing && emailCompatibility && guestsChanged()) {
            setPendingNotify(event);
            return;
        }
        onCreate(event);
    };

    const busy = availability === CalendarEventAvailability.BUSY;
    // No colour chosen yet -> fall back to the theme's event accent.
    const swatchColor = color.trim() !== '' ? color : 'var(--blue-orange-light-calendar-event-accent-color)';

    // New guests are those present now but not when the form opened.
    const newGuestCount =
        requiredGuests.filter((email) => !initialRequired.includes(email)).length +
        optionalGuests.filter((email) => !initialOptional.includes(email)).length;

    // Step shown after saving an edited event whose guest list changed: choose
    // who to notify before the change is committed.
    if (pendingNotify) {
        const finish = (notify: CalendarNotifyScope) => {
            onCreate(pendingNotify, { notify });
        };
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
                                onClick={() => finish(CalendarNotifyScope.NONE)}
                            />
                            {newGuestCount > 0 && (
                                <Button
                                    text="New guests only"
                                    buttonType={ButtonType.SECONDARY}
                                    size={ButtonSize.SMALL}
                                    onClick={() => finish(CalendarNotifyScope.NEW)}
                                />
                            )}
                            <Button
                                text="Notify all guests"
                                buttonType={ButtonType.PRIMARY}
                                size={ButtonSize.SMALL}
                                onClick={() => finish(CalendarNotifyScope.ALL)}
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
