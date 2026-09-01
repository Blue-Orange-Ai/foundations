/**
 * Automatic layout for the workflow canvas.
 *
 * Only top-level nodes are laid out. An agent's tools live *inside* its box
 * rather than beside it — as do the tools those tools scope to themselves, at
 * any depth — so a node with tools is simply a taller box, and nothing about
 * the arrangement has to account for them beyond that height.
 *
 * The default flow is **vertical**: layers advance down the canvas so a
 * workflow reads top-to-bottom, with independent nodes sharing a layer side by
 * side.
 */
import { WorkflowDefinition, WorkflowNode } from '../interfaces/WorkflowGraph';
import { isNestedNode } from '../interfaces/NodeCatalog';
import { BoxRow, NODE_WIDTH, NodeHtml } from './NodeHtml';

/** Which way the flow reads. Vertical (top-to-bottom) is the default. */
export type LayoutDirection = 'vertical' | 'horizontal';

export interface LayoutPosition {
    id: string;
    x: number;
    y: number;
}

export interface LayoutResult {
    positions: Array<LayoutPosition>;
}

/** Gap between one layer of boxes and the next. */
export const LAYER_GAP = 96;
/** Gap between sibling boxes within the same layer. */
export const SIBLING_GAP = 80;

interface Block {
    node: WorkflowNode;
    /** Height of the node's box, tools well included. */
    height: number;
    layer: number;
    /** Position on the layer's cross axis, used only to keep ordering stable. */
    sortKey: number;
}

export class WorkflowLayout {

    /** The tool nodes directly owned by `parentId`, in their authored order. */
    public static toolsOf(definition: WorkflowDefinition, parentId: string): Array<WorkflowNode> {
        return Object.keys(definition.nodes)
            .map((id) => definition.nodes[id])
            .filter((node) => node.type === 'tool' && node.parent === parentId);
    }

    /**
     * Every tool under `parentId`, flattened depth-first with the nesting depth
     * each one sits at. This is the row order a box renders, so a tool's own
     * scoped tools appear directly beneath it, indented.
     *
     * Each row also carries what the tree lines need: `guides[i]` says whether
     * the ancestor at level `i` has a later sibling (so its vertical line runs
     * on past this row), and `last` says whether this row closes its own level.
     *
     * A `parent` chain that loops back on itself would never terminate, so ids
     * already walked are skipped rather than followed twice.
     */
    public static toolTree(
        definition: WorkflowDefinition,
        parentId: string,
        depth: number = 0,
        seen: Set<string> = new Set<string>(),
        ancestorsContinue: Array<boolean> = [],
    ): Array<BoxRow> {
        const rows: Array<BoxRow> = [];
        // Resolved up front so `last` accounts for anything the cycle guard
        // drops, and so the tree lines end on the row that is really last.
        const children = WorkflowLayout.toolsOf(definition, parentId)
            .filter((tool) => !seen.has(tool.id));

        children.forEach((tool, index) => {
            seen.add(tool.id);
            const last = index === children.length - 1;
            rows.push({ node: tool, depth, guides: ancestorsContinue.slice(), last });
            WorkflowLayout.toolTree(
                definition, tool.id, depth + 1, seen, ancestorsContinue.concat([!last]))
                .forEach((row) => rows.push(row));
        });
        return rows;
    }

    /** The memory node attached to `parentId`, if it has one. */
    public static memoryOf(definition: WorkflowDefinition, parentId: string): WorkflowNode | undefined {
        return Object.keys(definition.nodes)
            .map((id) => definition.nodes[id])
            .filter((node) => node.type === 'memory' && node.parent === parentId)[0];
    }

    /**
     * Every row drawn inside `parentId`'s box: its memory store first, then its
     * tool tree. This is the order the box renders and the count it is sized by.
     */
    public static boxRows(definition: WorkflowDefinition, parentId: string): Array<BoxRow> {
        const memory = WorkflowLayout.memoryOf(definition, parentId);
        const rows: Array<BoxRow> = memory ? [{ node: memory, depth: 0, guides: [], last: true }] : [];
        return rows.concat(WorkflowLayout.toolTree(definition, parentId));
    }

    /** The ids of every nested node inside `parentId`'s box — memory and tools. */
    public static boxChildIds(definition: WorkflowDefinition, parentId: string): Array<string> {
        return WorkflowLayout.boxRows(definition, parentId).map((row) => row.node.id);
    }

    /** The ids of every tool under `parentId`, at any depth. */
    public static toolSubtreeIds(definition: WorkflowDefinition, parentId: string): Array<string> {
        return WorkflowLayout.toolTree(definition, parentId).map((row) => row.node.id);
    }

    /**
     * The top-level node whose box `nodeId` is drawn in — itself for a
     * top-level node, or the agent at the root of its tool chain.
     */
    public static boxIdOf(definition: WorkflowDefinition, nodeId?: string): string | undefined {
        const seen = new Set<string>();
        let current = nodeId ? definition.nodes[nodeId] : undefined;
        while (current && isNestedNode(current.type)) {
            if (seen.has(current.id)) return undefined;
            seen.add(current.id);
            current = current.parent ? definition.nodes[current.parent] : undefined;
        }
        return current ? current.id : undefined;
    }

    /** The height of a node's box, given every row it holds. */
    public static boxHeight(definition: WorkflowDefinition, node: WorkflowNode): number {
        return NodeHtml.height(node, WorkflowLayout.boxRows(definition, node.id).length);
    }

    /** True when a top-level node has no authored position yet. */
    public static needsLayout(definition: WorkflowDefinition): boolean {
        return Object.keys(definition.nodes).some((id) => {
            const node = definition.nodes[id];
            if (isNestedNode(node.type)) return false;
            const ui = (node.metadata && node.metadata.ui) || {};
            return typeof ui.x !== 'number' || typeof ui.y !== 'number';
        });
    }

    /** Lay every top-level node out in layered order. */
    public static compute(
        definition: WorkflowDefinition,
        direction: LayoutDirection = 'vertical',
        originX: number = 80,
        originY: number = 80,
    ): LayoutResult {
        const blocks = WorkflowLayout.blocks(definition, direction);
        if (blocks.length === 0) return { positions: [] };

        const byLayer: Record<number, Array<Block>> = {};
        blocks.forEach((block) => {
            if (!byLayer[block.layer]) byLayer[block.layer] = [];
            byLayer[block.layer].push(block);
        });

        const layers = Object.keys(byLayer)
            .map((key) => Number(key))
            .sort((a, b) => a - b);

        const positions: Array<LayoutPosition> = [];
        let cursor = direction === 'vertical' ? originY : originX;

        layers.forEach((layer) => {
            const members = byLayer[layer].slice().sort((a, b) => a.sortKey - b.sortKey);

            if (direction === 'vertical') {
                // Layers advance down; siblings sit side by side.
                let x = originX;
                members.forEach((block) => {
                    positions.push({ id: block.node.id, x, y: cursor });
                    x += NODE_WIDTH + SIBLING_GAP;
                });
                cursor += Math.max(...members.map((block) => block.height)) + LAYER_GAP;
            } else {
                // Layers advance right; siblings stack down.
                let y = originY;
                members.forEach((block) => {
                    positions.push({ id: block.node.id, x: cursor, y });
                    y += block.height + SIBLING_GAP;
                });
                cursor += NODE_WIDTH + LAYER_GAP;
            }
        });

        return { positions };
    }

    /** Write the computed positions back into each node's ui metadata. */
    public static applyPositions(
        definition: WorkflowDefinition,
        positions: Array<LayoutPosition>,
    ): WorkflowDefinition {
        if (positions.length === 0) return definition;
        const nodes = { ...definition.nodes };
        positions.forEach((position) => {
            const node = nodes[position.id];
            if (!node) return;
            nodes[position.id] = {
                ...node,
                metadata: {
                    ...(node.metadata || {}),
                    ui: { ...((node.metadata && node.metadata.ui) || {}), x: position.x, y: position.y },
                },
            };
        });
        return { ...definition, nodes };
    }

    // -- internals ---------------------------------------------------------

    /** Build one block per top-level node and assign each a layer. */
    private static blocks(definition: WorkflowDefinition, direction: LayoutDirection): Array<Block> {
        const topLevel = Object.keys(definition.nodes)
            .filter((id) => !isNestedNode(definition.nodes[id].type));

        const layer = WorkflowLayout.layerOf(definition, topLevel);

        return topLevel.map((id) => {
            const node = definition.nodes[id];
            const ui = (node.metadata && node.metadata.ui) || {};
            const previous = direction === 'vertical' ? ui.x : ui.y;
            return {
                node,
                height: WorkflowLayout.boxHeight(definition, node),
                layer: layer[id] || 0,
                // Keep the existing left-to-right (or top-to-bottom) order so a
                // re-layout doesn't shuffle nodes the author has arranged.
                sortKey: typeof previous === 'number' ? previous : 0,
            };
        });
    }

    /**
     * Longest-path layering over the definition's logical edges. Relaxation is
     * capped at one pass per node so a cyclic definition still terminates.
     */
    private static layerOf(
        definition: WorkflowDefinition,
        topLevel: Array<string>,
    ): Record<string, number> {
        const layer: Record<string, number> = {};
        topLevel.forEach((id) => { layer[id] = 0; });

        const edges = WorkflowLayout.flowEdges(definition, topLevel);
        for (let pass = 0; pass < topLevel.length; pass += 1) {
            let changed = false;
            edges.forEach((edge) => {
                const candidate = layer[edge.source] + 1;
                if (candidate > layer[edge.target]) {
                    layer[edge.target] = candidate;
                    changed = true;
                }
            });
            if (!changed) break;
        }
        return layer;
    }

    /** Source → target pairs between top-level nodes, from the flow fields. */
    private static flowEdges(
        definition: WorkflowDefinition,
        topLevel: Array<string>,
    ): Array<{ source: string; target: string }> {
        const known = new Set(topLevel);
        const edges: Array<{ source: string; target: string }> = [];
        const link = (source?: string, target?: string) => {
            if (source && target && known.has(source) && known.has(target) && source !== target) {
                edges.push({ source, target });
            }
        };
        topLevel.forEach((id) => {
            const node = definition.nodes[id];
            (node.depends_on || []).forEach((dep) => link(dep, id));
            link(id, node.next);
            link(id, node.then);
            link(id, node.otherwise);
            link(id, node.body);
            link(id, node.default);
            (node.routes || []).forEach((route) => link(id, route.target));
        });
        return edges;
    }
}
