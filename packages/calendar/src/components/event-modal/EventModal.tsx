import React from 'react';
import moment from 'moment';
import {
    Button,
    ButtonSize,
    ButtonType,
    Modal,
    ModalBody,
    ModalFooter,
    ModalFooterRight,
    ModalHeader,
} from '@blue-orange-ai/foundations-core';
import { ICalendarEvent, ICalendarSource } from '../../interfaces/CalendarInterfaces';
import { isAllDayEvent, resolveEventColors } from '../../utils/calendarUtils';
import './EventModal.css';

interface Props {
    event: ICalendarEvent;
    sources?: ICalendarSource[];
    onClose: () => void;
    onDelete?: (event: ICalendarEvent) => void;
    onEdit?: (event: ICalendarEvent) => void;
}

/**
 * A read-only detail popover for a single event, built on the Foundations core
 * {@link Modal}. Shown when an event is clicked in any view.
 */
export const EventModal: React.FC<Props> = ({ event, sources = [], onClose, onDelete, onEdit }) => {
    const colors = resolveEventColors(event, sources);
    const source = sources.find((s) => s.id === event.calendarId);
    const allDay = isAllDayEvent(event);

    const start = moment(event.start);
    const end = moment(event.end);
    const when = allDay
        ? start.isSame(end, 'day')
            ? start.format('dddd, MMMM D, YYYY')
            : `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`
        : `${start.format('dddd, MMMM D')} · ${start.format('h:mm A')} - ${end.format('h:mm A')}`;

    return (
        <Modal width={420} onClose={onClose}>
            <ModalHeader label={event.title} onClose={onClose} />
            <ModalBody>
                <div className="blue-orange-calendar-event-modal-row">
                    <i className="ri-time-line blue-orange-calendar-event-modal-icon" />
                    <span>{when}</span>
                </div>
                {source && (
                    <div className="blue-orange-calendar-event-modal-row">
                        <span
                            className="blue-orange-calendar-event-modal-source-dot"
                            style={{ backgroundColor: colors.borderColor }}
                        />
                        <span>{source.name}</span>
                    </div>
                )}
                {event.location && (
                    <div className="blue-orange-calendar-event-modal-row">
                        <i className="ri-map-pin-line blue-orange-calendar-event-modal-icon" />
                        <span>{event.location}</span>
                    </div>
                )}
                {event.body && (
                    <div className="blue-orange-calendar-event-modal-body-text">{event.body}</div>
                )}
            </ModalBody>
            {(onEdit || onDelete) && !event.isReadOnly && (
                <ModalFooter>
                    <ModalFooterRight>
                        {onDelete && (
                            <Button
                                text="Delete"
                                buttonType={ButtonType.DANGER}
                                size={ButtonSize.SMALL}
                                onClick={() => onDelete(event)}
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
                    </ModalFooterRight>
                </ModalFooter>
            )}
        </Modal>
    );
};
