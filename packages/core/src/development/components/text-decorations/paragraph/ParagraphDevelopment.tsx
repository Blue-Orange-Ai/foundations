import React from "react";

import './ParagraphDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const ParagraphDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Paragraph Text Decoration</PageHeading>
			<Description>A styled paragraph component for body text content.</Description>

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
		</PaddedPage>
	)
}
