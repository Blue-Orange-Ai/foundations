import React from "react";

import './BadgeDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {Badge} from "../../../../components/text-decorations/badge/Badge";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const BadgeDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Badge Text Decoration</PageHeading>
			<Description>A simple badge component for displaying labels or status indicators.</Description>

			<GeneralHeading>Default Badge</GeneralHeading>
			<Badge>Default</Badge>

			<GeneralHeading>Custom Styled Badge</GeneralHeading>
			<Badge style={{backgroundColor: "#3b82f6", color: "white", padding: "4px 12px"}}>Custom Style</Badge>

			<GeneralHeading>Multiple Badges</GeneralHeading>
			<div style={{display: "flex", gap: "8px"}}>
				<Badge>Active</Badge>
				<Badge style={{backgroundColor: "#22c55e", color: "white"}}>Success</Badge>
				<Badge style={{backgroundColor: "#ef4444", color: "white"}}>Error</Badge>
				<Badge style={{backgroundColor: "#f59e0b", color: "white"}}>Warning</Badge>
			</div>
		</PaddedPage>
	)
}
