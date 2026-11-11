import React from "react";

import './TraceLine.css'
import {TraceStatus} from "../trace/TraceContext";

interface Props {
	children?: React.ReactNode;
	status?: TraceStatus;
	classes?: string;
	style?: React.CSSProperties;
}

const statusClassName: Record<TraceStatus, string> = {
	[TraceStatus.DONE]: "",
	[TraceStatus.RUNNING]: "blue-orange-trace-line-running",
	[TraceStatus.ERROR]: "blue-orange-trace-line-error",
	[TraceStatus.PENDING]: "blue-orange-trace-line-pending",
};

/**
 * One step: an icon, a title and an optional description. It is a span, so on
 * its own it reads as plain text and is not a tab stop — wrap it in a
 * TraceCollapsibleTrigger, a link or a button to make it do something.
 */
export const TraceLine: React.FC<Props> = ({children, status = TraceStatus.DONE, classes = "", style = {}}) => {

	const generateClassName = () => {
		var className = "blue-orange-trace-line";
		if (statusClassName[status]) {
			className += " " + statusClassName[status];
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	return (
		<span className={generateClassName()} data-status={status.toLowerCase()} style={style}>
			{children}
		</span>
	)
}
