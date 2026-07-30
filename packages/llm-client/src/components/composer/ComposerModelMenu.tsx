// ---------------------------------------------------------------------------
// ComposerModelMenu — the model selector in the composer's control row.
//
// Deliberately not core's `Dropdown`: inside the composer bar the control should
// read as a small chip ("Claude Opus 5 ⌄"), not as a form input. Core's
// ContextMenu gives the same list treatment as the "+" menu, with the models
// grouped under provider headings and a check mark on the current one.
// ---------------------------------------------------------------------------

import React from 'react';
import {
    ContextMenu,
    IContextMenuItem,
    IContextMenuType,
    SimpleTooltip,
} from '@blue-orange-ai/foundations-core';

import { ConfigAgentDto } from '../../interfaces/AgentProtocol';
import './Composer.css';

interface Props {
    models: ConfigAgentDto[];
    value?: string;
    onChange: (model: string) => void;
    groupByProvider?: boolean;
    showProvider?: boolean;
    placeholder?: string;
    disabled?: boolean;
}

const label = (model: ConfigAgentDto): string => model.display_name || model.name;

const buildItems = (
    models: ConfigAgentDto[],
    value: string | undefined,
    groupByProvider: boolean,
): IContextMenuItem[] => {
    const row = (model: ConfigAgentDto): IContextMenuItem => ({
        label: label(model),
        type: IContextMenuType.CONTENT,
        rightIcon: model.name === value ? 'ri-check-line' : undefined,
        value: model,
    });

    if (!groupByProvider) return models.map(row);

    const providers: string[] = [];
    models.forEach((model) => {
        if (!providers.includes(model.provider)) providers.push(model.provider);
    });

    // A single provider needs no heading — it would just be noise.
    if (providers.length < 2) return models.map(row);

    const items: IContextMenuItem[] = [];
    providers.forEach((provider, index) => {
        if (index > 0) items.push({ label: '', type: IContextMenuType.SEPARATOR });
        items.push({ label: provider, type: IContextMenuType.HEADING });
        models.filter((model) => model.provider === provider).forEach((model) => items.push(row(model)));
    });
    return items;
};

export const ComposerModelMenu: React.FC<Props> = ({
    models,
    value,
    onChange,
    groupByProvider = true,
    showProvider = false,
    placeholder = 'Select a model',
    disabled,
}) => {
    const selected = models.find((model) => model.name === value);
    const triggerLabel = selected ? label(selected) : placeholder;
    const provider = showProvider && selected ? selected.provider : undefined;

    const handleClick = (row: IContextMenuItem) => {
        if (row.type !== IContextMenuType.CONTENT) return;
        const model = row.value as ConfigAgentDto | undefined;
        if (model && model.name !== value) onChange(model.name);
    };

    return (
        <ContextMenu
            items={buildItems(models, value, groupByProvider)}
            onClick={handleClick}
            contextFixedToClick={false}
            disabled={disabled}
            maxHeight={360}
        >
            {/* Keyed so the tooltip picks up the newly selected model's description —
                core's SimpleTooltip binds its content once on mount. */}
            <SimpleTooltip
                key={selected?.name || 'none'}
                label={selected?.description || 'Change model'}
            >
                <button
                    type="button"
                    className="blue-orange-llm-composer-chip"
                    disabled={disabled}
                    aria-label={`Model: ${triggerLabel}`}
                >
                    <span className="blue-orange-llm-composer-chip-label">{triggerLabel}</span>
                    {provider && <span className="blue-orange-llm-composer-chip-sub">{provider}</span>}
                    <i className="ri-arrow-down-s-line blue-orange-llm-composer-chip-caret" />
                </button>
            </SimpleTooltip>
        </ContextMenu>
    );
};
