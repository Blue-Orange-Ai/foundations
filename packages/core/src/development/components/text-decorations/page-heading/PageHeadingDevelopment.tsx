import React from "react";

import './PageHeadingDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const PageHeadingDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Page Heading Text Decoration</PageHeading>
			<Description>A primary heading component (h1) for page titles.</Description>

			<GeneralHeading>Examples</GeneralHeading>

			<PageHeading>Default Page Heading</PageHeading>
			<Description>This is the standard page heading style.</Description>

			<PageHeading style={{color: "#3b82f6"}}>Blue Page Heading</PageHeading>
			<Description>A page heading with custom blue color.</Description>

			<PageHeading style={{fontSize: "2.5rem"}}>Large Page Heading</PageHeading>
			<Description>A page heading with increased font size.</Description>

			<PageHeading style={{textAlign: "center"}}>Centered Page Heading</PageHeading>
			<Description style={{textAlign: "center"}}>A centered page heading.</Description>
		</PaddedPage>
	)
}
