import React, {useState} from "react";

import './OptionCardsDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {
	OptionCards,
	OptionCardsIconPlacement,
	OptionCardsSize
} from "../../../../components/inputs/option-cards/option-cards/OptionCards";
import {OptionCard} from "../../../../components/inputs/option-cards/option-card/OptionCard";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const OPTION_CARDS_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The OptionCard entries, in the order they sit in the grid."
	},
	{
		name: "value",
		type: "string",
		control: "text",
		description: "The uuid of the selected option. Setting it moves the selection from the outside."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Package type",
		description: "The label shown above the grid, in the same style as every other input."
	},
	{
		name: "name",
		type: "string",
		description: "Registers the input with a surrounding FormGroup under this key."
	},
	{
		name: "required",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Marks the field as required, and lets a surrounding FormGroup enforce it."
	},
	{
		name: "requiredMessage",
		type: "string",
		description: "Overrides the message shown when a required field is left empty."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help tooltip beside the label."
	},
	{
		name: "columns",
		type: "number",
		default: "2",
		control: "slider",
		min: 1,
		max: 4,
		step: 1,
		description: "How many columns the grid holds. Ignored when minColumnWidth is set."
	},
	{
		name: "minColumnWidth",
		type: "number",
		control: "number",
		description: "Fits as many columns as this width allows, instead of a fixed count."
	},
	{
		name: "size",
		type: "OptionCardsSize",
		default: "OptionCardsSize.MEDIUM",
		defaultValue: OptionCardsSize.MEDIUM,
		control: "select",
		options: [
			{label: "Small", value: OptionCardsSize.SMALL, code: "OptionCardsSize.SMALL"},
			{label: "Medium", value: OptionCardsSize.MEDIUM, code: "OptionCardsSize.MEDIUM"},
			{label: "Large", value: OptionCardsSize.LARGE, code: "OptionCardsSize.LARGE"}
		],
		description: "How much room each card takes."
	},
	{
		name: "iconPlacement",
		type: "OptionCardsIconPlacement",
		default: "OptionCardsIconPlacement.TOP",
		defaultValue: OptionCardsIconPlacement.TOP,
		control: "select",
		options: [
			{label: "Top", value: OptionCardsIconPlacement.TOP, code: "OptionCardsIconPlacement.TOP"},
			{label: "Left", value: OptionCardsIconPlacement.LEFT, code: "OptionCardsIconPlacement.LEFT"}
		],
		description: "Whether the icon keeps its own line above the label or sits beside it."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys every card out and takes the whole group out of the keyboard order."
	},
	{
		name: "allowDeselect",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets a second click on the selected card clear the selection."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	},
	{
		name: "gridStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the grid the cards sit in."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the group."
	},
	{
		name: "onChange",
		type: "(uuid: string) => void",
		description: "Fires with the uuid of the option that was selected, or \"\" when it was cleared."
	},
	{
		name: "validate",
		type: "InputValidateCallback<string>",
		description: "Runs against the selected uuid and renders its message underneath the grid."
	},
	{
		name: "validateOnChange",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Runs the validate callback on every change as well as on blur."
	}
];

const OPTION_CARD_PROPS: Array<PropSpec> = [
	{
		name: "uuid",
		type: "string",
		required: true,
		description: "Identifies the option, and is what value and onChange speak in."
	},
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Internal",
		description: "The line the card leads with."
	},
	{
		name: "hint",
		type: "string",
		control: "text",
		value: "A first-party service, configured by a single application.yml.",
		description: "The sentence underneath the label explaining what picking this means."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-shield-star-line",
		description: "A remixicon class shown above (or beside) the label."
	},
	{
		name: "iconElement",
		type: "React.ReactNode",
		description: "Anything richer than an icon class — an image, a logo, a badge. Takes precedence over icon."
	},
	{
		name: "tag",
		type: "React.ReactNode",
		control: "text",
		description: "A short tag shown alongside the label — \"Beta\", \"Recommended\"."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the card out and takes it out of the keyboard order."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Extra content rendered under the hint. Keep it static — the card itself is the button."
	}
];

interface Props {
}

export const OptionCardsDevelopment: React.FC<Props> = ({}) => {

	const [type, setType] = useState("external");

	const [target, setTarget] = useState("swarm");

	return (
		<ComponentDoc
			title="Option Cards"
			description="A choice made from a grid of cards rather than a dropdown — each option leads with an icon and a label, and explains itself in a line of hint text. It is a radio group, not a tab strip: reach for ButtonTabs when the choice reveals content instead of setting a value."
			name="OptionCards"
			previewHeight={260}
			previewCentered={false}
			imports={["OptionCard", "OptionCardsSize", "OptionCardsIconPlacement"]}
			props={OPTION_CARDS_PROPS}
			snippetChildren={() => "<OptionCard\n\tuuid={\"internal\"}\n\tlabel={\"Internal\"}\n\ticon={\"ri-shield-star-line\"}\n\thint={\"A first-party service, configured by a single application.yml.\"}></OptionCard>\n<OptionCard\n\tuuid={\"external\"}\n\tlabel={\"External\"}\n\ticon={\"ri-box-3-line\"}\n\thint={\"Any other container. Declares the config files the image expects.\"}></OptionCard>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<OptionCards
						label={values.label}
						help={values.help}
						required={values.required}
						columns={values.columns}
						minColumnWidth={values.minColumnWidth}
						size={values.size}
						iconPlacement={values.iconPlacement}
						disabled={values.disabled}
						allowDeselect={values.allowDeselect}
						value={type}
						onChange={setType}>
						<OptionCard
							uuid="internal"
							label="Internal"
							icon="ri-shield-star-line"
							hint="A first-party service, configured by a single application.yml."></OptionCard>
						<OptionCard
							uuid="external"
							label="External"
							icon="ri-box-3-line"
							hint="Any other container. Declares the config files the image expects."></OptionCard>
					</OptionCards>
				</div>
			)}
			siblings={[
				{
					name: "OptionCard",
					description: "Declares one option. Like ButtonTab it renders nothing itself — OptionCards reads its props and its children.",
					props: OPTION_CARD_PROPS,
					previewHeight: 220,
					previewCentered: false,
					imports: ["OptionCards"],
					preview: values => (
						<div style={{width: "100%"}}>
							<OptionCards value="internal">
								<OptionCard
									uuid="internal"
									label={values.label}
									hint={values.hint}
									icon={values.icon}
									tag={values.tag}
									disabled={values.disabled}></OptionCard>
								<OptionCard
									uuid="external"
									label="External"
									icon="ri-box-3-line"
									hint="Any other container."></OptionCard>
							</OptionCards>
						</div>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<Description>Two options, an icon each, and the sentence that tells them apart.</Description>
			<OptionCards label="Package type" value={type} onChange={setType}>
				<OptionCard
					uuid="internal"
					label="Internal"
					icon="ri-shield-star-line"
					hint="A first-party service, configured by a single application.yml (its port is read from server.port)."></OptionCard>
				<OptionCard
					uuid="external"
					label="External"
					icon="ri-box-3-line"
					hint="Any other container. Declares the config files the image expects (with mount paths) and the environment variables it reads."></OptionCard>
			</OptionCards>

			<GeneralHeading>Three columns, with a tag and a disabled option</GeneralHeading>
			<OptionCards
				label="Deployment target"
				columns={3}
				value={target}
				onChange={setTarget}>
				<OptionCard
					uuid="bare-metal"
					label="Bare metal"
					icon="ri-server-line"
					hint="Runs the container directly on the host through the agent."></OptionCard>
				<OptionCard
					uuid="swarm"
					label="Docker Swarm"
					icon="ri-stack-line"
					tag="Recommended"
					hint="Schedules the service across the swarm and keeps the replica count."></OptionCard>
				<OptionCard
					uuid="kubernetes"
					label="Kubernetes"
					icon="ri-ship-line"
					disabled={true}
					hint="Not available on this deployment yet."></OptionCard>
			</OptionCards>

			<GeneralHeading>Icon beside the label</GeneralHeading>
			<Description>Better when the hint runs long, since the text keeps the rest of the row.</Description>
			<OptionCards iconPlacement={OptionCardsIconPlacement.LEFT} value="restart">
				<OptionCard
					uuid="restart"
					label="Restart in place"
					icon="ri-restart-line"
					hint="Stops the running container and starts the new one behind it. The service is unavailable for the length of the restart."></OptionCard>
				<OptionCard
					uuid="blue-green"
					label="Blue / green"
					icon="ri-swap-line"
					hint="Brings the new version up alongside the old one, soaks it, and moves the load balancer across once it is healthy."></OptionCard>
			</OptionCards>

			<GeneralHeading>Sizes</GeneralHeading>
			<div className="blue-orange-option-cards-development-stack">
				<OptionCards size={OptionCardsSize.SMALL} value="small">
					<OptionCard uuid="small" label="Small" icon="ri-checkbox-blank-circle-line" hint="For a dense form."></OptionCard>
					<OptionCard uuid="small-b" label="Cards" icon="ri-checkbox-blank-circle-line" hint="For a dense form."></OptionCard>
				</OptionCards>
				<OptionCards size={OptionCardsSize.MEDIUM} value="medium">
					<OptionCard uuid="medium" label="Medium" icon="ri-checkbox-blank-circle-line" hint="The default."></OptionCard>
					<OptionCard uuid="medium-b" label="Cards" icon="ri-checkbox-blank-circle-line" hint="The default."></OptionCard>
				</OptionCards>
				<OptionCards size={OptionCardsSize.LARGE} value="large">
					<OptionCard uuid="large" label="Large" icon="ri-checkbox-blank-circle-line" hint="For a step that is the whole page."></OptionCard>
					<OptionCard uuid="large-b" label="Cards" icon="ri-checkbox-blank-circle-line" hint="For a step that is the whole page."></OptionCard>
				</OptionCards>
			</div>

			<GeneralHeading>Fitted columns</GeneralHeading>
			<Description>With minColumnWidth the grid fits as many columns as the width allows.</Description>
			<OptionCards minColumnWidth={220} value="postgres">
				<OptionCard uuid="postgres" label="PostgreSQL" icon="ri-database-2-line" hint="A single primary."></OptionCard>
				<OptionCard uuid="citus" label="Citus" icon="ri-database-line" hint="A coordinator with workers."></OptionCard>
				<OptionCard uuid="elastic" label="Elasticsearch" icon="ri-search-line" hint="A search cluster."></OptionCard>
				<OptionCard uuid="rabbit" label="RabbitMQ" icon="ri-mail-send-line" hint="A queue cluster."></OptionCard>
			</OptionCards>

			<GeneralHeading>With extra content</GeneralHeading>
			<Description>Children are rendered under the hint. Keep them static — the card itself is the button.</Description>
			<OptionCards value="pro" iconPlacement={OptionCardsIconPlacement.LEFT}>
				<OptionCard uuid="free" label="Free" icon="ri-price-tag-3-line" hint="For a single environment.">
					<span className="blue-orange-option-cards-development-price">£0 / month</span>
				</OptionCard>
				<OptionCard uuid="pro" label="Pro" icon="ri-vip-crown-line" hint="Every environment, with support.">
					<span className="blue-orange-option-cards-development-price">£49 / month</span>
				</OptionCard>
			</OptionCards>
		</ComponentDoc>
	)
}
