import React from "react";

import './StepperIndicator.css'
import {StepperIndicatorVariant, StepperStepState} from "../stepper/StepperTypes";
import {Spinner, SpinnerSize} from "../../loading/spinner/Spinner";

interface Props {
	state: StepperStepState;
	/** The position of the step, counted from 1. */
	number?: number;
	/** A remixicon class used by the ICON variant. */
	icon?: string;
	variant?: StepperIndicatorVariant;
	style?: React.CSSProperties;
}

const stateClassName: Record<StepperStepState, string> = {
	[StepperStepState.PENDING]: "blue-orange-stepper-indicator-pending",
	[StepperStepState.ACTIVE]: "blue-orange-stepper-indicator-active",
	[StepperStepState.COMPLETED]: "blue-orange-stepper-indicator-completed",
	[StepperStepState.LOADING]: "blue-orange-stepper-indicator-active",
	[StepperStepState.ERROR]: "blue-orange-stepper-indicator-error",
};

/**
 * The circle at the head of a step. Rendered by Stepper, and exported so a
 * bespoke step layout can reuse it.
 */
export const StepperIndicator: React.FC<Props> = ({
													  state,
													  number,
													  icon,
													  variant = StepperIndicatorVariant.NUMBER,
													  style = {}}) => {

	const generateClassName = () => {
		var className = "blue-orange-stepper-indicator no-select " + stateClassName[state];
		if (variant === StepperIndicatorVariant.DOT) {
			className += " blue-orange-stepper-indicator-dot";
		}
		return className;
	}

	const renderContent = () => {
		if (state === StepperStepState.LOADING) {
			return <Spinner size={SpinnerSize.SMALL}></Spinner>;
		}
		if (state === StepperStepState.ERROR) {
			return <i className="ri-close-line"></i>;
		}
		if (state === StepperStepState.COMPLETED) {
			return <i className="ri-check-line"></i>;
		}
		if (variant === StepperIndicatorVariant.DOT) {
			return null;
		}
		if (variant === StepperIndicatorVariant.ICON && icon) {
			return <i className={icon}></i>;
		}
		return <span>{number}</span>;
	}

	return (
		<div className={generateClassName()} style={style}>
			{renderContent()}
		</div>
	)
}
