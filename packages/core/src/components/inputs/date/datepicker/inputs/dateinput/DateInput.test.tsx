import React from 'react';
import {render, fireEvent, act} from '@testing-library/react';
import {DateInput} from './DateInput';

// jsdom has no layout, so the field and the calendar are given rects by hand — every position the
// popover takes is derived from them.
const ANCHOR = {left: 100, top: 50, width: 240, height: 34, bottom: 84, right: 340};
const CALENDAR_WIDTH = 262;

let anchorRect = {...ANCHOR};

const rect = (r: Record<string, number>) =>
	({...r, x: r.left, y: r.top, toJSON: () => ({})}) as DOMRect;

const stubLayout = () => {
	vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
		if (this.classList.contains('blue-orange-date-picker-input-anchor')) {
			return rect(anchorRect);
		}
		if (this.classList.contains('blue-orange-date-picker-context-window-single')) {
			return rect({left: 0, top: 0, width: CALENDAR_WIDTH, height: 290, bottom: 290, right: CALENDAR_WIDTH});
		}
		return rect({left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0});
	});
};

const calendar = () => document.body.querySelector('.blue-orange-date-picker-context-window-single') as HTMLElement;

const openCalendar = (container: HTMLElement) => {
	fireEvent.focus(container.querySelector('input') as HTMLElement);
};

describe('DateInput calendar placement', () => {

	beforeEach(() => {
		anchorRect = {...ANCHOR};
		window.innerWidth = 1024;
		window.innerHeight = 768;
		stubLayout();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('does not render the calendar until the field is focused', () => {
		const {container} = render(<DateInput/>);
		expect(calendar()).toBeNull();
		openCalendar(container);
		expect(calendar()).toBeInTheDocument();
	});

	// The calendar is `position: fixed`. Left inside the component it is placed against whichever
	// ancestor happens to carry a transform — a modal or drawer card — instead of the viewport it
	// measured the field against, which is what threw it off the field inside an overlay.
	it('portals the calendar to the body rather than leaving it inside the component', () => {
		const {container} = render(<DateInput/>);
		openCalendar(container);

		expect(container.contains(calendar())).toBe(false);
		expect(calendar().parentElement).toBe(document.body);
	});

	it('opens directly under the field', () => {
		const {container} = render(<DateInput/>);
		openCalendar(container);

		expect(calendar().style.top).toBe('94px');   // field bottom 84 + 10
		expect(calendar().style.bottom).toBe('unset');
	});

	it('flips directly above the field when it sits in the lower half of the viewport', () => {
		anchorRect = {...ANCHOR, top: 600, bottom: 634};
		const {container} = render(<DateInput/>);
		openCalendar(container);

		expect(calendar().style.bottom).toBe('178px'); // 768 - field top 600 + 10
		expect(calendar().style.top).toBe('unset');
	});

	// The old anchor was the whole component, so a label pushed the calendar down by the height of
	// the label as well as the field.
	it('places the calendar off the field, not off the label above it', () => {
		const {container} = render(<DateInput label="Starts at" help="When it begins"/>);
		openCalendar(container);

		expect(calendar().style.top).toBe('94px');
	});

	it('centres the calendar on the field using its measured width', () => {
		const {container} = render(<DateInput/>);
		openCalendar(container);

		// 100 - (262 - 240) / 2
		expect(calendar().style.left).toBe('89px');
	});

	it('pulls the calendar back inside the viewport when the field is against the right edge', () => {
		anchorRect = {...ANCHOR, left: 1000, right: 1240};
		const {container} = render(<DateInput/>);
		openCalendar(container);

		// 1024 - 10 - 262
		expect(calendar().style.left).toBe('752px');
	});

	it('re-measures the field while the calendar is open so a scroll cannot leave it behind', () => {
		const {container} = render(<DateInput/>);
		openCalendar(container);
		expect(calendar().style.top).toBe('94px');

		anchorRect = {...ANCHOR, top: 20, bottom: 54};
		act(() => {
			window.dispatchEvent(new Event('scroll'));
		});

		expect(calendar().style.top).toBe('64px');
	});

	it('drops the calendar when the field loses focus to a click elsewhere', () => {
		const {container} = render(<DateInput/>);
		openCalendar(container);

		fireEvent.mouseDown(document.body);

		expect(calendar()).toBeNull();
	});

	// The calendar is no longer a descendant of the component, so a day click had to keep counting
	// as a click inside it — otherwise the popover closed before the selection landed.
	it('keeps the calendar open for a click on the portalled popover itself', () => {
		const {container} = render(<DateInput/>);
		openCalendar(container);

		fireEvent.mouseDown(calendar());

		expect(calendar()).toBeInTheDocument();
	});

	it('selects a day clicked in the portalled calendar', () => {
		const onChange = vi.fn();
		const {container} = render(<DateInput value={new Date(2024, 0, 15)} onChange={onChange}/>);
		openCalendar(container);
		onChange.mockClear();

		const day = calendar().querySelector('.blue-orange-date-picker-day') as HTMLElement;
		fireEvent.mouseDown(day);
		fireEvent.click(day);

		expect(onChange).toHaveBeenCalled();
		expect(calendar()).toBeNull();
	});

	// The `.dark` ancestor does not follow the calendar out to the body.
	it('re-applies the theme it was written inside on the portalled calendar', () => {
		const {container} = render(<div className="dark"><DateInput/></div>);
		openCalendar(container);

		expect(calendar().classList.contains('dark')).toBe(true);
	});

	it('leaves the calendar untouched when it was not written inside a dark subtree', () => {
		const {container} = render(<DateInput/>);
		openCalendar(container);

		expect(calendar().classList.contains('dark')).toBe(false);
	});
});
