import React from "react";

import './CardDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
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

interface Props {
}

export const CardDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Card</PageHeading>
			<Description>
				A surface for grouping related content. Compose a header, content and footer — every
				section is optional.
			</Description>

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
		</PaddedPage>
	)
}
