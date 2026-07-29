import React from "react";

import './InputOTPSlot.css'
import {useInputOTP} from "../input-otp/InputOTPContext";

interface Props {
	/** Position of this slot in the code, counted from 0. */
	index: number;
	style?: React.CSSProperties;
}

/**
 * Renders a single character of the code. Must sit inside an InputOTP.
 */
export const InputOTPSlot: React.FC<Props> = ({index, style={}}) => {

	const otp = useInputOTP();

	if (!otp) {
		return null;
	}

	const character = otp.chars[index] ?? "";

	const active = otp.activeIndex === index;

	const generateClassName = () => {
		var className = "blue-orange-input-otp-slot no-select";
		if (active) {
			className += " blue-orange-input-otp-slot-active";
		}
		if (otp.isError) {
			className += " blue-orange-input-otp-slot-error";
		}
		return className;
	}

	return (
		<div
			className={generateClassName()}
			onMouseDown={(event) => {
				// the hidden input is focused directly so the caret lands on this slot
				event.preventDefault();
				otp.focusSlot(index);
			}}
			style={style}>
			{character}
			{active && !character && <div className="blue-orange-input-otp-caret"></div>}
		</div>
	)
}
