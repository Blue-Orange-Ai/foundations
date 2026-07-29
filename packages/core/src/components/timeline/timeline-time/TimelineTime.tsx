import React from "react";

import './TimelineTime.css'

interface Props {
	children: React.ReactNode;
	/** A remixicon class shown before the timestamp. */
	icon?: string;
	/** Sets the machine readable value of the underlying time element. */
	dateTime?: string;
	style?: React.CSSProperties;
}

/**
 * The timestamp of an event. Renders a real time element so the date is
 * machine readable when `dateTime` is supplied.
 */
export const TimelineTime: React.FC<Props> = ({children, icon, dateTime, style={}}) => {

	return (
		<time className="blue-orange-timeline-time" dateTime={dateTime} style={style}>
			{icon && <i className={icon}></i>}
			<span>{children}</span>
		</time>
	)
}
