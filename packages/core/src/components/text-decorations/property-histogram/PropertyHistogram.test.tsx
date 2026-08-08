import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {PropertyHistogram, PropertyHistogramProperty} from './PropertyHistogram';

const PROPERTIES: PropertyHistogramProperty[] = [
	{label: 'Chrome', value: 50},
	{label: 'Safari', value: 30},
	{label: 'Firefox', value: 20}
];

const bars = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll<HTMLElement>('.blue-orange-property-histogram-item-histogram-percentage'));
}

describe('PropertyHistogram', () => {

	it('renders every property and sizes the bars against the total', () => {
		const {container} = render(<PropertyHistogram properties={PROPERTIES}></PropertyHistogram>);
		expect(screen.getByText('Chrome')).toBeInTheDocument();
		expect(bars(container).map(bar => bar.style.width)).toEqual(['50%', '30%', '20%']);
	});

	it('sizes the bars against an explicit total', () => {
		const {container} = render(<PropertyHistogram properties={PROPERTIES} total={200}></PropertyHistogram>);
		expect(bars(container).map(bar => bar.style.width)).toEqual(['25%', '15%', '10%']);
	});

	it('truncates to maxProperties and reports the remainder on the see more button', () => {
		const onSeeMore = vi.fn();
		render(<PropertyHistogram properties={PROPERTIES} maxProperties={2} onSeeMore={onSeeMore}></PropertyHistogram>);
		expect(screen.queryByText('Firefox')).toBeNull();
		fireEvent.click(screen.getByText('See more (1)'));
		expect(onSeeMore).toHaveBeenCalledTimes(1);
	});

	it('hides the see more button when nothing is truncated', () => {
		render(<PropertyHistogram properties={PROPERTIES}></PropertyHistogram>);
		expect(screen.queryByText(/See more/)).toBeNull();
	});

	it('shows the see more button when the flag is set without truncation', () => {
		render(<PropertyHistogram properties={PROPERTIES} seeMore={true}></PropertyHistogram>);
		expect(screen.getByText('See more')).toBeInTheDocument();
	});

	it('applies the property colour over the component colour', () => {
		const {container} = render(
			<PropertyHistogram
				properties={[{label: 'Chrome', value: 1, color: 'red'}, {label: 'Safari', value: 1}]}
				color={'blue'}
			></PropertyHistogram>
		);
		expect(bars(container).map(bar => bar.style.background)).toEqual(['red', 'blue']);
	});

	it('leaves every bar empty when the total is zero', () => {
		const {container} = render(<PropertyHistogram properties={[{label: 'Chrome', value: 0}]}></PropertyHistogram>);
		expect(bars(container).map(bar => bar.style.width)).toEqual(['0%']);
	});

	it('attaches a percentage tooltip to the bar container unless it is disabled', () => {
		const {container: withTooltip} = render(<PropertyHistogram properties={PROPERTIES}></PropertyHistogram>);
		const bar = withTooltip.querySelector('.blue-orange-property-histogram-item-histogram-cont')!;
		expect((bar as any)._tippy.props.content).toEqual('50%');

		const {container: withoutTooltip} = render(<PropertyHistogram properties={PROPERTIES} tooltip={false}></PropertyHistogram>);
		const plainBar = withoutTooltip.querySelector('.blue-orange-property-histogram-item-histogram-cont')!;
		expect((plainBar as any)._tippy).toBeUndefined();
	});
});
