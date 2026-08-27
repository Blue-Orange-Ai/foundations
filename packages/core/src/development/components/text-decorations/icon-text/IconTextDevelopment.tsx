import React from "react";

import './IconTextDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {
	IconText,
	IconTextPosition,
	IconTextSize
} from "../../../../components/text-decorations/icon-text/IconText";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const ICON_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "agent-demo-10",
		description: "The text the icon is put against."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-server-line",
		description: "A remixicon class — the icon shown beside the text."
	},
	{
		name: "iconElement",
		type: "ReactNode",
		description: "Anything richer than an icon class — an avatar, an image, a status dot. Takes precedence over icon."
	},
	{
		name: "iconPosition",
		type: "IconTextPosition",
		default: "IconTextPosition.LEFT",
		defaultValue: IconTextPosition.LEFT,
		control: "select",
		options: [
			{label: "Left", value: IconTextPosition.LEFT, code: "IconTextPosition.LEFT"},
			{label: "Right", value: IconTextPosition.RIGHT, code: "IconTextPosition.RIGHT"}
		],
		description: "Which side of the text the icon sits on."
	},
	{
		name: "size",
		type: "IconTextSize",
		default: "IconTextSize.MEDIUM",
		defaultValue: IconTextSize.MEDIUM,
		control: "select",
		options: [
			{label: "Inherit", value: IconTextSize.INHERIT, code: "IconTextSize.INHERIT"},
			{label: "Small", value: IconTextSize.SMALL, code: "IconTextSize.SMALL"},
			{label: "Medium", value: IconTextSize.MEDIUM, code: "IconTextSize.MEDIUM"},
			{label: "Large", value: IconTextSize.LARGE, code: "IconTextSize.LARGE"}
		],
		description: "How large the line reads. The icon scales with the text. Inherit takes the font size of whatever it sits in."
	},
	{
		name: "color",
		type: "string",
		control: "color",
		description: "Colours the whole line. Left off it takes the colour it inherits."
	},
	{
		name: "iconColor",
		type: "string",
		control: "color",
		description: "Colours the icon on its own, for a status colour against ordinary text."
	},
	{
		name: "mutedIcon",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Holds the icon back from the text so the text stays the thing being read."
	},
	{
		name: "bold",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Weights the text, leaving the icon as it is."
	},
	{
		name: "gap",
		type: "number",
		default: "6",
		control: "slider",
		min: 0,
		max: 24,
		step: 1,
		description: "The space between the icon and the text, in pixels."
	},
	{
		name: "truncate",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Keeps the text on one line and cuts it with an ellipsis."
	},
	{
		name: "alignTop",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lines the icon up with the first line rather than the middle, for text that wraps."
	},
	{
		name: "fullWidth",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Fills the width of its parent instead of sitting at the width of its content."
	},
	{
		name: "title",
		type: "string",
		control: "text",
		description: "The native tooltip, worth setting whenever the text can be truncated."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the line."
	},
	{
		name: "iconStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the icon."
	},
	{
		name: "textStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the text."
	},
	{
		name: "onClick",
		type: "(event) => void",
		description: "Makes the line a button — it takes focus, answers enter and space, and underlines on hover."
	}
];

interface Props {
}

export const IconTextDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Icon Text"
			description="An icon put against a line of text — a host beside a server icon, a region beside a globe, a branch beside a branch icon. It is the smallest thing a table cell or a detail row keeps repeating, so it is worth one component rather than a flex row rewritten everywhere. The icon scales with the text, so the pair stays in proportion at any size."
			name="IconText"
			previewHeight={140}
			imports={["IconTextSize", "IconTextPosition"]}
			props={ICON_TEXT_PROPS}
			preview={values => (
				<IconText
					icon={values.icon}
					iconPosition={values.iconPosition}
					size={values.size}
					color={values.color}
					iconColor={values.iconColor}
					mutedIcon={values.mutedIcon}
					bold={values.bold}
					gap={values.gap}
					truncate={values.truncate}
					alignTop={values.alignTop}
					fullWidth={values.fullWidth}
					title={values.title}>
					{values.children}
				</IconText>
			)}>

			<GeneralHeading>Default</GeneralHeading>
			<IconText icon="ri-server-line">agent-demo-10</IconText>

			<GeneralHeading>A column of them</GeneralHeading>
			<Description>What a table cell listing the hosts an entity runs on looks like.</Description>
			<div className="blue-orange-icon-text-development-column">
				<IconText icon="ri-server-line" size={IconTextSize.SMALL}>agent-demo-10</IconText>
				<IconText icon="ri-server-line" size={IconTextSize.SMALL}>agent-demo-11</IconText>
				<IconText icon="ri-server-line" size={IconTextSize.SMALL}>agent-demo-12</IconText>
			</div>

			<GeneralHeading>Sizes</GeneralHeading>
			<div className="blue-orange-icon-text-development-column">
				<IconText icon="ri-git-branch-line" size={IconTextSize.SMALL}>feature/option-cards</IconText>
				<IconText icon="ri-git-branch-line" size={IconTextSize.MEDIUM}>feature/option-cards</IconText>
				<IconText icon="ri-git-branch-line" size={IconTextSize.LARGE}>feature/option-cards</IconText>
			</div>

			<GeneralHeading>Inherited size</GeneralHeading>
			<Description>With IconTextSize.INHERIT the pair takes the font size around it, icon included.</Description>
			<div className="blue-orange-icon-text-development-inherit">
				Deployed to <IconText icon="ri-global-line" size={IconTextSize.INHERIT}>eu-west-2</IconText> this morning.
			</div>

			<GeneralHeading>Status colours</GeneralHeading>
			<Description>Colour the icon on its own to keep the text reading as text.</Description>
			<div className="blue-orange-icon-text-development-column">
				<IconText icon="ri-checkbox-circle-fill" iconColor="#16a34b" mutedIcon={false}>Healthy</IconText>
				<IconText icon="ri-error-warning-fill" iconColor="#f59e0b" mutedIcon={false}>Degraded</IconText>
				<IconText icon="ri-close-circle-fill" iconColor="#e11d48" mutedIcon={false}>Offline</IconText>
			</div>

			<GeneralHeading>Icon on the right</GeneralHeading>
			<IconText icon="ri-external-link-line" iconPosition={IconTextPosition.RIGHT}>
				https://atlas.blueorange.ai
			</IconText>

			<GeneralHeading>Truncated</GeneralHeading>
			<Description>In a narrow cell the text is cut rather than wrapped, and the title carries the rest.</Description>
			<div className="blue-orange-icon-text-development-narrow">
				<IconText
					icon="ri-file-text-line"
					truncate={true}
					fullWidth={true}
					title="/var/lib/atlas/deployments/demo/services/gateway/application.yml">
					/var/lib/atlas/deployments/demo/services/gateway/application.yml
				</IconText>
			</div>

			<GeneralHeading>Against text that wraps</GeneralHeading>
			<div className="blue-orange-icon-text-development-narrow">
				<IconText icon="ri-information-line" alignTop={true} size={IconTextSize.SMALL}>
					The host was last seen four minutes ago, so it has been marked offline and is being skipped for work.
				</IconText>
			</div>

			<GeneralHeading>As a button</GeneralHeading>
			<Description>Given an onClick it takes focus and answers enter and space.</Description>
			<IconText icon="ri-add-line" bold={true} mutedIcon={false} onClick={() => {}}>Add a host</IconText>

			<GeneralHeading>With an element instead of an icon</GeneralHeading>
			<IconText iconElement={<span className="blue-orange-icon-text-development-dot"></span>} mutedIcon={false}>
				agent-demo-10
			</IconText>
		</ComponentDoc>
	)
}
