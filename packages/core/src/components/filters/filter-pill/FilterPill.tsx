import React from "react";

import './FilterPill.css'

interface Props {
	/** What the pill reads. */
	label: string;
	/** The tally shown inside the pill — a 0 still shows, an omitted count does not. */
	count?: number | string;
	/** A remixicon class rendered before the label. */
	icon?: string;
	/** Marks this pill as the one the list is filtered by. */
	active?: boolean;
	/** Rounds the pill into a stadium instead of the default 4px square corners. */
	round?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * One choice in a FilterPills set — the label of a filter with the number of
 * rows behind it. The selected pill takes the same inverse fill a selected
 * toggle button does, so a filter set reads as a set of choices rather than as
 * a row of buttons to press.
 *
 * Corners match badges and tags at 4px by default; `round` gives back the
 * stadium shape for sets that want it.
 */
export const FilterPill: React.FC<Props> = ({
												label,
												count,
												icon,
												active = false,
												round = false,
												disabled = false,
												onClick,
												classes = "",
												style = {}}) => {

	const generateClassName = () => {
		var className = "blue-orange-filter-pill";
		if (active) {
			className += " blue-orange-filter-pill-active";
		}
		if (round) {
			className += " blue-orange-filter-pill-round";
		}
		if (disabled) {
			className += " blue-orange-filter-pill-disabled";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	return (
		<button
			type="button"
			role="tab"
			aria-selected={active}
			disabled={disabled}
			/* Roving tab order — the set is one stop and the arrow keys move inside it. */
			tabIndex={active ? 0 : -1}
			className={generateClassName()}
			onClick={() => {
				if (!disabled && onClick) {
					onClick();
				}
			}}
			style={style}>
			{icon && <i className={icon + " blue-orange-filter-pill-icon"}></i>}
			<span className="blue-orange-filter-pill-label">{label}</span>
			{count !== undefined && <span className="blue-orange-filter-pill-count">{count}</span>}
		</button>
	)
}
