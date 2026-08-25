import React, {useState} from "react";

import './StepperDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Stepper} from "../../../components/stepper/stepper/Stepper";
import {StepperStep} from "../../../components/stepper/stepper-step/StepperStep";
import {
	StepperIndicatorVariant,
	StepperOrientation,
	StepperSize,
	StepperStepState,
	StepperTitlePlacement
} from "../../../components/stepper/stepper/StepperTypes";
import {Button, ButtonType, ButtonSize} from "../../../components/buttons/button/Button";
import {Input} from "../../../components/inputs/input/Input";
import {Modal} from "../../../components/layouts/modal/modal/Modal";
import {ModalHeader} from "../../../components/layouts/modal/modal-header/ModalHeader";
import {ModalBody} from "../../../components/layouts/modal/modal-body/ModalBody";
import {ModalFooter} from "../../../components/layouts/modal/modal-footer/ModalFooter";
import {ModalFooterRight} from "../../../components/layouts/modal/modal-footer-right/ModalFooterRight";
import {Drawer, DrawerPosition} from "../../../components/layouts/drawer/drawer/Drawer";
import {DrawerHeader} from "../../../components/layouts/drawer/drawer-header/DrawerHeader";
import {DrawerBody} from "../../../components/layouts/drawer/drawer-body/DrawerBody";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";
import {StepperIndicator} from "../../../components/stepper/stepper-indicator/StepperIndicator";
import {StepperSeparator} from "../../../components/stepper/stepper-separator/StepperSeparator";

const STEPPER_STATE_OPTIONS = [
	{label: "Pending", value: StepperStepState.PENDING, code: "StepperStepState.PENDING"},
	{label: "Active", value: StepperStepState.ACTIVE, code: "StepperStepState.ACTIVE"},
	{label: "Completed", value: StepperStepState.COMPLETED, code: "StepperStepState.COMPLETED"},
	{label: "Loading", value: StepperStepState.LOADING, code: "StepperStepState.LOADING"},
	{label: "Error", value: StepperStepState.ERROR, code: "StepperStepState.ERROR"}
];

const STEPPER_INDICATOR_OPTIONS = [
	{label: "Number", value: StepperIndicatorVariant.NUMBER, code: "StepperIndicatorVariant.NUMBER"},
	{label: "Icon", value: StepperIndicatorVariant.ICON, code: "StepperIndicatorVariant.ICON"},
	{label: "Dot", value: StepperIndicatorVariant.DOT, code: "StepperIndicatorVariant.DOT"}
];

const STEPPER_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The StepperStep entries, in the order they are worked through."
	},
	{
		name: "activeStep",
		type: "string",
		control: "select",
		value: "billing",
		options: [
			{label: "Details", value: "details"},
			{label: "Billing", value: "billing"},
			{label: "Review", value: "review"}
		],
		description: "The uuid of the step being worked on. Setting it moves the stepper from the outside."
	},
	{
		name: "onStepChange",
		type: "(uuid: string, index: number) => void",
		description: "Fires with the step that was moved to, and where it sits in the run."
	},
	{
		name: "orientation",
		type: "StepperOrientation",
		default: "StepperOrientation.HORIZONTAL",
		defaultValue: StepperOrientation.HORIZONTAL,
		control: "select",
		options: [
			{label: "Horizontal", value: StepperOrientation.HORIZONTAL, code: "StepperOrientation.HORIZONTAL"},
			{label: "Vertical", value: StepperOrientation.VERTICAL, code: "StepperOrientation.VERTICAL"}
		],
		description: "Which way the run of steps goes."
	},
	{
		name: "indicator",
		type: "StepperIndicatorVariant",
		default: "StepperIndicatorVariant.NUMBER",
		defaultValue: StepperIndicatorVariant.NUMBER,
		control: "select",
		options: STEPPER_INDICATOR_OPTIONS,
		description: "What the circle at the head of each step shows."
	},
	{
		name: "size",
		type: "StepperSize",
		default: "StepperSize.MEDIUM",
		defaultValue: StepperSize.MEDIUM,
		control: "select",
		options: [
			{label: "Small", value: StepperSize.SMALL, code: "StepperSize.SMALL"},
			{label: "Medium", value: StepperSize.MEDIUM, code: "StepperSize.MEDIUM"},
			{label: "Large", value: StepperSize.LARGE, code: "StepperSize.LARGE"}
		],
		description: "How large the indicators and their text are."
	},
	{
		name: "titlePlacement",
		type: "StepperTitlePlacement",
		default: "StepperTitlePlacement.INLINE",
		defaultValue: StepperTitlePlacement.INLINE,
		control: "select",
		options: [
			{label: "Inline", value: StepperTitlePlacement.INLINE, code: "StepperTitlePlacement.INLINE"},
			{label: "Below", value: StepperTitlePlacement.BELOW, code: "StepperTitlePlacement.BELOW"},
			{label: "Caption", value: StepperTitlePlacement.CAPTION, code: "StepperTitlePlacement.CAPTION"}
		],
		description: "Whether the text sits beside the indicator, underneath it, or is dropped for a caption naming only the active step. Ignored by a vertical stepper."
	},
	{
		name: "formatStepCount",
		type: "(current: number, total: number) => string",
		default: "\"Step {current} of {total}\"",
		description: "Builds the counter shown by the CAPTION placement."
	},
	{
		name: "clickable",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets a step be jumped to by clicking its head."
	},
	{
		name: "showPanels",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Renders the children of the active step underneath — or beside — the run."
	},
	{
		name: "animatePanels",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Vertical steppers only. Keeps every panel mounted and animates the active one open as the one before it closes."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the stepper."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the stepper."
	}
];

const STEPPER_STEP_PROPS: Array<PropSpec> = [
	{
		name: "uuid",
		type: "string",
		required: true,
		description: "Identifies the step, and is what activeStep and onStepChange speak in."
	},
	{
		name: "title",
		type: "string",
		required: true,
		control: "text",
		value: "Details",
		description: "The step's name."
	},
	{
		name: "description",
		type: "string",
		control: "text",
		value: "Name and address",
		description: "The muted line under the title."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-user-line",
		description: "A remixicon class, shown by the ICON indicator variant."
	},
	{
		name: "badge",
		type: "string",
		control: "text",
		description: "A short label next to the title, such as \"Optional\"."
	},
	{
		name: "state",
		type: "StepperStepState",
		control: "select",
		options: STEPPER_STATE_OPTIONS,
		description: "Pins the step to a state. Left unset it works itself out from where it sits relative to the active step."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the step out and stops it being jumped to."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The panel shown while this step is the active one."
	}
];

const STEPPER_INDICATOR_PROPS: Array<PropSpec> = [
	{
		name: "state",
		type: "StepperStepState",
		required: true,
		control: "select",
		value: StepperStepState.ACTIVE,
		options: STEPPER_STATE_OPTIONS,
		description: "What the indicator is showing — which decides its fill and its glyph."
	},
	{
		name: "number",
		type: "number",
		control: "number",
		value: 2,
		description: "The position of the step, counted from 1. Used by the NUMBER variant."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-user-line",
		description: "A remixicon class used by the ICON variant."
	},
	{
		name: "variant",
		type: "StepperIndicatorVariant",
		default: "StepperIndicatorVariant.NUMBER",
		defaultValue: StepperIndicatorVariant.NUMBER,
		control: "select",
		options: STEPPER_INDICATOR_OPTIONS,
		description: "Whether the circle shows the number, the icon, or a plain dot."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the indicator."
	}
];

const STEPPER_SEPARATOR_PROPS: Array<PropSpec> = [
	{
		name: "completed",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Fills the line in, marking the step behind it as done."
	},
	{
		name: "orientation",
		type: "StepperOrientation",
		default: "StepperOrientation.HORIZONTAL",
		defaultValue: StepperOrientation.HORIZONTAL,
		control: "select",
		options: [
			{label: "Horizontal", value: StepperOrientation.HORIZONTAL, code: "StepperOrientation.HORIZONTAL"},
			{label: "Vertical", value: StepperOrientation.VERTICAL, code: "StepperOrientation.VERTICAL"}
		],
		description: "Which way the line runs."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the line."
	}
];

interface Props {
}

const STEP_ORDER = ["details", "address", "payment"];

export const StepperDevelopment: React.FC<Props> = ({}) => {

	const [active, setActive] = useState("details");

	const activeIndex = STEP_ORDER.indexOf(active);

	const [modalOpen, setModalOpen] = useState(false);

	const [drawerOpen, setDrawerOpen] = useState(false);

	// the overlay demos drive their own step so they do not fight the page
	const [overlayStep, setOverlayStep] = useState("details");

	const overlayIndex = STEP_ORDER.indexOf(overlayStep);

	const overlayStepper = (
		<Stepper
			activeStep={overlayStep}
			size={StepperSize.SMALL}
			titlePlacement={StepperTitlePlacement.CAPTION}
			showPanels={false}>
			<StepperStep uuid="details" title="Your details"></StepperStep>
			<StepperStep uuid="address" title="Address"></StepperStep>
			<StepperStep uuid="payment" title="Payment"></StepperStep>
		</Stepper>
	);

	const overlayControls = (
		<>
			<Button
				text="Back"
				buttonType={ButtonType.SECONDARY}
				size={ButtonSize.SMALL}
				isDisabled={overlayIndex === 0}
				onClick={() => setOverlayStep(STEP_ORDER[Math.max(overlayIndex - 1, 0)])}></Button>
			<Button
				text={overlayIndex === STEP_ORDER.length - 1 ? "Finish" : "Next"}
				buttonType={ButtonType.PRIMARY}
				size={ButtonSize.SMALL}
				onClick={() => {
					if (overlayIndex === STEP_ORDER.length - 1) {
						setModalOpen(false);
						setDrawerOpen(false);
						setOverlayStep(STEP_ORDER[0]);
						return;
					}
					setOverlayStep(STEP_ORDER[overlayIndex + 1]);
				}}></Button>
		</>
	);

	return (
		<ComponentDoc
			title="Stepper"
			description="A step by step progress indicator. Each step works out whether it is pending, active or complete from where it sits relative to the active one — loading and error states can be pinned on a step directly."
			name="Stepper"
			previewHeight={300}
			previewCentered={false}
			imports={["StepperStep", "StepperOrientation", "StepperIndicatorVariant", "StepperSize", "StepperTitlePlacement"]}
			props={STEPPER_PROPS}
			snippetChildren={() => "<StepperStep uuid={\"details\"} title={\"Details\"} description={\"Name and address\"}>\n\t<p>The details panel.</p>\n</StepperStep>\n<StepperStep uuid={\"billing\"} title={\"Billing\"} description={\"Card and plan\"}>\n\t<p>The billing panel.</p>\n</StepperStep>\n<StepperStep uuid={\"review\"} title={\"Review\"}>\n\t<p>The review panel.</p>\n</StepperStep>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<Stepper
						activeStep={values.activeStep}
						orientation={values.orientation}
						indicator={values.indicator}
						size={values.size}
						titlePlacement={values.titlePlacement}
						clickable={values.clickable}
						showPanels={values.showPanels}
						animatePanels={values.animatePanels}>
						<StepperStep uuid="details" title="Details" description="Name and address" icon="ri-user-line">
							<p>The details panel.</p>
						</StepperStep>
						<StepperStep uuid="billing" title="Billing" description="Card and plan" icon="ri-bank-card-line">
							<p>The billing panel.</p>
						</StepperStep>
						<StepperStep uuid="review" title="Review" icon="ri-check-line">
							<p>The review panel.</p>
						</StepperStep>
					</Stepper>
				</div>
			)}
			siblings={[
				{
					name: "StepperStep",
					description: "One step. It renders nothing itself — the Stepper reads its props and its children become the panel shown while it is active.",
					props: STEPPER_STEP_PROPS,
					previewHeight: 200,
					previewCentered: false,
					imports: ["Stepper"],
					snippetChildren: () => "<p>The details panel.</p>",
					preview: values => (
						<div style={{width: "100%"}}>
							<Stepper activeStep="details">
								<StepperStep
									uuid="details"
									title={values.title}
									description={values.description}
									icon={values.icon}
									badge={values.badge}
									state={values.state}
									disabled={values.disabled}>
									<p>The details panel.</p>
								</StepperStep>
								<StepperStep uuid="billing" title="Billing"></StepperStep>
							</Stepper>
						</div>
					)
				},
				{
					name: "StepperIndicator",
					description: "The circle at the head of a step, on its own. Useful for building a stepper-like head into something else.",
					props: STEPPER_INDICATOR_PROPS,
					previewHeight: 120,
					preview: values => (
						<StepperIndicator
							state={values.state}
							number={values.number}
							icon={values.icon}
							variant={values.variant}></StepperIndicator>
					)
				},
				{
					name: "StepperSeparator",
					description: "The line between two steps. It fills in once the step behind it is done.",
					props: STEPPER_SEPARATOR_PROPS,
					previewHeight: 110,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%"}}>
							<StepperSeparator completed={values.completed} orientation={values.orientation}></StepperSeparator>
						</div>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<Stepper activeStep="address" showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment"></StepperStep>
			</Stepper>

			<GeneralHeading>With descriptions</GeneralHeading>
			<Stepper activeStep="address" showPanels={false}>
				<StepperStep uuid="details" title="Your details" description="Name and email"></StepperStep>
				<StepperStep uuid="address" title="Address" description="Where we deliver"></StepperStep>
				<StepperStep uuid="payment" title="Payment" description="Card or invoice"></StepperStep>
			</Stepper>

			<GeneralHeading>Icons and badges</GeneralHeading>
			<Stepper activeStep="address" indicator={StepperIndicatorVariant.ICON} showPanels={false}>
				<StepperStep uuid="details" title="Your details" icon="ri-user-4-line"></StepperStep>
				<StepperStep uuid="address" title="Address" icon="ri-map-pin-3-line"></StepperStep>
				<StepperStep uuid="payment" title="Payment" icon="ri-bank-card-line" badge="Optional"></StepperStep>
			</Stepper>

			<GeneralHeading>Dot indicators</GeneralHeading>
			<Stepper activeStep="address" indicator={StepperIndicatorVariant.DOT} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment"></StepperStep>
			</Stepper>

			<GeneralHeading>Sizes</GeneralHeading>
			<Description>Small trims the indicators, the text and the spacing for tight containers.</Description>
			<div className="blue-orange-stepper-development-stack">
				<Stepper activeStep="address" size={StepperSize.SMALL} showPanels={false}>
					<StepperStep uuid="details" title="Your details"></StepperStep>
					<StepperStep uuid="address" title="Address"></StepperStep>
					<StepperStep uuid="payment" title="Payment"></StepperStep>
				</Stepper>
				<Stepper activeStep="address" size={StepperSize.MEDIUM} showPanels={false}>
					<StepperStep uuid="details" title="Your details"></StepperStep>
					<StepperStep uuid="address" title="Address"></StepperStep>
					<StepperStep uuid="payment" title="Payment"></StepperStep>
				</Stepper>
				<Stepper activeStep="address" size={StepperSize.LARGE} showPanels={false}>
					<StepperStep uuid="details" title="Your details"></StepperStep>
					<StepperStep uuid="address" title="Address"></StepperStep>
					<StepperStep uuid="payment" title="Payment"></StepperStep>
				</Stepper>
			</div>

			<GeneralHeading>Caption — the small view</GeneralHeading>
			<Description>
				Only the active step is named, so the width never grows with the number of steps. This
				is the view for the top of a modal or a drawer.
			</Description>
			<div className="blue-orange-stepper-development-narrow">
				<Stepper
					activeStep="address"
					size={StepperSize.SMALL}
					titlePlacement={StepperTitlePlacement.CAPTION}
					showPanels={false}>
					<StepperStep uuid="details" title="Your details"></StepperStep>
					<StepperStep uuid="address" title="Address" description="Where we deliver"></StepperStep>
					<StepperStep uuid="payment" title="Payment"></StepperStep>
					<StepperStep uuid="review" title="Review"></StepperStep>
					<StepperStep uuid="confirm" title="Confirm"></StepperStep>
				</Stepper>
			</div>

			<GeneralHeading>Caption with a custom counter</GeneralHeading>
			<div className="blue-orange-stepper-development-narrow">
				<Stepper
					activeStep="payment"
					size={StepperSize.SMALL}
					titlePlacement={StepperTitlePlacement.CAPTION}
					indicator={StepperIndicatorVariant.DOT}
					formatStepCount={(current, total) => current + " / " + total}
					showPanels={false}>
					<StepperStep uuid="details" title="Your details"></StepperStep>
					<StepperStep uuid="address" title="Address"></StepperStep>
					<StepperStep uuid="payment" title="Payment" badge="Secure"></StepperStep>
					<StepperStep uuid="review" title="Review"></StepperStep>
				</Stepper>
			</div>

			<GeneralHeading>In a modal and a drawer</GeneralHeading>
			<Description>The same small captioned stepper sitting at the top of each overlay.</Description>
			<div className="blue-orange-stepper-development-actions">
				<Button
					text="Open modal"
					buttonType={ButtonType.SECONDARY}
					size={ButtonSize.SMALL}
					onClick={() => {
						setOverlayStep(STEP_ORDER[0]);
						setModalOpen(true);
					}}></Button>
				<Button
					text="Open drawer"
					buttonType={ButtonType.SECONDARY}
					size={ButtonSize.SMALL}
					onClick={() => {
						setOverlayStep(STEP_ORDER[0]);
						setDrawerOpen(true);
					}}></Button>
			</div>

			<Modal open={modalOpen} width={420} onClose={() => setModalOpen(false)}>
				<ModalHeader label="Add a customer" onClose={() => setModalOpen(false)}></ModalHeader>
				<ModalBody>
					{overlayStepper}
					<div className="blue-orange-stepper-development-overlay-body">
						<Input label="Full name" placeholder="Tom"></Input>
					</div>
				</ModalBody>
				<ModalFooter>
					<ModalFooterRight>
						{overlayControls}
					</ModalFooterRight>
				</ModalFooter>
			</Modal>

			<Drawer
				open={drawerOpen}
				position={DrawerPosition.RIGHT}
				width="420px"
				onClose={() => setDrawerOpen(false)}>
				<DrawerHeader label="Add a customer" onClose={() => setDrawerOpen(false)}></DrawerHeader>
				<DrawerBody>
					{overlayStepper}
					<div className="blue-orange-stepper-development-overlay-body">
						<Input label="Full name" placeholder="Tom"></Input>
					</div>
					<div className="blue-orange-stepper-development-actions">
						{overlayControls}
					</div>
				</DrawerBody>
			</Drawer>

			<GeneralHeading>Title below the indicator</GeneralHeading>
			<Description>
				The text stacks under its indicator and the connecting line drops onto the middle of
				the circles. Horizontal steppers only.
			</Description>
			<Stepper activeStep="address" titlePlacement={StepperTitlePlacement.BELOW} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment"></StepperStep>
			</Stepper>

			<GeneralHeading>Title below, with descriptions</GeneralHeading>
			<Stepper activeStep="address" titlePlacement={StepperTitlePlacement.BELOW} showPanels={false}>
				<StepperStep uuid="details" title="Your details" description="Name and email"></StepperStep>
				<StepperStep uuid="address" title="Address" description="Where we deliver"></StepperStep>
				<StepperStep uuid="payment" title="Payment" description="Card or invoice" badge="Optional"></StepperStep>
			</Stepper>

			<GeneralHeading>Title below, with icons</GeneralHeading>
			<Stepper
				activeStep="address"
				titlePlacement={StepperTitlePlacement.BELOW}
				indicator={StepperIndicatorVariant.ICON}
				showPanels={false}>
				<StepperStep uuid="details" title="Your details" icon="ri-user-4-line"></StepperStep>
				<StepperStep uuid="address" title="Address" icon="ri-map-pin-3-line"></StepperStep>
				<StepperStep uuid="payment" title="Payment" icon="ri-bank-card-line"></StepperStep>
			</Stepper>

			<GeneralHeading>Title below, with content</GeneralHeading>
			<Stepper
				activeStep={active}
				titlePlacement={StepperTitlePlacement.BELOW}
				clickable={true}
				onStepChange={setActive}>
				<StepperStep uuid="details" title="Your details" description="Name and email">
					<div className="blue-orange-stepper-development-panel">
						<Input label="Full name" placeholder="Tom"></Input>
					</div>
				</StepperStep>
				<StepperStep uuid="address" title="Address" description="Where we deliver">
					<div className="blue-orange-stepper-development-panel">
						<Input label="Postcode" placeholder="SW1A 1AA"></Input>
					</div>
				</StepperStep>
				<StepperStep uuid="payment" title="Payment" description="Card or invoice">
					<div className="blue-orange-stepper-development-panel">
						<Input label="Card number" isNumber={true}></Input>
					</div>
				</StepperStep>
			</Stepper>

			<GeneralHeading>Loading and error states</GeneralHeading>
			<Description>A state declared on a step always wins over the one it would work out.</Description>
			<Stepper activeStep="address" showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Verifying address" state={StepperStepState.LOADING}></StepperStep>
				<StepperStep uuid="payment" title="Payment declined" state={StepperStepState.ERROR}></StepperStep>
			</Stepper>

			<GeneralHeading>Every step complete</GeneralHeading>
			<Stepper activeStep="done" showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment"></StepperStep>
				<StepperStep uuid="done" title="Confirmed" state={StepperStepState.COMPLETED}></StepperStep>
			</Stepper>

			<GeneralHeading>Content per step</GeneralHeading>
			<Description>Driven from the outside — the buttons move the stepper along.</Description>
			<Stepper activeStep={active} clickable={true} onStepChange={setActive}>
				<StepperStep uuid="details" title="Your details">
					<div className="blue-orange-stepper-development-panel">
						<Input label="Full name" placeholder="Tom"></Input>
					</div>
				</StepperStep>
				<StepperStep uuid="address" title="Address">
					<div className="blue-orange-stepper-development-panel">
						<Input label="Postcode" placeholder="SW1A 1AA"></Input>
					</div>
				</StepperStep>
				<StepperStep uuid="payment" title="Payment">
					<div className="blue-orange-stepper-development-panel">
						<Input label="Card number" isNumber={true}></Input>
					</div>
				</StepperStep>
			</Stepper>
			<div className="blue-orange-stepper-development-actions">
				<Button
					text="Back"
					buttonType={ButtonType.SECONDARY}
					size={ButtonSize.SMALL}
					isDisabled={activeIndex === 0}
					onClick={() => setActive(STEP_ORDER[Math.max(activeIndex - 1, 0)])}></Button>
				<Button
					text="Next"
					buttonType={ButtonType.PRIMARY}
					size={ButtonSize.SMALL}
					isDisabled={activeIndex === STEP_ORDER.length - 1}
					onClick={() => setActive(STEP_ORDER[Math.min(activeIndex + 1, STEP_ORDER.length - 1)])}></Button>
			</div>

			<GeneralHeading>Vertical</GeneralHeading>
			<div className="blue-orange-stepper-development-block">
				<Stepper
					orientation={StepperOrientation.VERTICAL}
					activeStep="address"
					showPanels={false}>
					<StepperStep uuid="details" title="Your details" description="Name and email"></StepperStep>
					<StepperStep uuid="address" title="Address" description="Where we deliver"></StepperStep>
					<StepperStep uuid="payment" title="Payment" description="Card or invoice"></StepperStep>
				</Stepper>
			</div>

			<GeneralHeading>Vertical with content</GeneralHeading>
			<Description>Each panel sits under the step it belongs to, with the rail running past it.</Description>
			<div className="blue-orange-stepper-development-block">
				<Stepper orientation={StepperOrientation.VERTICAL} activeStep={active} clickable={true} onStepChange={setActive}>
					<StepperStep uuid="details" title="Your details">
						<div className="blue-orange-stepper-development-panel">
							<Input label="Full name" placeholder="Tom"></Input>
						</div>
					</StepperStep>
					<StepperStep uuid="address" title="Address">
						<div className="blue-orange-stepper-development-panel">
							<Input label="Postcode" placeholder="SW1A 1AA"></Input>
						</div>
					</StepperStep>
					<StepperStep uuid="payment" title="Payment">
						<div className="blue-orange-stepper-development-panel">
							<Input label="Card number" isNumber={true}></Input>
						</div>
					</StepperStep>
				</Stepper>
			</div>

			<GeneralHeading>Disabled step</GeneralHeading>
			<Stepper activeStep="details" clickable={true} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment" disabled={true}></StepperStep>
			</Stepper>
		</ComponentDoc>
	)
}
