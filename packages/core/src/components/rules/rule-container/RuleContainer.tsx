import React from "react";

import './RuleContainer.css'
import {RuleCondition} from "../rule-condition/RuleCondition";
import {RuleGroup} from "../rule-group/RuleGroup";
import {Badge} from "../../text-decorations/badge/Badge";
import {ICondition, IConditionType, ILogicalOperand, IRuleSchemaProperty} from "../rule-editor/RuleEditor";

interface Props {
	condition: ICondition,
	schema: Array<IRuleSchemaProperty>,
	logicalOperand: ILogicalOperand,
	onChange?: (condition: ICondition) => void,
	onDelete?: () => void,
}

export const RuleContainer: React.FC<Props> = ({condition, schema, logicalOperand, onChange, onDelete}) => {

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

	return (
		<div className="blue-orange-rule-group-condition-cont">
			<div className="blue-orange-rule-condition-operand">
				<Badge style={{paddingTop: "6px", paddingBottom: "6px"}}>
					<div className="blue-orange-rule-condition-operand-cont">
						<i className="ri-circle-fill"></i>
						{ logicalOperand == ILogicalOperand.AND &&
							<div className="blue-orange-rule-condition-operand-text">AND</div>}
						{ logicalOperand == ILogicalOperand.OR &&
							<div className="blue-orange-rule-condition-operand-text">OR</div>}

					</div>
				</Badge>
			</div>
			<div className="blue-orange-rule-group-condition-block">
				{ condition.conditionType == IConditionType.LEAF && <RuleCondition condition={condition} schema={schema} onChange={updateCondition} onDelete={handleDelete}></RuleCondition>}
				{ condition.conditionType == IConditionType.GROUP && <RuleGroup condition={condition} schema={schema} onChange={updateCondition} onDelete={handleDelete}></RuleGroup>}
			</div>
		</div>
	)
}