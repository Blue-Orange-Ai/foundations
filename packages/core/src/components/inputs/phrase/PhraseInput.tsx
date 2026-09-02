import React, {useCallback, useEffect, useRef, useState} from "react";

import './PhraseInput.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {InputValidationResult, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	/** The phrase the user has to type out, and the phrase previewed in the field. */
	phrase: string;
	value?: string | null;
	label?: string;
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string;
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string;
	/** Shown once a character has been typed that the phrase does not have. */
	mismatchMessage?: string;
	/** Shown on blur when what is typed matches so far but stops short of the phrase. */
	incompleteMessage?: string;
	/** Matches the phrase whatever case it is typed in. */
	ignoreCase?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	isInvalid?: boolean;
	onChange?: (value: string) => void;
	/** Fires when the field starts, or stops, holding the phrase exactly. */
	onMatchChange?: (matched: boolean) => void;
	/** Fires the moment a wrong character lands and the preview is dropped. */
	onInvalid?: (value: string) => void;
	focus?: boolean;
	disabled?: boolean;
	focusIn?: () => void;
	focusOut?: () => void;
	enterEvent?: () => void;
	required?: boolean;
	help?: string;
}

/**
 * A field that only accepts one answer: the phrase it is given. The phrase is
 * previewed behind the caret and eaten away as it is typed correctly, and the
 * moment a character lands that the phrase does not have the preview is dropped
 * and the field reports itself invalid.
 *
 * There is no `validate` prop as there is on the other inputs — matching the
 * phrase is the only thing this field checks, so it validates itself.
 */
export const PhraseInput: React.FC<Props> = ({
												 phrase,
												 value,
												 label,
												 name,
												 requiredMessage,
												 mismatchMessage,
												 incompleteMessage,
												 ignoreCase = false,
												 placeholder = "",
												 style = {},
												 labelStyle = {},
												 isInvalid,
												 onChange,
												 onMatchChange,
												 onInvalid,
												 focus = false,
												 disabled = false,
												 focusIn,
												 focusOut,
												 enterEvent,
												 required = false,
												 help
											 }) => {

	const [inputValue, setInputValue] = useState(value === undefined || value === null ? "" : value);

	const compare = useCallback((text: string): string => {
		return ignoreCase ? text.toLowerCase() : text;
	}, [ignoreCase]);

	/** True while what is typed is the start of the phrase — the preview holds. */
	const isPrefix = useCallback((text: string): boolean => {
		return compare(phrase).startsWith(compare(text));
	}, [compare, phrase]);

	const isMatch = useCallback((text: string): boolean => {
		return compare(text) === compare(phrase);
	}, [compare, phrase]);

	// Validation reads the same value twice over: on blur an unfinished phrase is
	// an error, while on the way there it is simply not finished yet. The mode is
	// held in a ref because the callback below is handed the value and nothing
	// else. It is read synchronously inside runValidation, so it is set for the
	// call and put back straight after.
	const modeRef = useRef<"change" | "blur">("blur");

	const validatePhrase = useCallback((text: string): Promise<InputValidationResult> => {
		const current = text ?? "";
		if (current.length === 0 || isMatch(current)) {
			return Promise.resolve({state: "success"});
		}
		if (!isPrefix(current)) {
			return Promise.resolve({
				state: "error",
				message: mismatchMessage ?? ("This does not match \"" + phrase + "\".")
			});
		}
		if (modeRef.current === "blur") {
			return Promise.resolve({
				state: "error",
				message: incompleteMessage ?? ("Type \"" + phrase + "\" in full to continue.")
			});
		}
		return Promise.resolve({state: "success"});
	}, [isMatch, isPrefix, mismatchMessage, incompleteMessage, phrase]);

	const {validationResult, isError, runValidation, handleBlurValidation} =
		useInputValidation<string>(validatePhrase, false, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			value: inputValue
		});

	const inputRef = useRef<HTMLInputElement | null>(null);
	const previewRef = useRef<HTMLDivElement | null>(null);

	// The two states worth telling the caller about are only reported as they
	// turn over, so a hook does not fire again on every following keystroke.
	const matchedRef = useRef<boolean>(isMatch(inputValue));
	const prefixRef = useRef<boolean>(isPrefix(inputValue));

	const reportState = useCallback((text: string) => {
		const matched = isMatch(text);
		if (matched !== matchedRef.current) {
			matchedRef.current = matched;
			if (onMatchChange) {
				onMatchChange(matched);
			}
		}
		const prefix = isPrefix(text);
		if (prefix !== prefixRef.current) {
			prefixRef.current = prefix;
			if (!prefix && onInvalid) {
				onInvalid(text);
			}
		}
	}, [isMatch, isPrefix, onMatchChange, onInvalid]);

	const inputClassName = "blue-orange-input blue-orange-phrase-input"
		+ (isInvalid || isError ? " blue-orange-input-invalid" : "");

	const handleKeydownChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && enterEvent) {
			enterEvent();
		}
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setInputValue(newValue);
		if (onChange) {
			onChange(newValue);
		}
		reportState(newValue);
		modeRef.current = "change";
		runValidation(newValue);
		modeRef.current = "blur";
	};

	const focusInEvent = () => {
		if (focusIn) {
			focusIn();
		}
	}

	const focusOutEvent = () => {
		handleBlurValidation(inputValue);
		if (focusOut) {
			focusOut();
		}
	}

	// The preview sits over the field rather than in it, so it has to be dragged
	// along whenever a phrase longer than the field is scrolled.
	const handleScroll = () => {
		if (previewRef.current && inputRef.current) {
			previewRef.current.scrollLeft = inputRef.current.scrollLeft;
		}
	}

	useEffect(() => {
		if (focus) {
			inputRef.current?.focus();
		}
	}, [focus]);

	useEffect(() => {
		const next = value === undefined || value === null ? "" : value;
		setInputValue(next);
		reportState(next);
	}, [value]);

	const showPreview = isPrefix(inputValue);
	const remaining = showPreview ? phrase.substring(inputValue.length) : "";

	return (
		<div className="blue-orange-default-input-cont">
			{label &&
				<div
					className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
					style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			}
			<div className="blue-orange-phrase-input-cont">
				<input
					ref={inputRef}
					className={inputClassName}
					style={style}
					placeholder={showPreview ? "" : placeholder}
					value={inputValue}
					onKeyDown={handleKeydownChange}
					onChange={handleInputChange}
					onFocus={focusInEvent}
					onBlur={focusOutEvent}
					onScroll={handleScroll}
					type="text"
					disabled={disabled}
				/>
				{showPreview &&
					<div className="blue-orange-phrase-input-preview" ref={previewRef} aria-hidden={true}>
						{/* Holds the width of what has been typed so the rest of the
						    phrase lines up with the caret rather than the left edge. */}
						<span className="blue-orange-phrase-input-preview-typed">{inputValue}</span>
						<span className="blue-orange-phrase-input-preview-remaining">{remaining}</span>
					</div>
				}
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	);
};
