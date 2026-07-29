import React from "react";

import './KbdDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {Kbd} from "../../../../components/text-decorations/kbd/Kbd";
import {KbdGroup} from "../../../../components/text-decorations/kbd/kbd-group/KbdGroup";

interface Props {
}

export const KbdDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Kbd</PageHeading>
			<Description>Renders keyboard keys, on their own or grouped into a shortcut.</Description>

			<GeneralHeading>Single keys</GeneralHeading>
			<div className="blue-orange-kbd-development-row">
				<Kbd>⌘</Kbd>
				<Kbd>K</Kbd>
				<Kbd>Esc</Kbd>
				<Kbd>⇧</Kbd>
				<Kbd>Enter</Kbd>
			</div>

			<GeneralHeading>Groups</GeneralHeading>
			<div className="blue-orange-kbd-development-row">
				<KbdGroup>
					<Kbd>⌘</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
				<KbdGroup separator="+">
					<Kbd>Ctrl</Kbd>
					<Kbd>⇧</Kbd>
					<Kbd>P</Kbd>
				</KbdGroup>
				<KbdGroup separator="then">
					<Kbd>G</Kbd>
					<Kbd>D</Kbd>
				</KbdGroup>
			</div>

			<GeneralHeading>In a sentence</GeneralHeading>
			<p className="blue-orange-kbd-development-sentence">
				Press <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup> to open the command palette, or
				<Kbd>Esc</Kbd> to dismiss it.
			</p>
		</PaddedPage>
	)
}
