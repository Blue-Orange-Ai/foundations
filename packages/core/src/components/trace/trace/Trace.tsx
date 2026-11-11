import React from "react";

import './Trace.css'

interface Props {
	children?: React.ReactNode;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * A list of steps — the tool calls, searches, edits and thoughts behind an
 * agent's reply. Each row is a TraceLine, either on its own or wrapped in the
 * thing that makes it do something: a TraceCollapsible, a link, or a button
 * that opens a modal or drawer. The list also styles any link or button that
 * wraps a line directly, so those rows line up and share a focus ring.
 */
export const Trace: React.FC<Props> = ({children, classes = "", style = {}}) => {

	return (
		<div className={"blue-orange-trace" + (classes ? " " + classes : "")} style={style}>
			{children}
		</div>
	)
}
