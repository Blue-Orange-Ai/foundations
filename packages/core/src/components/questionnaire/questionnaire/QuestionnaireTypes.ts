/** One of the fixed answers offered by a QuestionnaireItem. */
export interface QuestionnaireChoice {
	/** Identifies the choice, and is what the answer is recorded as. */
	uuid: string;
	/** The line the choice reads. */
	label: string;
	/** The sentence underneath the label explaining what picking this means. */
	hint?: string;
	/** A remixicon class rendered before the label. */
	icon?: string;
	/** Greys the choice out and takes it out of the keyboard order. */
	disabled?: boolean;
}

/**
 * What one item was answered with. Single choice items hold at most one uuid in
 * `choices`; a multiple choice item holds every uuid that was picked.
 */
export interface QuestionnaireAnswer {
	/** The uuids of the choices picked. */
	choices: string[];
	/** What was written in the freeform field, when the item has one. */
	text: string;
	/** Set when the item was passed over rather than answered. */
	skipped: boolean;
}

/** Every answer given so far, keyed by the uuid of the item it belongs to. */
export type QuestionnaireAnswers = Record<string, QuestionnaireAnswer>;

/**
 * The uuid the freeform row is recorded under. It sits in `choices` alongside
 * the fixed answers, so a freeform answer is picked, cleared and counted the
 * same way every other answer is.
 */
export const QUESTIONNAIRE_FREEFORM_UUID = "__questionnaire_freeform__";

/** The answer of an item that has not been touched. */
export const EMPTY_QUESTIONNAIRE_ANSWER: QuestionnaireAnswer = {choices: [], text: "", skipped: false};

/** What the key beside each choice reads. */
export enum QuestionnaireShortcut {
	/** No key is offered and none is shown. */
	NONE = "NONE",
	/** a, b, c … */
	LETTER = "LETTER",
	/** 1, 2, 3 … */
	NUMBER = "NUMBER"
}

/** What is shown above the question being asked. */
export enum QuestionnaireProgress {
	NONE = "NONE",
	/** "Question 2 of 5" on its own. */
	COUNT = "COUNT",
	/** A filling rail on its own. */
	BAR = "BAR",
	/** The count with the rail underneath it. */
	BOTH = "BOTH"
}

export enum QuestionnaireSize {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE"
}

/** The key that picks the choice sitting at this index, or "" when none does. */
export const questionnaireShortcutKey = (shortcut: QuestionnaireShortcut, index: number): string => {
	if (shortcut === QuestionnaireShortcut.LETTER) {
		// past the alphabet there is no key left to offer
		return index < 26 ? String.fromCharCode(97 + index) : "";
	}
	if (shortcut === QuestionnaireShortcut.NUMBER) {
		return index < 9 ? String(index + 1) : "";
	}
	return "";
}

/** Whether an answer counts as given, which is what `optional` decides against. */
export const isQuestionnaireAnswered = (answer: QuestionnaireAnswer): boolean => {
	if (answer.choices.includes(QUESTIONNAIRE_FREEFORM_UUID)) {
		// the freeform row is only an answer once something has been written in it
		return answer.text.trim().length > 0 || answer.choices.length > 1;
	}
	return answer.choices.length > 0;
}
