import React, {useState} from "react";

import './MetricsDevelopment.css'
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Metric} from "../../../../components/metrics/metric/Metric";
import {SimpleMetric} from "../../../../components/metrics/simple-metric/SimpleMetric";
import {MetricCard, MetricLabelPosition} from "../../../../components/metrics/metric-card/MetricCard";
import {MetricWithAction} from "../../../../components/metrics/metric-with-action/MetricWithAction";
import {MetricWithCopy} from "../../../../components/metrics/metric-with-copy/MetricWithCopy";
import {MetricsGroup} from "../../../../components/metrics/metrics-group/MetricsGroup";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const METRIC_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "12,840",
		description: "The value."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Runs this week",
		description: "What the value is."
	},
	{
		name: "valueStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the value."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	}
];

const METRIC_CARD_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "12,840",
		description: "The value."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Runs this week",
		description: "What the value is."
	},
	{
		name: "labelPosition",
		type: "MetricLabelPosition",
		default: "MetricLabelPosition.TOP",
		defaultValue: MetricLabelPosition.TOP,
		control: "select",
		options: [
			{label: "Top", value: MetricLabelPosition.TOP, code: "MetricLabelPosition.TOP"},
			{label: "Bottom", value: MetricLabelPosition.BOTTOM, code: "MetricLabelPosition.BOTTOM"}
		],
		description: "Whether the label sits above the value or under it."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-play-list-line",
		description: "A remixicon class drawn on the card."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Makes the card clickable, and gives it the treatment that says so."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the card."
	},
	{
		name: "iconStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the icon."
	},
	{
		name: "valueStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the value."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	},
	{
		name: "clickable",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — hands the card an onClick."
	}
];

const METRIC_WITH_COPY_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "run-8f2c41d9",
		description: "The value, and what the button puts on the clipboard."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Run id",
		description: "What the value is."
	},
	{
		name: "copyBtnStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the copy button."
	},
	{
		name: "copiedBtnStyle",
		type: "React.CSSProperties",
		default: "green on white",
		description: "Inline style put on that button once it has copied."
	},
	{
		name: "valueStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the value."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	}
];

const METRIC_WITH_ACTION_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "12,840",
		description: "The value."
	},
	{
		name: "icon",
		type: "string",
		required: true,
		control: "text",
		value: "ri-external-link-line",
		description: "The remixicon class on the button."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Runs this week",
		description: "What the value is."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the button is clicked."
	},
	{
		name: "actionBtnStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the button."
	},
	{
		name: "valueStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the value."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	}
];

const SIMPLE_METRIC_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "12,840",
		description: "The value."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Makes the value clickable."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the value."
	},
	{
		name: "className",
		type: "string",
		control: "text",
		description: "Extra class names put on the value."
	},
	{
		name: "clickable",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — hands the metric an onClick."
	}
];

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
		<ComponentDoc
			title="Metrics"
			description="A single value presented on its own. Metric is the plain labelled field; MetricCard gives it a surface and an icon; MetricWithCopy and MetricWithAction hang a control off it; SimpleMetric is the bare number for a dense row."
			name="Metric"
			previewHeight={160}
			props={METRIC_PROPS}
			preview={values => (
				<Metric text={values.text} label={values.label}></Metric>
			)}
			siblings={[
				{
					name: "MetricCard",
					description: "The metric on a surface of its own, with an icon and the label above or below the value. It is the one that goes in a row of headline figures.",
					props: METRIC_CARD_PROPS,
					previewHeight: 180,
					imports: ["MetricLabelPosition"],
					preview: values => (
						<MetricCard
							text={values.text}
							label={values.label}
							labelPosition={values.labelPosition}
							icon={values.icon}
							onClick={values.clickable ? () => {} : undefined}></MetricCard>
					)
				},
				{
					name: "MetricWithCopy",
					description: "A metric whose value can be copied — an identifier, a key, a reference.",
					props: METRIC_WITH_COPY_PROPS,
					previewHeight: 160,
					preview: values => (
						<MetricWithCopy text={values.text} label={values.label}></MetricWithCopy>
					)
				},
				{
					name: "MetricWithAction",
					description: "A metric with a button beside it — open, refresh, drill in.",
					props: METRIC_WITH_ACTION_PROPS,
					previewHeight: 160,
					preview: values => (
						<MetricWithAction
							text={values.text}
							label={values.label}
							icon={values.icon}
							onClick={() => {}}></MetricWithAction>
					)
				},
				{
					name: "SimpleMetric",
					description: "The value on its own, with no label and no surface — for a dense row where the heading above it already says what the numbers are.",
					props: SIMPLE_METRIC_PROPS,
					previewHeight: 140,
					preview: values => (
						<SimpleMetric
							text={values.text}
							className={values.className}
							onClick={values.clickable ? () => {} : undefined}></SimpleMetric>
					)
				}
			]}>

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
		</ComponentDoc>
	)
}
