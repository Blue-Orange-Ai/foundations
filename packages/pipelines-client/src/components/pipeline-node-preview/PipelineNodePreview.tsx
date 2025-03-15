import React, {useRef, useState} from "react";

import './PipelineNodePreview.css'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {RenderHtml} from "@blue-orange-ai/foundations-core";

interface Props {
	iconHtml: string,
	title: string,
	description: string
	backgroundColor?: string,
	borderRadius?: string,
	height?: string,
	width?: string,
	border?: string,
}

export const PipelineNodePreview: React.FC<Props> = ({
														 iconHtml,
														 title,
														 description,
														 backgroundColor="#FFFFFF",
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

	return (
		<div className="blue-orange-pipeline-editor-node" style={style}>
			<div className="blue-orange-pipeline-editor-node-icon">
				<RenderHtml html={iconHtml}></RenderHtml>
			</div>
			<div className="blue-orange-pipeline-editor-node-body">
				<div className="blue-orange-pipeline-editor-node-body-title">{title}</div>
				<div className="blue-orange-pipeline-editor-node-body-description">{description}</div>

			</div>
		</div>
	)
}