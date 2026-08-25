import React from "react";

import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {MetricsGroup} from "../../../../components/metrics/metrics-group/MetricsGroup";
import {MetricCard} from "../../../../components/metrics/metric-card/MetricCard";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const METRICS_GROUP_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The metric cards in the group."
	},
	{
		name: "gap",
		type: "number",
		default: "0",
		control: "slider",
		min: 0,
		max: 32,
		step: 2,
		description: "Space between the cards, in pixels. At 0 the cards are joined into one surface."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the group."
	}
];

interface Props {
}

export const MetricsGroupDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Metrics Group"
			description="Several metric cards laid out together. With no gap the shared borders and radii between adjacent cards collapse, so the row reads as one control rather than a set of tiles."
			name="MetricsGroup"
			previewHeight={200}
			previewCentered={false}
			imports={["MetricCard"]}
			props={METRICS_GROUP_PROPS}
			snippetChildren={() => "<MetricCard text={\"12,840\"} label={\"Runs\"} icon={\"ri-play-list-line\"}></MetricCard>\n<MetricCard text={\"98.2%\"} label={\"Succeeded\"} icon={\"ri-check-line\"}></MetricCard>\n<MetricCard text={\"14m\"} label={\"Median\"} icon={\"ri-time-line\"}></MetricCard>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<MetricsGroup gap={values.gap}>
						<MetricCard text={"12,840"} label={"Runs"} icon={"ri-play-list-line"}></MetricCard>
						<MetricCard text={"98.2%"} label={"Succeeded"} icon={"ri-check-line"}></MetricCard>
						<MetricCard text={"14m"} label={"Median"} icon={"ri-time-line"}></MetricCard>
					</MetricsGroup>
				</div>
			)}>

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
		</ComponentDoc>
	)
}
