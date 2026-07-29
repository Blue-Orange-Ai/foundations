import React from "react";

import './CardTitle.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const CardTitle: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-card-title" style={style}>
			{children}
		</div>
	)
}
