import React from "react";

import './TimelineDevelopment.css'
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
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const TIMELINE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The items, in the order they happened."
	},
	{
		name: "orientation",
		type: "TimelineOrientation",
		default: "TimelineOrientation.VERTICAL",
		defaultValue: TimelineOrientation.VERTICAL,
		control: "select",
		options: [
			{label: "Vertical", value: TimelineOrientation.VERTICAL, code: "TimelineOrientation.VERTICAL"},
			{label: "Horizontal", value: TimelineOrientation.HORIZONTAL, code: "TimelineOrientation.HORIZONTAL"}
		],
		description: "Which way the rail runs."
	},
	{
		name: "align",
		type: "TimelineAlign",
		default: "TimelineAlign.START",
		defaultValue: TimelineAlign.START,
		control: "select",
		options: [
			{label: "Start", value: TimelineAlign.START, code: "TimelineAlign.START"},
			{label: "Alternate", value: TimelineAlign.ALTERNATE, code: "TimelineAlign.ALTERNATE"}
		],
		description: "START keeps every item on one side of the rail; ALTERNATE puts them either side of a centred one. Vertical only."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the timeline."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the timeline."
	}
];

const TIMELINE_ITEM_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "The event's time, title, description and content."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-git-commit-line",
		description: "A remixicon class drawn inside the marker. Left off, the state picks one."
	},
	{
		name: "state",
		type: "TimelineItemState",
		default: "TimelineItemState.DEFAULT",
		defaultValue: TimelineItemState.DEFAULT,
		control: "select",
		options: [
			{label: "Default", value: TimelineItemState.DEFAULT, code: "TimelineItemState.DEFAULT"},
			{label: "Active", value: TimelineItemState.ACTIVE, code: "TimelineItemState.ACTIVE"},
			{label: "Success", value: TimelineItemState.SUCCESS, code: "TimelineItemState.SUCCESS"},
			{label: "Warning", value: TimelineItemState.WARNING, code: "TimelineItemState.WARNING"},
			{label: "Error", value: TimelineItemState.ERROR, code: "TimelineItemState.ERROR"},
			{label: "Loading", value: TimelineItemState.LOADING, code: "TimelineItemState.LOADING"}
		],
		description: "Colours the marker and picks its fallback icon."
	},
	{
		name: "media",
		type: "React.ReactNode",
		description: "Replaces the marker entirely — an avatar, an image, anything."
	},
	{
		name: "leading",
		type: "React.ReactNode",
		description: "Rendered on the far side of the rail: a date, a milestone, a duration."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the item."
	}
];

const TIMELINE_TIME_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		control: "text",
		value: "09:12",
		hideFromSnippet: true,
		description: "The timestamp as it should read."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "A remixicon class shown before the timestamp."
	},
	{
		name: "dateTime",
		type: "string",
		control: "text",
		description: "The machine readable value of the underlying time element."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the timestamp."
	}
];

const TIMELINE_SECTION_PROPS: Array<PropSpec> = [
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

interface Props {
}

export const TimelineDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Timeline"
			description="A run of events joined by a rail. Each item draws its own marker and the connector to the next one, so the rail stops cleanly at the final event."
			name="Timeline"
			previewHeight={320}
			previewCentered={false}
			imports={["TimelineItem", "TimelineTime", "TimelineTitle", "TimelineDescription", "TimelineOrientation", "TimelineAlign"]}
			props={TIMELINE_PROPS}
			snippetChildren={() => "<TimelineItem icon={\"ri-git-commit-line\"}>\n\t<TimelineTime>09:12</TimelineTime>\n\t<TimelineTitle>Run started</TimelineTitle>\n\t<TimelineDescription>Queued behind two other runs.</TimelineDescription>\n</TimelineItem>\n<TimelineItem icon={\"ri-check-line\"} state={TimelineItemState.SUCCESS}>\n\t<TimelineTime>09:41</TimelineTime>\n\t<TimelineTitle>Run finished</TimelineTitle>\n</TimelineItem>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<Timeline orientation={values.orientation} align={values.align} classes={values.classes}>
						<TimelineItem icon="ri-git-commit-line">
							<TimelineTime>09:12</TimelineTime>
							<TimelineTitle>Run started</TimelineTitle>
							<TimelineDescription>Queued behind two other runs.</TimelineDescription>
						</TimelineItem>
						<TimelineItem icon="ri-loader-4-line" state={TimelineItemState.ACTIVE}>
							<TimelineTime>09:26</TimelineTime>
							<TimelineTitle>Transforming</TimelineTitle>
							<TimelineDescription>Two of six stages complete.</TimelineDescription>
						</TimelineItem>
						<TimelineItem icon="ri-check-line" state={TimelineItemState.SUCCESS}>
							<TimelineTime>09:41</TimelineTime>
							<TimelineTitle>Run finished</TimelineTitle>
						</TimelineItem>
					</Timeline>
				</div>
			)}
			siblings={[
				{
					name: "TimelineItem",
					description: "One event. Its state colours the marker and picks the fallback icon, and `leading` puts something on the far side of the rail.",
					props: TIMELINE_ITEM_PROPS,
					previewHeight: 180,
					previewCentered: false,
					imports: ["Timeline", "TimelineTitle", "TimelineDescription"],
					snippetChildren: () => "<TimelineTitle>Run started</TimelineTitle>\n<TimelineDescription>Queued behind two other runs.</TimelineDescription>",
					preview: values => (
						<div style={{width: "100%"}}>
							<Timeline>
								<TimelineItem icon={values.icon} state={values.state}>
									<TimelineTitle>Run started</TimelineTitle>
									<TimelineDescription>Queued behind two other runs.</TimelineDescription>
								</TimelineItem>
							</Timeline>
						</div>
					)
				},
				{
					name: "TimelineTime",
					description: "The timestamp of an event, rendered as a real time element so it is machine readable.",
					props: TIMELINE_TIME_PROPS,
					previewHeight: 110,
					snippetChildren: values => values.children,
					preview: values => (
						<TimelineTime icon={values.icon} dateTime={values.dateTime}>{values.children}</TimelineTime>
					)
				},
				{
					name: "TimelineTitle",
					description: "What happened, in the heading weight.",
					props: TIMELINE_SECTION_PROPS,
					previewHeight: 110,
					snippetChildren: () => "Run started",
					preview: () => (<TimelineTitle>Run started</TimelineTitle>)
				},
				{
					name: "TimelineDescription",
					description: "The muted line under the title.",
					props: TIMELINE_SECTION_PROPS,
					previewHeight: 110,
					snippetChildren: () => "Queued behind two other runs.",
					preview: () => (<TimelineDescription>Queued behind two other runs.</TimelineDescription>)
				},
				{
					name: "TimelineContent",
					description: "A block under the description for anything larger — a card, a table, a set of properties.",
					props: TIMELINE_SECTION_PROPS,
					previewHeight: 140,
					snippetChildren: () => "<Card>…</Card>",
					preview: () => (
						<TimelineContent>
							<Badge>Attached artefact</Badge>
						</TimelineContent>
					)
				}
			]}>

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
		</ComponentDoc>
	)
}
