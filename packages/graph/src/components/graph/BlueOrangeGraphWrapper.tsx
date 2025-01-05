import React, {ReactNode, useEffect, useRef} from "react";

import './BlueOrangeGraphWrapper.css'

import { BlueOrangeGraph } from '@blue-orange-ai/primitives-graph'

import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'

import { Edge as GraphEdge, Node as GraphNode, GraphOptions } from "@blue-orange-ai/primitives-graph";

export interface GraphRelativePos {
	x: number,
	y: number
}

interface Props {
	nodes?: Array<GraphNode>,
	edges?: Array<GraphEdge>,
	options?: GraphOptions,
	instance?: (graph: BlueOrangeGraph) => void,
	onNodeCreationClick?: (relativePos: GraphRelativePos, scale: number) => void,
	edgeClicked?: (edge: GraphEdge, clickEvent: any) => void,
	nodeClicked?: (node: GraphNode, clickEvent: any) => void,
	edgeDblClick?: (edge: GraphEdge, clickEvent: any) => void,
	nodeDblClick?: (node: GraphNode, clickEvent: any) => void,
	edgeRightClick?: (edge: GraphEdge, clickEvent: any) => void,
	nodeRightClick?: (node: GraphNode, clickEvent: any) => void,
	edgeCreated?: (edge: GraphEdge, startingNode: GraphNode, destinationNode: GraphNode) => void,
	nodeCreated?: (x: number, y: number, startingNode: GraphNode, createdNode: GraphNode, createdEdge: Array<GraphEdge>) => void,
	onSelection?: (nodes: Array<GraphNode>, edges: Array<GraphEdge>) => void,
	onChange?: (nodes: Array<GraphNode>, edges: Array<GraphEdge>) => void

}
export const BlueOrangeGraphWrapper: React.FC<Props> = ({
															nodes=[],
															edges=[],
															options,
															instance,
															onNodeCreationClick,
															edgeClicked,
															nodeClicked,
															edgeDblClick,
															nodeDblClick,
															edgeRightClick,
															nodeRightClick,
															edgeCreated,
															nodeCreated,
															onSelection,
															onChange}) => {

	const graphRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeGraphRef = useRef<BlueOrangeGraph | null>(null);

	useEffect(() => {
		const current = graphRef.current as HTMLElement;
		if (blueOrangeGraphRef.current == null) {
			blueOrangeGraphRef.current = new BlueOrangeGraph(
				current,
				nodes,
				edges,
				options);
			if (instance) {
				instance(blueOrangeGraphRef.current)
			}
			current.addEventListener("blue-orange-graph-update-event", (ev: any) => {
				// @ts-ignore
				const nodes: Array<GraphNode> = ev.detail.nodes;
				const edges: Array<GraphEdge> = ev.detail.edges;
				if (onChange) {
					onChange(nodes, edges);
				}
			})
			current.addEventListener("blue-orange-graph-edge-clicked", (ev: any) => {
				// @ts-ignore
				const edge: GraphEdge = ev.detail.edge;
				const clickEvent: any = ev.detail.clickEvent;
				if (edgeClicked) {
					edgeClicked(edge, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-node-clicked", (ev: any) => {
				// @ts-ignore
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (nodeClicked) {
					nodeClicked(node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-edge-dbl-click", (ev: any) => {
				// @ts-ignore
				const edge: GraphEdge = ev.detail.edge;
				const clickEvent: any = ev.detail.clickEvent;
				if (edgeDblClick) {
					edgeDblClick(edge, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-node-dbl-click", (ev: any) => {
				// @ts-ignore
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (nodeDblClick) {
					nodeDblClick(node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-edge-right-click", (ev: any) => {
				// @ts-ignore
				const edge: GraphEdge = ev.detail.edge;
				const clickEvent: any = ev.detail.clickEvent;
				if (edgeRightClick) {
					edgeRightClick(edge, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-node-right-click", (ev: any) => {
				// @ts-ignore
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (nodeRightClick) {
					nodeRightClick(node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-selection-event", (ev: any) => {
				// @ts-ignore
				const selectedNodes: Array<GraphNode> = ev.detail.selectedNodes;
				const selectedEdges: Array<GraphEdge> = ev.detail.selectedEdges;
				if (onSelection) {
					onSelection(selectedNodes, selectedEdges);
				}
			})
			current.addEventListener("blue-orange-graph-edge-created", (ev: any) => {
				// @ts-ignore
				const startingNode: GraphNode = ev.detail.startingNode;
				const destinationNode: GraphNode = ev.detail.destinationNode;
				const createdEdge: GraphEdge = ev.detail.createdEdge;
				if (edgeCreated) {
					edgeCreated(createdEdge, startingNode, destinationNode);
				}
			})
			current.addEventListener("blue-orange-graph-node-created", (ev: any) => {
				// @ts-ignore
				const x: number = ev.detail.x;
				const y: number = ev.detail.y;
				const startingNode: GraphNode = ev.detail.startingNode;
				const createdNode: GraphNode = ev.detail.destinationNode;
				const createdEdges: Array<GraphEdge> = ev.detail.createdEdge;
				if (nodeCreated) {
					nodeCreated(x, y, startingNode, createdNode, createdEdges);
				}
			})
			current.addEventListener("blue-orange-graph-node-creation-click", (ev: any) => {
				// @ts-ignore
				const relativePos: GraphRelativePos = ev.detail.relativePos;
				const scale: number = ev.detail.scale;
				if (onNodeCreationClick) {
					onNodeCreationClick(relativePos, scale);
				}
			})
		}
	}, []);


	return (
		<div ref={graphRef} className="blue-orange-graph-parent"></div>
	)
}