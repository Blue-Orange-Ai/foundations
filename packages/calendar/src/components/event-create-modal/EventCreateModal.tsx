import React, { useState } from 'react';
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
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { formatTimeRange, NEW_EVENT_TITLE, zoned } from '../../utils/calendarUtils';
import './EventCreateModal.css';

interface Props {
    /** Start of the range the user dragged out. */
    start: Date;
    /** End of the range the user dragged out. */
    end: Date;
    sources?: ICalendarSource[];
    /** IANA timezone the range is shown in. Defaults to the browser's zone. */
    timezone?: string;
    /** Pre-filled title, defaulting to the placeholder used on the draft block. */
    defaultTitle?: string;
    onCancel: () => void;
    onCreate: (event: ICalendarEvent) => void;
}

/**
 * The create form shown once a drag selection on the time grid is released. The
 * time range is fixed to whatever was dragged; only the title is editable here.
 */
export const EventCreateModal: React.FC<Props> = ({
    start,
    end,
    sources = [],
    timezone,
    defaultTitle = NEW_EVENT_TITLE,
    onCancel,
    onCreate,
}) => {
    const [title, setTitle] = useState<string>(defaultTitle);

    const submit = () => {
        onCreate({
            id: `event-${new Date().getTime()}`,
            title: title.trim() === '' ? defaultTitle : title.trim(),
            start,
            end,
            calendarId: sources.length > 0 ? sources[0].id : undefined,
        });
    };

    return (
        <Modal width={420} onClose={onCancel}>
            <ModalHeader label="New event" onClose={onCancel} />
            <ModalBody>
                <Input label="Title" value={title} focus={true} onChange={setTitle} enterEvent={submit} />
                <div className="blue-orange-calendar-event-create-modal-when">
                    <i className="ri-time-line blue-orange-calendar-event-create-modal-icon" />
                    <span>
                        {zoned(start, timezone).format('dddd, MMMM D')} ·{' '}
                        {formatTimeRange(start, end, timezone)}
                    </span>
                </div>
            </ModalBody>
            <ModalFooter>
                <ModalFooterRight>
                    <Button
                        text="Cancel"
                        buttonType={ButtonType.SECONDARY}
                        size={ButtonSize.SMALL}
                        onClick={onCancel}
                    />
                    <Button
                        text="Create"
                        buttonType={ButtonType.PRIMARY}
                        size={ButtonSize.SMALL}
                        onClick={submit}
                    />
                </ModalFooterRight>
            </ModalFooter>
        </Modal>
    );
};
