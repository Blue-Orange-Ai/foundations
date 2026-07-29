import React from "react";

import './CommandShortcut.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * The keyboard hint pushed to the right of a command item. Pass plain text, or
 * a Kbd / KbdGroup for the rendered keys.
 */
export const CommandShortcut: React.FC<Props> = ({children, style={}}) => {

	return (
		<span className="blue-orange-command-shortcut no-select" style={style}>
			{children}
		</span>
	)
}
