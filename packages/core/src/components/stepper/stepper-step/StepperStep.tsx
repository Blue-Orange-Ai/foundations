import React from "react";

import './StepperStep.css'
import {StepperStepState} from "../stepper/StepperTypes";

interface Props {
	uuid: string;
	title: string;
	description?: string;
	/** A remixicon class — shown by the ICON indicator variant. */
	icon?: string;
	/** Short label rendered next to the title, e.g. "Optional". */
	badge?: string;
	/**
	 * Pins the step to a state. Leave it unset and the step works itself out
	 * from where it sits relative to the active step.
	 */
	state?: StepperStepState;
	disabled?: boolean;
	/** The panel shown while this step is the active one. */
	children?: React.ReactNode;
}

/**
 * Declares a single step of a Stepper. Like Tab it renders nothing itself —
 * Stepper reads its props and children.
 */
export const StepperStep: React.FC<Props> = ({}) => {

	return (
		<></>
	)
}
