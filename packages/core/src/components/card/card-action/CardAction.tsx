import React from "react";

import './CardAction.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Sits in the top right of a CardHeader — typically a button or a menu.
 */
export const CardAction: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-card-action" style={style}>
			{children}
		</div>
	)
}
