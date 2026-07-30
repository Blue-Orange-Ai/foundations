import React, {useState} from "react";

import './WizardDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
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
		<PaddedPage>
			<PageHeading>Wizard</PageHeading>
			<Description>
				A staged flow with the stepper across the top, the stage underneath and the navigation
				at the bottom. A stage holds anything at all, and the flow can grow or shrink as it is
				filled in.
			</Description>

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
		</PaddedPage>
	)
}
