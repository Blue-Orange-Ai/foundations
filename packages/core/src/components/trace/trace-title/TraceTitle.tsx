import React from "react";

import './TraceTitle.css'

interface Props {
	children?: React.ReactNode;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * What happened, as a sentence: "Edited trace.tsx", not "trace.tsx". It is the
 * line's accessible name, and it truncates when the row runs out of room.
 */
export const TraceTitle: React.FC<Props> = ({children, classes = "", style = {}}) => {

	return (
		<span className={"blue-orange-trace-title" + (classes ? " " + classes : "")} style={style}>
			{children}
		</span>
	)
}
