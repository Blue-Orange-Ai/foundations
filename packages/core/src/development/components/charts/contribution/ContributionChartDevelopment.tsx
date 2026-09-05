import React from "react";

import './ContributionChartDevelopment.css'
import {ContributionChart} from "../../../../components/charts/contribution/ContributionChart";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {ContributionEntry} from "../../../../components/charts/types/ChartTypes";
import {HoverCardSide} from "../../../../components/tooltips/hover-card/hover-card/HoverCard";

/**
 * A year of days worked backwards from today. The counts come off a fixed
 * pseudo-random sequence rather than Math.random, so the demo looks the same on
 * every render — busier on weekdays, with the odd quiet stretch.
 */
const buildHistory = (days: number): Array<ContributionEntry> => {
	const today = new Date();
	const entries: Array<ContributionEntry> = [];
	var seed = 20260905;
	const next = (): number => {
		// A small linear congruential generator — enough to look unplanned.
		seed = (seed * 1103515245 + 12345) % 2147483648;
		return seed / 2147483648;
	}
	for (var offset = days - 1; offset >= 0; offset--) {
		const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
		const weekend = date.getDay() === 0 || date.getDay() === 6;
		const roll = next();
		// Quiet spells: roughly a third of days have nothing on them at all.
		const idle = roll < (weekend ? 0.62 : 0.28);
		const count = idle ? 0 : Math.ceil(next() * (weekend ? 6 : 18));
		entries.push({date: date, count: count});
	}
	return entries;
}

const DEMO_HISTORY = buildHistory(371);

const QUARTER_HISTORY = buildHistory(91);

/** A day worth calling out, to show what a note reads like in the popup. */
const NOTED_HISTORY: Array<ContributionEntry> = QUARTER_HISTORY.map((entry, index) => {
	return index === QUARTER_HISTORY.length - 10
		? {...entry, count: 42, note: "Release day — the 4.0 branch landed."}
		: entry;
});

const REVIEW_COLORS = ["#eef2ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#4f46e5"];

const CONTRIBUTION_ENTRY_INTERFACE = {
	name: "ContributionEntry",
	description: "One day — a date, and how much happened on it.",
	props: [
		{name: "date", type: "Date | string | number", required: true, description: "The day this covers. A Date, or anything `new Date()` can read. A bare \"2026-01-04\" is read as a local day, not a UTC instant."},
		{name: "count", type: "number", required: true, description: "How much happened that day. Zero and negative counts read as empty."},
		{name: "level", type: "number", description: "Pins the square to a shade rather than letting the count decide, as an index into `levelColors`."},
		{name: "color", type: "string", description: "Overrides the square's colour outright."},
		{name: "note", type: "string", description: "A line of free text under the count in the popup."}
	] as Array<PropSpec>
};

const CONTRIBUTION_CHART_PROPS: Array<PropSpec> = [
	{
		name: "entries",
		type: "Array<ContributionEntry>",
		required: true,
		description: "One entry per day. Order does not matter — they are filed by date, and two entries on the same day add up."
	},
	{
		name: "startDate",
		type: "Date | string | number",
		description: "The first day of the window. Defaults to the earliest entry."
	},
	{
		name: "endDate",
		type: "Date | string | number",
		description: "The last day of the window. Defaults to the latest entry."
	},
	{
		name: "title",
		type: "string",
		control: "text",
		value: "Contributions",
		description: "The name of what is being counted, shown at the top left."
	},
	{
		name: "titleContent",
		type: "ReactNode",
		description: "Anything richer than a title — an icon and a name, a link. Wins over `title`."
	},
	{
		name: "showHeader",
		type: "boolean",
		control: "toggle",
		description: "Draws the title row. Left out, it appears whenever there is something to put in it."
	},
	{
		name: "total",
		type: "number",
		description: "The running total at the top right. Left out, it is added up from the entries."
	},
	{
		name: "showTotal",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether that total is shown at all."
	},
	{
		name: "totalLabel",
		type: "(total: number) => string",
		description: "How the total is written. Defaults to \"N contributions\"."
	},
	{
		name: "weekStart",
		type: "number",
		default: "0",
		control: "select",
		options: [
			{label: "Sunday", value: 0, code: "0"},
			{label: "Monday", value: 1, code: "1"}
		],
		description: "Which day the weeks start on — 0 is Sunday, 1 Monday."
	},
	{
		name: "cellSize",
		type: "number",
		control: "slider",
		min: 0,
		max: 24,
		step: 1,
		description: "Fixes the side of a square, in pixels. Left at 0, the squares divide the width between them and the chart fills its container.",
		code: value => (value ? "{" + value + "}" : undefined)
	},
	{
		name: "minCellSize",
		type: "number",
		default: "8",
		control: "slider",
		min: 2,
		max: 20,
		step: 1,
		description: "How small a square may get while dividing up the width. Below this the grid scrolls sideways instead. Ignored when `cellSize` is given."
	},
	{
		name: "cellGap",
		type: "number",
		default: "3",
		control: "slider",
		min: 0,
		max: 8,
		step: 1,
		description: "The gap between squares, in pixels."
	},
	{
		name: "cellRadius",
		type: "number",
		default: "2",
		control: "slider",
		min: 0,
		max: 12,
		step: 1,
		description: "The squares' corner radius, in pixels."
	},
	{
		name: "levelColors",
		type: "Array<string>",
		default: "CONTRIBUTION_LEVEL_COLORS",
		description: "The shades, quietest first. Their number sets how many bands there are."
	},
	{
		name: "levels",
		type: "Array<number>",
		description: "The counts at which each band starts, ascending — one fewer than there are colours. Left out, the bands are shared evenly up to the busiest day."
	},
	{
		name: "levelFor",
		type: "(count: number, max: number) => number",
		description: "Works out a square's band itself, overriding `levels` entirely."
	},
	{
		name: "showMonthLabels",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the row of month names above the grid."
	},
	{
		name: "showWeekdayLabels",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the column of weekday names beside it."
	},
	{
		name: "monthLabels",
		type: "Array<string>",
		description: "Overrides the month names. Twelve, January first."
	},
	{
		name: "weekdayLabels",
		type: "Array<string>",
		description: "Overrides the weekday names. Seven, Sunday first."
	},
	{
		name: "weekdayInterval",
		type: "number",
		default: "2",
		control: "slider",
		min: 1,
		max: 3,
		step: 1,
		description: "How thinly the weekday names are spread — every other one by default, so they do not crowd the rows."
	},
	{
		name: "legend",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the \"Less … More\" scale under the grid."
	},
	{
		name: "legendLessLabel",
		type: "string",
		default: "\"Less\"",
		control: "text",
		description: "The quiet end of that scale."
	},
	{
		name: "legendMoreLabel",
		type: "string",
		default: "\"More\"",
		control: "text",
		description: "The busy end of it."
	},
	{
		name: "dateFormatter",
		type: "(date: Date) => string",
		description: "How a square's date is written in the popup."
	},
	{
		name: "countFormatter",
		type: "(count: number, date: Date) => string",
		description: "How a square's count is written in the popup. Defaults to \"N contributions\"."
	},
	{
		name: "tooltip",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether hovering a square opens a popup at all."
	},
	{
		name: "tooltipContent",
		type: "(date: Date, entry: ContributionEntry | undefined, count: number) => ReactNode",
		description: "Replaces the popup's body entirely."
	},
	{
		name: "tooltipWidth",
		type: "number",
		default: "200",
		control: "slider",
		min: 140,
		max: 360,
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
		description: "Which side of the square the popup opens on."
	},
	{
		name: "openDelay",
		type: "number",
		default: "0",
		control: "slider",
		min: 0,
		max: 600,
		step: 50,
		description: "How long the pointer has to rest on a square before the popup opens."
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
		name: "onDayClick",
		type: "(date: Date, entry: ContributionEntry | undefined, count: number) => void",
		description: "Fired when a square is clicked."
	},
	{
		name: "emptyMessage",
		type: "string",
		default: "\"No activity recorded\"",
		control: "text",
		description: "Shown in place of the grid when there is nothing to draw."
	}
];

interface Props {
}

export const ContributionChartDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Contribution Chart"
			description="The year of small squares a profile page uses to show how busy someone has been — one square per day, a column per week, shaded by how much happened, with the detail behind a hover card. It fills whatever width it is given, dividing it between the weeks and keeping the squares square, so constraining it is the caller's business rather than the chart's. It draws itself out of a CSS grid rather than going through Chart.js, so it stays sharp at any size and its popup is built out of the library's own components."
			name="ContributionChart"
			previewHeight={260}
			previewCentered={false}
			imports={["ContributionEntry"]}
			interfaces={[CONTRIBUTION_ENTRY_INTERFACE]}
			props={CONTRIBUTION_CHART_PROPS}
			preview={values => (
				<div style={{width: "100%", padding: "40px 20px"}}>
					<ContributionChart
						entries={DEMO_HISTORY}
						title={values.title}
						showHeader={values.showHeader}
						showTotal={values.showTotal}
						weekStart={values.weekStart}
						cellSize={values.cellSize ? values.cellSize : undefined}
						minCellSize={values.minCellSize}
						cellGap={values.cellGap}
						cellRadius={values.cellRadius}
						showMonthLabels={values.showMonthLabels}
						showWeekdayLabels={values.showWeekdayLabels}
						weekdayInterval={values.weekdayInterval}
						legend={values.legend}
						legendLessLabel={values.legendLessLabel}
						legendMoreLabel={values.legendMoreLabel}
						tooltip={values.tooltip}
						tooltipWidth={values.tooltipWidth}
						tooltipSide={values.tooltipSide}
						openDelay={values.openDelay}
						closeDelay={values.closeDelay}
						emptyMessage={values.emptyMessage}></ContributionChart>
				</div>
			)}>

			<div className="blue-orange-contribution-docs-example">
				<h4>A quarter</h4>
				<p>The same chart over a shorter window. Nothing about the size is set here — thirteen weeks divide the same width up between them, so the squares simply come out bigger.</p>
				<ContributionChart
					title={"Pull requests"}
					entries={QUARTER_HISTORY}
					cellGap={4}
					cellRadius={4}
					totalLabel={total => total.toLocaleString() + " pull requests this quarter"}></ContributionChart>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>Weeks that start on Monday</h4>
				<p>`weekStart` rotates the rows, and the weekday names follow it.</p>
				<ContributionChart
					title={"Deployments"}
					entries={QUARTER_HISTORY}
					weekStart={1}
					cellGap={4}
					countFormatter={count => count === 1 ? "1 deployment" : count + " deployments"}></ContributionChart>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>A scale of your own</h4>
				<p>`levelColors` sets both the palette and how many bands there are, and `levels` fixes the counts each band starts at rather than letting the busiest day decide.</p>
				<ContributionChart
					title={"Reviews"}
					entries={QUARTER_HISTORY}
					levelColors={REVIEW_COLORS}
					levels={[1, 4, 8, 14]}
					cellGap={4}
					cellRadius={7}></ContributionChart>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>On a dark background</h4>
				<p>Left to itself the scale is painted as CSS variables, so it darkens with the rest of the page and nothing has to be passed in. The two palettes are exported as <code>CONTRIBUTION_LEVEL_COLORS</code> and <code>CONTRIBUTION_LEVEL_COLORS_DARK</code> for anywhere else that has to match them.</p>
				<div className="dark blue-orange-contribution-docs-dark">
					<ContributionChart
						title={"Commits"}
						entries={QUARTER_HISTORY}
						cellGap={4}></ContributionChart>
				</div>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>A day worth calling out</h4>
				<p>An entry's `note` sits under the count in the popup — hover the deep square near the right hand end.</p>
				<ContributionChart
					title={"Commits"}
					entries={NOTED_HISTORY}
					cellGap={4}
					tooltipWidth={240}></ContributionChart>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>A popup of your own</h4>
				<p>`tooltipContent` replaces the card's body, leaving the hover card itself to do the positioning.</p>
				<ContributionChart
					title={"Issues closed"}
					entries={QUARTER_HISTORY}
					cellGap={4}
					tooltipWidth={180}
					tooltipSide={HoverCardSide.BOTTOM}
					tooltipContent={(date, entry, count) => (
						<div className="blue-orange-contribution-docs-popup">
							<strong>{date.toDateString()}</strong>
							<span>{count === 0 ? "nothing closed" : count + " closed"}</span>
						</div>
					)}></ContributionChart>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>Bare squares</h4>
				<p>Everything but the grid turned off, for dropping into a card that carries its own heading.</p>
				<ContributionChart
					entries={QUARTER_HISTORY}
					showHeader={false}
					showMonthLabels={false}
					showWeekdayLabels={false}
					legend={false}
					cellGap={3}
					tooltip={false}></ContributionChart>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>Constrained by the caller</h4>
				<p>The chart fills whatever it is given, so narrowing it is a matter of narrowing what it sits in rather than telling the chart a size.</p>
				<div style={{maxWidth: "420px"}}>
					<ContributionChart title={"Commits"} entries={QUARTER_HISTORY} cellGap={3}></ContributionChart>
				</div>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>Squares of a fixed size</h4>
				<p>`cellSize` pins the squares instead, which is what you want when several charts of different lengths have to read at the same scale. A year of them is wider than most columns, so the grid scrolls sideways rather than shrinking.</p>
				<ContributionChart
					title={"Commits"}
					entries={DEMO_HISTORY}
					cellSize={11}
					cellGap={3}></ContributionChart>
			</div>

			<div className="blue-orange-contribution-docs-example">
				<h4>Nothing recorded yet</h4>
				<ContributionChart title={"New repository"} entries={[]}></ContributionChart>
			</div>

		</ComponentDoc>
	)
}
