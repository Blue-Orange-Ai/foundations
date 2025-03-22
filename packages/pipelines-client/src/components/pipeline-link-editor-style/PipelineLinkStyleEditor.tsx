import React, {useRef, useState} from "react";

import './PipelineLinkStyleEditor.css'

import {Edge as GraphEdge} from '@blue-orange-ai/primitives-graph'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {
	Checkbox,
	ColorPicker, Dropdown, DropdownItemIcon, DropdownItemObj, DropdownItemText, HelpIcon,
	IconSelector,
	Input,
	InputForm,
	RenderHtml, RequiredIcon,
	Toggle
} from "@blue-orange-ai/foundations-core";
import {Utilities} from "../utilities/Utilities";
import {PipelineNodePreview} from "../pipeline-node-preview/PipelineNodePreview";
import {PipelineNodeStyleEditorForm} from "../pipeline-node-style-editor-form/PipelineNodeStyleEditorForm";

interface Props {
	edge: GraphEdge,
	labelWhitelist?: Array<string>,
	onChange?: (edge: GraphEdge) => void,
}

export const PipelineLinkStyleEditor: React.FC<Props> = ({edge, labelWhitelist, onChange}) => {

	const edgeRef = useRef<GraphEdge>(edge)

	const [showLabel, setShowLabel] = useState<boolean>(edge.label);

	const [labelTxt, setLabelTxt] = useState<string>(edge.labelText);

	const [labelBackground, setLabelBackground] = useState<string>((edge.labelBackground == undefined || edge.labelBackground == "") ? "white" : edge.labelBackground);

	const [lineColor, setLineColor] = useState<string>(edge.lineColour);

	const [lineStyle, setLineStyle] = useState<string>(edge.style);

	const [lineType, setLineType] = useState<string>(edge.lineType);

	const [arrowHeadSource, setArrowHeadSource] = useState<boolean>(edge.sourceArrow);

	const [arrowHeadTarget, setArrowHeadTarget] = useState<boolean>(edge.targetArrow);

	const handleLabelChange = (labelState: boolean) => {
		setShowLabel(labelState);
		edgeRef.current.label = labelState;
		dispatchChange();
	}

	const handleLabelTxtChange = (labelTxt: string) => {
		setLabelTxt(labelTxt);
		edgeRef.current.labelText = labelTxt;
		dispatchChange();
	}

	const handleLabelBackgroundColor = (color: string) => {
		setLabelBackground(color);
		edgeRef.current.labelBackground = color;
		dispatchChange();
	}

	const handleLineColor = (color: string) => {
		setLineColor(color);
		edgeRef.current.lineColour = color;
		dispatchChange();
	}

	const handleLineStyle = (style: string) => {
		setLineStyle(style);
		edgeRef.current.style = style;
		dispatchChange();
	}

	const handleLineType = (lineType: string) => {
		setLineType(lineType);
		edgeRef.current.lineType = lineType;
		dispatchChange();
	}

	const handleArrowHeadSource = (arrowHeadState: boolean) => {
		setArrowHeadSource(arrowHeadState);
		edgeRef.current.sourceArrow = arrowHeadState;
		dispatchChange();
	}

	const handleArrowHeadTarget = (arrowHeadState: boolean) => {
		setArrowHeadTarget(arrowHeadState);
		edgeRef.current.targetArrow = arrowHeadState;
		dispatchChange();
	}

	const dispatchChange = () => {
		if (onChange) {
			onChange(edgeRef.current);
		}
	}

	return (
		<>
			<InputForm verticalMargin={24} paddingBottom={80}>
				<div className="blue-orange-link-style-horizontal-layout">
					<div className="blue-orange-default-input-label-cont">Show Label</div>
					<Toggle checked={showLabel} onChange={handleLabelChange}></Toggle>
				</div>
				{
					showLabel && !labelWhitelist &&
					<Input placeholder="Label..." value={labelTxt} onChange={handleLabelTxtChange}></Input>
				}
				{
					showLabel && labelWhitelist &&
					<Dropdown onSelection={(item: DropdownItemObj) => handleLabelTxtChange(item.reference)}>
						{labelWhitelist.map((item, index) => (
							<DropdownItemText
								key={item.value + "-" + index}
								label={item}
								value={item}
								selected={labelTxt == item}></DropdownItemText>
						))}
					</Dropdown>
				}
				{
					showLabel &&
					<ColorPicker label="Background Color" value={labelBackground}  onChange={handleLabelBackgroundColor}></ColorPicker>
				}
				<ColorPicker label="Line Color" value={lineColor} onChange={handleLineColor}></ColorPicker>
				<Dropdown label={"Line Style"} onSelection={(item: DropdownItemObj) => handleLineStyle(item.reference)}>
					<DropdownItemIcon src={"ri-sketching"} label={"Bezier"} value={"bezier"}
									  selected={lineStyle == "bezier"}></DropdownItemIcon>
					<DropdownItemIcon src={"ri-guide-line"} label={"Step"} value={"step"}
									  selected={lineStyle == "step"}></DropdownItemIcon>
					<DropdownItemIcon src={"ri-separator"} label={"Straight"} value={"straight"}
									  selected={lineStyle == "straight"}></DropdownItemIcon>
				</Dropdown>
				<Dropdown label={"Line Type"} onSelection={(item: DropdownItemObj) => handleLineType(item.reference)}>
					<DropdownItemIcon src={"ri-subtract-fill"} label={"Solid"} value={"solid"}
									  selected={lineType == "solid"}></DropdownItemIcon>
					<DropdownItemIcon src={"ri-more-line"} label={"Dashed"} value={"dashed"}
									  selected={lineType == "dashed"}></DropdownItemIcon>
					<DropdownItemIcon src={"ri-play-large-fill"} label={"Animated"} value={"animated"}
									  selected={lineType == "animated"}></DropdownItemIcon>
				</Dropdown>
				<div className="blue-orange-link-style-horizontal-layout">
					<div className="blue-orange-default-input-label-cont">Arrow Head Source</div>
					<Toggle checked={arrowHeadSource} onChange={handleArrowHeadSource}></Toggle>
				</div>
				<div className="blue-orange-link-style-horizontal-layout">
					<div className="blue-orange-default-input-label-cont">Arrow Head Target</div>
					<Toggle checked={arrowHeadTarget} onChange={handleArrowHeadTarget}></Toggle>
				</div>
			</InputForm>

		</>
	)
}