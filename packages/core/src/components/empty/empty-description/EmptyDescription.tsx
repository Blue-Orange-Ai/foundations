import React from "react";

import './EmptyDescription.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const EmptyDescription: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-empty-description" style={style}>
			{children}
		</div>
	)
}
