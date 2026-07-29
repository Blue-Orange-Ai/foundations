import React from "react";

import './EmptyTitle.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const EmptyTitle: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-empty-title" style={style}>
			{children}
		</div>
	)
}
