import React, {useEffect, useState} from "react";

import './ArrayInput.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {Input} from "../input/Input";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {TagInput} from "../tags/simple/TagInput";
import {TextArea} from "../textarea/TextArea";

interface Props {
	value?: (string | number)[] | string[][];
	label?: string;
	placeholder?: string;
	isNumber?: boolean;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	onChange?: (value: (string | number)[] | string[][]) => void;
	disabled?: boolean;
	required?: boolean;
	help?: string;
	variant?: 'list' | 'tag-list' | 'textarea-list';
	whitelist?: string[];
	enforceWhitelist?: boolean;
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
	help,
	variant = 'list',
	whitelist,
	enforceWhitelist = false
}) => {

	const [items, setItems] = useState<(string | number)[]>(value as (string | number)[]);
	const [tagListItems, setTagListItems] = useState<string[][]>(value as string[][] || []);

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

	const handleTagListItemChange = (index: number, tags: string[]) => {
		const updatedItems = [...tagListItems];
		updatedItems[index] = tags;
		setTagListItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
	};

	const handleRemoveTagListItem = (index: number) => {
		const updatedItems = tagListItems.filter((_, i) => i !== index);
		setTagListItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
	};

	const handleAddTagListItem = () => {
		const updatedItems = [...tagListItems, []];
		setTagListItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
	};

	useEffect(() => {
		if (variant === 'tag-list') {
			setTagListItems(value as string[][] || []);
		} else {
			setItems(value as (string | number)[]);
		}
	}, [value, variant]);

	const buttonStyle: React.CSSProperties = {
		flexShrink: 0
	};

	if (variant === 'tag-list') {
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
						{tagListItems.map((tags, index) => (
							<div key={index} className="blue-orange-array-input-item">
								<TagInput
									initialTags={tags}
									whitelist={whitelist}
									enforceWhitelist={enforceWhitelist}
									placeholder={placeholder}
									onChange={(newTags) => handleTagListItemChange(index, newTags)}
									style={{flexGrow: 1}}
								/>
								<ButtonIcon
									icon="ri-close-line"
									style={buttonStyle}
									onClick={() => handleRemoveTagListItem(index)}
									isDisabled={disabled}
									label="Remove item"
								/>
							</div>
						))}
						<div className="blue-orange-array-input-add">
							<ButtonIcon
								icon="ri-add-line"
								style={buttonStyle}
								onClick={handleAddTagListItem}
								isDisabled={disabled}
								label="Add item"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (variant === 'textarea-list') {
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
							<div key={index} className="blue-orange-array-input-item blue-orange-array-input-item-textarea">
								<TextArea
									value={String(item)}
									placeholder={placeholder}
									onChange={(val) => handleItemChange(index, val)}
									disabled={disabled}
									style={{flexGrow: 1}}
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
	}

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
