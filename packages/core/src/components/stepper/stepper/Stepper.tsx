import React, {useEffect, useState} from "react";

import './Stepper.css'
import {StepperStep} from "../stepper-step/StepperStep";
import {StepperIndicator} from "../stepper-indicator/StepperIndicator";
import {StepperSeparator} from "../stepper-separator/StepperSeparator";
import {
	StepperIndicatorVariant,
	StepperOrientation,
	StepperSize,
	StepperStepState,
	StepperTitlePlacement
} from "./StepperTypes";
import {Badge} from "../../text-decorations/badge/Badge";

interface StepMetaData {
	uuid: string;
	title: string;
	description?: string;
	icon?: string;
	badge?: string;
	state?: StepperStepState;
	disabled: boolean;
	children?: React.ReactNode;
}

interface Props {
	children: React.ReactNode;
	/** The step being worked on. Updating it moves the stepper from the outside. */
	activeStep?: string;
	onStepChange?: (uuid: string, index: number) => void;
	orientation?: StepperOrientation;
	indicator?: StepperIndicatorVariant;
	size?: StepperSize;
	/**
	 * Whether the text of a step sits beside its indicator, underneath it, or is
	 * dropped in favour of a caption naming only the active step. Ignored by a
	 * vertical stepper, whose text always sits beside the rail.
	 */
	titlePlacement?: StepperTitlePlacement;
	/** Builds the counter shown by the CAPTION placement. */
	formatStepCount?: (current: number, total: number) => string;
	/** Lets a step be jumped to by clicking its head. */
	clickable?: boolean;
	/** Renders the children of the active step underneath (or beside) the nav. */
	showPanels?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * A step by step progress indicator. Declare a StepperStep per step — each one
 * carries its own title, description and panel, and works out whether it is
 * pending, active or complete from where it sits relative to the active step.
 */
export const Stepper: React.FC<Props> = ({
											 children,
											 activeStep,
											 onStepChange,
											 orientation = StepperOrientation.HORIZONTAL,
											 indicator = StepperIndicatorVariant.NUMBER,
											 size = StepperSize.MEDIUM,
											 titlePlacement = StepperTitlePlacement.INLINE,
											 formatStepCount = (current: number, total: number) => "Step " + current + " of " + total,
											 clickable = false,
											 showPanels = true,
											 classes = "",
											 style = {}}) => {

	const steps: StepMetaData[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === StepperStep) {
				steps.push({
					uuid: child.props.uuid as string,
					title: child.props.title as string,
					description: child.props.description as (string | undefined),
					icon: child.props.icon as (string | undefined),
					badge: child.props.badge as (string | undefined),
					state: child.props.state as (StepperStepState | undefined),
					disabled: (child.props.disabled as boolean) ?? false,
					children: child.props.children as React.ReactNode
				});
			}
		}
	});

	const [active, setActive] = useState(activeStep ?? steps[0]?.uuid ?? "");

	useEffect(() => {
		if (activeStep !== undefined) {
			setActive(activeStep);
		}
	}, [activeStep]);

	const vertical = orientation === StepperOrientation.VERTICAL;

	const activeIndex = steps.findIndex(step => step.uuid === active);

	/**
	 * A declared state always wins — that is how a step is held in a loading or
	 * error state. Everything else falls out of the position of the step.
	 */
	const stateOf = (step: StepMetaData, index: number): StepperStepState => {
		if (step.state !== undefined) {
			return step.state;
		}
		if (activeIndex === -1) {
			return StepperStepState.PENDING;
		}
		if (index < activeIndex) {
			return StepperStepState.COMPLETED;
		}
		if (index === activeIndex) {
			return StepperStepState.ACTIVE;
		}
		return StepperStepState.PENDING;
	}

	const isDone = (step: StepMetaData, index: number): boolean => {
		return stateOf(step, index) === StepperStepState.COMPLETED;
	}

	const selectStep = (step: StepMetaData, index: number) => {
		if (!clickable || step.disabled || step.uuid === active) {
			return;
		}
		setActive(step.uuid);
		if (onStepChange) {
			onStepChange(step.uuid, index);
		}
	}

	// the caption and the stacked layouts only mean anything across a row of steps
	const captioned = !vertical && titlePlacement === StepperTitlePlacement.CAPTION;

	const sizeClassName: Record<StepperSize, string> = {
		[StepperSize.SMALL]: "blue-orange-stepper-sm",
		[StepperSize.MEDIUM]: "",
		[StepperSize.LARGE]: "blue-orange-stepper-lg",
	};

	const generateClassName = () => {
		var className = "blue-orange-stepper";
		className += vertical ? " blue-orange-stepper-vertical" : " blue-orange-stepper-horizontal";
		if (sizeClassName[size]) {
			className += " " + sizeClassName[size];
		}
		if (!vertical && titlePlacement === StepperTitlePlacement.BELOW) {
			className += " blue-orange-stepper-title-below";
		}
		if (captioned) {
			className += " blue-orange-stepper-captioned";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	const headClassName = (step: StepMetaData, index: number) => {
		var className = "blue-orange-stepper-step-head";
		if (clickable && !step.disabled) {
			className += " blue-orange-stepper-step-head-clickable";
		}
		if (step.disabled) {
			className += " blue-orange-stepper-step-head-disabled";
		}
		if (stateOf(step, index) === StepperStepState.ACTIVE) {
			className += " blue-orange-stepper-step-head-active";
		}
		return className;
	}

	/**
	 * The clickable head of a step. Vertical steppers carry the indicator in the
	 * rail column beside the head, so it is left out of the head there; the
	 * caption placement names the active step once instead, so the head carries
	 * no text at all.
	 */
	const renderHead = (step: StepMetaData, index: number, withIndicator: boolean, withText: boolean = true) => {
		return (
			<div
				className={headClassName(step, index)}
				role={clickable ? "button" : undefined}
				tabIndex={clickable && !step.disabled ? 0 : undefined}
				aria-current={step.uuid === active ? "step" : undefined}
				aria-disabled={step.disabled}
				onClick={() => selectStep(step, index)}
				onKeyDown={(event) => {
					if (clickable && (event.key === "Enter" || event.key === " ")) {
						event.preventDefault();
						selectStep(step, index);
					}
				}}>
				{withIndicator &&
					<StepperIndicator
						state={stateOf(step, index)}
						number={index + 1}
						icon={step.icon}
						variant={indicator}></StepperIndicator>
				}
				{withText &&
					<div className="blue-orange-stepper-step-text">
						<div className="blue-orange-stepper-step-title-row">
							<span className="blue-orange-stepper-step-title">{step.title}</span>
							{step.badge && <Badge style={{fontSize: "0.7rem"}}>{step.badge}</Badge>}
						</div>
						{step.description &&
							<span className="blue-orange-stepper-step-description">{step.description}</span>
						}
					</div>
				}
			</div>
		)
	}

	/** Names the active step in place of labelling every one of them. */
	const renderCaption = () => {
		const step = steps[activeIndex];
		if (!step) {
			return null;
		}
		return (
			<div className="blue-orange-stepper-caption">
				<div className="blue-orange-stepper-caption-count">
					<span>{formatStepCount(activeIndex + 1, steps.length)}</span>
					{step.badge && <Badge style={{fontSize: "0.7rem"}}>{step.badge}</Badge>}
				</div>
				<div className="blue-orange-stepper-caption-title">{step.title}</div>
				{step.description &&
					<div className="blue-orange-stepper-caption-description">{step.description}</div>
				}
			</div>
		)
	}

	// Vertical steps carry their own panel, so the content sits directly under
	// the step it belongs to with the rail running past it.
	if (vertical) {
		return (
			<div className={generateClassName()} style={style}>
				{steps.map((step, index) => (
					<div key={step.uuid} className="blue-orange-stepper-step-row">
						<div className="blue-orange-stepper-step-rail">
							<StepperIndicator
								state={stateOf(step, index)}
								number={index + 1}
								icon={step.icon}
								variant={indicator}></StepperIndicator>
							{index < steps.length - 1 &&
								<StepperSeparator
									completed={isDone(step, index)}
									orientation={StepperOrientation.VERTICAL}></StepperSeparator>
							}
						</div>
						<div className="blue-orange-stepper-step-body">
							{renderHead(step, index, false)}
							{showPanels && step.children && step.uuid === active &&
								<div className="blue-orange-stepper-panel">{step.children}</div>
							}
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className={generateClassName()} style={style}>
			{captioned && renderCaption()}
			<div className="blue-orange-stepper-nav">
				{steps.map((step, index) => (
					<React.Fragment key={step.uuid}>
						{index > 0 &&
							<StepperSeparator
								completed={isDone(steps[index - 1], index - 1)}
								orientation={StepperOrientation.HORIZONTAL}></StepperSeparator>
						}
						{renderHead(step, index, true, !captioned)}
					</React.Fragment>
				))}
			</div>
			{showPanels &&
				<div className="blue-orange-stepper-panels">
					{steps.filter(step => step.children).map(step => (
						<div
							key={step.uuid}
							className={step.uuid === active
								? "blue-orange-stepper-panel"
								: "blue-orange-stepper-panel blue-orange-stepper-panel-hidden"}>
							{step.children}
						</div>
					))}
				</div>
			}
		</div>
	)
}
