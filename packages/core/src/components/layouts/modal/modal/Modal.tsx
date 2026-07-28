import React from "react";

import './Modal.css'
import {useOverlayTransition} from "../../utils/useOverlayTransition";

interface Props {
	children: React.ReactNode;
	open?: boolean;
	width?: number,
	minWidth?: number;
	minHeight?: number;
	onClose?: () => void;
}

export const Modal: React.FC<Props> = ({children, open, width=375, minWidth=375, minHeight=0, onClose}) => {

	const {mounted, visible} = useOverlayTransition(open);

	const handleBackdropClicked = () => {
		if (onClose) {
			onClose()
		}
	}

	if (!mounted) {
		return null;
	}

	return (
		<div className={visible ? "blue-orange-modal-window blue-orange-modal-window-open" : "blue-orange-modal-window"}>
			<div className="blue-orange-modal-backdrop" onClick={handleBackdropClicked}></div>
			<div className="blue-orange-modal-content">
				<div className="blue-orange-modal-card shadow" style={{width: width + "px", minWidth: minWidth + "px", minHeight: minHeight + "px"}}>{children}</div>
			</div>
		</div>
	)
}
