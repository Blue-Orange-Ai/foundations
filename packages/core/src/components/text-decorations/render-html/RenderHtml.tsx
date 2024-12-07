import React from "react";

import './RenderHtml.css'

interface Props {
	html: string;
}

export const RenderHtml: React.FC<Props> = ({html}) => {

	return (
		<div
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}