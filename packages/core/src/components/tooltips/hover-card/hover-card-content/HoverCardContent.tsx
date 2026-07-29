import React from "react";

import './HoverCardContent.css'

interface Props {
	children: React.ReactNode;
	width?: number;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * The card shown by a HoverCard.
 */
export const HoverCardContent: React.FC<Props> = ({children, width=280, classes="", style={}}) => {

	const contentStyle: React.CSSProperties = {
		width: width + "px",
		...style
	};

	return (
		<div className={"blue-orange-hover-card-content shadow" + (classes ? " " + classes : "")} style={contentStyle}>
			{children}
		</div>
	)
}
