import React, {useRef, useState} from "react";
import BlueOrangeMedia from "../../sdks/media/BlueOrangeMedia";

import './AvatarEmpty.css';

interface Props {
	height: number
}

export const AvatarEmpty: React.FC<Props> = ({height}) => {

	const fontSizeStyle: React.CSSProperties = {
		fontSize: height * 0.6 + "px"
	}

	return (
		<div className="passport-default-avatar-empty">
			<i className="ri-user-4-line" style={fontSizeStyle}></i>
		</div>
	);
};