import React from "react";

import './CardContent.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const CardContent: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-card-content" style={style}>
			{children}
		</div>
	)
}
