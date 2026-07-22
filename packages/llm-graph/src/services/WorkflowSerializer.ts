/**
 * The glue between the visual canvas and the agent's workflow definition.
 *
 * `toGraphNodes` / `logicalEdges` project a {@link WorkflowDefinition} onto the
 * primitives graph (node cards + directed links). `reconcile` does the inverse:
 * it treats the canvas as the source of truth for *topology* (which nodes exist,
 * how they are wired) and rebuilds each node's `depends_on` / `next` from the
 * live edges while preserving each node's authored *config*. `validate` runs the
 * same integrity checks the agent enforces (acyclicity, resolvable
 * dependencies) so a graph is caught before it is saved or run.
 */
import {
    WorkflowDefinition,
    WorkflowNode,
    WorkflowValidationIssue,
} from '../interfaces/WorkflowGraph';
import { NodeHtml, NODE_HEIGHT, NODE_WIDTH } from './NodeHtml';
import { NodeFactory } from './NodeFactory';

/** A directed link derived from the definition's relational fields. */
export interface LogicalEdge {
    source: string;
    target: string;
    kind: 'depends_on' | 'next' | 'then' | 'else' | 'route' | 'body' | 'loop_next';
    label?: string;
}

/** Minimal shape of a primitives graph node we read positions from. */
interface GraphNodeLike {
    id: string;
    x: number;
    y: number;
}

/** Minimal shape of a primitives graph edge we read endpoints from. */
interface GraphEdgeLike {
    sourceId: string;
    targetId: string;
}

export class WorkflowSerializer {

    /** True when the definition is a dependency-scheduled DAG (has tasks). */
    public static isDag(definition: WorkflowDefinition): boolean {
        return Object.keys(definition.nodes).some(
            (id) => definition.nodes[id].type === 'task');
    }

    /** Build primitives graph nodes (with card HTML + layout) for the canvas. */
    public static toGraphNodes(definition: WorkflowDefinition): Array<any> {
        const ids = Object.keys(definition.nodes);
        return ids.map((id, index) => {
            const node = definition.nodes[id];
            const ui = (node.metadata && node.metadata.ui) || {};
            const x = typeof ui.x === 'number' ? ui.x : 80 + (index % 4) * (NODE_WIDTH + 80);
            const y = typeof ui.y === 'number' ? ui.y : 80 + Math.floor(index / 4) * (NODE_HEIGHT + 80);
            return {
                id,
                x,
                y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                border: '1px solid #e0e1e2',
                borderSelected: '2px solid dodgerblue',
                borderRadius: 10,
                backgroundColour: 'white',
                html: NodeHtml.build(node),
                movable: true,
                deletable: true,
            };
        });
    }

    /** Directed links implied by every node's relational fields. */
    public static logicalEdges(definition: WorkflowDefinition): Array<LogicalEdge> {
        const edges: Array<LogicalEdge> = [];
        const has = (id?: string): id is string => !!id && !!definition.nodes[id];
        Object.keys(definition.nodes).forEach((id) => {
            const node = definition.nodes[id];
            switch (node.type) {
                case 'task':
                    (node.depends_on || []).forEach((dep) => {
                        if (has(dep)) edges.push({ source: dep, target: id, kind: 'depends_on' });
                    });
                    break;
                case 'step':
                    if (has(node.next)) edges.push({ source: id, target: node.next!, kind: 'next' });
                    break;
                case 'gate':
                    if (has(node.then)) edges.push({ source: id, target: node.then!, kind: 'then', label: 'then' });
                    if (has(node.otherwise)) edges.push({ source: id, target: node.otherwise!, kind: 'else', label: 'else' });
                    break;
                case 'router':
                    (node.routes || []).forEach((route) => {
                        if (has(route.target)) {
                            edges.push({ source: id, target: route.target, kind: 'route', label: route.name || route.target });
                        }
                    });
                    break;
                case 'loop':
                    if (has(node.body)) edges.push({ source: id, target: node.body!, kind: 'body', label: 'body' });
                    if (has(node.next)) edges.push({ source: id, target: node.next!, kind: 'loop_next' });
                    break;
                default:
                    break;
            }
        });
        return edges;
    }

    /**
     * Rebuild the definition from the live canvas. Node existence and wiring
     * come from `graphNodes`/`graphEdges`; each surviving node keeps its authored
     * config, gets its position synced, and has its canvas-editable relations
     * (`depends_on` for tasks, `next` for steps) rebuilt from the edges.
     */
    public static reconcile(
        definition: WorkflowDefinition,
        graphNodes: Array<GraphNodeLike>,
        graphEdges: Array<GraphEdgeLike>,
    ): WorkflowDefinition {
        const nextNodes: Record<string, WorkflowNode> = {};
        graphNodes.forEach((gn) => {
            // A canvas node with no config was drag-created on the canvas — adopt
            // it as a fresh task so the topology stays consistent.
            const existing = definition.nodes[gn.id]
                || NodeFactory.create('task', definition, gn.x, gn.y, gn.id);
            const node: WorkflowNode = { ...existing };
            node.metadata = {
                ...(node.metadata || {}),
                ui: { ...((node.metadata && node.metadata.ui) || {}), x: gn.x, y: gn.y },
            };
            if (node.type === 'task') node.depends_on = [];
            if (node.type === 'step') node.next = undefined;
            nextNodes[gn.id] = node;
        });

        graphEdges.forEach((edge) => {
            const source = nextNodes[edge.sourceId];
            const target = nextNodes[edge.targetId];
            if (!source || !target) return;
            if (target.type === 'task') {
                target.depends_on = [...(target.depends_on || []), edge.sourceId];
            } else if (source.type === 'step') {
                source.next = edge.targetId;
            }
        });

        return { ...definition, nodes: nextNodes };
    }

    /** Client-side integrity checks mirroring the agent's validation. */
    public static validate(definition: WorkflowDefinition): Array<WorkflowValidationIssue> {
        const issues: Array<WorkflowValidationIssue> = [];
        const ids = Object.keys(definition.nodes);

        if (!definition.name || !definition.name.trim()) {
            issues.push({ message: 'Workflow needs a name.', severity: 'error' });
        }
        if (ids.length === 0) {
            issues.push({ message: 'Workflow has no nodes.', severity: 'error' });
            return issues;
        }

        const dag = WorkflowSerializer.isDag(definition);
        ids.forEach((id) => {
            const node = definition.nodes[id];
            if (node.type === 'task') {
                (node.depends_on || []).forEach((dep) => {
                    if (!definition.nodes[dep]) {
                        issues.push({ nodeId: id, message: `Task '${id}' depends on unknown node '${dep}'.`, severity: 'error' });
                    } else if (definition.nodes[dep].type !== 'task') {
                        issues.push({ nodeId: id, message: `Task '${id}' may only depend on other tasks.`, severity: 'error' });
                    }
                });
                if ((node.type === 'task' || node.type === 'step') && !node.model) {
                    issues.push({ nodeId: id, message: `'${id}' has no model selected.`, severity: 'warning' });
                }
            }
            if (node.type === 'gate' && !node.condition) {
                issues.push({ nodeId: id, message: `Gate '${id}' has no condition.`, severity: 'error' });
            }
            if (node.type === 'router' && (!node.routes || node.routes.length === 0)) {
                issues.push({ nodeId: id, message: `Router '${id}' has no routes.`, severity: 'error' });
            }
        });

        if (!dag && !definition.start) {
            issues.push({ message: 'A conversational flow needs a start node.', severity: 'error' });
        }
        if (definition.start && !definition.nodes[definition.start]) {
            issues.push({ message: `Start node '${definition.start}' is not defined.`, severity: 'error' });
        }

        if (dag) {
            const cycle = WorkflowSerializer.findCycle(definition);
            if (cycle.length > 0) {
                issues.push({ message: `Dependency cycle: ${cycle.join(' → ')}.`, severity: 'error' });
            }
        }
        return issues;
    }

    /** Task ids in dependency order, or `null` if the DAG has a cycle. */
    public static topologicalOrder(definition: WorkflowDefinition): Array<string> | null {
        const { order, tasks } = WorkflowSerializer.partialOrder(definition);
        return order.length === tasks.length ? order : null;
    }

    /** Kahn's algorithm; returns the (possibly partial, on a cycle) order. */
    private static partialOrder(definition: WorkflowDefinition): { order: Array<string>; tasks: Array<string> } {
        const tasks = Object.keys(definition.nodes).filter((id) => definition.nodes[id].type === 'task');
        const taskSet = new Set(tasks);
        const indegree: Record<string, number> = {};
        const dependents: Record<string, Array<string>> = {};
        tasks.forEach((id) => { indegree[id] = 0; dependents[id] = []; });
        tasks.forEach((id) => {
            (definition.nodes[id].depends_on || []).forEach((dep) => {
                if (taskSet.has(dep)) {
                    indegree[id] += 1;
                    dependents[dep].push(id);
                }
            });
        });
        const ready = tasks.filter((id) => indegree[id] === 0).sort();
        const order: Array<string> = [];
        while (ready.length > 0) {
            const current = ready.shift() as string;
            order.push(current);
            dependents[current].forEach((child) => {
                indegree[child] -= 1;
                if (indegree[child] === 0) ready.push(child);
            });
            ready.sort();
        }
        return { order, tasks };
    }

    private static findCycle(definition: WorkflowDefinition): Array<string> {
        const { order, tasks } = WorkflowSerializer.partialOrder(definition);
        if (order.length === tasks.length) return [];
        // The tasks left unresolved by Kahn's algorithm are the cyclic ones.
        const resolved = new Set(order);
        return tasks.filter((id) => !resolved.has(id));
    }

    /** The definition ready to POST to the agent (`/workflows`). */
    public static serialize(definition: WorkflowDefinition): WorkflowDefinition {
        return JSON.parse(JSON.stringify(definition));
    }

    /** Pretty-printed JSON of the definition. */
    public static toJson(definition: WorkflowDefinition): string {
        return JSON.stringify(WorkflowSerializer.serialize(definition), null, 2);
    }
}
