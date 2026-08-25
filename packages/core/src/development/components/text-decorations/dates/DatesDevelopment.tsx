import React from "react";

import './DatesDevelopment.css'
import {DateDisplay} from "../../../../components/text-decorations/dates/date-display/DateDisplay";
import {RelativeTime} from "../../../../components/text-decorations/dates/relative-time/RelativeTime";
import {TimeDisplay} from "../../../../components/text-decorations/dates/time/TimeDisplay";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SAMPLE_DATE = "2026-08-25T14:30:00";

const DATE_DISPLAY_PROPS: Array<PropSpec> = [
	{
		name: "targetDate",
		type: "string | Date",
		required: true,
		control: "text",
		value: SAMPLE_DATE,
		description: "The date to print, as a Date or as anything moment can parse."
	},
	{
		name: "dateFormat",
		type: "string",
		control: "select",
		options: [
			{label: "Default", value: ""},
			{label: "DD/MM/YYYY", value: "DD/MM/YYYY"},
			{label: "MM/DD/YYYY", value: "MM/DD/YYYY"},
			{label: "MMMM Do, YYYY", value: "MMMM Do, YYYY"},
			{label: "ddd D MMM", value: "ddd D MMM"}
		],
		description: "A moment format string. Left off, the component's own default is used."
	}
];

const RELATIVE_TIME_PROPS: Array<PropSpec> = [
	{
		name: "targetDate",
		type: "string | Date",
		required: true,
		control: "text",
		value: SAMPLE_DATE,
		description: "The date measured against now. Past and future both read naturally."
	}
];

const TIME_DISPLAY_PROPS: Array<PropSpec> = [
	{
		name: "targetDate",
		type: "string | Date",
		required: true,
		control: "text",
		value: SAMPLE_DATE,
		description: "The moment to print."
	},
	{
		name: "timeFormat",
		type: "\"12hr\" | \"24hr\"",
		required: true,
		control: "select",
		value: "12hr",
		options: [
			{label: "12hr", value: "12hr"},
			{label: "24hr", value: "24hr"}
		],
		description: "Which clock the time is read on."
	},
	{
		name: "dateFormat",
		type: "\"dd/mm/yy\" | \"mm/dd/yy\"",
		required: true,
		control: "select",
		value: "dd/mm/yy",
		options: [
			{label: "dd/mm/yy", value: "dd/mm/yy"},
			{label: "mm/dd/yy", value: "mm/dd/yy"}
		],
		description: "Which way round the day and month are printed."
	}
];

interface Props {
}

export const DatesDevelopment: React.FC<Props> = ({}) => {

	const now = new Date();
	const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
	const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

	return (
		<ComponentDoc
			title="Dates"
			description="Three ways of putting a moment in time on screen: the date itself, the time of day beside it, and how long ago (or how far off) it is. Each takes the same targetDate, as a Date or as a string moment can parse."
			name="DateDisplay"
			previewHeight={110}
			props={DATE_DISPLAY_PROPS}
			preview={values => (
				<span style={{fontSize: "1.25rem"}}>
					<DateDisplay targetDate={values.targetDate} dateFormat={values.dateFormat}></DateDisplay>
				</span>
			)}
			siblings={[
				{
					name: "RelativeTime",
					description: "How far the date is from now, in the largest unit that still reads naturally — minutes, hours, days, then weeks. It re-reads the clock on a timer, so it stays true while the page is open.",
					props: RELATIVE_TIME_PROPS,
					previewHeight: 110,
					preview: values => (
						<span style={{fontSize: "1.25rem"}}>
							<RelativeTime targetDate={values.targetDate}></RelativeTime>
						</span>
					)
				},
				{
					name: "TimeDisplay",
					description: "The date and the time of day together, in either a 12 or 24 hour clock.",
					props: TIME_DISPLAY_PROPS,
					previewHeight: 110,
					preview: values => (
						<span style={{fontSize: "1.25rem"}}>
							<TimeDisplay
								targetDate={values.targetDate}
								timeFormat={values.timeFormat}
								dateFormat={values.dateFormat}></TimeDisplay>
						</span>
					)
				}
			]}>

			<GeneralHeading>DateDisplay Component</GeneralHeading>
			<Description>Displays a date with optional custom formatting.</Description>
			<p>Default format: <DateDisplay targetDate={now} /></p>
			<p>Custom format (DD/MM/YYYY): <DateDisplay targetDate={now} dateFormat="DD/MM/YYYY" /></p>
			<p>Custom format (MMMM Do, YYYY): <DateDisplay targetDate={now} dateFormat="MMMM Do, YYYY" /></p>

			<GeneralHeading>RelativeTime Component</GeneralHeading>
			<Description>Shows time relative to now (e.g., "5 minutes ago").</Description>
			<p>Next hour: <RelativeTime targetDate={nextHour} /></p>
			<p>Yesterday: <RelativeTime targetDate={yesterday} /></p>
			<p>Last week: <RelativeTime targetDate={lastWeek} /></p>
			<p>Next month: <RelativeTime targetDate={nextMonth} /></p>

			<GeneralHeading>TimeDisplay Component</GeneralHeading>
			<Description>Smart time display that adapts based on how recent the date is.</Description>
			<p>Now (12hr, dd/mm/yy): <TimeDisplay targetDate={now} timeFormat="12hr" dateFormat="dd/mm/yy" /></p>
			<p>Now (24hr, mm/dd/yy): <TimeDisplay targetDate={now} timeFormat="24hr" dateFormat="mm/dd/yy" /></p>
			<p>Yesterday (12hr): <TimeDisplay targetDate={yesterday} timeFormat="12hr" dateFormat="dd/mm/yy" /></p>
			<p>Last week (24hr): <TimeDisplay targetDate={lastWeek} timeFormat="24hr" dateFormat="dd/mm/yy" /></p>
		</ComponentDoc>
	)
}
