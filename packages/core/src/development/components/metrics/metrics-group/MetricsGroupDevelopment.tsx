import React from "react";

import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {MetricsGroup} from "../../../../components/metrics/metrics-group/MetricsGroup";
import {MetricCard} from "../../../../components/metrics/metric-card/MetricCard";

interface Props {
}

export const MetricsGroupDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Metrics Group</PageHeading>
			<Description>Displays multiple metric cards together. With no gap the shared borders and radii between adjacent cards are collapsed, leaving only the last card with its border fully intact.</Description>

			<GeneralHeading>Joined (no gap)</GeneralHeading>
			<MetricsGroup>
				<MetricCard text={"3 Sensors"} label={"Num. Sensors"} icon={"ri-gradienter-line"}></MetricCard>
				<MetricCard text={"12 Devices"} label={"Num. Devices"} icon={"ri-cpu-line"}></MetricCard>
				<MetricCard text={"98%"} label={"Uptime"} icon={"ri-pulse-line"}></MetricCard>
			</MetricsGroup>

			<GeneralHeading>With Gap</GeneralHeading>
			<MetricsGroup gap={16}>
				<MetricCard text={"3 Sensors"} label={"Num. Sensors"} icon={"ri-gradienter-line"}></MetricCard>
				<MetricCard text={"12 Devices"} label={"Num. Devices"} icon={"ri-cpu-line"}></MetricCard>
				<MetricCard text={"98%"} label={"Uptime"} icon={"ri-pulse-line"}></MetricCard>
			</MetricsGroup>
		</PaddedPage>
	)
}
