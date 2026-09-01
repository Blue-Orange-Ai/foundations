import React, {useState} from "react";

import './CompoundTagDevelopment.css'
import {CompoundTag} from "../../../../components/text-decorations/compound-tag/CompoundTag";
import {DropdownCompoundTag} from "../../../../components/text-decorations/dropdown-compound-tag/DropdownCompoundTag";
import {DropdownItemText} from "../../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {ComponentApiProps} from "../../../framework/ComponentApi";
import {PropSpec} from "../../../framework/PropSpec";
import {dropdownTriggerProps} from "../../../framework/DropdownProps";

const COMPOUND_TAG_PROPS: Array<PropSpec> = [
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
		description: "Sits at the end of the right half, after the value and before the remove button — a count, a status dot, the chevron DropdownCompoundTag puts there."
	},
	{
		name: "leftBackgroundColor",
		type: "string",
		default: "\"#18181b\"",
		control: "color",
		description: "The fill behind the key."
	},
	{
		name: "leftTextColor",
		type: "string",
		default: "\"white\"",
		control: "color",
		description: "The colour of the key's text."
	},
	{
		name: "rightBackgroundColor",
		type: "string",
		default: "\"#52525b\"",
		control: "color",
		description: "The fill behind the value — a lighter shade of the key's fill reads best."
	},
	{
		name: "rightTextColor",
		type: "string",
		default: "\"white\"",
		control: "color",
		description: "The colour of the value's text."
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
		description: "Stretches the tag across the width it is given, with the right half taking up the slack."
	},
	{
		name: "onClick",
		type: "(event: React.MouseEvent<HTMLDivElement>) => void",
		description: "Given a handler, the whole tag becomes interactive — it takes a pointer cursor and lifts on hover."
	},
	{
		name: "onRemove",
		type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
		description: "Given a handler, a remove button appears on the right half. It does not bubble into onClick."
	}
];

const DROPDOWN_COMPOUND_TAG_PROPS: Array<PropSpec> = [
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
		description: "The chevron that marks the tag as something to open. It goes in the right half, where trailingContent would."
	},
	{
		name: "leftBackgroundColor",
		type: "string",
		default: "\"#18181b\"",
		control: "color",
		description: "The fill behind the key."
	},
	{
		name: "leftTextColor",
		type: "string",
		default: "\"white\"",
		control: "color",
		description: "The colour of the key's text, and of the spinner that stands in for it."
	},
	{
		name: "rightBackgroundColor",
		type: "string",
		default: "\"#52525b\"",
		control: "color",
		description: "The fill behind the value."
	},
	{
		name: "rightTextColor",
		type: "string",
		default: "\"white\"",
		control: "color",
		description: "The colour of the value's text, and of the chevron beside it."
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
		description: "Stretches the tag across the width it is given."
	},
	{
		name: "onRemove",
		type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
		description: "Given a handler, a remove button appears on the right half. It sits above the dropdown, so removing the tag does not open it."
	},
	...dropdownTriggerProps()
];

const ENVIRONMENT_OPTIONS = ["Production", "Staging", "Development"];

const DROPDOWN_COMPOUND_TAG_SNIPPET =
	"<DropdownItemText label=\"Production\" value=\"production\" selected={true}></DropdownItemText>\n"
	+ "<DropdownItemText label=\"Staging\" value=\"staging\" selected={false}></DropdownItemText>\n"
	+ "<DropdownItemText label=\"Development\" value=\"development\" selected={false}></DropdownItemText>";

interface Props {
}

export const CompoundTagDevelopment: React.FC<Props> = ({}) => {

	const [environment, setEnvironment] = useState("Production");

	const [branch, setBranch] = useState("main");

	const dropdownCompoundTag: ComponentApiProps = {
		name: "DropdownCompoundTag",
		heading: "Dropdown Compound Tag",
		description: "A compound tag whose value half opens a dropdown — the key, the value it is set to, and the values it could be set to, in one pill.",
		props: DROPDOWN_COMPOUND_TAG_PROPS,
		previewHeight: 160,
		imports: ["DropdownItemText"],
		snippetChildren: () => DROPDOWN_COMPOUND_TAG_SNIPPET,
		preview: values => (
			<DropdownCompoundTag
				leftContent={values.leftContent}
				rightContent={values.rightContent}
				loading={values.loading}
				chevron={values.chevron}
				leftBackgroundColor={values.leftBackgroundColor}
				leftTextColor={values.leftTextColor}
				rightBackgroundColor={values.rightBackgroundColor}
				rightTextColor={values.rightTextColor}
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
						selected={option === values.rightContent}></DropdownItemText>
				))}
			</DropdownCompoundTag>
		)
	};

	return (
		<ComponentDoc
			title="Compound Tag"
			description="A tag split into two halves — a key on the left and its value on the right. Unlike Compound Badge it takes its colours as props, so a set of pairs can be told apart at a glance."
			name="CompoundTag"
			props={COMPOUND_TAG_PROPS}
			previewHeight={120}
			snippetChildren={values => values.children}
			siblings={[dropdownCompoundTag]}
			preview={values => (
				<CompoundTag
					leftContent={values.leftContent}
					loading={values.loading}
					leftBackgroundColor={values.leftBackgroundColor}
					leftTextColor={values.leftTextColor}
					rightBackgroundColor={values.rightBackgroundColor}
					rightTextColor={values.rightTextColor}
					round={values.round}
					fill={values.fill}>
					{values.children}
				</CompoundTag>
			)}>

			<GeneralHeading>Default Compound Tag</GeneralHeading>
			<CompoundTag leftContent="Environment">Production</CompoundTag>

			<GeneralHeading>Status Pairs</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundTag leftContent="Build" leftBackgroundColor="#166534" rightBackgroundColor="#22c55e">Passing</CompoundTag>
				<CompoundTag leftContent="Build" leftBackgroundColor="#991b1b" rightBackgroundColor="#ef4444">Failing</CompoundTag>
				<CompoundTag leftContent="Build" leftBackgroundColor="#92400e" rightBackgroundColor="#f59e0b">Queued</CompoundTag>
				<CompoundTag leftContent="Build" leftBackgroundColor="#1e40af" rightBackgroundColor="#3b82f6">Running</CompoundTag>
			</div>

			<GeneralHeading>Light Fills</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundTag
					leftContent="Region"
					leftBackgroundColor="#bfdbfe" leftTextColor="#1e3a8a"
					rightBackgroundColor="#dbeafe" rightTextColor="#1e40af">eu-west-1</CompoundTag>
				<CompoundTag
					leftContent="Tier"
					leftBackgroundColor="#bbf7d0" leftTextColor="#14532d"
					rightBackgroundColor="#dcfce7" rightTextColor="#166534">Enterprise</CompoundTag>
				<CompoundTag
					leftContent="Plan"
					leftBackgroundColor="#fde68a" leftTextColor="#78350f"
					rightBackgroundColor="#fef3c7" rightTextColor="#92400e">Annual</CompoundTag>
			</div>

			<GeneralHeading>Rounded</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundTag leftContent="Replicas" round={true}>3 / 3</CompoundTag>
				<CompoundTag leftContent="Uptime" round={true} leftBackgroundColor="#166534" rightBackgroundColor="#22c55e">99.98%</CompoundTag>
			</div>

			<GeneralHeading>With An Icon</GeneralHeading>
			<CompoundTag leftContent={<i className="ri-git-branch-line"></i>}>main</CompoundTag>

			<GeneralHeading>Interactive And Removable</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundTag leftContent="Filter" onClick={() => console.log("tag clicked")}>Clickable</CompoundTag>
				<CompoundTag leftContent="Filter" onRemove={() => console.log("tag removed")}>Removable</CompoundTag>
			</div>

			<GeneralHeading>Filled</GeneralHeading>
			<div style={{width: "320px"}}>
				<CompoundTag leftContent="Path" fill={true}>/var/log/foundations/build.log</CompoundTag>
			</div>

			<GeneralHeading>Loading</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center"}}>
				<CompoundTag leftContent="Build" loading={true}>Resolving</CompoundTag>
				<CompoundTag
					leftContent="Build"
					loading={true}
					round={true}
					leftBackgroundColor="#1e40af"
					rightBackgroundColor="#3b82f6">Running</CompoundTag>
			</div>

			<GeneralHeading>Trailing Content</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<CompoundTag leftContent="Failures" trailingContent={<i className="ri-error-warning-line"></i>}>3</CompoundTag>
				<CompoundTag
					leftContent="Alerts"
					trailingContent={<i className="ri-notification-3-line"></i>}
					onRemove={() => console.log("tag removed")}>12</CompoundTag>
			</div>

			<GeneralHeading>Dropdown Compound Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center"}}>
				<DropdownCompoundTag
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
				</DropdownCompoundTag>
				<DropdownCompoundTag
					leftContent={<i className="ri-git-branch-line"></i>}
					rightContent={branch}
					round={true}
					filter={true}
					leftBackgroundColor="#166534"
					rightBackgroundColor="#22c55e"
					onSelection={item => setBranch(item.label)}>
					<DropdownItemText label="main" value="main" selected={branch === "main"}></DropdownItemText>
					<DropdownItemText label="develop" value="develop" selected={branch === "develop"}></DropdownItemText>
					<DropdownItemText label="feature/tag-dropdowns" value="feature" selected={branch === "feature/tag-dropdowns"}></DropdownItemText>
				</DropdownCompoundTag>
			</div>

			<GeneralHeading>Loading And Removable</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center"}}>
				<DropdownCompoundTag leftContent="Environment" rightContent="Loading" loading={true}>
					{ENVIRONMENT_OPTIONS.map(option => (
						<DropdownItemText
							key={option}
							label={option}
							value={option.toLowerCase()}
							selected={false}></DropdownItemText>
					))}
				</DropdownCompoundTag>
				<DropdownCompoundTag
					leftContent="Environment"
					rightContent={environment}
					onRemove={() => console.log("tag removed")}
					onSelection={item => setEnvironment(item.label)}>
					{ENVIRONMENT_OPTIONS.map(option => (
						<DropdownItemText
							key={option}
							label={option}
							value={option.toLowerCase()}
							selected={option === environment}></DropdownItemText>
					))}
				</DropdownCompoundTag>
			</div>
		</ComponentDoc>
	)
}
