import React from "react";

import './ParagraphDevelopment.css'
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const PARAGRAPH_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Each depot reports its own throughput every hour. Where a report is missed the last known figure is carried forward and marked as stale.",
		hideFromSnippet: true,
		description: "The text, or any node that belongs in a paragraph."
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

export const ParagraphDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Paragraph"
			description="Body text in the library's own typography. It carries the same styling as Description, and is the one to reach for in running prose rather than under a heading."
			name="Paragraph"
			previewHeight={120}
			previewCentered={false}
			snippetChildren={values => values.children}
			props={PARAGRAPH_PROPS}
			preview={values => (
				<Paragraph>{values.children}</Paragraph>
			)}>

			<GeneralHeading>Default Paragraph</GeneralHeading>
			<Paragraph>This is a default paragraph with standard styling. It provides consistent typography for body text throughout the application.</Paragraph>

			<GeneralHeading>Custom Styled Paragraph</GeneralHeading>
			<Paragraph style={{color: "#6b7280", lineHeight: "1.8"}}>This paragraph has custom styling with gray color and increased line height for better readability.</Paragraph>

			<GeneralHeading>Long Paragraph</GeneralHeading>
			<Paragraph>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			</Paragraph>

			<GeneralHeading>Multiple Paragraphs</GeneralHeading>
			<Paragraph>First paragraph of content explaining the main topic.</Paragraph>
			<Paragraph>Second paragraph providing additional details and context.</Paragraph>
			<Paragraph>Third paragraph concluding the section with a summary.</Paragraph>
		</ComponentDoc>
	)
}
