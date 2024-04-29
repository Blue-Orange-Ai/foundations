import React from "react";

import './FormHeading.css'

interface Props {
	label: string,
	required?: boolean
}

export const FormHeading: React.FC<Props> = ({label, required}) => {
	return (
		<div className="passport-default-form-heading-cont">
			{required && (
				<span>*</span>
			)}
			{label}
		</div>
	)
}