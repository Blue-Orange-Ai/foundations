import React from 'react';
import {
    Button,
    ButtonIconPos,
    ButtonType,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerFooterLeft,
    DrawerFooterRight,
    DrawerHeader,
    DrawerPosition,
    Dropdown,
    DropdownItemText,
    IconSelector,
    Input,
    TextArea,
    Toggle,
} from '@blue-orange-ai/foundations-core';
import { WorkflowDefinition, WorkflowNode, WorkflowRoute } from '../../interfaces/WorkflowGraph';
import { catalogFor } from '../../interfaces/NodeCatalog';
import { ModelOption, useModelOptions } from '../providers/LlmGraphProvider';
import { RoutesEditor } from './RoutesEditor';
import './NodeConfigDrawer.css';

interface Props {
    node: WorkflowNode;
    definition: WorkflowDefinition;
    onChange: (node: WorkflowNode) => void;
    onClose: () => void;
    onDelete: (node: WorkflowNode) => void;
}

const MODEL_SEP = ':::';

/** The right-hand drawer that edits one node's configuration. */
export const NodeConfigDrawer: React.FC<Props> = ({ node, definition, onChange, onClose, onDelete }) => {

    const models = useModelOptions();
    const catalog = catalogFor(node.type);
    const ui = (node.metadata && node.metadata.ui) || {};

    const set = (patch: Partial<WorkflowNode>) => onChange({ ...node, ...patch });
    const setUi = (patch: Record<string, any>) => onChange({
        ...node,
        metadata: { ...(node.metadata || {}), ui: { ...ui, ...patch } },
    });

    const setNumber = (key: keyof WorkflowNode) => (value: string) => {
        const trimmed = value.trim();
        set({ [key]: trimmed === '' ? undefined : Number(trimmed) } as Partial<WorkflowNode>);
    };

    const otherNodeIds = Object.keys(definition.nodes).filter((id) => id !== node.id);

    const modelLabel = (option: ModelOption) => option.label || `${option.provider} · ${option.model}`;
    const currentModel = node.provider && node.model ? `${node.provider} · ${node.model}` : 'Select a model';

    const renderModelPicker = () => {
        if (models.length === 0) {
            return (
                <>
                    <Input label={'Provider'} value={node.provider || ''} onChange={(value) => set({ provider: value })}></Input>
                    <Input label={'Model'} value={node.model || ''} onChange={(value) => set({ model: value })}></Input>
                </>
            );
        }
        return (
            <div className="bo-llm-graph-field">
                <div className="bo-llm-graph-field-label">Model</div>
                <Dropdown
                    filter={true}
                    placeholder={currentModel}
                    contextWidth={'fit-content'}
                    onSelection={(item) => {
                        const [provider, model] = item.reference.split(MODEL_SEP);
                        set({ provider, model });
                    }}
                >
                    {models.map((option, index) => (
                        <DropdownItemText
                            key={index}
                            label={modelLabel(option)}
                            value={`${option.provider}${MODEL_SEP}${option.model}`}
                            selected={option.provider === node.provider && option.model === node.model}
                        ></DropdownItemText>
                    ))}
                </Dropdown>
            </div>
        );
    };

    const renderAgentFields = () => (
        <>
            {renderModelPicker()}
            <TextArea
                label={'System prompt'}
                value={node.system_prompt || ''}
                onChange={(value) => set({ system_prompt: value })}
            ></TextArea>
            <div className="bo-llm-graph-field">
                <div className="bo-llm-graph-field-label">Extended thinking</div>
                <Toggle checked={!!node.thinking} onChange={(checked) => set({ thinking: checked })}></Toggle>
            </div>
            <Input label={'Temperature'} value={numText(node.temperature)} isNumber={true} onChange={setNumber('temperature')}></Input>
            <Input label={'Max tokens'} value={numText(node.max_tokens)} isNumber={true} onChange={setNumber('max_tokens')}></Input>
            <TextArea
                label={'Tool ids (comma separated)'}
                value={(node.tool_ids || []).join(', ')}
                onChange={(value) => set({ tool_ids: splitList(value) })}
            ></TextArea>
        </>
    );

    const renderTypeFields = () => {
        switch (node.type) {
            case 'task':
                return (
                    <>
                        {renderDependencies()}
                        {renderAgentFields()}
                        <TextArea
                            label={'Task instruction (optional, in addition to system prompt)'}
                            value={node.prompt || ''}
                            onChange={(value) => set({ prompt: value })}
                        ></TextArea>
                        <Input
                            label={'Output key (slot to publish the result under; defaults to the node id)'}
                            value={node.output_key || ''}
                            onChange={(value) => set({ output_key: value || undefined })}
                        ></Input>
                    </>
                );
            case 'step':
                return (
                    <>
                        {renderAgentFields()}
                        <Input label={'Until (advance when this condition holds)'} value={node.until || ''} onChange={(value) => set({ until: value || undefined })}></Input>
                        <Input label={'Next node id'} value={node.next || ''} onChange={(value) => set({ next: value || undefined })}></Input>
                        <Input label={'Max tries'} value={numText(node.max_tries)} isNumber={true} onChange={setNumber('max_tries')}></Input>
                        <Input label={'TTL seconds'} value={numText(node.ttl_seconds)} isNumber={true} onChange={setNumber('ttl_seconds')}></Input>
                    </>
                );
            case 'router':
                return (
                    <>
                        {renderAgentFields()}
                        <RoutesEditor
                            routes={node.routes || []}
                            targets={otherNodeIds}
                            onChange={(routes: Array<WorkflowRoute>) => set({ routes })}
                        ></RoutesEditor>
                        <Input label={'Default node id'} value={node.default || ''} onChange={(value) => set({ default: value || undefined })}></Input>
                    </>
                );
            case 'gate':
                return (
                    <>
                        <TextArea label={'Condition'} value={node.condition || ''} onChange={(value) => set({ condition: value })}></TextArea>
                        <Input label={'Then node id'} value={node.then || ''} onChange={(value) => set({ then: value || undefined })}></Input>
                        <Input label={'Else node id'} value={node.otherwise || ''} onChange={(value) => set({ otherwise: value || undefined })}></Input>
                    </>
                );
            case 'loop':
                return (
                    <>
                        <Input label={'Body node id'} value={node.body || ''} onChange={(value) => set({ body: value || undefined })}></Input>
                        <Input label={'Until condition'} value={node.until || ''} onChange={(value) => set({ until: value || undefined })}></Input>
                        <Input label={'Max tries'} value={numText(node.max_tries)} isNumber={true} onChange={setNumber('max_tries')}></Input>
                        <Input label={'TTL seconds'} value={numText(node.ttl_seconds)} isNumber={true} onChange={setNumber('ttl_seconds')}></Input>
                        <Input label={'Next node id'} value={node.next || ''} onChange={(value) => set({ next: value || undefined })}></Input>
                    </>
                );
            case 'end':
            case 'fail':
                return (
                    <TextArea label={'Message'} value={node.message || ''} onChange={(value) => set({ message: value })}></TextArea>
                );
            default:
                return null;
        }
    };

    const renderDependencies = () => (
        <div className="bo-llm-graph-field">
            <div className="bo-llm-graph-field-label">Depends on</div>
            {(node.depends_on || []).length === 0 &&
                <div className="bo-llm-graph-deps-empty">
                    None — drag a link from another task on the canvas to add a dependency.
                </div>}
            <div className="bo-llm-graph-deps">
                {(node.depends_on || []).map((dep) => (
                    <span className="bo-llm-graph-dep-chip" key={dep}>
                        <i className="ri-links-line"></i>{dep}
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <Drawer position={DrawerPosition.RIGHT} width={'420px'} onClose={onClose}>
            <DrawerHeader label={`${catalog.label}`} onClose={onClose}></DrawerHeader>
            <DrawerBody>
                <div className="bo-llm-graph-form">
                    <div className="bo-llm-graph-field">
                        <div className="bo-llm-graph-field-label">Node id</div>
                        <div className="bo-llm-graph-node-id">{node.id}</div>
                    </div>
                    <Input label={'Label'} value={ui.label || ''} onChange={(value) => setUi({ label: value })}></Input>
                    <Input label={'Description'} value={ui.description || ''} onChange={(value) => setUi({ description: value })}></Input>
                    <IconSelector label={'Icon'} value={iconMarkup(ui.icon || catalog.icon)} onChange={(value) => setUi({ icon: iconClass(value) })}></IconSelector>
                    {renderTypeFields()}
                </div>
            </DrawerBody>
            <DrawerFooter>
                <DrawerFooterLeft>
                    <Button text={'Delete'} buttonType={ButtonType.DANGER} icon={'ri-delete-bin-line'} iconPos={ButtonIconPos.LEFT} onClick={() => onDelete(node)}></Button>
                </DrawerFooterLeft>
                <DrawerFooterRight>
                    <Button text={'Done'} buttonType={ButtonType.PRIMARY} onClick={onClose}></Button>
                </DrawerFooterRight>
            </DrawerFooter>
        </Drawer>
    );
};

function numText(value: number | undefined): string {
    return value === undefined || value === null ? '' : String(value);
}

function splitList(value: string): Array<string> {
    return value.split(/[\s,]+/).map((item) => item.trim()).filter((item) => item.length > 0);
}

/** `IconSelector` works with `<i class="...">` markup; convert to/from a class. */
function iconMarkup(iconClass: string): string {
    return iconClass.indexOf('<') === 0 ? iconClass : `<i class="${iconClass}"></i>`;
}

function iconClass(markup: string): string {
    if (!markup) return '';
    const match = markup.match(/class="([^"]+)"/);
    return match ? match[1] : markup;
}
