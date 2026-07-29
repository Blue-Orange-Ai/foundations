import React from 'react';
import {render, screen} from '@testing-library/react';
import {Timeline} from './Timeline';
import {TimelineItem} from '../timeline-item/TimelineItem';
import {TimelineTitle} from '../timeline-title/TimelineTitle';
import {TimelineDescription} from '../timeline-description/TimelineDescription';
import {TimelineTime} from '../timeline-time/TimelineTime';
import {TimelineAlign, TimelineItemState, TimelineOrientation} from './TimelineContext';

const renderTimeline = () => {
	return render(
		<Timeline>
			<TimelineItem>
				<TimelineTime>09:14</TimelineTime>
				<TimelineTitle>Uploaded</TimelineTitle>
				<TimelineDescription>A report was added.</TimelineDescription>
			</TimelineItem>
			<TimelineItem>
				<TimelineTitle>Indexing</TimelineTitle>
			</TimelineItem>
			<TimelineItem>
				<TimelineTitle>Ready</TimelineTitle>
			</TimelineItem>
		</Timeline>
	);
}

const items = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-timeline-item'));
}

const connectors = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-timeline-connector'));
}

const indicators = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-timeline-indicator'));
}

describe('Timeline', () => {

	it('renders an item per event', () => {
		const {container} = renderTimeline();
		expect(items(container).length).toBe(3);
	});

	it('renders the content of an event', () => {
		renderTimeline();
		expect(screen.getByText('Uploaded')).toBeInTheDocument();
		expect(screen.getByText('A report was added.')).toBeInTheDocument();
		expect(screen.getByText('09:14')).toBeInTheDocument();
	});

	it('stops the rail at the final marker', () => {
		const {container} = renderTimeline();
		expect(connectors(container).length).toBe(2);
	});

	it('draws no connector at all for a single event', () => {
		const {container} = render(
			<Timeline>
				<TimelineItem><TimelineTitle>Only</TimelineTitle></TimelineItem>
			</Timeline>
		);
		expect(connectors(container).length).toBe(0);
	});

	it('falls back to a plain dot when an event has no icon or state', () => {
		const {container} = renderTimeline();
		expect(indicators(container)[0].classList.contains('blue-orange-timeline-indicator-dot')).toBe(true);
	});

	it('colours the marker from the state of the event', () => {
		const {container} = render(
			<Timeline>
				<TimelineItem state={TimelineItemState.SUCCESS}><TimelineTitle>Done</TimelineTitle></TimelineItem>
				<TimelineItem state={TimelineItemState.ERROR}><TimelineTitle>Failed</TimelineTitle></TimelineItem>
			</Timeline>
		);
		expect(indicators(container)[0].classList.contains('blue-orange-timeline-indicator-success')).toBe(true);
		expect(indicators(container)[1].classList.contains('blue-orange-timeline-indicator-error')).toBe(true);
	});

	it('picks an icon for a state that does not name one', () => {
		const {container} = render(
			<Timeline>
				<TimelineItem state={TimelineItemState.SUCCESS}><TimelineTitle>Done</TimelineTitle></TimelineItem>
			</Timeline>
		);
		expect(container.querySelector('.ri-check-line')).toBeInTheDocument();
	});

	it('prefers the icon named on the event', () => {
		const {container} = render(
			<Timeline>
				<TimelineItem state={TimelineItemState.SUCCESS} icon="ri-git-commit-line">
					<TimelineTitle>Committed</TimelineTitle>
				</TimelineItem>
			</Timeline>
		);
		expect(container.querySelector('.ri-git-commit-line')).toBeInTheDocument();
		expect(container.querySelector('.ri-check-line')).toBeNull();
	});

	it('shows a spinner while an event is loading', () => {
		const {container} = render(
			<Timeline>
				<TimelineItem state={TimelineItemState.LOADING}><TimelineTitle>Running</TimelineTitle></TimelineItem>
			</Timeline>
		);
		expect(container.querySelector('.blue-orange-spinner')).toBeInTheDocument();
	});

	it('renders media in place of the marker', () => {
		const {container} = render(
			<Timeline>
				<TimelineItem media={<span>TS</span>}><TimelineTitle>Commented</TimelineTitle></TimelineItem>
			</Timeline>
		);
		expect(indicators(container)[0].classList.contains('blue-orange-timeline-indicator-media')).toBe(true);
		expect(screen.getByText('TS')).toBeInTheDocument();
	});

	it('renders a leading label', () => {
		renderTimeline();
		render(
			<Timeline>
				<TimelineItem leading="12 Jan"><TimelineTitle>Kick off</TimelineTitle></TimelineItem>
			</Timeline>
		);
		expect(screen.getByText('12 Jan')).toBeInTheDocument();
	});

	it('leaves the leading column out when there is no label', () => {
		const {container} = renderTimeline();
		expect(container.querySelector('.blue-orange-timeline-leading')).toBeNull();
	});

	it('lays the items out vertically by default', () => {
		const {container} = renderTimeline();
		expect(container.querySelector('.blue-orange-timeline')!.classList.contains('blue-orange-timeline-vertical')).toBe(true);
		expect(items(container)[0].classList.contains('blue-orange-timeline-item-vertical')).toBe(true);
	});

	it('lays the items out in a row when horizontal', () => {
		const {container} = render(
			<Timeline orientation={TimelineOrientation.HORIZONTAL}>
				<TimelineItem><TimelineTitle>One</TimelineTitle></TimelineItem>
				<TimelineItem><TimelineTitle>Two</TimelineTitle></TimelineItem>
			</Timeline>
		);
		expect(container.querySelector('.blue-orange-timeline')!.classList.contains('blue-orange-timeline-horizontal')).toBe(true);
		expect(items(container)[0].classList.contains('blue-orange-timeline-item-horizontal')).toBe(true);
	});

	it('swaps sides on every other item when alternating', () => {
		const {container} = render(
			<Timeline align={TimelineAlign.ALTERNATE}>
				<TimelineItem><TimelineTitle>One</TimelineTitle></TimelineItem>
				<TimelineItem><TimelineTitle>Two</TimelineTitle></TimelineItem>
				<TimelineItem><TimelineTitle>Three</TimelineTitle></TimelineItem>
			</Timeline>
		);
		const rendered = items(container);
		expect(rendered[0].classList.contains('blue-orange-timeline-item-alternate-right')).toBe(true);
		expect(rendered[1].classList.contains('blue-orange-timeline-item-alternate-left')).toBe(true);
		expect(rendered[2].classList.contains('blue-orange-timeline-item-alternate-right')).toBe(true);
	});

	it('puts the event opposite its leading label when alternating', () => {
		const {container} = render(
			<Timeline align={TimelineAlign.ALTERNATE}>
				<TimelineItem leading="Q1"><TimelineTitle>Launch</TimelineTitle></TimelineItem>
			</Timeline>
		);
		const item = items(container)[0];
		expect(item.querySelector('.blue-orange-timeline-side-start')!.textContent).toBe('Q1');
		expect(item.querySelector('.blue-orange-timeline-side-end')!.textContent).toBe('Launch');
	});

	it('never alternates a horizontal timeline', () => {
		const {container} = render(
			<Timeline orientation={TimelineOrientation.HORIZONTAL} align={TimelineAlign.ALTERNATE}>
				<TimelineItem><TimelineTitle>One</TimelineTitle></TimelineItem>
			</Timeline>
		);
		expect(container.querySelector('.blue-orange-timeline-item-alternate')).toBeNull();
	});

	it('renders a machine readable timestamp when one is given', () => {
		render(
			<Timeline>
				<TimelineItem>
					<TimelineTime dateTime="2026-07-29T09:14:00Z">09:14</TimelineTime>
				</TimelineItem>
			</Timeline>
		);
		expect(screen.getByText('09:14').closest('time')!.getAttribute('datetime')).toBe('2026-07-29T09:14:00Z');
	});

	it('renders an item on its own without a Timeline around it', () => {
		const {container} = render(
			<TimelineItem><TimelineTitle>Loose</TimelineTitle></TimelineItem>
		);
		expect(screen.getByText('Loose')).toBeInTheDocument();
		expect(items(container)[0].classList.contains('blue-orange-timeline-item-vertical')).toBe(true);
	});
});
