import React from "react";

import './CommandList.css'

interface Props {
	children: React.ReactNode;
	maxHeight?: number;
	style?: React.CSSProperties;
}

/**
 * The scrollable body of a command palette.
 */
export const CommandList: React.FC<Props> = ({children, maxHeight=320, style={}}) => {

	const listStyle: React.CSSProperties = {
		maxHeight: maxHeight + "px",
		...style
	};

	return (
		<div className="blue-orange-command-list" role="listbox" style={listStyle}>
			{children}
		</div>
	)
}
