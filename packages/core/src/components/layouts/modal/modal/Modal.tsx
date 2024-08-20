import React from "react";

import './Modal.css'

interface Props {
	children: React.ReactNode;
	minWidth?: number;
	minHeight?: number;
	onClose?: () => void;
}

export const Modal: React.FC<Props> = ({children, minWidth=375, minHeight=0, onClose}) => {

	const handleBackdropClicked = () => {
		if (onClose) {
			onClose()
		}
	}

	return (
		<div className="blue-orange-modal-window">
			<div className="blue-orange-modal-backdrop" onClick={handleBackdropClicked}></div>
			<div className="blue-orange-modal-content">
				<div className="blue-orange-modal-card shadow" style={{minWidth: minWidth, minHeight: minHeight}}>{children}</div>
			</div>
		</div>
	)
}