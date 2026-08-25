import React from "react";

import './GeneralHeadingDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const GENERAL_HEADING_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Delivery details",
		hideFromSnippet: true,
		description: "The heading text, or any node that should sit in the heading."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the h2."
	}
];

interface Props {
}

export const GeneralHeadingDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="General Heading"
			description="The section heading — an h2 — that breaks a page into parts. It pairs with Description underneath it, and with PageHeading above."
			name="GeneralHeading"
			previewHeight={110}
			snippetChildren={values => values.children}
			props={GENERAL_HEADING_PROPS}
			preview={values => (
				<GeneralHeading>{values.children}</GeneralHeading>
			)}>

			<GeneralHeading>Default General Heading</GeneralHeading>
			<Description>This is content under the heading above.</Description>

			<GeneralHeading style={{color: "#3b82f6"}}>Blue Styled Heading</GeneralHeading>
			<Description>This heading has custom blue color styling.</Description>

			<GeneralHeading style={{fontSize: "1.5rem", fontWeight: "bold"}}>Large Bold Heading</GeneralHeading>
			<Description>This heading has increased font size and weight.</Description>

			<GeneralHeading style={{textDecoration: "underline"}}>Underlined Heading</GeneralHeading>
			<Description>This heading has an underline decoration.</Description>
		</ComponentDoc>
	)
}
