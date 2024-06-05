import React, {useState} from "react";

import './SideBarBodyItem.css'

interface Props {
	label: string,
	active: boolean,
	focused: boolean,
	hoverEffects?: boolean,
	defaultStyle?: React.CSSProperties,
	activeStyle?: React.CSSProperties,
	focusedStyle?: React.CSSProperties,
	icon?: React.ReactNode,
	style?: React.CSSProperties,
	badge?: React.ReactNode;
	hoverItems?: React.ReactNode;
	onClick?: () => void;
}

export const SideBarBodyItem: React.FC<Props> = ({
													 label,
													 active,
													 focused,
													 hoverEffects,
													 style,
													 defaultStyle,
													 activeStyle,
													 focusedStyle,
													 icon,
													 badge,
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
		<div
			style={active ? activeStyle : style}
			onMouseEnter={mouseEntered}
			onMouseLeave={mouseLeave}
			className="blue-orange-sidebar-body-item">
			<div
				className="blue-orange-sidebar-body-item-left"
				style={focused ? focusedStyle : defaultStyle}
				onClick={itemClicked}>
				{icon && <div className="blue-orange-sidebar-body-item-icon">{icon}</div>}
				<div className="blue-orange-sidebar-body-item-label no-select">{label}</div>
			</div>
			{badge && (hoverEffects && !isHovered) && <>{badge}</>}
			{hoverItems && (hoverEffects && isHovered) && <>{hoverItems}</>}
		</div>
	)
}