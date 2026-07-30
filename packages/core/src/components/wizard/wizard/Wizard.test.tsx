import React, {useState} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Wizard} from './Wizard';
import {WizardStage} from '../wizard-stage/WizardStage';
import {WizardOrientation} from './Wizard';
import {StepperTitlePlacement} from '../../stepper/stepper/StepperTypes';

const renderWizard = (props: {
	onComplete?: (uuid: string) => void,
	onStageChange?: (uuid: string, index: number) => void,
	onCancel?: () => void
} = {}) => {
	return render(
		<Wizard onComplete={props.onComplete} onStageChange={props.onStageChange} onCancel={props.onCancel}>
			<WizardStage uuid="details" title="Details">
				<span>Details content</span>
			</WizardStage>
			<WizardStage uuid="address" title="Address">
				<span>Address content</span>
			</WizardStage>
			<WizardStage uuid="review" title="Review">
				<span>Review content</span>
			</WizardStage>
		</Wizard>
	);
}

const stagePanel = (container: HTMLElement, text: string) => {
	return screen.getByText(text).closest('.blue-orange-wizard-stage')!;
}

const isShowing = (container: HTMLElement, text: string) => {
	return !stagePanel(container, text).classList.contains('blue-orange-wizard-stage-hidden');
}

const indicators = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-stepper-indicator'));
}

describe('Wizard', () => {

	it('renders the stepper above the stages', () => {
		const {container} = renderWizard();
		const wizard = container.querySelector('.blue-orange-wizard')!;
		expect(wizard.children[0].classList.contains('blue-orange-wizard-header')).toBe(true);
		expect(wizard.querySelector('.blue-orange-stepper')).toBeInTheDocument();
	});

	it('puts a step on the stepper per stage', () => {
		const {container} = renderWizard();
		expect(indicators(container).length).toBe(3);
		expect(screen.getByText('Details')).toBeInTheDocument();
		expect(screen.getByText('Review')).toBeInTheDocument();
	});

	it('starts on the first stage', () => {
		const {container} = renderWizard();
		expect(isShowing(container, 'Details content')).toBe(true);
		expect(isShowing(container, 'Address content')).toBe(false);
	});

	it('keeps the stages that are not showing mounted', () => {
		const {container} = renderWizard();
		expect(screen.getByText('Review content')).toBeInTheDocument();
		expect(isShowing(container, 'Review content')).toBe(false);
	});

	it('drops the stages that are not showing when asked', () => {
		render(
			<Wizard unmountInactiveStages={true}>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
				<WizardStage uuid="address" title="Address"><span>Address content</span></WizardStage>
			</Wizard>
		);
		expect(screen.queryByText('Address content')).toBeNull();
	});

	it('moves on with the next button', () => {
		const {container} = renderWizard();
		fireEvent.click(screen.getByText('Next'));
		expect(isShowing(container, 'Address content')).toBe(true);
		expect(isShowing(container, 'Details content')).toBe(false);
	});

	it('moves back with the back button', () => {
		const {container} = renderWizard();
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Back'));
		expect(isShowing(container, 'Details content')).toBe(true);
	});

	it('disables back on the first stage', () => {
		renderWizard();
		expect(screen.getByText('Back').closest('.foundations-default-btn')!
			.classList.contains('foundations-default-btn-disabled')).toBe(true);
	});

	it('reports every move', () => {
		const onStageChange = vi.fn();
		renderWizard({onStageChange: onStageChange});
		fireEvent.click(screen.getByText('Next'));
		expect(onStageChange).toHaveBeenCalledWith('address', 1);
	});

	it('turns next into finish on the last stage', () => {
		renderWizard();
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Finish')).toBeInTheDocument();
	});

	it('completes on the last stage', () => {
		const onComplete = vi.fn();
		renderWizard({onComplete: onComplete});
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Finish'));
		expect(onComplete).toHaveBeenCalledWith('review');
	});

	it('shows a cancel button only when it can cancel', () => {
		renderWizard();
		expect(screen.queryByText('Cancel')).toBeNull();
		const onCancel = vi.fn();
		renderWizard({onCancel: onCancel});
		fireEvent.click(screen.getByText('Cancel'));
		expect(onCancel).toHaveBeenCalled();
	});

	it('blocks next while a stage is not happy', () => {
		const {container} = render(
			<Wizard>
				<WizardStage uuid="details" title="Details" canProceed={false}>
					<span>Details content</span>
				</WizardStage>
				<WizardStage uuid="address" title="Address"><span>Address content</span></WizardStage>
			</Wizard>
		);
		fireEvent.click(screen.getByText('Next'));
		expect(isShowing(container, 'Details content')).toBe(true);
	});

	it('leaves a stage that is switched off out of the flow', () => {
		const {container} = render(
			<Wizard>
				<WizardStage uuid="account" title="Account"><span>Account content</span></WizardStage>
				<WizardStage uuid="company" title="Company" enabled={false}><span>Company content</span></WizardStage>
				<WizardStage uuid="payment" title="Payment"><span>Payment content</span></WizardStage>
			</Wizard>
		);
		expect(indicators(container).length).toBe(2);
		expect(screen.queryByText('Company content')).toBeNull();
		fireEvent.click(screen.getByText('Next'));
		expect(isShowing(container, 'Payment content')).toBe(true);
	});

	it('adds a stage in the middle of the flow without moving off the current one', () => {
		const Branching: React.FC = () => {
			const [business, setBusiness] = useState(false);
			return (
				<>
					<button onClick={() => setBusiness(true)}>Add stage</button>
					<Wizard>
						<WizardStage uuid="account" title="Account"><span>Account content</span></WizardStage>
						<WizardStage uuid="company" title="Company" enabled={business}>
							<span>Company content</span>
						</WizardStage>
						<WizardStage uuid="payment" title="Payment"><span>Payment content</span></WizardStage>
					</Wizard>
				</>
			)
		};
		const {container} = render(<Branching/>);
		expect(indicators(container).length).toBe(2);

		fireEvent.click(screen.getByText('Add stage'));

		// the new stage joins the stepper and the wizard stays where it was
		expect(indicators(container).length).toBe(3);
		expect(isShowing(container, 'Account content')).toBe(true);

		// and the flow now walks through it
		fireEvent.click(screen.getByText('Next'));
		expect(isShowing(container, 'Company content')).toBe(true);
	});

	it('falls back when the stage being worked on is taken out of the flow', () => {
		const Branching: React.FC = () => {
			const [shipping, setShipping] = useState(true);
			return (
				<>
					<button onClick={() => setShipping(false)}>Remove stage</button>
					<Wizard>
						<WizardStage uuid="account" title="Account"><span>Account content</span></WizardStage>
						<WizardStage uuid="shipping" title="Shipping" enabled={shipping}>
							<span>Shipping content</span>
						</WizardStage>
						<WizardStage uuid="payment" title="Payment"><span>Payment content</span></WizardStage>
					</Wizard>
				</>
			)
		};
		const {container} = render(<Branching/>);
		fireEvent.click(screen.getByText('Next'));
		expect(isShowing(container, 'Shipping content')).toBe(true);

		fireEvent.click(screen.getByText('Remove stage'));

		// the stage it was standing on is gone, so it lands on what took its place
		expect(screen.queryByText('Shipping content')).toBeNull();
		expect(isShowing(container, 'Payment content')).toBe(true);
	});

	it('follows the activeStage prop when it changes', () => {
		const {container, rerender} = render(
			<Wizard activeStage="details">
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
				<WizardStage uuid="review" title="Review"><span>Review content</span></WizardStage>
			</Wizard>
		);
		expect(isShowing(container, 'Details content')).toBe(true);
		rerender(
			<Wizard activeStage="review">
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
				<WizardStage uuid="review" title="Review"><span>Review content</span></WizardStage>
			</Wizard>
		);
		expect(isShowing(container, 'Review content')).toBe(true);
	});

	it('lets a stage that has been reached be jumped back to', () => {
		const {container} = renderWizard();
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Details'));
		expect(isShowing(container, 'Details content')).toBe(true);
	});

	it('never jumps ahead to a stage that has not been reached', () => {
		const {container} = renderWizard();
		fireEvent.click(screen.getByText('Review'));
		expect(isShowing(container, 'Details content')).toBe(true);
	});

	it('never jumps at all when navigation is turned off', () => {
		const {container} = render(
			<Wizard allowStageNavigation={false}>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
				<WizardStage uuid="address" title="Address"><span>Address content</span></WizardStage>
			</Wizard>
		);
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Details'));
		expect(isShowing(container, 'Address content')).toBe(true);
	});

	it('hides the stepper when asked', () => {
		const {container} = render(
			<Wizard showStepper={false}>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
			</Wizard>
		);
		expect(container.querySelector('.blue-orange-stepper')).toBeNull();
		expect(screen.getByText('Details content')).toBeInTheDocument();
	});

	it('hides the footer when asked', () => {
		render(
			<Wizard showFooter={false}>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
			</Wizard>
		);
		expect(screen.queryByText('Next')).toBeNull();
	});

	it('takes a footer of its own', () => {
		render(
			<Wizard footer={<button>Save draft</button>}>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
			</Wizard>
		);
		expect(screen.getByText('Save draft')).toBeInTheDocument();
		expect(screen.queryByText('Next')).toBeNull();
	});

	it('takes its own button labels', () => {
		renderWizard();
		render(
			<Wizard backLabel="Previous" nextLabel="Continue">
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
				<WizardStage uuid="review" title="Review"><span>Review content</span></WizardStage>
			</Wizard>
		);
		expect(screen.getByText('Continue')).toBeInTheDocument();
		expect(screen.getByText('Previous')).toBeInTheDocument();
	});

	it('passes the stepper layout through', () => {
		const {container} = render(
			<Wizard stepperTitlePlacement={StepperTitlePlacement.CAPTION}>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
				<WizardStage uuid="review" title="Review"><span>Review content</span></WizardStage>
			</Wizard>
		);
		expect(container.querySelector('.blue-orange-stepper-caption-title')!.textContent).toBe('Details');
	});

	it('ignores children that are not a WizardStage', () => {
		render(
			<Wizard>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
				<div>Rogue</div>
			</Wizard>
		);
		expect(screen.queryByText('Rogue')).toBeNull();
	});
});

describe('Wizard - vertical', () => {

	// The panels are opened by animating max-height up to the natural height of
	// the content. jsdom lays nothing out, so every element reports a scroll
	// height of zero and an open panel would look shut — stub it for these.
	beforeEach(() => {
		Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {configurable: true, value: 200});
	});

	afterEach(() => {
		delete (HTMLElement.prototype as any).scrollHeight;
	});

	const renderVertical = (props: {animateStages?: boolean, unmountInactiveStages?: boolean} = {}) => {
		return render(
			<Wizard
				orientation={WizardOrientation.VERTICAL}
				animateStages={props.animateStages}
				unmountInactiveStages={props.unmountInactiveStages}>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
				<WizardStage uuid="address" title="Address"><span>Address content</span></WizardStage>
				<WizardStage uuid="review" title="Review"><span>Review content</span></WizardStage>
			</Wizard>
		);
	}

	const accordionOf = (text: string) => {
		return screen.getByText(text).closest('.blue-orange-accordion')!;
	}

	const openHeight = (text: string) => {
		return (accordionOf(text).querySelector('.blue-orange-accordion-body') as HTMLElement).style.maxHeight;
	}

	it('runs the stages down the page when vertical', () => {
		const {container} = renderVertical();
		expect(container.querySelector('.blue-orange-wizard')!
			.classList.contains('blue-orange-wizard-vertical')).toBe(true);
		expect(container.querySelector('.blue-orange-stepper-vertical')).toBeInTheDocument();
	});

	it('opens each stage under its own step when vertical', () => {
		const {container} = renderVertical();
		const rows = Array.from(container.querySelectorAll('.blue-orange-stepper-step-row'));
		expect(rows.length).toBe(3);
		expect(rows[0].querySelector('.blue-orange-wizard-stage')).toBeInTheDocument();
	});

	it('keeps every stage mounted so it can open and close them', () => {
		renderVertical();
		expect(screen.getByText('Details content')).toBeInTheDocument();
		expect(screen.getByText('Address content')).toBeInTheDocument();
		expect(screen.getByText('Review content')).toBeInTheDocument();
	});

	it('opens the stage being worked on and closes the rest', () => {
		renderVertical();
		expect(openHeight('Details content')).toBe('200px');
		expect(openHeight('Address content')).toBe('0px');
		expect(openHeight('Review content')).toBe('0px');
	});

	it('closes the stage behind it as the next one opens', () => {
		renderVertical();
		fireEvent.click(screen.getByText('Next'));
		expect(openHeight('Details content')).toBe('0px');
		expect(openHeight('Address content')).toBe('200px');
	});

	it('opens the stage again on the way back', () => {
		renderVertical();
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Back'));
		expect(openHeight('Details content')).toBe('200px');
		expect(openHeight('Address content')).toBe('0px');
	});

	it('swaps the stages outright when the animation is turned off', () => {
		const {container} = renderVertical({animateStages: false});
		expect(container.querySelector('.blue-orange-accordion')).toBeNull();
		expect(screen.getByText('Details content')).toBeInTheDocument();
		expect(screen.queryByText('Address content')).toBeNull();
	});

	it('never animates stages it has been told to throw away', () => {
		const {container} = renderVertical({unmountInactiveStages: true});
		expect(container.querySelector('.blue-orange-accordion')).toBeNull();
		expect(screen.queryByText('Address content')).toBeNull();
	});

	it('keeps its footer under the stages when vertical', () => {
		const {container} = renderVertical();
		const wizard = container.querySelector('.blue-orange-wizard')!;
		expect(wizard.children[wizard.children.length - 1].classList.contains('blue-orange-wizard-footer')).toBe(true);
		expect(screen.getByText('Next')).toBeInTheDocument();
	});

	it('still adds and drops stages when vertical', () => {
		const Branching: React.FC = () => {
			const [business, setBusiness] = useState(false);
			return (
				<>
					<button onClick={() => setBusiness(true)}>Add stage</button>
					<Wizard orientation={WizardOrientation.VERTICAL}>
						<WizardStage uuid="account" title="Account"><span>Account content</span></WizardStage>
						<WizardStage uuid="company" title="Company" enabled={business}>
							<span>Company content</span>
						</WizardStage>
						<WizardStage uuid="payment" title="Payment"><span>Payment content</span></WizardStage>
					</Wizard>
				</>
			)
		};
		const {container} = render(<Branching/>);
		expect(container.querySelectorAll('.blue-orange-stepper-step-row').length).toBe(2);
		fireEvent.click(screen.getByText('Add stage'));
		expect(container.querySelectorAll('.blue-orange-stepper-step-row').length).toBe(3);
		expect(openHeight('Account content')).toBe('200px');
	});

	it('falls back to the plain stages when vertical without a stepper', () => {
		const {container} = render(
			<Wizard orientation={WizardOrientation.VERTICAL} showStepper={false}>
				<WizardStage uuid="details" title="Details"><span>Details content</span></WizardStage>
			</Wizard>
		);
		expect(container.querySelector('.blue-orange-stepper')).toBeNull();
		expect(screen.getByText('Details content')).toBeInTheDocument();
	});
});
