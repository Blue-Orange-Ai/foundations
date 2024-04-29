import React, {ReactNode} from "react";

import './Badge.css'

interface Props {
	children: ReactNode;
	backgroundColor?: string;
	textColor?: string
}

export const Badge: React.FC<Props> = ({children, backgroundColor="#18181b", textColor="white"}) => {

	const badgeStyle: React.CSSProperties = {
		backgroundColor: backgroundColor,
		color: textColor
	}

	return (
		<div className="blue-orange-badge" style={badgeStyle}>{children}</div>
	)
}