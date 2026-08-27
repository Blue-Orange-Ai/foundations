import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {FilterPills, FilterPillsSize} from './FilterPills';
import {FilterPill} from '../filter-pill/FilterPill';

const renderPills = (onClick: (status: string) => void = () => {}) => {
	return render(
		<FilterPills label="Filter change requests by status">
			<FilterPill label="All" count={10} active={true} onClick={() => onClick("all")}></FilterPill>
			<FilterPill label="Open" count={0} onClick={() => onClick("open")}></FilterPill>
			<FilterPill label="Approved" count={10} onClick={() => onClick("approved")}></FilterPill>
			<FilterPill label="Rejected" count={0} onClick={() => onClick("rejected")}></FilterPill>
		</FilterPills>
	);
}

const pills = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-filter-pill')) as Array<HTMLButtonElement>;
}

describe('FilterPills', () => {

	it('renders a pill per filter', () => {
		const {container} = renderPills();
		expect(pills(container).length).toBe(4);
		expect(screen.getByText('All')).toBeInTheDocument();
		expect(screen.getByText('Rejected')).toBeInTheDocument();
	});

	it('names the set for a screen reader', () => {
		renderPills();
		expect(screen.getByLabelText('Filter change requests by status')).toHaveAttribute('role', 'tablist');
	});

	it('marks only the selected pill as selected', () => {
		const {container} = renderPills();
		expect(pills(container).map(pill => pill.getAttribute('aria-selected')))
			.toEqual(['true', 'false', 'false', 'false']);
	});

	it('reports the filter that was picked', () => {
		const onClick = vi.fn();
		renderPills(onClick);
		fireEvent.click(screen.getByText('Approved'));
		expect(onClick).toHaveBeenCalledWith('approved');
	});

	it('keeps the set to one tab stop', () => {
		const {container} = renderPills();
		expect(pills(container).map(pill => pill.tabIndex)).toEqual([0, -1, -1, -1]);
	});

	it('makes the first pill reachable when nothing is selected', () => {
		const {container} = render(
			<FilterPills>
				<FilterPill label="Open"></FilterPill>
				<FilterPill label="Closed"></FilterPill>
			</FilterPills>
		);
		expect(pills(container).map(pill => pill.tabIndex)).toEqual([0, -1]);
	});

	it('moves between the pills with the arrow keys', () => {
		const {container} = renderPills();
		pills(container)[0].focus();
		fireEvent.keyDown(pills(container)[0], {key: 'ArrowRight'});
		expect(document.activeElement).toBe(pills(container)[1]);
		fireEvent.keyDown(pills(container)[1], {key: 'ArrowLeft'});
		expect(document.activeElement).toBe(pills(container)[0]);
	});

	it('wraps around the ends of the set', () => {
		const {container} = renderPills();
		pills(container)[0].focus();
		fireEvent.keyDown(pills(container)[0], {key: 'ArrowLeft'});
		expect(document.activeElement).toBe(pills(container)[3]);
	});

	it('jumps to the first and last pill', () => {
		const {container} = renderPills();
		pills(container)[1].focus();
		fireEvent.keyDown(pills(container)[1], {key: 'End'});
		expect(document.activeElement).toBe(pills(container)[3]);
		fireEvent.keyDown(pills(container)[3], {key: 'Home'});
		expect(document.activeElement).toBe(pills(container)[0]);
	});

	it('never selects a pill just for arrowing onto it', () => {
		const onClick = vi.fn();
		const {container} = renderPills(onClick);
		pills(container)[0].focus();
		fireEvent.keyDown(pills(container)[0], {key: 'ArrowRight'});
		expect(onClick).not.toHaveBeenCalled();
	});

	it('skips a disabled pill when moving', () => {
		const {container} = render(
			<FilterPills>
				<FilterPill label="All" active={true}></FilterPill>
				<FilterPill label="Open" disabled={true}></FilterPill>
				<FilterPill label="Closed"></FilterPill>
			</FilterPills>
		);
		const enabled = pills(container).filter(pill => !pill.disabled);
		enabled[0].focus();
		fireEvent.keyDown(enabled[0], {key: 'ArrowRight'});
		expect(document.activeElement).toBe(enabled[1]);
	});

	it('hugs its pills by default', () => {
		const {container} = renderPills();
		expect(container.querySelector('.blue-orange-filter-pills')!
			.classList.contains('blue-orange-filter-pills-full-width')).toBe(false);
	});

	it('fills the parent when asked', () => {
		const {container} = render(
			<FilterPills fullWidth={true}>
				<FilterPill label="All"></FilterPill>
			</FilterPills>
		);
		expect(container.querySelector('.blue-orange-filter-pills')!
			.classList.contains('blue-orange-filter-pills-full-width')).toBe(true);
	});

	it('scrolls the set instead of wrapping when asked', () => {
		const {container} = render(
			<FilterPills scroll={true}>
				<FilterPill label="All"></FilterPill>
			</FilterPills>
		);
		expect(container.querySelector('.blue-orange-filter-pills')!
			.classList.contains('blue-orange-filter-pills-scroll')).toBe(true);
	});

	it('takes a small size', () => {
		const {container} = render(
			<FilterPills size={FilterPillsSize.SMALL}>
				<FilterPill label="All"></FilterPill>
			</FilterPills>
		);
		expect(container.querySelector('.blue-orange-filter-pills')!
			.classList.contains('blue-orange-filter-pills-sm')).toBe(true);
	});
});
