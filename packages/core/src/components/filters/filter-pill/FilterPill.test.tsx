import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {FilterPill} from './FilterPill';

const pill = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-filter-pill') as HTMLButtonElement;
}

describe('FilterPill', () => {

	it('renders its label', () => {
		render(<FilterPill label="Approved"></FilterPill>);
		expect(screen.getByText('Approved')).toBeInTheDocument();
	});

	it('renders its count', () => {
		const {container} = render(<FilterPill label="Approved" count={10}></FilterPill>);
		expect(container.querySelector('.blue-orange-filter-pill-count')!.textContent).toBe('10');
	});

	it('renders a count of zero rather than dropping it', () => {
		const {container} = render(<FilterPill label="Open" count={0}></FilterPill>);
		expect(container.querySelector('.blue-orange-filter-pill-count')!.textContent).toBe('0');
	});

	it('leaves the count out when there is none', () => {
		const {container} = render(<FilterPill label="Open"></FilterPill>);
		expect(container.querySelector('.blue-orange-filter-pill-count')).toBeNull();
	});

	it('takes a count that is already formatted', () => {
		const {container} = render(<FilterPill label="Open" count="99+"></FilterPill>);
		expect(container.querySelector('.blue-orange-filter-pill-count')!.textContent).toBe('99+');
	});

	it('renders its icon', () => {
		const {container} = render(<FilterPill label="Open" icon="ri-git-pull-request-line"></FilterPill>);
		expect(container.querySelector('.ri-git-pull-request-line')).toBeInTheDocument();
	});

	it('is not selected by default', () => {
		const {container} = render(<FilterPill label="Open"></FilterPill>);
		expect(pill(container).getAttribute('aria-selected')).toBe('false');
		expect(pill(container).classList.contains('blue-orange-filter-pill-active')).toBe(false);
	});

	it('marks itself as selected', () => {
		const {container} = render(<FilterPill label="Open" active={true}></FilterPill>);
		expect(pill(container).getAttribute('aria-selected')).toBe('true');
		expect(pill(container).classList.contains('blue-orange-filter-pill-active')).toBe(true);
	});

	it('is square by default', () => {
		const {container} = render(<FilterPill label="Open"></FilterPill>);
		expect(pill(container).classList.contains('blue-orange-filter-pill-round')).toBe(false);
	});

	it('rounds itself when asked', () => {
		const {container} = render(<FilterPill label="Open" round={true}></FilterPill>);
		expect(pill(container).classList.contains('blue-orange-filter-pill-round')).toBe(true);
	});

	it('runs its handler', () => {
		const onClick = vi.fn();
		render(<FilterPill label="Open" onClick={onClick}></FilterPill>);
		fireEvent.click(screen.getByText('Open'));
		expect(onClick).toHaveBeenCalled();
	});

	it('never fires while disabled', () => {
		const onClick = vi.fn();
		const {container} = render(<FilterPill label="Open" disabled={true} onClick={onClick}></FilterPill>);
		expect(pill(container).disabled).toBe(true);
		fireEvent.click(pill(container));
		expect(onClick).not.toHaveBeenCalled();
	});

	it('never submits the form it sits in', () => {
		const {container} = render(<FilterPill label="Open"></FilterPill>);
		expect(pill(container).getAttribute('type')).toBe('button');
	});

	it('takes extra classes and styles', () => {
		const {container} = render(<FilterPill label="Open" classes="custom" style={{marginTop: "4px"}}></FilterPill>);
		expect(pill(container).classList.contains('custom')).toBe(true);
		expect(pill(container).style.marginTop).toBe('4px');
	});
});
