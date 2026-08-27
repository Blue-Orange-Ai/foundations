import React from "react";

import './QuestionnaireItem.css'
import {QuestionnaireAnswer, QuestionnaireChoice} from "../questionnaire/QuestionnaireTypes";

export interface QuestionnaireItemProps {
	/** Identifies the item, and is the key its answer is recorded under. */
	uuid: string;
	/** The question itself. */
	prompt: string;
	/** The sentence underneath the question — what is being asked for, and why. */
	description?: string;
	/** The fixed answers on offer. Leave it out for a question answered only in prose. */
	choices?: Array<QuestionnaireChoice>;
	/** Lets more than one choice be picked, which turns the rows into checkboxes. */
	multiple?: boolean;
	/** Adds a row that opens a text field, for an answer none of the choices covers. */
	freeform?: boolean;
	/** What the freeform row reads. */
	freeformLabel?: string;
	freeformPlaceholder?: string;
	/**
	 * Lets the question be passed over, which puts a skip button in the footer.
	 * Every other question has to be answered before the flow moves on.
	 */
	optional?: boolean;
	/** Overrides the message shown when the question is left unanswered. */
	requiredMessage?: string;
	/**
	 * Whether the question is asked at all. Turning it off drops it from the
	 * count and skips over it — this is how an answer given earlier adds or
	 * removes the questions that follow.
	 */
	enabled?: boolean;
	/**
	 * Checks the answer when the flow tries to move on. Return a message to hold
	 * the flow where it is, or nothing to let it through — which is where a
	 * schema of your own gets a say.
	 */
	validate?: (answer: QuestionnaireAnswer) => string | undefined;
	/** Anything else the question needs, rendered under the choices. */
	children?: React.ReactNode;
}

/**
 * Declares one question of a Questionnaire. Like WizardStage it renders nothing
 * itself — Questionnaire reads its props and renders it when it is the question
 * being asked.
 */
export const QuestionnaireItem: React.FC<QuestionnaireItemProps> = ({}) => {

	return (
		<></>
	)
}
