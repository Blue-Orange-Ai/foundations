import React, {useRef, useState} from "react";

import './PipelineNodePreview.css'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {RenderHtml} from "@blue-orange-ai/foundations-core";

interface Props {
	iconHtml: string,
	title: string,
	description: string
	backgroundColor?: string,
	fontColor?: string,
	iconColor?: string,
	iconBackground?: string,
	borderRadius?: string,
	height?: string | number,
	width?: string | number,
	border?: string,
}

export const PipelineNodePreview: React.FC<Props> = ({
														 iconHtml,
														 title,
														 description,
														 backgroundColor="#FFFFFF",
														 fontColor="#393939",
														 iconColor="#393939",
														 iconBackground="#e0e1e2",
														 borderRadius="4px",
														 height= "fit-height",
														 width= "fit-width",
														 border="2px solid dodgerblue"}) => {

	const style: React.CSSProperties = {
		backgroundColor: backgroundColor,
		borderRadius: borderRadius,
		height: height,
		width: width,
		border: border
	}

	const iconStyle: React.CSSProperties = {
		color: iconColor,
		backgroundColor: iconBackground
	}

	return (
		<div className="blue-orange-pipeline-editor-node" style={style}>
			<div className="blue-orange-pipeline-editor-node-icon" style={iconStyle}>
				<RenderHtml html={iconHtml}></RenderHtml>
			</div>
			<div className="blue-orange-pipeline-editor-node-body">
				<div className="blue-orange-pipeline-editor-node-body-title" style={{color: fontColor}}>{title}</div>
				<div className="blue-orange-pipeline-editor-node-body-description" style={{color: fontColor}}>{description}</div>

			</div>
		</div>
	)
}