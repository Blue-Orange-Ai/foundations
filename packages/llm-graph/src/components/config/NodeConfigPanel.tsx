import React from 'react';
import {
    Button,
    ButtonIcon,
    ButtonIconPos,
    ButtonType,
    Dropdown,
    DropdownItemText,
    IconSelector,
    Input,
    TextArea,
    Toggle,
} from '@blue-orange-ai/foundations-core';
import {
    WorkflowDefinition,
    WorkflowMemory,
    WorkflowNode,
    WorkflowRoute,
    WorkflowToolParameter,
} from '../../interfaces/WorkflowGraph';
import { canHostMemory, canHostTools, catalogFor } from '../../interfaces/NodeCatalog';
import { ModelOption, useLlmGraphConfig, useModelOptions } from '../providers/LlmGraphProvider';
import { WorkflowSerializer } from '../../services/WorkflowSerializer';
import { NodeHtml } from '../../services/NodeHtml';
import { RoutesEditor } from './RoutesEditor';
import { ToolParametersEditor } from './ToolParametersEditor';
import { MemoryConnectionEditor } from './MemoryConnectionEditor';
import { WorkflowLayout } from '../../services/WorkflowLayout';
import './NodeConfigPanel.css';

interface Props {
    node: WorkflowNode;
    definition: WorkflowDefinition;
    onChange: (node: WorkflowNode) => void;
    onClose: () => void;
    onDelete: (node: WorkflowNode) => void;
    /** Attach a new tool to the node being configured (an agent, or a tool). */
    onAddTool?: (parentId: string) => void;
    /** Give the agent node being configured a memory store. */
    onAddMemory?: (parentId: string) => void;
    /** Move the panel onto another node (used by the tool list / owner link). */
    onSelectNode?: (nodeId: string) => void;
}

const MODEL_SEP = ':::';

/**
 * The configuration pane for one node. It is rendered as the right-hand side of
 * a split view rather than as an overlay, so the canvas stays visible and
 * usable while a node is being configured.
 */
export const NodeConfigPanel: React.FC<Props> = ({
    node, definition, onChange, onClose, onDelete, onAddTool, onAddMemory, onSelectNode,
}) => {

    const models = useModelOptions();
    const registryTools = useLlmGraphConfig().tools || [];
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

    const otherNodeIds = WorkflowSerializer.topLevelIds(definition).filter((id) => id !== node.id);
    const tools = WorkflowSerializer.toolsOf(definition, node.id);
    const memory = WorkflowLayout.memoryOf(definition, node.id);
    const owner = node.parent ? definition.nodes[node.parent] : undefined;

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
        </>
    );

    /** The tools attached to this node, with add / open / remove. */
    const renderToolsSection = () => (
        <div className="bo-llm-graph-tools-section">
            <div className="bo-llm-graph-field-label">
                {node.type === 'tool' ? 'Scoped tools' : 'Tools'}
            </div>
            {tools.length === 0 &&
                <div className="bo-llm-graph-tools-empty">
                    {node.type === 'tool'
                        ? 'No tools yet. A tool added here is scoped to this one — only it can call them.'
                        : 'No tools yet. A tool is a function this agent may call mid-turn.'}
                </div>}
            <div className="bo-llm-graph-tool-list">
                {tools.map((tool) => (
                    <div className="bo-llm-graph-tool-chip" key={tool.id}>
                        <i className={(tool.metadata && tool.metadata.ui && tool.metadata.ui.icon) || 'ri-tools-line'}></i>
                        <div className="bo-llm-graph-tool-chip-text">
                            <span className="bo-llm-graph-tool-chip-name">{NodeHtml.title(tool)}</span>
                            <span className="bo-llm-graph-tool-chip-desc">{NodeHtml.subtitle(tool)}</span>
                        </div>
                        {onSelectNode &&
                            <ButtonIcon icon={'ri-settings-3-line'} onClick={() => onSelectNode(tool.id)}></ButtonIcon>}
                        <ButtonIcon icon={'ri-delete-bin-line'} onClick={() => onDelete(tool)}></ButtonIcon>
                    </div>
                ))}
            </div>
            {onAddTool &&
                <Button
                    text={node.type === 'tool' ? 'Add scoped tool' : 'Add tool'}
                    buttonType={ButtonType.SECONDARY}
                    icon={'ri-add-line'}
                    iconPos={ButtonIconPos.LEFT}
                    onClick={() => onAddTool(node.id)}
                ></Button>}
        </div>
    );

    /** The memory store attached to an agent, with add / open / remove. */
    const renderMemorySection = () => (
        <div className="bo-llm-graph-tools-section">
            <div className="bo-llm-graph-field-label">Memory</div>
            {!memory &&
                <div className="bo-llm-graph-tools-empty">
                    No memory. Attach a store and this agent recalls from it before it
                    runs, and writes back when its turn ends.
                </div>}
            {memory &&
                <div className="bo-llm-graph-tool-list">
                    <div className="bo-llm-graph-tool-chip">
                        <i className={(memory.metadata && memory.metadata.ui && memory.metadata.ui.icon) || 'ri-database-2-line'}></i>
                        <div className="bo-llm-graph-tool-chip-text">
                            <span className="bo-llm-graph-tool-chip-name">{NodeHtml.title(memory)}</span>
                            <span className="bo-llm-graph-tool-chip-desc">{NodeHtml.subtitle(memory)}</span>
                        </div>
                        {onSelectNode &&
                            <ButtonIcon icon={'ri-settings-3-line'} onClick={() => onSelectNode(memory.id)}></ButtonIcon>}
                        <ButtonIcon icon={'ri-delete-bin-line'} onClick={() => onDelete(memory)}></ButtonIcon>
                    </div>
                </div>}
            {!memory && onAddMemory &&
                <Button
                    text={'Add memory'}
                    buttonType={ButtonType.SECONDARY}
                    icon={'ri-database-2-line'}
                    iconPos={ButtonIconPos.LEFT}
                    onClick={() => onAddMemory(node.id)}
                ></Button>}
        </div>
    );

    /** A memory node: which store backs it, and how it is connected. */
    const renderMemoryFields = () => (
        <>
            {owner &&
                <div className="bo-llm-graph-field">
                    <div className="bo-llm-graph-field-label">Memory for</div>
                    <div
                        className={`bo-llm-graph-owner-chip${onSelectNode ? ' bo-llm-graph-owner-chip-link' : ''}`}
                        onClick={() => onSelectNode && onSelectNode(owner.id)}
                    >
                        <i className={(owner.metadata && owner.metadata.ui && owner.metadata.ui.icon) || 'ri-robot-2-line'}></i>
                        <span>{NodeHtml.title(owner)}</span>
                    </div>
                </div>}
            <MemoryConnectionEditor
                memory={node.memory || { provider: 'postgres' }}
                defaultNamespace={node.parent || node.id}
                onChange={(value: WorkflowMemory) => set({ memory: value })}
            ></MemoryConnectionEditor>
        </>
    );

    /** A tool node: either an inline declaration or a registry reference. */
    const renderToolFields = () => (
        <>
            {owner &&
                <div className="bo-llm-graph-field">
                    <div className="bo-llm-graph-field-label">
                        {owner.type === 'tool' ? 'Scoped to' : 'Belongs to'}
                    </div>
                    <div
                        className={`bo-llm-graph-owner-chip${onSelectNode ? ' bo-llm-graph-owner-chip-link' : ''}`}
                        onClick={() => onSelectNode && onSelectNode(owner.id)}
                    >
                        <i className={(owner.metadata && owner.metadata.ui && owner.metadata.ui.icon) || 'ri-robot-2-line'}></i>
                        <span>{NodeHtml.title(owner)}</span>
                    </div>
                </div>}
            <Input
                label={'Tool name (the name the agent calls)'}
                value={node.name || ''}
                onChange={(value) => set({ name: value })}
            ></Input>
            <TextArea
                label={'Description (tells the agent when to call it)'}
                value={node.description || ''}
                onChange={(value) => set({ description: value })}
            ></TextArea>
            {registryTools.length > 0 &&
                <div className="bo-llm-graph-field">
                    <div className="bo-llm-graph-field-label">Registry tool (optional)</div>
                    <Dropdown
                        filter={true}
                        placeholder={node.tool_ref || 'Declare inline instead'}
                        contextWidth={'fit-content'}
                        onSelection={(item) => set({ tool_ref: item.reference || undefined })}
                    >
                        <DropdownItemText label={'Declare inline'} value={''} selected={!node.tool_ref}></DropdownItemText>
                        {registryTools.map((tool, index) => (
                            <DropdownItemText
                                key={index}
                                label={tool.name}
                                value={tool.name}
                                selected={node.tool_ref === tool.name}
                            ></DropdownItemText>
                        ))}
                    </Dropdown>
                </div>}
            {!node.tool_ref &&
                <ToolParametersEditor
                    parameters={node.parameters || []}
                    onChange={(parameters: Array<WorkflowToolParameter>) => set({ parameters })}
                ></ToolParametersEditor>}
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
            case 'tool':
                return renderToolFields();
            case 'memory':
                return renderMemoryFields();
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
        <div className="bo-llm-graph-config-panel">
            <div className="bo-llm-graph-config-header">
                <div
                    className="bo-llm-graph-config-header-icon"
                    style={{ backgroundColor: NodeHtml.accent(node) }}
                >
                    <i className={ui.icon || catalog.icon}></i>
                </div>
                <div className="bo-llm-graph-config-header-text">
                    <div className="bo-llm-graph-config-header-kind">{catalog.label}</div>
                    <div className="bo-llm-graph-config-header-title">{NodeHtml.title(node)}</div>
                </div>
                <ButtonIcon icon={'ri-close-line'} onClick={onClose}></ButtonIcon>
            </div>

            <div className="bo-llm-graph-config-body">
                <div className="bo-llm-graph-form">
                    <div className="bo-llm-graph-field">
                        <div className="bo-llm-graph-field-label">Node id</div>
                        <div className="bo-llm-graph-node-id">{node.id}</div>
                    </div>
                    <Input label={'Label'} value={ui.label || ''} onChange={(value) => setUi({ label: value })}></Input>
                    {node.type !== 'memory' &&
                        <Input label={'Description'} value={ui.description || ''} onChange={(value) => setUi({ description: value })}></Input>}
                    <IconSelector label={'Icon'} value={iconMarkup(ui.icon || catalog.icon)} onChange={(value) => setUi({ icon: iconClass(value) })}></IconSelector>
                    {renderTypeFields()}
                    {canHostMemory(node.type) && renderMemorySection()}
                    {canHostTools(node.type) && !node.tool_ref && renderToolsSection()}
                </div>
            </div>

            <div className="bo-llm-graph-config-footer">
                <Button text={'Delete'} buttonType={ButtonType.DANGER} icon={'ri-delete-bin-line'} iconPos={ButtonIconPos.LEFT} onClick={() => onDelete(node)}></Button>
                <Button text={'Done'} buttonType={ButtonType.PRIMARY} onClick={onClose}></Button>
            </div>
        </div>
    );
};

function numText(value: number | undefined): string {
    return value === undefined || value === null ? '' : String(value);
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
