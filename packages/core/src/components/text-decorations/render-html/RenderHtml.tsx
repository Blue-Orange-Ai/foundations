import React from "react";

import './RenderHtml.css'

interface Props {
	html: string;
}

export const RenderHtml: React.FC<Props> = ({html}) => {

	return (
		<div
			className="blue-orange-render-html"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}