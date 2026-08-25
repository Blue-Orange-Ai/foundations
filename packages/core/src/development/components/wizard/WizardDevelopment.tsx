import React, {useState} from "react";

import './WizardDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Wizard, WizardOrientation} from "../../../components/wizard/wizard/Wizard";
import {WizardStage} from "../../../components/wizard/wizard-stage/WizardStage";
import {StepperSize, StepperTitlePlacement} from "../../../components/stepper/stepper/StepperTypes";
import {Input} from "../../../components/inputs/input/Input";
import {Checkbox} from "../../../components/inputs/checkbox/Checkbox";
import {Button, ButtonType} from "../../../components/buttons/button/Button";
import {Modal} from "../../../components/layouts/modal/modal/Modal";
import {ModalHeader} from "../../../components/layouts/modal/modal-header/ModalHeader";
import {ModalBody} from "../../../components/layouts/modal/modal-body/ModalBody";
import {SuccessBlockAlert} from "../../../components/alerts/in-line-block/successalert/SuccessBlockAlert";
import {InfoBlockAlert} from "../../../components/alerts/in-line-block/infoalert/InfoBlockAlert";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";
import {StepperIndicatorVariant, StepperStepState} from "../../../components/stepper/stepper/StepperTypes";

const WIZARD_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The WizardStage entries, in the order they are worked through."
	},
	{
		name: "activeStage",
		type: "string",
		control: "text",
		description: "The uuid of the stage being worked on. Setting it moves the wizard from the outside."
	},
	{
		name: "onStageChange",
		type: "(uuid: string, index: number) => void",
		description: "Fires with the stage that was moved to, and where it sits in the flow."
	},
	{
		name: "onComplete",
		type: "(uuid: string) => void",
		description: "Fires when the last stage is finished."
	},
	{
		name: "onCancel",
		type: "() => void",
		description: "Shows a cancel button in the footer when it is supplied, and fires when it is clicked."
	},
	{
		name: "orientation",
		type: "WizardOrientation",
		default: "WizardOrientation.HORIZONTAL",
		defaultValue: WizardOrientation.HORIZONTAL,
		control: "select",
		options: [
			{label: "Horizontal", value: WizardOrientation.HORIZONTAL, code: "WizardOrientation.HORIZONTAL"},
			{label: "Vertical", value: WizardOrientation.VERTICAL, code: "WizardOrientation.VERTICAL"}
		],
		description: "HORIZONTAL runs the stepper across the top with the stage under it; VERTICAL stacks the stages, each opening in place under its own step."
	},
	{
		name: "animateStages",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Vertical only. Opens the stage being worked on in place and closes the one before it, rather than swapping them outright."
	},
	{
		name: "showStepper",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the stepper. Off, the flow is just the stage and its footer."
	},
	{
		name: "stepperSize",
		type: "StepperSize",
		default: "StepperSize.MEDIUM",
		defaultValue: StepperSize.MEDIUM,
		control: "select",
		options: [
			{label: "Small", value: StepperSize.SMALL, code: "StepperSize.SMALL"},
			{label: "Medium", value: StepperSize.MEDIUM, code: "StepperSize.MEDIUM"},
			{label: "Large", value: StepperSize.LARGE, code: "StepperSize.LARGE"}
		],
		description: "Passed straight through to the stepper."
	},
	{
		name: "stepperIndicator",
		type: "StepperIndicatorVariant",
		default: "StepperIndicatorVariant.NUMBER",
		control: "select",
		options: [
			{label: "Number", value: StepperIndicatorVariant.NUMBER, code: "StepperIndicatorVariant.NUMBER"},
			{label: "Icon", value: StepperIndicatorVariant.ICON, code: "StepperIndicatorVariant.ICON"},
			{label: "Dot", value: StepperIndicatorVariant.DOT, code: "StepperIndicatorVariant.DOT"}
		],
		defaultValue: StepperIndicatorVariant.NUMBER,
		description: "What the circle at the head of each stage shows."
	},
	{
		name: "stepperTitlePlacement",
		type: "StepperTitlePlacement",
		default: "StepperTitlePlacement.INLINE",
		defaultValue: StepperTitlePlacement.INLINE,
		control: "select",
		options: [
			{label: "Inline", value: StepperTitlePlacement.INLINE, code: "StepperTitlePlacement.INLINE"},
			{label: "Below", value: StepperTitlePlacement.BELOW, code: "StepperTitlePlacement.BELOW"},
			{label: "Caption", value: StepperTitlePlacement.CAPTION, code: "StepperTitlePlacement.CAPTION"}
		],
		description: "Where the stage's text sits relative to its indicator. CAPTION is the one that fits a modal."
	},
	{
		name: "allowStageNavigation",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets a stage that has already been reached be jumped back to from the stepper."
	},
	{
		name: "showFooter",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the built in back / next footer."
	},
	{
		name: "footer",
		type: "React.ReactNode",
		description: "Replaces the built in footer, for a wizard that drives itself."
	},
	{
		name: "backLabel",
		type: "string",
		default: "\"Back\"",
		control: "text",
		description: "What the back button reads."
	},
	{
		name: "nextLabel",
		type: "string",
		default: "\"Next\"",
		control: "text",
		description: "What the next button reads."
	},
	{
		name: "finishLabel",
		type: "string",
		default: "\"Finish\"",
		control: "text",
		description: "What the next button reads on the last stage."
	},
	{
		name: "cancelLabel",
		type: "string",
		default: "\"Cancel\"",
		control: "text",
		description: "What the cancel button reads."
	},
	{
		name: "nextLoading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Shows the next button working, for instance while the stage is being saved."
	},
	{
		name: "unmountInactiveStages",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Throws away the stages that are not showing instead of hiding them. Their content starts fresh each time it is reached."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the wizard."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the wizard."
	},
	{
		name: "showCancel",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — hands the wizard an onCancel so the cancel button appears."
	}
];

const WIZARD_STAGE_PROPS: Array<PropSpec> = [
	{
		name: "uuid",
		type: "string",
		required: true,
		description: "Identifies the stage, and is what activeStage and onStageChange speak in."
	},
	{
		name: "title",
		type: "string",
		required: true,
		control: "text",
		value: "Details",
		description: "The stage's name, shown on the stepper."
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
		description: "A remixicon class, used by the icon indicator variant."
	},
	{
		name: "badge",
		type: "string",
		control: "text",
		description: "A short label next to the title, such as \"Optional\"."
	},
	{
		name: "enabled",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether the stage is part of the flow at all. Off, it is dropped from the stepper and skipped — this is how an answer earlier on adds or removes the stages that follow."
	},
	{
		name: "canProceed",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Blocks the next button until the stage is happy with its answers."
	},
	{
		name: "state",
		type: "StepperStepState",
		control: "select",
		options: [
			{label: "Pending", value: StepperStepState.PENDING, code: "StepperStepState.PENDING"},
			{label: "Active", value: StepperStepState.ACTIVE, code: "StepperStepState.ACTIVE"},
			{label: "Completed", value: StepperStepState.COMPLETED, code: "StepperStepState.COMPLETED"},
			{label: "Loading", value: StepperStepState.LOADING, code: "StepperStepState.LOADING"},
			{label: "Error", value: StepperStepState.ERROR, code: "StepperStepState.ERROR"}
		],
		description: "Pins the step to a state — leaving an error on a stage, for instance."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The stage's content. It is a plain container, so anything at all can go in it."
	}
];

interface Props {
}

export const WizardDevelopment: React.FC<Props> = ({}) => {

	const [name, setName] = useState("");

	const [isBusiness, setIsBusiness] = useState(false);

	const [needsShipping, setNeedsShipping] = useState(false);

	const [branchingStage, setBranchingStage] = useState("account");

	const [completed, setCompleted] = useState("");

	const [modalOpen, setModalOpen] = useState(false);

	return (
		<ComponentDoc
			title="Wizard"
			description="A staged flow with the stepper across the top, the stage underneath and the navigation at the bottom. A stage holds anything at all, and the flow can grow or shrink as it is filled in — turning a stage off drops it from the stepper and skips over it."
			name="Wizard"
			previewHeight={380}
			previewCentered={false}
			imports={["WizardStage", "WizardOrientation"]}
			props={WIZARD_PROPS}
			snippetChildren={() => "<WizardStage uuid={\"details\"} title={\"Details\"} description={\"Name and address\"}>\n\t<Input label={\"Name\"}></Input>\n</WizardStage>\n<WizardStage uuid={\"billing\"} title={\"Billing\"} canProceed={billingValid}>\n\t<Input label={\"Card number\"}></Input>\n</WizardStage>\n<WizardStage uuid={\"review\"} title={\"Review\"}>\n\t<p>Everything looks right.</p>\n</WizardStage>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<Wizard
						orientation={values.orientation}
						animateStages={values.animateStages}
						showStepper={values.showStepper}
						stepperSize={values.stepperSize}
						stepperIndicator={values.stepperIndicator}
						stepperTitlePlacement={values.stepperTitlePlacement}
						allowStageNavigation={values.allowStageNavigation}
						showFooter={values.showFooter}
						backLabel={values.backLabel}
						nextLabel={values.nextLabel}
						finishLabel={values.finishLabel}
						cancelLabel={values.cancelLabel}
						nextLoading={values.nextLoading}
						unmountInactiveStages={values.unmountInactiveStages}
						onCancel={values.showCancel ? () => {} : undefined}>
						<WizardStage uuid="details" title="Details" description="Name and address" icon="ri-user-line">
							<p>The details stage.</p>
						</WizardStage>
						<WizardStage uuid="billing" title="Billing" description="Card and plan" icon="ri-bank-card-line">
							<p>The billing stage.</p>
						</WizardStage>
						<WizardStage uuid="review" title="Review" icon="ri-check-line">
							<p>The review stage.</p>
						</WizardStage>
					</Wizard>
				</div>
			)}
			siblings={[
				{
					name: "WizardStage",
					description: "One stage of the flow. It renders nothing itself — the Wizard reads its props, and its children become the stage's content.",
					props: WIZARD_STAGE_PROPS,
					previewHeight: 300,
					previewCentered: false,
					imports: ["Wizard"],
					snippetChildren: () => "<p>The details stage.</p>",
					preview: values => (
						<div style={{width: "100%"}}>
							<Wizard>
								<WizardStage
									uuid="details"
									title={values.title}
									description={values.description}
									icon={values.icon}
									badge={values.badge}
									enabled={values.enabled}
									canProceed={values.canProceed}
									state={values.state}>
									<p>The details stage.</p>
								</WizardStage>
								<WizardStage uuid="review" title="Review">
									<p>The review stage.</p>
								</WizardStage>
							</Wizard>
						</div>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<div className="blue-orange-wizard-development-block">
				<Wizard onComplete={(uuid) => setCompleted("Finished on " + uuid)}>
					<WizardStage uuid="details" title="Details">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Full name" placeholder="Tom"></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="address" title="Address">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Postcode" placeholder="SW1A 1AA"></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="review" title="Review">
						<div className="blue-orange-wizard-development-panel">
							<SuccessBlockAlert
								title="Ready to submit"
								description="Check the details above, then finish."></SuccessBlockAlert>
						</div>
					</WizardStage>
				</Wizard>
			</div>
			<Description>{completed ? completed : "Not finished yet."}</Description>

			<GeneralHeading>Stages that depend on the answers</GeneralHeading>
			<Description>
				Turning either of these on adds a stage to the flow, and the stepper re-numbers itself
				around the stage being worked on. Turning one off again drops the stage.
			</Description>
			<div className="blue-orange-wizard-development-answers">
				<div className="blue-orange-wizard-development-answer">
					<Checkbox checked={isBusiness} onCheckboxChange={setIsBusiness}></Checkbox>
					<span>This is a business account</span>
				</div>
				<div className="blue-orange-wizard-development-answer">
					<Checkbox checked={needsShipping} onCheckboxChange={setNeedsShipping}></Checkbox>
					<span>Ship physical goods</span>
				</div>
			</div>
			<div className="blue-orange-wizard-development-block">
				<Wizard
					activeStage={branchingStage}
					onStageChange={setBranchingStage}
					onComplete={() => setCompleted("Finished the branching wizard")}>
					<WizardStage uuid="account" title="Account" icon="ri-user-4-line">
						<div className="blue-orange-wizard-development-panel">
							<InfoBlockAlert description="Tick a box above to add a stage to this wizard."></InfoBlockAlert>
						</div>
					</WizardStage>
					<WizardStage uuid="company" title="Company" icon="ri-building-line" enabled={isBusiness}>
						<div className="blue-orange-wizard-development-panel">
							<Input label="Company name" placeholder="Blue Orange AI"></Input>
							<Input label="VAT number" placeholder="GB123456789"></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="shipping" title="Shipping" icon="ri-truck-line" enabled={needsShipping} badge="Optional">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Delivery address" placeholder="1 Example Street"></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="payment" title="Payment" icon="ri-bank-card-line">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Card number" isNumber={true}></Input>
						</div>
					</WizardStage>
				</Wizard>
			</div>

			<GeneralHeading>Blocking the next button</GeneralHeading>
			<Description>A stage that is not happy with its answers holds the flow with canProceed.</Description>
			<div className="blue-orange-wizard-development-block">
				<Wizard>
					<WizardStage uuid="name" title="Your name" canProceed={name.trim().length > 0}>
						<div className="blue-orange-wizard-development-panel">
							<Input
								label="Full name"
								value={name}
								placeholder="Type something to unblock next"
								onChange={setName}></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="done" title="Done">
						<div className="blue-orange-wizard-development-panel">
							<SuccessBlockAlert description={"Thanks " + name + "."}></SuccessBlockAlert>
						</div>
					</WizardStage>
				</Wizard>
			</div>

			<GeneralHeading>Titles under the indicators</GeneralHeading>
			<div className="blue-orange-wizard-development-block">
				<Wizard
					stepperTitlePlacement={StepperTitlePlacement.BELOW}
					stepperSize={StepperSize.MEDIUM}
					onCancel={() => setCompleted("Cancelled")}>
					<WizardStage uuid="plan" title="Choose a plan" description="Monthly or yearly">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Seats" isNumber={true}></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="billing" title="Billing" description="Card or invoice">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Billing email" isEmail={true}></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="confirm" title="Confirm" description="Check and go">
						<div className="blue-orange-wizard-development-panel">
							<SuccessBlockAlert description="All set."></SuccessBlockAlert>
						</div>
					</WizardStage>
				</Wizard>
			</div>

			<GeneralHeading>Vertical</GeneralHeading>
			<Description>
				The stages stack and each one opens in place under its own step, closing the one before
				it as it goes. Adding and removing stages works exactly as it does across the top.
			</Description>
			<div className="blue-orange-wizard-development-block">
				<Wizard
					orientation={WizardOrientation.VERTICAL}
					onComplete={() => setCompleted("Finished the vertical wizard")}>
					<WizardStage uuid="details" title="Your details" description="Name and email">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Full name" placeholder="Tom"></Input>
							<Input label="Email" isEmail={true}></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="address" title="Address" description="Where we deliver">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Postcode" placeholder="SW1A 1AA"></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="payment" title="Payment" description="Card or invoice">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Card number" isNumber={true}></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="review" title="Review" description="Check and finish">
						<div className="blue-orange-wizard-development-panel">
							<SuccessBlockAlert description="Everything looks right."></SuccessBlockAlert>
						</div>
					</WizardStage>
				</Wizard>
			</div>

			<GeneralHeading>Vertical without the animation</GeneralHeading>
			<Description>The stages swap over outright instead of opening and closing.</Description>
			<div className="blue-orange-wizard-development-block">
				<Wizard orientation={WizardOrientation.VERTICAL} animateStages={false}>
					<WizardStage uuid="details" title="Your details">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Full name" placeholder="Tom"></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="address" title="Address">
						<div className="blue-orange-wizard-development-panel">
							<Input label="Postcode" placeholder="SW1A 1AA"></Input>
						</div>
					</WizardStage>
					<WizardStage uuid="review" title="Review">
						<div className="blue-orange-wizard-development-panel">
							<SuccessBlockAlert description="Ready."></SuccessBlockAlert>
						</div>
					</WizardStage>
				</Wizard>
			</div>

			<GeneralHeading>In a modal</GeneralHeading>
			<Description>The caption stepper keeps the header narrow however many stages there are.</Description>
			<Button
				text="Open wizard"
				buttonType={ButtonType.SECONDARY}
				onClick={() => setModalOpen(true)}></Button>
			<Modal open={modalOpen} width={460} onClose={() => setModalOpen(false)}>
				<ModalHeader label="Add a customer" onClose={() => setModalOpen(false)}></ModalHeader>
				<ModalBody>
					<Wizard
						stepperTitlePlacement={StepperTitlePlacement.CAPTION}
						stepperSize={StepperSize.SMALL}
						onCancel={() => setModalOpen(false)}
						onComplete={() => setModalOpen(false)}>
						<WizardStage uuid="details" title="Details">
							<Input label="Full name" placeholder="Tom"></Input>
						</WizardStage>
						<WizardStage uuid="address" title="Address">
							<Input label="Postcode" placeholder="SW1A 1AA"></Input>
						</WizardStage>
						<WizardStage uuid="payment" title="Payment">
							<Input label="Card number" isNumber={true}></Input>
						</WizardStage>
						<WizardStage uuid="review" title="Review">
							<SuccessBlockAlert description="Finish to add the customer."></SuccessBlockAlert>
						</WizardStage>
					</Wizard>
				</ModalBody>
			</Modal>
		</ComponentDoc>
	)
}
