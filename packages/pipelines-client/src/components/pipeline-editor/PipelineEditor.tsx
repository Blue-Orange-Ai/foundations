import React, {useRef, useState} from "react";

import './PipelineEditor.css'
import {BlueOrangeGraphWrapper, GraphRelativePos} from "@blue-orange-ai/foundations-graph";

import {BlueOrangeGraph, Node as GraphNode} from '@blue-orange-ai/primitives-graph'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {
	Button,
	ButtonType,
	ColorPicker,
	Drawer,
	DrawerBody,
	DrawerFooter, DrawerFooterLeft,
	DrawerHeader,
	DrawerPosition,
	IconSelector,
	Input,
	InputForm
} from "@blue-orange-ai/foundations-core";
import {v4 as uuidv4} from "uuid";
import {PipelineNodePreview} from "../pipeline-node-preview/PipelineNodePreview";
import {Utilities} from "../utilities/Utilities";
import {PipelineNodeStyleEditor} from "../pipeline-node-style-editor/PipelineNodeStyleEditor";

interface Props {
}

export const PipelineEditor: React.FC<Props> = ({}) => {

	const [createNodeState, setCreateNodeState] = useState<boolean>(false)

	const createNode = useRef<GraphNode>(undefined);

	const graphInstance = useRef<BlueOrangeGraph | undefined>(undefined);



	// const generateNodeHtml = (icon: string, title: string, description: string) => {
	// 	var parentElement = document.createElement("div");
	// 	parentElement.className = "blue-orange-pipeline-editor-node";
	//
	// 	var iconCont = document.createElement("div");
	// 	iconCont.className = "blue-orange-pipeline-editor-node-icon"
	// 	iconCont.innerHTML = icon;
	// 	parentElement.appendChild(iconCont);
	//
	// 	var bodyCont = document.createElement("div");
	// 	bodyCont.className = "blue-orange-pipeline-editor-node-body";
	//
	// 	var titleCont = document.createElement("div");
	// 	titleCont.className = "blue-orange-pipeline-editor-node-body-title";
	// 	titleCont.innerText = title;
	// 	bodyCont.appendChild(titleCont);
	//
	// 	var descriptionCont = document.createElement("div");
	// 	descriptionCont.className = "blue-orange-pipeline-editor-node-body-description";
	// 	descriptionCont.innerText = description;
	// 	bodyCont.appendChild(descriptionCont);
	//
	// 	parentElement.appendChild(bodyCont);
	// 	return parentElement.outerHTML;
	// }

	const updateGraphInstance = (graph: BlueOrangeGraph) => {
		graphInstance.current = graph;
	}

	const nodeCreationEvent = (relativePos: GraphRelativePos, scale: number) => {
		setCreateNodeState(true)
		var node: GraphNode = {
			backgroundColour: "white",
			border: "2px solid transparent",
			borderRadius: 4,
			borderSelected: "2px solid dodgerblue",
			deletable: true,
			height: 100,
			html: Utilities.generateNodeHtml(
				"<i class=\"ri-archive-fill\"></i>",
				"#393939",
				"#e0e1e2",
				"Demonstration Node",
				"Demonstration Description",
				"#393939"
			),
			id: uuidv4(),
			movable: true,
			width: 320,
			x: relativePos.x / scale,
			y: relativePos.y / scale
		}
		createNode.current = node;

		// if (graphInstance.current) {
		// 	graphInstance.current.createNode(
		// 		node.id,
		// 		node.x,
		// 		node.y,
		// 		node.border,
		// 		node.borderSelected,
		// 		node.borderRadius,
		// 		node.backgroundColour,
		// 		node.width,
		// 		node.height,
		// 		node.html,
		// 		node.movable,
		// 		node.deletable,
		// 		true
		// 	)
		// }
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
					<DrawerBody>
						<PipelineNodeStyleEditor node={createNode.current}></PipelineNodeStyleEditor>
						{/*<div className="pipeline-editor-new-node-display-cont">*/}
						{/*	<PipelineNodePreview iconHtml={"<i class=\"ri-archive-fill\"></i>"} title={"Demonstration Node"} description={"Demonstration Description"}></PipelineNodePreview>*/}
						{/*</div>*/}
						{/*<InputForm verticalMargin={24} paddingBottom={80}>*/}
						{/*	<Input label={"Title"} value={"Demonstration Node"}></Input>*/}
						{/*	<Input label={"Description"} value={"Demonstration Description"}></Input>*/}
						{/*	<ColorPicker label={"Background Color"} value={"white"}></ColorPicker>*/}
						{/*	<ColorPicker label={"Selection Outline Color"} value={"dodgerblue"}></ColorPicker>*/}
						{/*	<IconSelector label={"Icon"} value={"<i class=\"ri-archive-fill\"></i>"}></IconSelector>*/}
						{/*	<ColorPicker label={"Icon Color"} value={"#393939"}></ColorPicker>*/}
						{/*	<ColorPicker label={"Icon Background"} value={"#e0e1e2"}></ColorPicker>*/}
						{/*</InputForm>*/}
					</DrawerBody>
					<DrawerFooter>
						<DrawerFooterLeft>
							<Button text={"Save"} buttonType={ButtonType.PRIMARY}></Button>
						</DrawerFooterLeft>
					</DrawerFooter>
				</Drawer>
			}
		</div>
	)
}