import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {Modal} from './Modal';

// The transition hook waits two animation frames before applying the open styles and 200ms before
// unmounting on close, so the tests drive both by hand.
const settleOpen = () => {
    act(() => {
        vi.advanceTimersByTime(50);
    });
};

const settleClose = () => {
    act(() => {
        vi.advanceTimersByTime(250);
    });
};

describe('Modal', () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ── Uncontrolled (open omitted) ────────────────────────────

    it('renders its children when open is not provided', () => {
        render(<Modal><span>Body</span></Modal>);
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('renders the window, backdrop and card', () => {
        const {container} = render(<Modal><span>Body</span></Modal>);
        expect(container.querySelector('.blue-orange-modal-window')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-modal-backdrop')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-modal-card')).toBeInTheDocument();
    });

    it('animates in when rendered without an open prop', () => {
        const {container} = render(<Modal><span>Body</span></Modal>);
        settleOpen();
        expect(container.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();
    });

    it('applies width, minWidth and minHeight to the card', () => {
        const {container} = render(<Modal width={720} minWidth={600} minHeight={320}><span>Body</span></Modal>);
        const card = container.querySelector('.blue-orange-modal-card') as HTMLElement;
        expect(card.style.width).toBe('720px');
        expect(card.style.minWidth).toBe('600px');
        expect(card.style.minHeight).toBe('320px');
    });

    it('calls onClose when the backdrop is clicked', () => {
        const onClose = vi.fn();
        const {container} = render(<Modal onClose={onClose}><span>Body</span></Modal>);
        fireEvent.click(container.querySelector('.blue-orange-modal-backdrop')!);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not throw when the backdrop is clicked without an onClose', () => {
        const {container} = render(<Modal><span>Body</span></Modal>);
        expect(() => fireEvent.click(container.querySelector('.blue-orange-modal-backdrop')!)).not.toThrow();
    });

    // ── Controlled (open provided) ─────────────────────────────

    it('renders nothing when open is false', () => {
        const {container} = render(<Modal open={false}><span>Body</span></Modal>);
        expect(container.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();
        expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });

    it('renders when open is true', () => {
        render(<Modal open={true}><span>Body</span></Modal>);
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('mounts and animates in when open flips to true', () => {
        const {container, rerender} = render(<Modal open={false}><span>Body</span></Modal>);
        expect(container.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();

        rerender(<Modal open={true}><span>Body</span></Modal>);
        expect(container.querySelector('.blue-orange-modal-window')).toBeInTheDocument();

        settleOpen();
        expect(container.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();
    });

    it('stays mounted while it animates out, then unmounts', () => {
        const {container, rerender} = render(<Modal open={true}><span>Body</span></Modal>);
        settleOpen();
        expect(container.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();

        rerender(<Modal open={false}><span>Body</span></Modal>);
        // still in the DOM, but no longer in the open state
        expect(container.querySelector('.blue-orange-modal-window')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-modal-window-open')).not.toBeInTheDocument();

        settleClose();
        expect(container.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();
    });

    it('re-opens cleanly after closing', () => {
        const {container, rerender} = render(<Modal open={true}><span>Body</span></Modal>);
        settleOpen();

        rerender(<Modal open={false}><span>Body</span></Modal>);
        settleClose();
        expect(container.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();

        rerender(<Modal open={true}><span>Body</span></Modal>);
        settleOpen();
        expect(container.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();
    });

    it('cancels the pending unmount when re-opened mid close', () => {
        const {container, rerender} = render(<Modal open={true}><span>Body</span></Modal>);
        settleOpen();

        rerender(<Modal open={false}><span>Body</span></Modal>);
        act(() => {
            vi.advanceTimersByTime(100);
        });
        rerender(<Modal open={true}><span>Body</span></Modal>);
        settleOpen();

        // the close timer from before must not tear the modal down
        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(container.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();
    });
});
