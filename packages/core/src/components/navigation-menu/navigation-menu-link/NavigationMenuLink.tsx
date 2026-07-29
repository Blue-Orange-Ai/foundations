import React from "react";

import './NavigationMenuLink.css'

interface Props {
	/** The bold first line. */
	label?: string;
	/** The muted second line. */
	description?: string;
	/** A remixicon class shown before the text. */
	icon?: string;
	href?: string;
	active?: boolean;
	onClick?: () => void;
	/** Replaces the label / description pair entirely. */
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * A row inside a NavigationMenu panel.
 */
export const NavigationMenuLink: React.FC<Props> = ({
														label,
														description,
														icon,
														href,
														active = false,
														onClick,
														children,
														style = {}}) => {

	const className = active
		? "blue-orange-navigation-menu-link blue-orange-navigation-menu-link-active"
		: "blue-orange-navigation-menu-link";

	const content = (
		<>
			{icon && <i className={icon + " blue-orange-navigation-menu-link-icon"}></i>}
			<div className="blue-orange-navigation-menu-link-text">
				{children ?? (
					<>
						{label && <div className="blue-orange-navigation-menu-link-label">{label}</div>}
						{description && <div className="blue-orange-navigation-menu-link-description">{description}</div>}
					</>
				)}
			</div>
		</>
	);

	if (href) {
		return (
			<a className={className} href={href} onClick={onClick} style={style}>
				{content}
			</a>
		)
	}

	return (
		<div
			className={className}
			role="link"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
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
