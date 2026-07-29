import React from "react";

import './CardFooter.css'

interface Props {
	children: React.ReactNode;
	/** Draws a separator above the footer. */
	separated?: boolean;
	style?: React.CSSProperties;
}

export const CardFooter: React.FC<Props> = ({children, separated=false, style={}}) => {

	const className = separated
		? "blue-orange-card-footer blue-orange-card-footer-separated"
		: "blue-orange-card-footer";

	return (
		<div className={className} style={style}>
			{children}
		</div>
	)
}
