import React, {useEffect, useRef, useState} from "react";

import './Toggle.css';
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	checked?:boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
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

export const Toggle: React.FC<Props> = ({
													 checked=false,
											         onChange,
													 disabled=false,
													 update,
													 style={},
													 name,
													 requiredMessage,
													 required=false,
													 validate,
													 validateOnChange=false}) => {

	const isChecked = useRef<boolean>(checked);

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<boolean>(validate, validateOnChange, {
			name: name,
			required: required,
			requiredMessage: requiredMessage,
			getValue: () => isChecked.current
		});

	const [isCheckedState, setIsCheckedState] = useState(checked);

	const isCheckDisabled = useRef<boolean>(disabled);

	useEffect(() => {
		saveCheckboxState(checked);
	}, [checked, update]);


	const saveCheckboxState = (state: boolean, validateState: boolean = false) => {
		if (!isCheckDisabled.current) {
			isChecked.current = state;
			setIsCheckedState(isChecked.current);
			isCheckDisabled.current = true;
			setTimeout(() => {
				isCheckDisabled.current = false;
			}, 50);
			if (validateState) {
				handleChangeValidation(isChecked.current);
				handleBlurValidation(isChecked.current);
			}
		}
		if (onChange) {
			onChange(isChecked.current);
		}
	}

	const toggleChecked = () => {
		if (!isCheckDisabled.current) {
			saveCheckboxState(!isChecked.current, true);
		}
	};

	const handleCheckboxChange = () => {
		const newChecked = !isChecked.current;
		saveCheckboxState(newChecked, true)
		if (onChange) {
			onChange(newChecked);
		}
	};

	return (
		<>
			<label className="blue-orange-toggle-switch" onClick={toggleChecked}>
				<input
					type="checkbox"
					className={"blue-orange-toggle-switch-input " + isCheckedState}
					checked={isCheckedState}
					onChange={handleCheckboxChange}
					readOnly={true}
				/>
				<span className={"blue-orange-toggle-switch-slider" + (isError ? " blue-orange-toggle-switch-slider-error" : "")}></span>
			</label>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</>
	);
};