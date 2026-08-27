import React, {useState} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {OptionCards, OptionCardsIconPlacement} from './OptionCards';
import {OptionCard} from '../option-card/OptionCard';

const renderCards = (onChange: (uuid: string) => void = () => {}) => {
	return render(
		<OptionCards value="internal" onChange={onChange}>
			<OptionCard uuid="internal" label="Internal" icon="ri-shield-star-line" hint="A first-party service."></OptionCard>
			<OptionCard uuid="external" label="External" icon="ri-box-3-line" hint="Any other container."></OptionCard>
			<OptionCard uuid="legacy" label="Legacy" disabled={true}></OptionCard>
		</OptionCards>
	);
}

const cardOf = (label: string) => {
	return screen.getByText(label).closest('[role="radio"]')!;
}

describe('OptionCards', () => {

	it('renders one card per option', () => {
		renderCards();
		expect(screen.getAllByRole('radio').length).toBe(3);
	});

	it('shows the label and the hint of each option', () => {
		renderCards();
		expect(screen.getByText('A first-party service.')).not.toBeNull();
		expect(screen.getByText('Any other container.')).not.toBeNull();
	});

	it('marks the option named by value as checked', () => {
		renderCards();
		expect(cardOf('Internal').getAttribute('aria-checked')).toBe('true');
		expect(cardOf('External').getAttribute('aria-checked')).toBe('false');
	});

	it('selects nothing when no value is given', () => {
		render(
			<OptionCards>
				<OptionCard uuid="one" label="One"></OptionCard>
			</OptionCards>
		);
		expect(cardOf('One').getAttribute('aria-checked')).toBe('false');
	});

	it('reports the option that was clicked', () => {
		const onChange = vi.fn();
		renderCards(onChange);
		fireEvent.click(cardOf('External'));
		expect(onChange).toHaveBeenCalledWith('external');
	});

	it('moves the selection on click', () => {
		renderCards();
		fireEvent.click(cardOf('External'));
		expect(cardOf('External').getAttribute('aria-checked')).toBe('true');
		expect(cardOf('Internal').getAttribute('aria-checked')).toBe('false');
	});

	it('never selects a disabled option', () => {
		const onChange = vi.fn();
		renderCards(onChange);
		fireEvent.click(cardOf('Legacy'));
		expect(onChange).not.toHaveBeenCalled();
		expect(cardOf('Internal').getAttribute('aria-checked')).toBe('true');
	});

	it('never selects anything while the group is disabled', () => {
		const onChange = vi.fn();
		render(
			<OptionCards value="one" disabled={true} onChange={onChange}>
				<OptionCard uuid="one" label="One"></OptionCard>
				<OptionCard uuid="two" label="Two"></OptionCard>
			</OptionCards>
		);
		fireEvent.click(cardOf('Two'));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps the selection on a second click', () => {
		const onChange = vi.fn();
		renderCards(onChange);
		fireEvent.click(cardOf('Internal'));
		expect(cardOf('Internal').getAttribute('aria-checked')).toBe('true');
		expect(onChange).toHaveBeenCalledWith('internal');
	});

	it('clears the selection on a second click when deselecting is allowed', () => {
		const onChange = vi.fn();
		render(
			<OptionCards value="one" allowDeselect={true} onChange={onChange}>
				<OptionCard uuid="one" label="One"></OptionCard>
			</OptionCards>
		);
		fireEvent.click(cardOf('One'));
		expect(onChange).toHaveBeenCalledWith('');
		expect(cardOf('One').getAttribute('aria-checked')).toBe('false');
	});

	it('moves to the next option with the right arrow', () => {
		renderCards();
		fireEvent.keyDown(cardOf('Internal'), {key: 'ArrowRight'});
		expect(cardOf('External').getAttribute('aria-checked')).toBe('true');
	});

	it('skips disabled options and wraps with the right arrow', () => {
		renderCards();
		fireEvent.click(cardOf('External'));
		fireEvent.keyDown(cardOf('External'), {key: 'ArrowRight'});
		expect(cardOf('Internal').getAttribute('aria-checked')).toBe('true');
	});

	it('jumps to the ends with home and end', () => {
		renderCards();
		fireEvent.keyDown(cardOf('Internal'), {key: 'End'});
		expect(cardOf('External').getAttribute('aria-checked')).toBe('true');
		fireEvent.keyDown(cardOf('External'), {key: 'Home'});
		expect(cardOf('Internal').getAttribute('aria-checked')).toBe('true');
	});

	it('keeps only the selected card in the tab order', () => {
		renderCards();
		expect(cardOf('Internal').getAttribute('tabindex')).toBe('0');
		expect(cardOf('External').getAttribute('tabindex')).toBe('-1');
	});

	it('makes the first selectable card the tab stop while nothing is selected', () => {
		render(
			<OptionCards>
				<OptionCard uuid="off" label="Off" disabled={true}></OptionCard>
				<OptionCard uuid="on" label="On"></OptionCard>
			</OptionCards>
		);
		expect(cardOf('On').getAttribute('tabindex')).toBe('0');
	});

	it('follows the value prop when it changes', () => {
		const Controlled: React.FC = () => {
			const [value, setValue] = useState('one');
			return (
				<>
					<button onClick={() => setValue('two')}>Go</button>
					<OptionCards value={value}>
						<OptionCard uuid="one" label="One"></OptionCard>
						<OptionCard uuid="two" label="Two"></OptionCard>
					</OptionCards>
				</>
			)
		};
		render(<Controlled/>);
		expect(cardOf('One').getAttribute('aria-checked')).toBe('true');
		fireEvent.click(screen.getByText('Go'));
		expect(cardOf('Two').getAttribute('aria-checked')).toBe('true');
	});

	it('lays the grid out in the number of columns it was given', () => {
		const {container} = render(
			<OptionCards columns={3}>
				<OptionCard uuid="one" label="One"></OptionCard>
			</OptionCards>
		);
		const grid = container.querySelector('.blue-orange-option-cards') as HTMLElement;
		expect(grid.style.getPropertyValue('--blue-orange-option-cards-template')).toBe('repeat(3, minmax(0, 1fr))');
	});

	it('fits the columns to a minimum width when one is given', () => {
		const {container} = render(
			<OptionCards minColumnWidth={240} columns={3}>
				<OptionCard uuid="one" label="One"></OptionCard>
			</OptionCards>
		);
		const grid = container.querySelector('.blue-orange-option-cards') as HTMLElement;
		expect(grid.style.getPropertyValue('--blue-orange-option-cards-template')).toBe('repeat(auto-fit, minmax(240px, 1fr))');
	});

	it('moves the icon beside the label when asked to', () => {
		const {container} = render(
			<OptionCards iconPlacement={OptionCardsIconPlacement.LEFT}>
				<OptionCard uuid="one" label="One" icon="ri-box-3-line"></OptionCard>
			</OptionCards>
		);
		expect(container.querySelector('.blue-orange-option-cards-icon-left')).not.toBeNull();
	});

	it('renders an icon element in place of an icon class', () => {
		render(
			<OptionCards>
				<OptionCard uuid="one" label="One" iconElement={<span>Badge</span>}></OptionCard>
			</OptionCards>
		);
		expect(screen.getByText('Badge')).not.toBeNull();
	});

	it('renders the label of the group', () => {
		render(
			<OptionCards label="Package type">
				<OptionCard uuid="one" label="One"></OptionCard>
			</OptionCards>
		);
		expect(screen.getByText('Package type')).not.toBeNull();
	});

	it('ignores children that are not an OptionCard', () => {
		render(
			<OptionCards>
				<OptionCard uuid="one" label="One"></OptionCard>
				<div>Rogue</div>
			</OptionCards>
		);
		expect(screen.queryByText('Rogue')).toBeNull();
	});
});
