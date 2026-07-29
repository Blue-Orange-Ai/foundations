import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Carousel} from './Carousel';
import {CarouselOrientation} from './CarouselContext';
import {CarouselContent} from '../carousel-content/CarouselContent';
import {CarouselItem} from '../carousel-item/CarouselItem';
import {CarouselPrevious} from '../carousel-previous/CarouselPrevious';
import {CarouselNext} from '../carousel-next/CarouselNext';

const renderCarousel = (props: {loop?: boolean, itemsPerView?: number, gap?: number} = {}) => {
	return render(
		<Carousel loop={props.loop} itemsPerView={props.itemsPerView} gap={props.gap}>
			<CarouselPrevious></CarouselPrevious>
			<CarouselContent>
				<CarouselItem><span>One</span></CarouselItem>
				<CarouselItem><span>Two</span></CarouselItem>
				<CarouselItem><span>Three</span></CarouselItem>
			</CarouselContent>
			<CarouselNext></CarouselNext>
		</Carousel>
	);
}

const track = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-carousel-track') as HTMLElement;
}

const next = () => screen.getByLabelText('Next slide');

const previous = () => screen.getByLabelText('Previous slide');

describe('Carousel', () => {

	it('renders every item', () => {
		renderCarousel();
		expect(screen.getByText('One')).toBeInTheDocument();
		expect(screen.getByText('Three')).toBeInTheDocument();
	});

	it('starts on the first item', () => {
		const {container} = renderCarousel();
		expect(track(container).style.transform).toBe('translate3d(-0%, 0, 0)');
	});

	it('moves the track on when the next control is used', () => {
		const {container} = renderCarousel();
		// a step is the item width plus the gap that follows it, so the gap has to
		// be part of the offset or the previous item stays partly in view
		expect(track(container).style.transform).toBe('translate3d(-0%, 0, 0)');
		fireEvent.click(next());
		expect(track(container).style.transform).toBe('translate3d(calc(-100% - 16px), 0, 0)');
	});

	it('moves the track back when the previous control is used', () => {
		const {container} = renderCarousel();
		fireEvent.click(next());
		fireEvent.click(previous());
		expect(track(container).style.transform).toBe('translate3d(-0%, 0, 0)');
	});

	it('adds a gap to the offset for every step taken', () => {
		const {container} = renderCarousel();
		fireEvent.click(next());
		fireEvent.click(next());
		expect(track(container).style.transform).toBe('translate3d(calc(-200% - 32px), 0, 0)');
	});

	it('offsets by the percentage alone when there is no gap', () => {
		const {container} = renderCarousel({gap: 0});
		fireEvent.click(next());
		expect(track(container).style.transform).toBe('translate3d(-100%, 0, 0)');
	});

	it('disables the previous control on the first item', () => {
		renderCarousel();
		expect(previous().getAttribute('aria-disabled')).toBe('true');
	});

	it('disables the next control on the last item', () => {
		renderCarousel();
		fireEvent.click(next());
		fireEvent.click(next());
		expect(next().getAttribute('aria-disabled')).toBe('true');
	});

	it('goes no further than the last item', () => {
		const {container} = renderCarousel();
		fireEvent.click(next());
		fireEvent.click(next());
		fireEvent.click(next());
		expect(track(container).style.transform).toBe('translate3d(calc(-200% - 32px), 0, 0)');
	});

	it('wraps to the start when looping', () => {
		const {container} = renderCarousel({loop: true});
		fireEvent.click(next());
		fireEvent.click(next());
		fireEvent.click(next());
		expect(track(container).style.transform).toBe('translate3d(-0%, 0, 0)');
	});

	it('wraps to the end when looping backwards', () => {
		const {container} = renderCarousel({loop: true});
		fireEvent.click(previous());
		expect(track(container).style.transform).toBe('translate3d(calc(-200% - 32px), 0, 0)');
	});

	it('steps by one item however many are in view', () => {
		const {container} = renderCarousel({itemsPerView: 2});
		// the item is (100% - 16px) / 2 wide, so the step is 50% + 8px
		fireEvent.click(next());
		expect(track(container).style.transform).toBe('translate3d(calc(-50% - 8px), 0, 0)');
	});

	it('offsets down the track when vertical', () => {
		const {container} = render(
			<Carousel orientation={CarouselOrientation.VERTICAL}>
				<CarouselContent>
					<CarouselItem><span>One</span></CarouselItem>
					<CarouselItem><span>Two</span></CarouselItem>
				</CarouselContent>
				<CarouselNext></CarouselNext>
			</Carousel>
		);
		fireEvent.click(next());
		expect(track(container).style.transform).toBe('translate3d(0, calc(-100% - 16px), 0)');
	});

	it('stops once the last item is in view', () => {
		renderCarousel({itemsPerView: 2});
		fireEvent.click(next());
		expect(next().getAttribute('aria-disabled')).toBe('true');
	});

	it('moves with the arrow keys', () => {
		const {container} = renderCarousel();
		fireEvent.keyDown(container.querySelector('.blue-orange-carousel')!, {key: 'ArrowRight'});
		expect(track(container).style.transform).toBe('translate3d(calc(-100% - 16px), 0, 0)');
	});

	it('reports the item it moved to', () => {
		const onIndexChange = vi.fn();
		render(
			<Carousel onIndexChange={onIndexChange}>
				<CarouselContent>
					<CarouselItem><span>One</span></CarouselItem>
					<CarouselItem><span>Two</span></CarouselItem>
				</CarouselContent>
				<CarouselNext></CarouselNext>
			</Carousel>
		);
		fireEvent.click(next());
		expect(onIndexChange).toHaveBeenCalledWith(1);
	});
});
