import React from "react";

import './DefaultBtnIcon.css';
import {IconPos} from "../../../interfaces/AppInterfaces";

interface Props {
	label: string;
	icon: string;
	iconPos: IconPos;
	onClick?: () => void;
	isDisabled?: boolean;
	isLoading?: boolean;
	style?: React.CSSProperties;
}

export const DefaultBtnIcon: React.FC<Props> = ({label, icon, iconPos, onClick, isDisabled = false, isLoading = false, style = {}}) => {

	const handleClick = () => {
		if (!isDisabled && !isLoading && onClick) {
			onClick();
		}
	};

	const defaultStyle = "passport-default-btn-icon no-select"

	const styleClass = isDisabled || isLoading ? defaultStyle + " passport-default-btn-icon-disabled" : defaultStyle;

	const styleLeft: React.CSSProperties = {
		marginRight: "10px"
	}

	const styleRight: React.CSSProperties = {
		marginLeft: "10px"
	}

	return (
		<div className={styleClass} onClick={handleClick} style={style}>
			{iconPos == IconPos.LEFT && (
				<i className={icon} style={styleLeft}></i>
			)}
			{isLoading ? <i className="ri-loader-4-line rotate-spinner"></i> : label}
			{iconPos == IconPos.RIGHT && (
				<i className={icon} style={styleRight}></i>
			)}
		</div>
	)
}