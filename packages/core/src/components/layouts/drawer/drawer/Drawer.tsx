import React from "react";
import {createPortal} from "react-dom";

import './Drawer.css'
import {useOverlayTransition} from "../../utils/useOverlayTransition";
import {useOverlayTheme} from "../../utils/useOverlayTheme";

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
	/** Where the drawer is portalled to. Defaults to the document body. */
	container?: HTMLElement | null;
	onClose?: () => void;
}

export const Drawer: React.FC<Props> = ({children, open, position = DrawerPosition.TOP, height="375px", width="375px", container, onClose}) => {

	const {mounted, visible} = useOverlayTransition(open);
	const {anchorRef, themeClass} = useOverlayTheme(mounted);

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
			// stretched across the cross axis so the card takes its width from the window instead of 100vw
			return {
				flexDirection: "column",
				justifyContent: "flex-start",
				alignItems: "stretch"
			}
		} else if (position == DrawerPosition.BOTTOM) {
			return {
				flexDirection: "column",
				justifyContent: "flex-end",
				alignItems: "stretch"
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

	const windowClass = (visible ? "blue-orange-drawer-window blue-orange-drawer-window-open" : "blue-orange-drawer-window") + themeClass;

	if (!mounted || typeof document === "undefined") {
		return null;
	}

	// Portalled to the body so an ancestor with a transform, filter, will-change or contain cannot
	// become the containing block for the fixed window and trap it inside a scrolling panel.
	return (
		<>
			{/* stays behind in the caller's tree so the drawer can still read the theme it was written inside */}
			<span ref={anchorRef} style={{display: "none"}} aria-hidden="true"></span>
			{createPortal(
				<div className={windowClass} style={generateDrawerStyle()}>
					<div className="blue-orange-drawer-backdrop" onClick={handleBackdropClicked}></div>
					<div className="blue-orange-drawer-content">
						{position == DrawerPosition.RIGHT && <div className={cardClass("blue-orange-drawer-card-right")} style={{width: width}}>{children}</div>}
						{position == DrawerPosition.LEFT && <div className={cardClass("blue-orange-drawer-card-left")} style={{width: width}}>{children}</div>}
						{position == DrawerPosition.TOP && <div className={cardClass("blue-orange-drawer-card-top")} style={{height: height}}>{children}</div>}
						{position == DrawerPosition.BOTTOM && <div className={cardClass("blue-orange-drawer-card-bottom")} style={{height: height}}>{children}</div>}
					</div>
				</div>,
				container ?? document.body
			)}
		</>
	)
}