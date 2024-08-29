import React, {useRef, useState} from "react";

import './AvatarImage.css';

interface Props {
	url?: string | null,
	height: number,
	width: number
}

export const AvatarImage: React.FC<Props> = ({url="", height, width}) => {

	return (
		<img className="blue-orange-default-avatar-image" src={url == null ? "" : url} alt={"User profile picture"} width={width} height={height}/>
	);
};