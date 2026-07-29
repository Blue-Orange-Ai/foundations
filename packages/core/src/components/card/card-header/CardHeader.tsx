import React from "react";

import './CardHeader.css'

interface Props {
	children: React.ReactNode;
	/** Draws a separator underneath the header. */
	separated?: boolean;
	style?: React.CSSProperties;
}

/**
 * The top section of a card. A CardAction placed inside is pulled over to the
 * right hand side, everything else stacks down the left.
 */
export const CardHeader: React.FC<Props> = ({children, separated=false, style={}}) => {

	const className = separated
		? "blue-orange-card-header blue-orange-card-header-separated"
		: "blue-orange-card-header";

	return (
		<div className={className} style={style}>
			{children}
		</div>
	)
}
