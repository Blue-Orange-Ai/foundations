import React from 'react';
import { Button, ButtonIcon, ButtonSize, ButtonType } from '@blue-orange-ai/foundations-core';
import { IGanttZoomLevel } from '../../interfaces/GanttInterfaces';
import './GanttToolbar.css';

interface Props {
    zoom: IGanttZoomLevel;
    canZoomIn: boolean;
    canZoomOut: boolean;
    readonly?: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToday: () => void;
    onExpandAll: () => void;
    onCollapseAll: () => void;
    /** When provided, a primary "Add task" button is shown. */
    onCreate?: () => void;
}

/**
 * The Gantt header / toolbar: task creation, zoom controls, a "scroll to today"
 * jump and expand / collapse-all. Built entirely from Foundations core buttons so
 * it matches the rest of the design system.
 */
export const GanttToolbar: React.FC<Props> = ({
    zoom,
    canZoomIn,
    canZoomOut,
    readonly,
    onZoomIn,
    onZoomOut,
    onToday,
    onExpandAll,
    onCollapseAll,
    onCreate,
}) => {
    return (
        <div className="blue-orange-gantt-toolbar">
            <div className="blue-orange-gantt-toolbar-left">
                {!readonly && onCreate && (
                    <Button
                        text="Add task"
                        buttonType={ButtonType.PRIMARY}
                        size={ButtonSize.SMALL}
                        icon="ri-add-line"
                        onClick={onCreate}
                    />
                )}
                <ButtonIcon
                    icon="ri-node-tree"
                    label="Expand all"
                    size={ButtonSize.SMALL}
                    onClick={onExpandAll}
                />
                <ButtonIcon
                    icon="ri-collapse-diagonal-line"
                    label="Collapse all"
                    size={ButtonSize.SMALL}
                    onClick={onCollapseAll}
                />
            </div>

            <div className="blue-orange-gantt-toolbar-right">
                <Button
                    text="Today"
                    buttonType={ButtonType.SECONDARY}
                    size={ButtonSize.SMALL}
                    icon="ri-focus-3-line"
                    onClick={onToday}
                />
                <div className="blue-orange-gantt-toolbar-zoom">
                    <ButtonIcon
                        icon="ri-zoom-out-line"
                        label="Zoom out"
                        size={ButtonSize.SMALL}
                        onClick={onZoomOut}
                        isDisabled={!canZoomOut}
                    />
                    <span className="blue-orange-gantt-toolbar-zoom-label">{zoom.name}</span>
                    <ButtonIcon
                        icon="ri-zoom-in-line"
                        label="Zoom in"
                        size={ButtonSize.SMALL}
                        onClick={onZoomIn}
                        isDisabled={!canZoomIn}
                    />
                </div>
            </div>
        </div>
    );
};
