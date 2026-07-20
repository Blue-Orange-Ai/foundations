import React, {useEffect, useRef, useState} from "react";

import './TextArea.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	value?:string;
	placeholder?: string;
	style?: React.CSSProperties;
	onChange?: (value: string) => void;
	label?:string;
	required?: boolean;
	disabled?: boolean;
	help?: string;
	labelStyle?: React.CSSProperties;
	validate?: InputValidateCallback<string>;
	validateOnChange?: boolean;
}

export const TextArea: React.FC<Props> = ({
											  value="",
											  placeholder="",
											  style = {},
											  onChange,
											  label,
											  required=false,
											  disabled=false,
											  help,
											  labelStyle={},
											  validate,
											  validateOnChange=false}) => {

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange);

	const [text, setText] = useState(value);

	useEffect(() => {
		setText(value);
	}, [value]);

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = event.target.value;
		if (onChange) {
			onChange(newValue);
		}
		setText(newValue);
		handleChangeValidation(newValue);
	};

	const handleBlur = () => {
		handleBlurValidation(text === undefined || text == null ? "" : text);
	};

	return (
		<div className="blue-orange-text-area-input-cont" style={style}>
			{label &&
				<div
					className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
					style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			}
			<textarea
				disabled={disabled}
				value={text}
				className={"blue-orange-default-text-area" + (isError ? " blue-orange-default-text-area-invalid" : "")}
				placeholder={placeholder}
				onChange={handleInputChange}
				onBlur={handleBlur}
				style={style}>
			</textarea>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	);
};