import React, {useRef, useState} from "react";

import './PipelineEditor.css'
import {BlueOrangeGraphWrapper, GraphRelativePos} from "@blue-orange-ai/foundations-graph";

import {
	BlueOrangeBezierEdge,
	BlueOrangeGraph, BlueOrangeSmoothStepEdge, BlueOrangeStraightEdge,
	Edge as GraphEdge,
	Node as GraphNode
} from '@blue-orange-ai/primitives-graph'


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

	const graphOptions = {
		polkaDots: true,
		allowUserDeletions: true,
		allowUserLinkCreation: true,
		allowUserNodeCreation: true,
		nodes: {
			allowAutomaticCreation: true,
			defaultBorder: "2px solid transparent",
			defaultBorderSelected: "2px solid dodgerblue",
			defaultBorderRadius: 10,
			defaultBackgroundColor: "white",
			defaultWidth: 320,
			defaultHeight: 100,
			defaultHtml: "<div class=\"blue-orange-graph-placeholder-node\"></div>"
		},
		edges: {
			defaultLineWidth: 2,
			defaultArrowHeadScale: 1.2,
			types: {
				"bezier": BlueOrangeBezierEdge,
				"step": BlueOrangeSmoothStepEdge,
				"straight": BlueOrangeStraightEdge
			},
			defaultType: "bezier",
			creationAnchorPos: "right"
		},
		zoom: {
			min: 0.25,
			max: 4,
			step: 0.1
		},
		position: {
			scale: 1,
			top: 0,
			left: 0
		},
		controls: {
			items: [
				{
					name: "centre",
					location: "bl",
					icon: "<i class=\"ri-fullscreen-line\"></i>",
					tooltip: "Center View",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.centre()
					}
				},
				{
					name: "add-new-node",
					location: "tl",
					icon: "<i class=\"ri-add-line\"></i>",
					tooltip: "Create New Node",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.setNodeCreationState(true)
					}
				},
				{
					name: "arrange-down",
					location: "tl",
					icon: "<i class=\"ri-arrow-down-double-line\"></i>",
					tooltip: "Arrange Down",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.arrange("elk", "layered", "down", 100)
						graph.centre()
					}
				},
				{
					name: "arrange-right",
					location: "tl",
					icon: "<i class=\"ri-arrow-right-double-line\"></i>",
					tooltip: "Arrange Right",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.arrange("elk", "layered", "right", 100)
						graph.centre()
					}
				},
				{
					name: "arrange-radial",
					location: "tl",
					icon: "<i class=\"ri-circle-line\"></i>",
					tooltip: "Arrange Radial",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.arrange("elk", "radial", "right", 100)
						graph.centre()
					}
				},
				{
					name: "zoom-out",
					location: "bl",
					icon: "<i class=\"ri-subtract-line\"></i>",
					tooltip: "Zoom Out",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.scale -= graph.stepChange;
						graph.setTransform();
					}
				},
				{
					name: "zoom-in",
					location: "bl",
					icon: "<i class=\"ri-add-line\"></i>",
					tooltip: "Zoom In",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.scale += graph.stepChange;
						graph.setTransform();
					}
				},
				{
					name: "align-horizontal",
					location: "tl",
					icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M11 4V2H13V4H19C19.5523 4 20 4.44772 20 5V10C20 10.5523 19.5523 11 19 11H13V13H17C17.5523 13 18 13.4477 18 14V19C18 19.5523 17.5523 20 17 20H13V22H11V20H7C6.44772 20 6 19.5523 6 19V14C6 13.4477 6.44772 13 7 13H11V11H5C4.44772 11 4 10.5523 4 10V5C4 4.44772 4.44772 4 5 4H11ZM8 15V18H16V15H8ZM6 9H18V6H6V9Z\"></path></svg>",
					tooltip: "Align Horizontal",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.alignNodes("horizontal");
					}
				},
				{
					name: "align-vertical",
					location: "tl",
					icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M9 18L9 6L6 6L6 18H9ZM5 20C4.44772 20 4 19.5523 4 19L4 13H2V11H4L4 5C4 4.44771 4.44771 4 5 4H10C10.5523 4 11 4.44771 11 5V11H13V7C13 6.44771 13.4477 6 14 6L19 6C19.5523 6 20 6.44772 20 7V11H22V13H20V17C20 17.5523 19.5523 18 19 18H14C13.4477 18 13 17.5523 13 17V13H11V19C11 19.5523 10.5523 20 10 20H5ZM15 16H18V8L15 8V16Z\"></path></svg>",
					tooltip: "Align Vertical",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.alignNodes("vertical");
					}
				},
				{
					name: "align-left",
					location: "tl",
					icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M3 21V3H5V21H3ZM9 15H15V18H9V15ZM8 13C7.44772 13 7 13.4477 7 14V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V14C17 13.4477 16.5523 13 16 13H8ZM9 9H19V6H9V9ZM7 5C7 4.44772 7.44772 4 8 4H20C20.5523 4 21 4.44772 21 5V10C21 10.5523 20.5523 11 20 11H8C7.44772 11 7 10.5523 7 10V5Z\"></path></svg>",
					tooltip: "Align Left",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.alignNodes("left");
					}
				},
				{
					name: "align-right",
					location: "tl",
					icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M19 21V3H21V21H19ZM9 15H15V18H9V15ZM8 13C7.44772 13 7 13.4477 7 14V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V14C17 13.4477 16.5523 13 16 13H8ZM5 9H15V6H5V9ZM3 5C3 4.44772 3.44772 4 4 4H16C16.5523 4 17 4.44772 17 5V10C17 10.5523 16.5523 11 16 11H4C3.44772 11 3 10.5523 3 10V5Z\"></path></svg>",
					tooltip: "Align Right",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.alignNodes("right");
					}
				},
				{
					name: "align-top",
					location: "tl",
					icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M21 3H3V5L21 5V3ZM15 9V15H18V9H15ZM13 8C13 7.44772 13.4477 7 14 7L19 7C19.5523 7 20 7.44772 20 8V16C20 16.5523 19.5523 17 19 17H14C13.4477 17 13 16.5523 13 16V8ZM9 9L9 19H6L6 9H9ZM5 7C4.44772 7 4 7.44772 4 8L4 20C4 20.5523 4.44772 21 5 21H10C10.5523 21 11 20.5523 11 20L11 8C11 7.44772 10.5523 7 10 7L5 7Z\"></path></svg>",
					tooltip: "Align Top",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.alignNodes("top");
					}
				},
				{
					name: "align-bottom",
					location: "tl",
					icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M9 5L9 15H6L6 5L9 5ZM5 3C4.44772 3 4 3.44772 4 4L4 16C4 16.5523 4.44772 17 5 17H10C10.5523 17 11 16.5523 11 16L11 4C11 3.44772 10.5523 3 10 3H5ZM15 9V15H18V9H15ZM13 8C13 7.44772 13.4477 7 14 7L19 7C19.5523 7 20 7.44772 20 8V16C20 16.5523 19.5523 17 19 17H14C13.4477 17 13 16.5523 13 16V8ZM21 19L3 19V21H21V19Z\"></path></svg>",
					tooltip: "Align Bottom",
					marginLeft: 0,
					marginRight: 0,
					marginBottom: 0,
					marginTop: 0,
					action: (graph) => {
						graph.alignNodes("bottom");
					}
				}
			]
		}
	}

	const [createNodeState, setCreateNodeState] = useState<string | undefined>(undefined)

	const [focusNode, setFocusNode] = useState<GraphNode>(undefined)

	const focusNodeDeletableState = useRef<boolean>(true)

	const graphInstance = useRef<BlueOrangeGraph | undefined>(undefined);

	const updateGraphInstance = (graph: BlueOrangeGraph) => {
		graphInstance.current = graph;
	}

	const nodeCreationEvent = (relativePos: GraphRelativePos, scale: number) => {
		var node: GraphNode = {
			backgroundColour: "white",
			border: "2px solid transparent",
			borderRadius: 4,
			borderSelected: "2px solid dodgerblue",
			deletable: true,
			height: 100,
			html: Utilities.generateGeneralNodeHtml(
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
		setFocusNode(node);
		setCreateNodeState("NEW_NODE")
	}

	const createFocusNode = () => {
		if (graphInstance.current) {
			graphInstance.current.createNode(
				focusNode.id,
				focusNode.x,
				focusNode.y,
				focusNode.border,
				focusNode.borderSelected,
				focusNode.borderRadius,
				focusNode.backgroundColour,
				focusNode.width,
				focusNode.height,
				focusNode.html,
				focusNode.movable,
				focusNode.deletable,
				true
			)
		}
		setCreateNodeState(undefined)
	}

	const updateFocusNode = () => {
		graphInstance.current.updateNode(
			focusNode.id,
			focusNode.border,
			focusNode.borderSelected,
			focusNode.borderRadius,
			focusNode.backgroundColour,
			focusNode.width,
			focusNode.height,
			focusNode.html,
			focusNode.movable,
			focusNodeDeletableState.current
		)
		setCreateNodeState(undefined)
	}

	const nodeCreated = (
		x: number,
		y: number,
		startingNode: GraphNode,
		createdNode: GraphNode,
		createdEdge: Array<GraphEdge>) => {
		createdNode.html = Utilities.generateGeneralNodeHtml(
			"<i class=\"ri-archive-fill\"></i>",
			"#393939",
			"#e0e1e2",
			"Demonstration Node",
			"Demonstration Description",
			"#393939"
		);
		setFocusNode(createdNode);
		setCreateNodeState("NODE_CREATED")
	}

	const updateNodeClick = (node: GraphNode) => {
		focusNodeDeletableState.current = node.deletable;
		setFocusNode(node);
		graphInstance.current.updateNode(
			node.id,
			node.border,
			node.borderSelected,
			node.borderRadius,
			node.backgroundColour,
			node.width,
			node.height,
			node.html,
			node.movable,
			false
		)
		setCreateNodeState("UPDATE_NODE")
	}

	const saveNodeStyleUpdate = () => {
		if (createNodeState == "NEW_NODE") {
			createFocusNode();
		} else {
			updateFocusNode()
		}
	}

	const closeNodeUpdate = () => {
		if (createNodeState == "NODE_CREATED") {
			graphInstance.current.deleteNode(focusNode);
		}
		setCreateNodeState(undefined)
	}


	return (
		<div className="blue-orange-pipeline-editor-cont">
			<BlueOrangeGraphWrapper
				instance={updateGraphInstance}
				options={graphOptions}
				onNodeCreationClick={nodeCreationEvent}
				nodeCreated={nodeCreated}
				nodeRightClick={(node: GraphNode, clickEvent: any) => updateNodeClick(node)}
			></BlueOrangeGraphWrapper>
			{createNodeState &&
				<Drawer position={DrawerPosition.BOTTOM} height={"calc(100vh - 48px)"}>
					<DrawerHeader label={"Create New Node"} onClose={closeNodeUpdate}></DrawerHeader>
					<DrawerBody>
						<PipelineNodeStyleEditor node={focusNode} onChange={setFocusNode}></PipelineNodeStyleEditor>
					</DrawerBody>
					<DrawerFooter>
						<DrawerFooterLeft>
							<div className="pipeline-editor-btn-group">
								<Button text={"Save"} buttonType={ButtonType.PRIMARY} onClick={saveNodeStyleUpdate}></Button>
							</div>
						</DrawerFooterLeft>
					</DrawerFooter>
				</Drawer>
			}
		</div>
	)
}