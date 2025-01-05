import React, {useRef, useState} from "react";

import './PipelineEditor.css'
import {BlueOrangeGraphWrapper, GraphRelativePos} from "@blue-orange-ai/foundations-graph";

import { BlueOrangeGraph } from '@blue-orange-ai/primitives-graph'
import { Edge as GraphEdge, Node as GraphNode, GraphOptions } from "@blue-orange-ai/primitives-graph";


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {Drawer, DrawerBody, DrawerHeader, DrawerPosition} from "@blue-orange-ai/foundations-core";

interface Props {
}

export const PipelineEditor: React.FC<Props> = ({}) => {

	const [createNodeState, setCreateNodeState] = useState<boolean>(false)

	const graphInstance = useRef<BlueOrangeGraph | undefined>(undefined);

	const generateNodeHtml = (icon: string, title: string, description: string) => {
		var parentElement = document.createElement("div");
		parentElement.className = "blue-orange-pipeline-editor-node";

		var iconCont = document.createElement("div");
		iconCont.className = "blue-orange-pipeline-editor-node-icon"
		iconCont.innerHTML = icon;
		parentElement.appendChild(iconCont);

		var bodyCont = document.createElement("div");
		bodyCont.className = "blue-orange-pipeline-editor-node-body";

		var titleCont = document.createElement("div");
		titleCont.className = "blue-orange-pipeline-editor-node-body-title";
		titleCont.innerText = title;
		bodyCont.appendChild(titleCont);

		var descriptionCont = document.createElement("div");
		descriptionCont.className = "blue-orange-pipeline-editor-node-body-description";
		descriptionCont.innerText = description;
		bodyCont.appendChild(descriptionCont);

		parentElement.appendChild(bodyCont);
		return parentElement.outerHTML;
	}

	const updateGraphInstance = (graph: BlueOrangeGraph) => {
		graphInstance.current = graph;
	}

	const nodeCreationEvent = (relativePos: GraphRelativePos, scale: number) => {
		// setCreateNodeState(true)
		var node: GraphNode = {
			backgroundColour: "white",
			border: "2px solid transparent",
			borderRadius: 4,
			borderSelected: "2px solid dodgerblue",
			deletable: true,
			height: 100,
			html: generateNodeHtml(
				"<i class=\"ri-archive-fill\"></i>",
				"Demonstration Node",
				"Demonstration Description"
			),
			id: "1231231231231231232312312",
			movable: true,
			width: 320,
			x: relativePos.x / scale,
			y: relativePos.y / scale
		}
		if (graphInstance.current) {
			graphInstance.current.createNode(
				node.id,
				node.x,
				node.y,
				node.border,
				node.borderSelected,
				node.borderRadius,
				node.backgroundColour,
				node.width,
				node.height,
				node.html,
				node.movable,
				node.deletable,
				true
			)
		}
	}


	return (
		<div className="blue-orange-pipeline-editor-cont">
			<BlueOrangeGraphWrapper
				instance={updateGraphInstance}
				onNodeCreationClick={nodeCreationEvent}
			></BlueOrangeGraphWrapper>
			{createNodeState &&
				<Drawer DrawerPosition={DrawerPosition.TOP} height={"100vh"}>
					<DrawerHeader label={"Create New Node"} onClose={() => setCreateNodeState(false)}></DrawerHeader>
					<DrawerBody></DrawerBody>
				</Drawer>
			}
		</div>
	)
}