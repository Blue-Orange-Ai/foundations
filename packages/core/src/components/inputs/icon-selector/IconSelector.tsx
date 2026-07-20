import React, {useEffect, useRef, useState} from "react";

import './IconSelector.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {Input} from "../input/Input";
import {Address} from "node:cluster";
import {Dropdown} from "../dropdown/basic/Dropdown";
import {DropdownItemObj} from "../../interfaces/AppInterfaces";
import {DropdownItemText} from "../dropdown/items/DropdownItemText/DropdownItemText";
import {ILogicalOperand} from "../../rules/rule-editor/RuleEditor";
import {DropdownItemIcon} from "../dropdown/items/DropdownItemIcon/DropdownItemIcon";

import iconsData from "./data/icons.json";
import {EmojiSelection} from "../emoji/emoji-selection/EmojiSelection";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	value?:string | null,
	label?:string,
	required?: boolean,
	help?: string,
	labelStyle?: React.CSSProperties,
	onChange?: (value: string) => void,
	validate?: InputValidateCallback<string>,
	validateOnChange?: boolean
}

export const IconSelector: React.FC<Props> = ({
										   value,
										   label,
										   required=false,
										   help,
										   labelStyle={},
										   onChange,
										   validate,
										   validateOnChange=false

}) => {

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange);

	const [selectedIcon, setSelectedIcon] = useState(value === undefined || value === null ? "" : value);

	const dispatchChange = (selectedIcon: string) => {
		setSelectedIcon(selectedIcon);
		if (onChange) {
			onChange(selectedIcon)
		}
		handleChangeValidation(selectedIcon);
	}

	const handleBlur = () => {
		handleBlurValidation(selectedIcon);
	}

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
			<div
				className={"blue-orange-icon-selector" + (isError ? " blue-orange-icon-selector-invalid" : "")}
				onBlur={handleBlur}>
				<Dropdown filter={true} onSelection={(item: DropdownItemObj) => dispatchChange(item.reference)}>
					{iconsData.map((item, index) => (
						<DropdownItemIcon
							key={item.value + "-" + index}
							label={item.label}
							value={"<i class=\"" + item.value + "\"></i>"}
							selected={value == "<i class=\"" + item.value + "\"></i>"}
							src={item.value}></DropdownItemIcon>
					))}
				</Dropdown>
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>

	);
};