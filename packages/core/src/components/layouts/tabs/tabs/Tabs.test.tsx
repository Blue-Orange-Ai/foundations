import React from 'react';
import {render, fireEvent, within} from '@testing-library/react';
import {Tabs} from './Tabs';
import {Tab} from '../tab/Tab';

const TAB_WIDTH = 100;
const MORE_WIDTH = 80;

var headerWidth = 1000;

const rect = (left: number, right: number) => ({
	left: left,
	right: right,
	width: right - left,
	top: 0,
	bottom: 0,
	height: 0,
	x: left,
	y: 0,
	toJSON: () => {}
}) as DOMRect;

/**
 * jsdom lays nothing out, so every tab is given the same made up width and the
 * header is given whatever headerWidth currently says.
 */
beforeAll(() => {
	Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
		configurable: true,
		get: function (this: HTMLElement) {
			return this.classList.contains('blue-orange-tab-header') ? headerWidth : 0;
		}
	});
	HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
		if (this.classList.contains('blue-orange-tab-header-measure-row')) {
			return rect(0, (this.children.length - 1) * TAB_WIDTH + MORE_WIDTH);
		}
		const parent = this.parentElement;
		if (parent && parent.classList.contains('blue-orange-tab-header-measure-row')) {
			const index = Array.from(parent.children).indexOf(this);
			const left = index * TAB_WIDTH;
			const isMore = this.classList.contains('blue-orange-tab-header-more-cont');
			return rect(left, left + (isMore ? MORE_WIDTH : TAB_WIDTH));
		}
		return rect(0, 0);
	};
});

beforeEach(() => {
	headerWidth = 1000;
});

const renderTabs = (props: Record<string, any> = {}) => {
	return render(
		<Tabs {...props}>
			<Tab uuid="one" name="One"><span>Panel one</span></Tab>
			<Tab uuid="two" name="Two"><span>Panel two</span></Tab>
			<Tab uuid="three" name="Three"><span>Panel three</span></Tab>
			<Tab uuid="four" name="Four"><span>Panel four</span></Tab>
			<Tab uuid="five" name="Five"><span>Panel five</span></Tab>
		</Tabs>
	);
}

/** Only the items the header shows for real, not the ones being measured. */
const visibleNames = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-tab-header > .blue-orange-tab-header-item'))
		.map(item => item.textContent);
}

const moreButton = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-tab-header > .blue-orange-tab-header-more-cont .blue-orange-tab-header-more');
}

describe('Tabs overflow', () => {

	it('shows every tab when they all fit', () => {
		const {container} = renderTabs();
		expect(visibleNames(container)).toEqual(['One', 'Two', 'Three', 'Four', 'Five']);
		expect(moreButton(container)).toBeNull();
	});

	it('drops the trailing tabs into a more button when they do not fit', () => {
		headerWidth = 250;
		const {container} = renderTabs();
		// 250px holds one tab (100px) alongside the more button (80px).
		expect(visibleNames(container)).toEqual(['One']);
		expect(moreButton(container)).not.toBeNull();
	});

	it('keeps as many tabs as the header can hold', () => {
		headerWidth = 380;
		const {container} = renderTabs();
		expect(visibleNames(container)).toEqual(['One', 'Two', 'Three']);
	});

	it('collapses to the more button alone when nothing fits', () => {
		headerWidth = 90;
		const {container} = renderTabs();
		expect(visibleNames(container)).toEqual([]);
		expect(moreButton(container)).not.toBeNull();
	});

	it('gives the tabs back when the header grows', () => {
		headerWidth = 250;
		const {container} = renderTabs();
		expect(visibleNames(container)).toEqual(['One']);
		headerWidth = 1000;
		fireEvent(window, new Event('resize'));
		expect(visibleNames(container)).toEqual(['One', 'Two', 'Three', 'Four', 'Five']);
		expect(moreButton(container)).toBeNull();
	});

	it('collapses again when the header shrinks', () => {
		const {container} = renderTabs();
		headerWidth = 250;
		fireEvent(window, new Event('resize'));
		expect(visibleNames(container)).toEqual(['One']);
	});

	it('leaves the header alone while it has no width to measure against', () => {
		headerWidth = 0;
		const {container} = renderTabs();
		expect(visibleNames(container)).toEqual(['One', 'Two', 'Three', 'Four', 'Five']);
	});

	it('marks the more button active while the selected tab is hidden', () => {
		headerWidth = 250;
		const {container} = renderTabs({activeTab: 'four'});
		expect(moreButton(container)!.classList.contains('blue-orange-tab-header-item-active')).toBe(true);
	});

	it('leaves the more button inactive while the selected tab is on show', () => {
		headerWidth = 250;
		const {container} = renderTabs({activeTab: 'one'});
		expect(moreButton(container)!.classList.contains('blue-orange-tab-header-item-active')).toBe(false);
	});

	it('keeps every tab in the header when collapsing is turned off', () => {
		headerWidth = 100;
		const {container} = renderTabs({collapseOverflow: false});
		expect(visibleNames(container)).toEqual(['One', 'Two', 'Three', 'Four', 'Five']);
		expect(moreButton(container)).toBeNull();
	});

	it('takes the label of the more button from the props', () => {
		headerWidth = 250;
		const {container} = renderTabs({overflowLabel: 'Others'});
		expect(moreButton(container)!.textContent).toContain('Others');
	});

	it('selects a hidden tab from the dropdown', () => {
		vi.useFakeTimers({shouldAdvanceTime: true});
		try {
			headerWidth = 250;
			const onClick = vi.fn();
			const {container} = renderTabs({onClick: onClick});
			// The menu ignores clicks that land within its blocking delay of opening.
			vi.advanceTimersByTime(600);
			fireEvent.click(moreButton(container)!);
			const menu = container.querySelector('.blue-orange-default-context-menu') as HTMLElement;
			expect(menu).not.toBeNull();
			expect(within(menu).getByText('Four')).toBeInTheDocument();
			fireEvent.click(within(menu).getByText('Four'));
			expect(onClick).toHaveBeenCalledWith('four');
			expect(moreButton(container)!.classList.contains('blue-orange-tab-header-item-active')).toBe(true);
		} finally {
			vi.useRealTimers();
		}
	});
});
