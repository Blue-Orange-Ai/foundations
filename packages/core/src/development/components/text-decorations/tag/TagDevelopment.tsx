import React from "react";

import './TagDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {Tag} from "../../../../components/text-decorations/tag/Tag";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const TagDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Tag Text Decoration</PageHeading>
			<Description>A tag component with customizable background and text colors.</Description>

			<GeneralHeading>Default Tag</GeneralHeading>
			<Tag>Default</Tag>

			<GeneralHeading>Status Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<Tag backgroundColor="#22c55e" textColor="white">Active</Tag>
				<Tag backgroundColor="#ef4444" textColor="white">Inactive</Tag>
				<Tag backgroundColor="#f59e0b" textColor="white">Pending</Tag>
				<Tag backgroundColor="#3b82f6" textColor="white">In Progress</Tag>
			</div>

			<GeneralHeading>Category Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<Tag backgroundColor="#8b5cf6" textColor="white">Technology</Tag>
				<Tag backgroundColor="#ec4899" textColor="white">Design</Tag>
				<Tag backgroundColor="#06b6d4" textColor="white">Marketing</Tag>
				<Tag backgroundColor="#84cc16" textColor="white">Finance</Tag>
			</div>

			<GeneralHeading>Light Background Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<Tag backgroundColor="#dbeafe" textColor="#1e40af">Blue</Tag>
				<Tag backgroundColor="#dcfce7" textColor="#166534">Green</Tag>
				<Tag backgroundColor="#fef3c7" textColor="#92400e">Yellow</Tag>
				<Tag backgroundColor="#fee2e2" textColor="#991b1b">Red</Tag>
			</div>
		</PaddedPage>
	)
}
