import React from "react";

import './TagDevelopment.css'
import {Tag} from "../../../../components/text-decorations/tag/Tag";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

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
	}
];

interface Props {
}

export const TagDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Tag"
			description="A coloured chip for a status or a label. Unlike Badge it takes its two colours as props, so a set of states can be told apart at a glance."
			name="Tag"
			previewHeight={110}
			snippetChildren={values => values.children}
			props={TAG_PROPS}
			preview={values => (
				<Tag backgroundColor={values.backgroundColor} textColor={values.textColor}>{values.children}</Tag>
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

			<GeneralHeading>Light Background Tags</GeneralHeading>
			<div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
				<Tag backgroundColor="#dbeafe" textColor="#1e40af">Blue</Tag>
				<Tag backgroundColor="#dcfce7" textColor="#166534">Green</Tag>
				<Tag backgroundColor="#fef3c7" textColor="#92400e">Yellow</Tag>
				<Tag backgroundColor="#fee2e2" textColor="#991b1b">Red</Tag>
			</div>
		</ComponentDoc>
	)
}
