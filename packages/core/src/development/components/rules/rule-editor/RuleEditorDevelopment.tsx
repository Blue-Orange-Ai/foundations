import React, {useState} from "react";

import './RuleEditorDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
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
				<PaddedPage>
					<PageHeading>Rule Editor</PageHeading>
					<RuleEditor rule={rule} onChange={ruleChange} schema={schema}></RuleEditor>
				</PaddedPage>
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