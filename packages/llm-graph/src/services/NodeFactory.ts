/**
 * Creates fresh workflow nodes with sensible defaults, and a unique id derived
 * from the node kind (`task_1`, `gate_2`, …) so authored graphs read well and
 * serialise to stable ids. Tool nodes are namespaced under the agent that owns
 * them (`task_1__tool_2`) so a tool is identifiable from its id alone.
 */
import { catalogFor } from '../interfaces/NodeCatalog';
import { WorkflowDefinition, WorkflowNode, WorkflowNodeType } from '../interfaces/WorkflowGraph';

export class NodeFactory {

    /** A unique, human-readable id for a new node of `type` in `definition`. */
    public static uniqueId(type: WorkflowNodeType, definition: WorkflowDefinition): string {
        return NodeFactory.uniqueIdWithPrefix(type, definition);
    }

    /** A unique id of the form `<prefix>_<n>`, skipping ids already in use. */
    public static uniqueIdWithPrefix(prefix: string, definition: WorkflowDefinition): string {
        let index = 1;
        let candidate = `${prefix}_${index}`;
        while (definition.nodes[candidate]) {
            index += 1;
            candidate = `${prefix}_${index}`;
        }
        return candidate;
    }

    /** Build a new node of `type` at position `(x, y)`. */
    public static create(
        type: WorkflowNodeType,
        definition: WorkflowDefinition,
        x: number,
        y: number,
        id?: string,
    ): WorkflowNode {
        const catalog = catalogFor(type);
        const nodeId = id || NodeFactory.uniqueId(type, definition);
        const node: WorkflowNode = {
            id: nodeId,
            type,
            ...catalog.defaults,
            metadata: {
                ui: {
                    x,
                    y,
                    label: catalog.label,
                    icon: catalog.icon,
                    color: catalog.color,
                },
            },
        };
        return node;
    }

    /**
     * Build a tool node owned by `parentId`. A tool is drawn as a row inside its
     * owner's box rather than as a node on the canvas, so it carries no
     * position of its own.
     */
    public static createTool(
        parentId: string,
        definition: WorkflowDefinition,
        name?: string,
        id?: string,
    ): WorkflowNode {
        const catalog = catalogFor('tool');
        const nodeId = id || NodeFactory.uniqueIdWithPrefix(`${parentId}__tool`, definition);
        const toolName = name || NodeFactory.uniqueToolName(parentId, definition);
        return {
            id: nodeId,
            type: 'tool',
            parent: parentId,
            name: toolName,
            description: '',
            parameters: [],
            metadata: {
                ui: {
                    label: toolName,
                    icon: catalog.icon,
                    color: catalog.color,
                },
            },
        };
    }

    /** Build the memory node attached to `parentId`. An agent has at most one. */
    public static createMemory(parentId: string, definition: WorkflowDefinition, id?: string): WorkflowNode {
        const catalog = catalogFor('memory');
        const nodeId = id || NodeFactory.uniqueIdWithPrefix(`${parentId}__memory`, definition);
        return {
            id: nodeId,
            type: 'memory',
            parent: parentId,
            memory: {
                provider: 'postgres',
                namespace: parentId,
                recall_limit: 20,
                write: true,
                postgres: {},
            },
            metadata: {
                ui: {
                    label: catalog.label,
                    icon: catalog.icon,
                    color: catalog.color,
                },
            },
        };
    }

    /** A tool name not already used by another tool on the same agent. */
    public static uniqueToolName(parentId: string, definition: WorkflowDefinition): string {
        const taken = new Set(
            Object.keys(definition.nodes)
                .map((id) => definition.nodes[id])
                .filter((node) => node.type === 'tool' && node.parent === parentId)
                .map((node) => node.name));
        let index = 1;
        while (taken.has(`tool_${index}`)) index += 1;
        return `tool_${index}`;
    }

    /** An empty DAG definition ready for authoring. */
    public static emptyDefinition(name: string = 'Untitled Workflow'): WorkflowDefinition {
        return {
            name,
            description: '',
            groups: ['llm-chat-user'],
            nodes: {},
        };
    }
}
