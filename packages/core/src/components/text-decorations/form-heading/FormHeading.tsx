import React from "react";

import './FormHeading.css'

interface Props {
	label: string,
	required?: boolean
}

export const FormHeading: React.FC<Props> = ({label, required}) => {
	return (
		<div className="blue-orange-default-form-heading-cont">
			{required && (
				<span>*</span>
			)}
			{label}
		</div>
	)
}