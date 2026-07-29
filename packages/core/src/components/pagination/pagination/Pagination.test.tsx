import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Pagination, buildPaginationItems} from './Pagination';
import {PaginationLink} from '../pagination-link/PaginationLink';

describe('buildPaginationItems', () => {

	it('lists every page while they all fit', () => {
		expect(buildPaginationItems(1, 5, 1)).toEqual([1, 2, 3, 4, 5]);
	});

	it('collapses the tail when the current page is near the start', () => {
		expect(buildPaginationItems(2, 40, 1)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 40]);
	});

	it('collapses the head when the current page is near the end', () => {
		expect(buildPaginationItems(39, 40, 1)).toEqual([1, 'ellipsis', 36, 37, 38, 39, 40]);
	});

	it('collapses both ends in the middle of a long run', () => {
		expect(buildPaginationItems(20, 40, 1)).toEqual([1, 'ellipsis', 19, 20, 21, 'ellipsis', 40]);
	});

	it('widens the window with the sibling count', () => {
		expect(buildPaginationItems(20, 40, 2)).toEqual([1, 'ellipsis', 18, 19, 20, 21, 22, 'ellipsis', 40]);
	});
});

describe('Pagination', () => {

	it('marks the current page', () => {
		render(<Pagination page={3} totalPages={5}></Pagination>);
		expect(screen.getByText('3').closest('[role="button"]')!.getAttribute('aria-current')).toBe('page');
	});

	it('reports the page that was clicked', () => {
		const onPageChange = vi.fn();
		render(<Pagination page={1} totalPages={5} onPageChange={onPageChange}></Pagination>);
		fireEvent.click(screen.getByText('4'));
		expect(onPageChange).toHaveBeenCalledWith(4);
	});

	it('steps forward with the next control', () => {
		const onPageChange = vi.fn();
		render(<Pagination page={2} totalPages={5} onPageChange={onPageChange}></Pagination>);
		fireEvent.click(screen.getByText('Next'));
		expect(onPageChange).toHaveBeenCalledWith(3);
	});

	it('disables the previous control on the first page', () => {
		render(<Pagination page={1} totalPages={5}></Pagination>);
		expect(screen.getByLabelText('Go to previous page').getAttribute('aria-disabled')).toBe('true');
	});

	it('disables the next control on the last page', () => {
		render(<Pagination page={5} totalPages={5}></Pagination>);
		expect(screen.getByLabelText('Go to next page').getAttribute('aria-disabled')).toBe('true');
	});

	it('does nothing when a disabled control is clicked', () => {
		const onPageChange = vi.fn();
		render(<Pagination page={1} totalPages={5} onPageChange={onPageChange}></Pagination>);
		fireEvent.click(screen.getByText('Previous'));
		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('ignores a click on the page already being viewed', () => {
		const onPageChange = vi.fn();
		render(<Pagination page={3} totalPages={5} onPageChange={onPageChange}></Pagination>);
		fireEvent.click(screen.getByText('3'));
		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('clamps a page beyond the end of the range', () => {
		render(<Pagination page={99} totalPages={5}></Pagination>);
		expect(screen.getByText('5').closest('[role="button"]')!.getAttribute('aria-current')).toBe('page');
	});

	it('blocks every control when disabled', () => {
		const onPageChange = vi.fn();
		render(<Pagination page={3} totalPages={5} disabled={true} onPageChange={onPageChange}></Pagination>);
		fireEvent.click(screen.getByText('4'));
		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('drops the previous and next labels when compact', () => {
		render(<Pagination page={3} totalPages={5} compact={true}></Pagination>);
		expect(screen.queryByText('Previous')).toBeNull();
		expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
	});

	it('adds first and last controls when asked', () => {
		render(<Pagination page={20} totalPages={40} showFirstLast={true}></Pagination>);
		expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
		expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
	});

	it('renders children in place of the generated items', () => {
		render(
			<Pagination page={1} totalPages={1}>
				<PaginationLink active={true}>Only</PaginationLink>
			</Pagination>
		);
		expect(screen.getByText('Only')).toBeInTheDocument();
		expect(screen.queryByText('Next')).toBeNull();
	});
});
