import React, {useEffect, useRef} from "react";

import './BlueOrangeDiagramWrapper.css'

import { BlueOrangeDiagram } from '@blue-orange-ai/primitives-graph'

import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'

import {
	DiagramConnection,
	DiagramFileDescriptor,
	DiagramImageDescriptor,
	DiagramMediaContext,
	DiagramOptions,
	DiagramShape,
	DiagramShapeInput,
	Edge as GraphEdge,
	Node as GraphNode
} from "@blue-orange-ai/primitives-graph";

export type DiagramAlignMode = "left" | "right" | "center-h" | "top" | "bottom" | "center-v" | string;

export type DiagramDistributeAxis = "horizontal" | "vertical" | string;

export type DiagramLayerAction = "front" | "back" | string;

/** Which part of the selection a colour change was applied to. */
export type DiagramColourKind = "fill" | "text" | "line" | "edgeText" | string;

interface Props {
	shapes?: Array<DiagramShapeInput>,
	connections?: Array<DiagramConnection>,
	options?: DiagramOptions,
	instance?: (diagram: BlueOrangeDiagram) => void,
	/** Invoked when the image tool is placed; return / resolve a descriptor to drop an image. */
	imageRequested?: (context: DiagramMediaContext) => DiagramImageDescriptor | Promise<DiagramImageDescriptor | null> | null | void,
	/** Invoked when the file tool is placed; return / resolve a descriptor to drop a file. */
	fileRequested?: (context: DiagramMediaContext) => DiagramFileDescriptor | Promise<DiagramFileDescriptor | null> | null | void,
	shapeCreated?: (shape: DiagramShape) => void,
	freehandCreated?: (shape: DiagramShape) => void,
	shapeResized?: (shape: DiagramShape) => void,
	shapeRotated?: (shape: DiagramShape) => void,
	shapeTextChanged?: (id: string, text: string) => void,
	shapeColourChanged?: (ids: Array<string>, kind: DiagramColourKind, colour: string) => void,
	shapesAligned?: (ids: Array<string>, mode: DiagramAlignMode) => void,
	shapesDistributed?: (ids: Array<string>, axis: DiagramDistributeAxis) => void,
	layerChanged?: (ids: Array<string>, action: DiagramLayerAction) => void,
	connectionLabelChanged?: (id: string, text: string) => void,
	connectionColourChanged?: (kind: DiagramColourKind, colour: string) => void,
	editStart?: (id: string) => void,
	editEnd?: (id: string, text: string) => void,
	shapeClicked?: (shape: DiagramShape | null, node: GraphNode, clickEvent: any) => void,
	shapeDblClick?: (shape: DiagramShape | null, node: GraphNode, clickEvent: any) => void,
	shapeRightClick?: (shape: DiagramShape | null, node: GraphNode, clickEvent: any) => void,
	connectionClicked?: (edge: GraphEdge, clickEvent: any) => void,
	connectionDblClick?: (edge: GraphEdge, clickEvent: any) => void,
	connectionRightClick?: (edge: GraphEdge, clickEvent: any) => void,
	connectionCreated?: (edge: GraphEdge, startingNode: GraphNode, destinationNode: GraphNode) => void,
	onSelection?: (nodes: Array<GraphNode>, edges: Array<GraphEdge>) => void,
	onChange?: (nodes: Array<GraphNode>, edges: Array<GraphEdge>) => void
}

export const BlueOrangeDiagramWrapper: React.FC<Props> = (props) => {

	const {shapes=[], connections=[], options, instance} = props;

	const diagramRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeDiagramRef = useRef<BlueOrangeDiagram | null>(null);

	// Event listeners are registered once, so they read the callbacks through a
	// ref to always call the latest props rather than the ones captured on mount.
	const propsRef = useRef<Props>(props);
	propsRef.current = props;

	// Diagram shapes are graph nodes, so the node events carry the node rather
	// than the shape meta the diagram API works with.
	const resolveShape = (node: GraphNode): DiagramShape | null => {
		const diagram = blueOrangeDiagramRef.current;
		if (diagram == null || node == null || !node.id) {
			return null;
		}
		return diagram.getShape(node.id);
	}

	useEffect(() => {
		const current = diagramRef.current as HTMLElement;
		if (blueOrangeDiagramRef.current == null) {
			const diagramOptions: DiagramOptions = {
				...(options || {}),
				diagram: {
					...((options && options.diagram) || {}),
					callbacks: {
						...((options && options.diagram && options.diagram.callbacks) || {}),
						image: (context: DiagramMediaContext) => {
							const callbacks = options && options.diagram ? options.diagram.callbacks : undefined;
							if (propsRef.current.imageRequested) {
								return propsRef.current.imageRequested(context);
							}
							if (callbacks && callbacks.image) {
								return callbacks.image(context);
							}
							return null;
						},
						file: (context: DiagramMediaContext) => {
							const callbacks = options && options.diagram ? options.diagram.callbacks : undefined;
							if (propsRef.current.fileRequested) {
								return propsRef.current.fileRequested(context);
							}
							if (callbacks && callbacks.file) {
								return callbacks.file(context);
							}
							return null;
						}
					}
				}
			};
			blueOrangeDiagramRef.current = new BlueOrangeDiagram(
				current,
				shapes,
				connections,
				diagramOptions);
			if (instance) {
				instance(blueOrangeDiagramRef.current)
			}
			current.addEventListener("blue-orange-diagram-shape-created", (ev: any) => {
				const shape: DiagramShape = ev.detail.shape;
				if (propsRef.current.shapeCreated) {
					propsRef.current.shapeCreated(shape);
				}
			})
			current.addEventListener("blue-orange-diagram-freehand-created", (ev: any) => {
				const shape: DiagramShape = ev.detail.shape;
				if (propsRef.current.freehandCreated) {
					propsRef.current.freehandCreated(shape);
				}
			})
			current.addEventListener("blue-orange-diagram-shape-resized", (ev: any) => {
				const shape: DiagramShape = ev.detail.shape;
				if (propsRef.current.shapeResized) {
					propsRef.current.shapeResized(shape);
				}
			})
			current.addEventListener("blue-orange-diagram-shape-rotated", (ev: any) => {
				const shape: DiagramShape = ev.detail.shape;
				if (propsRef.current.shapeRotated) {
					propsRef.current.shapeRotated(shape);
				}
			})
			current.addEventListener("blue-orange-diagram-shape-text-changed", (ev: any) => {
				const id: string = ev.detail.id;
				const text: string = ev.detail.text;
				if (propsRef.current.shapeTextChanged) {
					propsRef.current.shapeTextChanged(id, text);
				}
			})
			current.addEventListener("blue-orange-diagram-shape-colour-changed", (ev: any) => {
				const ids: Array<string> = ev.detail.ids;
				const kind: DiagramColourKind = ev.detail.kind;
				const colour: string = ev.detail.colour;
				if (propsRef.current.shapeColourChanged) {
					propsRef.current.shapeColourChanged(ids, kind, colour);
				}
			})
			current.addEventListener("blue-orange-diagram-shapes-aligned", (ev: any) => {
				const ids: Array<string> = ev.detail.ids;
				const mode: DiagramAlignMode = ev.detail.mode;
				if (propsRef.current.shapesAligned) {
					propsRef.current.shapesAligned(ids, mode);
				}
			})
			current.addEventListener("blue-orange-diagram-shapes-distributed", (ev: any) => {
				const ids: Array<string> = ev.detail.ids;
				const axis: DiagramDistributeAxis = ev.detail.axis;
				if (propsRef.current.shapesDistributed) {
					propsRef.current.shapesDistributed(ids, axis);
				}
			})
			current.addEventListener("blue-orange-diagram-layer-changed", (ev: any) => {
				const ids: Array<string> = ev.detail.ids;
				const action: DiagramLayerAction = ev.detail.action;
				if (propsRef.current.layerChanged) {
					propsRef.current.layerChanged(ids, action);
				}
			})
			current.addEventListener("blue-orange-diagram-edge-label-changed", (ev: any) => {
				const id: string = ev.detail.id;
				const text: string = ev.detail.text;
				if (propsRef.current.connectionLabelChanged) {
					propsRef.current.connectionLabelChanged(id, text);
				}
			})
			current.addEventListener("blue-orange-diagram-edge-colour-changed", (ev: any) => {
				const kind: DiagramColourKind = ev.detail.kind;
				const colour: string = ev.detail.colour;
				if (propsRef.current.connectionColourChanged) {
					propsRef.current.connectionColourChanged(kind, colour);
				}
			})
			current.addEventListener("blue-orange-diagram-edit-start", (ev: any) => {
				const id: string = ev.detail.id;
				if (propsRef.current.editStart) {
					propsRef.current.editStart(id);
				}
			})
			current.addEventListener("blue-orange-diagram-edit-end", (ev: any) => {
				const id: string = ev.detail.id;
				const text: string = ev.detail.text;
				if (propsRef.current.editEnd) {
					propsRef.current.editEnd(id, text);
				}
			})
			current.addEventListener("blue-orange-graph-node-clicked", (ev: any) => {
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.shapeClicked) {
					propsRef.current.shapeClicked(resolveShape(node), node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-node-dbl-click", (ev: any) => {
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.shapeDblClick) {
					propsRef.current.shapeDblClick(resolveShape(node), node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-node-right-click", (ev: any) => {
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.shapeRightClick) {
					propsRef.current.shapeRightClick(resolveShape(node), node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-edge-clicked", (ev: any) => {
				const edge: GraphEdge = ev.detail.edge;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.connectionClicked) {
					propsRef.current.connectionClicked(edge, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-edge-dbl-click", (ev: any) => {
				const edge: GraphEdge = ev.detail.edge;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.connectionDblClick) {
					propsRef.current.connectionDblClick(edge, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-edge-right-click", (ev: any) => {
				const edge: GraphEdge = ev.detail.edge;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.connectionRightClick) {
					propsRef.current.connectionRightClick(edge, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-edge-created", (ev: any) => {
				const startingNode: GraphNode = ev.detail.startingNode;
				const destinationNode: GraphNode = ev.detail.destinationNode;
				const createdEdge: GraphEdge = ev.detail.createdEdge;
				if (propsRef.current.connectionCreated) {
					propsRef.current.connectionCreated(createdEdge, startingNode, destinationNode);
				}
			})
			current.addEventListener("blue-orange-graph-selection-event", (ev: any) => {
				const selectedNodes: Array<GraphNode> = ev.detail.selectedNodes;
				const selectedEdges: Array<GraphEdge> = ev.detail.selectedEdges;
				if (propsRef.current.onSelection) {
					propsRef.current.onSelection(selectedNodes, selectedEdges);
				}
			})
			current.addEventListener("blue-orange-graph-update-event", (ev: any) => {
				const nodes: Array<GraphNode> = ev.detail.nodes;
				const edges: Array<GraphEdge> = ev.detail.edges;
				if (propsRef.current.onChange) {
					propsRef.current.onChange(nodes, edges);
				}
			})
		}
	}, []);

	return (
		<div ref={diagramRef} className="blue-orange-diagram-parent"></div>
	)
}
