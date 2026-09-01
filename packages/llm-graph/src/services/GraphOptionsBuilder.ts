/**
 * Builds the `GraphOptions` handed to the primitives graph (via the foundations
 * `BlueOrangeGraphWrapper`): node/edge defaults, zoom limits and the on-canvas
 * control toolbar (centre, add-node, auto-arrange, zoom). The control `action`
 * callbacks receive the live `BlueOrangeGraph` instance, matching the pattern in
 * `pipelines-client`'s `PipelineEditor`.
 *
 * The flow reads top-to-bottom by default, so links are drawn and created from
 * a node's bottom edge and the arrange controls hand back to the editor's own
 * block layout (which the graph's generic ELK arrange can't do, because it
 * knows nothing about tools nested inside a group).
 */
import {
    BlueOrangeBezierEdge,
    BlueOrangeSmoothStepEdge,
    BlueOrangeStraightEdge,
} from '@blue-orange-ai/primitives-graph';
import { NODE_HEIGHT, NODE_WIDTH } from './NodeHtml';
import { LayoutDirection } from './WorkflowLayout';

export interface GraphOptionsHandlers {
    /** Called when the toolbar "add node" button is pressed. */
    onAddNode?: () => void;
    /** Called when one of the auto-layout buttons is pressed. */
    onAutoLayout?: (direction: LayoutDirection) => void;
}

export class GraphOptionsBuilder {

    public static build(handlers: GraphOptionsHandlers = {}): any {
        return {
            polkaDots: true,
            allowUserDeletions: true,
            allowUserLinkCreation: true,
            allowUserNodeCreation: true,
            nodes: {
                allowAutomaticCreation: true,
                defaultBorder: '1px solid #e0e1e2',
                defaultBorderSelected: '2px solid dodgerblue',
                defaultBorderRadius: 10,
                defaultBackgroundColor: 'white',
                defaultWidth: NODE_WIDTH,
                defaultHeight: NODE_HEIGHT,
                defaultHtml: '<div class="bo-llm-graph-placeholder-node"></div>',
            },
            edges: {
                defaultLineWidth: 2,
                defaultArrowHeadScale: 1.1,
                types: {
                    bezier: BlueOrangeBezierEdge,
                    step: BlueOrangeSmoothStepEdge,
                    straight: BlueOrangeStraightEdge,
                },
                defaultType: 'bezier',
                // The flow runs downwards, so a dragged-out link starts at the
                // bottom of the node rather than its right-hand edge.
                creationAnchorPos: 'bottom',
            },
            zoom: { min: 0.25, max: 3, step: 0.1 },
            position: { scale: 1, top: 0, left: 0 },
            controls: {
                items: [
                    {
                        name: 'add-node',
                        location: 'tl',
                        icon: '<i class="ri-add-line"></i>',
                        tooltip: 'Add node',
                        marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0,
                        action: () => {
                            if (handlers.onAddNode) handlers.onAddNode();
                        },
                    },
                    {
                        name: 'arrange-down',
                        location: 'tl',
                        icon: '<i class="ri-node-tree"></i>',
                        tooltip: 'Auto-layout (top-down)',
                        marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0,
                        action: () => {
                            if (handlers.onAutoLayout) handlers.onAutoLayout('vertical');
                        },
                    },
                    {
                        name: 'arrange-right',
                        location: 'tl',
                        icon: '<i class="ri-arrow-right-double-line"></i>',
                        tooltip: 'Auto-layout (left-to-right)',
                        marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0,
                        action: () => {
                            if (handlers.onAutoLayout) handlers.onAutoLayout('horizontal');
                        },
                    },
                    {
                        name: 'centre',
                        location: 'bl',
                        icon: '<i class="ri-fullscreen-line"></i>',
                        tooltip: 'Fit view',
                        marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0,
                        action: (graph: any) => { graph.centre(); },
                    },
                    {
                        name: 'zoom-in',
                        location: 'bl',
                        icon: '<i class="ri-add-line"></i>',
                        tooltip: 'Zoom in',
                        marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0,
                        action: (graph: any) => {
                            graph.scale += graph.stepChange;
                            graph.setTransform();
                        },
                    },
                    {
                        name: 'zoom-out',
                        location: 'bl',
                        icon: '<i class="ri-subtract-line"></i>',
                        tooltip: 'Zoom out',
                        marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0,
                        action: (graph: any) => {
                            graph.scale -= graph.stepChange;
                            graph.setTransform();
                        },
                    },
                ],
            },
        };
    }
}
