import React from "react";
import {ButtonSize} from "../button/Button";

import './ButtonToggle.css';

export interface IButtonToggleOption {
	value: string;
	label: string;
	icon?: string;
}

interface Props {
	options: Array<IButtonToggleOption>;
	value: string;
	onChange: (value: string) => void;
	size?: ButtonSize;
	isDisabled?: boolean;
	style?: React.CSSProperties;
}

const sizeClassName: Record<ButtonSize, string> = {
	[ButtonSize.SMALL]: "foundations-btn-toggle-sm",
	[ButtonSize.MEDIUM]: "",
	[ButtonSize.LARGE]: "foundations-btn-toggle-lg",
};

export const ButtonToggle: React.FC<Props> = ({
												  options,
												  value,
												  onChange,
												  size = ButtonSize.MEDIUM,
												  isDisabled = false,
												  style = {}}) => {

	const sizeClass = sizeClassName[size] ? " " + sizeClassName[size] : "";

	const containerClass = "foundations-btn-toggle no-select" + sizeClass +
		(isDisabled ? " foundations-btn-toggle-disabled" : "");

	const handleClick = (optionValue: string) => {
		if (isDisabled || optionValue === value) return;
		onChange(optionValue);
	};

	return (
		<div className={containerClass} style={style}>
			{options.map((option) => {
				const active = option.value === value;
				const itemClass = active
					? "foundations-btn-toggle-item foundations-btn-toggle-item-active"
					: "foundations-btn-toggle-item";
				return (
					<div
						key={option.value}
						className={itemClass}
						onClick={() => handleClick(option.value)}
					>
						{option.icon && <i className={option.icon + " foundations-btn-toggle-icon"}></i>}
						<span>{option.label}</span>
					</div>
				);
			})}
		</div>
	);
}
