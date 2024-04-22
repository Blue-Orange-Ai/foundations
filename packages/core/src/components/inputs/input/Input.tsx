import React, {useRef, useState} from "react";

import './Input.css';

interface Props {
	value?:string;
	placeholder: string;
	isEmail?: boolean;
	preventSpaces?:boolean;
	style?: React.CSSProperties;
	isPassword?: boolean;
	onInputChange?: (value: string) => void; // Callback prop to send value to parent
}

export const Input: React.FC<Props> = ({
												  value,
												  placeholder,
												  onInputChange,
												  isPassword,
												  isEmail,
												  preventSpaces,
												  style={}}) => {

	const [inputValue, setInputValue] = useState(value === undefined ? "" : value);

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

	return (
		<input
			className="passport-login-input"
			style={style}
			placeholder={placeholder}
			value={inputValue === undefined ? "" : inputValue}
			onKeyDown={handleKeydownChange}
			onChange={handleInputChange}
			type={isPassword ? "password" : "text"}
		/>
	);
};