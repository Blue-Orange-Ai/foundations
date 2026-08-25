import React, {useState} from "react";

import './MenubarDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Menubar} from "../../../components/menubar/menubar/Menubar";
import {MenubarMenu} from "../../../components/menubar/menubar-menu/MenubarMenu";
import {IContextMenuItem, IContextMenuType} from "../../../components/contextmenu/contextmenu/ContextMenu";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const MENUBAR_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The MenubarMenu entries, in the order they sit in the bar."
	},
	{
		name: "width",
		type: "number",
		default: "220",
		control: "slider",
		min: 140,
		max: 400,
		step: 10,
		description: "Width of the drop down panels, in pixels."
	},
	{
		name: "maxHeight",
		type: "number",
		default: "325",
		control: "slider",
		min: 120,
		max: 600,
		step: 25,
		description: "How tall a panel gets before it scrolls, in pixels."
	},
	{
		name: "onClick",
		type: "(item: IContextMenuItem, menuLabel: string) => void",
		description: "Fires for every menu that does not handle its own clicks, naming the menu the row came from."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the bar."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the bar."
	}
];

const MENUBAR_MENU_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "File",
		description: "The text shown in the bar."
	},
	{
		name: "items",
		type: "Array<IContextMenuItem>",
		required: true,
		description: "The rows of the drop down — content, headings, separators and groups, exactly as ContextMenu takes them."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "A remixicon class shown before the label."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the entry out and stops it opening."
	},
	{
		name: "onClick",
		type: "(item: IContextMenuItem) => void",
		description: "Fires when one of this menu's rows is clicked, instead of the bar's own onClick."
	}
];

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
		<ComponentDoc
			title="Menubar"
			description="An application menu bar. Once one menu is open, moving across the bar opens the others without a second click — and the rows in each drop down are the same items a ContextMenu takes."
			name="Menubar"
			previewHeight={140}
			previewCentered={false}
			imports={["MenubarMenu"]}
			props={MENUBAR_PROPS}
			snippetChildren={() => "<MenubarMenu label={\"File\"} items={FILE_ITEMS}></MenubarMenu>\n<MenubarMenu label={\"Edit\"} items={EDIT_ITEMS}></MenubarMenu>\n<MenubarMenu label={\"View\"} items={VIEW_ITEMS}></MenubarMenu>"}
			preview={values => (
				<Menubar
					width={values.width}
					maxHeight={values.maxHeight}
					classes={values.classes}
					onClick={() => {}}>
					<MenubarMenu label="File" items={FILE_ITEMS}></MenubarMenu>
					<MenubarMenu label="Edit" items={EDIT_ITEMS}></MenubarMenu>
					<MenubarMenu label="View" items={VIEW_ITEMS}></MenubarMenu>
				</Menubar>
			)}
			siblings={[
				{
					name: "MenubarMenu",
					description: "One entry in the bar and the rows it drops. It renders nothing itself — the Menubar reads its props.",
					props: MENUBAR_MENU_PROPS,
					previewHeight: 140,
					previewCentered: false,
					preview: values => (
						<Menubar>
							<MenubarMenu
								label={values.label}
								icon={values.icon}
								disabled={values.disabled}
								items={FILE_ITEMS}></MenubarMenu>
						</Menubar>
					)
				}
			]}>

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
		</ComponentDoc>
	)
}
