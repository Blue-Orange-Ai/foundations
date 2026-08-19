import React, {useRef} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Workspace.css'
import {BlueOrangeGraphWrapper, GraphRelativePos} from "../../components/graph/BlueOrangeGraphWrapper";
import {DevNav} from "../dev-nav/DevNav";
import {EventLog, useEventLog} from "../event-log/EventLog";
import {BlueOrangeGraph, Edge as GraphEdge, Node as GraphNode, GraphOptions} from "@blue-orange-ai/primitives-graph";

interface Props {
}

const nodeHtml = (heading: string) => (
	'<div class="workspace-demo-node">' +
	'  <div class="workspace-demo-node-heading">' + heading + '</div>' +
	'  <div class="workspace-demo-node-body">' +
	'    <div><span class="workspace-demo-node-item-heading">Processed:</span> <span>0.00 /s</span></div>' +
	'    <div><span class="workspace-demo-node-item-heading">Errors:</span> <span>0.00</span></div>' +
	'  </div>' +
	'</div>'
);

/** The graph API wants fully-populated nodes; fill in the demo defaults. */
const node = (partial: Partial<GraphNode>): GraphNode => ({
	x: 0, y: 0, width: 230, height: 90,
	border: "2px solid transparent", borderSelected: "2px solid dodgerblue",
	borderRadius: 10, backgroundColour: "transparent",
	movable: true, deletable: true, html: "",
	anchors: ["left", "right", "top", "bottom"],
	...partial
} as GraphNode);

const edge = (partial: Partial<GraphEdge>): GraphEdge => ({
	targetArrow: true, style: "bezier", lineType: "solid",
	lineColour: "#bdbdbd", lineWidth: 2, arrowHeadScale: 1.2, deletable: true,
	...partial
} as GraphEdge);

const initialNodes: Array<GraphNode> = [
	node({id: "ingest", x: 60, y: 60, html: nodeHtml("Ingest")}),
	node({id: "validate", x: 60, y: 240, html: nodeHtml("Validate")}),
	node({id: "enrich", x: 420, y: 60, borderSelected: "2px solid #2ECC71", html: nodeHtml("Enrich")}),
	node({id: "archive", x: 420, y: 240, borderSelected: "2px solid #F39C12", html: nodeHtml("Archive")}),
	node({id: "publish", x: 780, y: 60, borderSelected: "2px solid #E74C3C", html: nodeHtml("Publish")}),
	node({id: "notify", x: 780, y: 240, html: nodeHtml("Notify")})
];

const initialEdges: Array<GraphEdge> = [
	edge({id: "e1", sourceId: "ingest", targetId: "enrich", sourceAnchorPoint: "right", targetAnchorPoint: "left",
		label: true, labelText: "stream"}),
	edge({id: "e2", sourceId: "ingest", targetId: "validate", sourceAnchorPoint: "bottom", targetAnchorPoint: "top", style: "step"}),
	edge({id: "e3", sourceId: "validate", targetId: "archive", sourceAnchorPoint: "right", targetAnchorPoint: "left",
		label: true, labelText: "batch", lineType: "animated"}),
	edge({id: "e4", sourceId: "enrich", targetId: "publish", sourceAnchorPoint: "right", targetAnchorPoint: "left"}),
	edge({id: "e5", sourceId: "archive", targetId: "notify", sourceAnchorPoint: "right", targetAnchorPoint: "left", lineType: "dashed"}),
	edge({id: "e6", sourceId: "publish", targetId: "notify", sourceAnchorPoint: "bottom", targetAnchorPoint: "top", style: "straight"})
];

const options: GraphOptions = {
	allowUserDeletions: true,
	allowUserLinkCreation: true,
	allowUserNodeCreation: true
};

export const Workspace: React.FC<Props> = ({}) => {

	const graphRef = useRef<BlueOrangeGraph | null>(null);

	// Kept in sync via onChange so the edge-restyle buttons always work on the
	// live edge set (including user-drawn edges), not just the initial ones.
	const edgesRef = useRef<Array<GraphEdge>>(initialEdges);

	const [entries, log, clear] = useEventLog();

	const withGraph = (action: (graph: BlueOrangeGraph) => void) => {
		if (graphRef.current) {
			action(graphRef.current);
		}
	}

	const restyleEdges = (style: string) => {
		withGraph((graph) => {
			edgesRef.current.forEach((e) => {
				e.style = style;
				graph.updateEdge(e);
			});
		});
	}

	const addNode = () => {
		withGraph((graph) => {
			const id = uuidv4();
			graph.createNode(id, 120 + Math.random() * 200, 380 + Math.random() * 120,
				"2px solid transparent", "2px solid dodgerblue", 10, "transparent",
				230, 90, nodeHtml("New node"), true, true);
			log("createNode -> " + id.slice(0, 8));
		});
	}

	return (

		<div className="workspace-main-window">
			<DevNav />
			<div className="workspace-content">
				<div className="workspace-display-window">
					<BlueOrangeGraphWrapper
						nodes={initialNodes}
						edges={initialEdges}
						options={options}
						instance={(graph) => graphRef.current = graph}
						onChange={(nodes, edges) => {
							edgesRef.current = edges;
							log("onChange: " + nodes.length + " nodes, " + edges.length + " edges");
						}}
						onSelection={(nodes, edges) => log("onSelection: " + nodes.length + " nodes, " + edges.length + " edges")}
						nodeClicked={(n) => log("nodeClicked: " + n.id)}
						nodeDblClick={(n) => log("nodeDblClick: " + n.id)}
						nodeRightClick={(n) => log("nodeRightClick: " + n.id)}
						edgeClicked={(e) => log("edgeClicked: " + e.sourceId + " -> " + e.targetId)}
						edgeDblClick={(e) => log("edgeDblClick: " + e.sourceId + " -> " + e.targetId)}
						edgeRightClick={(e) => log("edgeRightClick: " + e.sourceId + " -> " + e.targetId)}
						edgeCreated={(e, from, to) => log("edgeCreated: " + from.id + " -> " + to.id)}
						nodeCreated={(x, y, from, created) => log("nodeCreated at " + Math.round(x) + "," + Math.round(y) + " from " + from.id)}
						onNodeCreationClick={(pos: GraphRelativePos, scale: number) => log("onNodeCreationClick at " + Math.round(pos.x) + "," + Math.round(pos.y) + " (scale " + scale.toFixed(2) + ")")} />
				</div>
				<div className="workspace-sidebar">
					<div className="workspace-controls">
						<strong>Auto-layout</strong>
						<button onClick={() => withGraph((g) => g.arrange("dagre", "layered", "down", 180))}>Dagre ↓ down</button>
						<button onClick={() => withGraph((g) => g.arrange("dagre", "layered", "right", 180))}>Dagre → right</button>
						<button onClick={() => withGraph((g) => g.arrange("dagre", "radial", "right", 400))}>Dagre radial</button>
						<button onClick={() => withGraph((g) => g.arrange("elk", "layered", "right", 120))}>ELK layered</button>

						<strong>Edge style</strong>
						<button onClick={() => restyleEdges("bezier")}>Bezier</button>
						<button onClick={() => restyleEdges("straight")}>Straight</button>
						<button onClick={() => restyleEdges("step")}>Smooth step</button>

						<strong>Graph</strong>
						<button onClick={addNode}>Add node</button>
						<button onClick={() => withGraph((g) => g.undo())}>Undo</button>
						<button onClick={() => withGraph((g) => g.redo())}>Redo</button>
						<button onClick={() => withGraph((g) => g.centre())}>Centre view</button>

						<div className="workspace-hints">
							<div>• Drag from a node's edge handle to another node to connect them</div>
							<div>• Shift-drag the canvas for marquee selection; Delete removes the selection</div>
							<div>• Shift-drag off a node handle onto empty canvas to create a linked node</div>
							<div>• Scroll to zoom, drag the canvas to pan; Ctrl+Z / Ctrl+Shift+Z undo / redo</div>
						</div>
					</div>
					<EventLog entries={entries} onClear={clear} />
				</div>
			</div>
		</div>
	)
}
