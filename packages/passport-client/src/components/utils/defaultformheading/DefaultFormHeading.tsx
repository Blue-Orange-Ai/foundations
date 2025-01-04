import React from "react";

import './DefaultFormHeading.css'

interface Props {
	label: string,
	required?: boolean
}

export const DefaultFormHeading: React.FC<Props> = ({label, required}) => {
	return (
		<div className="passport-default-form-heading-cont">
			{required && (
				<span>*</span>
			)}
			{label}
		</div>
	)
}