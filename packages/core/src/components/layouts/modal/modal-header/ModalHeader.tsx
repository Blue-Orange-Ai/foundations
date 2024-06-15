import React from "react";

import './ModalHeader.css'
import {ButtonIcon} from "../../../buttons/button-icon/ButtonIcon";

interface Props {
	label: string,
	onClose?: () => {};
}

export const ModalHeader: React.FC<Props> = ({label, onClose}) => {

	const closeClicked = () => {
		if (onClose) {
			onClose();
		}
	}

	return (
		<div className="blue-orange-modal-header">
			<div className="blue-orange-modal-header-label">{label}</div>
			<div className="blue-orange-modal-header-close-btn">
				<ButtonIcon icon={"ri-close-line"} style={{backgroundColor: "transparent", border: "0px solid transparent"}} onClick={closeClicked}></ButtonIcon>
			</div>
		</div>
	)
}