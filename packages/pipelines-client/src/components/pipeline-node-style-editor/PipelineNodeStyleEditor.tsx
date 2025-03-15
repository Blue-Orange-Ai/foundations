import React, {useRef, useState} from "react";

import './PipelineNodeStyleEditor.css'

import {BlueOrangeGraph, Node as GraphNode} from '@blue-orange-ai/primitives-graph'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {ColorPicker, IconSelector, Input, InputForm, RenderHtml} from "@blue-orange-ai/foundations-core";
import {Utilities} from "../utilities/Utilities";
import {PipelineNodePreview} from "../pipeline-node-preview/PipelineNodePreview";
import {PipelineNodeStyleEditorForm} from "../pipeline-node-style-editor-form/PipelineNodeStyleEditorForm";

interface Props {
	node: GraphNode,
	onChange?: (node: GraphNode) => void,
}

export const PipelineNodeStyleEditor: React.FC<Props> = ({node, onChange}) => {

	const nodeRef = useRef<GraphNode>(node)

	const [title, setTitle] = useState<string>(Utilities.getNodeTitle(node.html));

	const [description, setDescription] = useState<string>(Utilities.getNodeDescription(node.html));

	const [border, setBorder] = useState(node.border);

	const [width, setWidth] = useState(node.width);

	const [height, setHeight] = useState(node.height);

	const [backgroundColor, setBackgroundColor] = useState(node.backgroundColour);

	const [fontColor, setFontColor] = useState(Utilities.getNodeFontColor(node.html));

	const [iconHtml, setIconHtml] = useState(Utilities.getNodeIcon(node.html));

	const [iconColor, setIconColor] = useState(Utilities.getNodeIconColor(node.html));

	const [iconBackground, setIconBackground] = useState(Utilities.getNodeIconBackgroundColor(node.html));

	const handleTitleChange = (t: string) => {
		setTitle(t);
		const nodeHtml = Utilities.generateNodeHtml(
			iconHtml,
			iconColor,
			iconBackground,
			t,
			description,
			fontColor
		)
		nodeRef.current.html = nodeHtml;
		dispatchChange();
	}

	const handleDescriptionChange = (d: string) => {
		setDescription(d);
		const nodeHtml = Utilities.generateNodeHtml(
			iconHtml,
			iconColor,
			iconBackground,
			title,
			d,
			fontColor
		)
		nodeRef.current.html = nodeHtml;
		dispatchChange();
	}

	const handleBackgroundColorChange = (bc: string) => {
		setBackgroundColor(bc);
		nodeRef.current.backgroundColour = bc;
		dispatchChange();
	}

	const handleFontColorChange = (fc: string) => {
		setFontColor(fc);
		const nodeHtml = Utilities.generateNodeHtml(
			iconHtml,
			iconColor,
			iconBackground,
			title,
			description,
			fc
		)
		nodeRef.current.html = nodeHtml;
		dispatchChange();
	}

	const handleBorderChange = (b: string) => {
		setBorder(b);
		nodeRef.current.border = b;
		dispatchChange();
	}

	const handleIconHtmlChange = (ih: string) => {
		setIconHtml(ih);
		const nodeHtml = Utilities.generateNodeHtml(
			ih,
			iconColor,
			iconBackground,
			title,
			description,
			fontColor
		)
		nodeRef.current.html = nodeHtml;
		dispatchChange();
	}

	const handleIconColorChange = (ic: string) => {
		setIconColor(ic);
		const nodeHtml = Utilities.generateNodeHtml(
			iconHtml,
			ic,
			iconBackground,
			title,
			description,
			fontColor
		)
		nodeRef.current.html = nodeHtml;
		dispatchChange();
	}

	const handleIconBackgroundChange = (ib: string) => {
		setIconBackground(ib);
		const nodeHtml = Utilities.generateNodeHtml(
			iconHtml,
			ib,
			iconBackground,
			title,
			description,
			fontColor
		)
		nodeRef.current.html = nodeHtml;
		dispatchChange();
	}

	const handleBorderRadiusChange = (br: number) => {
		nodeRef.current.borderRadius = br;
		dispatchChange();
	}

	const handleHeightChange = (h: number) => {
		setHeight(h)
		nodeRef.current.height = h;
		dispatchChange();
	}

	const handleWidthChange = (w: number) => {
		setWidth(w)
		nodeRef.current.width = w;
		dispatchChange();
	}

	const dispatchChange = () => {
		if (onChange) {
			onChange(nodeRef.current);
		}
	}

	return (
		<>
			<div className="pipeline-editor-new-node-display-cont">
				<PipelineNodePreview
					iconHtml={iconHtml}
					backgroundColor={backgroundColor}
					fontColor={fontColor}
					iconColor={iconColor}
					iconBackground={iconBackground}
					border={border}
					height={height}
					width={width}
				 	title={title}
					description={description}></PipelineNodePreview>
			</div>
			<PipelineNodeStyleEditorForm
				iconHtml={iconHtml}
				iconColor={iconColor}
				iconBackground={iconBackground}
				title={title}
				description={description}
				backgroundColor={backgroundColor}
				fontColor={fontColor}
				height={height}
				width={width}
				border={border}
				onTitleChange={handleTitleChange}
				onDescriptionChange={handleDescriptionChange}
				onIconHtmlChange={handleIconHtmlChange}
				onIconColorChange={handleIconColorChange}
				onIconBackgroundChange={handleIconBackgroundChange}
				onBackgroundColorChange={handleBackgroundColorChange}
				onBorderRadiusChange={handleBorderRadiusChange}
				onHeightChange={handleHeightChange}
				onWidthChange={handleWidthChange}
				onBorderChange={handleBorderChange}
				onFontColorChange={handleFontColorChange}
			></PipelineNodeStyleEditorForm>

		</>
	)
}