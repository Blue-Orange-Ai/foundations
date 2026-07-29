import React from "react";

import './Empty.css'

interface Props {
	children: React.ReactNode;
	/** Draws a dashed outline around the empty state. */
	bordered?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * The container of the empty state family. Nest an EmptyHeader (with an
 * EmptyMedia, EmptyTitle and EmptyDescription) and an EmptyContent inside it.
 */
export const Empty: React.FC<Props> = ({children, bordered=false, classes="", style={}}) => {

	const generateClassName = () => {
		var className = "blue-orange-empty";
		if (bordered) {
			className += " blue-orange-empty-bordered";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	return (
		<div className={generateClassName()} style={style}>
			{children}
		</div>
	)
}
