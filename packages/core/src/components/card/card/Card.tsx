import React from "react";

import './Card.css'

interface Props {
	children: React.ReactNode;
	classes?: string;
	onClick?: () => void;
	style?: React.CSSProperties;
}

/**
 * The container of the card family. Lay a card out by nesting a CardHeader,
 * CardContent and CardFooter inside it — each section is optional.
 */
export const Card: React.FC<Props> = ({children, classes="", onClick, style={}}) => {

	const generateClassName = () => {
		var className = "blue-orange-card";
		if (onClick) {
			className += " blue-orange-card-clickable";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	return (
		<div className={generateClassName()} onClick={onClick} style={style}>
			{children}
		</div>
	)
}
