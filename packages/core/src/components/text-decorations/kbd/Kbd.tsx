import React from "react";

import './Kbd.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Renders a single keyboard key. Group several together with KbdGroup to show
 * a shortcut such as ⌘ + K.
 */
export const Kbd: React.FC<Props> = ({children, style={}}) => {

	return (
		<kbd className="blue-orange-kbd no-select" style={style}>{children}</kbd>
	)
}
