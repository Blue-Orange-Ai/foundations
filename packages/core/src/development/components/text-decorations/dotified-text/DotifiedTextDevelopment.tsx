import React from "react";

import './DotifiedTextDevelopment.css'
import {DotifiedText} from "../../../../components/text-decorations/dotified-text/DotifiedText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const DOTIFIED_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "Melbourne Distribution Centre",
		description: "The string to render. Every space in it is replaced."
	},
	{
		name: "dot",
		type: "string",
		default: "\"●\"",
		control: "text",
		description: "What each space becomes."
	},
	{
		name: "maxLines",
		type: "number",
		control: "number",
		description: "Clamps the text to this many lines. Left off it is not clamped at all."
	}
];

interface Props {
}

export const DotifiedTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Dotified Text"
			description="Swaps every space in a string for a character of its own — a dot by default — so a value reads as one unbroken token. Useful where a space would be mistaken for the end of the value."
			name="DotifiedText"
			previewHeight={110}
			props={DOTIFIED_TEXT_PROPS}
			preview={values => (
				<DotifiedText text={values.text} dot={values.dot} maxLines={values.maxLines}></DotifiedText>
			)}>

			<GeneralHeading>Default Dot Character</GeneralHeading>
			<DotifiedText text="Hello World Example" />

			<GeneralHeading>Custom Dot Character (Dash)</GeneralHeading>
			<DotifiedText text="Hello World Example" dot="-" />

			<GeneralHeading>Custom Dot Character (Underscore)</GeneralHeading>
			<DotifiedText text="Hello World Example" dot="_" />

			<GeneralHeading>With Max Lines (2 lines)</GeneralHeading>
			<div style={{width: "200px"}}>
				<DotifiedText text="This is a longer text that should be truncated after two lines of content" maxLines={2} />
			</div>

			<GeneralHeading>Email-style Dotified</GeneralHeading>
			<DotifiedText text="john doe example" dot="." />
		</ComponentDoc>
	)
}
