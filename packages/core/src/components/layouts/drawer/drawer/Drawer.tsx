import React from "react";

import './Drawer.css'
import {useOverlayTransition} from "../../utils/useOverlayTransition";

export enum DrawerPosition {
	LEFT,
	RIGHT,
	TOP,
	BOTTOM
}

interface Props {
	children: React.ReactNode;
	open?: boolean;
	position?: DrawerPosition,
	height?: string;
	width?: string;
	onClose?: () => void;
}

export const Drawer: React.FC<Props> = ({children, open, position = DrawerPosition.TOP, height="375px", width="375px", onClose}) => {

	const {mounted, visible} = useOverlayTransition(open);

	const generateDrawerStyle = (): React.CSSProperties => {
		if (position == DrawerPosition.RIGHT) {
			return {
				justifyContent: "flex-end"
			}
		} else if (position == DrawerPosition.LEFT) {
			return {
				justifyContent: "flex-start"
			}
		} else if (position == DrawerPosition.TOP) {
			return {
				flexDirection: "column",
				justifyContent: "flex-start"
			}
		} else if (position == DrawerPosition.BOTTOM) {
			return {
				flexDirection: "column",
				justifyContent: "flex-end"
			}
		}
		return {}
	}

	const handleBackdropClicked = () => {
		if (onClose) {
			onClose()
		}
	}

	const cardClass = (base: string): string => visible ? base + " blue-orange-drawer-card-enter" : base;

	if (!mounted) {
		return null;
	}

	return (
		<div className={visible ? "blue-orange-drawer-window blue-orange-drawer-window-open" : "blue-orange-drawer-window"} style={generateDrawerStyle()}>
			<div className="blue-orange-drawer-backdrop" onClick={handleBackdropClicked}></div>
			<div className="blue-orange-drawer-content">
				{position == DrawerPosition.RIGHT && <div className={cardClass("blue-orange-drawer-card-right")} style={{width: width}}>{children}</div>}
				{position == DrawerPosition.LEFT && <div className={cardClass("blue-orange-drawer-card-left")} style={{width: width}}>{children}</div>}
				{position == DrawerPosition.TOP && <div className={cardClass("blue-orange-drawer-card-top")} style={{height: height}}>{children}</div>}
				{position == DrawerPosition.BOTTOM && <div className={cardClass("blue-orange-drawer-card-bottom")} style={{height: height}}>{children}</div>}
			</div>
		</div>
	)
}