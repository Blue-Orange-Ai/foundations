import React from "react";

import './EmptyContent.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * The actions (or any other content) shown underneath the empty state header.
 */
export const EmptyContent: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-empty-content" style={style}>
			{children}
		</div>
	)
}
