import React from 'react';
import { Button, ButtonIconPos, ButtonType, SimpleTooltip } from '@blue-orange-ai/foundations-core';
import './EditorToolbar.css';

interface Props {
    name: string;
    onNameChange: (name: string) => void;
    nodeCount: number;
    errorCount: number;
    warningCount: number;
    running?: boolean;
    onAddNode: () => void;
    onAutoLayout: () => void;
    onValidate: () => void;
    onExport: () => void;
    onSave?: () => void;
    onRun?: () => void;
}

/** The top bar: workflow name, node stats and the primary actions. */
export const EditorToolbar: React.FC<Props> = ({
    name, onNameChange, nodeCount, errorCount, warningCount, running,
    onAddNode, onAutoLayout, onValidate, onExport, onSave, onRun,
}) => {
    return (
        <div className="bo-llm-graph-toolbar">
            <div className="bo-llm-graph-toolbar-left">
                <i className="ri-flow-chart bo-llm-graph-toolbar-logo"></i>
                <input
                    className="bo-llm-graph-toolbar-name"
                    value={name}
                    placeholder="Workflow name"
                    onChange={(event) => onNameChange(event.target.value)}
                />
                <div className="bo-llm-graph-toolbar-stats">
                    <span className="bo-llm-graph-stat"><i className="ri-node-tree"></i>{nodeCount}</span>
                    {errorCount > 0 &&
                        <span className="bo-llm-graph-stat bo-llm-graph-stat-error">
                            <i className="ri-error-warning-line"></i>{errorCount}
                        </span>}
                    {warningCount > 0 &&
                        <span className="bo-llm-graph-stat bo-llm-graph-stat-warning">
                            <i className="ri-alert-line"></i>{warningCount}
                        </span>}
                </div>
            </div>
            <div className="bo-llm-graph-toolbar-right">
                <SimpleTooltip label={'Add node'}>
                    <Button text={'Add'} icon={'ri-add-line'} iconPos={ButtonIconPos.LEFT} buttonType={ButtonType.SECONDARY} onClick={onAddNode}></Button>
                </SimpleTooltip>
                <SimpleTooltip label={'Auto-layout'}>
                    <Button text={'Layout'} icon={'ri-node-tree'} iconPos={ButtonIconPos.LEFT} buttonType={ButtonType.SECONDARY} onClick={onAutoLayout}></Button>
                </SimpleTooltip>
                <SimpleTooltip label={'Validate'}>
                    <Button text={'Validate'} icon={'ri-checkbox-circle-line'} iconPos={ButtonIconPos.LEFT} buttonType={ButtonType.SECONDARY} onClick={onValidate}></Button>
                </SimpleTooltip>
                <SimpleTooltip label={'Export definition JSON'}>
                    <Button text={'Export'} icon={'ri-code-s-slash-line'} iconPos={ButtonIconPos.LEFT} buttonType={ButtonType.SECONDARY} onClick={onExport}></Button>
                </SimpleTooltip>
                {onSave &&
                    <Button text={'Save'} icon={'ri-save-line'} iconPos={ButtonIconPos.LEFT} buttonType={ButtonType.PRIMARY} onClick={onSave}></Button>}
                {onRun &&
                    <Button text={'Run'} icon={'ri-play-line'} iconPos={ButtonIconPos.LEFT} buttonType={ButtonType.SUCCESS} isLoading={running} onClick={onRun}></Button>}
            </div>
        </div>
    );
};
