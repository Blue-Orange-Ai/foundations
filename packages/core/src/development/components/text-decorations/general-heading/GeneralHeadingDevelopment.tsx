import React from "react";

import './GeneralHeadingDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const GeneralHeadingDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>General Heading Text Decoration</PageHeading>
			<Description>A secondary heading component (h2) for section titles.</Description>

			<GeneralHeading>Default General Heading</GeneralHeading>
			<Description>This is content under the heading above.</Description>

			<GeneralHeading style={{color: "#3b82f6"}}>Blue Styled Heading</GeneralHeading>
			<Description>This heading has custom blue color styling.</Description>

			<GeneralHeading style={{fontSize: "1.5rem", fontWeight: "bold"}}>Large Bold Heading</GeneralHeading>
			<Description>This heading has increased font size and weight.</Description>

			<GeneralHeading style={{textDecoration: "underline"}}>Underlined Heading</GeneralHeading>
			<Description>This heading has an underline decoration.</Description>
		</PaddedPage>
	)
}
