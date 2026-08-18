import React from "react";

import './RuleContainer.css'
import {RuleCondition} from "../rule-condition/RuleCondition";
import {RuleGroup} from "../rule-group/RuleGroup";
import {ICondition, IConditionType, ILogicalOperand, IRuleSchemaProperty} from "../rule-editor/RuleEditor";
import {ButtonSize} from "../../buttons/button/Button";

interface Props {
	condition: ICondition,
	schema: Array<IRuleSchemaProperty>,
	logicalOperand: ILogicalOperand,
	/**
	 * Names the operator joining this condition to the one above it. The first
	 * condition of a group has nothing to join onto, and the group already says
	 * how its conditions are matched, so it is left off there.
	 */
	showOperand?: boolean,
	buttonSize?: ButtonSize,
	onChange?: (condition: ICondition) => void,
	onDelete?: () => void,
}

export const RuleContainer: React.FC<Props> = ({condition, schema, logicalOperand, showOperand=true,
												   buttonSize=ButtonSize.SMALL, onChange, onDelete}) => {

	const handleDelete = () => {
		if (onDelete) {
			onDelete();
		}
	}

	const updateCondition = (c: ICondition) => {
		if (onChange) {
			onChange(c);
		}
	}

	/*
	 * The elbow tying the condition back onto its group's guide line is drawn at
	 * the height of the row it leads to, which an operator above it pushes down
	 * and a nested group's shorter header line raises.
	 */
	const generateClassName = (): string => {
		var className = "blue-orange-rule-condition-item";
		if (showOperand) {
			className += " blue-orange-rule-condition-item-joined";
		}
		if (condition.conditionType == IConditionType.GROUP) {
			className += " blue-orange-rule-condition-item-group";
		}
		return className;
	}

	return (
		<div className={generateClassName()}>
			{showOperand &&
				<div className="blue-orange-rule-condition-operand">
					{logicalOperand == ILogicalOperand.OR ? "or" : "and"}
				</div>
			}
			<div className="blue-orange-rule-condition-block">
				{ condition.conditionType == IConditionType.LEAF &&
					<RuleCondition condition={condition} schema={schema} onChange={updateCondition}
								   onDelete={handleDelete}></RuleCondition>}
				{ condition.conditionType == IConditionType.GROUP &&
					<RuleGroup condition={condition} schema={schema} buttonSize={buttonSize}
							   onChange={updateCondition} onDelete={handleDelete}></RuleGroup>}
			</div>
		</div>
	)
}
