/**
 * Creates fresh workflow nodes with sensible defaults, and a unique id derived
 * from the node kind (`task_1`, `gate_2`, …) so authored graphs read well and
 * serialise to stable ids.
 */
import { catalogFor } from '../interfaces/NodeCatalog';
import { WorkflowDefinition, WorkflowNode, WorkflowNodeType } from '../interfaces/WorkflowGraph';

export class NodeFactory {

    /** A unique, human-readable id for a new node of `type` in `definition`. */
    public static uniqueId(type: WorkflowNodeType, definition: WorkflowDefinition): string {
        let index = 1;
        let candidate = `${type}_${index}`;
        while (definition.nodes[candidate]) {
            index += 1;
            candidate = `${type}_${index}`;
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
