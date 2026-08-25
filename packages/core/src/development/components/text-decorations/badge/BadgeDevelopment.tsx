import React from "react";

import './BadgeDevelopment.css'
import {Badge} from "../../../../components/text-decorations/badge/Badge";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

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

interface Props {
}

export const BadgeDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Badge"
			description="A small pill for a label or a status — a count beside a heading, a state beside a row. It renders whatever it is given, so the text, an icon or both can go inside it."
			name="Badge"
			props={BADGE_PROPS}
			previewHeight={120}
			snippetChildren={values => values.children}
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
		</ComponentDoc>
	)
}
