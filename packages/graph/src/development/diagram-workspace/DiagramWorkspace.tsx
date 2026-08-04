import React from "react";

import './DiagramWorkspace.css'
import {BlueOrangeDiagramWrapper} from "../../components/diagram/BlueOrangeDiagramWrapper";
import {DiagramConnection, DiagramShapeInput} from "@blue-orange-ai/primitives-graph";

interface Props {
}

const shapes: Array<DiagramShapeInput> = [
	{id: "client", type: "laptop", x: 80, y: 120, text: "Client"},
	{id: "api", type: "api", x: 320, y: 120, text: "API Gateway"},
	{id: "service", type: "microservice", x: 560, y: 120, text: "Service"},
	{id: "db", type: "database", x: 800, y: 120, text: "Postgres"}
];

const connections: Array<DiagramConnection> = [
	{sourceId: "client", targetId: "api", label: "HTTPS"},
	{sourceId: "api", targetId: "service"},
	{sourceId: "service", targetId: "db", label: "SQL"}
];

export const DiagramWorkspace: React.FC<Props> = ({}) => {

	return (

		<div className="diagram-workspace-main-window">
			<div className="diagram-workspace-display-window">
				<BlueOrangeDiagramWrapper
					shapes={shapes}
					connections={connections}
					shapeCreated={(shape) => console.log("shape created", shape)}
					shapeTextChanged={(id, text) => console.log("shape text changed", id, text)}
					onChange={(nodes, edges) => console.log("changed", nodes.length, edges.length)} />
			</div>
		</div>
	)
}
