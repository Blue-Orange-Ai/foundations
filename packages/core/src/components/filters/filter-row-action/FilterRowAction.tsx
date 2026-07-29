import React from "react";

import './FilterRowAction.css'
import {SimpleTooltip} from "../../tooltips/simple-tooltip/SimpleTooltip";

interface Props {
	/** A remixicon class. */
	icon: string;
	/** Shown as a tooltip and read out as the accessible name. */
	label?: string;
	disabled?: boolean;
	onClick?: () => void;
	style?: React.CSSProperties;
}

/**
 * An icon button at the end of a FilterRow — removing the filter, opening a
 * menu, anything that acts on the whole row.
 */
export const FilterRowAction: React.FC<Props> = ({icon, label, disabled = false, onClick, style = {}}) => {

	const handleClick = () => {
		if (!disabled && onClick) {
			onClick();
		}
	}

	const content = (
		<div
			className={disabled
				? "blue-orange-filter-row-action blue-orange-filter-row-action-disabled"
				: "blue-orange-filter-row-action"}
			role="button"
			aria-label={label}
			aria-disabled={disabled}
			tabIndex={disabled ? -1 : 0}
			onClick={handleClick}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					handleClick();
				}
			}}
			style={style}>
			<i className={icon}></i>
		</div>
	);

	if (label) {
		return (
			<SimpleTooltip label={label}>
				{content}
			</SimpleTooltip>
		)
	}

	return content;
}
