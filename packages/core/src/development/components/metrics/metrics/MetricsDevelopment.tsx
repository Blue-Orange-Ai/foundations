import React, {useState} from "react";

import './MetricsDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {Metric} from "../../../../components/metrics/metric/Metric";
import {SimpleMetric} from "../../../../components/metrics/simple-metric/SimpleMetric";
import {MetricCard, MetricLabelPosition} from "../../../../components/metrics/metric-card/MetricCard";
import {MetricWithAction} from "../../../../components/metrics/metric-with-action/MetricWithAction";
import {MetricWithCopy} from "../../../../components/metrics/metric-with-copy/MetricWithCopy";
import {MetricsGroup} from "../../../../components/metrics/metrics-group/MetricsGroup";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";

interface Props {
}

const USAGE = `// A labelled read only value
<Metric label="Workspace id" text="ws_8f21c4"></Metric>

// The same, with a copy to clipboard button
<MetricWithCopy label="Api key" text="sk-live-4f9c..."></MetricWithCopy>

// ...or with an action of your own
<MetricWithAction label="Endpoint" text="https://api.company.com" icon="ri-external-link-line"
                  onClick={() => window.open(url)}></MetricWithAction>

// Headline numbers, laid out in a row
<MetricsGroup gap={20}>
    <MetricCard label="Revenue" text="£48,210" icon="ri-line-chart-line"></MetricCard>
    <MetricCard label="Signups" text="1,204" icon="ri-user-add-line"></MetricCard>
</MetricsGroup>`;

export const MetricsDevelopment: React.FC<Props> = ({}) => {

	const [clicked, setClicked] = useState<string>("-");

	return (
		<PaddedPage>
			<PageHeading>Metrics</PageHeading>
			<Paragraph>
				Metrics present a single value. Metric is the plain labelled field, MetricWithCopy and MetricWithAction
				add a button on the right, MetricCard is the headline card, SimpleMetric is the compact pill, and
				MetricsGroup lays any of them out in an evenly spaced row.
			</Paragraph>

			<div className="metrics-dev-section">
				<FormHeading label="Metric"></FormHeading>
				<div className="metrics-dev-column">
					<Metric label="Workspace id" text="ws_8f21c4"></Metric>
					<Metric label="Region" text="eu-west-2"></Metric>
					<Metric text="No label at all"></Metric>
				</div>
			</div>

			<div className="metrics-dev-section">
				<FormHeading label="MetricWithCopy"></FormHeading>
				<div className="metrics-dev-column">
					<MetricWithCopy label="Api key" text="sk-live-4f9c2b7e11a4"></MetricWithCopy>
					<MetricWithCopy label="Webhook secret" text="whsec_9d31f0ac"></MetricWithCopy>
				</div>
			</div>

			<div className="metrics-dev-section">
				<FormHeading label="MetricWithAction"></FormHeading>
				<div className="metrics-dev-column">
					<MetricWithAction
						label="Endpoint"
						text="https://api.company.com/v1"
						icon="ri-external-link-line"
						onClick={() => setClicked("Endpoint action")}></MetricWithAction>
					<MetricWithAction
						label="Connected account"
						text="acct_1M2n3B4v"
						icon="ri-refresh-line"
						onClick={() => setClicked("Refresh action")}></MetricWithAction>
				</div>
				<div className="metrics-dev-output">Last action: {clicked}</div>
			</div>

			<div className="metrics-dev-section">
				<FormHeading label="MetricCard in a MetricsGroup"></FormHeading>
				<MetricsGroup gap={20}>
					<MetricCard label="Revenue" text="£48,210" icon="ri-line-chart-line"></MetricCard>
					<MetricCard label="Signups" text="1,204" icon="ri-user-add-line"></MetricCard>
					<MetricCard label="Churn" text="1.8%" icon="ri-user-unfollow-line"></MetricCard>
				</MetricsGroup>
			</div>

			<div className="metrics-dev-section">
				<FormHeading label="MetricCard label positions"></FormHeading>
				<MetricsGroup gap={20}>
					<MetricCard label="Above" text="82" labelPosition={MetricLabelPosition.TOP}
								icon="ri-arrow-up-line"></MetricCard>
					<MetricCard label="Below" text="82" labelPosition={MetricLabelPosition.BOTTOM}
								icon="ri-arrow-down-line"></MetricCard>
				</MetricsGroup>
			</div>

			<div className="metrics-dev-section">
				<FormHeading label="SimpleMetric"></FormHeading>
				<div className="metrics-dev-row">
					<SimpleMetric text="24 open"></SimpleMetric>
					<SimpleMetric text="3 blocked"></SimpleMetric>
					<SimpleMetric text="Clickable" onClick={() => setClicked("SimpleMetric")}></SimpleMetric>
				</div>
			</div>

			<div className="metrics-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</PaddedPage>
	)
}
