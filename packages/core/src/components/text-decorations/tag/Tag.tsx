import React, {ReactNode} from "react";

import './Tag.css'

interface Props {
	children: ReactNode;
	backgroundColor?: string;
	textColor?: string;
	round?: boolean;
	fill?: boolean;
}

export const Tag: React.FC<Props> = ({children, backgroundColor="#18181b", textColor="white", round=false, fill=false}) => {

	const badgeStyle: React.CSSProperties = {
		backgroundColor: backgroundColor,
		color: textColor
	}

	const classes = ["blue-orange-tag"];
	if (round) {
		classes.push("blue-orange-tag-round");
	}
	if (fill) {
		classes.push("blue-orange-tag-fill");
	}

	return (
		<div className={classes.join(" ")} style={badgeStyle}>{children}</div>
	)
}
