import React, {useRef} from "react";

import './DiagramWorkspace.css'
import {BlueOrangeDiagramWrapper} from "../../components/diagram/BlueOrangeDiagramWrapper";
import {DevNav} from "../dev-nav/DevNav";
import {EventLog, useEventLog} from "../event-log/EventLog";
import {BlueOrangeDiagram, DiagramConnection, DiagramShapeInput} from "@blue-orange-ai/primitives-graph";

interface Props {
}

const shapes: Array<DiagramShapeInput> = [
	{id: "user", type: "user", x: 80, y: 220, text: "User"},
	{id: "web", type: "rectangle", x: 260, y: 200, text: "Web App"},
	{id: "api", type: "api", x: 470, y: 200, text: "API Gateway"},
	{id: "svc", type: "microservice", x: 690, y: 120, text: "Orders"},
	{id: "cache", type: "cache", x: 690, y: 280, text: "Redis"},
	{id: "db", type: "database", x: 910, y: 120, text: "Postgres"},
	{id: "note", type: "note", x: 470, y: 360, text: "TODO: add auth"}
];

const connections: Array<DiagramConnection> = [
	{sourceId: "user", targetId: "web", label: "HTTPS"},
	{sourceId: "web", targetId: "api"},
	{sourceId: "api", targetId: "svc"},
	{sourceId: "api", targetId: "cache"},
	{sourceId: "svc", targetId: "db", label: "SQL"}
];

export const DiagramWorkspace: React.FC<Props> = ({}) => {

	const diagramRef = useRef<BlueOrangeDiagram | null>(null);

	const [entries, log, clear] = useEventLog();

	const withDiagram = (action: (diagram: BlueOrangeDiagram) => void) => {
		if (diagramRef.current) {
			action(diagramRef.current);
		}
	}

	return (

		<div className="diagram-workspace-main-window">
			<DevNav />
			<div className="diagram-workspace-content">
				<div className="diagram-workspace-display-window">
					<BlueOrangeDiagramWrapper
						shapes={shapes}
						connections={connections}
						instance={(diagram) => diagramRef.current = diagram}
						imageRequested={() => {
							const src = window.prompt("Image URL:", "https://picsum.photos/240/160");
							return src ? {src: src, width: 200, height: 140} : null;
						}}
						fileRequested={() => {
							const name = window.prompt("File name:", "spec.pdf");
							return name ? {fileName: name} : null;
						}}
						shapeCreated={(shape) => log("shapeCreated: " + shape.type + " (" + shape.id.slice(0, 8) + ")")}
						freehandCreated={(shape) => log("freehandCreated: " + shape.id.slice(0, 8))}
						shapeResized={(shape) => log("shapeResized: " + shape.id.slice(0, 8))}
						shapeRotated={(shape) => log("shapeRotated: " + shape.id.slice(0, 8))}
						shapeTextChanged={(id, text) => log("shapeTextChanged: " + id.slice(0, 8) + " -> \"" + text + "\"")}
						shapeColourChanged={(ids, kind, colour) => log("shapeColourChanged: " + kind + " " + colour + " on " + ids.length + " shape(s)")}
						shapesAligned={(ids, mode) => log("shapesAligned: " + mode + " on " + ids.length + " shape(s)")}
						shapesDistributed={(ids, axis) => log("shapesDistributed: " + axis + " on " + ids.length + " shape(s)")}
						layerChanged={(ids, action) => log("layerChanged: " + action + " on " + ids.length + " shape(s)")}
						connectionLabelChanged={(id, text) => log("connectionLabelChanged: \"" + text + "\"")}
						connectionColourChanged={(kind, colour) => log("connectionColourChanged: " + kind + " " + colour)}
						connectionCreated={(e, from, to) => log("connectionCreated: " + from.id + " -> " + to.id)}
						editStart={(id) => log("editStart: " + id.slice(0, 8))}
						editEnd={(id, text) => log("editEnd: " + id.slice(0, 8) + " -> \"" + text + "\"")}
						shapeClicked={(shape, n) => log("shapeClicked: " + (shape ? shape.type : "?") + " (" + n.id.slice(0, 8) + ")")}
						shapeDblClick={(shape, n) => log("shapeDblClick: " + (shape ? shape.type : "?") + " (" + n.id.slice(0, 8) + ")")}
						connectionClicked={(e) => log("connectionClicked: " + e.sourceId + " -> " + e.targetId)}
						onSelection={(nodes, edges) => log("onSelection: " + nodes.length + " shapes, " + edges.length + " connections")}
						onChange={(nodes, edges) => log("onChange: " + nodes.length + " shapes, " + edges.length + " connections")} />
				</div>
				<div className="diagram-workspace-sidebar">
					<div className="diagram-workspace-controls">
						<strong>Programmatic API</strong>
						<button onClick={() => withDiagram((d) => {
							const id = d.addShape("microservice", 600, 460, "New service");
							log("addShape -> " + String(id).slice(0, 8));
						})}>Add microservice</button>
						<button onClick={() => withDiagram((d) => {
							d.addImage(200, 480, {src: "https://picsum.photos/200/140", width: 200, height: 140});
							log("addImage");
						})}>Add image</button>
						<button onClick={() => withDiagram((d) => {
							d.addFile(420, 500, {fileName: "runbook.md"});
							log("addFile");
						})}>Add file card</button>
						<button onClick={() => withDiagram((d) => console.log("diagram.toJSON()", d.toJSON()))}>Print toJSON() to console</button>

						<div className="diagram-workspace-hints">
							<div>• Palette (top-right): tool row (Select / Freehand / Text / Note / Image / File) above the shape grids</div>
							<div>• Pick a shape, then click the canvas — placement is sticky, Escape exits</div>
							<div>• Double-click a shape to edit its text; drag edge handles to connect</div>
							<div>• Select a shape to resize and recolour; double-click an edge to label it</div>
							<div>• Shift-drag a marquee, group with the toolbar, Ctrl+Z / Ctrl+Shift+Z</div>
						</div>
					</div>
					<EventLog entries={entries} onClear={clear} />
				</div>
			</div>
		</div>
	)
}
