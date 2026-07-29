import React, {useState} from "react";

import './StepperDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
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
			showPanels={false}></Stepper>
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
		<PaddedPage>
			<PageHeading>Stepper</PageHeading>
			<Description>
				A step by step progress indicator. Each step works out whether it is pending, active
				or complete from where it sits relative to the active one — loading and error states
				can be pinned on a step directly.
			</Description>

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
		</PaddedPage>
	)
}
