import React, {useRef, useState} from "react";

import './PipelineNodeStyleEditorForm.css'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {ColorPicker, IconSelector, Input, InputForm, RenderHtml} from "@blue-orange-ai/foundations-core";

interface PipelineNodeStyle {
	iconHtml: string,
	iconColor: string,
	iconBackground: string,
	title: string,
	description: string
	backgroundColor: string,
	fontColor: string,
	borderRadius: string,
	height: string,
	width: string,
	borderColor: string,
	borderWidth: string,
	borderStyle: string,
}

interface Props {
	iconHtml: string,
	iconColor: string,
	iconBackground: string,
	title: string,
	description: string
	backgroundColor?: string,
	fontColor?: string,
	borderRadius?: string,
	height?: string,
	width?: string,
	border?: string,
	onTitleChange?: (t: string) => void,
	onDescriptionChange?: (t: string) => void,
	onIconHtmlChange?: (t: string) => void,
	onIconColorChange?: (t: string) => void,
	onIconBackgroundChange?: (t: string) => void,
	onBackgroundColorChange?: (t: string) => void,
	onBorderRadiusChange?: (t: number) => void,
	onHeightChange?: (t: number) => void,
	onWidthChange?: (t: number) => void,
	onBorderChange?: (t: string) => void,
	onFontColorChange?: (t: string) => void,
}

export const PipelineNodeStyleEditorForm: React.FC<Props> = ({
														 iconHtml,
														 iconColor,
														 iconBackground,
														 title,
														 description,
														 backgroundColor="#FFFFFF",
														 fontColor= "#393939",
														 borderRadius="4px",
														 height= "fit-height",
														 width= "fit-width",
														 border="2px solid dodgerblue",
														 onTitleChange,
														 onDescriptionChange,
														 onIconHtmlChange,
														 onIconColorChange,
														 onIconBackgroundChange,
														 onBackgroundColorChange,
														 onBorderRadiusChange,
														 onHeightChange,
														 onWidthChange,
														 onBorderChange,
														 onFontColorChange}) => {

	const getBorderWidth = (border: string): string => {
		const items = border.split(" ");
		return items[0]
	}

	const getBorderType = (border: string): string => {
		const items = border.split(" ");
		return items[1]
	}

	const getBorderColor = (border: string): string => {
		const items = border.split(" ");
		return items[2]
	}

	const [nodeStyle, setNodeStyle] = useState<PipelineNodeStyle>({
		iconHtml: iconHtml,
		iconColor: iconColor,
		iconBackground: iconBackground,
		title: title,
		description: description,
		backgroundColor: backgroundColor,
		fontColor: fontColor,
		borderRadius: borderRadius,
		height: height,
		width: width,
		borderColor: getBorderColor(border),
		borderWidth: getBorderWidth(border),
		borderStyle: getBorderType(border),
	})

	const handleTitleChange = (v: string) => {
		setNodeStyle((prevTitle) => ({
			...prevTitle,
			title: v,
		}));
		if (onTitleChange) onTitleChange(v);
	}

	const handleDescriptionChange = (v: string) => {
		setNodeStyle((prevTitle) => ({
			...prevTitle,
			description: v,
		}));
		if (onDescriptionChange) onDescriptionChange(v);
	}

	const handleBackgroundColorChange = (v: string) => {
		setNodeStyle((prevTitle) => ({
			...prevTitle,
			backgroundColor: v,
		}));
		if (onBackgroundColorChange) onBackgroundColorChange(v);
	}

	const handleFontColorChange = (v: string) => {
		setNodeStyle((prevTitle) => ({
			...prevTitle,
			fontColor: v,
		}));
		if (onFontColorChange) onFontColorChange(v);
	}

	const handleBorderColorChange = (v: string) => {
		const border = nodeStyle.borderWidth + " " + nodeStyle.borderStyle + " " + nodeStyle.borderColor;
		setNodeStyle((prevTitle) => ({
			...prevTitle,
			borderColor: v,
		}));
		if (onBorderChange) onBorderChange(border);
	}

	const handleIconHtmlChange = (v: string) => {
		setNodeStyle((prevTitle) => ({
			...prevTitle,
			iconHtml: v,
		}));
		if (onIconHtmlChange) onIconHtmlChange(v);
	}

	const handleIconColorChange = (v: string) => {
		setNodeStyle((prevTitle) => ({
			...prevTitle,
			iconColor: v,
		}));
		if (onIconColorChange) onIconColorChange(v);
	}

	const handleIconBackgroundChange = (v: string) => {
		setNodeStyle((prevTitle) => ({
			...prevTitle,
			iconBackground: v,
		}));
		if (onIconBackgroundChange) onIconBackgroundChange(v);
	}



	return (
		<InputForm verticalMargin={24} paddingBottom={80}>
			<Input label={"Title"} value={nodeStyle.title} onChange={handleTitleChange}></Input>
			<Input label={"Description"} value={nodeStyle.description} onChange={handleDescriptionChange}></Input>
			<ColorPicker label={"Background Color"} value={nodeStyle.backgroundColor} onChange={handleBackgroundColorChange}></ColorPicker>
			<ColorPicker label={"Font Color"} value={nodeStyle.fontColor} onChange={handleFontColorChange}></ColorPicker>
			<ColorPicker label={"Selection Outline Color"} value={nodeStyle.borderColor} onChange={handleBorderColorChange}></ColorPicker>
			<IconSelector label={"Icon"} value={nodeStyle.iconHtml} onChange={handleIconHtmlChange}></IconSelector>
			<ColorPicker label={"Icon Color"} value={nodeStyle.iconColor} onChange={handleIconColorChange}></ColorPicker>
			<ColorPicker label={"Icon Background"} value={nodeStyle.iconBackground} onChange={handleIconBackgroundChange}></ColorPicker>
		</InputForm>
	)
}