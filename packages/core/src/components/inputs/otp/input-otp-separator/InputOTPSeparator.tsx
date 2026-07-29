import React from "react";

import './InputOTPSeparator.css'

interface Props {
	/** Any remixicon class — defaults to a dash. */
	icon?: string;
	style?: React.CSSProperties;
}

/**
 * Sits between two InputOTPGroups.
 */
export const InputOTPSeparator: React.FC<Props> = ({icon="ri-subtract-line", style={}}) => {

	return (
		<div className="blue-orange-input-otp-separator no-select" aria-hidden={true} style={style}>
			<i className={icon}></i>
		</div>
	)
}
