import React, {useCallback, useRef, useState} from "react";

import './CommandGroup.css'
import {CommandGroupContext, CommandGroupContextValue} from "../command/CommandContext";

interface Props {
	children: React.ReactNode;
	/** Label rendered above the items. */
	heading?: string;
	style?: React.CSSProperties;
}

/**
 * A labelled section of a command list. It hides itself once the search has
 * filtered every one of its items out.
 */
export const CommandGroup: React.FC<Props> = ({children, heading, style={}}) => {

	// Which of this group's items survived the search. Held in a ref and
	// mirrored into state so reporting a change never re-renders the item.
	const visibilityRef = useRef<Map<string, boolean>>(new Map());

	const [visibleCount, setVisibleCount] = useState(0);

	const recount = useCallback(() => {
		var count = 0;
		visibilityRef.current.forEach(visible => {
			if (visible) {
				count++;
			}
		});
		setVisibleCount(count);
	}, []);

	// Stable identities — the items report through these from inside an effect.
	const registerItemVisibility = useCallback((id: string, visible: boolean) => {
		visibilityRef.current.set(id, visible);
		recount();
	}, [recount]);

	const unregisterItem = useCallback((id: string) => {
		if (visibilityRef.current.delete(id)) {
			recount();
		}
	}, [recount]);

	const contextValue: CommandGroupContextValue = {
		registerItemVisibility: registerItemVisibility,
		unregisterItem: unregisterItem
	};

	// hidden rather than unmounted so the items stay registered with the palette
	const hidden = visibilityRef.current.size > 0 && visibleCount === 0;

	return (
		<CommandGroupContext.Provider value={contextValue}>
			<div
				className={hidden ? "blue-orange-command-group blue-orange-command-group-hidden" : "blue-orange-command-group"}
				role="group"
				aria-label={heading}
				style={style}>
				{heading && <div className="blue-orange-command-group-heading no-select">{heading}</div>}
				{children}
			</div>
		</CommandGroupContext.Provider>
	)
}
