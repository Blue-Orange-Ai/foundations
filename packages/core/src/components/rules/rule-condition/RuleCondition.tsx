import React, {useState} from "react";

import './RuleCondition.css'
import {TagInput} from "../../inputs/tags/simple/TagInput";
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";
import {DropdownItemIcon} from "../../inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {DropdownItemText} from "../../inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {Input} from "../../inputs/input/Input";
import {Checkbox} from "../../inputs/checkbox/Checkbox";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {ICondition, IOperand, IRuleSchemaProperty} from "../rule-editor/RuleEditor";
import {RuleContainer} from "../rule-container/RuleContainer";
import {DateInput} from "../../inputs/date/datepicker/inputs/dateinput/DateInput";
import {TimePrecision} from "../../inputs/date/datepicker/items/datecontextwindowsingle/DateContextWindowSingle";

interface Props {
	condition: ICondition,
	schema: Array<IRuleSchemaProperty>,
	onChange?: (condition: ICondition) => void,
	onDelete?: () => void,
}

export const RuleCondition: React.FC<Props> = ({condition, schema, onChange, onDelete}) => {

	const [internalCondition, setInternalCondition] = useState(condition);

	const variableSelectionStyle: React.CSSProperties = {
		backgroundColor: "#e0e1e2",
		fontSize: "0.8rem"
	}

	const matchSelectionStyle: React.CSSProperties = {
		flexShrink: "0",
		border: "none",
		fontWeight: "600",
		textAlign: "center",
		fontSize: "0.8rem"
	}

	const parseDateOrDefault = (dateString: string): Date => {
		const parsedDate = new Date(dateString);
		if (isNaN(parsedDate.getTime())) {

			return new Date(); // Return the current date if parsing fails
		}
		return parsedDate;
	}

	const parseStringOrDefault = (input: string): string => {
		const trimmedInput = input.trim();
		if (trimmedInput) {
			return trimmedInput;
		}
		return "";
	}

	const getIconFromSchemaType = (schemaTypeName: string, schemaTypeValue: string): string => {
		if (schemaTypeName.endsWith("[]")) {
			return "ri-brackets-line"
		} else if (schemaTypeName.indexOf("[]") < 0 && schemaTypeValue == "String") {
			return "ri-paragraph"
		} else if (schemaTypeName.indexOf("[]") < 0 && schemaTypeValue == "Number") {
			return "ri-hashtag"
		} else if (schemaTypeName.indexOf("[]") < 0 && schemaTypeValue == "Date") {
			return "ri-calendar-fill"
		} else if (schemaTypeName.indexOf("[]") < 0 && schemaTypeValue == "Boolean") {
			return "ri-toggle-line"
		}
		return "ri-braces-fill"
	}

	const getNormalizedType = (schemaProperty: IRuleSchemaProperty | undefined): string => {
		if (schemaProperty == undefined) {
			return "UNKNOWN";
		}
		if (schemaProperty.key.endsWith("[]")) {
			return "ARRAY"
		} else if (schemaProperty.key.indexOf("[]") < 0 && schemaProperty.value == "String") {
			return "TEXT"
		} else if (schemaProperty.key.indexOf("[]") < 0 && schemaProperty.value == "Number") {
			return "NUMBER"
		} else if (schemaProperty.key.indexOf("[]") < 0 && schemaProperty.value == "Date") {
			return "DATE"
		} else if (schemaProperty.key.indexOf("[]") < 0 && schemaProperty.value == "Boolean") {
			return "BOOLEAN"
		}
		return "UNKNOWN"
	}

	const getNormalizedArrayType = (schemaProperty: IRuleSchemaProperty | undefined): string => {
		if (schemaProperty.value == "String") {
			return "STRING"
		} else if (schemaProperty.value == "Number") {
			return "NUMBER"
		} else if (schemaProperty.value == "Date") {
			return "DATE"
		}
		return "UNKNOWN"
	}

	const isDisabled = (schemaTypeName: string): boolean => {
		if (schemaTypeName.endsWith("[]")) {
			return false;
		} else if (schemaTypeName.indexOf("[]") < 0) {
			return false;
		}
		return true;
	}

	const getSchemaPropertyFromVariableName = (variableName: string): IRuleSchemaProperty => {
		for (var i=0; i < schema.length; i++) {
			if (schema[i].key == variableName) {
				return schema[i];
			}
		}
		return undefined;
	}

	const updateVariable = (variable: string) => {
		if (variable != "-1") {
			var modCondition = internalCondition;
			modCondition.variable = variable;
			setInternalCondition(modCondition);
			updateCondition(modCondition);
		} else {
			var modCondition = internalCondition;
			modCondition.variable = schema[0].key;
			setInternalCondition(modCondition);
			updateCondition(modCondition);
		}
	}

	const updateDateComparison = (comparison: Date) => {
		var modCondition = internalCondition;
		modCondition.comparison = comparison.toISOString();
		setInternalCondition(modCondition);
		updateCondition(modCondition);
	}

	const updateComparison = (comparison: string) => {
		var modCondition = internalCondition;
		modCondition.comparison = comparison;
		setInternalCondition(modCondition);
		updateCondition(modCondition);
	}

	const updateMatchCase = (state: boolean) => {
		var modCondition = internalCondition;
		modCondition.ignoreCase = !state;
		setInternalCondition(modCondition);
		updateCondition(modCondition);
	}

	const castToIOperand = (value: string): IOperand | null => {
		if (value in IOperand) {
			return value as IOperand;
		}
		return null; // Return null if the string is not a valid enum value
	}

	const updateOperand = (operand: string) => {
		const updatedOperand = castToIOperand(operand);
		if (updatedOperand) {
			var modCondition = internalCondition;
			modCondition.operand = updatedOperand;
			setInternalCondition(modCondition);
			updateCondition(modCondition);
		}
	}

	const updateCondition = (condition: ICondition) => {
		if (onChange) {
			onChange(condition)
		}
	}

	const removeCondition = (condition: ICondition) => {
		if (onDelete) {
			onDelete()
		}
	}

	const determineComparisonInputType = () => {
		const schemaProperty = getSchemaPropertyFromVariableName(internalCondition.variable);
		if (schemaProperty == undefined) {
			return "UNKNOWN";
		}
		if (schemaProperty.key != "Array" && schemaProperty.value == "Date" && internalCondition.operand.indexOf("RELATIVE") < 0) {
			return "Date";
		} else if (schemaProperty.value == "String" &&
			internalCondition.operand != "ARRAY_LENGTH_EQUAL" &&
			internalCondition.operand != "ARRAY_LENGTH_GREATER_THAN" &&
			internalCondition.operand != "ARRAY_LENGTH_GREATER_THAN_OR_EQUAL" &&
			internalCondition.operand != "ARRAY_LENGTH_LESS_THAN" &&
			internalCondition.operand != "ARRAY_LENGTH_LESS_THAN_OR_EQUAL") {
			return "String";
		}
		return "Number";
	}

	return (
		<div className={"blue-orange-rule-condition-cont"}>
			<div className={"blue-orange-rule-condition-start-text"}>Value of</div>
			<div className={"blue-orange-rule-condition-variable-selection"}>
				<Dropdown filter={true} style={variableSelectionStyle} onSelection={(item) => updateVariable(item.reference)}>
					{schema.map((item, index) => (
						<DropdownItemIcon
							key={item.key}
							src={getIconFromSchemaType(item.key, item.value)}
							label={index + "-" + item.key}
							value={item.key}
							selected={internalCondition.variable == item.key}
							disabled={isDisabled(item.key)}></DropdownItemIcon>
					))}
				</Dropdown>
			</div>
			<div className={"blue-orange-rule-condition-match-selection"}>
				{getNormalizedType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "STRING" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)}>
						<DropdownItemText label={"Equals"} value={"EQUALS"} selected={"EQUALS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Not Equals"} value={"NOT_EQUALS"} selected={"NOT_EQUALS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Contains"} value={"CONTAINS"} selected={"CONTAINS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Ends With"} value={"ENDS_WITH"} selected={"ENDS_WITH" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Starts With"} value={"STARTS_WITH"} selected={"STARTS_WITH" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Regex"} value={"REGEX"} selected={"REGEX" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
				{getNormalizedType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "NUMBER" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)}>
						<DropdownItemText label={"equals"} value={"EQUALS"} selected={"EQUALS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"does not equal"} value={"NOT_EQUALS"} selected={"NOT_EQUALS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is greater than"} value={"GREATER_THAN"} selected={"GREATER_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is greater than or equal to"} value={"GREATER_THAN_OR_EQUAL_TO"} selected={"GREATER_THAN_OR_EQUAL_TO" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is less than"} value={"LESS_THAN"} selected={"LESS_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is less than or equal to"} value={"LESS_THAN_OR_EQUAL_TO"} selected={"LESS_THAN_OR_EQUAL_TO" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
				{getNormalizedType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "BOOLEAN" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)}>
						<DropdownItemText label={"is true"} value={"EQUALS"} selected={"EQUALS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is false"} value={"NOT_EQUALS"} selected={"NOT_EQUALS" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
				{getNormalizedType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "DATE" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)}>
						<DropdownItemText label={"equals"} value={"EQUALS"} selected={"EQUALS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"does not equal"} value={"NOT_EQUALS"} selected={"NOT_EQUALS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is before"} value={"DATE_BEFORE_SPECIFIC"} selected={"DATE_BEFORE_SPECIFIC" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is before today plus"} value={"DATE_BEFORE_RELATIVE"} selected={"DATE_BEFORE_RELATIVE" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is after"} value={"DATE_AFTER_SPECIFIC"} selected={"DATE_AFTER_SPECIFIC" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is after today plus"} value={"DATE_AFTER_RELATIVE"} selected={"DATE_AFTER_RELATIVE" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
				{getNormalizedType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "ARRAY" &&
					getNormalizedArrayType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "STRING" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)}>
						<DropdownItemText label={"array length equal to"} value={"ARRAY_LENGTH_EQUAL"} selected={"ARRAY_LENGTH_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length greater than"} value={"ARRAY_LENGTH_GREATER_THAN"} selected={"ARRAY_LENGTH_GREATER_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length greater than or equal to"} value={"ARRAY_LENGTH_GREATER_THAN_OR_EQUAL"} selected={"ARRAY_LENGTH_GREATER_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length less than"} value={"ARRAY_LENGTH_LESS_THAN"} selected={"ARRAY_LENGTH_LESS_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length less than or equal to"} value={"ARRAY_LENGTH_LESS_THAN_OR_EQUAL"} selected={"ARRAY_LENGTH_LESS_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a value equal to"} value={"ARRAY_CONTAINS"} selected={"ARRAY_CONTAINS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a value that contains"} value={"ARRAY_CONTAINS_STRING_CONTAINING"} selected={"ARRAY_CONTAINS_STRING_CONTAINING" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a value that matches starts with"} value={"ARRAY_CONTAINS_STRING_STARTS_WITH"} selected={"ARRAY_CONTAINS_STRING_STARTS_WITH" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a value that matches ends with"} value={"ARRAY_CONTAINS_STRING_ENDS_WITH"} selected={"ARRAY_CONTAINS_STRING_ENDS_WITH" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a value that matches regex"} value={"ARRAY_CONTAINS_STRING_REGEX"} selected={"ARRAY_CONTAINS_STRING_REGEX" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is after"} value={"DATE_AFTER_SPECIFIC"} selected={"DATE_AFTER_SPECIFIC" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is after today plus"} value={"DATE_AFTER_RELATIVE"} selected={"DATE_AFTER_RELATIVE" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
				{getNormalizedType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "ARRAY" &&
					getNormalizedArrayType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "NUMBER" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)}>
						<DropdownItemText label={"array length equal to"} value={"ARRAY_LENGTH_EQUAL"} selected={"ARRAY_LENGTH_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length greater than"} value={"ARRAY_LENGTH_GREATER_THAN"} selected={"ARRAY_LENGTH_GREATER_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length greater than or equal to"} value={"ARRAY_LENGTH_GREATER_THAN_OR_EQUAL"} selected={"ARRAY_LENGTH_GREATER_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length less than"} value={"ARRAY_LENGTH_LESS_THAN"} selected={"ARRAY_LENGTH_LESS_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length less than or equal to"} value={"ARRAY_LENGTH_LESS_THAN_OR_EQUAL"} selected={"ARRAY_LENGTH_LESS_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a value equal to"} value={"ARRAY_CONTAINS"} selected={"ARRAY_CONTAINS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a sum of"} value={"ARRAY_SUM_EQUAL"} selected={"ARRAY_SUM_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a sum greater than"} value={"ARRAY_SUM_GREATER_THAN"} selected={"ARRAY_SUM_GREATER_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a sum greater than or equal to"} value={"ARRAY_SUM_GREATER_THAN_OR_EQUAL"} selected={"ARRAY_SUM_GREATER_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a sum less than"} value={"ARRAY_SUM_LESS_THAN"} selected={"ARRAY_SUM_LESS_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a sum less than or equal to"} value={"ARRAY_SUM_LESS_THAN_OR_EQUAL"} selected={"ARRAY_SUM_LESS_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a median equal to"} value={"ARRAY_MEDIAN_EQUAL"} selected={"ARRAY_MEDIAN_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a median greater than"} value={"ARRAY_MEDIAN_GREATER_THAN"} selected={"ARRAY_MEDIAN_GREATER_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a median greater than or equal to"} value={"ARRAY_MEDIAN_GREATER_THAN_OR_EQUAL"} selected={"ARRAY_MEDIAN_GREATER_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a median less than"} value={"ARRAY_MEDIAN_LESS_THAN"} selected={"ARRAY_MEDIAN_LESS_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a median less than or equal to"} value={"ARRAY_MEDIAN_LESS_THAN_OR_EQUAL"} selected={"ARRAY_MEDIAN_LESS_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a mean equal to"} value={"ARRAY_MEAN_EQUAL"} selected={"ARRAY_MEAN_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a mean greater than"} value={"ARRAY_MEAN_GREATER_THAN"} selected={"ARRAY_MEAN_GREATER_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a mean greater than or equal to"} value={"ARRAY_MEAN_GREATER_THAN_OR_EQUAL"} selected={"ARRAY_MEAN_GREATER_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a mean less than"} value={"ARRAY_MEAN_LESS_THAN"} selected={"ARRAY_MEAN_LESS_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a mean less than or equal to"} value={"ARRAY_MEAN_LESS_THAN_OR_EQUAL"} selected={"ARRAY_MEAN_LESS_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
				{getNormalizedType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "ARRAY" &&
					getNormalizedArrayType(getSchemaPropertyFromVariableName(internalCondition.variable)) == "DATE" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)}>
						<DropdownItemText label={"array length equal to"} value={"ARRAY_LENGTH_EQUAL"} selected={"ARRAY_LENGTH_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length greater than"} value={"ARRAY_LENGTH_GREATER_THAN"} selected={"ARRAY_LENGTH_GREATER_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length greater than or equal to"} value={"ARRAY_LENGTH_GREATER_THAN_OR_EQUAL"} selected={"ARRAY_LENGTH_GREATER_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length less than"} value={"ARRAY_LENGTH_LESS_THAN"} selected={"ARRAY_LENGTH_LESS_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array length less than or equal to"} value={"ARRAY_LENGTH_LESS_THAN_OR_EQUAL"} selected={"ARRAY_LENGTH_LESS_THAN_OR_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a date of"} value={"ARRAY_CONTAINS_DATE_EQUAL"} selected={"ARRAY_CONTAINS_DATE_EQUAL" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a date before"} value={"ARRAY_CONTAINS_SPECIFIC_DATE_BEFORE"} selected={"ARRAY_CONTAINS_SPECIFIC_DATE_BEFORE" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a date before today plus"} value={"ARRAY_CONTAINS_RELATIVE_DATE_BEFORE"} selected={"ARRAY_CONTAINS_RELATIVE_DATE_BEFORE" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a date after"} value={"ARRAY_CONTAINS_SPECIFIC_DATE_AFTER"} selected={"ARRAY_CONTAINS_SPECIFIC_DATE_AFTER" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"array has a date after today plus"} value={"ARRAY_CONTAINS_RELATIVE_DATE_AFTER"} selected={"ARRAY_CONTAINS_RELATIVE_DATE_AFTER" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
			</div>
			<div className={"blue-orange-rule-condition-user-input"}>
				{determineComparisonInputType() != "Date" &&
					<Input
						value={parseStringOrDefault(internalCondition.comparison)}
						isNumber={determineComparisonInputType() == "Number"}
						onChange={updateComparison}
					></Input>
				}
				{determineComparisonInputType() == "Date" &&
					<DateInput
						value={parseDateOrDefault(internalCondition.comparison)}
						displayFormat={"yyyy-MM-DD HH:mm:ss"}
						showTime={true}
						timePrecision={TimePrecision.MILLISECOND}
						onChange={(value) => updateDateComparison(value)}></DateInput>
				}
			</div>
			{determineComparisonInputType() == "String" &&
				<div className={"blue-orange-rule-condition-checkbox"}>
					<Checkbox checked={!internalCondition.ignoreCase} onCheckboxChange={updateMatchCase}></Checkbox>
					<div className={"blue-orange-rule-condition-checkbox-label"}>
						Match Case
					</div>
				</div>
			}
			<div className={"blue-orange-rule-condition-checkbox"}>
				<ButtonIcon icon="ri-close-line" label={"Delete"} onClick={removeCondition}></ButtonIcon>
			</div>
		</div>
	)
}