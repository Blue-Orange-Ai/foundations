import React, {useState} from "react";

import './CompoundBadgeDevelopment.css'
import {CompoundBadge} from "../../../../components/text-decorations/compound-badge/CompoundBadge";
import {DropdownCompoundBadge} from "../../../../components/text-decorations/dropdown-compound-badge/DropdownCompoundBadge";
import {DropdownItemText} from "../../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {ComponentApiProps} from "../../../framework/ComponentApi";
import {PropSpec} from "../../../framework/PropSpec";
import {dropdownTriggerProps} from "../../../framework/DropdownProps";

const COMPOUND_BADGE_PROPS: Array<PropSpec> = [
	{
		name: "leftContent",
		type: "ReactNode",
		control: "text",
		value: "Environment",
		code: value => value ? "\"" + value + "\"" : undefined,
		description: "The left hand half — the key of the pair. Any node will do, so an icon can sit in here too."
	},
	{
		name: "children",
		type: "ReactNode",
		control: "text",
		value: "Production",
		hideFromSnippet: true,
		description: "The right hand half — the value of the pair."
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Swaps the left half's content for a spinner, sized and coloured off the half it sits in — for a pair whose key is still being resolved."
	},
	{
		name: "trailingContent",
		type: "ReactNode",
		description: "Sits at the end of the right half, after the value and before the remove button — a count, a status dot, the chevron DropdownCompoundBadge puts there."
	},
	{
		name: "round",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Rounds both ends of the pill off completely."
	},
	{
		name: "fill",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stretches the badge across the width it is given, with the right half taking up the slack."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the pill as a whole."
	},
	{
		name: "leftStyle",
		type: "React.CSSProperties",
		default: "{}",
		control: "color",
		code: value => value ? "{{backgroundColor: \"" + value + "\", color: \"white\"}}" : undefined,
		description: "Inline style for the left half, which is how it is given a colour of its own. The control here fills in a background colour."
	},
	{
		name: "rightStyle",
		type: "React.CSSProperties",
		default: "{}",
		control: "color",
		code: value => value ? "{{backgroundColor: \"" + value + "\", color: \"white\"}}" : undefined,
		description: "Inline style for the right half."
	},
	{
		name: "onClick",
		type: "(event: React.MouseEvent<HTMLDivElement>) => void",
		description: "Given a handler, the whole badge becomes interactive — it takes a pointer cursor and lifts on hover."
	},
	{
		name: "onRemove",
		type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
		description: "Given a handler, a remove button appears on the right half. It does not bubble into onClick."
	}
];

const DROPDOWN_COMPOUND_BADGE_PROPS: Array<PropSpec> = [
	{
		name: "leftContent",
		type: "ReactNode",
		control: "text",
		value: "Environment",
		code: value => value ? "\"" + value + "\"" : undefined,
		description: "The left hand half — the key of the pair."
	},
	{
		name: "rightContent",
		type: "ReactNode",
		control: "text",
		value: "Production",
		code: value => value ? "\"" + value + "\"" : undefined,
		description: "The right hand half — the value currently chosen. The options go in children."
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Swaps the left half's content for a spinner, for a pair whose key is still being resolved."
	},
	{
		name: "chevron",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "The chevron that marks the badge as something to open. It goes in the right half, where trailingContent would."
	},
	{
		name: "round",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Rounds both ends of the pill off completely."
	},
	{
		name: "fill",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stretches the badge across the width it is given."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the pill as a whole."
	},
	{
		name: "leftStyle",
		type: "React.CSSProperties",
		default: "{}",
		control: "color",
		code: value => value ? "{{backgroundColor: \"" + value + "\", color: \"white\"}}" : undefined,
		description: "Inline style for the left half. The control here fills in a background colour."
	},
	{
		name: "rightStyle",
		type: "React.CSSProperties",
		default: "{}",
		control: "color",
		code: value => value ? "{{backgroundColor: \"" + value + "\", color: \"white\"}}" : undefined,
		description: "Inline style for the right half."
	},
	{
		name: "onRemove",
		type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
		description: "Given a handler, a remove button appears on the right half. It sits above the dropdown, so removing the badge does not open it."
	},
	...dropdownTriggerProps()
];

const ENVIRONMENT_OPTIONS = ["Production", "Staging", "Development"];

const DROPDOWN_COMPOUND_BADGE_SNIPPET =
	"<DropdownItemText label=\"Production\" value=\"production\" selected={true}></DropdownItemText>\n"
	+ "<DropdownItemText label=\"Staging\" value=\"staging\" selected={false}></DropdownItemText>\n"
	+ "<DropdownItemText label=\"Development\" value=\"development\" selected={false}></DropdownItemText>";

interface Props {
}

export const CompoundBadgeDevelopment: React.FC<Props> = ({}) => {

	const [environment, setEnvironment] = useState("Production");

	const dropdownCompoundBadge: ComponentApiProps = {
		name: "DropdownCompoundBadge",
		heading: "Dropdown Compound Badge",
		description: "A compound badge whose value half opens a dropdown — the key, the value it is set to, and the values it could be set to, in one pill.",
		props: DROPDOWN_COMPOUND_BADGE_PROPS,
		previewHeight: 160,
		imports: ["DropdownItemText"],
		snippetChildren: () => DROPDOWN_COMPOUND_BADGE_SNIPPET,
		preview: values => (
			<DropdownCompoundBadge
				leftContent={values.leftContent}
				rightContent={values.rightContent}
				loading={values.loading}
				chevron={values.chevron}
				round={values.round}
				fill={values.fill}
				filter={values.filter}
				allowMultiple={values.allowMultiple}
				disabled={values.disabled}
				leftStyle={values.leftStyle ? {backgroundColor: values.leftStyle, color: "white"} : {}}
				rightStyle={values.rightStyle ? {backgroundColor: values.rightStyle, color: "white"} : {}}>
				{ENVIRONMENT_OPTIONS.map(option => (
					<DropdownItemText
						key={option}
						label={option}
						value={option.toLowerCase()}
						selected={option === values.rightContent}></DropdownItemText>
				))}
			</DropdownCompoundBadge>
		)
	};

	return (
		<ComponentDoc
			title="Compound Badge"
			description="A badge split into two halves — a key on the left and its value on the right — for the times one label is not enough. It reads as a single pill, so a row of them lines up the way a row of badges does."
			name="CompoundBadge"
			props={COMPOUND_BADGE_PROPS}
			previewHeight={120}
			snippetChildren={values => values.children}
			siblings={[dropdownCompoundBadge]}
			preview={values => (
				<CompoundBadge
					leftContent={values.leftContent}
					loading={values.loading}
					round={values.round}
					fill={values.fill}
					leftStyle={values.leftStyle ? {backgroundColor: values.leftStyle, color: "white"} : {}}
					rightStyle={values.rightStyle ? {backgroundColor: values.rightStyle, color: "white"} : {}}>
					{values.children}
				</CompoundBadge>
			)}>

			<GeneralHeading>Default Compound Badge</GeneralHeading>
			<CompoundBadge leftContent="Environment">Production</CompoundBadge>

			<GeneralHeading>Key Value Pairs</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundBadge leftContent="Region">eu-west-1</CompoundBadge>
				<CompoundBadge leftContent="Version">v0.4.14</CompoundBadge>
				<CompoundBadge leftContent="Owner">Platform</CompoundBadge>
			</div>

			<GeneralHeading>Rounded</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundBadge leftContent="Status" round={true}>Healthy</CompoundBadge>
				<CompoundBadge leftContent="Replicas" round={true}>3 / 3</CompoundBadge>
			</div>

			<GeneralHeading>Custom Colours</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundBadge
					leftContent="Build"
					leftStyle={{backgroundColor: "#166534", color: "white"}}
					rightStyle={{backgroundColor: "#22c55e", color: "white"}}>Passing</CompoundBadge>
				<CompoundBadge
					leftContent="Build"
					leftStyle={{backgroundColor: "#991b1b", color: "white"}}
					rightStyle={{backgroundColor: "#ef4444", color: "white"}}>Failing</CompoundBadge>
				<CompoundBadge
					leftContent="Build"
					leftStyle={{backgroundColor: "#92400e", color: "white"}}
					rightStyle={{backgroundColor: "#f59e0b", color: "white"}}>Queued</CompoundBadge>
			</div>

			<GeneralHeading>With An Icon</GeneralHeading>
			<CompoundBadge leftContent={<i className="ri-git-branch-line"></i>}>main</CompoundBadge>

			<GeneralHeading>Interactive And Removable</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundBadge leftContent="Filter" onClick={() => console.log("badge clicked")}>Clickable</CompoundBadge>
				<CompoundBadge leftContent="Filter" onRemove={() => console.log("badge removed")}>Removable</CompoundBadge>
			</div>

			<GeneralHeading>Filled</GeneralHeading>
			<div style={{width: "320px"}}>
				<CompoundBadge leftContent="Path" fill={true}>/var/log/foundations/build.log</CompoundBadge>
			</div>

			<GeneralHeading>Loading</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center"}}>
				<CompoundBadge leftContent="Build" loading={true}>Resolving</CompoundBadge>
				<CompoundBadge
					leftContent="Build"
					loading={true}
					round={true}
					leftStyle={{backgroundColor: "#1e40af", color: "white"}}
					rightStyle={{backgroundColor: "#3b82f6", color: "white"}}>Running</CompoundBadge>
			</div>

			<GeneralHeading>Trailing Content</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundBadge leftContent="Failures" trailingContent={<i className="ri-error-warning-line"></i>}>3</CompoundBadge>
				<CompoundBadge
					leftContent="Alerts"
					trailingContent={<i className="ri-notification-3-line"></i>}
					onRemove={() => console.log("badge removed")}>12</CompoundBadge>
			</div>

			<GeneralHeading>Dropdown Compound Badge</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center"}}>
				<DropdownCompoundBadge
					leftContent="Environment"
					rightContent={environment}
					onSelection={item => setEnvironment(item.label)}>
					{ENVIRONMENT_OPTIONS.map(option => (
						<DropdownItemText
							key={option}
							label={option}
							value={option.toLowerCase()}
							selected={option === environment}></DropdownItemText>
					))}
				</DropdownCompoundBadge>
				<DropdownCompoundBadge
					leftContent="Environment"
					rightContent="Loading"
					loading={true}>
					{ENVIRONMENT_OPTIONS.map(option => (
						<DropdownItemText
							key={option}
							label={option}
							value={option.toLowerCase()}
							selected={false}></DropdownItemText>
					))}
				</DropdownCompoundBadge>
				<DropdownCompoundBadge
					leftContent="Environment"
					rightContent={environment}
					round={true}
					onRemove={() => console.log("badge removed")}
					onSelection={item => setEnvironment(item.label)}>
					{ENVIRONMENT_OPTIONS.map(option => (
						<DropdownItemText
							key={option}
							label={option}
							value={option.toLowerCase()}
							selected={option === environment}></DropdownItemText>
					))}
				</DropdownCompoundBadge>
			</div>
		</ComponentDoc>
	)
}
