import React from "react";

import './UptimeChartDevelopment.css'
import {UptimeChart} from "../../../../components/charts/uptime/UptimeChart";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {UptimeEntry, UptimeStatus} from "../../../../components/charts/types/ChartTypes";
import {HoverCardSide} from "../../../../components/tooltips/hover-card/hover-card/HoverCard";

/**
 * Ninety days of history, worked backwards from today, with a handful of bad
 * days seeded at fixed offsets so the demo looks the same on every render.
 */
const buildHistory = (days: number): Array<UptimeEntry> => {
	const trouble: Record<number, UptimeEntry> = {
		68: {
			date: 0,
			status: UptimeStatus.DEGRADED,
			uptime: 98.42,
			incidents: [{title: "Elevated latency on the API", status: "Resolved", duration: "09:14 – 11:02 UTC"}]
		},
		52: {
			date: 0,
			status: UptimeStatus.MAJOR_OUTAGE,
			uptime: 91.15,
			incidents: [
				{title: "API unavailable in eu-west-1", status: "Resolved", duration: "02:30 – 04:37 UTC"},
				{title: "Knock-on delays in the job queue", status: "Resolved", duration: "04:37 – 05:10 UTC"}
			]
		},
		33: {
			date: 0,
			status: UptimeStatus.MAINTENANCE,
			uptime: 99.10,
			note: "Planned database upgrade, announced a week ahead."
		},
		12: {
			date: 0,
			status: UptimeStatus.PARTIAL_OUTAGE,
			uptime: 96.80,
			incidents: [{title: "File uploads failing", status: "Resolved", duration: "16:20 – 17:05 UTC"}]
		},
		4: {
			date: 0,
			status: UptimeStatus.NO_DATA
		}
	};

	const today = new Date();
	const entries: Array<UptimeEntry> = [];
	for (var offset = days - 1; offset >= 0; offset--) {
		const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
		const seeded = trouble[offset];
		entries.push(seeded
			? {...seeded, date: date}
			: {date: date, status: UptimeStatus.OPERATIONAL, uptime: 100});
	}
	return entries;
}

const DEMO_HISTORY = buildHistory(90);

const SHORT_HISTORY = buildHistory(30);

/** The rows of a status page — one chart each, sharing a window. */
const DEMO_SERVICES = [
	{title: "api.anthropic.com", entries: DEMO_HISTORY},
	{title: "Console", entries: buildHistory(90).map((entry, index) => index === 60 ? {...entry, status: UptimeStatus.DEGRADED, uptime: 97.4} : entry)},
	{title: "Web app", entries: buildHistory(90).map((entry, index) => index === 81 ? {...entry, status: UptimeStatus.PARTIAL_OUTAGE, uptime: 95.2} : entry)}
];

const UPTIME_ENTRY_INTERFACE = {
	name: "UptimeEntry",
	description: "One bar — a single period, and how the service behaved during it.",
	props: [
		{name: "date", type: "Date | string | number", required: true, description: "The period the bar covers. A Date, or anything `new Date()` can read."},
		{name: "status", type: "UptimeStatus", required: true, description: "How the service behaved. Sets the bar colour and what the popup says."},
		{name: "uptime", type: "number", description: "The percentage of the period the service was up. Shown in the popup, and averaged into the overall figure."},
		{name: "incidents", type: "Array<UptimeIncident>", description: "What went wrong, listed under the status in the popup."},
		{name: "color", type: "string", description: "Overrides the colour the status would otherwise resolve to."},
		{name: "note", type: "string", description: "A line of free text under the status in the popup."}
	] as Array<PropSpec>
};

const UPTIME_INCIDENT_INTERFACE = {
	name: "UptimeIncident",
	description: "One line in a popup's incident list.",
	props: [
		{name: "title", type: "string", required: true, description: "What happened, in a few words."},
		{name: "status", type: "string", description: "The state it put the service in — free text, e.g. \"Investigating\"."},
		{name: "duration", type: "string", description: "How long it ran for, e.g. \"14:02 – 15:20 UTC\"."},
		{name: "color", type: "string", description: "Overrides the dot colour, which otherwise follows the entry's status."}
	] as Array<PropSpec>
};

const UPTIME_CHART_PROPS: Array<PropSpec> = [
	{
		name: "entries",
		type: "Array<UptimeEntry>",
		required: true,
		description: "One bar per entry, oldest first — the way a status page reads left to right."
	},
	{
		name: "title",
		type: "string",
		control: "text",
		value: "api.anthropic.com",
		description: "The name of the thing being measured, shown at the top left."
	},
	{
		name: "titleContent",
		type: "ReactNode",
		description: "Anything richer than a title — an icon and a name, a link. Wins over `title`."
	},
	{
		name: "uptime",
		type: "number",
		description: "The overall figure at the top right. Left out, it is worked out from the entries."
	},
	{
		name: "showUptime",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether that figure is shown at all."
	},
	{
		name: "uptimePrecision",
		type: "number",
		default: "2",
		control: "slider",
		min: 0,
		max: 4,
		step: 1,
		description: "Decimal places on the percentages."
	},
	{
		name: "showHeader",
		type: "boolean",
		control: "toggle",
		description: "Draws the title row. Left out, it appears whenever there is something to put in it."
	},
	{
		name: "showFooter",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the \"N days ago … Today\" row under the bars."
	},
	{
		name: "startLabel",
		type: "string",
		control: "text",
		description: "The left end of the footer. Defaults to the number of entries in days."
	},
	{
		name: "endLabel",
		type: "string",
		default: "\"Today\"",
		control: "text",
		description: "The right end of the footer."
	},
	{
		name: "footerLabel",
		type: "string",
		control: "text",
		description: "Text in the middle of the footer, between the two rules."
	},
	{
		name: "legend",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lists every status present in the data under the chart."
	},
	{
		name: "barWidth",
		type: "number",
		control: "slider",
		min: 0,
		max: 20,
		step: 1,
		description: "Fixes the bar width in pixels. Left at 0, the bars share the width evenly.",
		code: value => (value ? "{" + value + "}" : undefined)
	},
	{
		name: "barGap",
		type: "number",
		default: "2",
		control: "slider",
		min: 0,
		max: 10,
		step: 1,
		description: "The gap between bars, in pixels."
	},
	{
		name: "barHeight",
		type: "number",
		default: "34",
		control: "slider",
		min: 10,
		max: 80,
		step: 2,
		description: "How tall the bars are, in pixels."
	},
	{
		name: "barRadius",
		type: "number",
		default: "2",
		control: "slider",
		min: 0,
		max: 10,
		step: 1,
		description: "The bars' corner radius, in pixels."
	},
	{
		name: "statusColors",
		type: "Partial<Record<UptimeStatus, string>>",
		description: "Overrides the colour any subset of the statuses resolve to."
	},
	{
		name: "statusLabels",
		type: "Partial<Record<UptimeStatus, string>>",
		description: "Overrides what any subset of the statuses are called."
	},
	{
		name: "dateFormatter",
		type: "(date: Date) => string",
		description: "How a bar's date is written in the popup."
	},
	{
		name: "tooltip",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether hovering a bar opens a popup at all."
	},
	{
		name: "tooltipContent",
		type: "(entry: UptimeEntry, index: number) => ReactNode",
		description: "Replaces the popup's body entirely."
	},
	{
		name: "tooltipWidth",
		type: "number",
		default: "240",
		control: "slider",
		min: 160,
		max: 400,
		step: 10,
		description: "The popup's width, in pixels."
	},
	{
		name: "tooltipSide",
		type: "HoverCardSide",
		default: "HoverCardSide.TOP",
		control: "select",
		options: [
			{label: "Top", value: HoverCardSide.TOP, code: "HoverCardSide.TOP"},
			{label: "Bottom", value: HoverCardSide.BOTTOM, code: "HoverCardSide.BOTTOM"},
			{label: "Left", value: HoverCardSide.LEFT, code: "HoverCardSide.LEFT"},
			{label: "Right", value: HoverCardSide.RIGHT, code: "HoverCardSide.RIGHT"}
		],
		description: "Which side of the bar the popup opens on."
	},
	{
		name: "openDelay",
		type: "number",
		default: "0",
		control: "slider",
		min: 0,
		max: 600,
		step: 50,
		description: "How long the pointer has to rest on a bar before the popup opens."
	},
	{
		name: "closeDelay",
		type: "number",
		default: "0",
		control: "slider",
		min: 0,
		max: 600,
		step: 50,
		description: "How long the popup stays open after the pointer leaves. Raise it to let the pointer travel into the card."
	},
	{
		name: "onEntryClick",
		type: "(entry: UptimeEntry, index: number) => void",
		description: "Fired when a bar is clicked."
	},
	{
		name: "emptyMessage",
		type: "string",
		default: "\"No uptime recorded\"",
		control: "text",
		description: "Shown in place of the bars when there are no entries."
	}
];

interface Props {
}

export const UptimeChartDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Uptime Chart"
			description="The bar of thin vertical marks a status page uses to show a service's recent history — one mark per day, coloured by how the service behaved, with the detail behind a hover card. It draws itself rather than going through Chart.js, so it stays sharp at any width and its popup is built out of the library's own components."
			name="UptimeChart"
			previewHeight={220}
			previewCentered={false}
			imports={["UptimeEntry", "UptimeStatus"]}
			interfaces={[UPTIME_ENTRY_INTERFACE, UPTIME_INCIDENT_INTERFACE]}
			props={UPTIME_CHART_PROPS}
			preview={values => (
				<div style={{width: "100%", padding: "40px 20px"}}>
					<UptimeChart
						entries={DEMO_HISTORY}
						title={values.title}
						showUptime={values.showUptime}
						uptimePrecision={values.uptimePrecision}
						showHeader={values.showHeader}
						showFooter={values.showFooter}
						startLabel={values.startLabel}
						endLabel={values.endLabel}
						footerLabel={values.footerLabel}
						legend={values.legend}
						barWidth={values.barWidth ? values.barWidth : undefined}
						barGap={values.barGap}
						barHeight={values.barHeight}
						barRadius={values.barRadius}
						tooltip={values.tooltip}
						tooltipWidth={values.tooltipWidth}
						tooltipSide={values.tooltipSide}
						openDelay={values.openDelay}
						closeDelay={values.closeDelay}
						emptyMessage={values.emptyMessage}></UptimeChart>
				</div>
			)}>

			<div className="blue-orange-uptime-docs-example">
				<h4>A status page</h4>
				<p>One chart per service, sharing a window. Only the bottom row carries the footer, so the dates read once for the whole board.</p>
				<div className="blue-orange-uptime-docs-services">
					{DEMO_SERVICES.map((service, index) => (
						<UptimeChart
							key={service.title}
							title={service.title}
							entries={service.entries}
							showFooter={index === DEMO_SERVICES.length - 1}></UptimeChart>
					))}
				</div>
			</div>

			<div className="blue-orange-uptime-docs-example">
				<h4>Thirty days, with a legend</h4>
				<p>Fewer, wider bars — and the statuses named underneath rather than left to the popup.</p>
				<UptimeChart
					title={"Job queue"}
					entries={SHORT_HISTORY}
					legend={true}
					barGap={3}
					barRadius={3}
					footerLabel={"30 days"}></UptimeChart>
			</div>

			<div className="blue-orange-uptime-docs-example">
				<h4>Fixed bar widths</h4>
				<p>Bars of a set width keep their size rather than dividing up the container, which is what you want when several charts of different lengths sit side by side.</p>
				<UptimeChart
					title={"Webhooks"}
					entries={SHORT_HISTORY}
					barWidth={8}
					barGap={3}
					barHeight={40}
					barRadius={4}
					tooltipSide={HoverCardSide.BOTTOM}></UptimeChart>
			</div>

			<div className="blue-orange-uptime-docs-example">
				<h4>A popup of your own</h4>
				<p>`tooltipContent` replaces the card's body, leaving the hover card itself to do the positioning.</p>
				<UptimeChart
					title={"Search index"}
					entries={SHORT_HISTORY}
					tooltipWidth={200}
					tooltipContent={(entry) => (
						<div className="blue-orange-uptime-docs-popup">
							<strong>{new Date(entry.date).toDateString()}</strong>
							<span>{entry.status.replace("_", " ").toLowerCase()}</span>
						</div>
					)}></UptimeChart>
			</div>

			<div className="blue-orange-uptime-docs-example">
				<h4>Nothing recorded yet</h4>
				<UptimeChart title={"New service"} entries={[]} showFooter={false}></UptimeChart>
			</div>

		</ComponentDoc>
	)
}
