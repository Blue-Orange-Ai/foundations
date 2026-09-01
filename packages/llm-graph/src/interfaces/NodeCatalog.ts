/**
 * The catalog of node kinds the editor can place, with the presentation
 * (icon / accent colour / label) and default field values for each. It drives
 * the add-node palette and the node-card rendering, and is the single place to
 * tune how each `WorkflowNodeType` looks and starts out.
 */
import { WorkflowNode, WorkflowNodeType } from './WorkflowGraph';

export type NodeCategory = 'agents' | 'tools' | 'memory' | 'logic' | 'terminals';

export interface NodeCatalogEntry {
    type: WorkflowNodeType;
    label: string;
    description: string;
    category: NodeCategory;
    /** remixicon class, e.g. `ri-robot-2-line`. */
    icon: string;
    /** Accent colour for the node card / palette chip. */
    color: string;
    /** Field defaults merged into a freshly created node of this type. */
    defaults: Partial<WorkflowNode>;
    /**
     * True when the kind may only exist nested under a parent node (a `tool`
     * under an agent), never as a free-standing node on the canvas.
     */
    nested?: boolean;
}

export const NODE_CATALOG: Record<WorkflowNodeType, NodeCatalogEntry> = {
    task: {
        type: 'task',
        label: 'Agent Task',
        description: 'Run an agent once its upstream tasks complete.',
        category: 'agents',
        icon: 'ri-robot-2-line',
        color: '#4f6bed',
        defaults: {
            provider: 'anthropic',
            model: '',
            system_prompt: '',
            depends_on: [],
            tools: [],
            tool_ids: [],
        },
    },
    step: {
        type: 'step',
        label: 'Conversational Step',
        description: 'Collect / verify information over a conversation turn.',
        category: 'agents',
        icon: 'ri-chat-3-line',
        color: '#0f9d8f',
        defaults: {
            provider: 'anthropic',
            model: '',
            system_prompt: '',
            tools: [],
            tool_ids: [],
        },
    },
    router: {
        type: 'router',
        label: 'Router',
        description: 'Let an agent choose the best next branch.',
        category: 'logic',
        icon: 'ri-git-branch-line',
        color: '#8b5cf6',
        defaults: {
            provider: 'anthropic',
            model: '',
            system_prompt: '',
            routes: [],
        },
    },
    gate: {
        type: 'gate',
        label: 'Condition Gate',
        description: 'Deterministic if / then / else on collected state.',
        category: 'logic',
        icon: 'ri-git-merge-line',
        color: '#e0a012',
        defaults: {
            condition: '',
            then: '',
            otherwise: '',
        },
    },
    loop: {
        type: 'loop',
        label: 'Loop',
        description: 'Repeat a body until a condition holds (bounded).',
        category: 'logic',
        icon: 'ri-loop-left-line',
        color: '#0ea5c4',
        defaults: {
            body: '',
            until: '',
        },
    },
    tool: {
        type: 'tool',
        label: 'Tool',
        description: 'A function the agent may call mid-conversation.',
        category: 'tools',
        icon: 'ri-tools-line',
        color: '#d9730d',
        nested: true,
        defaults: {
            name: '',
            description: '',
            parameters: [],
        },
    },
    memory: {
        type: 'memory',
        label: 'Memory',
        description: 'A store the agent recalls from and writes back to.',
        category: 'memory',
        icon: 'ri-database-2-line',
        color: '#7c5cbf',
        nested: true,
        defaults: {
            memory: { provider: 'postgres', write: true, recall_limit: 20, postgres: {} },
        },
    },
    end: {
        type: 'end',
        label: 'End',
        description: 'Terminal success node.',
        category: 'terminals',
        icon: 'ri-checkbox-circle-line',
        color: '#22a06b',
        defaults: {
            message: '',
        },
    },
    fail: {
        type: 'fail',
        label: 'Fail',
        description: 'Terminal failure node.',
        category: 'terminals',
        icon: 'ri-close-circle-line',
        color: '#e5484d',
        defaults: {
            message: '',
        },
    },
};

export const NODE_CATALOG_LIST: Array<NodeCatalogEntry> = [
    NODE_CATALOG.task,
    NODE_CATALOG.step,
    NODE_CATALOG.tool,
    NODE_CATALOG.memory,
    NODE_CATALOG.router,
    NODE_CATALOG.gate,
    NODE_CATALOG.loop,
    NODE_CATALOG.end,
    NODE_CATALOG.fail,
];

export const NODE_CATEGORIES: Array<{ id: NodeCategory; label: string }> = [
    { id: 'agents', label: 'Agents' },
    { id: 'tools', label: 'Tools' },
    { id: 'memory', label: 'Memory' },
    { id: 'logic', label: 'Logic' },
    { id: 'terminals', label: 'Terminals' },
];

/** The node kinds that run an agent (and therefore carry an `AgentSpec`). */
export const AGENT_NODE_TYPES: Array<WorkflowNodeType> = ['task', 'step', 'router'];

export function isAgentNode(type: WorkflowNodeType): boolean {
    return AGENT_NODE_TYPES.indexOf(type) !== -1;
}

/** True for the editor-only `tool` node kind. */
export function isToolNode(type: WorkflowNodeType): boolean {
    return type === 'tool';
}

/** True for the editor-only `memory` node kind. */
export function isMemoryNode(type: WorkflowNodeType): boolean {
    return type === 'memory';
}

/** True for the kinds that are drawn as a row inside another node's box. */
export function isNestedNode(type: WorkflowNodeType): boolean {
    return isToolNode(type) || isMemoryNode(type);
}

/**
 * True when a node of this kind may be given a memory store. Only the kinds
 * that run an agent have a turn to recall into and write back from.
 */
export function canHostMemory(type: WorkflowNodeType): boolean {
    return isAgentNode(type);
}

/**
 * True when a node of this kind may own tools — the kinds that run an agent,
 * and tools themselves, whose children are scoped so that only that tool can
 * call them.
 */
export function canHostTools(type: WorkflowNodeType): boolean {
    return isAgentNode(type) || isToolNode(type);
}

/** The kinds that may be placed free-standing on the canvas. */
export const TOP_LEVEL_NODE_TYPES: Array<WorkflowNodeType> =
    NODE_CATALOG_LIST.filter((entry) => !entry.nested).map((entry) => entry.type);

export function catalogFor(type: WorkflowNodeType): NodeCatalogEntry {
    return NODE_CATALOG[type] || NODE_CATALOG.task;
}
