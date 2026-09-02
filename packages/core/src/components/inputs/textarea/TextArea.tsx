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
	/** A fixed height for the field. A number is taken as pixels. */
	height?: number | string;
	/** The shortest the field is allowed to be. A number is taken as pixels. */
	minHeight?: number | string;
	/** The tallest the field is allowed to be, after which it scrolls. A number is taken as pixels. */
	maxHeight?: number | string;
	onChange?: (value: string) => void;
	label?:string;
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string;
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string;
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
											  height,
											  minHeight,
											  maxHeight,
											  onChange,
											  label,
											  name,
											  requiredMessage,
											  required=false,
											  disabled=false,
											  help,
											  labelStyle={},
											  validate,
											  validateOnChange=false}) => {

	const [text, setText] = useState(value);

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			value: text === undefined || text == null ? "" : text
		});

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

	/**
	 * The height props are applied over the top of `style`, so a field that is
	 * given both is sized by the prop that names what it is doing.
	 */
	const textAreaStyle = (): React.CSSProperties => {
		const sizing: React.CSSProperties = {};
		if (height !== undefined) {
			sizing.height = height;
		}
		if (minHeight !== undefined) {
			sizing.minHeight = minHeight;
		}
		if (maxHeight !== undefined) {
			sizing.maxHeight = maxHeight;
		}
		return {...style, ...sizing};
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
				style={textAreaStyle()}>
			</textarea>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	);
};