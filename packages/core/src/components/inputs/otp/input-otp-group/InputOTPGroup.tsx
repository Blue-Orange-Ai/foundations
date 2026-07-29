import React from "react";

import './InputOTPGroup.css'

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Joins a run of slots together so they share their borders.
 */
export const InputOTPGroup: React.FC<Props> = ({children, style={}}) => {

	return (
		<div className="blue-orange-input-otp-group" style={style}>
			{children}
		</div>
	)
}
