import React, {useState} from "react";

import './SearchQueryCondition.css'
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";
import {DropdownItemIcon} from "../../inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {DropdownItemText} from "../../inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {Input} from "../../inputs/input/Input";
import {Checkbox} from "../../inputs/checkbox/Checkbox";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {DateInput} from "../../inputs/date/datepicker/inputs/dateinput/DateInput";
import {TimePrecision} from "../../inputs/date/datepicker/items/datecontextwindowsingle/DateContextWindowSingle";
import {
	IBlueOrangeSearchSchemaProperty,
	ISearchQueryEditorCondition,
	SearchQueryLeafOperand
} from "../search-query-editor/SearchQueryEditor";

interface Props {
	condition: ISearchQueryEditorCondition,
	schema: Array<IBlueOrangeSearchSchemaProperty>,
	onChange?: (condition: ISearchQueryEditorCondition) => void,
	onDelete?: () => void,
}

export const SearchQueryCondition: React.FC<Props> = ({condition, schema, onChange, onDelete}) => {

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

	const normalizeSchemaType = (schemaType: string): string => {
		const normalized = schemaType.toUpperCase();
		if (normalized == "INTEGER" || normalized == "LONG" || normalized == "FLOAT" || normalized == "DOUBLE") {
			return "NUMBER";
		}
		if (normalized == "DATE") {
			return "DATE";
		}
		if (normalized == "BOOLEAN") {
			return "BOOLEAN";
		}
		return "STRING";
	}

	const getSchemaPropertyFromVariableName = (variableName: string): IBlueOrangeSearchSchemaProperty | undefined => {
		for (var i=0; i < schema.length; i++) {
			if (schema[i].apiName == variableName) {
				return schema[i];
			}
		}
		return undefined;
	}

	const getIconFromSchemaProperty = (schemaProperty: IBlueOrangeSearchSchemaProperty | undefined): string => {
		if (!schemaProperty) {
			return "ri-braces-fill";
		}
		const normalized = schemaProperty.type.toUpperCase();
		if (normalized == "BOOLEAN") {
			return "ri-toggle-line";
		}
		if (normalized == "DATE") {
			return "ri-calendar-fill";
		}
		if (normalized == "GEO_POINT") {
			return "ri-map-pin-line";
		}
		if (normalized == "VECTOR") {
			return "ri-radar-line";
		}
		if (normalized == "OBJECT") {
			return "ri-braces-fill";
		}
		if (normalized == "KEYWORDS" || normalized == "TEXT" || normalized == "SEARCH_AS_YOU_TYPE") {
			return "ri-paragraph";
		}
		if (normalized == "INTEGER" || normalized == "LONG" || normalized == "FLOAT" || normalized == "DOUBLE") {
			return "ri-hashtag";
		}
		return "ri-paragraph";
	}

	const updateVariable = (variable: string) => {
		if (variable != "-1") {
			var modCondition = internalCondition;
			modCondition.variable = variable;
			setInternalCondition(modCondition);
			updateCondition(modCondition);
		} else if (schema.length > 0) {
			var modCondition = internalCondition;
			modCondition.variable = schema[0].apiName;
			setInternalCondition(modCondition);
			updateCondition(modCondition);
		}
	}

	const updateComparison = (comparison: string) => {
		var modCondition = internalCondition;
		modCondition.comparison = comparison;
		setInternalCondition(modCondition);
		updateCondition(modCondition);
	}

	const updateDateComparison = (comparison: Date) => {
		var modCondition = internalCondition;
		modCondition.comparison = comparison.toISOString();
		setInternalCondition(modCondition);
		updateCondition(modCondition);
	}

	const updateMatchCase = (state: boolean) => {
		var modCondition = internalCondition;
		modCondition.ignoreCase = !state;
		setInternalCondition(modCondition);
		updateCondition(modCondition);
	}

	const updateOperand = (operand: string) => {
		if (operand in SearchQueryLeafOperand) {
			var modCondition = internalCondition;
			modCondition.operand = operand as SearchQueryLeafOperand;
			setInternalCondition(modCondition);
			updateCondition(modCondition);
		}
	}

	const updateCondition = (updated: ISearchQueryEditorCondition) => {
		if (onChange) {
			onChange(updated)
		}
	}

	const removeCondition = () => {
		if (onDelete) {
			onDelete()
		}
	}

	const parseDateOrDefault = (dateString: string): Date => {
		const parsedDate = new Date(dateString);
		if (isNaN(parsedDate.getTime())) {
			return new Date();
		}
		return parsedDate;
	}

	const determineComparisonInputType = () => {
		const schemaProperty = getSchemaPropertyFromVariableName(internalCondition.variable);
		const normalizedType = normalizeSchemaType(schemaProperty?.type ?? "");
		if (normalizedType == "DATE") {
			return "Date";
		}
		if (normalizedType == "NUMBER") {
			return "Number";
		}
		if (normalizedType == "BOOLEAN") {
			return "Boolean";
		}
		return "String";
	}

	const normalizedType = normalizeSchemaType(getSchemaPropertyFromVariableName(internalCondition.variable)?.type ?? "");

	return (
		<div className={"blue-orange-search-query-condition-cont"}>
			<div className={"blue-orange-search-query-condition-start-text"}>Value of</div>
			<div className={"blue-orange-search-query-condition-variable-selection"}>
				<Dropdown filter={true} style={variableSelectionStyle} onSelection={(item) => updateVariable(item.reference)} contextWidth="fit-content">
					{schema.map((item) => (
						<DropdownItemIcon
							key={item.apiName}
							src={getIconFromSchemaProperty(item)}
							label={item.displayName ?? item.apiName}
							value={item.apiName}
							selected={internalCondition.variable == item.apiName}
							disabled={false}></DropdownItemIcon>
					))}
				</Dropdown>
			</div>
			<div className={"blue-orange-search-query-condition-match-selection"}>
				{normalizedType == "STRING" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)} contextWidth="fit-content">
						<DropdownItemText label={"Equals"} value={"PHRASE"} selected={"PHRASE" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Starts With"} value={"PHRASE_PREFIX"} selected={"PHRASE_PREFIX" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Fuzzy"} value={"FUZZY"} selected={"FUZZY" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Regex"} value={"REGEX"} selected={"REGEX" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Wildcard"} value={"WILDCARD"} selected={"WILDCARD" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Full Text"} value={"FULL_TEXT"} selected={"FULL_TEXT" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Geo Distance (JSON)"} value={"GEO_DISTANCE"} selected={"GEO_DISTANCE" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Geo Bounding Box (JSON)"} value={"GEO_BOUNDING_BOX"} selected={"GEO_BOUNDING_BOX" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"Geo Polygon (JSON)"} value={"GEO_POLYGON"} selected={"GEO_POLYGON" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"KNN (JSON)"} value={"KNN"} selected={"KNN" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
				{(normalizedType == "NUMBER" || normalizedType == "DATE") &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)} contextWidth="fit-content">
						<DropdownItemText label={"equals"} value={"EQUALS"} selected={"EQUALS" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is greater than"} value={"GREATER_THAN"} selected={"GREATER_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is greater than or equal to"} value={"GREATER_THAN_OR_EQUAL_TO"} selected={"GREATER_THAN_OR_EQUAL_TO" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is less than"} value={"LESS_THAN"} selected={"LESS_THAN" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is less than or equal to"} value={"LESS_THAN_OR_EQUAL_TO"} selected={"LESS_THAN_OR_EQUAL_TO" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
				{normalizedType == "BOOLEAN" &&
					<Dropdown style={matchSelectionStyle} onSelection={(item) => updateOperand(item.reference)} contextWidth="fit-content">
						<DropdownItemText label={"is true"} value={"TRUE"} selected={"TRUE" == condition.operand}></DropdownItemText>
						<DropdownItemText label={"is false"} value={"FALSE"} selected={"FALSE" == condition.operand}></DropdownItemText>
					</Dropdown>
				}
			</div>
			<div className={"blue-orange-search-query-condition-user-input"}>
				{determineComparisonInputType() != "Date" && determineComparisonInputType() != "Boolean" &&
					<Input
						value={String(internalCondition.comparison ?? "")}
						isNumber={determineComparisonInputType() == "Number"}
						placeholder={
							internalCondition.operand == SearchQueryLeafOperand.GEO_DISTANCE ? '{"distance":"10km","location":{"lat":-33.86,"lng":151.21}}' :
							internalCondition.operand == SearchQueryLeafOperand.GEO_BOUNDING_BOX ? '{"topLeft":{"lat":-33.0,"lng":151.0},"bottomRight":{"lat":-34.0,"lng":152.0}}' :
							internalCondition.operand == SearchQueryLeafOperand.GEO_POLYGON ? '{"locations":[{"lat":-33.0,"lng":151.0},{"lat":-34.0,"lng":152.0},{"lat":-35.0,"lng":151.5}]}' :
							internalCondition.operand == SearchQueryLeafOperand.KNN ? '{"vector":[0.1,0.2],"k":5,"numCandidates":100}' :
							""
						}
						onChange={updateComparison}
					></Input>
				}
				{determineComparisonInputType() == "Date" &&
					<DateInput
						value={parseDateOrDefault(String(internalCondition.comparison ?? ""))}
						displayFormat={"yyyy-MM-DD HH:mm:ss"}
						showTime={true}
						timePrecision={TimePrecision.MILLISECOND}
						onChange={(value) => updateDateComparison(value)}></DateInput>
				}
			</div>
			{normalizedType == "STRING" &&
				(internalCondition.operand == SearchQueryLeafOperand.REGEX || internalCondition.operand == SearchQueryLeafOperand.WILDCARD) &&
				<div className={"blue-orange-search-query-condition-checkbox"}>
					<Checkbox checked={!internalCondition.ignoreCase} onCheckboxChange={updateMatchCase}></Checkbox>
					<div className={"blue-orange-search-query-condition-checkbox-label"}>
						Match Case
					</div>
				</div>
			}
			<div className={"blue-orange-search-query-condition-checkbox"}>
				<ButtonIcon icon="ri-close-line" label={"Delete"} onClick={() => removeCondition()}></ButtonIcon>
			</div>
		</div>
	)
}
