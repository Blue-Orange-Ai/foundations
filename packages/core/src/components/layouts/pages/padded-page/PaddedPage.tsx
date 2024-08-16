import React from "react";

import './PaddedPage.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const PaddedPage: React.FC<Props> = ({children, style ={}}) => {

	return (
		<div className="blue-orange-layouts-padded-page" style={style}>
			<div className="blue-orange-layouts-padded-page-internal-cont">
				{children}
			</div>
		</div>
	)
}