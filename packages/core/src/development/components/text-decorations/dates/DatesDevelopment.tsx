import React from "react";

import './DatesDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {DateDisplay} from "../../../../components/text-decorations/dates/date-display/DateDisplay";
import {RelativeTime} from "../../../../components/text-decorations/dates/relative-time/RelativeTime";
import {TimeDisplay} from "../../../../components/text-decorations/dates/time/TimeDisplay";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const DatesDevelopment: React.FC<Props> = ({}) => {

	const now = new Date();
	const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
	const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

	return (
		<PaddedPage>
			<PageHeading>Date Text Decorations</PageHeading>
			<Description>Components for displaying dates in various formats.</Description>

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
		</PaddedPage>
	)
}
