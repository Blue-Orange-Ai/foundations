import React, {useEffect, useRef, useState} from "react";

import './TimeInput.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";

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
}) => {

	const generateClassname = () => {
		var className = "blue-orange-input blue-orange-time-input";
		if (isInvalid) {
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
	};

	useEffect(() => {
		if (focus) {
			inputRef.current?.focus();
		}
	}, [focus]);

	useEffect(() => {
		setInputClassName(generateClassname());
	}, [isInvalid]);

	useEffect(() => {
		setInputValue(value === undefined ? "" : value);
	}, [value]);

	return (
		<div className="blue-orange-default-input-cont">
			{label &&
				<div className={"blue-orange-default-input-label-cont"} style={labelStyle}>
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
				onBlur={focusOut}
				type="time"
				disabled={disabled}
			/>
		</div>
	);
};
