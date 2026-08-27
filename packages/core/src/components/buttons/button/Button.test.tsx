import React, {useState} from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {Button, ButtonType} from './Button';

const btn = () => document.querySelector('.foundations-default-btn') as HTMLElement;
const isPaintedDisabled = () => btn().classList.contains('foundations-default-btn-disabled');

describe('Button disabled state', () => {

    it('paints the disabled class when mounted disabled', () => {
        render(<Button text="Submit" buttonType={ButtonType.PRIMARY} isDisabled={true}/>);
        expect(isPaintedDisabled()).toBe(true);
    });

    // The regression this guards: the class name used to be seeded into state at
    // mount and only re-derived by an effect keyed on [isLoading], so a button
    // that mounted disabled stayed painted disabled forever. Every form whose
    // submit is gated on validity mounts disabled, so none of them could ever
    // visibly enable.
    it('stops painting disabled once isDisabled goes false', () => {
        const Harness = () => {
            const [disabled, setDisabled] = useState(true);
            return (
                <div>
                    <button data-testid="enable" onClick={() => setDisabled(false)}>enable</button>
                    <Button text="Submit" buttonType={ButtonType.PRIMARY} isDisabled={disabled}/>
                </div>
            );
        };
        render(<Harness/>);
        expect(isPaintedDisabled()).toBe(true);

        fireEvent.click(screen.getByTestId('enable'));
        expect(isPaintedDisabled()).toBe(false);
    });

    it('starts painting disabled once isDisabled goes true', () => {
        const Harness = () => {
            const [disabled, setDisabled] = useState(false);
            return (
                <div>
                    <button data-testid="disable" onClick={() => setDisabled(true)}>disable</button>
                    <Button text="Submit" buttonType={ButtonType.PRIMARY} isDisabled={disabled}/>
                </div>
            );
        };
        render(<Harness/>);
        expect(isPaintedDisabled()).toBe(false);

        fireEvent.click(screen.getByTestId('disable'));
        expect(isPaintedDisabled()).toBe(true);
    });

    it('keeps what is painted and what is clickable in agreement', () => {
        const onClick = vi.fn();
        const Harness = () => {
            const [disabled, setDisabled] = useState(true);
            return (
                <div>
                    <button data-testid="enable" onClick={() => setDisabled(false)}>enable</button>
                    <Button text="Submit" buttonType={ButtonType.PRIMARY} isDisabled={disabled} onClick={onClick}/>
                </div>
            );
        };
        render(<Harness/>);

        fireEvent.click(btn());
        expect(onClick).not.toHaveBeenCalled();
        expect(isPaintedDisabled()).toBe(true);

        fireEvent.click(screen.getByTestId('enable'));
        fireEvent.click(btn());
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(isPaintedDisabled()).toBe(false);
    });

    it('follows isLoading, and shows the spinner instead of the text', () => {
        const {rerender} = render(
            <Button text="Submit" buttonType={ButtonType.PRIMARY} isLoading={false}/>);
        expect(isPaintedDisabled()).toBe(false);
        expect(screen.getByText('Submit')).toBeTruthy();

        rerender(<Button text="Submit" buttonType={ButtonType.PRIMARY} isLoading={true}/>);
        expect(isPaintedDisabled()).toBe(true);
        expect(document.querySelector('.foundations-btn-rotate-spinner')).toBeTruthy();
    });

    it('follows a changed buttonType and size', () => {
        const {rerender} = render(
            <Button text="Submit" buttonType={ButtonType.PRIMARY}/>);
        expect(btn().classList.contains('foundations-primary-btn')).toBe(true);

        rerender(<Button text="Submit" buttonType={ButtonType.DANGER}/>);
        expect(btn().classList.contains('foundations-danger-btn')).toBe(true);
        expect(btn().classList.contains('foundations-primary-btn')).toBe(false);
    });
});

describe('Button success and error animations', () => {

    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('paints success while the animation runs, then returns to the base style', () => {
        const onComplete = vi.fn();
        render(<Button text="Save" buttonType={ButtonType.PRIMARY} isSuccess={true}
                       successClearAnimationTime={1000} onSuccessAnimationComplete={onComplete}/>);

        expect(btn().classList.contains('foundations-success-btn')).toBe(true);

        act(() => { vi.advanceTimersByTime(1000); });

        expect(btn().classList.contains('foundations-success-btn')).toBe(false);
        expect(btn().classList.contains('foundations-primary-btn')).toBe(true);
        expect(onComplete).toHaveBeenCalled();
    });

    it('returns to the disabled style when the button is disabled underneath', () => {
        render(<Button text="Save" buttonType={ButtonType.PRIMARY} isDisabled={true} isSuccess={true}
                       successClearAnimationTime={1000}/>);

        act(() => { vi.advanceTimersByTime(1000); });

        // The old timeout closed over the values captured when the effect ran;
        // deriving the class name means it lands on the current ones.
        expect(isPaintedDisabled()).toBe(true);
    });

    it('holds the success style when successClear is off', () => {
        render(<Button text="Save" buttonType={ButtonType.PRIMARY} isSuccess={true} successClear={false}/>);
        act(() => { vi.advanceTimersByTime(5000); });
        expect(btn().classList.contains('foundations-success-btn')).toBe(true);
    });

    it('paints error while the animation runs, then returns to the base style', () => {
        const onComplete = vi.fn();
        render(<Button text="Save" buttonType={ButtonType.PRIMARY} isError={true}
                       errorClearAnimationTime={1000} onErrorAnimationComplete={onComplete}/>);

        expect(btn().classList.contains('foundations-danger-btn')).toBe(true);

        act(() => { vi.advanceTimersByTime(1000); });

        expect(btn().classList.contains('foundations-danger-btn')).toBe(false);
        expect(onComplete).toHaveBeenCalled();
    });

    it('does not fire the completion callback after unmount', () => {
        const onComplete = vi.fn();
        const {unmount} = render(
            <Button text="Save" buttonType={ButtonType.PRIMARY} isSuccess={true}
                    successClearAnimationTime={1000} onSuccessAnimationComplete={onComplete}/>);
        unmount();

        act(() => { vi.advanceTimersByTime(1000); });

        expect(onComplete).not.toHaveBeenCalled();
    });
});
