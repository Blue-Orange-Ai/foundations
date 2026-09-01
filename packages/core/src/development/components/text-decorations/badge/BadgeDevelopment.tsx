import React, {useState} from "react";

import './BadgeDevelopment.css'
import {Badge} from "../../../../components/text-decorations/badge/Badge";
import {DropdownBadge} from "../../../../components/text-decorations/dropdown-badge/DropdownBadge";
import {DropdownItemText} from "../../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {DropdownItemIcon} from "../../../../components/inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {ComponentApiProps} from "../../../framework/ComponentApi";
import {PropSpec} from "../../../framework/PropSpec";
import {dropdownTriggerProps} from "../../../framework/DropdownProps";

const BADGE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Active",
		hideFromSnippet: true,
		description: "What the badge reads. Any node will do — text, an icon, or both."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		control: "color",
		code: value => value ? "{{backgroundColor: \"" + value + "\", color: \"white\"}}" : undefined,
		description: "Inline style put on the badge, which is how it is given a colour of its own. The control here fills in a background colour."
	}
];

const DROPDOWN_BADGE_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Production",
		description: "What the badge itself reads — usually the option currently chosen. The options go in children."
	},
	{
		name: "chevron",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "The chevron that marks the badge as something to open."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		control: "color",
		code: value => value ? "{{backgroundColor: \"" + value + "\", color: \"white\"}}" : undefined,
		description: "Inline style put on the badge underneath. The control here fills in a background colour."
	},
	...dropdownTriggerProps()
];

const ENVIRONMENT_OPTIONS = ["Production", "Staging", "Development"];

const DROPDOWN_BADGE_SNIPPET =
	"<DropdownItemText label=\"Production\" value=\"production\" selected={true}></DropdownItemText>\n"
	+ "<DropdownItemText label=\"Staging\" value=\"staging\" selected={false}></DropdownItemText>\n"
	+ "<DropdownItemText label=\"Development\" value=\"development\" selected={false}></DropdownItemText>";

interface Props {
}

export const BadgeDevelopment: React.FC<Props> = ({}) => {

	const [environment, setEnvironment] = useState("Production");

	const [visibility, setVisibility] = useState("Everyone");

	const dropdownBadge: ComponentApiProps = {
		name: "DropdownBadge",
		heading: "Dropdown Badge",
		description: "A badge that opens a dropdown when it is clicked — for a value read far more often than it is changed, and so not worth a whole input. The options are the same ones Dropdown takes.",
		props: DROPDOWN_BADGE_PROPS,
		previewHeight: 160,
		imports: ["DropdownItemText"],
		snippetChildren: () => DROPDOWN_BADGE_SNIPPET,
		preview: values => (
			<DropdownBadge
				label={values.label}
				chevron={values.chevron}
				filter={values.filter}
				allowMultiple={values.allowMultiple}
				disabled={values.disabled}
				style={values.style ? {backgroundColor: values.style, color: "white"} : {}}>
				{ENVIRONMENT_OPTIONS.map(option => (
					<DropdownItemText
						key={option}
						label={option}
						value={option.toLowerCase()}
						selected={option === values.label}></DropdownItemText>
				))}
			</DropdownBadge>
		)
	};

	return (
		<ComponentDoc
			title="Badge"
			description="A small pill for a label or a status — a count beside a heading, a state beside a row. It renders whatever it is given, so the text, an icon or both can go inside it."
			name="Badge"
			props={BADGE_PROPS}
			previewHeight={120}
			snippetChildren={values => values.children}
			siblings={[dropdownBadge]}
			preview={values => (
				<Badge style={values.style ? {backgroundColor: values.style, color: "white"} : {}}>
					{values.children}
				</Badge>
			)}>

			<GeneralHeading>Default Badge</GeneralHeading>
			<Badge>Default</Badge>

			<GeneralHeading>Custom Styled Badge</GeneralHeading>
			<Badge style={{backgroundColor: "#3b82f6", color: "white", padding: "4px 12px"}}>Custom Style</Badge>

			<GeneralHeading>Multiple Badges</GeneralHeading>
			<div style={{display: "flex", gap: "8px"}}>
				<Badge>Active</Badge>
				<Badge style={{backgroundColor: "#22c55e", color: "white"}}>Success</Badge>
				<Badge style={{backgroundColor: "#ef4444", color: "white"}}>Error</Badge>
				<Badge style={{backgroundColor: "#f59e0b", color: "white"}}>Warning</Badge>
			</div>

			<GeneralHeading>Dropdown Badge</GeneralHeading>
			<div style={{display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap"}}>
				<DropdownBadge label={environment} onSelection={item => setEnvironment(item.label)}>
					{ENVIRONMENT_OPTIONS.map(option => (
						<DropdownItemText
							key={option}
							label={option}
							value={option.toLowerCase()}
							selected={option === environment}></DropdownItemText>
					))}
				</DropdownBadge>
				<DropdownBadge
					label={visibility}
					style={{backgroundColor: "#3b82f6", color: "white"}}
					onSelection={item => setVisibility(item.label)}>
					<DropdownItemIcon src="ri-global-line" label="Everyone" value="everyone" selected={visibility === "Everyone"}></DropdownItemIcon>
					<DropdownItemIcon src="ri-team-line" label="My team" value="team" selected={visibility === "My team"}></DropdownItemIcon>
					<DropdownItemIcon src="ri-lock-line" label="Only me" value="private" selected={visibility === "Only me"}></DropdownItemIcon>
				</DropdownBadge>
			</div>

			<GeneralHeading>Without A Chevron</GeneralHeading>
			<DropdownBadge label="More" chevron={false}>
				<DropdownItemText label="Rename" value="rename" selected={false}></DropdownItemText>
				<DropdownItemText label="Duplicate" value="duplicate" selected={false}></DropdownItemText>
			</DropdownBadge>

			<GeneralHeading>Disabled</GeneralHeading>
			<DropdownBadge label="Locked" disabled={true}>
				<DropdownItemText label="Unavailable" value="unavailable" selected={false}></DropdownItemText>
			</DropdownBadge>
		</ComponentDoc>
	)
}
