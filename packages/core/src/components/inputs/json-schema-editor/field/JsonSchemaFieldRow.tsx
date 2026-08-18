import React, {useState} from "react";

import './JsonSchemaFieldRow.css'
import {FilterRow} from "../../../filters/filter-row/FilterRow";
import {FilterRowSegment} from "../../../filters/filter-row-segment/FilterRowSegment";
import {FilterRowAction} from "../../../filters/filter-row-action/FilterRowAction";
import {Dropdown} from "../../dropdown/basic/Dropdown";
import {DropdownItemIcon} from "../../dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {Input} from "../../input/Input";
import {Checkbox} from "../../checkbox/Checkbox";
import {JsonSchemaAddField} from "../add-field/JsonSchemaAddField";
import {ButtonSize} from "../../../buttons/button/Button";
import {
	JSON_SCHEMA_TYPES,
	JsonSchemaField,
	JsonSchemaFieldType,
	getJsonSchemaTypeDescriptor,
	isJsonSchemaStruct
} from "../JsonSchemaTypes";

interface Props {
	field: JsonSchemaField;
	/** How deep the field sits — the root list is 0. */
	depth: number;
	/** How far a struct may be nested before Struct stops being offered. */
	maxDepth: number;
	/** Another field at the same level already uses this key. */
	duplicate?: boolean;
	disabled?: boolean;
	/** The size of the add field button inside a struct. */
	buttonSize?: ButtonSize;
	onChange: (field: JsonSchemaField) => void;
	onDelete: () => void;
	/** Builds the empty field a nested struct starts a new member from. */
	createField: () => JsonSchemaField;
}

/**
 * One row of the JsonSchemaEditor — a name, a Java type, an array flag and, for
 * a struct, the indented block of members underneath it.
 *
 * The row renders its own children, so a struct and a struct array are the same
 * thing at every level of the tree.
 */
export const JsonSchemaFieldRow: React.FC<Props> = ({
														field,
														depth,
														maxDepth,
														duplicate = false,
														disabled = false,
														buttonSize = ButtonSize.SMALL,
														onChange,
														onDelete,
														createField}) => {

	const [expanded, setExpanded] = useState(true);

	const isStruct = isJsonSchemaStruct(field);

	const children = field.fields ?? [];

	// a struct at the depth limit could not show what it holds, so it is not offered
	const canNest = depth < maxDepth - 1;

	const updateKey = (key: string) => {
		onChange({...field, key: key});
	}

	const updateType = (type: string) => {
		// the dropdown reports its selection on mount too — only a real change matters
		if (type === field.type || !(type in JsonSchemaFieldType)) {
			return;
		}
		const updated: JsonSchemaField = {...field, type: type as JsonSchemaFieldType};
		if (updated.type === JsonSchemaFieldType.OBJECT) {
			// a struct always opens with a member to fill in
			updated.fields = children.length > 0 ? children : [createField()];
			setExpanded(true);
		} else {
			// the members are kept so switching back and forth does not lose them
			updated.fields = children.length > 0 ? children : undefined;
		}
		onChange(updated);
	}

	const updateArray = (array: boolean) => {
		onChange({...field, array: array});
	}

	const updateChild = (index: number, child: JsonSchemaField) => {
		onChange({...field, fields: children.map((item, position) => position === index ? child : item)});
	}

	const deleteChild = (index: number) => {
		onChange({...field, fields: children.filter((item, position) => position !== index)});
	}

	const addChild = () => {
		setExpanded(true);
		onChange({...field, fields: [...children, createField()]});
	}

	const isDuplicateChildKey = (child: JsonSchemaField, index: number): boolean => {
		const key = child.key.trim();
		if (key.length === 0) {
			return false;
		}
		return children.some((item, position) => position !== index && item.key.trim() === key);
	}

	return (
		<div className="blue-orange-json-schema-field">
			<FilterRow fullWidth={true} classes="blue-orange-json-schema-field-row">
				<FilterRowSegment
					control={isStruct}
					onClick={isStruct ? () => setExpanded(!expanded) : undefined}
					classes="blue-orange-json-schema-field-toggle">
					{isStruct
						? <i className={expanded ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"}></i>
						: <i className={getJsonSchemaTypeDescriptor(field.type).icon + " blue-orange-json-schema-field-leaf-icon"}></i>}
				</FilterRowSegment>
				<FilterRowSegment grow={true} classes="blue-orange-json-schema-field-key">
					<Input
						value={field.key}
						placeholder={"Field name"}
						isInvalid={duplicate}
						preventSpaces={true}
						onChange={updateKey}
						disabled={disabled}></Input>
				</FilterRowSegment>
				<FilterRowSegment
					control={true}
					classes="blue-orange-json-schema-field-type">
					<Dropdown
						filter={true}
						disabled={disabled}
						onSelection={(item) => updateType(item.reference)}
						contextWidth={220}>
						{JSON_SCHEMA_TYPES.map((descriptor) => (
							<DropdownItemIcon
								key={descriptor.type}
								src={descriptor.icon}
								label={descriptor.label}
								value={descriptor.type}
								selected={field.type === descriptor.type}
								disabled={descriptor.type === JsonSchemaFieldType.OBJECT && !canNest}></DropdownItemIcon>
						))}
					</Dropdown>
				</FilterRowSegment>
				<FilterRowSegment classes="blue-orange-json-schema-field-array">
					<Checkbox
						checked={field.array}
						readonly={disabled}
						onCheckboxChange={updateArray}></Checkbox>
					<span className="blue-orange-json-schema-field-array-label">Array</span>
				</FilterRowSegment>
				<FilterRowAction
					icon="ri-close-line"
					label={"Delete"}
					disabled={disabled}
					onClick={onDelete}></FilterRowAction>
			</FilterRow>
			{isStruct && expanded &&
				<div className="blue-orange-json-schema-field-children">
					{children.map((child, index) => (
						<JsonSchemaFieldRow
							key={child.id ?? index}
							field={child}
							depth={depth + 1}
							maxDepth={maxDepth}
							duplicate={isDuplicateChildKey(child, index)}
							disabled={disabled}
							buttonSize={buttonSize}
							onChange={(updated) => updateChild(index, updated)}
							onDelete={() => deleteChild(index)}
							createField={createField}></JsonSchemaFieldRow>
					))}
					<JsonSchemaAddField size={buttonSize} disabled={disabled} onClick={addChild}></JsonSchemaAddField>
				</div>
			}
		</div>
	)
}
