import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {FilterRow, FilterRowSize} from './FilterRow';
import {FilterRowSegment} from '../filter-row-segment/FilterRowSegment';
import {FilterRowAction} from '../filter-row-action/FilterRowAction';

const renderRow = (onRemove: () => void = () => {}) => {
	return render(
		<FilterRow>
			<FilterRowSegment muted={true} label="Value of"></FilterRowSegment>
			<FilterRowSegment control={true} icon="ri-paragraph" label="name"></FilterRowSegment>
			<FilterRowSegment control={true} label="contains"></FilterRowSegment>
			<FilterRowSegment grow={true}><input defaultValue="acme"/></FilterRowSegment>
			<FilterRowAction icon="ri-close-line" label="Delete" onClick={onRemove}></FilterRowAction>
		</FilterRow>
	);
}

const segments = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-filter-row-segment'));
}

describe('FilterRow', () => {

	it('renders each segment of the row', () => {
		const {container} = renderRow();
		expect(segments(container).length).toBe(4);
		expect(screen.getByText('Value of')).toBeInTheDocument();
		expect(screen.getByText('name')).toBeInTheDocument();
		expect(screen.getByText('contains')).toBeInTheDocument();
	});

	it('renders the icon of a segment', () => {
		const {container} = renderRow();
		expect(container.querySelector('.ri-paragraph')).toBeInTheDocument();
	});

	it('marks a muted segment as supporting text', () => {
		const {container} = renderRow();
		expect(segments(container)[0].classList.contains('blue-orange-filter-row-segment-muted')).toBe(true);
	});

	it('marks the segments that hold a control', () => {
		const {container} = renderRow();
		expect(segments(container)[1].classList.contains('blue-orange-filter-row-segment-control')).toBe(true);
	});

	it('lets the value segment take the space left over', () => {
		const {container} = renderRow();
		expect(segments(container)[3].classList.contains('blue-orange-filter-row-segment-grow')).toBe(true);
	});

	it('removes the filter from its action', () => {
		const onRemove = vi.fn();
		renderRow(onRemove);
		fireEvent.click(screen.getByLabelText('Delete'));
		expect(onRemove).toHaveBeenCalled();
	});

	it('removes the filter from the keyboard', () => {
		const onRemove = vi.fn();
		renderRow(onRemove);
		fireEvent.keyDown(screen.getByLabelText('Delete'), {key: 'Enter'});
		expect(onRemove).toHaveBeenCalled();
	});

	it('never fires a disabled action', () => {
		const onRemove = vi.fn();
		render(
			<FilterRow>
				<FilterRowSegment label="name"></FilterRowSegment>
				<FilterRowAction icon="ri-close-line" label="Delete" disabled={true} onClick={onRemove}></FilterRowAction>
			</FilterRow>
		);
		fireEvent.click(screen.getByLabelText('Delete'));
		expect(onRemove).not.toHaveBeenCalled();
	});

	it('runs the handler of a clickable segment', () => {
		const onClick = vi.fn();
		render(
			<FilterRow>
				<FilterRowSegment label="Add filter" onClick={onClick}></FilterRowSegment>
			</FilterRow>
		);
		fireEvent.click(screen.getByText('Add filter'));
		expect(onClick).toHaveBeenCalled();
	});

	it('caps the width of a segment when asked', () => {
		const {container} = render(
			<FilterRow>
				<FilterRowSegment label="a very long field name" maxWidth={120}></FilterRowSegment>
			</FilterRow>
		);
		expect((segments(container)[0] as HTMLElement).style.maxWidth).toBe('120px');
	});

	it('hugs its segments by default', () => {
		const {container} = renderRow();
		expect(container.querySelector('.blue-orange-filter-row')!
			.classList.contains('blue-orange-filter-row-full-width')).toBe(false);
	});

	it('fills the parent when asked', () => {
		const {container} = render(
			<FilterRow fullWidth={true}>
				<FilterRowSegment label="name"></FilterRowSegment>
			</FilterRow>
		);
		expect(container.querySelector('.blue-orange-filter-row')!
			.classList.contains('blue-orange-filter-row-full-width')).toBe(true);
	});

	it('takes a small size', () => {
		const {container} = render(
			<FilterRow size={FilterRowSize.SMALL}>
				<FilterRowSegment label="name"></FilterRowSegment>
			</FilterRow>
		);
		expect(container.querySelector('.blue-orange-filter-row')!
			.classList.contains('blue-orange-filter-row-sm')).toBe(true);
	});

	it('renders an empty segment so the CSS can collapse it', () => {
		const {container} = render(
			<FilterRow>
				<FilterRowSegment label="name"></FilterRowSegment>
				<FilterRowSegment>{false}</FilterRowSegment>
			</FilterRow>
		);
		expect(segments(container)[1].childNodes.length).toBe(0);
	});
});
