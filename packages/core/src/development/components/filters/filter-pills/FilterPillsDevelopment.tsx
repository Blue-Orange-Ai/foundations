import React, {useState} from "react";

import './FilterPillsDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {FilterPills, FilterPillsSize} from "../../../../components/filters/filter-pills/FilterPills";
import {FilterPill} from "../../../../components/filters/filter-pill/FilterPill";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const FILTER_PILLS_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The FilterPill entries, in the order they sit in the set."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Filter change requests by status",
		description: "Names the set for a screen reader — what the pills are filtering, and by what."
	},
	{
		name: "size",
		type: "FilterPillsSize",
		default: "FilterPillsSize.MEDIUM",
		defaultValue: FilterPillsSize.MEDIUM,
		control: "select",
		options: [
			{label: "Small", value: FilterPillsSize.SMALL, code: "FilterPillsSize.SMALL"},
			{label: "Medium", value: FilterPillsSize.MEDIUM, code: "FilterPillsSize.MEDIUM"}
		],
		description: "How large the pills are."
	},
	{
		name: "fullWidth",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Spreads the pills across the width of the parent instead of hugging them."
	},
	{
		name: "scroll",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Keeps the set on one line and scrolls it instead of wrapping."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		description: "Extra class names put on the set."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the set."
	}
];

const FILTER_PILL_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Approved",
		description: "What the pill reads."
	},
	{
		name: "count",
		type: "number | string",
		control: "number",
		value: 10,
		description: "The tally shown inside the pill. A 0 still shows; an omitted count does not."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "A remixicon class rendered before the label."
	},
	{
		name: "active",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Marks this pill as the one the list is filtered by."
	},
	{
		name: "round",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Rounds the pill into a stadium instead of the default 4px square corners."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the pill out and takes it out of the set's keyboard order."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the pill is picked."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		description: "Extra class names put on the pill."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the pill."
	}
];

const STATUSES = [
	{uuid: "all", name: "All", count: 10},
	{uuid: "open", name: "Open", count: 0},
	{uuid: "approved", name: "Approved", count: 10},
	{uuid: "rejected", name: "Rejected", count: 0}
];

interface Props {
}

export const FilterPillsDevelopment: React.FC<Props> = ({}) => {

	const [status, setStatus] = useState("all");

	const [previewStatus, setPreviewStatus] = useState("all");

	return (
		<ComponentDoc
			title="Filter Pills"
			description="The row of filters above a list — one pill per bucket, each carrying the number of rows behind it. The set is a single tab stop: the arrow keys move between the pills and enter or space picks one, so arrowing across the filters never fires a refetch per pill."
			name="FilterPills"
			previewHeight={140}
			previewCentered={false}
			imports={["FilterPill", "FilterPillsSize"]}
			props={FILTER_PILLS_PROPS}
			snippetChildren={() => "<FilterPill label={\"All\"} count={10} active={true} onClick={() => setStatus(\"all\")}></FilterPill>\n<FilterPill label={\"Open\"} count={0} onClick={() => setStatus(\"open\")}></FilterPill>\n<FilterPill label={\"Approved\"} count={10} onClick={() => setStatus(\"approved\")}></FilterPill>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<FilterPills
						label={values.label}
						size={values.size}
						fullWidth={values.fullWidth}
						scroll={values.scroll}>
						{STATUSES.map(entry => (
							<FilterPill
								key={entry.uuid}
								label={entry.name}
								count={entry.count}
								active={entry.uuid === previewStatus}
								onClick={() => setPreviewStatus(entry.uuid)}
							></FilterPill>
						))}
					</FilterPills>
				</div>
			)}
			siblings={[
				{
					name: "FilterPill",
					description: "One choice in the set — the label of a filter with the number of rows behind it. The selected pill takes the same inverse fill a selected toggle button does.",
					props: FILTER_PILL_PROPS,
					previewHeight: 120,
					previewCentered: false,
					imports: ["FilterPills"],
					preview: values => (
						<FilterPills>
							<FilterPill
								label={values.label}
								count={values.count}
								icon={values.icon}
								active={values.active}
								disabled={values.disabled}
							></FilterPill>
						</FilterPills>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<Description>{"Filtered by " + status + "."}</Description>
			<FilterPills label="Filter change requests by status">
				{STATUSES.map(entry => (
					<FilterPill
						key={entry.uuid}
						label={entry.name}
						count={entry.count}
						active={entry.uuid === status}
						onClick={() => setStatus(entry.uuid)}
					></FilterPill>
				))}
			</FilterPills>

			<GeneralHeading>Without counts</GeneralHeading>
			<FilterPills label="Filter by type">
				<FilterPill label="Everything" active={true}></FilterPill>
				<FilterPill label="Services"></FilterPill>
				<FilterPill label="Databases"></FilterPill>
				<FilterPill label="Queues"></FilterPill>
			</FilterPills>

			<GeneralHeading>With icons</GeneralHeading>
			<FilterPills label="Filter deployments by state">
				<FilterPill label="All" count={24} active={true}></FilterPill>
				<FilterPill label="Running" count={18} icon="ri-play-circle-line"></FilterPill>
				<FilterPill label="Degraded" count={5} icon="ri-error-warning-line"></FilterPill>
				<FilterPill label="Stopped" count={1} icon="ri-stop-circle-line"></FilterPill>
				<FilterPill label="Archived" icon="ri-archive-line" disabled={true}></FilterPill>
			</FilterPills>

			<GeneralHeading>Round</GeneralHeading>
			<Description>Square 4px corners match badges and tags; round gives back the stadium shape.</Description>
			<FilterPills label="Filter releases by channel">
				<FilterPill label="All" count={18} round={true} active={true}></FilterPill>
				<FilterPill label="Stable" count={12} round={true}></FilterPill>
				<FilterPill label="Beta" count={5} round={true}></FilterPill>
				<FilterPill label="Nightly" count={1} round={true}></FilterPill>
			</FilterPills>

			<GeneralHeading>Small</GeneralHeading>
			<FilterPills size={FilterPillsSize.SMALL} label="Filter activities by outcome">
				<FilterPill label="All" count={132} active={true}></FilterPill>
				<FilterPill label="Succeeded" count={128}></FilterPill>
				<FilterPill label="Failed" count={4}></FilterPill>
			</FilterPills>

			<GeneralHeading>Full width</GeneralHeading>
			<div className="blue-orange-filter-pills-development-panel">
				<FilterPills fullWidth={true} label="Filter packages by scan result">
					<FilterPill label="All" count={41} active={true}></FilterPill>
					<FilterPill label="Clean" count={33}></FilterPill>
					<FilterPill label="Vulnerable" count={8}></FilterPill>
				</FilterPills>
			</div>

			<GeneralHeading>Scrolling</GeneralHeading>
			<Description>More buckets than the header has room for, kept on one line.</Description>
			<div className="blue-orange-filter-pills-development-panel">
				<FilterPills scroll={true} label="Filter hosts by architecture">
					<FilterPill label="All" count={64} active={true}></FilterPill>
					<FilterPill label="linux/amd64" count={41}></FilterPill>
					<FilterPill label="linux/arm64" count={19}></FilterPill>
					<FilterPill label="darwin/arm64" count={3}></FilterPill>
					<FilterPill label="windows/amd64" count={1}></FilterPill>
					<FilterPill label="Unknown" count={0}></FilterPill>
				</FilterPills>
			</div>
		</ComponentDoc>
	)
}
