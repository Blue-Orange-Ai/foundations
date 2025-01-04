import React from "react";

import './Loading.css'

interface Props {
	fontSize: string;
	color: string;
}

export const Loading: React.FC<Props> = ({fontSize, color}) => {

	const style: React.CSSProperties = {
		fontSize: fontSize,
		color: color
	}

	return (
		<div style={style}>
			<i className="ri-loader-4-line rotate-spinner"></i>
		</div>
	)
}