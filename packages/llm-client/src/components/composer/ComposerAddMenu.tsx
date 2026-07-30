// ---------------------------------------------------------------------------
// ComposerAddMenu — the "+" button at the bottom-left of the composer.
//
// Opens core's ContextMenu (which already handles placement, submenus, headings
// and separators) over a list the consumer supplies: attach a file, pick a tool,
// pick a skill, or any bespoke action. Nested `items` become submenus, so a long
// tool or skill registry stays one hover away instead of flooding the menu.
// ---------------------------------------------------------------------------

import React from 'react';
import {
    ContextMenu,
    IContextMenuItem,
    IContextMenuType,
    SimpleTooltip,
} from '@blue-orange-ai/foundations-core';

import { ComposerMenuItem } from '../../interfaces/ComposerInterfaces';
import './Composer.css';

interface Props {
    items: ComposerMenuItem[];
    onSelect: (item: ComposerMenuItem) => void;
    icon?: string;
    tooltip?: string;
    width?: number;
    disabled?: boolean;
}

/** Core menu rows carry the originating composer item on `value`. */
const toMenuItems = (items: ComposerMenuItem[]): IContextMenuItem[] => {
    const rows: IContextMenuItem[] = [];
    items.forEach((item) => {
        if (item.separatorBefore && rows.length > 0) {
            rows.push({ label: '', type: IContextMenuType.SEPARATOR });
        }
        if (item.heading) {
            rows.push({ label: item.label, type: IContextMenuType.HEADING });
            return;
        }
        if (item.items && item.items.length > 0) {
            rows.push({
                label: item.label,
                type: IContextMenuType.GROUP,
                icon: item.icon,
                children: toMenuItems(item.items),
                value: item,
            });
            return;
        }
        rows.push({
            label: item.label,
            type: IContextMenuType.CONTENT,
            icon: item.icon,
            rightIcon: item.checked ? 'ri-check-line' : undefined,
            value: item,
        });
    });
    return rows;
};

export const ComposerAddMenu: React.FC<Props> = ({
    items,
    onSelect,
    icon = 'ri-add-line',
    tooltip = 'Add files, tools and skills',
    /** Omitted by default so the panel sizes to its content, as core's do. */
    width,
    disabled,
}) => {
    const handleClick = (row: IContextMenuItem) => {
        // Headings and separators come through here too; only real rows count.
        if (row.type !== IContextMenuType.CONTENT) return;
        const item = row.value as ComposerMenuItem | undefined;
        if (item) onSelect(item);
    };

    return (
        <ContextMenu
            items={toMenuItems(items)}
            onClick={handleClick}
            width={width}
            contextFixedToClick={false}
            disabled={disabled}
        >
            <SimpleTooltip label={tooltip}>
                <button
                    type="button"
                    className="blue-orange-llm-composer-plus"
                    disabled={disabled}
                    aria-label={tooltip}
                >
                    <i className={icon} />
                </button>
            </SimpleTooltip>
        </ContextMenu>
    );
};
