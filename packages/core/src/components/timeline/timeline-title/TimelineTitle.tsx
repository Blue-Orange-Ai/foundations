import React from "react";

import './TimelineTitle.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const TimelineTitle: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-timeline-title" style={style}>
			{children}
		</div>
	)
}
