import React from "react";

import './JsonObjectTextDevelopment.css'
import {JsonObjectText} from "../../../../components/text-decorations/json-object-text/JsonObjectText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SAMPLE_OBJECT = {
	site: "Melbourne Depot",
	status: "Operational",
	capabilities: ["Storage", "Dispatch"],
	lastInspected: "2026-08-12"
};

const JSON_OBJECT_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "obj",
		type: "any",
		required: true,
		value: SAMPLE_OBJECT,
		description: "The value to stringify. Anything JSON.stringify accepts will do."
	},
	{
		name: "prettyPrint",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Indents the output over several lines instead of keeping it to one."
	}
];

interface Props {
}

export const JsonObjectTextDevelopment: React.FC<Props> = ({}) => {

	const simpleObject = { name: "John", age: 30 };
	const complexObject = {
		user: {
			id: 1,
			name: "Jane Doe",
			email: "jane@example.com",
			roles: ["admin", "user"],
			settings: {
				theme: "dark",
				notifications: true
			}
		}
	};
	const arrayObject = [1, 2, 3, { nested: "value" }];

	return (
		<ComponentDoc
			title="JSON Object Text"
			description="Renders an object as JSON — on one line where it has to fit in a cell, or indented where there is room to read it."
			name="JsonObjectText"
			previewHeight={160}
			previewCentered={false}
			props={JSON_OBJECT_TEXT_PROPS}
			preview={values => (
				<JsonObjectText obj={values.obj} prettyPrint={values.prettyPrint}></JsonObjectText>
			)}>

			<GeneralHeading>Simple Object (Single Line)</GeneralHeading>
			<JsonObjectText obj={simpleObject} />

			<GeneralHeading>Simple Object (Pretty Print)</GeneralHeading>
			<JsonObjectText obj={simpleObject} prettyPrint={true} />

			<GeneralHeading>Complex Object (Single Line)</GeneralHeading>
			<JsonObjectText obj={complexObject} />

			<GeneralHeading>Complex Object (Pretty Print)</GeneralHeading>
			<JsonObjectText obj={complexObject} prettyPrint={true} />

			<GeneralHeading>Array Object (Pretty Print)</GeneralHeading>
			<JsonObjectText obj={arrayObject} prettyPrint={true} />
		</ComponentDoc>
	)
}
