import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";

import './JsonSchemaEditor.css'
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";
import {JsonSchemaFieldRow} from "./field/JsonSchemaFieldRow";
import {JsonSchemaAddField} from "./add-field/JsonSchemaAddField";
import {JsonSchemaImportModal} from "./import-modal/JsonSchemaImportModal";
import {JsonSchemaField, JsonSchemaFieldType} from "./JsonSchemaTypes";
import {ButtonSize} from "../../buttons/button/Button";

interface Props {
	value?: JsonSchemaField[];
	label?: string;
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string;
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string;
	/** How many levels of fields are allowed, counting the root list. Defaults to 5. */
	maxDepth?: number;
	/**
	 * Offers a link alongside the label that opens a window for pasting in an
	 * example JSON object. The fields read out of it replace the schema.
	 */
	allowJsonImport?: boolean;
	/** The wording of that link. Defaults to "Infer from JSON". */
	jsonImportLabel?: string;
	/** The size of the add field buttons. Defaults to small. */
	buttonSize?: ButtonSize;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	onChange?: (value: JsonSchemaField[]) => void;
	disabled?: boolean;
	required?: boolean;
	help?: string;
	validate?: InputValidateCallback<JsonSchemaField[]>;
	validateOnChange?: boolean;
}

/**
 * Builds up an object schema a field at a time — each row names a field, picks a
 * Java type for it and flags whether it holds one value or a list. Choosing
 * Struct turns the row into a nested object whose own fields are edited in an
 * indented block underneath it, so a struct and a struct array are the same row
 * with the array flag set.
 *
 * The value is the field tree; {@link toJsonSchema} turns it into a JSON Schema
 * document and {@link fromJsonSchema} reads one back in.
 */
export const JsonSchemaEditor: React.FC<Props> = ({
													  value = [],
													  label,
													  name,
													  requiredMessage,
													  maxDepth = 5,
													  allowJsonImport = false,
													  jsonImportLabel = "Infer from JSON",
													  buttonSize = ButtonSize.SMALL,
													  style = {},
													  labelStyle = {},
													  onChange,
													  disabled = false,
													  required = false,
													  help,
													  validate,
													  validateOnChange = false}) => {

	/**
	 * Rows are keyed by an id rather than by their position, so renaming a field
	 * or deleting one from the middle of a struct leaves the rest untouched. Any
	 * field handed in without an id is given one, and it travels back out with
	 * the value.
	 */
	const withIds = (fields: JsonSchemaField[]): JsonSchemaField[] => {
		return fields.map(field => ({
			...field,
			id: field.id ?? uuidv4(),
			fields: field.fields ? withIds(field.fields) : field.fields
		}));
	}

	const [fields, setFields] = useState<JsonSchemaField[]>(withIds(value));

	const [importOpen, setImportOpen] = useState(false);

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<JsonSchemaField[]>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			value: fields ?? []
		});

	useEffect(() => {
		setFields(withIds(value));
	}, [value]);

	const createField = (): JsonSchemaField => {
		return {id: uuidv4(), key: "", type: JsonSchemaFieldType.STRING, array: false};
	}

	const updateFields = (updated: JsonSchemaField[]) => {
		setFields(updated);
		if (onChange) {
			onChange(updated);
		}
		handleChangeValidation(updated);
	}

	const updateField = (index: number, field: JsonSchemaField) => {
		updateFields(fields.map((item, position) => position === index ? field : item));
	}

	const deleteField = (index: number) => {
		const updated = fields.filter((item, position) => position !== index);
		setFields(updated);
		if (onChange) {
			onChange(updated);
		}
		handleBlurValidation(updated);
	}

	const applyInferredFields = (inferred: JsonSchemaField[]) => {
		const updated = withIds(inferred);
		setFields(updated);
		if (onChange) {
			onChange(updated);
		}
		handleBlurValidation(updated);
	}

	const addField = () => {
		const updated = [...fields, createField()];
		setFields(updated);
		if (onChange) {
			onChange(updated);
		}
		handleBlurValidation(updated);
	}

	// a field sharing its name with a sibling would overwrite it in the document
	const isDuplicateKey = (field: JsonSchemaField, index: number): boolean => {
		const key = field.key.trim();
		if (key.length === 0) {
			return false;
		}
		return fields.some((item, position) => position !== index && item.key.trim() === key);
	}

	return (
		<div className="blue-orange-default-input-cont" style={style}>
			{(label || allowJsonImport) &&
				<div className="blue-orange-json-schema-editor-header">
					<div
						className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
						style={labelStyle}>
						{label}
						{help && <HelpIcon label={help}></HelpIcon>}
						{required && <RequiredIcon></RequiredIcon>}
					</div>
					{allowJsonImport &&
						<span
							className={disabled
								? "blue-orange-json-schema-editor-import-link blue-orange-json-schema-editor-import-link-disabled"
								: "blue-orange-json-schema-editor-import-link"}
							role="button"
							aria-disabled={disabled}
							tabIndex={disabled ? -1 : 0}
							onClick={() => {
								if (!disabled) {
									setImportOpen(true);
								}
							}}
							onKeyDown={(event) => {
								if (!disabled && (event.key === "Enter" || event.key === " ")) {
									event.preventDefault();
									setImportOpen(true);
								}
							}}>
							<i className="ri-magic-line"></i>
							<span>{jsonImportLabel}</span>
						</span>
					}
				</div>
			}
			<div className={"blue-orange-json-schema-editor" + (isError ? " blue-orange-json-schema-editor-error" : "")}>
				{fields.map((field, index) => (
					<JsonSchemaFieldRow
						key={field.id ?? index}
						field={field}
						depth={0}
						maxDepth={maxDepth}
						duplicate={isDuplicateKey(field, index)}
						disabled={disabled}
						buttonSize={buttonSize}
						onChange={(updated) => updateField(index, updated)}
						onDelete={() => deleteField(index)}
						createField={createField}></JsonSchemaFieldRow>
				))}
				<JsonSchemaAddField size={buttonSize} disabled={disabled} onClick={addField}></JsonSchemaAddField>
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
			{allowJsonImport &&
				<JsonSchemaImportModal
					open={importOpen}
					title={jsonImportLabel}
					onClose={() => setImportOpen(false)}
					onInferred={applyInferredFields}></JsonSchemaImportModal>
			}
		</div>
	)
}
