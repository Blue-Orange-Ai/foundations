import React from "react";

import './EmptyHeader.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const EmptyHeader: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-empty-header" style={style}>
			{children}
		</div>
	)
}
