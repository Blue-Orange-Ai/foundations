import React, {useState} from "react";

import './SearchQueryGroup.css'
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";
import {DropdownItemText} from "../../inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {Button, ButtonType} from "../../buttons/button/Button";
import {DropdownItemObj} from "../../interfaces/AppInterfaces";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {
	IBlueOrangeSearchSchemaProperty,
	ISearchQueryEditorCondition,
	SearchQueryConditionType,
	SearchQueryLeafOperand,
	SearchQueryLogicalOperand
} from "../search-query-editor/SearchQueryEditor";
import {SearchQueryContainer} from "../search-query-container/SearchQueryContainer";

interface Props {
	condition?: ISearchQueryEditorCondition,
	deletable?: boolean,
	conditions?: Array<ISearchQueryEditorCondition>,
	schema: Array<IBlueOrangeSearchSchemaProperty>,
	logic?: SearchQueryLogicalOperand,
	onChange: (condition: ISearchQueryEditorCondition) => void,
	onDelete?: () => void,
}

export const SearchQueryGroup: React.FC<Props> = ({condition, deletable=true, conditions, schema, logic, onChange, onDelete}) => {

	const initParentGroup = () : ISearchQueryEditorCondition => {
		if (condition) {
			return condition;
		}
		const firstField = schema.length > 0 ? schema[0].apiName : "";
		return {
			comparison: "",
			conditionType: SearchQueryConditionType.GROUP,
			groupConditions: conditions as ISearchQueryEditorCondition[],
			ignoreCase: false,
			logic: logic as SearchQueryLogicalOperand,
			operand: SearchQueryLeafOperand.PHRASE,
			variable: firstField
		}
	}

	const [internalCondition, setInternalCondition] = useState(initParentGroup());

	const newCondition: ISearchQueryEditorCondition = {
		comparison: "",
		conditionType: SearchQueryConditionType.LEAF,
		groupConditions: [],
		ignoreCase: false,
		logic: SearchQueryLogicalOperand.AND,
		operand: SearchQueryLeafOperand.PHRASE,
		variable: schema.length > 0 ? schema[0].apiName : ""
	}

	const newGroup: ISearchQueryEditorCondition = {
		comparison: "",
		conditionType: SearchQueryConditionType.GROUP,
		groupConditions: [],
		ignoreCase: false,
		logic: SearchQueryLogicalOperand.AND,
		operand: SearchQueryLeafOperand.PHRASE,
		variable: schema.length > 0 ? schema[0].apiName : ""
	}

	const dispatchChange = (updated: ISearchQueryEditorCondition) => {
		if (onChange) {
			onChange(updated);
		}
	}

	const addCondition = () => {
		var modCondition = internalCondition;
		modCondition.groupConditions.push(newCondition);
		setInternalCondition(modCondition);
		dispatchChange(modCondition);
	}

	const addGroup = () => {
		var modCondition = internalCondition;
		modCondition.groupConditions.push(newGroup);
		setInternalCondition(modCondition);
		dispatchChange(modCondition);
	}

	const logicalChange = (value: string) => {
		if (internalCondition.logic == SearchQueryLogicalOperand.AND && value == "OR") {
			internalCondition.logic = SearchQueryLogicalOperand.OR;
			dispatchChange(internalCondition);
			setInternalCondition(internalCondition);
		} else if (internalCondition.logic == SearchQueryLogicalOperand.OR && value == "AND") {
			internalCondition.logic = SearchQueryLogicalOperand.AND;
			dispatchChange(internalCondition);
			setInternalCondition(internalCondition);
		}
	}

	const updateChildCondition = (index: number, c: ISearchQueryEditorCondition) => {
		var modCondition = internalCondition;
		modCondition.groupConditions[index] = c
		updateCondition(modCondition);
	}

	const updateCondition = (updated: ISearchQueryEditorCondition) => {
		setInternalCondition(updated);
		dispatchChange(updated);
	}

	const handleDelete = (index: number) => {
		var modCondition = internalCondition;
		modCondition.groupConditions.splice(index, 1);
		updateCondition(modCondition);
	}

	const removeCondition = () => {
		if (onDelete) {
			onDelete()
		}
	}

	return (
		<div className={"blue-orange-search-query-group-cont"}>
			<div className="blue-orange-search-query-group-cont-vertical-line"></div>
			<div className="blue-orange-search-query-group-header">
				<div className="blue-orange-search-query-group-operand-selection">
					<Dropdown style={{backgroundColor: "#283747", paddingLeft: "10px"}} onSelection={(item: DropdownItemObj) => logicalChange(item.reference)}>
						<DropdownItemText label={"All of the following are true"} value={"AND"}
									  selected={internalCondition.logic == SearchQueryLogicalOperand.AND}></DropdownItemText>
						<DropdownItemText label={"Any of the following are true"} value={"OR"}
									  selected={internalCondition.logic == SearchQueryLogicalOperand.OR}></DropdownItemText>
					</Dropdown>
				</div>
				{deletable && <ButtonIcon icon="ri-close-line" label={"Delete"} onClick={() => removeCondition()}></ButtonIcon>}
			</div>
			{internalCondition.groupConditions.map((item, index) => (
				<SearchQueryContainer
					key={index + "-" + item.id}
					condition={item}
					schema={schema}
					logicalOperand={internalCondition.logic}
					onChange={(c) => updateChildCondition(index, c)}
					onDelete={() => handleDelete(index)}
				></SearchQueryContainer>
			))}
			<div className="blue-orange-search-query-group-add-btns-cont">
				<Button text={"Add Condition"} buttonType={ButtonType.PRIMARY} onClick={() => addCondition()}></Button>
				<Button text={"Add Group"} buttonType={ButtonType.PRIMARY} onClick={() => addGroup()}></Button>
			</div>
		</div>
	)
}
