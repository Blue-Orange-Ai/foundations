import React from "react";

import './KbdDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Kbd} from "../../../../components/text-decorations/kbd/Kbd";
import {KbdGroup} from "../../../../components/text-decorations/kbd/kbd-group/KbdGroup";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const KBD_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		control: "text",
		value: "Esc",
		hideFromSnippet: true,
		description: "The key. A glyph such as ⌘ or ⇧, or a word such as Enter."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the kbd element."
	}
];

const KBD_GROUP_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The keys in the shortcut, in the order they are pressed."
	},
	{
		name: "separator",
		type: "string",
		control: "select",
		options: [
			{label: "None", value: ""},
			{label: "+", value: "+"},
			{label: "then", value: "then"}
		],
		description: "Printed between each key. Left off, the keys simply sit next to each other."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the group."
	}
];

interface Props {
}

export const KbdDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Kbd"
			description="A keyboard key, and the group that strings several of them into a shortcut. Used in menus, command palettes and anywhere a sentence needs to name a key."
			name="Kbd"
			previewHeight={110}
			snippetChildren={values => values.children}
			props={KBD_PROPS}
			preview={values => (
				<Kbd>{values.children}</Kbd>
			)}
			siblings={[
				{
					name: "KbdGroup",
					description: "Holds several keys together as one shortcut, with an optional word or symbol printed between them.",
					props: KBD_GROUP_PROPS,
					previewHeight: 110,
					snippetChildren: () => "<Kbd>⌘</Kbd>\n<Kbd>K</Kbd>",
					imports: ["Kbd"],
					preview: values => (
						<KbdGroup separator={values.separator}>
							<Kbd>⌘</Kbd>
							<Kbd>K</Kbd>
						</KbdGroup>
					)
				}
			]}>

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
		</ComponentDoc>
	)
}
