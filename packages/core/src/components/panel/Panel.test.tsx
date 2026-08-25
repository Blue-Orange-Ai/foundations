import React, {useState} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Panel, PanelIconPos, PanelTab} from './Panel';

const TABS: Array<PanelTab> = [
	{uuid: "one", label: "One", content: <span>Body one</span>},
	{uuid: "two", label: "Two", content: <span>Body two</span>},
	{uuid: "three", label: "Three", disabled: true, content: <span>Body three</span>}
];

const triggerOf = (name: string) => {
	return screen.getByText(name).closest('[role="tab"]')!;
}

const bodyOf = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-foundations-panel-body')!;
}

describe('Panel', () => {

	it('renders its children in the body', () => {
		const {container} = render(<Panel><span>Body</span></Panel>);
		expect(bodyOf(container).textContent).toBe('Body');
	});

	it('pads the body with 8px by default', () => {
		const {container} = render(<Panel><span>Body</span></Panel>);
		expect((bodyOf(container) as HTMLElement).style.padding).toBe('8px');
	});

	it('takes a number of pixels as the padding', () => {
		const {container} = render(<Panel padding={24}><span>Body</span></Panel>);
		expect((bodyOf(container) as HTMLElement).style.padding).toBe('24px');
	});

	it('takes any css length as the padding', () => {
		const {container} = render(<Panel padding={"8px 16px"}><span>Body</span></Panel>);
		expect((bodyOf(container) as HTMLElement).style.padding).toBe('8px 16px');
	});

	it('leaves the header out until one is given', () => {
		const {container} = render(<Panel><span>Body</span></Panel>);
		expect(container.querySelector('.blue-orange-foundations-panel-header')).toBeNull();
	});

	it('renders the header prop', () => {
		render(<Panel header={"A header"}><span>Body</span></Panel>);
		expect(screen.getByText('A header')).toBeTruthy();
	});

	it('sizes the panel off the width and height props', () => {
		const {container} = render(<Panel width={240} height={"100%"}><span>Body</span></Panel>);
		const panel = container.querySelector('.blue-orange-foundations-panel') as HTMLElement;
		expect(panel.style.width).toBe('240px');
		expect(panel.style.height).toBe('100%');
	});

	it('leaves the width and height to the stylesheet when neither is given', () => {
		const {container} = render(<Panel><span>Body</span></Panel>);
		const panel = container.querySelector('.blue-orange-foundations-panel') as HTMLElement;
		expect(panel.style.width).toBe('');
		expect(panel.style.height).toBe('');
	});

	it('reports the header button being clicked', () => {
		const onIconClick = vi.fn();
		const {container} = render(
			<Panel header={"A header"} icon={"ri-close-line"} onIconClick={onIconClick}><span>Body</span></Panel>
		);
		fireEvent.click(container.querySelector('.blue-orange-foundations-panel-header-btn')!);
		expect(onIconClick).toHaveBeenCalled();
	});

	it('places the header button after the header content by default', () => {
		const {container} = render(<Panel header={"A header"} icon={"ri-close-line"}><span>Body</span></Panel>);
		const header = container.querySelector('.blue-orange-foundations-panel-header')!;
		expect(header.lastElementChild!.classList.contains('blue-orange-foundations-panel-header-btn')).toBe(true);
	});

	it('places the header button before the header content on the left', () => {
		const {container} = render(
			<Panel header={"A header"} icon={"ri-close-line"} iconPos={PanelIconPos.LEFT}><span>Body</span></Panel>
		);
		const header = container.querySelector('.blue-orange-foundations-panel-header')!;
		expect(header.firstElementChild!.classList.contains('blue-orange-foundations-panel-header-btn')).toBe(true);
	});

	it('renders the tabs with no header at all', () => {
		const {container} = render(<Panel tabs={TABS}></Panel>);
		expect(container.querySelector('.blue-orange-foundations-panel-header')).toBeNull();
		expect(container.querySelector('[role="tablist"]')).toBeTruthy();
		expect(bodyOf(container).textContent).toBe('Body one');
	});

	it('puts the button in the tab row when there is no header to hold it', () => {
		const {container} = render(<Panel tabs={TABS} icon={"ri-close-line"}></Panel>);
		expect(container.querySelector('.blue-orange-foundations-panel-header')).toBeNull();
		const row = container.querySelector('.blue-orange-foundations-panel-tab-row')!;
		expect(row.lastElementChild!.classList.contains('blue-orange-foundations-panel-header-btn')).toBe(true);
	});

	it('puts the button before the tabs on the left', () => {
		const {container} = render(
			<Panel tabs={TABS} icon={"ri-close-line"} iconPos={PanelIconPos.LEFT}></Panel>
		);
		const row = container.querySelector('.blue-orange-foundations-panel-tab-row')!;
		expect(row.firstElementChild!.classList.contains('blue-orange-foundations-panel-header-btn')).toBe(true);
	});

	it('reports the tab row button being clicked', () => {
		const onIconClick = vi.fn();
		const {container} = render(<Panel tabs={TABS} icon={"ri-close-line"} onIconClick={onIconClick}></Panel>);
		fireEvent.click(container.querySelector('.blue-orange-foundations-panel-header-btn')!);
		expect(onIconClick).toHaveBeenCalled();
	});

	it('keeps the button in the header when there is a header beside the tabs', () => {
		const {container} = render(<Panel header={"A header"} tabs={TABS} icon={"ri-close-line"}></Panel>);
		const header = container.querySelector('.blue-orange-foundations-panel-header')!;
		expect(header.lastElementChild!.classList.contains('blue-orange-foundations-panel-header-btn')).toBe(true);
		expect(container.querySelectorAll('.blue-orange-foundations-panel-header-btn').length).toBe(1);
	});

	it('leaves the tab strip out until tabs are given', () => {
		const {container} = render(<Panel><span>Body</span></Panel>);
		expect(container.querySelector('[role="tablist"]')).toBeNull();
	});

	it('selects the first tab by default', () => {
		const {container} = render(<Panel tabs={TABS}></Panel>);
		expect(triggerOf('One').getAttribute('aria-selected')).toBe('true');
		expect(bodyOf(container).textContent).toBe('Body one');
	});

	it('shows the content of the tab that was clicked', () => {
		const {container} = render(<Panel tabs={TABS}></Panel>);
		fireEvent.click(triggerOf('Two'));
		expect(triggerOf('Two').getAttribute('aria-selected')).toBe('true');
		expect(bodyOf(container).textContent).toBe('Body two');
	});

	it('reports the tab that was clicked', () => {
		const onTabClick = vi.fn();
		render(<Panel tabs={TABS} onTabClick={onTabClick}></Panel>);
		fireEvent.click(triggerOf('Two'));
		expect(onTabClick).toHaveBeenCalledWith('two');
	});

	it('never selects a disabled tab', () => {
		const onTabClick = vi.fn();
		render(<Panel tabs={TABS} onTabClick={onTabClick}></Panel>);
		fireEvent.click(triggerOf('Three'));
		expect(triggerOf('Three').getAttribute('aria-selected')).toBe('false');
		expect(onTabClick).not.toHaveBeenCalled();
	});

	it('skips the disabled tab when the arrow keys move the selection', () => {
		render(<Panel tabs={TABS}></Panel>);
		fireEvent.keyDown(triggerOf('One'), {key: 'ArrowRight'});
		expect(triggerOf('Two').getAttribute('aria-selected')).toBe('true');
		fireEvent.keyDown(triggerOf('Two'), {key: 'ArrowRight'});
		expect(triggerOf('One').getAttribute('aria-selected')).toBe('true');
	});

	it('keeps rendering its children for a tab that carries no content', () => {
		const {container} = render(
			<Panel tabs={[{uuid: "one", label: "One"}, {uuid: "two", label: "Two"}]}>
				<span>Body</span>
			</Panel>
		);
		fireEvent.click(triggerOf('Two'));
		expect(bodyOf(container).textContent).toBe('Body');
	});

	it('follows the active tab it is given', () => {
		const Harness: React.FC = () => {
			const [active, setActive] = useState("one");
			return (
				<>
					<button onClick={() => setActive("two")}>select two</button>
					<Panel tabs={TABS} activeTab={active}></Panel>
				</>
			);
		}
		const {container} = render(<Harness/>);
		fireEvent.click(screen.getByText('select two'));
		expect(triggerOf('Two').getAttribute('aria-selected')).toBe('true');
		expect(bodyOf(container).textContent).toBe('Body two');
	});

	it('scrolls the selected tab into view when it is selected from the outside', () => {
		const scrollIntoView = vi.fn();
		Element.prototype.scrollIntoView = scrollIntoView;
		const Harness: React.FC = () => {
			const [active, setActive] = useState("one");
			return (
				<>
					<button onClick={() => setActive("two")}>select two</button>
					<Panel tabs={TABS} activeTab={active}></Panel>
				</>
			);
		}
		render(<Harness/>);
		scrollIntoView.mockClear();
		fireEvent.click(screen.getByText('select two'));
		expect(scrollIntoView).toHaveBeenCalled();
	});

	it('falls back to the first tab left when the selected one is taken away', () => {
		const Harness: React.FC = () => {
			const [tabs, setTabs] = useState(TABS);
			return (
				<>
					<button onClick={() => setTabs(TABS.filter(tab => tab.uuid !== "two"))}>deselect two</button>
					<Panel tabs={tabs}></Panel>
				</>
			);
		}
		const {container} = render(<Harness/>);
		fireEvent.click(triggerOf('Two'));
		fireEvent.click(screen.getByText('deselect two'));
		expect(triggerOf('One').getAttribute('aria-selected')).toBe('true');
		expect(bodyOf(container).textContent).toBe('Body one');
	});
});
