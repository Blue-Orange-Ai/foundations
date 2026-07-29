import React from "react";

import './HoverCardDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
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

interface Props {
}

export const HoverCardDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Hover Card</PageHeading>
			<Description>
				Extra detail shown when the pointer rests on a trigger. Unlike a tooltip the card is
				interactive, so it can hold links and buttons.
			</Description>

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
		</PaddedPage>
	)
}
