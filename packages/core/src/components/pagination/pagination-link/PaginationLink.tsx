import React from "react";

import './PaginationLink.css'

interface Props {
	children?: React.ReactNode;
	/** Marks the link as the page currently being viewed. */
	active?: boolean;
	disabled?: boolean;
	/** A remixicon class rendered before the label. */
	icon?: string;
	/** A remixicon class rendered after the label. */
	iconRight?: string;
	href?: string;
	ariaLabel?: string;
	onClick?: () => void;
	style?: React.CSSProperties;
}

/**
 * A single clickable page control. Used by Pagination for its generated items
 * and exported so a custom pagination row can be composed by hand.
 */
export const PaginationLink: React.FC<Props> = ({
													children,
													active = false,
													disabled = false,
													icon,
													iconRight,
													href,
													ariaLabel,
													onClick,
													style = {}}) => {

	const generateClassName = () => {
		var className = "blue-orange-pagination-link no-select";
		if (active) {
			className += " blue-orange-pagination-link-active";
		}
		if (disabled) {
			className += " blue-orange-pagination-link-disabled";
		}
		return className;
	}

	const handleClick = (event: React.MouseEvent) => {
		if (disabled) {
			event.preventDefault();
			return;
		}
		if (onClick) {
			if (!href) {
				event.preventDefault();
			}
			onClick();
		}
	}

	const content = (
		<>
			{icon && <i className={icon}></i>}
			{children !== undefined && children !== null && <span>{children}</span>}
			{iconRight && <i className={iconRight}></i>}
		</>
	);

	if (href) {
		return (
			<a
				className={generateClassName()}
				href={href}
				aria-label={ariaLabel}
				aria-current={active ? "page" : undefined}
				aria-disabled={disabled}
				onClick={handleClick}
				style={style}>
				{content}
			</a>
		)
	}

	return (
		<div
			className={generateClassName()}
			role="button"
			tabIndex={disabled ? -1 : 0}
			aria-label={ariaLabel}
			aria-current={active ? "page" : undefined}
			aria-disabled={disabled}
			onClick={handleClick}
			onKeyDown={(event) => {
				if (!disabled && (event.key === "Enter" || event.key === " ")) {
					event.preventDefault();
					if (onClick) {
						onClick();
					}
				}
			}}
			style={style}>
			{content}
		</div>
	)
}
