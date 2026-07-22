import React from 'react';
import {
    Dropdown,
    DropdownItemText,
    DropdownItemObj,
} from '@blue-orange-ai/foundations-core';

import { ConfigAgentDto } from '../../interfaces/AgentProtocol';
import './ModelPicker.css';

interface Props {
    models: ConfigAgentDto[];
    value?: string;
    onChange: (modelName: string) => void;
    disabled?: boolean;
}

/**
 * Model selector backed by core's `Dropdown`. Options come from the server's
 * `GET /config/models` (only models the caller may access are returned).
 */
export const ModelPicker: React.FC<Props> = ({ models, value, onChange, disabled }) => {
    if (!models.length) return null;

    return (
        <div className="blue-orange-llm-model-picker">
            <Dropdown
                placeholder="Select a model"
                disabled={disabled}
                filter={models.length > 6}
                contextMaxHeight={320}
                onSelection={(item: DropdownItemObj) => onChange(item.reference)}
            >
                {models.map((model) => (
                    <DropdownItemText
                        key={`${model.provider}:${model.name}`}
                        label={model.display_name || model.name}
                        value={model.name}
                        selected={value === model.name}
                    />
                ))}
            </Dropdown>
        </div>
    );
};
