import React, {useEffect, useState} from "react";

import './Drawer.css'

export enum DrawerPosition {
	LEFT,
	RIGHT,
	TOP,
	BOTTOM
}

interface Props {
	children: React.ReactNode;
	position?: DrawerPosition,
	width?: number;
	height?: number;
}

export const Drawer: React.FC<Props> = ({children, position = DrawerPosition.TOP, height=375, width=375}) => {

	const [animate, setAnimate] = useState(false);

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

	useEffect(() => {
		setAnimate(true);
	}, []);

	return (
		<div className="blue-orange-drawer-window" style={generateDrawerStyle()}>
			<div className="blue-orange-drawer-backdrop"></div>
			<div className="blue-orange-drawer-content">
				{position == DrawerPosition.RIGHT && <div className={animate ? "blue-orange-drawer-card-right blue-orange-drawer-card-enter" : "blue-orange-drawer-card-right"} style={{width: width + "px"}}>{children}</div>}
				{position == DrawerPosition.LEFT && <div className={animate ? "blue-orange-drawer-card-left blue-orange-drawer-card-enter" : "blue-orange-drawer-card-left"} style={{width: width + "px"}}>{children}</div>}
				{position == DrawerPosition.TOP && <div className={animate ? "blue-orange-drawer-card-top blue-orange-drawer-card-enter" : "blue-orange-drawer-card-top"} style={{height: width + "px"}}>{children}</div>}
				{position == DrawerPosition.BOTTOM && <div className={animate ? "blue-orange-drawer-card-bottom blue-orange-drawer-card-enter" : "blue-orange-drawer-card-bottom"} style={{height: width + "px"}}>{children}</div>}
			</div>
		</div>
	)
}