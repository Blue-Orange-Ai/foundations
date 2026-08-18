import React, {useState} from "react";

import './RuleGroup.css'
import {RuleContainer} from "../rule-container/RuleContainer";
import {Button, ButtonIconPos, ButtonSize, ButtonType} from "../../buttons/button/Button";
import {ICondition, IConditionType, ILogicalOperand, IOperand, IRuleSchemaProperty} from "../rule-editor/RuleEditor";
import {FilterRow, FilterRowSize} from "../../filters/filter-row/FilterRow";
import {FilterRowSegment} from "../../filters/filter-row-segment/FilterRowSegment";
import {FilterRowAction} from "../../filters/filter-row-action/FilterRowAction";

interface Props {
	condition?: ICondition,
	deletable?: boolean,
	conditions?: Array<ICondition>,
	schema: Array<IRuleSchemaProperty>,
	logic?: ILogicalOperand,
	/** The size of the buttons that add a condition or a group. Defaults to small. */
	buttonSize?: ButtonSize,
	onChange: (condition: ICondition) => void,
	onDelete?: () => void,
}

export const RuleGroup: React.FC<Props> = ({condition, deletable=true, conditions, schema, logic,
											   buttonSize=ButtonSize.SMALL, onChange, onDelete}) => {

	const initParentGroup = () : ICondition => {
		if (condition) {
			return condition;
		}
		return {
			cast: "",
			comparison: "",
			conditionType: IConditionType.GROUP,
			groupConditions: conditions as ICondition[],
			ignoreCase: false,
			negation: false,
			logic: logic as ILogicalOperand,
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

	/*
	 * All and Any are the only two answers, so they are both on show and a single
	 * click swaps between them rather than a menu being opened to choose one.
	 */
	const logicOptionClasses = (selected: boolean): string => {
		return selected
			? "blue-orange-rule-group-logic-option blue-orange-rule-group-logic-option-selected"
			: "blue-orange-rule-group-logic-option";
	}

	return (
		<div className={"blue-orange-rule-group"}>
			<div className="blue-orange-rule-group-header">
				<FilterRow size={FilterRowSize.SMALL} classes="blue-orange-rule-group-logic">
					<FilterRowSegment muted={true} label={"Match"}></FilterRowSegment>
					<FilterRowSegment
						label={"All"}
						classes={logicOptionClasses(internalCondition.logic == ILogicalOperand.AND)}
						onClick={() => logicalChange("AND")}></FilterRowSegment>
					<FilterRowSegment
						label={"Any"}
						classes={logicOptionClasses(internalCondition.logic == ILogicalOperand.OR)}
						onClick={() => logicalChange("OR")}></FilterRowSegment>
					<FilterRowSegment muted={true} label={"of the following"}></FilterRowSegment>
					{deletable &&
						<FilterRowAction
							icon="ri-close-line"
							label={"Delete"}
							onClick={() => removeCondition(condition as ICondition)}></FilterRowAction>
					}
				</FilterRow>
			</div>
			<div className="blue-orange-rule-group-conditions">
				{internalCondition.groupConditions.map((item, index) => (
					<RuleContainer
						key={index + "-" + item.id}
						condition={item}
						schema={schema}
						logicalOperand={internalCondition.logic}
						showOperand={index > 0}
						buttonSize={buttonSize}
						onChange={(c) => updateChildCondition(index, c)}
						onDelete={() => handleDelete(index)}
					></RuleContainer>
				))}
				<div className="blue-orange-rule-group-add-btns">
					<Button text={"Add condition"} buttonType={ButtonType.SECONDARY} size={buttonSize}
							icon={"ri-add-line"} iconPos={ButtonIconPos.LEFT} onClick={() => addCondition()}></Button>
					<Button text={"Add group"} buttonType={ButtonType.SECONDARY} size={buttonSize}
							icon={"ri-node-tree"} iconPos={ButtonIconPos.LEFT} onClick={() => addGroup()}></Button>
				</div>
			</div>
		</div>
	)
}
