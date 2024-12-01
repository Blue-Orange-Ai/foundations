import React, {useState} from "react";

import './RuleEditor.css'
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {RuleGroup} from "../rule-group/RuleGroup";
import {Paragraph} from "../../text-decorations/paragraph/Paragraph";
import {Description} from "../../text-decorations/description/Description";
import {GeneralHeading} from "../../text-decorations/general-heading/GeneralHeading";


export enum IConditionType {
	LEAF="LEAF",
	GROUP="GROUP"
}

export enum ILogicalOperand {
	AND="AND",
	OR="OR",
	EMPTY="EMPTY"
}

export enum IOperand {
	EQUALS="EQUALS",
	NOT_EQUALS="NOT_EQUALS",
	GREATER_THAN="GREATER_THAN",
	GREATER_THAN_OR_EQUAL_TO="GREATER_THAN_OR_EQUAL_TO",
	LESS_THAN="LESS_THAN",
	LESS_THAN_OR_EQUAL_TO="LESS_THAN_OR_EQUAL_TO",
	TRUE="TRUE",
	FALSE="FALSE",
	CONTAINS="CONTAINS",
	ENDS_WITH="ENDS_WITH",
	STARTS_WITH="STARTS_WITH",
	REGEX="REGEX",
	DATE_BEFORE_SPECIFIC="DATE_BEFORE_SPECIFIC",
	DATE_BEFORE_RELATIVE="DATE_BEFORE_RELATIVE",
	DATE_AFTER_SPECIFIC="DATE_AFTER_SPECIFIC",
	DATE_AFTER_RELATIVE="DATE_AFTER_RELATIVE",
	ARRAY_LENGTH_EQUAL="ARRAY_LENGTH_EQUAL",
	ARRAY_LENGTH_GREATER_THAN="ARRAY_LENGTH_GREATER_THAN",
	ARRAY_LENGTH_GREATER_THAN_OR_EQUAL="ARRAY_LENGTH_GREATER_THAN_OR_EQUAL",
	ARRAY_LENGTH_LESS_THAN="ARRAY_LENGTH_LESS_THAN",
	ARRAY_LENGTH_LESS_THAN_OR_EQUAL="ARRAY_LENGTH_LESS_THAN_OR_EQUAL",
	ARRAY_CONTAINS="ARRAY_CONTAINS",
	ARRAY_SUM_EQUAL="ARRAY_SUM_EQUAL",
	ARRAY_SUM_GREATER_THAN="ARRAY_SUM_GREATER_THAN",
	ARRAY_SUM_GREATER_THAN_OR_EQUAL="ARRAY_SUM_GREATER_THAN_OR_EQUAL",
	ARRAY_SUM_LESS_THAN="ARRAY_SUM_LESS_THAN",
	ARRAY_SUM_LESS_THAN_OR_EQUAL="ARRAY_SUM_LESS_THAN_OR_EQUAL",
	ARRAY_MEDIAN_EQUAL="ARRAY_MEDIAN_EQUAL",
	ARRAY_MEDIAN_GREATER_THAN="ARRAY_MEDIAN_GREATER_THAN",
	ARRAY_MEDIAN_GREATER_THAN_OR_EQUAL="ARRAY_MEDIAN_GREATER_THAN_OR_EQUAL",
	ARRAY_MEDIAN_LESS_THAN="ARRAY_MEDIAN_LESS_THAN",
	ARRAY_MEDIAN_LESS_THAN_OR_EQUAL="ARRAY_MEDIAN_LESS_THAN_OR_EQUAL",
	ARRAY_MEAN_EQUAL="ARRAY_MEAN_EQUAL",
	ARRAY_MEAN_GREATER_THAN="ARRAY_MEAN_GREATER_THAN",
	ARRAY_MEAN_GREATER_THAN_OR_EQUAL="ARRAY_MEAN_GREATER_THAN_OR_EQUAL",
	ARRAY_MEAN_LESS_THAN="ARRAY_MEAN_LESS_THAN",
	ARRAY_MEAN_LESS_THAN_OR_EQUAL="ARRAY_MEAN_LESS_THAN_OR_EQUAL",
	ARRAY_CONTAINS_DATE_EQUAL="ARRAY_CONTAINS_DATE_EQUAL",
	ARRAY_CONTAINS_SPECIFIC_DATE_BEFORE="ARRAY_CONTAINS_SPECIFIC_DATE_BEFORE",
	ARRAY_CONTAINS_SPECIFIC_DATE_AFTER="ARRAY_CONTAINS_SPECIFIC_DATE_AFTER",
	ARRAY_CONTAINS_RELATIVE_DATE_BEFORE="ARRAY_CONTAINS_RELATIVE_DATE_BEFORE",
	ARRAY_CONTAINS_RELATIVE_DATE_AFTER="ARRAY_CONTAINS_RELATIVE_DATE_AFTER",
	ARRAY_CONTAINS_STRING_STARTS_WITH="ARRAY_CONTAINS_STRING_STARTS_WITH",
	ARRAY_CONTAINS_STRING_ENDS_WITH="ARRAY_CONTAINS_STRING_ENDS_WITH",
	ARRAY_CONTAINS_STRING_CONTAINING="ARRAY_CONTAINS_STRING_CONTAINING",
	ARRAY_CONTAINS_STRING_REGEX="ARRAY_CONTAINS_STRING_REGEX",
	ARRAY_CONTAINS_OBJECT_PROPERTY="ARRAY_CONTAINS_OBJECT_PROPERTY"
}

export interface ICondition {
	id?: string,
	conditionType: IConditionType,
	logic: ILogicalOperand,
	operand: IOperand,
	negation: boolean,
	ignoreCase: boolean,
	variable: string,
	comparison: any,
	cast: string,
	sub: ICondition,
	groupConditions: Array<ICondition>
}

export enum IRuleState {
	ACTIVE="ACTIVE",
	TESTING="TESTING",
	INACTIVE="INACTIVE"
}

export enum IRuleType {
	IF="IF",
	ELSE_IF="ELSE_IF",
	ELSE="ELSE",
	CONDITION="CONDITION",
	WEIGHTED="WEIGHTED"
}

export interface IRuleSchemaProperty {
	key: string,
	value: string
}

export interface IRule {
	id?: string,
	state: IRuleState,
	rank: number,
	groupId: string,
	name: string,
	logic: ILogicalOperand,
	description: string,
	weight: number,
	type: IRuleType,
	trueMessage: string,
	falseMessage: string,
	conditions: Array<ICondition>,
	lastEditor: string,
	lastEdit: Date,
	expectedInput: any
}

interface Props {
	rule: IRule,
	schema: Array<IRuleSchemaProperty>,
	onChange?: (rule: IRule) => void
}

export const RuleEditor: React.FC<Props> = ({rule, schema, onChange}) => {

	const [internalRule, setInternalRule] = useState(rule);

	const updateRule = (condition: ICondition) => {
		var modRule = internalRule;
		modRule.conditions = condition.groupConditions;
		modRule.logic = condition.logic;
		if (onChange) {
			onChange(modRule);
		}
		setInternalRule(modRule);
	}

	return (
		<div className="blue-orange-rule-container">
			<div className="blue-orange-rule-header">
				<div className="blue-orange-rule-header-left-cont">
					<GeneralHeading>{rule.name}</GeneralHeading>
					<Description>{rule.description}</Description>
				</div>
				<div className="blue-orange-rule-header-controls">
					<ButtonIcon icon={"ri-edit-fill"} label={"Edit"}></ButtonIcon>
					<ButtonIcon icon={"ri-delete-bin-7-fill"} label={"Delete"}></ButtonIcon>
				</div>
			</div>
			<RuleGroup conditions={rule.conditions} deletable={false} logic={rule.logic} schema={schema} onChange={updateRule}></RuleGroup>
		</div>
	)
}