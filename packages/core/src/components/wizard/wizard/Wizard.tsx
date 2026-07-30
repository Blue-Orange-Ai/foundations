import React, {useEffect, useRef, useState} from "react";

import './Wizard.css'
import {WizardStage} from "../wizard-stage/WizardStage";
import {Stepper} from "../../stepper/stepper/Stepper";
import {StepperStep} from "../../stepper/stepper-step/StepperStep";
import {
	StepperIndicatorVariant,
	StepperOrientation,
	StepperSize,
	StepperStepState,
	StepperTitlePlacement
} from "../../stepper/stepper/StepperTypes";
import {Button, ButtonSize, ButtonType} from "../../buttons/button/Button";

export enum WizardOrientation {
	/** The stepper runs across the top with the stage underneath it. */
	HORIZONTAL = "HORIZONTAL",
	/** The stages stack, each one opening in place under its own step. */
	VERTICAL = "VERTICAL"
}

interface StageMetaData {
	uuid: string;
	title: string;
	description?: string;
	icon?: string;
	badge?: string;
	canProceed: boolean;
	state?: StepperStepState;
	children?: React.ReactNode;
}

interface Props {
	children: React.ReactNode;
	/** The stage being worked on. Updating it moves the wizard from the outside. */
	activeStage?: string;
	onStageChange?: (uuid: string, index: number) => void;
	/** Fires when the last stage is finished. */
	onComplete?: (uuid: string) => void;
	/** Shows a cancel button in the footer when supplied. */
	onCancel?: () => void;
	orientation?: WizardOrientation;
	/**
	 * Vertical only. Opens the stage being worked on in place and closes the one
	 * before it, rather than swapping them outright. Turned off — or with
	 * `unmountInactiveStages` on — the stages simply appear and disappear.
	 */
	animateStages?: boolean;
	showStepper?: boolean;
	stepperSize?: StepperSize;
	stepperIndicator?: StepperIndicatorVariant;
	stepperTitlePlacement?: StepperTitlePlacement;
	/** Lets a stage that has already been reached be jumped back to from the stepper. */
	allowStageNavigation?: boolean;
	showFooter?: boolean;
	/** Replaces the built in footer — for wizards that drive themselves. */
	footer?: React.ReactNode;
	backLabel?: string;
	nextLabel?: string;
	finishLabel?: string;
	cancelLabel?: string;
	/** Shows the next button working, e.g. while the stage is being saved. */
	nextLoading?: boolean;
	/**
	 * Throws away the stages that are not showing instead of hiding them. Their
	 * content starts fresh each time it is reached, so only worth it when a
	 * stage is expensive to keep around.
	 */
	unmountInactiveStages?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * A staged flow with the stepper across the top, the current stage underneath
 * and the navigation at the bottom.
 *
 * The stages are read from the children on every render and tracked by uuid, so
 * a wizard can grow or shrink as it is filled in: render a stage conditionally,
 * or leave it declared and turn its `enabled` off, and the flow re-numbers
 * itself around the stage being worked on.
 */
export const Wizard: React.FC<Props> = ({
											children,
											activeStage,
											onStageChange,
											onComplete,
											onCancel,
											orientation = WizardOrientation.HORIZONTAL,
											animateStages = true,
											showStepper = true,
											stepperSize = StepperSize.SMALL,
											stepperIndicator = StepperIndicatorVariant.NUMBER,
											stepperTitlePlacement = StepperTitlePlacement.INLINE,
											allowStageNavigation = true,
											showFooter = true,
											footer,
											backLabel = "Back",
											nextLabel = "Next",
											finishLabel = "Finish",
											cancelLabel = "Cancel",
											nextLoading = false,
											unmountInactiveStages = false,
											classes = "",
											style = {}}) => {

	const stages: StageMetaData[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === WizardStage) {
				// a stage that is switched off is not part of the flow at all
				if ((child.props.enabled as boolean | undefined) === false) {
					return;
				}
				stages.push({
					uuid: child.props.uuid as string,
					title: child.props.title as string,
					description: child.props.description as (string | undefined),
					icon: child.props.icon as (string | undefined),
					badge: child.props.badge as (string | undefined),
					canProceed: (child.props.canProceed as boolean | undefined) ?? true,
					state: child.props.state as (StepperStepState | undefined),
					children: child.props.children as React.ReactNode
				});
			}
		}
	});

	const [active, setActive] = useState(activeStage ?? stages[0]?.uuid ?? "");

	// Every stage that has been reached, so the stepper knows which ones can be
	// jumped back to. Tracked by uuid — inserting a stage never re-opens one.
	const [visited, setVisited] = useState<string[]>(active ? [active] : []);

	const activeIndex = stages.findIndex(stage => stage.uuid === active);

	// where the wizard was standing last, used to land somewhere sensible if the
	// active stage is taken out of the flow
	const lastIndexRef = useRef(0);

	useEffect(() => {
		if (activeIndex >= 0) {
			lastIndexRef.current = activeIndex;
		}
	}, [activeIndex]);

	useEffect(() => {
		if (activeStage !== undefined) {
			setActive(activeStage);
		}
	}, [activeStage]);

	useEffect(() => {
		if (active && !visited.includes(active)) {
			setVisited((previous) => [...previous, active]);
		}
	}, [active]);

	const changeStage = (stage: StageMetaData, index: number) => {
		setActive(stage.uuid);
		if (onStageChange) {
			onStageChange(stage.uuid, index);
		}
	}

	// The active stage can disappear underneath the wizard — an earlier answer
	// changes and the stage is switched off. Fall back to whatever now sits
	// where the wizard was standing.
	useEffect(() => {
		if (stages.length === 0 || activeIndex >= 0) {
			return;
		}
		const fallbackIndex = Math.min(lastIndexRef.current, stages.length - 1);
		changeStage(stages[fallbackIndex], fallbackIndex);
	}, [activeIndex, stages.length]);

	const currentStage = activeIndex >= 0 ? stages[activeIndex] : undefined;

	const isFirst = activeIndex <= 0;

	const isLast = activeIndex === stages.length - 1;

	const goBack = () => {
		if (isFirst) {
			return;
		}
		changeStage(stages[activeIndex - 1], activeIndex - 1);
	}

	const goNext = () => {
		if (currentStage && !currentStage.canProceed) {
			return;
		}
		if (isLast) {
			if (onComplete && currentStage) {
				onComplete(currentStage.uuid);
			}
			return;
		}
		changeStage(stages[activeIndex + 1], activeIndex + 1);
	}

	/** Only somewhere already reached can be jumped to from the stepper. */
	const handleStepChange = (uuid: string, index: number) => {
		const stage = stages[index];
		if (!stage || !visited.includes(uuid)) {
			return;
		}
		changeStage(stage, index);
	}

	// The vertical view is the stepper itself — each stage opens under its own
	// step — so it only applies while there is a stepper to open into.
	const vertical = orientation === WizardOrientation.VERTICAL && showStepper && stages.length > 0;

	const generateClassName = () => {
		var className = "blue-orange-wizard";
		className += vertical ? " blue-orange-wizard-vertical" : " blue-orange-wizard-horizontal";
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	const renderStages = () => {
		return stages.map(stage => {
			const isActive = stage.uuid === active;
			if (unmountInactiveStages && !isActive) {
				return null;
			}
			return (
				<div
					key={stage.uuid}
					className={isActive
						? "blue-orange-wizard-stage"
						: "blue-orange-wizard-stage blue-orange-wizard-stage-hidden"}>
					{stage.children}
				</div>
			)
		});
	}

	const renderFooter = () => {
		if (footer !== undefined) {
			return <div className="blue-orange-wizard-footer">{footer}</div>;
		}
		if (!showFooter) {
			return null;
		}
		return (
			<div className="blue-orange-wizard-footer">
				<div className="blue-orange-wizard-footer-left">
					{onCancel &&
						<Button
							text={cancelLabel}
							buttonType={ButtonType.CLEAR}
							size={ButtonSize.SMALL}
							onClick={onCancel}></Button>
					}
				</div>
				<div className="blue-orange-wizard-footer-right">
					<Button
						text={backLabel}
						buttonType={ButtonType.SECONDARY}
						size={ButtonSize.SMALL}
						isDisabled={isFirst}
						onClick={goBack}></Button>
					<Button
						text={isLast ? finishLabel : nextLabel}
						buttonType={ButtonType.PRIMARY}
						size={ButtonSize.SMALL}
						isLoading={nextLoading}
						isDisabled={currentStage ? !currentStage.canProceed : true}
						onClick={goNext}></Button>
				</div>
			</div>
		)
	}

	// Vertical hands the stages to the stepper, which runs the rail past each one
	// and opens the active stage in place.
	if (vertical) {
		return (
			<div className={generateClassName()} style={style}>
				<div className="blue-orange-wizard-body">
					<Stepper
						activeStep={active}
						orientation={StepperOrientation.VERTICAL}
						size={stepperSize}
						indicator={stepperIndicator}
						clickable={allowStageNavigation}
						showPanels={true}
						animatePanels={animateStages && !unmountInactiveStages}
						onStepChange={handleStepChange}>
						{stages.map(stage => (
							<StepperStep
								key={stage.uuid}
								uuid={stage.uuid}
								title={stage.title}
								description={stage.description}
								icon={stage.icon}
								badge={stage.badge}
								state={stage.state}
								disabled={!allowStageNavigation || !visited.includes(stage.uuid)}>
								<div className="blue-orange-wizard-stage">{stage.children}</div>
							</StepperStep>
						))}
					</Stepper>
				</div>
				{renderFooter()}
			</div>
		)
	}

	return (
		<div className={generateClassName()} style={style}>
			{showStepper && stages.length > 0 &&
				<div className="blue-orange-wizard-header">
					<Stepper
						activeStep={active}
						size={stepperSize}
						indicator={stepperIndicator}
						titlePlacement={stepperTitlePlacement}
						clickable={allowStageNavigation}
						showPanels={false}
						onStepChange={handleStepChange}>
						{stages.map(stage => (
							<StepperStep
								key={stage.uuid}
								uuid={stage.uuid}
								title={stage.title}
								description={stage.description}
								icon={stage.icon}
								badge={stage.badge}
								state={stage.state}
								disabled={!allowStageNavigation || !visited.includes(stage.uuid)}></StepperStep>
						))}
					</Stepper>
				</div>
			}
			<div className="blue-orange-wizard-body">
				{renderStages()}
			</div>
			{renderFooter()}
		</div>
	)
}
