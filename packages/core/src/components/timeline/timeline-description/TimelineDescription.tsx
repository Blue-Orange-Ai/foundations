import React from "react";

import './TimelineDescription.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const TimelineDescription: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-timeline-description" style={style}>
			{children}
		</div>
	)
}
