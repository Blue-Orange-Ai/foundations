import React, {useEffect, useId, useState} from "react";

import './Checkbox.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	checked?:boolean;
	label?: string;
	/** Optional text rendered to the right of the box. Clicking it ticks the box. */
	text?: string;
	help?: string;
	onCheckboxChange?: (checked: boolean) => void;
	readonly?: boolean;
	update?: Date;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	textStyle?: React.CSSProperties;
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string;
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string;
	required?: boolean;
	validate?: InputValidateCallback<boolean>;
	validateOnChange?: boolean;
}

export const Checkbox: React.FC<Props> = ({
													 checked=false,
													 label,
													 text,
													 help,
													 onCheckboxChange,
													 readonly=false,
													 update,
													 style={},
													 labelStyle={},
													 textStyle={},
													 name,
													 requiredMessage,
													 required=false,
													 validate,
													 validateOnChange=false}) => {

	const [isChecked, setIsChecked] = useState(checked);

	const inputId = useId();

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<boolean>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			value: isChecked
		});

	useEffect(() => {
		setIsChecked(checked);
	}, [checked, update]);


	const handleCheckboxChange = () => {
		const newChecked = !isChecked;
		setIsChecked(newChecked);
		if (onCheckboxChange) {
			onCheckboxChange(newChecked);
		}
		handleChangeValidation(newChecked);
		handleBlurValidation(newChecked);
	};

	return (
		<div className='blue-orange-checkbox'>
			{label &&
				<div
					className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
					style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			}
			<div className="blue-orange-checkbox-row">
				{readonly &&
					<input type="checkbox"
						   id={inputId}
						   checked={isChecked}
						   readOnly
						   style={style}
					/>
				}
				{!readonly &&
					<input type="checkbox"
						   id={inputId}
						   className={isError ? "blue-orange-checkbox-error" : ""}
						   checked={isChecked}
						   onChange={handleCheckboxChange}
						   style={style}
					/>
				}
				{text &&
					<label
						htmlFor={inputId}
						className={"blue-orange-checkbox-text" + (readonly ? " blue-orange-checkbox-text-readonly" : "")}
						style={textStyle}>
						{text}
					</label>
				}
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>


	);
};
