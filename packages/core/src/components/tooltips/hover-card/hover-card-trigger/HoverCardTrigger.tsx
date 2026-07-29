import React from "react";

import './HoverCardTrigger.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * What the pointer has to rest on for the card to open.
 */
export const HoverCardTrigger: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-hover-card-trigger" tabIndex={0} style={style}>
			{children}
		</div>
	)
}
