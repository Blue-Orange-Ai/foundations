import React from "react";

import './StepperSeparator.css'
import {StepperOrientation} from "../stepper/StepperTypes";

interface Props {
	/** Fills the line in, marking the step behind it as done. */
	completed?: boolean;
	orientation?: StepperOrientation;
	style?: React.CSSProperties;
}

/**
 * The line joining two steps. Rendered by Stepper, and exported so a bespoke
 * step layout can reuse it.
 */
export const StepperSeparator: React.FC<Props> = ({
													  completed = false,
													  orientation = StepperOrientation.HORIZONTAL,
													  style = {}}) => {

	const generateClassName = () => {
		var className = "blue-orange-stepper-separator";
		className += orientation === StepperOrientation.VERTICAL
			? " blue-orange-stepper-separator-vertical"
			: " blue-orange-stepper-separator-horizontal";
		if (completed) {
			className += " blue-orange-stepper-separator-completed";
		}
		return className;
	}

	return (
		<div className={generateClassName()} style={style}></div>
	)
}
