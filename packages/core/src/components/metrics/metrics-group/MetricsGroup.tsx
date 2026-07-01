import React from "react";

import './MetricsGroup.css'


interface Props {
	children: React.ReactNode;
	gap?: number;
	style?: React.CSSProperties;
}

export const MetricsGroup: React.FC<Props> = ({children, gap = 0, style = {}}) => {

	const joined = !gap;

	const groupStyle: React.CSSProperties = {
		gap: gap ? `${gap}px` : undefined,
		...style
	}

	return (
		<div className={"blue-orange-metrics-group" + (joined ? " blue-orange-metrics-group-joined" : "")} style={groupStyle}>
			{children}
		</div>
	)
}
