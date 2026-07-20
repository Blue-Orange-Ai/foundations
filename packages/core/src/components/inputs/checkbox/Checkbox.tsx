import React, {useEffect, useRef, useState} from "react";

import './Checkbox.css';
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	checked?:boolean;
	onCheckboxChange?: (checked: boolean) => void;
	readonly?: boolean;
	update?: Date;
	style?: React.CSSProperties;
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
													 onCheckboxChange,
													 readonly=false,
													 update,
													 style={},
													 name,
													 requiredMessage,
													 required=false,
													 validate,
													 validateOnChange=false}) => {

	const [isChecked, setIsChecked] = useState(checked);

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<boolean>(validate, validateOnChange, {
			name: name,
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
			{readonly &&
				<input type="checkbox"
					   checked={isChecked}
					   readOnly
					   style={style}
				/>
			}
			{!readonly &&
				<input type="checkbox"
					   className={isError ? "blue-orange-checkbox-error" : ""}
					   checked={isChecked}
					   onChange={handleCheckboxChange}
					   style={style}
				/>
			}
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>


	);
};