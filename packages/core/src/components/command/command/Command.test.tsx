import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Command} from './Command';
import {CommandInput} from '../command-input/CommandInput';
import {CommandList} from '../command-list/CommandList';
import {CommandEmpty} from '../command-empty/CommandEmpty';
import {CommandGroup} from '../command-group/CommandGroup';
import {CommandItem} from '../command-item/CommandItem';

const renderPalette = (onSelect: (value: string) => void = () => {}) => {
	return render(
		<Command>
			<CommandInput placeholder="Search"></CommandInput>
			<CommandList>
				<CommandEmpty>Nothing found</CommandEmpty>
				<CommandGroup heading="Fruit">
					<CommandItem onSelect={onSelect}>Apple</CommandItem>
					<CommandItem onSelect={onSelect}>Banana</CommandItem>
				</CommandGroup>
				<CommandGroup heading="Vegetables">
					<CommandItem onSelect={onSelect}>Carrot</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	);
}

const search = (value: string) => {
	fireEvent.change(screen.getByPlaceholderText('Search'), {target: {value: value}});
}

describe('Command', () => {

	it('renders every item before anything is typed', () => {
		renderPalette();
		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.getByText('Banana')).toBeInTheDocument();
		expect(screen.getByText('Carrot')).toBeInTheDocument();
	});

	it('filters the items as the search changes', () => {
		renderPalette();
		search('app');
		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.queryByText('Banana')).toBeNull();
		expect(screen.queryByText('Carrot')).toBeNull();
	});

	it('ignores case when filtering', () => {
		renderPalette();
		search('BANANA');
		expect(screen.getByText('Banana')).toBeInTheDocument();
		expect(screen.queryByText('Apple')).toBeNull();
	});

	it('hides a group once every one of its items is filtered out', () => {
		renderPalette();
		search('app');
		const group = screen.getByText('Vegetables').closest('.blue-orange-command-group');
		expect(group!.classList.contains('blue-orange-command-group-hidden')).toBe(true);
	});

	it('keeps a group visible while it still has a match', () => {
		renderPalette();
		search('app');
		const group = screen.getByText('Fruit').closest('.blue-orange-command-group');
		expect(group!.classList.contains('blue-orange-command-group-hidden')).toBe(false);
	});

	it('shows the empty state only when nothing matches', () => {
		renderPalette();
		expect(screen.queryByText('Nothing found')).toBeNull();
		search('zzzz');
		expect(screen.getByText('Nothing found')).toBeInTheDocument();
	});

	it('highlights the first item on mount', () => {
		renderPalette();
		expect(screen.getByText('Apple').closest('[role="option"]')!.getAttribute('aria-selected')).toBe('true');
	});

	it('moves the highlight down with the arrow keys', () => {
		renderPalette();
		fireEvent.keyDown(screen.getByPlaceholderText('Search'), {key: 'ArrowDown'});
		expect(screen.getByText('Banana').closest('[role="option"]')!.getAttribute('aria-selected')).toBe('true');
		expect(screen.getByText('Apple').closest('[role="option"]')!.getAttribute('aria-selected')).toBe('false');
	});

	it('wraps the highlight around the ends of the list', () => {
		renderPalette();
		fireEvent.keyDown(screen.getByPlaceholderText('Search'), {key: 'ArrowUp'});
		expect(screen.getByText('Carrot').closest('[role="option"]')!.getAttribute('aria-selected')).toBe('true');
	});

	it('runs the highlighted item on enter', () => {
		const onSelect = vi.fn();
		renderPalette(onSelect);
		fireEvent.keyDown(screen.getByPlaceholderText('Search'), {key: 'ArrowDown'});
		fireEvent.keyDown(screen.getByPlaceholderText('Search'), {key: 'Enter'});
		expect(onSelect).toHaveBeenCalledWith('Banana');
	});

	it('runs an item when it is clicked', () => {
		const onSelect = vi.fn();
		renderPalette(onSelect);
		fireEvent.click(screen.getByText('Carrot'));
		expect(onSelect).toHaveBeenCalledWith('Carrot');
	});

	it('moves the highlight onto an item that is hovered', () => {
		renderPalette();
		fireEvent.mouseEnter(screen.getByText('Carrot').closest('[role="option"]')!);
		expect(screen.getByText('Carrot').closest('[role="option"]')!.getAttribute('aria-selected')).toBe('true');
	});

	it('never highlights or runs a disabled item', () => {
		const onSelect = vi.fn();
		render(
			<Command>
				<CommandInput placeholder="Search"></CommandInput>
				<CommandList>
					<CommandItem disabled={true} onSelect={onSelect}>Blocked</CommandItem>
					<CommandItem onSelect={onSelect}>Allowed</CommandItem>
				</CommandList>
			</Command>
		);
		expect(screen.getByText('Allowed').closest('[role="option"]')!.getAttribute('aria-selected')).toBe('true');
		fireEvent.click(screen.getByText('Blocked'));
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('filters on the explicit value when one is given', () => {
		render(
			<Command>
				<CommandInput placeholder="Search"></CommandInput>
				<CommandList>
					<CommandItem value="keyboard shortcuts">Preferences</CommandItem>
				</CommandList>
			</Command>
		);
		search('shortcut');
		expect(screen.getByText('Preferences')).toBeInTheDocument();
	});

	it('shows everything again when the search is cleared', () => {
		renderPalette();
		search('app');
		expect(screen.queryByText('Carrot')).toBeNull();
		search('');
		expect(screen.getByText('Carrot')).toBeInTheDocument();
	});

	it('leaves the items alone when filtering is turned off', () => {
		render(
			<Command shouldFilter={false}>
				<CommandInput placeholder="Search"></CommandInput>
				<CommandList>
					<CommandItem>Apple</CommandItem>
					<CommandItem>Banana</CommandItem>
				</CommandList>
			</Command>
		);
		search('zzzz');
		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.getByText('Banana')).toBeInTheDocument();
	});

	it('reports the search text through onSearchChange', () => {
		const onSearchChange = vi.fn();
		render(
			<Command onSearchChange={onSearchChange}>
				<CommandInput placeholder="Search"></CommandInput>
				<CommandList>
					<CommandItem>Apple</CommandItem>
				</CommandList>
			</Command>
		);
		search('ap');
		expect(onSearchChange).toHaveBeenCalledWith('ap');
	});
});
