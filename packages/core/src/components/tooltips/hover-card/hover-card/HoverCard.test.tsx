import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {HoverCard} from './HoverCard';
import {HoverCardTrigger} from '../hover-card-trigger/HoverCardTrigger';
import {HoverCardContent} from '../hover-card-content/HoverCardContent';

const renderHoverCard = (openDelay: number = 0, closeDelay: number = 0) => {
	return render(
		<HoverCard openDelay={openDelay} closeDelay={closeDelay}>
			<HoverCardTrigger><span>Trigger</span></HoverCardTrigger>
			<HoverCardContent><span>Card body</span></HoverCardContent>
		</HoverCard>
	);
}

const triggerContainer = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-hover-card-trigger-cont')!;
}

describe('HoverCard', () => {

	beforeEach(() => {
		vi.useFakeTimers({shouldAdvanceTime: true});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const settleTimers = () => {
		act(() => {
			vi.runOnlyPendingTimers();
		});
	}

	it('renders the trigger and keeps the card closed', () => {
		renderHoverCard();
		expect(screen.getByText('Trigger')).toBeInTheDocument();
		expect(screen.queryByText('Card body')).toBeNull();
	});

	it('opens when the trigger is hovered', () => {
		const {container} = renderHoverCard();
		fireEvent.mouseEnter(triggerContainer(container));
		settleTimers();
		expect(screen.getByText('Card body')).toBeInTheDocument();
	});

	it('closes when the pointer leaves the trigger', () => {
		const {container} = renderHoverCard();
		fireEvent.mouseEnter(triggerContainer(container));
		settleTimers();
		fireEvent.mouseLeave(triggerContainer(container));
		settleTimers();
		expect(screen.queryByText('Card body')).toBeNull();
	});

	it('waits out the open delay before opening', () => {
		const {container} = renderHoverCard(400);
		fireEvent.mouseEnter(triggerContainer(container));
		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(screen.queryByText('Card body')).toBeNull();
		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(screen.getByText('Card body')).toBeInTheDocument();
	});

	it('never opens once the pointer leaves inside the delay', () => {
		const {container} = renderHoverCard(400);
		fireEvent.mouseEnter(triggerContainer(container));
		fireEvent.mouseLeave(triggerContainer(container));
		settleTimers();
		expect(screen.queryByText('Card body')).toBeNull();
	});

	it('opens when the trigger takes focus', () => {
		const {container} = renderHoverCard();
		fireEvent.focus(triggerContainer(container));
		settleTimers();
		expect(screen.getByText('Card body')).toBeInTheDocument();
	});

	it('stays open while the pointer is over the card', () => {
		const {container} = renderHoverCard(0, 200);
		fireEvent.mouseEnter(triggerContainer(container));
		settleTimers();
		fireEvent.mouseLeave(triggerContainer(container));
		fireEvent.mouseEnter(container.querySelector('.blue-orange-hover-card-panel')!);
		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(screen.getByText('Card body')).toBeInTheDocument();
	});

	it('never opens when disabled', () => {
		const {container} = render(
			<HoverCard openDelay={0} disabled={true}>
				<HoverCardTrigger><span>Trigger</span></HoverCardTrigger>
				<HoverCardContent><span>Card body</span></HoverCardContent>
			</HoverCard>
		);
		fireEvent.mouseEnter(triggerContainer(container));
		settleTimers();
		expect(screen.queryByText('Card body')).toBeNull();
	});

	it('follows the open prop when it is controlled', () => {
		const {rerender} = render(
			<HoverCard open={false}>
				<HoverCardTrigger><span>Trigger</span></HoverCardTrigger>
				<HoverCardContent><span>Card body</span></HoverCardContent>
			</HoverCard>
		);
		expect(screen.queryByText('Card body')).toBeNull();
		rerender(
			<HoverCard open={true}>
				<HoverCardTrigger><span>Trigger</span></HoverCardTrigger>
				<HoverCardContent><span>Card body</span></HoverCardContent>
			</HoverCard>
		);
		expect(screen.getByText('Card body')).toBeInTheDocument();
	});

	it('reports the state it wants to move to', () => {
		const onOpenChange = vi.fn();
		const {container} = render(
			<HoverCard openDelay={0} onOpenChange={onOpenChange}>
				<HoverCardTrigger><span>Trigger</span></HoverCardTrigger>
				<HoverCardContent><span>Card body</span></HoverCardContent>
			</HoverCard>
		);
		fireEvent.mouseEnter(triggerContainer(container));
		settleTimers();
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('ignores children that are not a trigger or content', () => {
		const {container} = render(
			<HoverCard openDelay={0}>
				<HoverCardTrigger><span>Trigger</span></HoverCardTrigger>
				<div>Rogue</div>
				<HoverCardContent><span>Card body</span></HoverCardContent>
			</HoverCard>
		);
		fireEvent.mouseEnter(triggerContainer(container));
		settleTimers();
		expect(screen.queryByText('Rogue')).toBeNull();
	});
});
