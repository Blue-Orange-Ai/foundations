import React, {useState} from "react";

import './MenubarDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Menubar} from "../../../components/menubar/menubar/Menubar";
import {MenubarMenu} from "../../../components/menubar/menubar-menu/MenubarMenu";
import {IContextMenuItem, IContextMenuType} from "../../../components/contextmenu/contextmenu/ContextMenu";

interface Props {
}

const FILE_ITEMS: Array<IContextMenuItem> = [
	{label: "New tab", type: IContextMenuType.CONTENT, icon: "ri-add-line"},
	{label: "New window", type: IContextMenuType.CONTENT, icon: "ri-window-line"},
	{label: "", type: IContextMenuType.SEPARATOR},
	{
		label: "Share",
		type: IContextMenuType.GROUP,
		icon: "ri-share-line",
		children: [
			{label: "Email link", type: IContextMenuType.CONTENT, icon: "ri-mail-line"},
			{label: "Copy link", type: IContextMenuType.CONTENT, icon: "ri-link"},
		]
	},
	{label: "", type: IContextMenuType.SEPARATOR},
	{label: "Print", type: IContextMenuType.CONTENT, icon: "ri-printer-line"},
];

const EDIT_ITEMS: Array<IContextMenuItem> = [
	{label: "Undo", type: IContextMenuType.CONTENT, icon: "ri-arrow-go-back-line"},
	{label: "Redo", type: IContextMenuType.CONTENT, icon: "ri-arrow-go-forward-line"},
	{label: "", type: IContextMenuType.SEPARATOR},
	{
		label: "Find",
		type: IContextMenuType.GROUP,
		icon: "ri-search-line",
		children: [
			{label: "Search the web", type: IContextMenuType.CONTENT},
			{label: "Find…", type: IContextMenuType.CONTENT},
			{label: "Find next", type: IContextMenuType.CONTENT},
		]
	},
	{label: "Cut", type: IContextMenuType.CONTENT, icon: "ri-scissors-line"},
	{label: "Paste", type: IContextMenuType.CONTENT, icon: "ri-clipboard-line"},
];

const VIEW_ITEMS: Array<IContextMenuItem> = [
	{label: "Appearance", type: IContextMenuType.HEADING},
	{label: "Show sidebar", type: IContextMenuType.CONTENT, icon: "ri-side-bar-line"},
	{label: "Show status bar", type: IContextMenuType.CONTENT, icon: "ri-layout-bottom-line"},
	{label: "", type: IContextMenuType.SEPARATOR},
	{label: "Full screen", type: IContextMenuType.CONTENT, icon: "ri-fullscreen-line"},
];

export const MenubarDevelopment: React.FC<Props> = ({}) => {

	const [lastClicked, setLastClicked] = useState("");

	return (
		<PaddedPage>
			<PageHeading>Menubar</PageHeading>
			<Description>
				An application menu bar. Once one menu is open, moving across the bar opens the others
				— the rows are the same items a ContextMenu takes.
			</Description>

			<GeneralHeading>Default</GeneralHeading>
			<Menubar onClick={(item, menuLabel) => setLastClicked(menuLabel + " → " + item.label)}>
				<MenubarMenu label="File" items={FILE_ITEMS}></MenubarMenu>
				<MenubarMenu label="Edit" items={EDIT_ITEMS}></MenubarMenu>
				<MenubarMenu label="View" items={VIEW_ITEMS}></MenubarMenu>
				<MenubarMenu label="Archived" items={[]} disabled={true}></MenubarMenu>
			</Menubar>
			<Description>{lastClicked ? "Last clicked: " + lastClicked : "Nothing clicked yet."}</Description>

			<GeneralHeading>With icons and a wider panel</GeneralHeading>
			<Menubar width={260} onClick={(item, menuLabel) => setLastClicked(menuLabel + " → " + item.label)}>
				<MenubarMenu label="Project" icon="ri-folder-6-line" items={FILE_ITEMS}></MenubarMenu>
				<MenubarMenu label="Editor" icon="ri-edit-line" items={EDIT_ITEMS}></MenubarMenu>
			</Menubar>

			<GeneralHeading>Per menu handlers</GeneralHeading>
			<Description>Each menu can take its own onClick instead of the shared one.</Description>
			<Menubar>
				<MenubarMenu
					label="Account"
					items={VIEW_ITEMS}
					onClick={(item) => setLastClicked("Account → " + item.label)}></MenubarMenu>
			</Menubar>
		</PaddedPage>
	)
}
