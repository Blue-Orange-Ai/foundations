/**
 * Edge-painting helpers that sit between the editor and the primitives graph.
 *
 * The flow direction decides where a link leaves and enters a box (bottom → top
 * for the default vertical flow), so links are drawn here rather than through
 * `createEdgeSimple`, which always wires right → left. Because an agent's tools
 * live inside its box, the box is the only thing a link ever attaches to.
 */
import { BlueOrangeGraph } from '@blue-orange-ai/primitives-graph';
import { LayoutDirection } from './WorkflowLayout';

/** Colour of a flow link between two boxes. */
const FLOW_COLOUR = '#b9c0d4';

export class GraphPainter {

    /** Where a link leaves the source box for the given flow direction. */
    public static sourceAnchor(direction: LayoutDirection): string {
        return direction === 'vertical' ? 'bottom' : 'right';
    }

    /** Where a link enters the target box for the given flow direction. */
    public static targetAnchor(direction: LayoutDirection): string {
        return direction === 'vertical' ? 'top' : 'left';
    }

    /** Draw one flow link between two boxes, anchored for `direction`. */
    public static drawFlowEdge(
        graph: BlueOrangeGraph,
        sourceId: string,
        targetId: string,
        direction: LayoutDirection,
        label?: string,
    ): void {
        const anyGraph = graph as any;
        try {
            const source = anyGraph.getNodeById(sourceId);
            const target = anyGraph.getNodeById(targetId);
            if (!source || !target) return;
            const edgeId = GraphPainter.edgeId(sourceId, targetId);
            // Ids are derived from the endpoints, so redrawing a link that is
            // already on the canvas is a no-op rather than a duplicate.
            if (anyGraph.findEdge(edgeId)) return;
            anyGraph.createEdgeBetweenNodes(
                edgeId,
                source, GraphPainter.sourceAnchor(direction), false,
                target, GraphPainter.targetAnchor(direction), true,
                !!label, label || '', '', '',
                'bezier', '', FLOW_COLOUR,
                2, 1.1, false, true, true);
        } catch (error) {
            // A missing endpoint just means no link is drawn.
        }
    }

    /** Stable, collision-free id so a redraw replaces rather than duplicates. */
    private static edgeId(sourceId: string, targetId: string): string {
        return `bo-edge-${sourceId}--${targetId}`;
    }
}
