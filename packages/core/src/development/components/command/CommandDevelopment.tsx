import React, {useEffect, useState} from "react";

import './CommandDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Command} from "../../../components/command/command/Command";
import {CommandInput} from "../../../components/command/command-input/CommandInput";
import {CommandList} from "../../../components/command/command-list/CommandList";
import {CommandEmpty} from "../../../components/command/command-empty/CommandEmpty";
import {CommandGroup} from "../../../components/command/command-group/CommandGroup";
import {CommandItem} from "../../../components/command/command-item/CommandItem";
import {CommandSeparator} from "../../../components/command/command-separator/CommandSeparator";
import {CommandShortcut} from "../../../components/command/command-shortcut/CommandShortcut";
import {CommandDialog} from "../../../components/command/command-dialog/CommandDialog";
import {Button, ButtonType} from "../../../components/buttons/button/Button";
import {Kbd} from "../../../components/text-decorations/kbd/Kbd";
import {KbdGroup} from "../../../components/text-decorations/kbd/kbd-group/KbdGroup";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const COMMAND_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The input and the list that make up the palette."
	},
	{
		name: "search",
		type: "string",
		control: "text",
		description: "Drives the search text from the outside. Left off, the palette holds it itself."
	},
	{
		name: "onSearchChange",
		type: "(search: string) => void",
		description: "Fires whenever the search text changes."
	},
	{
		name: "shouldFilter",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turn off to do the filtering yourself, leaving the palette to render whatever it is given."
	},
	{
		name: "filter",
		type: "(value: string, search: string) => boolean",
		description: "Replaces the default \"contains, ignoring case\" match."
	},
	{
		name: "loop",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Wraps the highlight around when it runs off either end of the list."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the palette."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the palette."
	}
];

const COMMAND_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "placeholder",
		type: "string",
		default: "\"Type a command or search…\"",
		control: "text",
		description: "What the empty field reads."
	},
	{
		name: "icon",
		type: "string",
		default: "\"ri-search-line\"",
		control: "text",
		description: "A remixicon class shown before the field."
	},
	{
		name: "autoFocus",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Takes the caret as soon as the palette mounts."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stops the field taking input."
	},
	{
		name: "onEscape",
		type: "() => void",
		description: "Fires when escape is pressed — usually what closes the palette."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the field."
	}
];

const COMMAND_ITEM_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		control: "text",
		value: "Melbourne Depot",
		hideFromSnippet: true,
		description: "The row's content."
	},
	{
		name: "value",
		type: "string",
		control: "text",
		description: "The text the item is filtered on. Left off, its rendered text is used."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-map-pin-2-line",
		description: "A remixicon class shown before the label."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the row out and takes it out of the keyboard order."
	},
	{
		name: "onSelect",
		type: "(value: string) => void",
		description: "Fires with the item's value when it is clicked or entered."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the row."
	}
];

const COMMAND_GROUP_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The items in the group."
	},
	{
		name: "heading",
		type: "string",
		control: "text",
		value: "Sites",
		description: "The label above the items. The whole group hides itself when the search empties it."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the group."
	}
];

const COMMAND_LIST_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The groups and items."
	},
	{
		name: "maxHeight",
		type: "number",
		default: "320",
		control: "slider",
		min: 80,
		max: 480,
		step: 20,
		description: "How tall the list gets before it scrolls, in pixels."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the list."
	}
];

const COMMAND_EMPTY_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		default: "\"No results found.\"",
		control: "text",
		hideFromSnippet: true,
		description: "What is shown when nothing survives the search."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the empty state."
	}
];

const COMMAND_SHORTCUT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		control: "text",
		value: "⌘N",
		hideFromSnippet: true,
		description: "The keys to show."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the hint."
	}
];

const COMMAND_DIALOG_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The palette — an input and a list."
	},
	{
		name: "open",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Whether the overlay is showing. The dialog is controlled, so this is the parent's to hold."
	},
	{
		name: "onClose",
		type: "() => void",
		description: "Fires on escape, or on a click outside the palette."
	},
	{
		name: "width",
		type: "number",
		default: "520",
		control: "slider",
		min: 320,
		max: 800,
		step: 20,
		description: "Width of the palette, in pixels."
	},
	{
		name: "search",
		type: "string",
		description: "Drives the search text from the outside."
	},
	{
		name: "onSearchChange",
		type: "(search: string) => void",
		description: "Fires whenever the search text changes."
	},
	{
		name: "shouldFilter",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turn off to do the filtering yourself."
	},
	{
		name: "filter",
		type: "(value: string, search: string) => boolean",
		description: "Replaces the default match."
	}
];

interface Props {
}

export const CommandDevelopment: React.FC<Props> = ({}) => {

	const [selected, setSelected] = useState("");

	const [dialogOpen, setDialogOpen] = useState(false);

	// the ⌘K / Ctrl+K shortcut the pattern is named after
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setDialogOpen(open => !open);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const renderItems = (onSelect: (value: string) => void) => {
		return (
			<>
				<CommandGroup heading="Suggestions">
					<CommandItem icon="ri-calendar-2-line" onSelect={onSelect}>Calendar</CommandItem>
					<CommandItem icon="ri-emotion-line" onSelect={onSelect}>Search emoji</CommandItem>
					<CommandItem icon="ri-calculator-line" disabled={true} onSelect={onSelect}>Calculator</CommandItem>
				</CommandGroup>
				<CommandSeparator></CommandSeparator>
				<CommandGroup heading="Settings">
					<CommandItem icon="ri-user-4-line" onSelect={onSelect}>
						Profile
						<CommandShortcut>
							<KbdGroup>
								<Kbd>⌘</Kbd>
								<Kbd>P</Kbd>
							</KbdGroup>
						</CommandShortcut>
					</CommandItem>
					<CommandItem icon="ri-bank-card-line" onSelect={onSelect}>
						Billing
						<CommandShortcut>
							<KbdGroup>
								<Kbd>⌘</Kbd>
								<Kbd>B</Kbd>
							</KbdGroup>
						</CommandShortcut>
					</CommandItem>
					<CommandItem icon="ri-settings-3-line" onSelect={onSelect}>
						Settings
						<CommandShortcut>
							<KbdGroup>
								<Kbd>⌘</Kbd>
								<Kbd>S</Kbd>
							</KbdGroup>
						</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</>
		)
	}

	return (
		<ComponentDoc
			title="Command"
			description="A searchable list of actions — the command palette. Typing filters the items, the arrow keys move the highlight and enter runs whatever is under it."
			name="Command"
			previewHeight={340}
			previewCentered={false}
			imports={["CommandInput", "CommandList", "CommandGroup", "CommandItem", "CommandEmpty", "CommandSeparator", "CommandShortcut"]}
			props={COMMAND_PROPS}
			snippetChildren={() => "<CommandInput placeholder={\"Type a command or search…\"}></CommandInput>\n<CommandList>\n\t<CommandEmpty></CommandEmpty>\n\t<CommandGroup heading={\"Sites\"}>\n\t\t<CommandItem icon={\"ri-map-pin-2-line\"} onSelect={open}>Melbourne Depot</CommandItem>\n\t\t<CommandItem icon={\"ri-map-pin-2-line\"} onSelect={open}>Geelong Yard</CommandItem>\n\t</CommandGroup>\n\t<CommandSeparator></CommandSeparator>\n\t<CommandGroup heading={\"Actions\"}>\n\t\t<CommandItem icon={\"ri-add-line\"} onSelect={open}>\n\t\t\tNew run\n\t\t\t<CommandShortcut>⌘N</CommandShortcut>\n\t\t</CommandItem>\n\t</CommandGroup>\n</CommandList>"}
			preview={values => (
				<div style={{width: "100%", maxWidth: "440px"}}>
					<Command shouldFilter={values.shouldFilter} loop={values.loop} classes={values.classes}>
						<CommandInput placeholder={"Type a command or search…"}></CommandInput>
						<CommandList>
							<CommandEmpty></CommandEmpty>
							<CommandGroup heading={"Sites"}>
								<CommandItem icon={"ri-map-pin-2-line"}>Melbourne Depot</CommandItem>
								<CommandItem icon={"ri-map-pin-2-line"}>Geelong Yard</CommandItem>
							</CommandGroup>
							<CommandSeparator></CommandSeparator>
							<CommandGroup heading={"Actions"}>
								<CommandItem icon={"ri-add-line"}>
									New run
									<CommandShortcut>⌘N</CommandShortcut>
								</CommandItem>
								<CommandItem icon={"ri-settings-3-line"} disabled={true}>Settings</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</div>
			)}
			siblings={[
				{
					name: "CommandInput",
					description: "The search field at the top. It drives the filtering, so there is only ever one of them in a palette.",
					props: COMMAND_INPUT_PROPS,
					previewHeight: 120,
					preview: values => (
						<div style={{width: "100%", maxWidth: "440px"}}>
							<Command>
								<CommandInput
									placeholder={values.placeholder}
									icon={values.icon}
									disabled={values.disabled}></CommandInput>
							</Command>
						</div>
					)
				},
				{
					name: "CommandItem",
					description: "One row. It is filtered on its rendered text unless `value` says otherwise, and reports its own text through onSelect.",
					props: COMMAND_ITEM_PROPS,
					previewHeight: 140,
					snippetChildren: values => values.children,
					preview: values => (
						<div style={{width: "100%", maxWidth: "440px"}}>
							<Command>
								<CommandList>
									<CommandItem icon={values.icon} disabled={values.disabled}>{values.children}</CommandItem>
								</CommandList>
							</Command>
						</div>
					)
				},
				{
					name: "CommandGroup",
					description: "A labelled block of items. The heading disappears with the group when the search leaves nothing in it.",
					props: COMMAND_GROUP_PROPS,
					previewHeight: 160,
					imports: ["CommandItem"],
					snippetChildren: () => "<CommandItem>Melbourne Depot</CommandItem>\n<CommandItem>Geelong Yard</CommandItem>",
					preview: values => (
						<div style={{width: "100%", maxWidth: "440px"}}>
							<Command>
								<CommandList>
									<CommandGroup heading={values.heading}>
										<CommandItem>Melbourne Depot</CommandItem>
										<CommandItem>Geelong Yard</CommandItem>
									</CommandGroup>
								</CommandList>
							</Command>
						</div>
					)
				},
				{
					name: "CommandList",
					description: "The scrolling area the groups and items sit in.",
					props: COMMAND_LIST_PROPS,
					previewHeight: 160,
					imports: ["CommandItem"],
					snippetChildren: () => "<CommandItem>Melbourne Depot</CommandItem>",
					preview: values => (
						<div style={{width: "100%", maxWidth: "440px"}}>
							<Command>
								<CommandList maxHeight={values.maxHeight}>
									<CommandItem>Melbourne Depot</CommandItem>
									<CommandItem>Geelong Yard</CommandItem>
									<CommandItem>Ballarat Substation</CommandItem>
								</CommandList>
							</Command>
						</div>
					)
				},
				{
					name: "CommandEmpty",
					description: "What is shown once the search has filtered everything out. It renders nothing while anything is still visible.",
					props: COMMAND_EMPTY_PROPS,
					previewHeight: 120,
					snippetChildren: values => values.children,
					preview: values => (
						<div style={{width: "100%", maxWidth: "440px"}}>
							<Command search={"nothing matches this"}>
								<CommandList>
									<CommandEmpty>{values.children}</CommandEmpty>
									<CommandItem>Melbourne Depot</CommandItem>
								</CommandList>
							</Command>
						</div>
					)
				},
				{
					name: "CommandShortcut",
					description: "The key hint pushed to the right of an item.",
					props: COMMAND_SHORTCUT_PROPS,
					previewHeight: 110,
					snippetChildren: values => values.children,
					preview: values => (<CommandShortcut>{values.children}</CommandShortcut>)
				},
				{
					name: "CommandDialog",
					description: "The palette in a modal of its own — the ⌘K overlay. It carries the same search props as Command and closes on escape.",
					props: COMMAND_DIALOG_PROPS,
					previewHeight: 140,
					snippetChildren: () => "<CommandInput></CommandInput>\n<CommandList>\n\t<CommandItem>Melbourne Depot</CommandItem>\n</CommandList>",
					imports: ["CommandInput", "CommandList", "CommandItem"],
					preview: values => (
						<CommandDialog open={values.open} width={values.width} shouldFilter={values.shouldFilter}>
							<CommandInput></CommandInput>
							<CommandList>
								<CommandItem>Melbourne Depot</CommandItem>
								<CommandItem>Geelong Yard</CommandItem>
							</CommandList>
						</CommandDialog>
					)
				}
			]}>

			<GeneralHeading>Inline</GeneralHeading>
			<div className="blue-orange-command-development-block">
				<Command>
					<CommandInput></CommandInput>
					<CommandList>
						<CommandEmpty></CommandEmpty>
						{renderItems(setSelected)}
					</CommandList>
				</Command>
			</div>
			<Description>{selected ? "Last selected: " + selected : "Nothing selected yet."}</Description>

			<GeneralHeading>In a dialog</GeneralHeading>
			<Description>
				Press <KbdGroup separator="+"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup> anywhere on this page, or use the button.
			</Description>
			<Button
				text="Open command palette"
				buttonType={ButtonType.SECONDARY}
				onClick={() => setDialogOpen(true)}></Button>
			<CommandDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<CommandInput autoFocus={true} onEscape={() => setDialogOpen(false)}></CommandInput>
				<CommandList>
					<CommandEmpty></CommandEmpty>
					{renderItems((value) => {
						setSelected(value);
						setDialogOpen(false);
					})}
				</CommandList>
			</CommandDialog>
		</ComponentDoc>
	)
}
