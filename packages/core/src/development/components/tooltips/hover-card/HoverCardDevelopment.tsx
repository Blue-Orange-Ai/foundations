import React from "react";

import './HoverCardDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {
	HoverCard,
	HoverCardAlign,
	HoverCardSide
} from "../../../../components/tooltips/hover-card/hover-card/HoverCard";
import {HoverCardTrigger} from "../../../../components/tooltips/hover-card/hover-card-trigger/HoverCardTrigger";
import {HoverCardContent} from "../../../../components/tooltips/hover-card/hover-card-content/HoverCardContent";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const HOVER_CARD_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "A HoverCardTrigger and a HoverCardContent."
	},
	{
		name: "side",
		type: "HoverCardSide",
		default: "HoverCardSide.BOTTOM",
		defaultValue: HoverCardSide.BOTTOM,
		control: "select",
		options: [
			{label: "Bottom", value: HoverCardSide.BOTTOM, code: "HoverCardSide.BOTTOM"},
			{label: "Top", value: HoverCardSide.TOP, code: "HoverCardSide.TOP"},
			{label: "Left", value: HoverCardSide.LEFT, code: "HoverCardSide.LEFT"},
			{label: "Right", value: HoverCardSide.RIGHT, code: "HoverCardSide.RIGHT"}
		],
		description: "Which side of the trigger the card opens on."
	},
	{
		name: "align",
		type: "HoverCardAlign",
		default: "HoverCardAlign.CENTER",
		defaultValue: HoverCardAlign.CENTER,
		control: "select",
		options: [
			{label: "Center", value: HoverCardAlign.CENTER, code: "HoverCardAlign.CENTER"},
			{label: "Start", value: HoverCardAlign.START, code: "HoverCardAlign.START"},
			{label: "End", value: HoverCardAlign.END, code: "HoverCardAlign.END"}
		],
		description: "How the card lines up along that side."
	},
	{
		name: "sideOffset",
		type: "number",
		default: "8",
		control: "slider",
		min: 0,
		max: 32,
		step: 2,
		description: "The gap between the trigger and the card, in pixels."
	},
	{
		name: "openDelay",
		type: "number",
		default: "300",
		control: "slider",
		min: 0,
		max: 1000,
		step: 50,
		description: "How long the pointer has to rest on the trigger before the card opens."
	},
	{
		name: "closeDelay",
		type: "number",
		default: "150",
		control: "slider",
		min: 0,
		max: 1000,
		step: 50,
		description: "How long the card stays open after the pointer leaves — enough to move onto it."
	},
	{
		name: "open",
		type: "boolean",
		description: "Drives the card from the outside. Left unset it manages itself."
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		description: "Fires whenever the card opens or closes."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stops the card opening at all."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the wrapper."
	}
];

const HOVER_CARD_SECTION_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "What the pointer rests on."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the trigger."
	}
];

const HOVER_CARD_CONTENT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "What the card holds."
	},
	{
		name: "width",
		type: "number",
		default: "280",
		control: "slider",
		min: 160,
		max: 520,
		step: 20,
		description: "Width of the card, in pixels."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the card."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the card."
	}
];

interface Props {
}

export const HoverCardDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Hover Card"
			description="Extra detail shown when the pointer rests on a trigger. Unlike a tooltip the card is interactive and can hold anything — a profile, a summary, a set of links — and it can be driven from the outside where the application wants control of it."
			name="HoverCard"
			previewHeight={220}
			imports={["HoverCardTrigger", "HoverCardContent", "HoverCardSide", "HoverCardAlign"]}
			props={HOVER_CARD_PROPS}
			snippetChildren={() => "<HoverCardTrigger>\n\t<Button text={\"Melbourne Depot\"} buttonType={ButtonType.CLEAR}></Button>\n</HoverCardTrigger>\n<HoverCardContent>\n\t<div>Operational since 2019. Six bays, two of them refrigerated.</div>\n</HoverCardContent>"}
			preview={values => (
				<HoverCard
					side={values.side}
					align={values.align}
					sideOffset={values.sideOffset}
					openDelay={values.openDelay}
					closeDelay={values.closeDelay}
					disabled={values.disabled}>
					<HoverCardTrigger>
						<Button text={"Melbourne Depot"} buttonType={ButtonType.SECONDARY}></Button>
					</HoverCardTrigger>
					<HoverCardContent>
						<div>Operational since 2019. Six bays, two of them refrigerated.</div>
					</HoverCardContent>
				</HoverCard>
			)}
			siblings={[
				{
					name: "HoverCardTrigger",
					description: "What the pointer has to rest on. It is focusable, so the card can be reached from the keyboard too.",
					props: HOVER_CARD_SECTION_PROPS,
					previewHeight: 120,
					snippetChildren: () => "<Button text={\"Melbourne Depot\"} buttonType={ButtonType.CLEAR}></Button>",
					preview: () => (
						<HoverCardTrigger>
							<Button text={"Melbourne Depot"} buttonType={ButtonType.SECONDARY}></Button>
						</HoverCardTrigger>
					)
				},
				{
					name: "HoverCardContent",
					description: "The card itself. Its width is a prop because the content usually cannot size it sensibly on its own.",
					props: HOVER_CARD_CONTENT_PROPS,
					previewHeight: 140,
					snippetChildren: () => "<div>Operational since 2019.</div>",
					preview: values => (
						<HoverCardContent width={values.width} classes={values.classes}>
							<div>Operational since 2019. Six bays, two of them refrigerated.</div>
						</HoverCardContent>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<div className="blue-orange-hover-card-development-row">
				<HoverCard>
					<HoverCardTrigger>
						<span className="blue-orange-hover-card-development-mention">@blueorange</span>
					</HoverCardTrigger>
					<HoverCardContent>
						<div className="blue-orange-hover-card-development-profile">
							<div className="blue-orange-hover-card-development-initials">BO</div>
							<div>
								<div className="blue-orange-hover-card-development-name">Blue Orange AI</div>
								<div className="blue-orange-hover-card-development-handle">@blueorange</div>
							</div>
						</div>
						<div>The team behind the Foundations component library.</div>
						<Button text="Follow" buttonType={ButtonType.SECONDARY}></Button>
					</HoverCardContent>
				</HoverCard>
			</div>

			<GeneralHeading>Sides</GeneralHeading>
			<Description>The card flips to the opposite side when it would run off the screen.</Description>
			<div className="blue-orange-hover-card-development-row">
				<HoverCard side={HoverCardSide.TOP}>
					<HoverCardTrigger>
						<Button text="Top" buttonType={ButtonType.SECONDARY}></Button>
					</HoverCardTrigger>
					<HoverCardContent width={200}>Opens above the trigger.</HoverCardContent>
				</HoverCard>
				<HoverCard side={HoverCardSide.RIGHT}>
					<HoverCardTrigger>
						<Button text="Right" buttonType={ButtonType.SECONDARY}></Button>
					</HoverCardTrigger>
					<HoverCardContent width={200}>Opens to the right.</HoverCardContent>
				</HoverCard>
				<HoverCard side={HoverCardSide.BOTTOM}>
					<HoverCardTrigger>
						<Button text="Bottom" buttonType={ButtonType.SECONDARY}></Button>
					</HoverCardTrigger>
					<HoverCardContent width={200}>Opens below the trigger.</HoverCardContent>
				</HoverCard>
				<HoverCard side={HoverCardSide.LEFT}>
					<HoverCardTrigger>
						<Button text="Left" buttonType={ButtonType.SECONDARY}></Button>
					</HoverCardTrigger>
					<HoverCardContent width={200}>Opens to the left.</HoverCardContent>
				</HoverCard>
			</div>

			<GeneralHeading>Alignment and delay</GeneralHeading>
			<div className="blue-orange-hover-card-development-row">
				<HoverCard align={HoverCardAlign.START} openDelay={0}>
					<HoverCardTrigger>
						<Button text="Instant, start aligned" buttonType={ButtonType.SECONDARY}></Button>
					</HoverCardTrigger>
					<HoverCardContent width={240}>No delay before opening.</HoverCardContent>
				</HoverCard>
				<HoverCard align={HoverCardAlign.END} openDelay={600}>
					<HoverCardTrigger>
						<Button text="Slow, end aligned" buttonType={ButtonType.SECONDARY}></Button>
					</HoverCardTrigger>
					<HoverCardContent width={240}>Waits 600ms before opening.</HoverCardContent>
				</HoverCard>
			</div>
		</ComponentDoc>
	)
}
