import React, {useState} from "react";

import './ContextMenuDevelopment.css'


import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../../components/contextmenu/contextmenu/ContextMenu";
import {Button, ButtonType} from "../../../components/buttons/button/Button";
import {SplitPageMajor} from "../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {RichText} from "../../../components/inputs/richtext/default/RichText";
import {SplitPageMinor} from "../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";
import {
    HorizontalSplitPage
} from "../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";


const DEMO_MENU_ITEMS: Array<IContextMenuItem> = [
	{label: "Sort", type: IContextMenuType.HEADING},
	{label: "Ascending", type: IContextMenuType.CONTENT, icon: "ri-sort-asc", value: "SORT_ASC"},
	{label: "Descending", type: IContextMenuType.CONTENT, icon: "ri-sort-desc", value: "SORT_DESC"},
	{label: "", type: IContextMenuType.SEPARATOR},
	{
		label: "Export",
		type: IContextMenuType.GROUP,
		icon: "ri-download-line",
		children: [
			{label: "CSV", type: IContextMenuType.CONTENT, value: "CSV"},
			{label: "JSON", type: IContextMenuType.CONTENT, value: "JSON"}
		]
	},
	{label: "Delete", type: IContextMenuType.CONTENT, icon: "ri-delete-bin-line", value: "DELETE"}
];

const CONTEXT_MENU_ITEM_INTERFACE = {
	name: "IContextMenuItem",
	description: "One row. CONTENT is a clickable row, HEADING a label, SEPARATOR a rule, and GROUP a row that opens a submenu from its children.",
	props: [
		{name: "label", type: "string", required: true, description: "What the row reads. A separator ignores it."},
		{name: "type", type: "IContextMenuType", required: true, description: "CONTENT, HEADING, SEPARATOR or GROUP."},
		{name: "icon", type: "string", description: "A remixicon class shown before the label."},
		{name: "checked", type: "boolean", description: "Draws a tick against the row, for a menu of toggles."},
		{name: "rightIcon", type: "string", description: "A remixicon class pinned to the right of the row."},
		{name: "children", type: "Array<IContextMenuItem>", description: "The submenu of a GROUP row. These can nest."},
		{name: "value", type: "any", description: "Carried back through onClick — whatever the application needs to act on."}
	] as Array<PropSpec>
};

const CONTEXT_MENU_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "What the menu is anchored to."
	},
	{
		name: "items",
		type: "Array<IContextMenuItem>",
		required: true,
		description: "The rows, in the order they should be read."
	},
	{
		name: "width",
		type: "number",
		control: "slider",
		min: 140,
		max: 400,
		step: 10,
		description: "Width of the menu, in pixels. Left off it sizes to its rows."
	},
	{
		name: "maxHeight",
		type: "number",
		default: "325",
		control: "slider",
		min: 120,
		max: 600,
		step: 25,
		description: "How tall the menu gets before it scrolls."
	},
	{
		name: "onClick",
		type: "(item: IContextMenuItem) => void",
		description: "Fires with the row that was clicked."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stops the menu opening."
	},
	{
		name: "rightClick",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Opens on a right click rather than a left one."
	},
	{
		name: "contextFixedToClick",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Opens the menu where the pointer was, rather than against the edge of what it wraps."
	},
	{
		name: "open",
		type: "boolean",
		default: "false",
		description: "Opens the menu from the outside, for a menu driven by something other than a click on its children."
	},
	{
		name: "startingX",
		type: "number",
		default: "0",
		description: "Where an externally opened menu is placed, in page coordinates."
	},
	{
		name: "startingY",
		type: "number",
		default: "0",
		description: "The other half of that coordinate."
	},
	{
		name: "blockingDelayMs",
		type: "number",
		default: "500",
		control: "number",
		description: "How long after opening the menu ignores clicks, so the click that opened it cannot also pick a row."
	}
];

interface Props {
}

export const ContextMenuDevelopment: React.FC<Props> = ({}) => {

	const [selection, setSelection] = useState<IContextMenuItem>()

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
        <HorizontalSplitPage>
            <SplitPageMajor>
                <ComponentDoc
			title="Context Menu"
			description="A menu anchored to whatever it wraps. It opens on a left or a right click, its rows are a flat list of items rather than children, and a GROUP row opens a submenu of its own."
			name="ContextMenu"
			previewHeight={180}
			imports={["IContextMenuItem", "IContextMenuType"]}
			interfaces={[CONTEXT_MENU_ITEM_INTERFACE]}
			props={CONTEXT_MENU_PROPS}
			snippetChildren={() => "<Button text={\"Open the menu\"} buttonType={ButtonType.PRIMARY}></Button>"}
			preview={values => (
				<ContextMenu
					items={DEMO_MENU_ITEMS}
					width={values.width}
					maxHeight={values.maxHeight}
					disabled={values.disabled}
					rightClick={values.rightClick}
					contextFixedToClick={values.contextFixedToClick}
					onClick={() => {}}>
					<Button
						text={values.rightClick ? "Right click me" : "Click me"}
						buttonType={ButtonType.PRIMARY}></Button>
				</ContextMenu>
			)}>
                    <ContextMenu items={contextMenuItems} onClick={setSelection}>
                        <Button text={"Click to Display Context Menu"} buttonType={ButtonType.PRIMARY}></Button>
                    </ContextMenu>
                </ComponentDoc>
            </SplitPageMajor>
            <SplitPageMinor>
                <div className="workspace-output-window">
                    <div style={{marginBottom: "20px"}}>Output:</div>
                    <div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
                        {JSON.stringify(selection, null, 2)}
                    </div>
                </div>
            </SplitPageMinor>
        </HorizontalSplitPage>




	)
}