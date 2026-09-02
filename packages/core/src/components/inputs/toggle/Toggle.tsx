import React, {useEffect, useRef, useState} from "react";

import './Toggle.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

/**
 * Where the label sits relative to the switch. "top" reads like every other
 * input in the library; "left" puts the label and the switch on one row, pushed
 * to either end of the full width of the container, which is how a switch
 * usually sits in a form.
 */
export type ToggleLabelPosition = "top" | "left";

interface Props {
	checked?:boolean;
	label?: string;
	/** Optional text rendered to the right of the switch. Clicking it flips the switch. */
	text?: string;
	help?: string;
	/** "top" (default) puts the label above the switch, "left" puts it on the same row, filling the width. */
	labelPosition?: ToggleLabelPosition;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
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

export const Toggle: React.FC<Props> = ({
													 checked=false,
													 label,
													 text,
													 help,
													 labelPosition="top",
											         onChange,
													 disabled=false,
													 update,
													 style={},
													 labelStyle={},
													 textStyle={},
													 name,
													 requiredMessage,
													 required=false,
													 validate,
													 validateOnChange=false}) => {

	const isChecked = useRef<boolean>(checked);

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<boolean>(validate, validateOnChange, {
			name: name,
			label: label,
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

	const labelCont = label ?
		<div
			className={"blue-orange-default-input-label-cont"
				+ (labelPosition === "left" ? " blue-orange-toggle-label-cont-left" : "")
				+ (isError ? " blue-orange-default-input-label-cont-error" : "")}
			style={labelStyle}>
			{label}
			{help && <HelpIcon label={help}></HelpIcon>}
			{required && <RequiredIcon></RequiredIcon>}
		</div> : null;

	const switchCont =
		<div className="blue-orange-toggle-row">
			<label className="blue-orange-toggle-switch" style={style} onClick={toggleChecked}>
				<input
					type="checkbox"
					className={"blue-orange-toggle-switch-input " + isCheckedState}
					checked={isCheckedState}
					onChange={handleCheckboxChange}
					readOnly={true}
				/>
				<span className={"blue-orange-toggle-switch-slider" + (isError ? " blue-orange-toggle-switch-slider-error" : "")}></span>
			</label>
			{text &&
				<span
					className={"blue-orange-toggle-text" + (disabled ? " blue-orange-toggle-text-disabled" : "")}
					style={textStyle}
					onClick={toggleChecked}>
					{text}
				</span>
			}
		</div>;

	return (
		<div className={"blue-orange-toggle-cont" + (labelPosition === "left" ? " blue-orange-toggle-cont-left" : "")}>
			{labelPosition === "left" &&
				<div className="blue-orange-toggle-main">
					{labelCont}
					{switchCont}
				</div>
			}
			{labelPosition !== "left" &&
				<>
					{labelCont}
					{switchCont}
				</>
			}
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	);
};
