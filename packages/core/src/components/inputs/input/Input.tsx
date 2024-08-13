import React, {useEffect, useRef, useState} from "react";

import './Input.css';
import {TippyHTMLElement} from "../../../interfaces/AppInterfaces";
import tippy from "tippy.js";

interface Props {
	value?:string;
	placeholder?: string;
	isEmail?: boolean;
	preventSpaces?:boolean;
	style?: React.CSSProperties;
	isPassword?: boolean;
	isInvalid?: boolean;
	onChange?: (value: string) => void;
	focus?: boolean;
	focusIn?: () => void;
	focusOut?: () => void;
	enterEvent?: () => void;
	validateKey?: (key: string) => boolean;
}

export const Input: React.FC<Props> = ({
										   value,
										   placeholder="",
										   onChange,
										   isPassword,
										   isInvalid,
										   isEmail,
										   preventSpaces,
										   style={},
										   focus=false,
										   focusIn,
										   focusOut,
	                                       enterEvent,
	                                       validateKey

}) => {

	const generateClassname = () => {
		var className = "blue-orange-input";
		if (isInvalid) {
			className += " blue-orange-input-invalid";
		}
		return className;
	}

	const [inputValue, setInputValue] = useState(value === undefined ? "" : value);

	const [inputClassName, setInputClassName] = useState(generateClassname());

	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleKeydownChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if ((preventSpaces || isEmail) && (event.key === "Space" || event.key === " ")) {
			event.preventDefault();
		} else if (validateKey && !validateKey(event.key)) {
			event.preventDefault();
		}
		if (event.key === "Enter" && enterEvent) {
			enterEvent();
		}
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setInputValue(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};

	const generateType = () => {
		if (isPassword) {
			return "password"
		} else if (isEmail) {
			return "email"
		}
		return "text";
	}

	const focusInEvent = () => {
		if (focusIn) {
			focusIn();
		}
	}

	const focusOutEvent = () => {
		if (focusOut) {
			focusOut();
		}
	}

	useEffect(() => {
		if (focus) {
			inputRef.current?.focus();
		}
	}, []);

	useEffect(() => {
		setInputClassName(generateClassname())
	}, [isInvalid]);

	useEffect(() => {
		if (inputRef.current && value) {
			inputRef.current.value = value;
			setInputValue(value);
		}
	}, [value]);

	return (
		<input
			ref={inputRef}
			className={inputClassName}
			style={style}
			placeholder={placeholder}
			value={inputValue === undefined ? "" : inputValue}
			onKeyDown={handleKeydownChange}
			onChange={handleInputChange}
			onFocus={focusInEvent}
			onBlur={focusOutEvent}
			type={generateType()}
		/>
	);
};