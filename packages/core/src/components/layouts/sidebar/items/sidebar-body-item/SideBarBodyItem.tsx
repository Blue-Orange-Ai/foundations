import React, {useRef, useState} from "react";

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
	rightItems?: React.ReactNode;
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
													 rightItems,
													 hoverItems,
													 onClick}) => {

	const rightSideRef = useRef<HTMLDivElement | null>(null);

	const isDescendantOf = (parent:HTMLElement | null, child:HTMLElement | null) =>{
		if (parent && child) {
			if (parent === child) {
				return child
			}
			try{
				var node = child.parentElement;
				while (node != null){
					if (node === parent){
						return node;
					}
					node = node.parentElement;
				}
				return null;
			} catch (e) {
				return null;
			}
		}
		return null;
	}

	const [isHovered, setIsHovered] = useState(false);

	const itemClicked = (ev: any) => {
		const target = ev.target as HTMLElement;
		if (onClick && !isDescendantOf(rightSideRef.current, target)) {
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
			onClick={itemClicked}
			className={active ? "blue-orange-sidebar-body-item blue-orange-sidebar-body-item-active" : "blue-orange-sidebar-body-item"}>
			<div
				className="blue-orange-sidebar-body-item-left"
				style={focused ? focusedStyle : defaultStyle}>
				{icon && <div className="blue-orange-sidebar-body-item-icon">{icon}</div>}
				<div className="blue-orange-sidebar-body-item-label no-select">{label}</div>
			</div>
			<div ref={rightSideRef} className="blue-orange-sidebar-body-item-right">
				{badge && (!hoverEffects || !isHovered) && <>{badge}</>}
				{hoverItems && (hoverEffects && isHovered) && <>{hoverItems}</>}
				{rightItems && (!hoverEffects || !isHovered) && <>{rightItems}</>}
			</div>
		</div>
	)
}