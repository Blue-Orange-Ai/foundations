import React, {ReactNode, useState} from "react";

import './DropdownItemIcon.css'

interface Props {
	src: string,
	label: string,
	selected: boolean
}
export const DropdownItemIcon: React.FC<Props> = ({src, label, selected}) => {

	const textStyle: React.CSSProperties = {
		fontWeight: selected ? 700 : 500
	}

	return (
		<div className="blue-orange-dropdown-item-icon no-select">
			<div className="blue-orange-dropdown-item-icon-src">
				<i className={src}></i>
			</div>
			<div className="blue-orange-dropdown-item-icon-text" style={textStyle}>{label}</div>
		</div>
	)
}