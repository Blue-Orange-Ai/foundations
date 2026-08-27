import React, {useEffect, useRef, useState} from "react";

import './Questionnaire.css'
import {QuestionnaireItem, QuestionnaireItemProps} from "../questionnaire-item/QuestionnaireItem";
import {
	EMPTY_QUESTIONNAIRE_ANSWER,
	isQuestionnaireAnswered,
	QUESTIONNAIRE_FREEFORM_UUID,
	QuestionnaireAnswer,
	QuestionnaireAnswers,
	QuestionnaireChoice,
	QuestionnaireProgress,
	QuestionnaireShortcut,
	QuestionnaireSize,
	questionnaireShortcutKey
} from "./QuestionnaireTypes";
import {Button, ButtonSize, ButtonType} from "../../buttons/button/Button";
import {TextArea} from "../../inputs/textarea/TextArea";
import {Kbd} from "../../text-decorations/kbd/Kbd";
import {InputValidationMessage} from "../../inputs/validation/InputValidationMessage";

interface ItemMetaData extends QuestionnaireItemProps {
	choices: Array<QuestionnaireChoice>;
}

interface Props {
	/** The QuestionnaireItem entries, in the order they are asked. */
	children: React.ReactNode;
	/** The answers so far. Supplying them hands the answers to the caller to hold. */
	answers?: QuestionnaireAnswers;
	/** The question being asked. Updating it moves the questionnaire from the outside. */
	activeItem?: string;
	/** Fires whenever an answer changes, with that answer and the whole set. */
	onAnswerChange?: (uuid: string, answer: QuestionnaireAnswer, answers: QuestionnaireAnswers) => void;
	/** Fires when the question being asked changes. */
	onItemChange?: (uuid: string, index: number) => void;
	/** Fires with every answer once the last question is finished. */
	onSubmit?: (answers: QuestionnaireAnswers) => void;
	/** Shows a cancel button in the footer when supplied. */
	onCancel?: () => void;
	size?: QuestionnaireSize;
	/** What is shown above the question. */
	progress?: QuestionnaireProgress;
	/** Overrides the wording of the count — the default reads "Question 2 of 5". */
	countLabel?: (index: number, total: number) => string;
	/** The key offered beside each choice. */
	shortcut?: QuestionnaireShortcut;
	/** Moves to the next question as soon as a single choice question is answered. */
	autoAdvance?: boolean;
	/** How long the picked choice is left on screen before the flow moves on. */
	autoAdvanceDelay?: number;
	/** Lets an answer already given be gone back to. */
	allowBack?: boolean;
	/** Draws the panel the question sits in. */
	bordered?: boolean;
	/** Slides each question in as it is reached. */
	animate?: boolean;
	showFooter?: boolean;
	/** Replaces the built in footer — for questionnaires that drive themselves. */
	footer?: React.ReactNode;
	backLabel?: string;
	skipLabel?: string;
	nextLabel?: string;
	submitLabel?: string;
	cancelLabel?: string;
	/** Shows the submit button working, e.g. while the answers are being sent. */
	submitLoading?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

const sizeClassName: Record<QuestionnaireSize, string> = {
	[QuestionnaireSize.SMALL]: "blue-orange-questionnaire-sm",
	[QuestionnaireSize.MEDIUM]: "",
	[QuestionnaireSize.LARGE]: "blue-orange-questionnaire-lg",
};

const defaultCountLabel = (index: number, total: number) => "Question " + (index + 1) + " of " + total;

/**
 * A set of questions asked one at a time — the prompt, the answers on offer,
 * and the navigation that carries the reader through them.
 *
 * It is the shape a survey, an onboarding interview or a triage form wants: the
 * questions are few enough to read, and each one deserves the whole panel
 * rather than a row of a form. Reach for FormGroup when the fields are filled in
 * together rather than in turn, and for Wizard when each step is a whole screen
 * of work rather than a single question.
 *
 * The questions are read from the children on every render and tracked by uuid,
 * so a questionnaire can branch as it is answered: render an item conditionally,
 * or leave it declared and turn its `enabled` off, and the flow re-numbers
 * itself around the question being asked.
 */
export const Questionnaire: React.FC<Props> = ({
												   children,
												   answers,
												   activeItem,
												   onAnswerChange,
												   onItemChange,
												   onSubmit,
												   onCancel,
												   size = QuestionnaireSize.MEDIUM,
												   progress = QuestionnaireProgress.BOTH,
												   countLabel = defaultCountLabel,
												   shortcut = QuestionnaireShortcut.LETTER,
												   autoAdvance = false,
												   autoAdvanceDelay = 250,
												   allowBack = true,
												   bordered = true,
												   animate = true,
												   showFooter = true,
												   footer,
												   backLabel = "Back",
												   skipLabel = "Skip",
												   nextLabel = "Next",
												   submitLabel = "Submit",
												   cancelLabel = "Cancel",
												   submitLoading = false,
												   classes = "",
												   style = {}}) => {

	const items: Array<ItemMetaData> = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === QuestionnaireItem) {
				const props = child.props as QuestionnaireItemProps;
				// a question that is switched off is not asked at all
				if (props.enabled === false) {
					return;
				}
				items.push({...props, choices: props.choices ?? []});
			}
		}
	});

	const [given, setGiven] = useState<QuestionnaireAnswers>(answers ?? {});

	const [active, setActive] = useState(activeItem ?? items[0]?.uuid ?? "");

	const [error, setError] = useState<string>("");

	const panelRef = useRef<HTMLDivElement | null>(null);

	const freeformRef = useRef<HTMLDivElement | null>(null);

	const mountedRef = useRef(false);

	const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const activeIndex = items.findIndex(item => item.uuid === active);

	// where the flow was standing last, used to land somewhere sensible if the
	// question being asked is branched away
	const lastIndexRef = useRef(0);

	useEffect(() => {
		if (activeIndex >= 0) {
			lastIndexRef.current = activeIndex;
		}
	}, [activeIndex]);

	useEffect(() => {
		if (answers !== undefined) {
			setGiven(answers);
		}
	}, [answers]);

	useEffect(() => {
		if (activeItem !== undefined) {
			setActive(activeItem);
		}
	}, [activeItem]);

	// The question being asked was branched away — fall to whichever question
	// now stands where it stood.
	useEffect(() => {
		if (items.length > 0 && activeIndex < 0) {
			const fallback = items[Math.min(lastIndexRef.current, items.length - 1)];
			setActive(fallback.uuid);
			setError("");
			if (onItemChange) {
				onItemChange(fallback.uuid, items.indexOf(fallback));
			}
		}
	}, [activeIndex, items.length]);

	useEffect(() => {
		return () => {
			if (advanceRef.current) {
				clearTimeout(advanceRef.current);
			}
		};
	}, []);

	const item: ItemMetaData | undefined = activeIndex >= 0 ? items[activeIndex] : undefined;

	const answerOf = (uuid: string): QuestionnaireAnswer => {
		return given[uuid] ?? EMPTY_QUESTIONNAIRE_ANSWER;
	}

	const answer = item ? answerOf(item.uuid) : EMPTY_QUESTIONNAIRE_ANSWER;

	const freeformSelected = answer.choices.includes(QUESTIONNAIRE_FREEFORM_UUID);

	/* An item with a freeform row and nothing else is answered in the field
	   itself — there is no row worth asking the reader to pick first. */
	const freeformOnly = (candidate: ItemMetaData) => candidate.freeform === true && candidate.choices.length === 0;

	// The rows as they are rendered: the fixed choices, then the freeform row.
	const rowsOf = (candidate: ItemMetaData): Array<QuestionnaireChoice> => {
		if (!candidate.freeform || freeformOnly(candidate)) {
			return candidate.choices;
		}
		return candidate.choices.concat([{
			uuid: QUESTIONNAIRE_FREEFORM_UUID,
			label: candidate.freeformLabel ?? "Something else"
		}]);
	}

	const rows = item ? rowsOf(item) : [];

	/* Focus lands on the question as it is reached, so the reader is read the new
	   prompt and the shortcut keys work without a click first. Not on the first
	   render — arriving on a page should not pull focus out of wherever it was. */
	useEffect(() => {
		if (!mountedRef.current) {
			mountedRef.current = true;
			return;
		}
		panelRef.current?.focus({preventScroll: true});
	}, [active]);

	// Focus the field as the row that opens it is picked, so a freeform answer
	// is typed straight away rather than clicked into.
	useEffect(() => {
		if (freeformSelected || (item && freeformOnly(item))) {
			freeformRef.current?.querySelector("textarea")?.focus();
		}
	}, [freeformSelected, active]);

	const publish = (uuid: string, next: QuestionnaireAnswer): QuestionnaireAnswers => {
		const updated = {...given, [uuid]: next};
		setGiven(updated);
		setError("");
		if (onAnswerChange) {
			onAnswerChange(uuid, next, updated);
		}
		return updated;
	}

	const move = (index: number) => {
		const next = items[index];
		if (!next) {
			return;
		}
		setActive(next.uuid);
		setError("");
		if (onItemChange) {
			onItemChange(next.uuid, index);
		}
	}

	/** The message holding the flow where it is, or "" when the answer is good. */
	const checkAnswer = (candidate: ItemMetaData, value: QuestionnaireAnswer): string => {
		if (candidate.validate) {
			const message = candidate.validate(value);
			if (message) {
				return message;
			}
		}
		if (candidate.optional || isQuestionnaireAnswered(value)) {
			return "";
		}
		if (candidate.requiredMessage) {
			return candidate.requiredMessage;
		}
		return freeformOnly(candidate) ? "Write an answer to continue." : "Pick an answer to continue.";
	}

	/** Moves on from the question being asked, or finishes when it is the last. */
	const advance = (candidate: ItemMetaData, updated: QuestionnaireAnswers) => {
		const message = checkAnswer(candidate, updated[candidate.uuid] ?? EMPTY_QUESTIONNAIRE_ANSWER);
		if (message) {
			setError(message);
			return;
		}
		const index = items.findIndex(entry => entry.uuid === candidate.uuid);
		if (index === items.length - 1) {
			if (onSubmit) {
				onSubmit(updated);
			}
			return;
		}
		move(index + 1);
	}

	const selectChoice = (choice: QuestionnaireChoice) => {
		if (!item || choice.disabled) {
			return;
		}
		var choices: Array<string>;
		if (item.multiple) {
			choices = answer.choices.includes(choice.uuid)
				? answer.choices.filter(uuid => uuid !== choice.uuid)
				: answer.choices.concat([choice.uuid]);
		} else {
			choices = [choice.uuid];
		}
		const next: QuestionnaireAnswer = {...answer, choices: choices, skipped: false};
		const updated = publish(item.uuid, next);
		// A single fixed choice is the whole answer, so the flow can carry on
		// from it. A freeform row has just opened a field to be typed into.
		if (autoAdvance && !item.multiple && choice.uuid !== QUESTIONNAIRE_FREEFORM_UUID) {
			if (advanceRef.current) {
				clearTimeout(advanceRef.current);
			}
			advanceRef.current = setTimeout(() => advance(item, updated), autoAdvanceDelay);
		}
	}

	const handleFreeformChange = (text: string) => {
		if (!item) {
			return;
		}
		/* Writing in the field is what picks the freeform row — on an item that
		   has no other rows there was nothing to click in the first place. */
		const choices = answer.choices.includes(QUESTIONNAIRE_FREEFORM_UUID)
			? answer.choices
			: answer.choices.concat([QUESTIONNAIRE_FREEFORM_UUID]);
		publish(item.uuid, {...answer, choices: choices, text: text, skipped: false});
	}

	const handleNext = () => {
		if (item) {
			advance(item, given);
		}
	}

	const handleSkip = () => {
		if (!item) {
			return;
		}
		// A skipped question keeps nothing — going back and answering it is what
		// changes that.
		const updated = publish(item.uuid, {choices: [], text: "", skipped: true});
		const index = items.indexOf(item);
		if (index === items.length - 1) {
			if (onSubmit) {
				onSubmit(updated);
			}
			return;
		}
		move(index + 1);
	}

	const handleBack = () => {
		if (activeIndex > 0) {
			move(activeIndex - 1);
		}
	}

	/**
	 * The shortcut keys pick a choice from anywhere in the panel, except from
	 * inside the freeform field — there the letters are the answer.
	 */
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (shortcut === QuestionnaireShortcut.NONE || event.metaKey || event.ctrlKey || event.altKey) {
			return;
		}
		const target = event.target as HTMLElement;
		if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
			return;
		}
		const index = rows.findIndex((row, position) => questionnaireShortcutKey(shortcut, position) === event.key.toLowerCase());
		if (index >= 0 && !rows[index].disabled) {
			event.preventDefault();
			selectChoice(rows[index]);
		}
	}

	const generateClassName = () => {
		var className = "blue-orange-questionnaire";
		if (sizeClassName[size]) {
			className += " " + sizeClassName[size];
		}
		if (bordered) {
			className += " blue-orange-questionnaire-bordered";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	const generateRowClassName = (row: QuestionnaireChoice) => {
		var className = "blue-orange-questionnaire-choice";
		if (answer.choices.includes(row.uuid)) {
			className += " blue-orange-questionnaire-choice-active";
		}
		if (row.disabled) {
			className += " blue-orange-questionnaire-choice-disabled";
		}
		return className;
	}

	if (!item) {
		return <></>;
	}

	const showCount = progress === QuestionnaireProgress.COUNT || progress === QuestionnaireProgress.BOTH;

	const showBar = progress === QuestionnaireProgress.BAR || progress === QuestionnaireProgress.BOTH;

	const completed = ((activeIndex + 1) / items.length) * 100;

	const last = activeIndex === items.length - 1;

	return (
		<div
			ref={panelRef}
			className={generateClassName()}
			/* Holds focus between questions without adding a stop of its own. */
			tabIndex={-1}
			style={style}
			onKeyDown={handleKeyDown}>
			{(showCount || showBar) &&
				<div className="blue-orange-questionnaire-progress">
					{showCount &&
						<div className="blue-orange-questionnaire-count" aria-live="polite">
							{countLabel(activeIndex, items.length)}
						</div>
					}
					{showBar &&
						<div
							className="blue-orange-questionnaire-bar"
							role="progressbar"
							aria-valuenow={activeIndex + 1}
							aria-valuemin={1}
							aria-valuemax={items.length}>
							<div className="blue-orange-questionnaire-bar-fill" style={{width: completed + "%"}}></div>
						</div>
					}
				</div>
			}

			<fieldset
				/* Keyed on the question so the panel animates in as each one is reached. */
				key={animate ? item.uuid : undefined}
				className={"blue-orange-questionnaire-item" + (animate ? " blue-orange-questionnaire-item-animated" : "")}>
				<legend className="blue-orange-questionnaire-prompt">
					{item.prompt}
					{item.optional && <span className="blue-orange-questionnaire-optional">Optional</span>}
				</legend>
				{item.description &&
					<div className="blue-orange-questionnaire-description">{item.description}</div>
				}

				{rows.length > 0 &&
					<div
						className="blue-orange-questionnaire-choices no-select"
						role={item.multiple ? "group" : "radiogroup"}
						aria-label={item.prompt}>
						{rows.map((row, index) => {
							const key = questionnaireShortcutKey(shortcut, index);
							return (
								<button
									key={row.uuid}
									type="button"
									role={item.multiple ? "checkbox" : "radio"}
									aria-checked={answer.choices.includes(row.uuid)}
									aria-disabled={row.disabled === true}
									disabled={row.disabled === true}
									className={generateRowClassName(row)}
									onClick={() => selectChoice(row)}>
									<span className={"blue-orange-questionnaire-indicator" + (item.multiple ? " blue-orange-questionnaire-indicator-box" : "")}></span>
									{row.icon && <i className={row.icon + " blue-orange-questionnaire-choice-icon"}></i>}
									<span className="blue-orange-questionnaire-choice-body">
										<span className="blue-orange-questionnaire-choice-label">{row.label}</span>
										{row.hint && <span className="blue-orange-questionnaire-choice-hint">{row.hint}</span>}
									</span>
									{key && <Kbd>{key}</Kbd>}
								</button>
							)
						})}
					</div>
				}

				{item.freeform && (freeformOnly(item) || freeformSelected) &&
					<div className="blue-orange-questionnaire-freeform" ref={freeformRef}>
						<TextArea
							value={answer.text}
							placeholder={item.freeformPlaceholder ?? "Tell us more…"}
							onChange={handleFreeformChange}
						></TextArea>
					</div>
				}

				{item.children && <div className="blue-orange-questionnaire-content">{item.children}</div>}

				<InputValidationMessage result={error ? {state: "error", message: error} : null}></InputValidationMessage>
			</fieldset>

			{showFooter &&
				(footer !== undefined
					? footer
					: <div className="blue-orange-questionnaire-footer">
						<div className="blue-orange-questionnaire-footer-left">
							{allowBack && activeIndex > 0 &&
								<Button
									text={backLabel}
									icon="ri-arrow-left-line"
									buttonType={ButtonType.CLEAR}
									size={ButtonSize.SMALL}
									onClick={handleBack}
								></Button>
							}
							{onCancel &&
								<Button
									text={cancelLabel}
									buttonType={ButtonType.CLEAR}
									size={ButtonSize.SMALL}
									onClick={onCancel}
								></Button>
							}
						</div>
						<div className="blue-orange-questionnaire-footer-right">
							{item.optional &&
								<Button
									text={skipLabel}
									buttonType={ButtonType.SECONDARY}
									size={ButtonSize.SMALL}
									onClick={handleSkip}
								></Button>
							}
							<Button
								text={last ? submitLabel : nextLabel}
								buttonType={ButtonType.PRIMARY}
								size={ButtonSize.SMALL}
								isLoading={last && submitLoading}
								onClick={handleNext}
							></Button>
						</div>
					</div>
				)
			}
		</div>
	)
}
