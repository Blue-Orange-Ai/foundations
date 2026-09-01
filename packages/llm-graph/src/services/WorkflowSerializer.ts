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
 *
 * Tools are the one place where the editor model and the agent model differ.
 * The editor holds a tool as its own node, pointing at its owner through
 * `parent`; the definition the agent runs holds it as an entry in that owner's
 * `tools` (inline declarations) or `tool_ids` (registry references). `expand`
 * and `collapse` translate between the two, and `serialize` collapses before
 * handing the definition off.
 *
 * A tool node is never a *canvas* node: it is drawn as a row inside its owner's
 * box, which is what keeps a group indivisible. Only top-level nodes are
 * projected onto the graph, and `reconcile` carries the tools across untouched.
 */
import {
    WorkflowDefinition,
    WorkflowNode,
    WorkflowTool,
    WorkflowValidationIssue,
} from '../interfaces/WorkflowGraph';
import { canHostMemory, canHostTools, isNestedNode } from '../interfaces/NodeCatalog';
import { NodeHtml } from './NodeHtml';
import { NodeFactory } from './NodeFactory';
import { WorkflowLayout } from './WorkflowLayout';

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

    /** The ids of every node that is placed free-standing on the canvas. */
    public static topLevelIds(definition: WorkflowDefinition): Array<string> {
        return Object.keys(definition.nodes).filter((id) => !isNestedNode(definition.nodes[id].type));
    }

    /** The memory node attached to `parentId`, if it has one. */
    public static memoryOf(definition: WorkflowDefinition, parentId: string): WorkflowNode | undefined {
        return WorkflowLayout.memoryOf(definition, parentId);
    }

    /** The tool nodes owned by `parentId`, in their authored order. */
    public static toolsOf(definition: WorkflowDefinition, parentId: string): Array<WorkflowNode> {
        return WorkflowLayout.toolsOf(definition, parentId);
    }

    /**
     * Build the primitives graph nodes for the canvas. Only top-level nodes
     * become graph nodes — an agent's memory store, its tools, and any tools
     * scoped to those, are rows inside its box.
     */
    public static toGraphNodes(definition: WorkflowDefinition): Array<any> {
        return WorkflowSerializer.topLevelIds(definition).map((id, index) => {
            const node = definition.nodes[id];
            const ui = (node.metadata && node.metadata.ui) || {};
            const rows = WorkflowLayout.boxRows(definition, id);
            const width = NodeHtml.width(node);
            const height = NodeHtml.height(node, rows.length);
            const x = typeof ui.x === 'number' ? ui.x : 80 + (index % 4) * (width + 80);
            const y = typeof ui.y === 'number' ? ui.y : 80 + Math.floor(index / 4) * (height + 80);
            return {
                id,
                x,
                y,
                width,
                height,
                border: '1px solid #e0e1e2',
                borderSelected: '2px solid dodgerblue',
                borderRadius: 10,
                backgroundColour: 'white',
                html: NodeHtml.build(node, { rows }),
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
     *
     * Tools are not on the canvas at all, so they are carried across from the
     * previous definition — except those whose owner has been deleted, which go
     * with it.
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

        // Memory and tools live inside a box rather than on the canvas, so they
        // survive reconciliation as long as the owner whose box they sit in does.
        Object.keys(definition.nodes).forEach((id) => {
            const node = definition.nodes[id];
            if (!isNestedNode(node.type)) return;
            if (node.parent && nextNodes[node.parent]) nextNodes[id] = node;
        });

        return { ...definition, nodes: nextNodes };
    }

    /**
     * Turn an agent-shaped definition into the editor's shape: an agent's
     * `memory` becomes a memory node, every entry in its `tools` / `tool_ids`
     * becomes a tool node, and so does every tool a tool scopes to itself, all
     * the way down. Safe to call on a definition that already holds them.
     */
    public static expand(definition: WorkflowDefinition): WorkflowDefinition {
        const nodes: Record<string, WorkflowNode> = {};
        Object.keys(definition.nodes).forEach((id) => { nodes[id] = { ...definition.nodes[id] }; });

        const expanded: WorkflowDefinition = { ...definition, nodes };
        Object.keys(definition.nodes).forEach((id) => {
            const node = nodes[id];
            if (isNestedNode(node.type)) return;

            if (canHostMemory(node.type) && node.memory) {
                const memoryNode = NodeFactory.createMemory(id, expanded);
                memoryNode.memory = JSON.parse(JSON.stringify(node.memory));
                nodes[memoryNode.id] = memoryNode;
                // The memory node is the source of truth from here on.
                node.memory = undefined;
            }

            if (!canHostTools(node.type)) return;
            WorkflowSerializer.expandInto(expanded, id, node.tools || [], node.tool_ids || []);
            // The tool nodes are the source of truth from here on.
            node.tools = [];
            node.tool_ids = [];
        });
        return expanded;
    }

    /** Create the tool nodes for one owner, then recurse into each of them. */
    private static expandInto(
        expanded: WorkflowDefinition,
        parentId: string,
        inline: Array<WorkflowTool>,
        references: Array<string>,
    ): void {
        inline.forEach((tool) => {
            const toolNode = NodeFactory.createTool(parentId, expanded, tool.name);
            toolNode.description = tool.description || '';
            toolNode.parameters = tool.parameters ? tool.parameters.slice() : [];
            if (toolNode.metadata && toolNode.metadata.ui) toolNode.metadata.ui.label = tool.name;
            expanded.nodes[toolNode.id] = toolNode;
            // Tools this tool scopes to itself become rows nested under it.
            WorkflowSerializer.expandInto(
                expanded, toolNode.id, tool.tools || [], tool.tool_ids || []);
        });
        references.forEach((reference) => {
            const toolNode = NodeFactory.createTool(parentId, expanded, reference);
            toolNode.tool_ref = reference;
            if (toolNode.metadata && toolNode.metadata.ui) toolNode.metadata.ui.label = reference;
            expanded.nodes[toolNode.id] = toolNode;
        });
    }

    /**
     * The inverse of {@link expand}: fold each memory node back into its
     * owner's `memory`, and every tool node back into its owner's `tools` /
     * `tool_ids` — nested tools included, as the `tools` of the tool that
     * scopes them — then drop them from `nodes`, leaving a definition the
     * agent's workflow engine understands.
     *
     * An agent with no tool nodes keeps whatever it already declares, so
     * collapsing a definition that is already in the agent's shape leaves it
     * untouched rather than emptying its tool lists.
     */
    public static collapse(definition: WorkflowDefinition): WorkflowDefinition {
        const nodes: Record<string, WorkflowNode> = {};
        WorkflowSerializer.topLevelIds(definition).forEach((id) => {
            nodes[id] = { ...definition.nodes[id] };
        });

        Object.keys(nodes).forEach((id) => {
            const node = nodes[id];

            // A node with no memory node keeps whatever it already declares, so
            // collapsing an already-collapsed definition leaves it untouched.
            const memory = WorkflowLayout.memoryOf(definition, id);
            if (memory && memory.memory) node.memory = memory.memory;

            if (!canHostTools(node.type)) return;
            if (WorkflowSerializer.toolsOf(definition, id).length === 0) return;
            const folded = WorkflowSerializer.foldTools(definition, id);
            node.tools = folded.tools;
            node.tool_ids = folded.tool_ids;
        });

        return { ...definition, nodes };
    }

    /** Fold one owner's tool nodes into declarations, recursing into each. */
    private static foldTools(
        definition: WorkflowDefinition,
        parentId: string,
        seen: Set<string> = new Set<string>(),
    ): { tools: Array<WorkflowTool>; tool_ids: Array<string> } {
        const tools: Array<WorkflowTool> = [];
        const toolIds: Array<string> = [];

        WorkflowSerializer.toolsOf(definition, parentId).forEach((tool) => {
            // A `parent` chain that loops would recurse forever.
            if (seen.has(tool.id)) return;
            seen.add(tool.id);

            if (tool.tool_ref) {
                toolIds.push(tool.tool_ref);
                return;
            }
            const declaration: WorkflowTool = {
                name: tool.name || tool.id,
                description: tool.description || undefined,
                parameters: (tool.parameters || []).slice(),
            };
            const scoped = WorkflowSerializer.foldTools(definition, tool.id, seen);
            if (scoped.tools.length > 0) declaration.tools = scoped.tools;
            if (scoped.tool_ids.length > 0) declaration.tool_ids = scoped.tool_ids;
            tools.push(declaration);
        });

        return { tools, tool_ids: toolIds };
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
            if (node.type === 'memory') {
                const parent = node.parent ? definition.nodes[node.parent] : undefined;
                if (!parent) {
                    issues.push({ nodeId: id, message: `Memory '${id}' is not attached to a node.`, severity: 'error' });
                } else if (!canHostMemory(parent.type)) {
                    issues.push({ nodeId: id, message: `Memory '${id}' may only sit under an agent node.`, severity: 'error' });
                }
                WorkflowSerializer.memoryIssues(id, node).forEach((issue) => issues.push(issue));
            }
            if (node.type === 'tool') {
                const parent = node.parent ? definition.nodes[node.parent] : undefined;
                if (!parent) {
                    issues.push({ nodeId: id, message: `Tool '${id}' is not attached to an agent.`, severity: 'error' });
                } else if (!canHostTools(parent.type)) {
                    issues.push({ nodeId: id, message: `Tool '${id}' may only sit under an agent node or another tool.`, severity: 'error' });
                }
                if (!node.tool_ref && !(node.name || '').trim()) {
                    issues.push({ nodeId: id, message: `Tool '${id}' has no name.`, severity: 'error' });
                }
                // A registry reference is declared elsewhere, so anything scoped
                // under it here has nowhere to serialise to.
                if (node.tool_ref && WorkflowSerializer.toolsOf(definition, id).length > 0) {
                    issues.push({
                        nodeId: id,
                        message: `Tool '${id}' references the registry tool '${node.tool_ref}', so it cannot scope tools of its own.`,
                        severity: 'error',
                    });
                }
            }
        });

        WorkflowSerializer.topLevelIds(definition).forEach((parentId) => {
            const stores = Object.keys(definition.nodes)
                .filter((id) => definition.nodes[id].type === 'memory'
                    && definition.nodes[id].parent === parentId);
            if (stores.length > 1) {
                issues.push({
                    nodeId: parentId,
                    message: `'${parentId}' has ${stores.length} memory stores; an agent may only have one.`,
                    severity: 'error',
                });
            }
        });

        WorkflowSerializer.duplicateToolNames(definition).forEach((duplicate) => {
            issues.push({
                nodeId: duplicate.parentId,
                message: `'${duplicate.parentId}' has more than one tool named '${duplicate.name}'.`,
                severity: 'error',
            });
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

    /** Whether a memory node names a store the agent can actually reach. */
    private static memoryIssues(id: string, node: WorkflowNode): Array<WorkflowValidationIssue> {
        const issues: Array<WorkflowValidationIssue> = [];
        const memory = node.memory;
        if (!memory) {
            issues.push({ nodeId: id, message: `Memory '${id}' has no store configured.`, severity: 'error' });
            return issues;
        }
        if (memory.provider !== 'postgres') return issues;

        const connection = memory.postgres || {};
        const uri = (connection.uri || '').trim();
        if (!uri && !(connection.host || '').trim()) {
            issues.push({
                nodeId: id,
                message: `Memory '${id}' needs a connection URI, or a host to build one from.`,
                severity: 'error',
            });
        }
        if (!uri && !(connection.database || '').trim()) {
            issues.push({ nodeId: id, message: `Memory '${id}' has no database set.`, severity: 'error' });
        }
        if (!(connection.table || '').trim()) {
            issues.push({ nodeId: id, message: `Memory '${id}' has no table set.`, severity: 'warning' });
        }
        // A definition is stored and exported as plain JSON, so an inline
        // password would travel with it.
        if (/^[a-z+]+:\/\/[^/@]*:[^/@]+@/i.test(uri)) {
            issues.push({
                nodeId: id,
                message: `Memory '${id}' has a password inside its connection URI. Name a secret instead — the definition is saved as plain text.`,
                severity: 'warning',
            });
        }
        return issues;
    }

    /** Tool names claimed twice on the same agent (the model can't tell them apart). */
    private static duplicateToolNames(
        definition: WorkflowDefinition,
    ): Array<{ parentId: string; name: string }> {
        const duplicates: Array<{ parentId: string; name: string }> = [];
        // Every owner is checked, so two tools scoped to the same tool clash
        // just as two tools on the same agent do.
        Object.keys(definition.nodes).forEach((parentId) => {
            const seen = new Set<string>();
            WorkflowSerializer.toolsOf(definition, parentId).forEach((tool) => {
                const name = tool.tool_ref || tool.name || '';
                if (!name) return;
                if (seen.has(name)) duplicates.push({ parentId, name });
                seen.add(name);
            });
        });
        return duplicates;
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
        return JSON.parse(JSON.stringify(WorkflowSerializer.collapse(definition)));
    }

    /** Pretty-printed JSON of the definition. */
    public static toJson(definition: WorkflowDefinition): string {
        return JSON.stringify(WorkflowSerializer.serialize(definition), null, 2);
    }
}
