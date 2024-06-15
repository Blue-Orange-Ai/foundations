import React from "react";

import './Modal.css'

interface Props {
	children: React.ReactNode;
	minWidth?: number;
	minHeight?: number;
}

export const Modal: React.FC<Props> = ({children, minWidth=375, minHeight=0}) => {

	return (
		<div className="blue-orange-modal-window">
			<div className="blue-orange-modal-backdrop"></div>
			<div className="blue-orange-modal-content">
				<div className="blue-orange-modal-card shadow" style={{minWidth: minWidth, minHeight: minHeight}}>{children}</div>
			</div>
		</div>
	)
}