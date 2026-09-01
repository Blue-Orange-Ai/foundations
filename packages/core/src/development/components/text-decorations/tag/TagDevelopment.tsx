import React, {useState} from "react";

import './TagDevelopment.css'
import {Tag} from "../../../../components/text-decorations/tag/Tag";
import {DropdownTag} from "../../../../components/text-decorations/dropdown-tag/DropdownTag";
import {DropdownItemText} from "../../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {ComponentApiProps} from "../../../framework/ComponentApi";
import {PropSpec} from "../../../framework/PropSpec";
import {dropdownTriggerProps} from "../../../framework/DropdownProps";

const TAG_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Operational",
		hideFromSnippet: true,
		description: "What the tag reads."
	},
	{
		name: "backgroundColor",
		type: "string",
		default: "\"#18181b\"",
		control: "color",
		description: "The chip's fill."
	},
	{
		name: "textColor",
		type: "string",
		default: "\"white\"",
		control: "color",
		description: "The colour of the text on it."
	},
	{
		name: "round",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Rounds both ends of the chip off completely."
	},
	{
		name: "fill",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stretches the chip across the width it is given. Left off, it is only as wide as what is inside it."
	}
];

const DROPDOWN_TAG_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Production",
		description: "What the tag itself reads — usually the option currently chosen. The options go in children."
	},
	{
		name: "chevron",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "The chevron that marks the tag as something to open."
	},
	{
		name: "backgroundColor",
		type: "string",
		default: "\"#18181b\"",
		control: "color",
		description: "The chip's fill."
	},
	{
		name: "textColor",
		type: "string",
		default: "\"white\"",
		control: "color",
		description: "The colour of the text on it."
	},
	{
		name: "round",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Rounds both ends of the chip off completely."
	},
	{
		name: "fill",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stretches the chip across the width it is given, with the chevron pinned to its right hand end."
	},
	...dropdownTriggerProps()
];

const ENVIRONMENT_OPTIONS = ["Production", "Staging", "Development"];

const SEVERITY_OPTIONS: Array<{label: string, color: string}> = [
	{label: "Critical", color: "#ef4444"},
	{label: "Major", color: "#f59e0b"},
	{label: "Minor", color: "#3b82f6"}
];

const DROPDOWN_TAG_SNIPPET =
	"<DropdownItemText label=\"Production\" value=\"production\" selected={true}></DropdownItemText>\n"
	+ "<DropdownItemText label=\"Staging\" value=\"staging\" selected={false}></DropdownItemText>\n"
	+ "<DropdownItemText label=\"Development\" value=\"development\" selected={false}></DropdownItemText>";

interface Props {
}

export const TagDevelopment: React.FC<Props> = ({}) => {

	const [environment, setEnvironment] = useState("Production");

	const [severity, setSeverity] = useState(SEVERITY_OPTIONS[0]);

	const dropdownTag: ComponentApiProps = {
		name: "DropdownTag",
		heading: "Dropdown Tag",
		description: "A tag that opens a dropdown when it is clicked — for a value read far more often than it is changed, and so not worth a whole input. The options are the same ones Dropdown takes.",
		props: DROPDOWN_TAG_PROPS,
		previewHeight: 160,
		imports: ["DropdownItemText"],
		snippetChildren: () => DROPDOWN_TAG_SNIPPET,
		preview: values => (
			<DropdownTag
				label={values.label}
				chevron={values.chevron}
				backgroundColor={values.backgroundColor}
				textColor={values.textColor}
				round={values.round}
				fill={values.fill}
				filter={values.filter}
				allowMultiple={values.allowMultiple}
				disabled={values.disabled}>
				{ENVIRONMENT_OPTIONS.map(option => (
					<DropdownItemText
						key={option}
						label={option}
						value={option.toLowerCase()}
						selected={option === values.label}></DropdownItemText>
				))}
			</DropdownTag>
		)
	};

	return (
		<ComponentDoc
			title="Tag"
			description="A coloured chip for a status or a label. Unlike Badge it takes its two colours as props, so a set of states can be told apart at a glance."
			name="Tag"
			previewHeight={110}
			snippetChildren={values => values.children}
			props={TAG_PROPS}
			siblings={[dropdownTag]}
			preview={values => (
				<Tag
					backgroundColor={values.backgroundColor}
					textColor={values.textColor}
					round={values.round}
					fill={values.fill}>{values.children}</Tag>
			)}>

			<GeneralHeading>Default Tag</GeneralHeading>
			<Tag>Default</Tag>

			<GeneralHeading>Status Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<Tag backgroundColor="#22c55e" textColor="white">Active</Tag>
				<Tag backgroundColor="#ef4444" textColor="white">Inactive</Tag>
				<Tag backgroundColor="#f59e0b" textColor="white">Pending</Tag>
				<Tag backgroundColor="#3b82f6" textColor="white">In Progress</Tag>
			</div>

			<GeneralHeading>Category Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<Tag backgroundColor="#8b5cf6" textColor="white">Technology</Tag>
				<Tag backgroundColor="#ec4899" textColor="white">Design</Tag>
				<Tag backgroundColor="#06b6d4" textColor="white">Marketing</Tag>
				<Tag backgroundColor="#84cc16" textColor="white">Finance</Tag>
			</div>

			<GeneralHeading>Rounded Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<Tag round={true}>Default</Tag>
				<Tag round={true} backgroundColor="#22c55e" textColor="white">Active</Tag>
				<Tag round={true} backgroundColor="#dbeafe" textColor="#1e40af">Blue</Tag>
			</div>

			<GeneralHeading>Filled Tags</GeneralHeading>
			<div style={{display: "flex", flexDirection: "column", gap: "8px", width: "320px"}}>
				<Tag fill={true}>Stretched across its container</Tag>
				<Tag fill={true} round={true} backgroundColor="#3b82f6" textColor="white">Filled and rounded</Tag>
			</div>

			<GeneralHeading>Light Background Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<Tag backgroundColor="#dbeafe" textColor="#1e40af">Blue</Tag>
				<Tag backgroundColor="#dcfce7" textColor="#166534">Green</Tag>
				<Tag backgroundColor="#fef3c7" textColor="#92400e">Yellow</Tag>
				<Tag backgroundColor="#fee2e2" textColor="#991b1b">Red</Tag>
			</div>

			<GeneralHeading>Dropdown Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap"}}>
				<DropdownTag label={environment} onSelection={item => setEnvironment(item.label)}>
					{ENVIRONMENT_OPTIONS.map(option => (
						<DropdownItemText
							key={option}
							label={option}
							value={option.toLowerCase()}
							selected={option === environment}></DropdownItemText>
					))}
				</DropdownTag>
				<DropdownTag
					label={severity.label}
					round={true}
					backgroundColor={severity.color}
					textColor="white"
					onSelection={item => setSeverity(SEVERITY_OPTIONS.find(option => option.label === item.label) ?? SEVERITY_OPTIONS[0])}>
					{SEVERITY_OPTIONS.map(option => (
						<DropdownItemText
							key={option.label}
							label={option.label}
							value={option.label.toLowerCase()}
							selected={option.label === severity.label}></DropdownItemText>
					))}
				</DropdownTag>
			</div>

			<GeneralHeading>Filtered And Filled</GeneralHeading>
			<div style={{width: "320px"}}>
				<DropdownTag label="Pick a region" fill={true} filter={true} backgroundColor="#3b82f6" textColor="white">
					<DropdownItemText label="eu-west-1" value="eu-west-1" selected={false}></DropdownItemText>
					<DropdownItemText label="eu-west-2" value="eu-west-2" selected={false}></DropdownItemText>
					<DropdownItemText label="us-east-1" value="us-east-1" selected={false}></DropdownItemText>
					<DropdownItemText label="us-west-2" value="us-west-2" selected={false}></DropdownItemText>
					<DropdownItemText label="ap-southeast-2" value="ap-southeast-2" selected={false}></DropdownItemText>
				</DropdownTag>
			</div>
		</ComponentDoc>
	)
}
