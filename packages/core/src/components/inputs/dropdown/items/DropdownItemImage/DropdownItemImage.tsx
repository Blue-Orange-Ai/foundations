import React, {ReactNode, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './DropdownItemImage.css'
import {Image} from "../../../../media/image/Image";

interface Props {
	src: string,
	label: string,
	selected: boolean
}
export const DropdownItemImage: React.FC<Props> = ({src, label, selected}) => {

	const textStyle: React.CSSProperties = {
		fontWeight: selected ? 700 : 500
	}

	return (
		<div className="blue-orange-dropdown-item-image no-select">
			<Image src={src} alt={"Dropdown image tag"} height={22}></Image>
			<div className="blue-orange-dropdown-item-image-text" style={textStyle}>{label}</div>
		</div>
	)
}