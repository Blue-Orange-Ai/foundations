import React, {useEffect, useState} from "react";

import './MultiStageLoadingDevelopment.css'
import {
	MultiStageLoading,
	MultiStageLoadingAlign,
	LoadingStage,
	LoadingStageStatus
} from "../../../../components/loading/multi-stage-loading/MultiStageLoading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {Button, ButtonSize, ButtonType} from "../../../../components/buttons/button/Button";

const DEMO_STAGES: Array<LoadingStage> = [
	{label: "Connecting to the workspace", description: "Opening a socket"},
	{label: "Fetching the manifest", description: "142 entries"},
	{label: "Downloading files", description: "12 of 40 files"},
	{label: "Building the index", description: "This is the slow one"},
	{label: "Warming the cache"},
	{label: "Ready"}
];

const DEPLOY_STAGES: Array<LoadingStage> = [
	{label: "Building the image", trailing: <span>1m 04s</span>},
	{label: "Pushing to the registry", trailing: <span>38s</span>},
	{label: "Rolling out to eu-west-1", trailing: <span>running</span>},
	{label: "Draining the old pods"},
	{label: "Health checks"}
];

const FAILED_STAGES: Array<LoadingStage> = [
	{label: "Reading the upload"},
	{label: "Scanning for viruses"},
	{label: "Storing the file", description: "The bucket rejected the write", status: LoadingStageStatus.ERROR},
	{label: "Notifying the owner"}
];

const LOADING_STAGE_INTERFACE = {
	name: "LoadingStage",
	description: "One step of the run — a line of text, and whatever else belongs on its row.",
	props: [
		{name: "label", type: "string", required: true, description: "The line of text the stage is read as."},
		{name: "description", type: "string", description: "A second, quieter line under the label."},
		{name: "icon", type: "ReactNode", description: "Replaces the icon the status would otherwise resolve to — a spinner, a tick, a dot."},
		{name: "status", type: "LoadingStageStatus", description: "Forces the stage's status rather than letting its position decide. Mostly for ERROR."},
		{name: "trailing", type: "ReactNode", description: "Anything the label cannot carry — a duration, a byte count, a tag. Sits at the end of the row."}
	] as Array<PropSpec>
};

const MULTI_STAGE_LOADING_PROPS: Array<PropSpec> = [
	{
		name: "stages",
		type: "Array<LoadingStage>",
		required: true,
		description: "The steps of the run, in the order they happen."
	},
	{
		name: "activeStage",
		type: "number",
		required: true,
		control: "slider",
		value: 2,
		min: 0,
		max: 5,
		step: 1,
		description: "Which one is happening now, as an index into `stages`. The component animates its way there."
	},
	{
		name: "visibleNeighbours",
		type: "number",
		default: "1",
		control: "slider",
		min: 0,
		max: 2,
		step: 1,
		description: "How many stages either side of the active one stay on screen. Zero shows the active stage on its own."
	},
	{
		name: "rowHeight",
		type: "number",
		default: "46",
		control: "slider",
		min: 30,
		max: 80,
		step: 2,
		description: "The height of a single row, in pixels. Sets how far the track travels between stages."
	},
	{
		name: "duration",
		type: "number",
		default: "450",
		control: "slider",
		min: 0,
		max: 1200,
		step: 50,
		description: "How long a move between stages takes, in milliseconds."
	},
	{
		name: "neighbourOpacity",
		type: "number",
		default: "0.35",
		control: "slider",
		min: 0.05,
		max: 1,
		step: 0.05,
		description: "How faint the neighbouring stages are, as a fraction of the active one."
	},
	{
		name: "spinner",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether the active stage spins. Off leaves it on the static icon."
	},
	{
		name: "showIcons",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the icon column at all. Off leaves the rows as plain text."
	},
	{
		name: "align",
		type: "MultiStageLoadingAlign",
		default: "MultiStageLoadingAlign.LEFT",
		control: "select",
		options: [
			{label: "Left", value: MultiStageLoadingAlign.LEFT, code: "MultiStageLoadingAlign.LEFT"},
			{label: "Center", value: MultiStageLoadingAlign.CENTER, code: "MultiStageLoadingAlign.CENTER"}
		],
		description: "Whether the rows sit at the left of the component or in the middle of it."
	},
	{
		name: "progress",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "A thin bar under the rows showing how far through the stages the run is."
	},
	{
		name: "showStageCount",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "The \"Step 2 of 5\" line under the rows."
	},
	{
		name: "stageCountFormatter",
		type: "(activeStage: number, total: number) => string",
		description: "How that line is written."
	},
	{
		name: "emptyMessage",
		type: "string",
		default: "\"Nothing to load\"",
		control: "text",
		description: "Shown in place of the rows when there are no stages."
	},
	{
		name: "onStageSettled",
		type: "(index: number) => void",
		description: "Fired once a move between stages has finished, with the stage now active."
	}
];

/** Walks the demo forward on a timer, so the transition can be watched rather than described. */
const useRunningStage = (total: number, interval: number, running: boolean): [number, () => void] => {

	const [stage, setStage] = useState<number>(0);

	useEffect(() => {
		if (!running) {
			return;
		}
		const timer = setInterval(() => {
			setStage(current => (current + 1) % total);
		}, interval);
		return () => clearInterval(timer);
	}, [total, interval, running]);

	return [stage, () => setStage(0)];
}

interface Props {
}

export const MultiStageLoadingDevelopment: React.FC<Props> = ({}) => {

	const [running, setRunning] = useState<boolean>(true);
	const [autoStage, reset] = useRunningStage(DEMO_STAGES.length, 2000, running);

	const [manualStage, setManualStage] = useState<number>(2);

	return (
		<ComponentDoc
			title="Multi Stage Loading"
			description="A loading view for a run that happens in named steps rather than one long wait. The step underway sits in the middle at full weight, the step just finished is faded above it and the step coming up is faded below, and the whole column slides as the run moves on. It is controlled — hand it the index of the stage the run is on and it animates its way there."
			name="MultiStageLoading"
			previewHeight={260}
			imports={["LoadingStage"]}
			interfaces={[LOADING_STAGE_INTERFACE]}
			props={MULTI_STAGE_LOADING_PROPS}
			preview={values => (
				<div className="blue-orange-multi-stage-docs-preview">
					<MultiStageLoading
						stages={DEMO_STAGES}
						activeStage={values.activeStage}
						visibleNeighbours={values.visibleNeighbours}
						rowHeight={values.rowHeight}
						duration={values.duration}
						neighbourOpacity={values.neighbourOpacity}
						spinner={values.spinner}
						showIcons={values.showIcons}
						align={values.align}
						progress={values.progress}
						showStageCount={values.showStageCount}
						emptyMessage={values.emptyMessage}></MultiStageLoading>
				</div>
			)}>

			<div className="blue-orange-multi-stage-docs-example">
				<h4>A run, moving on its own</h4>
				<p>The stage advances every two seconds. Watch the column slide: the step that just finished takes a tick and fades back, the one coming up moves into place.</p>
				<div className="blue-orange-multi-stage-docs-panel">
					<MultiStageLoading
						stages={DEMO_STAGES}
						activeStage={autoStage}
						progress={true}
						showStageCount={true}></MultiStageLoading>
				</div>
				<div className="blue-orange-multi-stage-docs-controls">
					<Button
						text={running ? "Pause" : "Play"}
						buttonType={ButtonType.SECONDARY}
						size={ButtonSize.SMALL}
						onClick={() => setRunning(!running)}></Button>
					<Button
						text={"Restart"}
						buttonType={ButtonType.SECONDARY}
						size={ButtonSize.SMALL}
						onClick={reset}></Button>
				</div>
			</div>

			<div className="blue-orange-multi-stage-docs-example">
				<h4>Driven by hand</h4>
				<p>Stepping through one stage at a time, which is what a wizard or a long form does.</p>
				<div className="blue-orange-multi-stage-docs-panel">
					<MultiStageLoading
						stages={DEPLOY_STAGES}
						activeStage={manualStage}
						rowHeight={44}
						progress={true}></MultiStageLoading>
				</div>
				<div className="blue-orange-multi-stage-docs-controls">
					<Button
						text={"Back"}
						buttonType={ButtonType.SECONDARY}
						size={ButtonSize.SMALL}
						onClick={() => setManualStage(Math.max(manualStage - 1, 0))}></Button>
					<Button
						text={"Next"}
						buttonType={ButtonType.SECONDARY}
						size={ButtonSize.SMALL}
						onClick={() => setManualStage(Math.min(manualStage + 1, DEPLOY_STAGES.length - 1))}></Button>
				</div>
			</div>

			<div className="blue-orange-multi-stage-docs-example">
				<h4>Centred, on its own</h4>
				<p>No neighbours and no icons — the one line a full page loader wants, still sliding as the run moves on.</p>
				<div className="blue-orange-multi-stage-docs-panel">
					<MultiStageLoading
						stages={DEMO_STAGES}
						activeStage={autoStage}
						visibleNeighbours={0}
						showIcons={false}
						align={MultiStageLoadingAlign.CENTER}
						rowHeight={54}></MultiStageLoading>
				</div>
			</div>

			<div className="blue-orange-multi-stage-docs-example">
				<h4>A stage that failed</h4>
				<p>A stage carrying its own <code>status</code> overrides what its position would imply, which is how a run that stopped part way is shown.</p>
				<div className="blue-orange-multi-stage-docs-panel">
					<MultiStageLoading
						stages={FAILED_STAGES}
						activeStage={2}
						spinner={false}
						showStageCount={true}></MultiStageLoading>
				</div>
			</div>

			<div className="blue-orange-multi-stage-docs-example">
				<h4>A wider window</h4>
				<p>Two stages either side, for a run long enough that the shape of it is worth seeing.</p>
				<div className="blue-orange-multi-stage-docs-panel">
					<MultiStageLoading
						stages={DEMO_STAGES}
						activeStage={autoStage}
						visibleNeighbours={2}
						neighbourOpacity={0.3}
						rowHeight={40}></MultiStageLoading>
				</div>
			</div>

			<div className="blue-orange-multi-stage-docs-example">
				<h4>Nothing to run</h4>
				<div className="blue-orange-multi-stage-docs-panel">
					<MultiStageLoading stages={[]} activeStage={0}></MultiStageLoading>
				</div>
			</div>

		</ComponentDoc>
	)
}
