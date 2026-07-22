import React, { useState } from 'react';
import {
    Button,
    ButtonToggle,
    ButtonType,
    DateInput,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalFooterLeft,
    ModalFooterRight,
    ModalHeader,
    TextArea,
} from '@blue-orange-ai/foundations-core';
import { GanttTaskType, IGanttTask } from '../../interfaces/GanttInterfaces';
import { normalizeTask } from '../../utils/ganttUtils';
import './GanttTaskForm.css';

interface Props {
    task: IGanttTask;
    /** When true the form is creating a task (hides delete, titles differ). */
    isNew?: boolean;
    onSave: (task: IGanttTask) => void;
    onDelete?: (id: string | number) => void;
    onClose: () => void;
}

const TYPE_OPTIONS = [
    { value: GanttTaskType.TASK, label: 'Task', icon: 'ri-checkbox-blank-circle-line' },
    { value: GanttTaskType.SUMMARY, label: 'Summary', icon: 'ri-folder-line' },
    { value: GanttTaskType.MILESTONE, label: 'Milestone', icon: 'ri-flag-line' },
];

/**
 * The task create / edit modal. Built entirely from Foundations core inputs and
 * layout components so it matches the rest of the design system. Missing dates
 * are reconciled on save via {@link normalizeTask}.
 */
export const GanttTaskForm: React.FC<Props> = ({ task, isNew, onSave, onDelete, onClose }) => {
    const [text, setText] = useState(task.text ?? '');
    const [type, setType] = useState<GanttTaskType>(task.type ?? GanttTaskType.TASK);
    const [start, setStart] = useState<Date | undefined>(task.start);
    const [end, setEnd] = useState<Date | undefined>(task.end);
    const [duration, setDuration] = useState<string>(
        task.duration != null ? String(task.duration) : ''
    );
    const [progress, setProgress] = useState<string>(
        task.progress != null ? String(task.progress) : '0'
    );
    const [details, setDetails] = useState(task.details ?? '');

    const isMilestone = type === GanttTaskType.MILESTONE;
    const isSummary = type === GanttTaskType.SUMMARY;

    const handleSave = () => {
        const merged: IGanttTask = normalizeTask({
            ...task,
            text: text.trim() || 'Untitled task',
            type,
            start,
            end: isMilestone ? start : end,
            duration: duration === '' ? undefined : Math.max(0, Number(duration) || 0),
            progress: isMilestone
                ? undefined
                : Math.max(0, Math.min(100, Number(progress) || 0)),
            details: details.trim() || undefined,
        });
        onSave(merged);
    };

    return (
        <Modal width={440} onClose={onClose}>
            <ModalHeader label={isNew ? 'New task' : 'Edit task'} onClose={onClose} />
            <ModalBody>
                <div className="blue-orange-gantt-form">
                    <Input label="Name" value={text} onChange={setText} placeholder="Task name" />

                    <div className="blue-orange-gantt-form-field">
                        <label className="blue-orange-gantt-form-label">Type</label>
                        <ButtonToggle
                            options={TYPE_OPTIONS}
                            value={type}
                            onChange={(value) => setType(value as GanttTaskType)}
                        />
                    </div>

                    <div className="blue-orange-gantt-form-row">
                        <div className="blue-orange-gantt-form-col">
                            <DateInput
                                label={isMilestone ? 'Date' : 'Start'}
                                value={start}
                                onChange={setStart}
                            />
                        </div>
                        {!isMilestone && !isSummary && (
                            <div className="blue-orange-gantt-form-col">
                                <DateInput label="End" value={end} onChange={setEnd} />
                            </div>
                        )}
                    </div>

                    {!isMilestone && !isSummary && (
                        <div className="blue-orange-gantt-form-row">
                            <div className="blue-orange-gantt-form-col">
                                <Input
                                    label="Duration (days)"
                                    value={duration}
                                    isNumber
                                    onChange={setDuration}
                                    placeholder="0"
                                />
                            </div>
                            <div className="blue-orange-gantt-form-col">
                                <Input
                                    label="Progress (%)"
                                    value={progress}
                                    isNumber
                                    onChange={setProgress}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    )}

                    <TextArea
                        label="Details"
                        value={details}
                        onChange={setDetails}
                        placeholder="Optional notes"
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <ModalFooterLeft>
                    {!isNew && onDelete && (
                        <Button
                            text="Delete"
                            buttonType={ButtonType.DANGER}
                            icon="ri-delete-bin-line"
                            onClick={() => onDelete(task.id)}
                        />
                    )}
                </ModalFooterLeft>
                <ModalFooterRight>
                    <Button text="Cancel" buttonType={ButtonType.SECONDARY} onClick={onClose} />
                    <Button text="Save" buttonType={ButtonType.PRIMARY} onClick={handleSave} />
                </ModalFooterRight>
            </ModalFooter>
        </Modal>
    );
};
