import React from "react";

import './WizardStage.css'
import {StepperStepState} from "../../stepper/stepper/StepperTypes";

interface Props {
	uuid: string;
	/** The name of the stage, shown on the stepper. */
	title: string;
	description?: string;
	/** A remixicon class, used by the icon indicator variant. */
	icon?: string;
	/** Short label shown next to the title, e.g. "Optional". */
	badge?: string;
	/**
	 * Whether the stage is part of the flow at all. Turning it off drops it from
	 * the stepper and skips over it — this is how an answer earlier in the
	 * wizard adds or removes the stages that follow.
	 */
	enabled?: boolean;
	/** Blocks the next button until the stage is happy with its answers. */
	canProceed?: boolean;
	/** Pins the step to a state, e.g. leaving an error on a stage. */
	state?: StepperStepState;
	/** Anything at all — the stage is a plain container for its content. */
	children?: React.ReactNode;
}

/**
 * Declares one stage of a Wizard. Like Tab it renders nothing itself — Wizard
 * reads its props and renders its children when the stage is the active one.
 */
export const WizardStage: React.FC<Props> = ({}) => {

	return (
		<></>
	)
}
