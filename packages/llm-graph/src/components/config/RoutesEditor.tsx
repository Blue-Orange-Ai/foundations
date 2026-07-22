import React from 'react';
import { Button, ButtonIconPos, ButtonType, ButtonIcon, Input } from '@blue-orange-ai/foundations-core';
import { WorkflowRoute } from '../../interfaces/WorkflowGraph';
import './RoutesEditor.css';

interface Props {
    routes: Array<WorkflowRoute>;
    /** Node ids that a route may target. */
    targets: Array<string>;
    onChange: (routes: Array<WorkflowRoute>) => void;
}

/** Edit the list of routes an agent `router` node may pick between. */
export const RoutesEditor: React.FC<Props> = ({ routes, targets, onChange }) => {

    const update = (index: number, patch: Partial<WorkflowRoute>) => {
        const next = routes.map((route, i) => (i === index ? { ...route, ...patch } : route));
        onChange(next);
    };

    const remove = (index: number) => {
        onChange(routes.filter((_, i) => i !== index));
    };

    const add = () => {
        onChange([...routes, { target: targets[0] || '', name: '', description: '' }]);
    };

    return (
        <div className="bo-llm-graph-routes-editor">
            <div className="bo-llm-graph-routes-editor-label">Routes</div>
            {routes.length === 0 &&
                <div className="bo-llm-graph-routes-editor-empty">No routes yet.</div>}
            {routes.map((route, index) => (
                <div className="bo-llm-graph-route-row" key={index}>
                    <Input
                        label={'Name'}
                        value={route.name || ''}
                        onChange={(value) => update(index, { name: value })}
                    ></Input>
                    <Input
                        label={'Target node id'}
                        value={route.target}
                        onChange={(value) => update(index, { target: value })}
                    ></Input>
                    <Input
                        label={'Description (helps the agent choose)'}
                        value={route.description || ''}
                        onChange={(value) => update(index, { description: value })}
                    ></Input>
                    <div className="bo-llm-graph-route-remove">
                        <ButtonIcon icon={'ri-delete-bin-line'} onClick={() => remove(index)}></ButtonIcon>
                    </div>
                </div>
            ))}
            <div className="bo-llm-graph-routes-editor-add">
                <Button text={'Add route'} buttonType={ButtonType.SECONDARY} icon={'ri-add-line'} iconPos={ButtonIconPos.LEFT} onClick={add}></Button>
            </div>
        </div>
    );
};
