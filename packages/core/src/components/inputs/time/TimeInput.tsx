import React, {useEffect, useRef, useState} from "react";

import './TimeInput.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	value?: string;
	label?: string;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	isInvalid?: boolean;
	onChange?: (value: string) => void;
	focus?: boolean;
	disabled?: boolean;
	focusIn?: () => void;
	focusOut?: () => void;
	required?: boolean;
	help?: string;
	validate?: InputValidateCallback<string>;
	validateOnChange?: boolean;
}

export const TimeInput: React.FC<Props> = ({
											   value,
											   label,
											   onChange,
											   isInvalid,
											   style = {},
											   labelStyle = {},
											   focus = false,
											   disabled = false,
											   focusIn,
											   focusOut,
											   required = false,
											   help,
											   validate,
											   validateOnChange=false,
}) => {

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange);

	const generateClassname = () => {
		var className = "blue-orange-input blue-orange-time-input";
		if (isInvalid || isError) {
			className += " blue-orange-input-invalid";
		}
		return className;
	}

	const [inputValue, setInputValue] = useState(value === undefined ? "" : value);

	const [inputClassName, setInputClassName] = useState(generateClassname());

	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setInputValue(newValue);
		if (onChange) {
			onChange(newValue);
		}
		handleChangeValidation(newValue);
	};

	const focusOutEvent = () => {
		handleBlurValidation(inputValue === undefined || inputValue == null ? "" : inputValue);
		if (focusOut) {
			focusOut();
		}
	}

	useEffect(() => {
		if (focus) {
			inputRef.current?.focus();
		}
	}, [focus]);

	useEffect(() => {
		setInputClassName(generateClassname());
	}, [isInvalid, isError]);

	useEffect(() => {
		setInputValue(value === undefined ? "" : value);
	}, [value]);

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
			<input
				ref={inputRef}
				className={inputClassName}
				style={style}
				value={inputValue === undefined || inputValue == null ? "" : inputValue}
				onChange={handleInputChange}
				onFocus={focusIn}
				onBlur={focusOutEvent}
				type="time"
				disabled={disabled}
			/>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	);
};
