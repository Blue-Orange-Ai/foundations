import React, {useEffect, useState} from "react";

import './ArrayInput.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {Input} from "../input/Input";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {TagInput} from "../tags/simple/TagInput";
import {TextArea} from "../textarea/TextArea";
import {AddressInput} from "../address/AddressInput";
import {PhoneInput} from "../phone/PhoneInput";
import {Address, Telephone} from "@blue-orange-ai/foundations-clients";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

type ArrayInputValue = (string | number)[] | string[][] | Address[] | Telephone[];

interface Props {
	value?: (string | number)[] | string[][] | Address[] | Telephone[];
	label?: string;
	placeholder?: string;
	isNumber?: boolean;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	onChange?: (value: (string | number)[] | string[][] | Address[] | Telephone[]) => void;
	disabled?: boolean;
	required?: boolean;
	help?: string;
	variant?: 'list' | 'tag-list' | 'textarea-list' | 'address-list' | 'phone-list';
	whitelist?: string[];
	enforceWhitelist?: boolean;
	validate?: InputValidateCallback<ArrayInputValue>;
	validateOnChange?: boolean;
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
	enforceWhitelist = false,
	validate,
	validateOnChange = false
}) => {

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<ArrayInputValue>(validate, validateOnChange);

	const [items, setItems] = useState<(string | number)[]>(value as (string | number)[]);
	const [tagListItems, setTagListItems] = useState<string[][]>(value as string[][] || []);
	const [addressItems, setAddressItems] = useState<Address[]>(value as Address[] || []);
	const [phoneItems, setPhoneItems] = useState<Telephone[]>(value as Telephone[] || []);

	const handleItemChange = (index: number, newValue: string) => {
		const updatedItems = [...items];
		updatedItems[index] = isNumber ? (newValue === "" ? "" : Number(newValue)) : newValue;
		setItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleChangeValidation(updatedItems);
	};

	const handleRemoveItem = (index: number) => {
		const updatedItems = items.filter((_, i) => i !== index);
		setItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleBlurValidation(updatedItems);
	};

	const handleAddItem = () => {
		const newItem = isNumber ? 0 : "";
		const updatedItems = [...items, newItem];
		setItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleBlurValidation(updatedItems);
	};

	const handleTagListItemChange = (index: number, tags: string[]) => {
		const updatedItems = [...tagListItems];
		updatedItems[index] = tags;
		setTagListItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleChangeValidation(updatedItems);
	};

	const handleRemoveTagListItem = (index: number) => {
		const updatedItems = tagListItems.filter((_, i) => i !== index);
		setTagListItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleBlurValidation(updatedItems);
	};

	const handleAddTagListItem = () => {
		const updatedItems = [...tagListItems, []];
		setTagListItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleBlurValidation(updatedItems);
	};

	const handleAddressItemChange = (index: number, address: Address) => {
		const updatedItems = [...addressItems];
		updatedItems[index] = address;
		setAddressItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleChangeValidation(updatedItems);
	};

	const handleRemoveAddressItem = (index: number) => {
		const updatedItems = addressItems.filter((_, i) => i !== index);
		setAddressItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleBlurValidation(updatedItems);
	};

	const handleAddAddressItem = () => {
		const newAddress: Address = {
			address: '',
			city: '',
			state: '',
			postcode: '',
			country: 'Australia'
		};
		const updatedItems = [...addressItems, newAddress];
		setAddressItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleBlurValidation(updatedItems);
	};

	const handlePhoneItemChange = (index: number, phone: Telephone) => {
		const updatedItems = [...phoneItems];
		updatedItems[index] = phone;
		setPhoneItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleChangeValidation(updatedItems);
	};

	const handleRemovePhoneItem = (index: number) => {
		const updatedItems = phoneItems.filter((_, i) => i !== index);
		setPhoneItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleBlurValidation(updatedItems);
	};

	const handleAddPhoneItem = () => {
		const newPhone: Telephone = {
			code: 'AU',
			country: 'Australia',
			extension: '+61',
			format: '',
			number: ''
		};
		const updatedItems = [...phoneItems, newPhone];
		setPhoneItems(updatedItems);
		if (onChange) {
			onChange(updatedItems);
		}
		handleBlurValidation(updatedItems);
	};

	useEffect(() => {
		if (variant === 'tag-list') {
			setTagListItems(value as string[][] || []);
		} else if (variant === 'address-list') {
			setAddressItems(value as Address[] || []);
		} else if (variant === 'phone-list') {
			setPhoneItems(value as Telephone[] || []);
		} else {
			setItems(value as (string | number)[]);
		}
	}, [value, variant]);

	const buttonStyle: React.CSSProperties = {
		flexShrink: 0
	};

	if (variant === 'address-list') {
		return (
			<div className="blue-orange-default-input-cont" style={style}>
				{label && (
					<div className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")} style={labelStyle}>
						{label}
						{help && <HelpIcon label={help}></HelpIcon>}
						{required && <RequiredIcon></RequiredIcon>}
					</div>
				)}
				<div className={"blue-orange-array-input-items-cont" + (isError ? " blue-orange-array-input-items-cont-error" : "")}>
					<div className="blue-orange-array-input-bar"></div>
					<div className="blue-orange-array-input-items">
						{addressItems.map((address, index) => (
							<div key={index} className="blue-orange-array-input-item blue-orange-array-input-item-address">
								<AddressInput
									address={address}
									onChange={(addr) => handleAddressItemChange(index, addr)}
									disabled={disabled}
								/>
								<ButtonIcon
									icon="ri-close-line"
									style={buttonStyle}
									onClick={() => handleRemoveAddressItem(index)}
									isDisabled={disabled}
									label="Remove address"
								/>
							</div>
						))}
						<div className="blue-orange-array-input-add">
							<ButtonIcon
								icon="ri-add-line"
								style={buttonStyle}
								onClick={handleAddAddressItem}
								isDisabled={disabled}
								label="Add address"
							/>
						</div>
					</div>
				</div>
				<InputValidationMessage result={validationResult}></InputValidationMessage>
			</div>
		);
	}

	if (variant === 'phone-list') {
		return (
			<div className="blue-orange-default-input-cont" style={style}>
				{label && (
					<div className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")} style={labelStyle}>
						{label}
						{help && <HelpIcon label={help}></HelpIcon>}
						{required && <RequiredIcon></RequiredIcon>}
					</div>
				)}
				<div className={"blue-orange-array-input-items-cont" + (isError ? " blue-orange-array-input-items-cont-error" : "")}>
					<div className="blue-orange-array-input-bar"></div>
					<div className="blue-orange-array-input-items">
						{phoneItems.map((phone, index) => (
							<div key={index} className="blue-orange-array-input-item blue-orange-array-input-item-phone">
								<PhoneInput
									telephone={phone}
									onChange={(tel) => handlePhoneItemChange(index, tel)}
									disabled={disabled}
								/>
								<ButtonIcon
									icon="ri-close-line"
									style={buttonStyle}
									onClick={() => handleRemovePhoneItem(index)}
									isDisabled={disabled}
									label="Remove phone"
								/>
							</div>
						))}
						<div className="blue-orange-array-input-add">
							<ButtonIcon
								icon="ri-add-line"
								style={buttonStyle}
								onClick={handleAddPhoneItem}
								isDisabled={disabled}
								label="Add phone"
							/>
						</div>
					</div>
				</div>
				<InputValidationMessage result={validationResult}></InputValidationMessage>
			</div>
		);
	}

	if (variant === 'tag-list') {
		return (
			<div className="blue-orange-default-input-cont" style={style}>
				{label && (
					<div className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")} style={labelStyle}>
						{label}
						{help && <HelpIcon label={help}></HelpIcon>}
						{required && <RequiredIcon></RequiredIcon>}
					</div>
				)}
				<div className={"blue-orange-array-input-items-cont" + (isError ? " blue-orange-array-input-items-cont-error" : "")}>
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
				<InputValidationMessage result={validationResult}></InputValidationMessage>
			</div>
		);
	}

	if (variant === 'textarea-list') {
		return (
			<div className="blue-orange-default-input-cont" style={style}>
				{label && (
					<div className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")} style={labelStyle}>
						{label}
						{help && <HelpIcon label={help}></HelpIcon>}
						{required && <RequiredIcon></RequiredIcon>}
					</div>
				)}
				<div className={"blue-orange-array-input-items-cont" + (isError ? " blue-orange-array-input-items-cont-error" : "")}>
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
				<InputValidationMessage result={validationResult}></InputValidationMessage>
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
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	);
};
