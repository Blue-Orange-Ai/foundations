import React from "react";

import './CompoundBadgeDevelopment.css'
import {CompoundBadge} from "../../../../components/text-decorations/compound-badge/CompoundBadge";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const COMPOUND_BADGE_PROPS: Array<PropSpec> = [
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

interface Props {
}

export const CompoundBadgeDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Compound Badge"
			description="A badge split into two halves — a key on the left and its value on the right — for the times one label is not enough. It reads as a single pill, so a row of them lines up the way a row of badges does."
			name="CompoundBadge"
			props={COMPOUND_BADGE_PROPS}
			previewHeight={120}
			snippetChildren={values => values.children}
			preview={values => (
				<CompoundBadge
					leftContent={values.leftContent}
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
		</ComponentDoc>
	)
}
