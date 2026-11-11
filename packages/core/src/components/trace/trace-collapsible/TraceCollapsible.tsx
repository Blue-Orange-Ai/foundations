import React, {useCallback, useId, useState} from "react";

import './TraceCollapsible.css'
import {TraceCollapsibleContext} from "../trace/TraceContext";

interface Props {
	children?: React.ReactNode;
	/** Where an uncontrolled row starts. Rows start closed. */
	defaultOpen?: boolean;
	/**
	 * Controls the row. Pair it with onOpenChange. To open a row while it streams
	 * and still let the reader's click win, pass `open ?? running`.
	 */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * A row that expands to show more detail. Put the TraceLine inside a
 * TraceCollapsibleTrigger and the detail in a TraceCollapsibleContent.
 */
export const TraceCollapsible: React.FC<Props> = ({
													  children,
													  defaultOpen = false,
													  open,
													  onOpenChange,
													  classes = "",
													  style = {}}) => {

	const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(defaultOpen);

	const controlled = open !== undefined;

	const isOpen = controlled ? open : uncontrolledOpen;

	const setOpen = useCallback((next: boolean) => {
		if (!controlled) {
			setUncontrolledOpen(next);
		}
		if (onOpenChange) {
			onOpenChange(next);
		}
	}, [controlled, onOpenChange]);

	const id = useId();

	return (
		<TraceCollapsibleContext.Provider
			value={{
				open: isOpen,
				setOpen: setOpen,
				contentId: id + "-content",
				triggerId: id + "-trigger"
			}}>
			<div
				className={"blue-orange-trace-collapsible" + (isOpen ? " blue-orange-trace-collapsible-open" : "") + (classes ? " " + classes : "")}
				data-state={isOpen ? "open" : "closed"}
				style={style}>
				{children}
			</div>
		</TraceCollapsibleContext.Provider>
	)
}
