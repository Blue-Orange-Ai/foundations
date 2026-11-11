import React from "react";

import './TraceCollapsibleTrigger.css'
import {useTraceCollapsible} from "../trace/TraceContext";
import {TraceIcon} from "../trace-icon/TraceIcon";

interface Props {
	/** The TraceLine this trigger opens and closes. */
	children?: React.ReactNode;
	disabled?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * Turns the line inside it into a button that opens and closes its
 * TraceCollapsible. A chevron after the line turns to show which way it is.
 */
export const TraceCollapsibleTrigger: React.FC<Props> = ({children, disabled = false, classes = "", style = {}}) => {

	const collapsible = useTraceCollapsible();

	const open = collapsible?.open ?? false;

	const toggle = () => {
		if (collapsible) {
			collapsible.setOpen(!open);
		}
	}

	return (
		<button
			type="button"
			id={collapsible?.triggerId}
			className={"blue-orange-trace-collapsible-trigger" + (classes ? " " + classes : "")}
			aria-expanded={open}
			aria-controls={collapsible?.contentId}
			disabled={disabled}
			onClick={toggle}
			style={style}>
			{children}
			<TraceIcon icon="ri-arrow-right-s-line" classes="blue-orange-trace-collapsible-chevron"></TraceIcon>
		</button>
	)
}
