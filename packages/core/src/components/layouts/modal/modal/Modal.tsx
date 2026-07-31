import React from "react";
import {createPortal} from "react-dom";

import './Modal.css'
import {useOverlayTransition} from "../../utils/useOverlayTransition";
import {useOverlayTheme} from "../../utils/useOverlayTheme";

interface Props {
	children: React.ReactNode;
	open?: boolean;
	width?: number,
	minWidth?: number;
	minHeight?: number;
	/** Where the modal is portalled to. Defaults to the document body. */
	container?: HTMLElement | null;
	onClose?: () => void;
}

export const Modal: React.FC<Props> = ({children, open, width=375, minWidth=375, minHeight=0, container, onClose}) => {

	const {mounted, visible} = useOverlayTransition(open);
	const {anchorRef, themeClass} = useOverlayTheme(mounted);

	const handleBackdropClicked = () => {
		if (onClose) {
			onClose()
		}
	}

	const windowClass = (visible ? "blue-orange-modal-window blue-orange-modal-window-open" : "blue-orange-modal-window") + themeClass;

	if (!mounted || typeof document === "undefined") {
		return null;
	}

	// Portalled to the body so an ancestor with a transform, filter, will-change or contain cannot
	// become the containing block for the fixed window and trap it inside a scrolling panel.
	return (
		<>
			{/* stays behind in the caller's tree so the modal can still read the theme it was written inside */}
			<span ref={anchorRef} style={{display: "none"}} aria-hidden="true"></span>
			{createPortal(
				<div className={windowClass}>
					<div className="blue-orange-modal-backdrop" onClick={handleBackdropClicked}></div>
					<div className="blue-orange-modal-content">
						<div className="blue-orange-modal-card shadow" style={{width: width + "px", minWidth: minWidth + "px", minHeight: minHeight + "px"}}>{children}</div>
					</div>
				</div>,
				container ?? document.body
			)}
		</>
	)
}
