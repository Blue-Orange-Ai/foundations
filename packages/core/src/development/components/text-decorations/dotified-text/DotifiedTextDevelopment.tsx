import React from "react";

import './DotifiedTextDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {DotifiedText} from "../../../../components/text-decorations/dotified-text/DotifiedText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const DotifiedTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Dotified Text Decoration</PageHeading>
			<Description>Replaces spaces in text with dot characters for visual effect.</Description>

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
		</PaddedPage>
	)
}
