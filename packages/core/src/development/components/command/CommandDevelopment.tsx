import React, {useEffect, useState} from "react";

import './CommandDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
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
		<PaddedPage>
			<PageHeading>Command</PageHeading>
			<Description>
				A searchable list of actions. Typing filters the items, the arrow keys move the
				highlight and enter runs it.
			</Description>

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
		</PaddedPage>
	)
}
