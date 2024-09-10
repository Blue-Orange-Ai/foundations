import React, {useState} from "react";

import './SideBarBodyItemLink.css'

interface Props {
	label: string,
	href: string,
	active: boolean,
	focused: boolean,
	hoverEffects?: boolean,
	defaultStyle?: React.CSSProperties,
	activeStyle?: React.CSSProperties,
	focusedStyle?: React.CSSProperties,
	icon?: React.ReactNode,
	style?: React.CSSProperties,
	badge?: React.ReactNode;
	rightItems?: React.ReactNode;
	hoverItems?: React.ReactNode;
	onClick?: () => void;
}

export const SideBarBodyItemLink: React.FC<Props> = ({
													 label,
													 href,
													 active,
													 focused,
													 hoverEffects,
													 style,
													 defaultStyle,
													 activeStyle,
													 focusedStyle,
													 icon,
													 badge,
													 rightItems,
													 hoverItems,
													 onClick}) => {

	const [isHovered, setIsHovered] = useState(false);

	const itemClicked = () => {
		if (onClick) {
			onClick()
		}
	}

	const mouseEntered = () => {
		setIsHovered(true);
	}

	const mouseLeave = () => {
		setIsHovered(false);
	}

	return (
		<a
			href={href}
			style={active ? activeStyle : style}
			onMouseEnter={mouseEntered}
			onMouseLeave={mouseLeave}
			className={active ? "blue-orange-sidebar-body-item-link blue-orange-sidebar-body-item-link-active" : "blue-orange-sidebar-body-item-link"}>
			<div
				className="blue-orange-sidebar-body-item-link-left"
				style={focused ? focusedStyle : defaultStyle}
				onClick={itemClicked}>
				{icon && <div className="blue-orange-sidebar-body-item-link-icon">{icon}</div>}
				<div className="blue-orange-sidebar-body-item-link-label no-select">{label}</div>
			</div>
			<div className="blue-orange-sidebar-body-item-link-right">
				{badge && (!hoverEffects || !isHovered) && <>{badge}</>}
				{hoverItems && (hoverEffects && isHovered) && <>{hoverItems}</>}
				{rightItems && (!hoverEffects || !isHovered) && <>{rightItems}</>}
			</div>
		</a>
	)
}