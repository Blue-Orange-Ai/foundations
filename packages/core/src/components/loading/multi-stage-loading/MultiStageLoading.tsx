import React, {ReactNode, useEffect, useRef, useState} from "react";

import './MultiStageLoading.css'

/**
 * What a stage has been resolved to. A stage does not normally carry one —
 * it is worked out from where the stage sits relative to the active one —
 * but a stage that has gone wrong has to say so itself.
 */
export enum LoadingStageStatus {
	PENDING = "PENDING",
	ACTIVE = "ACTIVE",
	COMPLETE = "COMPLETE",
	ERROR = "ERROR"
}

export enum MultiStageLoadingAlign {
	LEFT = "LEFT",
	CENTER = "CENTER"
}

export interface LoadingStage {
	/** The line of text the stage is read as. */
	label: string;
	/** A second, quieter line under the label. */
	description?: string;
	/** Replaces the icon the status would otherwise resolve to — a spinner, a tick, a dot. */
	icon?: ReactNode;
	/**
	 * Forces the stage's status rather than letting its position decide.
	 * Mostly for ERROR: a stage the run stopped on.
	 */
	status?: LoadingStageStatus;
	/** Anything the label cannot carry — a byte count, a link, a tag. Sits at the end of the row. */
	trailing?: ReactNode;
}

/** The icon each status resolves to, unless the stage brings its own. */
export const LOADING_STAGE_ICONS: Record<LoadingStageStatus, string> = {
	[LoadingStageStatus.PENDING]: "ri-circle-line",
	[LoadingStageStatus.ACTIVE]: "ri-loader-4-line",
	[LoadingStageStatus.COMPLETE]: "ri-check-line",
	[LoadingStageStatus.ERROR]: "ri-error-warning-line"
};

/** Which stage a row is, given where it sits relative to the active one. */
export const resolveStageStatus = (stage: LoadingStage, index: number, activeStage: number): LoadingStageStatus => {
	if (stage.status) {
		return stage.status;
	}
	if (index < activeStage) {
		return LoadingStageStatus.COMPLETE;
	}
	if (index > activeStage) {
		return LoadingStageStatus.PENDING;
	}
	return LoadingStageStatus.ACTIVE;
}

const statusClassName: Record<LoadingStageStatus, string> = {
	[LoadingStageStatus.PENDING]: "blue-orange-multi-stage-loading-stage-pending",
	[LoadingStageStatus.ACTIVE]: "blue-orange-multi-stage-loading-stage-active",
	[LoadingStageStatus.COMPLETE]: "blue-orange-multi-stage-loading-stage-complete",
	[LoadingStageStatus.ERROR]: "blue-orange-multi-stage-loading-stage-error"
};

interface Props {
	/** The steps of the run, in the order they happen. */
	stages: Array<LoadingStage>;
	/** Which one is happening now, as an index into `stages`. */
	activeStage: number;
	/**
	 * How many stages either side of the active one stay on screen. One shows
	 * the step just done above and the step coming up below; zero shows the
	 * active stage on its own.
	 */
	visibleNeighbours?: number;
	/** The height of a single row, in pixels. Sets how far the track travels between stages. */
	rowHeight?: number;
	/** How long a move between stages takes, in milliseconds. */
	duration?: number;
	/** How faint the neighbouring stages are, as a fraction of the active one. */
	neighbourOpacity?: number;
	/** Whether the active stage spins. Off leaves it on the static icon. */
	spinner?: boolean;
	/** Draws the icon column at all. Off leaves the rows as plain text. */
	showIcons?: boolean;
	/** Whether the rows sit at the left of the component or in the middle of it. */
	align?: MultiStageLoadingAlign;
	/** A thin bar under the rows showing how far through the stages the run is. */
	progress?: boolean;
	/** The "Step 2 of 5" line under the rows. */
	showStageCount?: boolean;
	/** How that line is written. */
	stageCountFormatter?: (activeStage: number, total: number) => string;
	/** Shown in place of the rows when there are no stages. */
	emptyMessage?: string;
	/** Fired once a move between stages has finished, with the stage now active. */
	onStageSettled?: (index: number) => void;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * A loading view for a run that happens in named steps: the step underway,
 * the step before it faded above and the step after it faded below, with the
 * whole column sliding as the run moves on. It is controlled — `activeStage`
 * says where the run is, and the component animates its way there.
 */
export const MultiStageLoading: React.FC<Props> = ({
													   stages,
													   activeStage,
													   visibleNeighbours = 1,
													   rowHeight = 46,
													   duration = 450,
													   neighbourOpacity = 0.35,
													   spinner = true,
													   showIcons = true,
													   align = MultiStageLoadingAlign.LEFT,
													   progress = false,
													   showStageCount = false,
													   stageCountFormatter,
													   emptyMessage = "Nothing to load",
													   onStageSettled,
													   className = "",
													   style = {}}) => {

	// The track only animates once it has been on screen at its starting
	// position for a frame. Without this the first stage slides in from
	// wherever the transform happens to start, which reads as a glitch on a
	// component that is often mounted mid run.
	const [animated, setAnimated] = useState<boolean>(false);

	const settleTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		const frame = requestAnimationFrame(() => setAnimated(true));
		return () => cancelAnimationFrame(frame);
	}, []);

	useEffect(() => {
		if (settleTimeout.current !== undefined) {
			clearTimeout(settleTimeout.current);
		}
		if (!onStageSettled) {
			return;
		}
		settleTimeout.current = setTimeout(() => onStageSettled(activeStage), duration);
		return () => {
			if (settleTimeout.current !== undefined) {
				clearTimeout(settleTimeout.current);
			}
		};
	}, [activeStage, duration, onStageSettled]);

	if (stages.length === 0) {
		return (
			<div className={"blue-orange-multi-stage-loading blue-orange-multi-stage-loading-empty" + (className ? " " + className : "")} style={style}>
				{emptyMessage}
			</div>
		)
	}

	// The active stage is clamped rather than trusted: a run that overshoots
	// its own list should settle on the last stage, not scroll past it.
	const active = Math.min(Math.max(activeStage, 0), stages.length - 1);
	const neighbours = Math.max(visibleNeighbours, 0);
	const viewportHeight = rowHeight * (neighbours * 2 + 1);

	const containerStyle: React.CSSProperties = {
		...style,
		["--blue-orange-multi-stage-loading-duration" as any]: duration + "ms"
	};

	const trackStyle: React.CSSProperties = {
		transform: "translateY(" + (-active * rowHeight) + "px)"
	};

	const alignClass = align === MultiStageLoadingAlign.CENTER
		? " blue-orange-multi-stage-loading-center"
		: "";

	const progressPercentage = stages.length === 1
		? 100
		: (active / (stages.length - 1)) * 100;

	const countLabel = stageCountFormatter
		? stageCountFormatter(active, stages.length)
		: "Step " + (active + 1) + " of " + stages.length;

	return (
		<div
			className={"blue-orange-multi-stage-loading" + alignClass + (className ? " " + className : "")}
			style={containerStyle}
			role="status"
			aria-live="polite"
			aria-label={countLabel + ": " + stages[active].label}>

			<div
				className="blue-orange-multi-stage-loading-viewport"
				style={{height: viewportHeight + "px", paddingTop: (neighbours * rowHeight) + "px"}}>
				<div
					className={"blue-orange-multi-stage-loading-track" + (animated ? " blue-orange-multi-stage-loading-track-animated" : "")}
					style={trackStyle}>

					{stages.map((stage, index) => {
						const status = resolveStageStatus(stage, index, active);
						const distance = Math.abs(index - active);
						// Rows outside the window are still rendered — they are what
						// slides in — but taken out of the flow of the reading order
						// and faded right out.
						const visible = distance <= neighbours;
						const rowStyle: React.CSSProperties = {
							height: rowHeight + "px",
							opacity: visible ? (index === active ? 1 : neighbourOpacity) : 0
						};
						const icon = stage.icon !== undefined
							? stage.icon
							: <i className={LOADING_STAGE_ICONS[status]
								+ (status === LoadingStageStatus.ACTIVE && spinner ? " blue-orange-multi-stage-loading-spin" : "")}></i>;

						return (
							<div
								key={index}
								className={"blue-orange-multi-stage-loading-stage " + statusClassName[status]}
								style={rowStyle}
								aria-hidden={index === active ? undefined : true}>
								{showIcons
									? <div className="blue-orange-multi-stage-loading-icon">{icon}</div>
									: <></>}
								<div className="blue-orange-multi-stage-loading-text">
									<div className="blue-orange-multi-stage-loading-label">{stage.label}</div>
									{stage.description
										? <div className="blue-orange-multi-stage-loading-description">{stage.description}</div>
										: <></>}
								</div>
								{stage.trailing
									? <div className="blue-orange-multi-stage-loading-trailing">{stage.trailing}</div>
									: <></>}
							</div>
						)
					})}

				</div>
			</div>

			{progress
				? <div className="blue-orange-multi-stage-loading-progress">
					<div
						className="blue-orange-multi-stage-loading-progress-bar"
						style={{width: progressPercentage + "%"}}></div>
				</div>
				: <></>}

			{showStageCount
				? <div className="blue-orange-multi-stage-loading-count">{countLabel}</div>
				: <></>}

		</div>
	)
}
