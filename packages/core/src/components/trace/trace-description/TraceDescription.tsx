import React from "react";

import './TraceDescription.css'

interface Props {
	children?: React.ReactNode;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * Secondary text after the title — a diff stat, a duration, a count. It never
 * truncates; the title gives way first.
 */
export const TraceDescription: React.FC<Props> = ({children, classes = "", style = {}}) => {

	return (
		<span className={"blue-orange-trace-description" + (classes ? " " + classes : "")} style={style}>
			{children}
		</span>
	)
}
