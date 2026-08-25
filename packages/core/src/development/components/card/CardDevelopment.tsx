import React from "react";

import './CardDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Card} from "../../../components/card/card/Card";
import {CardHeader} from "../../../components/card/card-header/CardHeader";
import {CardTitle} from "../../../components/card/card-title/CardTitle";
import {CardDescription} from "../../../components/card/card-description/CardDescription";
import {CardAction} from "../../../components/card/card-action/CardAction";
import {CardContent} from "../../../components/card/card-content/CardContent";
import {CardFooter} from "../../../components/card/card-footer/CardFooter";
import {Button, ButtonSize, ButtonType} from "../../../components/buttons/button/Button";
import {ButtonIcon} from "../../../components/buttons/button-icon/ButtonIcon";
import {Input} from "../../../components/inputs/input/Input";
import {Badge} from "../../../components/text-decorations/badge/Badge";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const CARD_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The card's sections, in the order they should be read."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the card."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Makes the whole card clickable, and gives it the hover treatment that says so."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the card."
	},
	{
		name: "clickable",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — hands the card an onClick so the clickable treatment can be seen."
	},
	{
		name: "separated",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — draws the separators on the header and the footer."
	}
];

const CARD_SECTION_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The section's content."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the section."
	}
];

const CARD_SECTION_SEPARATED_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The section's content."
	},
	{
		name: "separated",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Draws a separator between this section and the body of the card."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the section."
	}
];

interface Props {
}

export const CardDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Card"
			description="A surface for grouping related content. It is composed rather than configured — a header, a title, a description, content, an action and a footer, each of them optional."
			name="Card"
			previewHeight={260}
			imports={["CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"]}
			props={CARD_PROPS}
			snippetChildren={() => "<CardHeader>\n\t<CardTitle>Melbourne Depot</CardTitle>\n\t<CardDescription>Operational since 2019</CardDescription>\n</CardHeader>\n<CardContent>\n\t<p>Six bays, two of them refrigerated.</p>\n</CardContent>\n<CardFooter>\n\t<Button text={\"Open\"} buttonType={ButtonType.SECONDARY}></Button>\n</CardFooter>"}
			preview={values => (
				<Card classes={values.classes} onClick={values.clickable ? () => {} : undefined} style={{width: "320px"}}>
					<CardHeader separated={values.separated}>
						<CardTitle>Melbourne Depot</CardTitle>
						<CardDescription>Operational since 2019</CardDescription>
					</CardHeader>
					<CardContent>
						<p style={{margin: 0}}>Six bays, two of them refrigerated.</p>
					</CardContent>
					<CardFooter separated={values.separated}>
						<Button text={"Open"} buttonType={ButtonType.SECONDARY}></Button>
					</CardFooter>
				</Card>
			)}
			siblings={[
				{
					name: "CardHeader",
					description: "The top of the card. It holds the title, the description and — where there is one — the action button on the right.",
					props: CARD_SECTION_SEPARATED_PROPS,
					previewHeight: 140,
					snippetChildren: () => "<CardTitle>Melbourne Depot</CardTitle>\n<CardDescription>Operational since 2019</CardDescription>",
					imports: ["CardTitle", "CardDescription"],
					preview: values => (
						<div style={{width: "300px"}}>
							<CardHeader separated={values.separated}>
								<CardTitle>Melbourne Depot</CardTitle>
								<CardDescription>Operational since 2019</CardDescription>
							</CardHeader>
						</div>
					)
				},
				{
					name: "CardFooter",
					description: "The bottom of the card, where the actions usually sit.",
					props: CARD_SECTION_SEPARATED_PROPS,
					previewHeight: 140,
					snippetChildren: () => "<Button text={\"Open\"} buttonType={ButtonType.SECONDARY}></Button>",
					preview: values => (
						<div style={{width: "300px"}}>
							<CardFooter separated={values.separated}>
								<Button text={"Open"} buttonType={ButtonType.SECONDARY}></Button>
							</CardFooter>
						</div>
					)
				},
				{
					name: "CardContent",
					description: "The body. It carries the card's padding so content can be dropped straight into it.",
					props: CARD_SECTION_PROPS,
					previewHeight: 140,
					snippetChildren: () => "<p>Six bays, two of them refrigerated.</p>",
					preview: () => (
						<div style={{width: "300px"}}>
							<CardContent>
								<p style={{margin: 0}}>Six bays, two of them refrigerated.</p>
							</CardContent>
						</div>
					)
				},
				{
					name: "CardTitle",
					description: "The card's name, in the heading weight.",
					props: CARD_SECTION_PROPS,
					previewHeight: 110,
					snippetChildren: () => "Melbourne Depot",
					preview: () => (<CardTitle>Melbourne Depot</CardTitle>)
				},
				{
					name: "CardDescription",
					description: "The muted line under the title.",
					props: CARD_SECTION_PROPS,
					previewHeight: 110,
					snippetChildren: () => "Operational since 2019",
					preview: () => (<CardDescription>Operational since 2019</CardDescription>)
				},
				{
					name: "CardAction",
					description: "Pins its children to the top right of the header — the overflow menu or the one button that belongs to the card as a whole.",
					props: CARD_SECTION_PROPS,
					previewHeight: 110,
					snippetChildren: () => "<ButtonIcon icon={\"ri-more-2-fill\"} label={\"Actions\"}></ButtonIcon>",
					preview: () => (
						<CardAction>
							<Button text={"Actions"} buttonType={ButtonType.CLEAR}></Button>
						</CardAction>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<div className="blue-orange-card-development-row">
				<Card style={{width: "340px"}}>
					<CardHeader>
						<CardTitle>Monthly usage</CardTitle>
						<CardDescription>Everything processed since the 1st of the month.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="blue-orange-card-development-metric">1,284</div>
						<div>documents indexed</div>
					</CardContent>
					<CardFooter>
						<Button text="View report" buttonType={ButtonType.SECONDARY} size={ButtonSize.SMALL}></Button>
					</CardFooter>
				</Card>
			</div>

			<GeneralHeading>With an action</GeneralHeading>
			<div className="blue-orange-card-development-row">
				<Card style={{width: "340px"}}>
					<CardHeader>
						<CardTitle>Deployment</CardTitle>
						<CardDescription>europe-west2 · production</CardDescription>
						<CardAction>
							<Badge>Live</Badge>
							<ButtonIcon icon="ri-more-2-fill"></ButtonIcon>
						</CardAction>
					</CardHeader>
					<CardContent>
						Last released 14 minutes ago by tom@blueorange.ai.
					</CardContent>
				</Card>
			</div>

			<GeneralHeading>Separated sections</GeneralHeading>
			<div className="blue-orange-card-development-row">
				<Card style={{width: "340px"}}>
					<CardHeader separated={true}>
						<CardTitle>Sign in</CardTitle>
						<CardDescription>Use your work email address.</CardDescription>
					</CardHeader>
					<CardContent>
						<Input label="Email" placeholder="you@blueorange.ai" isEmail={true}></Input>
					</CardContent>
					<CardFooter separated={true}>
						<Button text="Continue" buttonType={ButtonType.PRIMARY} size={ButtonSize.SMALL}></Button>
						<Button text="Cancel" buttonType={ButtonType.CLEAR} size={ButtonSize.SMALL}></Button>
					</CardFooter>
				</Card>
			</div>

			<GeneralHeading>Clickable</GeneralHeading>
			<Description>Passing an onClick makes the whole card a target and adds a hover lift.</Description>
			<div className="blue-orange-card-development-row">
				<Card style={{width: "260px"}} onClick={() => {}}>
					<CardHeader>
						<CardTitle>Search</CardTitle>
						<CardDescription>Query your indexed content.</CardDescription>
					</CardHeader>
				</Card>
				<Card style={{width: "260px"}} onClick={() => {}}>
					<CardHeader>
						<CardTitle>Pipelines</CardTitle>
						<CardDescription>Build and monitor data flows.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</ComponentDoc>
	)
}
