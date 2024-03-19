import React, {useRef, useState} from "react";

import './AvatarImage.css';

interface Props {
	url?: string,
	height: number,
	width: number
}

export const AvatarImage: React.FC<Props> = ({url, height, width}) => {

	return (
		<img className="passport-default-avatar-image" src={url} alt={"User profile picture"} width={width} height={height}/>
	);
};