import React from "react";

import './CompoundTagDevelopment.css'
import {CompoundTag} from "../../../../components/text-decorations/compound-tag/CompoundTag";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const COMPOUND_TAG_PROPS: Array<PropSpec> = [
	{
		name: "leftContent",
		type: "ReactNode",
		required: true,
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

interface Props {
}

export const CompoundTagDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Compound Tag"
			description="A tag split into two halves — a key on the left and its value on the right. Unlike Compound Badge it takes its colours as props, so a set of pairs can be told apart at a glance."
			name="CompoundTag"
			props={COMPOUND_TAG_PROPS}
			previewHeight={120}
			snippetChildren={values => values.children}
			preview={values => (
				<CompoundTag
					leftContent={values.leftContent}
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
		</ComponentDoc>
	)
}
