import React from "react";

import './TimelineContent.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Groups the body of an event underneath its title — supporting text, badges,
 * a card, whatever the event needs.
 */
export const TimelineContent: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-timeline-content" style={style}>
			{children}
		</div>
	)
}
