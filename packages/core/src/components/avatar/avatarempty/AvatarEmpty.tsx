import React, {useRef, useState} from "react";
import {BlueOrangeMedia} from "@blue-orange-ai/foundations-clients/lib/BlueOrangeMedia";

import './AvatarEmpty.css';

interface Props {
	height: number
}

export const AvatarEmpty: React.FC<Props> = ({height}) => {

	const fontSizeStyle: React.CSSProperties = {
		fontSize: height * 0.6 + "px"
	}

	return (
		<div className="blue-orange-default-avatar-empty">
			<i className="ri-user-4-line" style={fontSizeStyle}></i>
		</div>
	);
};