import React from "react";

import './PageHeading.css'
interface Props {
	heading: string,
	subText?: string
}
export const PageHeading: React.FC<Props> = ({heading, subText}) => {
	return (
		<div className="passport-default-heading-cont">
			<h1 className="passport-default-heading">{heading}</h1>
			{subText && (
				<div className="passport-default-heading-sub-text" dangerouslySetInnerHTML={{__html: subText}}></div>
			)}
		</div>
	)
}