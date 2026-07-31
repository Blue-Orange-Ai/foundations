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
        const {baseElement} = render(<Modal><span>Body</span></Modal>);
        expect(baseElement.querySelector('.blue-orange-modal-window')).toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-modal-backdrop')).toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-modal-card')).toBeInTheDocument();
    });

    it('portals the window out of the caller tree and into the body', () => {
        // an ancestor with a transform would otherwise become the containing block for the fixed
        // window and trap it inside that panel's scroll area
        const {container} = render(<div style={{transform: 'translateZ(0)'}}><Modal><span>Body</span></Modal></div>);
        expect(container.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();
        expect(document.body.querySelector('.blue-orange-modal-window')).toBeInTheDocument();
    });

    it('carries a dark wrapper through the portal', () => {
        // the portal leaves the wrapper behind, so the class has to be re-applied on the window or
        // an assistant that scopes `dark` to itself would render a light modal
        render(<div className="dark"><Modal><span>Body</span></Modal></div>);
        expect(document.body.querySelector('.blue-orange-modal-window')).toHaveClass('dark');
    });

    it('does not mark the window dark outside a dark wrapper', () => {
        render(<div><Modal><span>Body</span></Modal></div>);
        expect(document.body.querySelector('.blue-orange-modal-window')).not.toHaveClass('dark');
    });

    it('renders into a container when one is given', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        render(<Modal container={host}><span>Body</span></Modal>);
        expect(host.querySelector('.blue-orange-modal-window')).toBeInTheDocument();
        host.remove();
    });

    it('animates in when rendered without an open prop', () => {
        const {baseElement} = render(<Modal><span>Body</span></Modal>);
        settleOpen();
        expect(baseElement.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();
    });

    it('applies width, minWidth and minHeight to the card', () => {
        const {baseElement} = render(<Modal width={720} minWidth={600} minHeight={320}><span>Body</span></Modal>);
        const card = baseElement.querySelector('.blue-orange-modal-card') as HTMLElement;
        expect(card.style.width).toBe('720px');
        expect(card.style.minWidth).toBe('600px');
        expect(card.style.minHeight).toBe('320px');
    });

    it('calls onClose when the backdrop is clicked', () => {
        const onClose = vi.fn();
        const {baseElement} = render(<Modal onClose={onClose}><span>Body</span></Modal>);
        fireEvent.click(baseElement.querySelector('.blue-orange-modal-backdrop')!);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not throw when the backdrop is clicked without an onClose', () => {
        const {baseElement} = render(<Modal><span>Body</span></Modal>);
        expect(() => fireEvent.click(baseElement.querySelector('.blue-orange-modal-backdrop')!)).not.toThrow();
    });

    // ── Controlled (open provided) ─────────────────────────────

    it('renders nothing when open is false', () => {
        const {baseElement} = render(<Modal open={false}><span>Body</span></Modal>);
        expect(baseElement.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();
        expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });

    it('renders when open is true', () => {
        render(<Modal open={true}><span>Body</span></Modal>);
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('mounts and animates in when open flips to true', () => {
        const {baseElement, rerender} = render(<Modal open={false}><span>Body</span></Modal>);
        expect(baseElement.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();

        rerender(<Modal open={true}><span>Body</span></Modal>);
        expect(baseElement.querySelector('.blue-orange-modal-window')).toBeInTheDocument();

        settleOpen();
        expect(baseElement.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();
    });

    it('stays mounted while it animates out, then unmounts', () => {
        const {baseElement, rerender} = render(<Modal open={true}><span>Body</span></Modal>);
        settleOpen();
        expect(baseElement.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();

        rerender(<Modal open={false}><span>Body</span></Modal>);
        // still in the DOM, but no longer in the open state
        expect(baseElement.querySelector('.blue-orange-modal-window')).toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-modal-window-open')).not.toBeInTheDocument();

        settleClose();
        expect(baseElement.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();
    });

    it('re-opens cleanly after closing', () => {
        const {baseElement, rerender} = render(<Modal open={true}><span>Body</span></Modal>);
        settleOpen();

        rerender(<Modal open={false}><span>Body</span></Modal>);
        settleClose();
        expect(baseElement.querySelector('.blue-orange-modal-window')).not.toBeInTheDocument();

        rerender(<Modal open={true}><span>Body</span></Modal>);
        settleOpen();
        expect(baseElement.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();
    });

    it('cancels the pending unmount when re-opened mid close', () => {
        const {baseElement, rerender} = render(<Modal open={true}><span>Body</span></Modal>);
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
        expect(baseElement.querySelector('.blue-orange-modal-window-open')).toBeInTheDocument();
    });
});
