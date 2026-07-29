import React from "react";

import './TimelineDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Timeline} from "../../../components/timeline/timeline/Timeline";
import {TimelineItem} from "../../../components/timeline/timeline-item/TimelineItem";
import {TimelineTime} from "../../../components/timeline/timeline-time/TimelineTime";
import {TimelineTitle} from "../../../components/timeline/timeline-title/TimelineTitle";
import {TimelineDescription} from "../../../components/timeline/timeline-description/TimelineDescription";
import {TimelineContent} from "../../../components/timeline/timeline-content/TimelineContent";
import {
	TimelineAlign,
	TimelineItemState,
	TimelineOrientation
} from "../../../components/timeline/timeline/TimelineContext";
import {Badge} from "../../../components/text-decorations/badge/Badge";
import {Card} from "../../../components/card/card/Card";
import {CardHeader} from "../../../components/card/card-header/CardHeader";
import {CardTitle} from "../../../components/card/card-title/CardTitle";
import {CardDescription} from "../../../components/card/card-description/CardDescription";

interface Props {
}

export const TimelineDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Timeline</PageHeading>
			<Description>
				A run of events joined by a rail. Each item draws its own marker and the connector to
				the next one, so the rail stops cleanly at the final event.
			</Description>

			<GeneralHeading>Default</GeneralHeading>
			<div className="blue-orange-timeline-development-block">
				<Timeline>
					<TimelineItem>
						<TimelineTime>09:14</TimelineTime>
						<TimelineTitle>Document uploaded</TimelineTitle>
						<TimelineDescription>quarterly-report.pdf added to the workspace.</TimelineDescription>
					</TimelineItem>
					<TimelineItem>
						<TimelineTime>09:16</TimelineTime>
						<TimelineTitle>Indexing started</TimelineTitle>
						<TimelineDescription>Pages split and queued for extraction.</TimelineDescription>
					</TimelineItem>
					<TimelineItem>
						<TimelineTime>09:21</TimelineTime>
						<TimelineTitle>Ready to search</TimelineTitle>
						<TimelineDescription>42 pages indexed with no errors.</TimelineDescription>
					</TimelineItem>
				</Timeline>
			</div>

			<GeneralHeading>Status states</GeneralHeading>
			<Description>Each state colours the marker and picks its own icon unless one is given.</Description>
			<div className="blue-orange-timeline-development-block">
				<Timeline>
					<TimelineItem state={TimelineItemState.SUCCESS}>
						<TimelineTitle>Order placed</TimelineTitle>
						<TimelineDescription>Payment taken in full.</TimelineDescription>
					</TimelineItem>
					<TimelineItem state={TimelineItemState.SUCCESS}>
						<TimelineTitle>Packed</TimelineTitle>
						<TimelineDescription>Left the warehouse in Leeds.</TimelineDescription>
					</TimelineItem>
					<TimelineItem state={TimelineItemState.LOADING}>
						<TimelineTitle>Out for delivery</TimelineTitle>
						<TimelineDescription>Expected before 18:00 today.</TimelineDescription>
					</TimelineItem>
					<TimelineItem state={TimelineItemState.WARNING}>
						<TimelineTitle>Delivery attempted</TimelineTitle>
						<TimelineDescription>Nobody home — we will try again tomorrow.</TimelineDescription>
					</TimelineItem>
					<TimelineItem state={TimelineItemState.ERROR}>
						<TimelineTitle>Returned to depot</TimelineTitle>
						<TimelineDescription>Awaiting a new delivery slot.</TimelineDescription>
					</TimelineItem>
				</Timeline>
			</div>

			<GeneralHeading>With icons</GeneralHeading>
			<div className="blue-orange-timeline-development-block">
				<Timeline>
					<TimelineItem icon="ri-git-commit-line">
						<TimelineTime icon="ri-time-line">2 hours ago</TimelineTime>
						<TimelineTitle>
							Fixed the carousel offset
							<Badge style={{fontSize: "0.7rem"}}>main</Badge>
						</TimelineTitle>
						<TimelineDescription>The gap is now part of every step of the track.</TimelineDescription>
					</TimelineItem>
					<TimelineItem icon="ri-git-pull-request-line" state={TimelineItemState.ACTIVE}>
						<TimelineTime icon="ri-time-line">5 hours ago</TimelineTime>
						<TimelineTitle>Opened pull request #482</TimelineTitle>
						<TimelineDescription>Adds the stepper and timeline components.</TimelineDescription>
					</TimelineItem>
					<TimelineItem icon="ri-git-branch-line">
						<TimelineTime icon="ri-time-line">Yesterday</TimelineTime>
						<TimelineTitle>Created feature/stepper</TimelineTitle>
					</TimelineItem>
				</Timeline>
			</div>

			<GeneralHeading>Leading labels</GeneralHeading>
			<Description>The label sits on the far side of the rail — a date, a duration, a release.</Description>
			<div className="blue-orange-timeline-development-block">
				<Timeline>
					<TimelineItem leading="12 Jan" state={TimelineItemState.SUCCESS}>
						<TimelineTitle>Kick off</TimelineTitle>
						<TimelineDescription>Scope agreed with the design team.</TimelineDescription>
					</TimelineItem>
					<TimelineItem leading="03 Mar" state={TimelineItemState.SUCCESS}>
						<TimelineTitle>Beta released</TimelineTitle>
						<TimelineDescription>Shipped to twelve internal users.</TimelineDescription>
					</TimelineItem>
					<TimelineItem leading="21 Apr" state={TimelineItemState.ACTIVE}>
						<TimelineTitle>General availability</TimelineTitle>
						<TimelineDescription>Rolling out to every workspace.</TimelineDescription>
					</TimelineItem>
				</Timeline>
			</div>

			<GeneralHeading>With media</GeneralHeading>
			<Description>Media replaces the marker entirely — an avatar, a logo, an image.</Description>
			<div className="blue-orange-timeline-development-block">
				<Timeline>
					<TimelineItem media={<div className="blue-orange-timeline-development-avatar">TS</div>}>
						<TimelineTime>10 minutes ago</TimelineTime>
						<TimelineTitle>Tom commented on the release</TimelineTitle>
						<TimelineDescription>“Let us hold this until the carousel fix lands.”</TimelineDescription>
					</TimelineItem>
					<TimelineItem media={<div className="blue-orange-timeline-development-avatar">AL</div>}>
						<TimelineTime>1 hour ago</TimelineTime>
						<TimelineTitle>Alex approved the pull request</TimelineTitle>
					</TimelineItem>
				</Timeline>
			</div>

			<GeneralHeading>Rich content</GeneralHeading>
			<div className="blue-orange-timeline-development-block">
				<Timeline>
					<TimelineItem state={TimelineItemState.SUCCESS}>
						<TimelineTime>14:02</TimelineTime>
						<TimelineTitle>Deployed to production</TimelineTitle>
						<TimelineContent>
							<Card>
								<CardHeader>
									<CardTitle>build 4821</CardTitle>
									<CardDescription>europe-west2 · 38 seconds · no errors</CardDescription>
								</CardHeader>
							</Card>
						</TimelineContent>
					</TimelineItem>
					<TimelineItem state={TimelineItemState.ACTIVE}>
						<TimelineTime>14:06</TimelineTime>
						<TimelineTitle>Health checks passing</TimelineTitle>
					</TimelineItem>
				</Timeline>
			</div>

			<GeneralHeading>Alternating</GeneralHeading>
			<div className="blue-orange-timeline-development-block">
				<Timeline align={TimelineAlign.ALTERNATE}>
					<TimelineItem leading="Q1" state={TimelineItemState.SUCCESS}>
						<TimelineTitle>Foundations 0.1</TimelineTitle>
						<TimelineDescription>The first published component set.</TimelineDescription>
					</TimelineItem>
					<TimelineItem leading="Q2" state={TimelineItemState.SUCCESS}>
						<TimelineTitle>Search client</TimelineTitle>
						<TimelineDescription>Query building and result rendering.</TimelineDescription>
					</TimelineItem>
					<TimelineItem leading="Q3" state={TimelineItemState.ACTIVE}>
						<TimelineTitle>Agent workflows</TimelineTitle>
						<TimelineDescription>Node based editing over the graph package.</TimelineDescription>
					</TimelineItem>
					<TimelineItem leading="Q4">
						<TimelineTitle>Deployment manager</TimelineTitle>
						<TimelineDescription>One place to ship every service.</TimelineDescription>
					</TimelineItem>
				</Timeline>
			</div>

			<GeneralHeading>Horizontal</GeneralHeading>
			<div className="blue-orange-timeline-development-block-wide">
				<Timeline orientation={TimelineOrientation.HORIZONTAL}>
					<TimelineItem state={TimelineItemState.SUCCESS} leading="Mon">
						<TimelineTitle>Draft</TimelineTitle>
						<TimelineDescription>Written and reviewed internally.</TimelineDescription>
					</TimelineItem>
					<TimelineItem state={TimelineItemState.SUCCESS} leading="Tue">
						<TimelineTitle>Legal</TimelineTitle>
						<TimelineDescription>Checked by the legal team.</TimelineDescription>
					</TimelineItem>
					<TimelineItem state={TimelineItemState.LOADING} leading="Wed">
						<TimelineTitle>Signature</TimelineTitle>
						<TimelineDescription>Waiting on the counterparty.</TimelineDescription>
					</TimelineItem>
					<TimelineItem leading="Thu">
						<TimelineTitle>Filed</TimelineTitle>
						<TimelineDescription>Stored against the account.</TimelineDescription>
					</TimelineItem>
				</Timeline>
			</div>
		</PaddedPage>
	)
}
