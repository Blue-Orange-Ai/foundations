import React, {useState} from "react";

import './RuleEditorDevelopment.css'
import {
	ILogicalOperand,
	IRule, IRuleSchemaProperty,
	IRuleState,
	IRuleType,
	RuleEditor
} from "../../../../components/rules/rule-editor/RuleEditor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {ButtonSize} from "../../../../components/buttons/button/Button";

const RULE_EDITOR_PROPS: Array<PropSpec> = [
	{
		name: "rule",
		type: "IRule",
		required: true,
		description: "The rule being edited — its name, its top level logic and the conditions under it."
	},
	{
		name: "schema",
		type: "Array<IRuleSchemaProperty>",
		required: true,
		description: "What the rule is allowed to test. Each property's type decides which operands are offered against it."
	},
	{
		name: "showHeader",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the bar naming the rule."
	},
	{
		name: "headerEditable",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Lets the rule's name be changed from that bar."
	},
	{
		name: "buttonSize",
		type: "ButtonSize",
		default: "ButtonSize.SMALL",
		defaultValue: ButtonSize.SMALL,
		control: "select",
		options: [
			{label: "Small", value: ButtonSize.SMALL, code: "ButtonSize.SMALL"},
			{label: "Medium", value: ButtonSize.MEDIUM, code: "ButtonSize.MEDIUM"},
			{label: "Large", value: ButtonSize.LARGE, code: "ButtonSize.LARGE"}
		],
		description: "How large the add condition and add group buttons are."
	},
	{
		name: "onChange",
		type: "(rule: IRule) => void",
		description: "Fires with the whole rule whenever any part of it changes."
	}
];

interface Props {
}

export const RuleEditorDevelopment: React.FC<Props> = ({}) => {

	const rulePrimer: IRule = {
		logic: ILogicalOperand.AND,
		conditions: [],
		description: "This rule is only designed to test the interface and not any of the functionality",
		expectedInput: {},
		falseMessage: "",
		groupId: "",
		lastEdit: new Date(),
		lastEditor: "",
		name: "Test Rule",
		rank: 0,
		state: IRuleState.ACTIVE,
		trueMessage: "",
		type: IRuleType.CONDITION,
		weight: 0
	}

	const schema: Array<IRuleSchemaProperty> = [
		{
			key: "array[]",
			value: "Number"
		},
		{
			key: "array-obj[].name",
			value: "String"
		},
		{
			key: "array-obj[].age",
			value: "Number"
		},
		{
			key: "array-obj[].job",
			value: "String"
		},
		{
			key: "boolean",
			value: "Boolean"
		},
		{
			key: "color",
			value: "String"
		},
		{
			key: "number",
			value: "Number"
		},
		{
			key: "object.nested-object.created",
			value: "Date"
		},
		{
			key: "string",
			value: "String"
		}
	]

	const generateRuleStr = (rule: IRule) => {
		return JSON.stringify(rule, null, 2);
	}

	const [rule, setRule] = useState(rulePrimer);

	const [ruleStr, setRuleStr] = useState(generateRuleStr(rulePrimer));

	const ruleChange = (r: IRule) => {
		setRule(r);
		setRuleStr(generateRuleStr(r));
	}

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Rule Editor"
					description="A builder for a boolean rule: conditions joined by AND or OR, nested into groups as deep as they need to go. The schema says what can be tested and what type each property is, which is what decides the operands offered for it."
					name="RuleEditor"
					previewHeight={340}
					previewCentered={false}
					imports={["IRule", "IRuleSchemaProperty", "ButtonSize"]}
					props={RULE_EDITOR_PROPS}
					preview={values => (
						<div style={{width: "100%"}}>
							<RuleEditor
								rule={rule}
								schema={schema}
								showHeader={values.showHeader}
								headerEditable={values.headerEditable}
								buttonSize={values.buttonSize}
								onChange={() => {}}></RuleEditor>
						</div>
					)}>
					<RuleEditor rule={rule} onChange={ruleChange} schema={schema}></RuleEditor>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{ruleStr}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>

	)
}