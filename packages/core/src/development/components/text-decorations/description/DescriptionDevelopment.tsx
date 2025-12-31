import React from "react";

import './DescriptionDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {Description} from "../../../../components/text-decorations/description/Description";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";

interface Props {
}

export const DescriptionDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Description Text Decoration</PageHeading>
			<Description>A component for displaying descriptive text with consistent styling.</Description>

			<GeneralHeading>Default Description</GeneralHeading>
			<Description>This is a default description paragraph. It uses the standard styling defined in the component.</Description>

			<GeneralHeading>Custom Styled Description</GeneralHeading>
			<Description style={{color: "#3b82f6", fontStyle: "italic"}}>This description has custom styling applied with blue color and italic text.</Description>

			<GeneralHeading>Long Description</GeneralHeading>
			<Description>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
			</Description>
		</PaddedPage>
	)
}
