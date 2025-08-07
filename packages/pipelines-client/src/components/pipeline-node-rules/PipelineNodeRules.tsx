import React, {useRef, useState} from "react";

import './PipelineNodeRules.css'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {
    CopyInput,
    Dropdown,
    DropdownItemIcon, Input,
    InputForm,
    RuleEditor,
    ILogicalOperand,
    IRule, IRuleState, IRuleType, IRuleSchemaProperty
} from "@blue-orange-ai/foundations-core";
import {JsonEditor} from "../code/json/JsonEditor";


interface Props {
}

export const PipelineNodeRules: React.FC<Props> = ({}) => {

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

    const [rule, setRule] = useState(rulePrimer);

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

    const ruleChange = (r: IRule) => {
        setRule((prevState) => ({
            ...prevState,
            ...r
        }));
    }

    return (
        <InputForm verticalMargin={24} paddingBottom={80} paddingTop={20}>
            <RuleEditor rule={rule} onChange={ruleChange} schema={schema}></RuleEditor>
        </InputForm>
    )
}