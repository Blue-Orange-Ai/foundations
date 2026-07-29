import React, {useState} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {ButtonTabs} from './ButtonTabs';
import {ButtonTab} from '../button-tab/ButtonTab';

const renderTabs = (onClick: (uuid: string) => void = () => {}) => {
	return render(
		<ButtonTabs onClick={onClick}>
			<ButtonTab uuid="one" name="One">
				<span>Panel one</span>
			</ButtonTab>
			<ButtonTab uuid="two" name="Two">
				<span>Panel two</span>
			</ButtonTab>
			<ButtonTab uuid="three" name="Three" disabled={true}>
				<span>Panel three</span>
			</ButtonTab>
		</ButtonTabs>
	);
}

const panelOf = (text: string) => {
	return screen.getByText(text).closest('[role="tabpanel"]')!;
}

const triggerOf = (name: string) => {
	return screen.getByText(name).closest('[role="tab"]')!;
}

describe('ButtonTabs', () => {

	it('selects the first tab by default', () => {
		renderTabs();
		expect(triggerOf('One').getAttribute('aria-selected')).toBe('true');
		expect(panelOf('Panel one').classList.contains('blue-orange-button-tabs-panel-hidden')).toBe(false);
	});

	it('hides the panels of the tabs that are not selected', () => {
		renderTabs();
		expect(panelOf('Panel two').classList.contains('blue-orange-button-tabs-panel-hidden')).toBe(true);
	});

	it('switches tab on click', () => {
		renderTabs();
		fireEvent.click(triggerOf('Two'));
		expect(triggerOf('Two').getAttribute('aria-selected')).toBe('true');
		expect(panelOf('Panel two').classList.contains('blue-orange-button-tabs-panel-hidden')).toBe(false);
	});

	it('reports the tab that was clicked', () => {
		const onClick = vi.fn();
		renderTabs(onClick);
		fireEvent.click(triggerOf('Two'));
		expect(onClick).toHaveBeenCalledWith('two');
	});

	it('never selects a disabled tab', () => {
		const onClick = vi.fn();
		renderTabs(onClick);
		fireEvent.click(triggerOf('Three'));
		expect(onClick).not.toHaveBeenCalled();
		expect(triggerOf('One').getAttribute('aria-selected')).toBe('true');
	});

	it('starts on the first tab that is not disabled', () => {
		render(
			<ButtonTabs>
				<ButtonTab uuid="off" name="Off" disabled={true}></ButtonTab>
				<ButtonTab uuid="on" name="On"></ButtonTab>
			</ButtonTabs>
		);
		expect(triggerOf('On').getAttribute('aria-selected')).toBe('true');
	});

	it('moves to the next tab with the right arrow', () => {
		renderTabs();
		fireEvent.keyDown(triggerOf('One'), {key: 'ArrowRight'});
		expect(triggerOf('Two').getAttribute('aria-selected')).toBe('true');
	});

	it('skips disabled tabs and wraps with the right arrow', () => {
		renderTabs();
		fireEvent.click(triggerOf('Two'));
		fireEvent.keyDown(triggerOf('Two'), {key: 'ArrowRight'});
		expect(triggerOf('One').getAttribute('aria-selected')).toBe('true');
	});

	it('jumps to the ends with home and end', () => {
		renderTabs();
		fireEvent.keyDown(triggerOf('One'), {key: 'End'});
		expect(triggerOf('Two').getAttribute('aria-selected')).toBe('true');
		fireEvent.keyDown(triggerOf('Two'), {key: 'Home'});
		expect(triggerOf('One').getAttribute('aria-selected')).toBe('true');
	});

	it('follows the activeTab prop when it changes', () => {
		const Controlled: React.FC = () => {
			const [active, setActive] = useState('one');
			return (
				<>
					<button onClick={() => setActive('two')}>Go</button>
					<ButtonTabs activeTab={active}>
						<ButtonTab uuid="one" name="One"></ButtonTab>
						<ButtonTab uuid="two" name="Two"></ButtonTab>
					</ButtonTabs>
				</>
			)
		};
		render(<Controlled/>);
		expect(triggerOf('One').getAttribute('aria-selected')).toBe('true');
		fireEvent.click(screen.getByText('Go'));
		expect(triggerOf('Two').getAttribute('aria-selected')).toBe('true');
	});

	it('stretches the triggers when full width', () => {
		const {container} = render(
			<ButtonTabs fullWidth={true}>
				<ButtonTab uuid="one" name="One"></ButtonTab>
			</ButtonTabs>
		);
		const list = container.querySelector('.blue-orange-button-tabs-list')!;
		expect(list.classList.contains('blue-orange-button-tabs-list-full-width')).toBe(true);
	});

	it('ignores children that are not a ButtonTab', () => {
		render(
			<ButtonTabs>
				<ButtonTab uuid="one" name="One"></ButtonTab>
				<div>Rogue</div>
			</ButtonTabs>
		);
		expect(screen.queryByText('Rogue')).toBeNull();
	});
});
