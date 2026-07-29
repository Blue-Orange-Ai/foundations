import React from "react";

import './Separator.css'

export enum SeparatorOrientation {
	HORIZONTAL = "HORIZONTAL",
	VERTICAL = "VERTICAL"
}

interface Props {
	orientation?: SeparatorOrientation;
	/** Optional label rendered in the middle of a horizontal separator. */
	children?: React.ReactNode;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * A thin dividing line. Horizontal separators fill the width of their parent,
 * vertical ones stretch to the height of a flex row.
 */
export const Separator: React.FC<Props> = ({
											   orientation = SeparatorOrientation.HORIZONTAL,
											   children,
											   classes = "",
											   style = {}}) => {

	const customClasses = classes ? " " + classes : "";

	if (orientation === SeparatorOrientation.VERTICAL) {
		return (
			<div
				role="separator"
				aria-orientation="vertical"
				className={"blue-orange-separator blue-orange-separator-vertical" + customClasses}
				style={style}></div>
		)
	}

	if (children) {
		return (
			<div
				role="separator"
				aria-orientation="horizontal"
				className={"blue-orange-separator-labelled" + customClasses}
				style={style}>
				<div className="blue-orange-separator blue-orange-separator-horizontal"></div>
				<div className="blue-orange-separator-label no-select">{children}</div>
				<div className="blue-orange-separator blue-orange-separator-horizontal"></div>
			</div>
		)
	}

	return (
		<div
			role="separator"
			aria-orientation="horizontal"
			className={"blue-orange-separator blue-orange-separator-horizontal" + customClasses}
			style={style}></div>
	)
}
