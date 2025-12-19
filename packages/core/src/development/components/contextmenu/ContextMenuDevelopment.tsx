import React from "react";

import './ContextMenuDevelopment.css'


import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../../components/contextmenu/contextmenu/ContextMenu";
import {Button, ButtonType} from "../../../components/buttons/button/Button";
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";


interface Props {
}

export const ContextMenuDevelopment: React.FC<Props> = ({}) => {

	const contextMenuItems: Array<IContextMenuItem> = [
		{type: IContextMenuType.HEADING, label: "Sort Direction", value:""},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.SEPARATOR, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{
			type: IContextMenuType.GROUP,
			label: "More Options",
			icon: "ri-more-2-fill",
			children: [
				{type: IContextMenuType.CONTENT, label: "Rename", icon: "ri-edit-fill", value: "RENAME"},
				{type: IContextMenuType.CONTENT, label: "Duplicate", icon: "ri-file-copy-line", value: "DUPLICATE"},
				{
					type: IContextMenuType.GROUP,
					label: "Advanced",
					children: [
						{type: IContextMenuType.CONTENT, label: "Export", icon: "ri-download-2-line", value: "EXPORT"},
						{type: IContextMenuType.CONTENT, label: "Archive", icon: "ri-inbox-archive-line", value: "ARCHIVE"},
					]
				}
			]
		},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
	]

	return (
		<PaddedPage>
			<PageHeading>Context Menu</PageHeading>
			<ContextMenu items={contextMenuItems} onClick={(item) => console.log(item)}>
				<Button text={"Click to Display Context Menu"} buttonType={ButtonType.PRIMARY}></Button>
			</ContextMenu>

		</PaddedPage>
	)
}