import React, {useState} from "react";

import './RuleGroup.css'
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";
import {DropdownItemText} from "../../inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {RuleContainer} from "../rule-container/RuleContainer";
import {Button, ButtonType} from "../../buttons/button/Button";
import {ICondition, IConditionType, ILogicalOperand, IOperand, IRuleSchemaProperty} from "../rule-editor/RuleEditor";
import {DropdownItemObj} from "../../interfaces/AppInterfaces";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";

interface Props {
	condition?: ICondition,
	deletable?: boolean,
	conditions?: Array<ICondition>,
	schema: Array<IRuleSchemaProperty>,
	logic?: IOperand,
	onChange: (condition: ICondition) => void,
	onDelete?: () => void,
}

export const RuleGroup: React.FC<Props> = ({condition, deletable=true, conditions, schema, logic, onChange, onDelete}) => {

	const initParentGroup = () : ICondition => {
		if (condition) {
			return condition;
		}
		return {
			cast: "",
			comparison: "",
			conditionType: IConditionType.GROUP,
			groupConditions: conditions,
			ignoreCase: false,
			negation: false,
			logic: logic,
			operand: IOperand.EQUALS,
			sub: undefined,
			variable: ""
		}
	}


	const [internalCondition, setInternalCondition] = useState(initParentGroup());

	const newCondition: ICondition = {
		cast: "",
		comparison: "",
		conditionType: IConditionType.LEAF,
		groupConditions: [],
		ignoreCase: false,
		negation: false,
		logic: ILogicalOperand.AND,
		operand: IOperand.EQUALS,
		sub: undefined,
		variable: ""
	}

	const newGroup: ICondition = {
		cast: "",
		comparison: "",
		conditionType: IConditionType.GROUP,
		groupConditions: [],
		ignoreCase: false,
		negation: false,
		logic: ILogicalOperand.AND,
		operand: IOperand.EQUALS,
		sub: undefined,
		variable: ""
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
		dispatchChange(modCondition);
		setInternalCondition(modCondition);
	}

	const logicalChange = (value: string) => {
		if (internalCondition.logic == ILogicalOperand.AND && value == "OR") {
			internalCondition.logic = ILogicalOperand.OR;
			dispatchChange(internalCondition);
			setInternalCondition(internalCondition);
		} else if (internalCondition.logic == ILogicalOperand.OR && value == "AND") {
			internalCondition.logic = ILogicalOperand.AND;
			dispatchChange(internalCondition);
			setInternalCondition(internalCondition);
		}
	}

	const updateChildCondition = (index: number, c: ICondition) => {
		var condition = internalCondition;
		condition.groupConditions[index] = c
		updateCondition(condition);
	}

	const updateCondition = (condition: ICondition) => {
		setInternalCondition(condition);
		dispatchChange(condition);
	}

	const handleDelete = (index: number) => {
		var modCondition = internalCondition;
		modCondition.groupConditions.splice(index, 1);
		updateCondition(modCondition);
	}

	const dispatchChange = (condition: ICondition) => {
		if (onChange) {
			onChange(condition);
		}
	}

	const removeCondition = (condition: ICondition) => {
		if (onDelete) {
			onDelete()
		}
	}

	return (
		<div className={"blue-orange-rule-group-cont"}>
			<div className="blue-orange-rule-group-cont-vertical-line"></div>
			<div className="blue-orange-rule-group-header">
				<div className="blue-orange-rule-group-operand-selection">
					<Dropdown style={{backgroundColor: "#283747", paddingLeft: "10px"}} onSelection={(item: DropdownItemObj) => logicalChange(item.reference)}>
						<DropdownItemText label={"All of the following are true"} value={"AND"}
										  selected={internalCondition.logic == ILogicalOperand.AND}></DropdownItemText>
						<DropdownItemText label={"Any of the following are true"} value={"OR"}
										  selected={internalCondition.logic == ILogicalOperand.OR}></DropdownItemText>
					</Dropdown>
				</div>
				{deletable && <ButtonIcon icon="ri-close-line" label={"Delete"} onClick={removeCondition}></ButtonIcon>}
			</div>
			{internalCondition.groupConditions.map((item, index) => (
				<RuleContainer
					key={index + "-" + item.id}
					index={item}
					condition={item}
					schema={schema}
					logicalOperand={internalCondition.logic}
					onChange={(c) => updateChildCondition(index, c)}
					onDelete={() => handleDelete(index)}
				></RuleContainer>
			))}
			<div className="blue-orange-rule-group-add-btns">
				<Button text={"Add Condition"} buttonType={ButtonType.PRIMARY} onClick={() => addCondition()}></Button>
				<Button text={"Add Group"} buttonType={ButtonType.PRIMARY} onClick={() => addGroup()}></Button>
			</div>
		</div>
	)
}