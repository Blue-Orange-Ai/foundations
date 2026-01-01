import React, {useEffect, useState} from "react";

import './ObjectArrayInput.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {Input} from "../input/Input";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {TagInput} from "../tags/simple/TagInput";
import {TextArea} from "../textarea/TextArea";

export type SchemaFieldType = 'input' | 'textarea' | 'number' | 'tag';

export interface SchemaField {
	key: string;
	label: string;
	type: SchemaFieldType;
	placeholder?: string;
	whitelist?: string[];
	enforceWhitelist?: boolean;
}

interface Props {
	value?: Record<string, any>[];
	label?: string;
	schema: SchemaField[];
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	onChange?: (value: Record<string, any>[]) => void;
	disabled?: boolean;
	required?: boolean;
	help?: string;
}

export const ObjectArrayInput: React.FC<Props> = ({
	value = [],
	label,
	schema,
	style = {},
	labelStyle = {},
	onChange,
	disabled = false,
	required = false,
	help
}) => {

	const [items, setItems] = useState<Record<string, any>[]>(value);

	const createEmptyObject = (): Record<string, any> => {
		const obj: Record<string, any> = {};
		schema.forEach(field => {
			if (field.type === 'number') {
				obj[field.key] = 0;
			} else if (field.type === 'tag') {
				obj[field.key] = [];
			} else {
				obj[field.key] = '';
			}
		});
		return obj;
	};

	const handleFieldChange = (itemIndex: number, fieldKey: string, newValue: any) => {
		const updatedItems = [...items];
		updatedItems[itemIndex] = {
			...updatedItems[itemIndex],
			[fieldKey]: newValue
		};
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
		const updatedItems = [...items, createEmptyObject()];
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

	const renderField = (field: SchemaField, itemIndex: number, fieldValue: any) => {
		switch (field.type) {
			case 'input':
				return (
					<Input
						label={field.label}
						value={String(fieldValue ?? '')}
						placeholder={field.placeholder}
						onChange={(val) => handleFieldChange(itemIndex, field.key, val)}
						disabled={disabled}
					/>
				);
			case 'textarea':
				return (
					<TextArea
						label={field.label}
						value={String(fieldValue ?? '')}
						placeholder={field.placeholder}
						onChange={(val) => handleFieldChange(itemIndex, field.key, val)}
						disabled={disabled}
					/>
				);
			case 'number':
				return (
					<Input
						label={field.label}
						value={String(fieldValue ?? 0)}
						placeholder={field.placeholder}
						isNumber={true}
						onChange={(val) => handleFieldChange(itemIndex, field.key, val === '' ? 0 : Number(val))}
						disabled={disabled}
					/>
				);
			case 'tag':
				return (
					<TagInput
						label={field.label}
						initialTags={Array.isArray(fieldValue) ? fieldValue : []}
						placeholder={field.placeholder}
						whitelist={field.whitelist}
						enforceWhitelist={field.enforceWhitelist}
						onChange={(tags) => handleFieldChange(itemIndex, field.key, tags)}
					/>
				);
			default:
				return null;
		}
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
			<div className="blue-orange-object-array-input-items-cont">
				<div className="blue-orange-object-array-input-bar"></div>
				<div className="blue-orange-object-array-input-items">
					{items.map((item, itemIndex) => (
						<div key={itemIndex} className="blue-orange-object-array-input-item">
							<div className="blue-orange-object-array-input-fields">
								{schema.map((field) => (
									<div key={field.key} className="blue-orange-object-array-input-field">
										{renderField(field, itemIndex, item[field.key])}
									</div>
								))}
							</div>
							<ButtonIcon
								icon="ri-close-line"
								style={buttonStyle}
								onClick={() => handleRemoveItem(itemIndex)}
								isDisabled={disabled}
								label="Remove item"
							/>
						</div>
					))}
					<div className="blue-orange-object-array-input-add">
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
