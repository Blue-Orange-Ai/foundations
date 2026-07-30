import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Stepper} from './Stepper';
import {StepperStep} from '../stepper-step/StepperStep';
import {
	StepperIndicatorVariant,
	StepperOrientation,
	StepperSize,
	StepperStepState,
	StepperTitlePlacement
} from './StepperTypes';

const renderStepper = (props: {
	activeStep?: string,
	clickable?: boolean,
	orientation?: StepperOrientation,
	titlePlacement?: StepperTitlePlacement,
	animatePanels?: boolean,
	onStepChange?: (uuid: string, index: number) => void
} = {}) => {
	return render(
		<Stepper
			activeStep={props.activeStep ?? 'address'}
			clickable={props.clickable}
			orientation={props.orientation}
			titlePlacement={props.titlePlacement}
			animatePanels={props.animatePanels}
			onStepChange={props.onStepChange}>
			<StepperStep uuid="details" title="Your details">
				<span>Details panel</span>
			</StepperStep>
			<StepperStep uuid="address" title="Address" description="Where we deliver">
				<span>Address panel</span>
			</StepperStep>
			<StepperStep uuid="payment" title="Payment">
				<span>Payment panel</span>
			</StepperStep>
		</Stepper>
	);
}

const indicators = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-stepper-indicator'));
}

const separators = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-stepper-separator'));
}

describe('Stepper', () => {

	it('renders a head per step', () => {
		renderStepper();
		expect(screen.getByText('Your details')).toBeInTheDocument();
		expect(screen.getByText('Address')).toBeInTheDocument();
		expect(screen.getByText('Payment')).toBeInTheDocument();
	});

	it('numbers the steps from one', () => {
		const {container} = renderStepper({activeStep: 'details'});
		expect(indicators(container).map(indicator => indicator.textContent)).toEqual(['1', '2', '3']);
	});

	it('marks the steps behind the active one as complete', () => {
		const {container} = renderStepper();
		expect(indicators(container)[0].classList.contains('blue-orange-stepper-indicator-completed')).toBe(true);
	});

	it('marks the active step', () => {
		const {container} = renderStepper();
		expect(indicators(container)[1].classList.contains('blue-orange-stepper-indicator-active')).toBe(true);
	});

	it('leaves the steps ahead of the active one pending', () => {
		const {container} = renderStepper();
		expect(indicators(container)[2].classList.contains('blue-orange-stepper-indicator-pending')).toBe(true);
	});

	it('shows a check on a completed step in place of its number', () => {
		const {container} = renderStepper();
		expect(indicators(container)[0].querySelector('.ri-check-line')).toBeInTheDocument();
	});

	it('fills the separator behind a completed step', () => {
		const {container} = renderStepper();
		const lines = separators(container);
		expect(lines[0].classList.contains('blue-orange-stepper-separator-completed')).toBe(true);
		expect(lines[1].classList.contains('blue-orange-stepper-separator-completed')).toBe(false);
	});

	it('marks the active step for screen readers', () => {
		renderStepper();
		const head = screen.getByText('Address').closest('.blue-orange-stepper-step-head')!;
		expect(head.getAttribute('aria-current')).toBe('step');
	});

	it('renders the description of a step', () => {
		renderStepper();
		expect(screen.getByText('Where we deliver')).toBeInTheDocument();
	});

	it('shows only the panel of the active step', () => {
		const {container} = renderStepper();
		const panels = Array.from(container.querySelectorAll('.blue-orange-stepper-panel'));
		const hidden = panels.filter(panel => panel.classList.contains('blue-orange-stepper-panel-hidden'));
		expect(panels.length).toBe(3);
		expect(hidden.length).toBe(2);
		expect(screen.getByText('Address panel').closest('.blue-orange-stepper-panel')!
			.classList.contains('blue-orange-stepper-panel-hidden')).toBe(false);
	});

	it('leaves the panels out when they are turned off', () => {
		const {container} = render(
			<Stepper activeStep="details" showPanels={false}>
				<StepperStep uuid="details" title="Your details">
					<span>Details panel</span>
				</StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper-panel')).toBeNull();
	});

	it('honours a state declared on a step over the one it would work out', () => {
		const {container} = render(
			<Stepper activeStep="details" showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address" state={StepperStepState.ERROR}></StepperStep>
			</Stepper>
		);
		expect(indicators(container)[1].classList.contains('blue-orange-stepper-indicator-error')).toBe(true);
		expect(indicators(container)[1].querySelector('.ri-close-line')).toBeInTheDocument();
	});

	it('shows a spinner on a loading step', () => {
		const {container} = render(
			<Stepper activeStep="details" showPanels={false}>
				<StepperStep uuid="details" title="Your details" state={StepperStepState.LOADING}></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-spinner')).toBeInTheDocument();
	});

	it('renders the icon of a step under the icon variant', () => {
		const {container} = render(
			<Stepper activeStep="details" indicator={StepperIndicatorVariant.ICON} showPanels={false}>
				<StepperStep uuid="details" title="Your details" icon="ri-user-4-line"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.ri-user-4-line')).toBeInTheDocument();
	});

	it('renders a bare dot under the dot variant', () => {
		const {container} = render(
			<Stepper activeStep="details" indicator={StepperIndicatorVariant.DOT} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
			</Stepper>
		);
		const indicator = indicators(container)[0];
		expect(indicator.classList.contains('blue-orange-stepper-indicator-dot')).toBe(true);
		expect(indicator.textContent).toBe('');
	});

	it('renders the badge of a step', () => {
		render(
			<Stepper activeStep="details" showPanels={false}>
				<StepperStep uuid="details" title="Payment" badge="Optional"></StepperStep>
			</Stepper>
		);
		expect(screen.getByText('Optional')).toBeInTheDocument();
	});

	it('ignores clicks unless it is clickable', () => {
		const onStepChange = vi.fn();
		renderStepper({onStepChange: onStepChange});
		fireEvent.click(screen.getByText('Payment'));
		expect(onStepChange).not.toHaveBeenCalled();
	});

	it('reports the step that was clicked when clickable', () => {
		const onStepChange = vi.fn();
		renderStepper({clickable: true, onStepChange: onStepChange});
		fireEvent.click(screen.getByText('Payment'));
		expect(onStepChange).toHaveBeenCalledWith('payment', 2);
	});

	it('never selects a disabled step', () => {
		const onStepChange = vi.fn();
		render(
			<Stepper activeStep="details" clickable={true} showPanels={false} onStepChange={onStepChange}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address" disabled={true}></StepperStep>
			</Stepper>
		);
		fireEvent.click(screen.getByText('Address'));
		expect(onStepChange).not.toHaveBeenCalled();
	});

	it('moves itself along when it is left uncontrolled', () => {
		const {container} = render(
			<Stepper clickable={true} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
			</Stepper>
		);
		expect(indicators(container)[0].classList.contains('blue-orange-stepper-indicator-active')).toBe(true);
		fireEvent.click(screen.getByText('Address'));
		expect(indicators(container)[1].classList.contains('blue-orange-stepper-indicator-active')).toBe(true);
	});

	it('follows the activeStep prop when it changes', () => {
		const {container, rerender} = renderStepper({activeStep: 'details'});
		expect(indicators(container)[0].classList.contains('blue-orange-stepper-indicator-active')).toBe(true);
		rerender(
			<Stepper activeStep="payment">
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment"></StepperStep>
			</Stepper>
		);
		expect(indicators(container)[2].classList.contains('blue-orange-stepper-indicator-active')).toBe(true);
	});

	it('draws one separator fewer than there are steps', () => {
		const {container} = renderStepper();
		expect(separators(container).length).toBe(2);
	});

	it('keeps the panel with its own step when vertical', () => {
		const {container} = renderStepper({orientation: StepperOrientation.VERTICAL});
		const rows = Array.from(container.querySelectorAll('.blue-orange-stepper-step-row'));
		expect(rows.length).toBe(3);
		// only the active step renders a panel, and it sits inside that step's row
		expect(container.querySelectorAll('.blue-orange-stepper-panel').length).toBe(1);
		expect(rows[1].querySelector('.blue-orange-stepper-panel')!.textContent).toBe('Address panel');
	});

	it('runs the text beside the indicator by default', () => {
		const {container} = renderStepper();
		expect(container.querySelector('.blue-orange-stepper')!
			.classList.contains('blue-orange-stepper-title-below')).toBe(false);
	});

	it('stacks the text under the indicator when asked', () => {
		const {container} = render(
			<Stepper activeStep="details" titlePlacement={StepperTitlePlacement.BELOW} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper')!
			.classList.contains('blue-orange-stepper-title-below')).toBe(true);
	});

	it('keeps the indicator in the head when the text is stacked', () => {
		const {container} = render(
			<Stepper activeStep="details" titlePlacement={StepperTitlePlacement.BELOW} showPanels={false}>
				<StepperStep uuid="details" title="Your details" description="Name and email"></StepperStep>
			</Stepper>
		);
		const head = screen.getByText('Your details').closest('.blue-orange-stepper-step-head')!;
		expect(head.querySelector('.blue-orange-stepper-indicator')).toBeInTheDocument();
		expect(screen.getByText('Name and email')).toBeInTheDocument();
	});

	it('ignores the stacked layout on a vertical stepper', () => {
		const {container} = render(
			<Stepper
				activeStep="details"
				orientation={StepperOrientation.VERTICAL}
				titlePlacement={StepperTitlePlacement.BELOW}
				showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper')!
			.classList.contains('blue-orange-stepper-title-below')).toBe(false);
	});

	it('carries no size class at the medium size', () => {
		const {container} = renderStepper();
		const stepper = container.querySelector('.blue-orange-stepper')!;
		expect(stepper.classList.contains('blue-orange-stepper-sm')).toBe(false);
		expect(stepper.classList.contains('blue-orange-stepper-lg')).toBe(false);
	});

	it('scales down at the small size', () => {
		const {container} = render(
			<Stepper activeStep="details" size={StepperSize.SMALL} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper')!.classList.contains('blue-orange-stepper-sm')).toBe(true);
	});

	it('scales up at the large size', () => {
		const {container} = render(
			<Stepper activeStep="details" size={StepperSize.LARGE} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper')!.classList.contains('blue-orange-stepper-lg')).toBe(true);
	});

	it('scales a vertical stepper too', () => {
		const {container} = render(
			<Stepper
				activeStep="details"
				size={StepperSize.SMALL}
				orientation={StepperOrientation.VERTICAL}
				showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper')!.classList.contains('blue-orange-stepper-sm')).toBe(true);
	});

	it('names only the active step under the caption placement', () => {
		const {container} = render(
			<Stepper activeStep="address" titlePlacement={StepperTitlePlacement.CAPTION} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper-caption-title')!.textContent).toBe('Address');
		expect(screen.queryByText('Your details')).toBeNull();
		expect(screen.queryByText('Payment')).toBeNull();
	});

	it('counts the steps in the caption', () => {
		const {container} = render(
			<Stepper activeStep="address" titlePlacement={StepperTitlePlacement.CAPTION} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper-caption-count')!.textContent).toContain('Step 2 of 3');
	});

	it('takes a custom counter', () => {
		const {container} = render(
			<Stepper
				activeStep="address"
				titlePlacement={StepperTitlePlacement.CAPTION}
				formatStepCount={(current, total) => current + ' / ' + total}
				showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper-caption-count')!.textContent).toContain('2 / 2');
	});

	it('keeps every indicator on the rail under the caption placement', () => {
		const {container} = render(
			<Stepper activeStep="address" titlePlacement={StepperTitlePlacement.CAPTION} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address"></StepperStep>
				<StepperStep uuid="payment" title="Payment"></StepperStep>
			</Stepper>
		);
		expect(indicators(container).length).toBe(3);
		expect(separators(container).length).toBe(2);
		expect(indicators(container)[1].classList.contains('blue-orange-stepper-indicator-active')).toBe(true);
	});

	it('shows the description and badge of the active step in the caption', () => {
		render(
			<Stepper activeStep="address" titlePlacement={StepperTitlePlacement.CAPTION} showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<StepperStep uuid="address" title="Address" description="Where we deliver" badge="Secure"></StepperStep>
			</Stepper>
		);
		expect(screen.getByText('Where we deliver')).toBeInTheDocument();
		expect(screen.getByText('Secure')).toBeInTheDocument();
	});

	it('still shows the panel of the active step under the caption placement', () => {
		renderStepper({titlePlacement: StepperTitlePlacement.CAPTION});
		expect(screen.getByText('Address panel').closest('.blue-orange-stepper-panel')!
			.classList.contains('blue-orange-stepper-panel-hidden')).toBe(false);
	});

	it('ignores the caption placement on a vertical stepper', () => {
		const {container} = render(
			<Stepper
				activeStep="details"
				orientation={StepperOrientation.VERTICAL}
				titlePlacement={StepperTitlePlacement.CAPTION}
				showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
			</Stepper>
		);
		expect(container.querySelector('.blue-orange-stepper-caption')).toBeNull();
		expect(screen.getByText('Your details')).toBeInTheDocument();
	});

	it('keeps every panel mounted when the vertical panels animate', () => {
		const {container} = renderStepper({orientation: StepperOrientation.VERTICAL, animatePanels: true});
		// all three are mounted, each in its own accordion, so the one being left
		// behind has something to collapse
		expect(container.querySelectorAll('.blue-orange-accordion').length).toBe(3);
		expect(container.querySelectorAll('.blue-orange-stepper-panel').length).toBe(3);
		expect(screen.getByText('Details panel')).toBeInTheDocument();
	});

	it('ignores the animation on a horizontal stepper', () => {
		const {container} = renderStepper({animatePanels: true});
		expect(container.querySelector('.blue-orange-accordion')).toBeNull();
	});

	it('ignores children that are not a StepperStep', () => {
		render(
			<Stepper activeStep="details" showPanels={false}>
				<StepperStep uuid="details" title="Your details"></StepperStep>
				<div>Rogue</div>
			</Stepper>
		);
		expect(screen.queryByText('Rogue')).toBeNull();
	});
});
