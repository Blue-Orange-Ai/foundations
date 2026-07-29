import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {InputOTP} from './InputOTP';
import {InputOTPGroup} from '../input-otp-group/InputOTPGroup';
import {InputOTPSlot} from '../input-otp-slot/InputOTPSlot';
import {InputOTPSeparator} from '../input-otp-separator/InputOTPSeparator';

const hiddenInput = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-input-otp-hidden-input') as HTMLInputElement;
}

const slots = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-input-otp-slot'));
}

describe('InputOTP', () => {

	it('renders one slot per character of the code', () => {
		const {container} = render(<InputOTP maxLength={6}></InputOTP>);
		expect(slots(container).length).toBe(6);
	});

	it('splits the slots into the groups it is given', () => {
		const {container} = render(<InputOTP maxLength={6} groups={[3, 3]}></InputOTP>);
		expect(container.querySelectorAll('.blue-orange-input-otp-group').length).toBe(2);
		expect(container.querySelectorAll('.blue-orange-input-otp-separator').length).toBe(1);
	});

	it('renders the value across the slots', () => {
		const {container} = render(<InputOTP maxLength={4} value="1234"></InputOTP>);
		expect(slots(container).map(slot => slot.textContent)).toEqual(['1', '2', '3', '4']);
	});

	it('fills the slots as the code is typed', () => {
		const {container} = render(<InputOTP maxLength={4}></InputOTP>);
		fireEvent.change(hiddenInput(container), {target: {value: '12'}});
		expect(slots(container).map(slot => slot.textContent)).toEqual(['1', '2', '', '']);
	});

	it('reports every change', () => {
		const onChange = vi.fn();
		const {container} = render(<InputOTP maxLength={4} onChange={onChange}></InputOTP>);
		fireEvent.change(hiddenInput(container), {target: {value: '12'}});
		expect(onChange).toHaveBeenCalledWith('12');
	});

	it('fires onComplete once every slot is filled', () => {
		const onComplete = vi.fn();
		const {container} = render(<InputOTP maxLength={4} onComplete={onComplete}></InputOTP>);
		fireEvent.change(hiddenInput(container), {target: {value: '123'}});
		expect(onComplete).not.toHaveBeenCalled();
		fireEvent.change(hiddenInput(container), {target: {value: '1234'}});
		expect(onComplete).toHaveBeenCalledWith('1234');
	});

	it('accepts a pasted code', () => {
		const {container} = render(<InputOTP maxLength={6} groups={[3, 3]}></InputOTP>);
		fireEvent.change(hiddenInput(container), {target: {value: '987654'}});
		expect(slots(container).map(slot => slot.textContent).join('')).toBe('987654');
	});

	it('never takes more characters than there are slots', () => {
		const onChange = vi.fn();
		const {container} = render(<InputOTP maxLength={4} onChange={onChange}></InputOTP>);
		fireEvent.change(hiddenInput(container), {target: {value: '123456789'}});
		expect(onChange).toHaveBeenCalledWith('1234');
	});

	it('drops anything that is not a digit when numeric', () => {
		const onChange = vi.fn();
		const {container} = render(<InputOTP maxLength={4} isNumeric={true} onChange={onChange}></InputOTP>);
		fireEvent.change(hiddenInput(container), {target: {value: 'a1b2'}});
		expect(onChange).toHaveBeenCalledWith('12');
	});

	it('honours a custom allowed pattern', () => {
		const onChange = vi.fn();
		const {container} = render(<InputOTP maxLength={4} allowedPattern={/^[A-Z]*$/} onChange={onChange}></InputOTP>);
		fireEvent.change(hiddenInput(container), {target: {value: 'aBcD'}});
		expect(onChange).toHaveBeenCalledWith('BD');
	});

	it('switches the mobile keyboard to numeric', () => {
		const {container} = render(<InputOTP maxLength={4} isNumeric={true}></InputOTP>);
		expect(hiddenInput(container).getAttribute('inputmode')).toBe('numeric');
	});

	it('asks the browser for one time codes', () => {
		const {container} = render(<InputOTP maxLength={4}></InputOTP>);
		expect(hiddenInput(container).getAttribute('autocomplete')).toBe('one-time-code');
	});

	it('follows the value prop when it changes', () => {
		const {container, rerender} = render(<InputOTP maxLength={4} value="12"></InputOTP>);
		rerender(<InputOTP maxLength={4} value="1234"></InputOTP>);
		expect(slots(container).map(slot => slot.textContent).join('')).toBe('1234');
	});

	it('marks the caret slot once the field is focused', () => {
		const {container} = render(<InputOTP maxLength={4}></InputOTP>);
		fireEvent.focus(hiddenInput(container));
		expect(slots(container)[0].classList.contains('blue-orange-input-otp-slot-active')).toBe(true);
	});

	it('renders slots that were composed by hand', () => {
		const {container} = render(
			<InputOTP maxLength={4} value="1234">
				<InputOTPGroup>
					<InputOTPSlot index={0}></InputOTPSlot>
					<InputOTPSlot index={1}></InputOTPSlot>
				</InputOTPGroup>
				<InputOTPSeparator></InputOTPSeparator>
				<InputOTPGroup>
					<InputOTPSlot index={2}></InputOTPSlot>
					<InputOTPSlot index={3}></InputOTPSlot>
				</InputOTPGroup>
			</InputOTP>
		);
		expect(slots(container).map(slot => slot.textContent)).toEqual(['1', '2', '3', '4']);
	});

	it('renders its label', () => {
		render(<InputOTP maxLength={4} label="Verification code"></InputOTP>);
		expect(screen.getByText('Verification code')).toBeInTheDocument();
	});

	it('disables the field when disabled', () => {
		const {container} = render(<InputOTP maxLength={4} disabled={true}></InputOTP>);
		expect(hiddenInput(container).disabled).toBe(true);
	});
});
