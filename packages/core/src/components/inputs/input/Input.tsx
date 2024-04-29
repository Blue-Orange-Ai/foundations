import React, {useEffect, useRef, useState} from "react";

import './Input.css';
import {TippyHTMLElement} from "../../../interfaces/AppInterfaces";
import tippy from "tippy.js";

interface Props {
	value?:string;
	placeholder: string;
	isEmail?: boolean;
	preventSpaces?:boolean;
	style?: React.CSSProperties;
	isPassword?: boolean;
	onInputChange?: (value: string) => void;
	focus?: boolean;
	focusChange?: (state: boolean) => void;
}

export const Input: React.FC<Props> = ({
										   value,
										   placeholder,
										   onInputChange,
										   isPassword,
										   isEmail,
										   preventSpaces,
										   style={},
										   focus=false,
										   focusChange
}) => {

	const [inputValue, setInputValue] = useState(value === undefined ? "" : value);

	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleKeydownChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if ((preventSpaces || isEmail) && (event.key === "Space" || event.key === " ")) {
			event.preventDefault();
		}
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setInputValue(newValue);
		if (onInputChange) {
			onInputChange(newValue);
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

	useEffect(() => {
		if (focus) {
			inputRef.current?.focus();
		}
	}, []);

	return (
		<input
			ref={inputRef}
			className="blue-orange-input"
			style={style}
			placeholder={placeholder}
			value={inputValue === undefined ? "" : inputValue}
			onKeyDown={handleKeydownChange}
			onChange={handleInputChange}
			type={generateType()}
		/>
	);
};