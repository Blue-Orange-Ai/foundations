import React, {useEffect, useState} from "react";

import './TraceCollapsibleContent.css'
import {useTraceCollapsible} from "../trace/TraceContext";

interface Props {
	children?: React.ReactNode;
	/** Keeps the detail rendered while the row is closed, so nested state survives a close. */
	keepMounted?: boolean;
	/** Put on the inner block that holds the detail, under the rail. */
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * The detail a TraceCollapsible shows when it is open, hung off a rail that
 * runs down from the line's icon. Its height animates open and shut.
 */
export const TraceCollapsibleContent: React.FC<Props> = ({children, keepMounted = false, classes = "", style = {}}) => {

	const collapsible = useTraceCollapsible();

	const open = collapsible?.open ?? true;

	// The children stay rendered until the close animation has finished, so the
	// panel shrinks with its content in it rather than collapsing empty.
	const [present, setPresent] = useState<boolean>(open);

	useEffect(() => {
		if (open) {
			setPresent(true);
		}
	}, [open]);

	const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget && !open) {
			setPresent(false);
		}
	}

	const rendered = open || present || keepMounted;

	return (
		<div
			id={collapsible?.contentId}
			className={"blue-orange-trace-collapsible-content" + (open ? " blue-orange-trace-collapsible-content-open" : "")}
			data-state={open ? "open" : "closed"}
			aria-hidden={!open}
			onTransitionEnd={handleTransitionEnd}>
			<div className="blue-orange-trace-collapsible-content-clip">
				<div className={"blue-orange-trace-collapsible-content-inner" + (classes ? " " + classes : "")} style={style}>
					{rendered && children}
				</div>
			</div>
		</div>
	)
}
