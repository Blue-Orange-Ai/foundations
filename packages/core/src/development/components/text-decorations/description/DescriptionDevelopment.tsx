import React from "react";

import './DescriptionDevelopment.css'
import {Description} from "../../../../components/text-decorations/description/Description";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const DESCRIPTION_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Displays key value pairs vertically or horizontally across a configurable number of columns.",
		hideFromSnippet: true,
		description: "The text. Any node will do, so a link or an inline code span can go inside it."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the paragraph."
	}
];

interface Props {
}

export const DescriptionDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Description"
			description="The paragraph that sits under a heading and says what the thing below it is. It is the muted body style the rest of the library pairs with PageHeading and GeneralHeading."
			name="Description"
			previewHeight={110}
			snippetChildren={values => values.children}
			props={DESCRIPTION_PROPS}
			preview={values => (
				<Description>{values.children}</Description>
			)}>

			<GeneralHeading>Default Description</GeneralHeading>
			<Description>This is a default description paragraph. It uses the standard styling defined in the component.</Description>

			<GeneralHeading>Custom Styled Description</GeneralHeading>
			<Description style={{color: "#3b82f6", fontStyle: "italic"}}>This description has custom styling applied with blue color and italic text.</Description>

			<GeneralHeading>Long Description</GeneralHeading>
			<Description>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
			</Description>
		</ComponentDoc>
	)
}
