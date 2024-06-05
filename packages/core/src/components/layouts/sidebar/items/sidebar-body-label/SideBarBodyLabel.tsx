import React from "react";

import './SideBarBodyLabel.css'

interface Props {
	label: string,
	style?: React.CSSProperties,
	badge?: React.ReactNode;
}

export const SideBarBodyLabel: React.FC<Props> = ({label, style, badge}) => {


	return (
		<div style={style} className="blue-orange-sidebar-body-label">
			<div className="no-select">{label}</div>
			{badge && <>{badge}</>}
		</div>
	)
}