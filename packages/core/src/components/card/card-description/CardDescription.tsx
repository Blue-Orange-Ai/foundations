import React from "react";

import './CardDescription.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const CardDescription: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-card-description" style={style}>
			{children}
		</div>
	)
}
