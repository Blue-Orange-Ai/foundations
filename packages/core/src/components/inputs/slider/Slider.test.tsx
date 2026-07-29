import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Slider} from './Slider';

const thumbs = () => screen.getAllByRole('slider');

describe('Slider', () => {

	it('renders a single thumb for a single value', () => {
		render(<Slider value={40}></Slider>);
		expect(thumbs().length).toBe(1);
		expect(thumbs()[0].getAttribute('aria-valuenow')).toBe('40');
	});

	it('renders a thumb per entry of a range', () => {
		render(<Slider value={[20, 70]}></Slider>);
		expect(thumbs().length).toBe(2);
	});

	it('steps up with the right arrow', () => {
		const onChange = vi.fn();
		render(<Slider value={40} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'ArrowRight'});
		expect(onChange).toHaveBeenCalledWith(41);
	});

	it('steps down with the left arrow', () => {
		const onChange = vi.fn();
		render(<Slider value={40} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'ArrowLeft'});
		expect(onChange).toHaveBeenCalledWith(39);
	});

	it('uses the step size when stepping', () => {
		const onChange = vi.fn();
		render(<Slider value={40} step={5} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'ArrowRight'});
		expect(onChange).toHaveBeenCalledWith(45);
	});

	it('keeps the precision of a fractional step', () => {
		const onChange = vi.fn();
		render(<Slider value={21} min={16} max={28} step={0.5} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'ArrowRight'});
		expect(onChange).toHaveBeenCalledWith(21.5);
	});

	it('jumps by ten steps with page up', () => {
		const onChange = vi.fn();
		render(<Slider value={40} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'PageUp'});
		expect(onChange).toHaveBeenCalledWith(50);
	});

	it('jumps to the ends with home and end', () => {
		const onChange = vi.fn();
		render(<Slider value={40} min={10} max={90} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'End'});
		expect(onChange).toHaveBeenCalledWith(90);
		fireEvent.keyDown(thumbs()[0], {key: 'Home'});
		expect(onChange).toHaveBeenCalledWith(10);
	});

	it('never steps past the maximum', () => {
		const onChange = vi.fn();
		render(<Slider value={100} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'ArrowRight'});
		expect(onChange).toHaveBeenCalledWith(100);
	});

	it('never steps past the minimum', () => {
		const onChange = vi.fn();
		render(<Slider value={0} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'ArrowLeft'});
		expect(onChange).toHaveBeenCalledWith(0);
	});

	it('stops a range thumb at its neighbour', () => {
		const onChange = vi.fn();
		render(<Slider value={[20, 70]} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'End'});
		expect(onChange).toHaveBeenCalledWith([70, 70]);
	});

	it('reports a range as an array', () => {
		const onChange = vi.fn();
		render(<Slider value={[20, 70]} step={10} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[1], {key: 'ArrowRight'});
		expect(onChange).toHaveBeenCalledWith([20, 80]);
	});

	it('ignores the keyboard when disabled', () => {
		const onChange = vi.fn();
		render(<Slider value={40} disabled={true} onChange={onChange}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'ArrowRight'});
		expect(onChange).not.toHaveBeenCalled();
	});

	it('fires onChangeComplete once a key press settles', () => {
		const onChangeComplete = vi.fn();
		render(<Slider value={40} onChangeComplete={onChangeComplete}></Slider>);
		fireEvent.keyDown(thumbs()[0], {key: 'ArrowRight'});
		expect(onChangeComplete).toHaveBeenCalledWith(41);
	});

	it('snaps a value that is off the step grid', () => {
		render(<Slider value={43} step={10}></Slider>);
		expect(thumbs()[0].getAttribute('aria-valuenow')).toBe('40');
	});

	it('shows the formatted value when asked', () => {
		render(<Slider label="Budget" value={40} showValue={true} formatValue={(value) => '£' + value}></Slider>);
		expect(screen.getByText('£40')).toBeInTheDocument();
	});

	it('joins both ends of a range in the printed value', () => {
		render(<Slider value={[20, 70]} showValue={true}></Slider>);
		expect(screen.getByText('20 – 70')).toBeInTheDocument();
	});
});
