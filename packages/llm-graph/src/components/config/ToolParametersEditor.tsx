import React from 'react';
import {
    Button,
    ButtonIcon,
    ButtonIconPos,
    ButtonType,
    Input,
    Toggle,
} from '@blue-orange-ai/foundations-core';
import { WorkflowToolParameter } from '../../interfaces/WorkflowGraph';
import './ToolParametersEditor.css';

interface Props {
    parameters: Array<WorkflowToolParameter>;
    onChange: (parameters: Array<WorkflowToolParameter>) => void;
}

/**
 * Edit the parameter list a tool declares. Mirrors the agent's
 * `ActionParameter`: a name, a type expression, whether it is required, and the
 * description the model reads when deciding what to pass.
 */
export const ToolParametersEditor: React.FC<Props> = ({ parameters, onChange }) => {

    const update = (index: number, patch: Partial<WorkflowToolParameter>) => {
        onChange(parameters.map((parameter, i) => (i === index ? { ...parameter, ...patch } : parameter)));
    };

    const remove = (index: number) => {
        onChange(parameters.filter((_, i) => i !== index));
    };

    const add = () => {
        onChange([...parameters, { name: '', type_expr: 'str', required: true, description: '' }]);
    };

    return (
        <div className="bo-llm-graph-params-editor">
            <div className="bo-llm-graph-params-editor-label">Parameters</div>
            {parameters.length === 0 &&
                <div className="bo-llm-graph-params-editor-empty">
                    No parameters — the agent calls this tool with no arguments.
                </div>}
            {parameters.map((parameter, index) => (
                <div className="bo-llm-graph-param-row" key={index}>
                    <Input
                        label={'Name'}
                        value={parameter.name || ''}
                        onChange={(value) => update(index, { name: value })}
                    ></Input>
                    <Input
                        label={'Type (e.g. str, int, list[str])'}
                        value={parameter.type_expr || ''}
                        onChange={(value) => update(index, { type_expr: value })}
                    ></Input>
                    <Input
                        label={'Description (tells the agent what to pass)'}
                        value={parameter.description || ''}
                        onChange={(value) => update(index, { description: value })}
                    ></Input>
                    <div className="bo-llm-graph-param-required">
                        <span>Required</span>
                        <Toggle
                            checked={parameter.required !== false}
                            onChange={(checked) => update(index, { required: checked })}
                        ></Toggle>
                    </div>
                    <div className="bo-llm-graph-param-remove">
                        <ButtonIcon icon={'ri-delete-bin-line'} onClick={() => remove(index)}></ButtonIcon>
                    </div>
                </div>
            ))}
            <div className="bo-llm-graph-params-editor-add">
                <Button
                    text={'Add parameter'}
                    buttonType={ButtonType.SECONDARY}
                    icon={'ri-add-line'}
                    iconPos={ButtonIconPos.LEFT}
                    onClick={add}
                ></Button>
            </div>
        </div>
    );
};
