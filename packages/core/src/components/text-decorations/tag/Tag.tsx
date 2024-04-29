import React, {ReactNode} from "react";

import './Tag.css'

interface Props {
	children: ReactNode;
	backgroundColor?: string;
	textColor?: string
}

export const Tag: React.FC<Props> = ({children, backgroundColor="#18181b", textColor="white"}) => {

	const badgeStyle: React.CSSProperties = {
		backgroundColor: backgroundColor,
		color: textColor
	}

	return (
		<div className="blue-orange-tag" style={badgeStyle}>{children}</div>
	)
}