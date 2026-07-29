import React from "react";

import './FilterRow.css'

export enum FilterRowSize {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM"
}

interface Props {
	children: React.ReactNode;
	size?: FilterRowSize;
	/** Fills the width of the parent instead of hugging its segments. */
	fullWidth?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * The segmented control a filter is built from — one bordered row split into
 * a field, an operator and a value, joined by hairlines.
 *
 * Any input dropped into a segment loses its own border and background so the
 * row reads as a single control rather than a line of separate fields.
 */
export const FilterRow: React.FC<Props> = ({
											   children,
											   size = FilterRowSize.MEDIUM,
											   fullWidth = false,
											   classes = "",
											   style = {}}) => {

	const generateClassName = () => {
		var className = "blue-orange-filter-row";
		if (size === FilterRowSize.SMALL) {
			className += " blue-orange-filter-row-sm";
		}
		if (fullWidth) {
			className += " blue-orange-filter-row-full-width";
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
