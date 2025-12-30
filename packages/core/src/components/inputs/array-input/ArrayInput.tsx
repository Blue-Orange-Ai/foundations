import React, {useEffect, useState} from "react";

import './ArrayInput.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {Input} from "../input/Input";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";

interface Props {
	value?: (string | number)[];
	label?: string;
	placeholder?: string;
	isNumber?: boolean;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	onChange?: (value: (string | number)[]) => void;
	disabled?: boolean;
	required?: boolean;
	help?: string;
}

export const ArrayInput: React.FC<Props> = ({
	value = [],
	label,
	placeholder = "",
	isNumber = false,
	style = {},
	labelStyle = {},
	onChange,
	disabled = false,
	required = false,
	help
}) => {

	const [items, setItems] = useState<(string | number)[]>(value);

	const handleItemChange = (index: number, newValue: string) => {
		const updatedItems = [...items];
		updatedItems[index] = isNumber ? (newValue === "" ? "" : Number(newValue)) : newValue;
		setItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
	};

	const handleRemoveItem = (index: number) => {
		const updatedItems = items.filter((_, i) => i !== index);
		setItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
	};

	const handleAddItem = () => {
		const newItem = isNumber ? 0 : "";
		const updatedItems = [...items, newItem];
		setItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
	};

	useEffect(() => {
		setItems(value);
	}, [value]);

	const buttonStyle: React.CSSProperties = {
		flexShrink: 0
	};

	return (
		<div className="blue-orange-default-input-cont" style={style}>
			{label && (
				<div className="blue-orange-default-input-label-cont" style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			)}
			<div className="blue-orange-array-input-items-cont">
				<div className="blue-orange-array-input-bar"></div>
				<div className="blue-orange-array-input-items">
					{items.map((item, index) => (
						<div key={index} className="blue-orange-array-input-item">
							<Input
								value={String(item)}
								placeholder={placeholder}
								isNumber={isNumber}
								onChange={(val) => handleItemChange(index, val)}
								disabled={disabled}
							/>
							<ButtonIcon
								icon="ri-close-line"
								style={buttonStyle}
								onClick={() => handleRemoveItem(index)}
								isDisabled={disabled}
								label="Remove item"
							/>
						</div>
					))}
					<div className="blue-orange-array-input-add">
						<ButtonIcon
							icon="ri-add-line"
							style={buttonStyle}
							onClick={handleAddItem}
							isDisabled={disabled}
							label="Add item"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
