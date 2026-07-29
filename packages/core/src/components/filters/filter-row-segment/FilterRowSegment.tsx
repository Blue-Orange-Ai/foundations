import React from "react";

import './FilterRowSegment.css'

interface Props {
	children?: React.ReactNode;
	/** Convenience for a plain text segment. */
	label?: string;
	/** A remixicon class rendered before the label. */
	icon?: string;
	/** Reads as supporting text rather than as a control. */
	muted?: boolean;
	/** Holds a dropdown or an input — lights up on hover like a menu would. */
	control?: boolean;
	/** Takes whatever width is left over in the row. */
	grow?: boolean;
	/** Caps how wide the segment can get before its content is clipped. */
	maxWidth?: number;
	onClick?: () => void;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * One cell of a FilterRow — the field, the operator, the value. Put a Dropdown,
 * an Input or a DateInput inside and it loses its own border so the row reads
 * as a single control.
 */
export const FilterRowSegment: React.FC<Props> = ({
													  children,
													  label,
													  icon,
													  muted = false,
													  control = false,
													  grow = false,
													  maxWidth,
													  onClick,
													  classes = "",
													  style = {}}) => {

	const generateClassName = () => {
		var className = "blue-orange-filter-row-segment";
		if (muted) {
			className += " blue-orange-filter-row-segment-muted";
		}
		if (control) {
			className += " blue-orange-filter-row-segment-control";
		}
		if (grow) {
			className += " blue-orange-filter-row-segment-grow";
		}
		if (onClick) {
			className += " blue-orange-filter-row-segment-clickable";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	const segmentStyle: React.CSSProperties = {...style};

	if (maxWidth !== undefined) {
		segmentStyle.maxWidth = maxWidth + "px";
	}

	return (
		<div
			className={generateClassName()}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			onClick={onClick}
			onKeyDown={(event) => {
				if (onClick && (event.key === "Enter" || event.key === " ")) {
					event.preventDefault();
					onClick();
				}
			}}
			style={segmentStyle}>
			{icon && <i className={icon + " blue-orange-filter-row-segment-icon"}></i>}
			{label && <span className="blue-orange-filter-row-segment-label">{label}</span>}
			{children}
		</div>
	)
}
