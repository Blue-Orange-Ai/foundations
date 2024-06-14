import React, {useState} from "react";

import './SideBarBodyLabel.css'

interface Props {
	label: string,
	icon?: React.ReactNode,
	style?: React.CSSProperties,
	badge?: React.ReactNode;
	hoverEffects?: boolean,
	rightItems?: React.ReactNode;
	hoverItems?: React.ReactNode;
	onClick?: () => void;
}

export const SideBarBodyLabel: React.FC<Props> = ({
													  label,
													  icon,
													  style,
													  badge,
													  hoverEffects,
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
		<div
			style={style}
			onMouseEnter={mouseEntered}
			onMouseLeave={mouseLeave}
			className="blue-orange-sidebar-body-label">
			<div
				className="blue-orange-sidebar-body-label-left"
				onClick={itemClicked}>
				{icon && <div className="blue-orange-sidebar-body-label-icon">{icon}</div>}
				<div className="blue-orange-sidebar-body-label-text no-select">{label}</div>
			</div>
			<div className="blue-orange-sidebar-body-label-right">
				{badge && (!hoverEffects || !isHovered) && <>{badge}</>}
				{hoverItems && (hoverEffects && isHovered) && <>{hoverItems}</>}
				{rightItems && (!hoverEffects || !isHovered) && <>{rightItems}</>}
			</div>
		</div>
	)
}