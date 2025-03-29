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
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
	]

	return (
		<PaddedPage>
			<PageHeading>Context Menu</PageHeading>
			<ContextMenu items={contextMenuItems}>
				<Button text={"Click to Display Context Menu"} buttonType={ButtonType.PRIMARY}></Button>
			</ContextMenu>

		</PaddedPage>
	)
}