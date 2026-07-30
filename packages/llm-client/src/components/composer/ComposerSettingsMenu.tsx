// ---------------------------------------------------------------------------
// ComposerSettingsMenu — generation settings for the next turn.
//
// Renders whatever controls the consumer declares (`ComposerSetting[]`) using
// core's own inputs: `Toggle` for booleans, `Slider` for numbers, and a
// segmented row for enumerations. The built-in set is extended thinking,
// reasoning effort and temperature; anything else a deployment supports can be
// added without touching this component.
// ---------------------------------------------------------------------------

import React from 'react';
import { SimpleTooltip, Slider, SliderValue, Toggle } from '@blue-orange-ai/foundations-core';

import {
    ComposerSetting,
    ComposerSettingValue,
    ComposerSettingValues,
} from '../../interfaces/ComposerInterfaces';
import { ComposerPopover } from './ComposerPopover';
import './Composer.css';

interface Props {
    items: ComposerSetting[];
    values: ComposerSettingValues;
    onChange: (id: string, value: ComposerSettingValue) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    icon?: string;
    label?: string;
    title?: string;
    disabled?: boolean;
}

const asNumber = (value: ComposerSettingValue | undefined, fallback: number): number =>
    typeof value === 'number' ? value : fallback;

export const ComposerSettingsMenu: React.FC<Props> = ({
    items,
    values,
    onChange,
    open,
    onOpenChange,
    icon = 'ri-equalizer-3-line',
    label,
    title = 'Generation settings',
    disabled,
}) => {
    const trigger = (
        <SimpleTooltip label={title}>
            <button
                type="button"
                className={`blue-orange-llm-composer-chip${
                    open ? ' blue-orange-llm-composer-chip-open' : ''
                }`}
                onClick={() => onOpenChange(!open)}
                disabled={disabled}
                aria-label={title}
                aria-expanded={open}
            >
                <i className={icon} />
                {label && <span className="blue-orange-llm-composer-chip-label">{label}</span>}
            </button>
        </SimpleTooltip>
    );

    const renderControl = (setting: ComposerSetting) => {
        const value = values[setting.id];

        if (setting.type === 'toggle') {
            return (
                <Toggle
                    checked={Boolean(value)}
                    onChange={(checked: boolean) => onChange(setting.id, checked)}
                    disabled={disabled}
                />
            );
        }

        if (setting.type === 'select') {
            const options = setting.options || [];
            return (
                <div className="blue-orange-llm-composer-segmented">
                    {options.map((option) => (
                        <button
                            key={String(option.value)}
                            type="button"
                            className={`blue-orange-llm-composer-segment${
                                value === option.value ? ' blue-orange-llm-composer-segment-active' : ''
                            }`}
                            onClick={() => onChange(setting.id, option.value)}
                            disabled={disabled}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            );
        }

        const min = setting.min ?? 0;
        const max = setting.max ?? 1;
        return (
            <Slider
                value={asNumber(value, min)}
                min={min}
                max={max}
                step={setting.step ?? 0.05}
                disabled={disabled}
                showValue
                formatValue={setting.format}
                onChange={(next: SliderValue) =>
                    onChange(setting.id, Array.isArray(next) ? next[0] : next)
                }
            />
        );
    };

    return (
        <ComposerPopover trigger={trigger} open={open} onOpenChange={onOpenChange} width={288}>
            <div className="blue-orange-llm-composer-settings">
                <div className="blue-orange-llm-composer-settings-title">{title}</div>
                {items.map((setting) => (
                    <div
                        key={setting.id}
                        className={`blue-orange-llm-composer-setting blue-orange-llm-composer-setting-${setting.type}`}
                    >
                        <div className="blue-orange-llm-composer-setting-head">
                            <div className="blue-orange-llm-composer-setting-labels">
                                <span className="blue-orange-llm-composer-setting-label">{setting.label}</span>
                                {setting.description && (
                                    <span className="blue-orange-llm-composer-setting-desc">
                                        {setting.description}
                                    </span>
                                )}
                            </div>
                            {setting.type === 'toggle' && renderControl(setting)}
                        </div>
                        {setting.type !== 'toggle' && (
                            <div className="blue-orange-llm-composer-setting-body">{renderControl(setting)}</div>
                        )}
                    </div>
                ))}
            </div>
        </ComposerPopover>
    );
};
