import {PropSpec} from "./PropSpec";

/**
 * The props every dropdown trigger shares — the badge and tag variants all hand
 * them straight to DropdownTrigger, so they read the same on each page rather
 * than being copied onto all four of them.
 */
export const dropdownTriggerProps = (): Array<PropSpec> => [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "The options: DropdownItemText, DropdownItemIcon, DropdownItemImage and DropdownItemHeading."
	},
	{
		name: "filter",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a filter box at the top of the popup, for a list too long to read through."
	},
	{
		name: "allowMultiple",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Turns the options into checkboxes and keeps the popup open across selections."
	},
	{
		name: "contextWidth",
		type: "number | string",
		default: "\"max-content\"",
		description: "Width of the popup. It sizes to the option text by default, since a tag is only as wide as its own label."
	},
	{
		name: "contextMaxHeight",
		type: "number",
		default: "200",
		description: "How tall the popup gets before its options start scrolling."
	},
	{
		name: "onSelection",
		type: "(item: DropdownItemObj) => void",
		description: "Fires for every selection a person makes. The value the dropdown starts on is not one of them, so this does not fire on mount."
	},
	{
		name: "onItemsSelected",
		type: "(items: Array<DropdownItemObj>) => void",
		description: "With allowMultiple, the whole selection after each change. Unlike onSelection it does report the starting selection."
	},
	{
		name: "onVisibilityChange",
		type: "(visible: boolean) => void",
		description: "Called whenever the popup opens or closes."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Dims the trigger and stops it opening."
	}
];
