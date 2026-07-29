import React, {useEffect, useRef, useState} from "react";

import './InputOTP.css'
import {HelpIcon} from "../../help/HelpIcon";
import {RequiredIcon} from "../../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../../validation/InputValidation";
import {InputValidationMessage} from "../../validation/InputValidationMessage";
import {InputOTPContext, InputOTPContextValue} from "./InputOTPContext";
import {InputOTPGroup} from "../input-otp-group/InputOTPGroup";
import {InputOTPSlot} from "../input-otp-slot/InputOTPSlot";
import {InputOTPSeparator} from "../input-otp-separator/InputOTPSeparator";

interface Props {
	value?: string;
	maxLength?: number;
	/** Splits the slots into groups, e.g. [3, 3] renders 3 + 3 with a separator. */
	groups?: number[];
	label?: string;
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string;
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string;
	required?: boolean;
	help?: string;
	/** Restricts entry to digits and switches the mobile keyboard to numeric. */
	isNumeric?: boolean;
	/** Characters that fail this test are rejected as they are typed or pasted. */
	allowedPattern?: RegExp;
	disabled?: boolean;
	autoFocus?: boolean;
	onChange?: (value: string) => void;
	/** Fires once every slot has been filled. */
	onComplete?: (value: string) => void;
	/** Overrides the generated slots — compose InputOTPGroup / InputOTPSlot by hand. */
	children?: React.ReactNode;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	validate?: InputValidateCallback<string>;
	validateOnChange?: boolean;
}

/**
 * A one time passcode input. A single hidden field holds the value — so paste,
 * autofill and mobile keyboards all behave — while the slots render it.
 */
export const InputOTP: React.FC<Props> = ({
											  value,
											  maxLength = 6,
											  groups,
											  label,
											  name,
											  requiredMessage,
											  required = false,
											  help,
											  isNumeric = false,
											  allowedPattern,
											  disabled = false,
											  autoFocus = false,
											  onChange,
											  onComplete,
											  children,
											  style = {},
											  labelStyle = {},
											  validate,
											  validateOnChange = false}) => {

	const [inputValue, setInputValue] = useState(value ?? "");

	const [activeIndex, setActiveIndex] = useState(-1);

	const inputRef = useRef<HTMLInputElement | null>(null);

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			value: inputValue
		});

	useEffect(() => {
		if (value !== undefined) {
			setInputValue(value);
		}
	}, [value]);

	useEffect(() => {
		if (autoFocus) {
			inputRef.current?.focus();
		}
	}, [autoFocus]);

	const pattern = allowedPattern ?? (isNumeric ? /^[0-9]*$/ : undefined);

	const sanitise = (raw: string): string => {
		const trimmed = raw.slice(0, maxLength);
		if (!pattern) {
			return trimmed;
		}
		return trimmed.split("").filter(character => pattern.test(character)).join("");
	}

	const syncActiveIndex = () => {
		const input = inputRef.current;
		if (!input) {
			return;
		}
		const caret = input.selectionStart ?? input.value.length;
		setActiveIndex(Math.min(caret, maxLength - 1));
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const next = sanitise(event.target.value);
		setInputValue(next);
		if (onChange) {
			onChange(next);
		}
		handleChangeValidation(next);
		if (next.length === maxLength && onComplete) {
			onComplete(next);
		}
		// the caret has already moved by the time the change lands
		setTimeout(syncActiveIndex, 0);
	}

	const handleFocus = () => {
		syncActiveIndex();
	}

	const handleBlur = () => {
		setActiveIndex(-1);
		handleBlurValidation(inputValue);
	}

	const focusSlot = (index: number) => {
		const input = inputRef.current;
		if (!input || disabled) {
			return;
		}
		input.focus();
		// never let the caret land past the first empty slot
		const caret = Math.min(index, inputValue.length);
		input.setSelectionRange(caret, caret);
		setActiveIndex(Math.min(caret, maxLength - 1));
	}

	const chars: string[] = [];

	for (var index = 0; index < maxLength; index++) {
		chars.push(inputValue[index] ?? "");
	}

	const contextValue: InputOTPContextValue = {
		chars: chars,
		activeIndex: activeIndex,
		disabled: disabled,
		isError: isError,
		focusSlot: focusSlot
	};

	/** Builds the default layout when no children were supplied. */
	const renderDefaultSlots = () => {
		const sizes = groups && groups.length > 0 ? groups : [maxLength];
		var slotIndex = 0;
		return sizes.map((size, groupIndex) => {
			const slots: React.ReactNode[] = [];
			for (var offset = 0; offset < size && slotIndex < maxLength; offset++) {
				const index = slotIndex;
				slots.push(<InputOTPSlot key={index} index={index}></InputOTPSlot>);
				slotIndex++;
			}
			return (
				<React.Fragment key={groupIndex}>
					{groupIndex > 0 && <InputOTPSeparator></InputOTPSeparator>}
					<InputOTPGroup>{slots}</InputOTPGroup>
				</React.Fragment>
			);
		});
	}

	return (
		<InputOTPContext.Provider value={contextValue}>
			<div className="blue-orange-input-otp-cont">
				{label &&
					<div
						className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
						style={labelStyle}>
						{label}
						{help && <HelpIcon label={help}></HelpIcon>}
						{required && <RequiredIcon></RequiredIcon>}
					</div>
				}
				<div
					className={disabled ? "blue-orange-input-otp blue-orange-input-otp-disabled" : "blue-orange-input-otp"}
					style={style}>
					{children ?? renderDefaultSlots()}
					<input
						ref={inputRef}
						className="blue-orange-input-otp-hidden-input"
						value={inputValue}
						maxLength={maxLength}
						disabled={disabled}
						autoComplete="one-time-code"
						inputMode={isNumeric ? "numeric" : "text"}
						aria-label={label}
						onChange={handleChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onKeyUp={syncActiveIndex}
						onClick={syncActiveIndex}
						onSelect={syncActiveIndex}
					/>
				</div>
				<InputValidationMessage result={validationResult}></InputValidationMessage>
			</div>
		</InputOTPContext.Provider>
	)
}
