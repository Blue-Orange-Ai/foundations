import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {Drawer, DrawerPosition} from './Drawer';

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

describe('Drawer', () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ── Uncontrolled (open omitted) ────────────────────────────

    it('renders its children when open is not provided', () => {
        render(<Drawer><span>Body</span></Drawer>);
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('renders the window, backdrop and content', () => {
        const {baseElement} = render(<Drawer><span>Body</span></Drawer>);
        expect(baseElement.querySelector('.blue-orange-drawer-window')).toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-drawer-backdrop')).toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-drawer-content')).toBeInTheDocument();
    });

    it('portals the window out of the caller tree and into the body', () => {
        // an ancestor with a transform would otherwise become the containing block for the fixed
        // window and trap it inside that panel's scroll area
        const {container} = render(<div style={{transform: 'translateZ(0)'}}><Drawer><span>Body</span></Drawer></div>);
        expect(container.querySelector('.blue-orange-drawer-window')).not.toBeInTheDocument();
        expect(document.body.querySelector('.blue-orange-drawer-window')).toBeInTheDocument();
    });

    it('carries a dark wrapper through the portal', () => {
        // the portal leaves the wrapper behind, so the class has to be re-applied on the window or
        // an assistant that scopes `dark` to itself would render a light drawer
        render(<div className="dark"><Drawer><span>Body</span></Drawer></div>);
        expect(document.body.querySelector('.blue-orange-drawer-window')).toHaveClass('dark');
    });

    it('does not mark the window dark outside a dark wrapper', () => {
        render(<div><Drawer><span>Body</span></Drawer></div>);
        expect(document.body.querySelector('.blue-orange-drawer-window')).not.toHaveClass('dark');
    });

    it('defaults to the top position', () => {
        const {baseElement} = render(<Drawer><span>Body</span></Drawer>);
        expect(baseElement.querySelector('.blue-orange-drawer-card-top')).toBeInTheDocument();
    });

    it.each([
        [DrawerPosition.LEFT, '.blue-orange-drawer-card-left'],
        [DrawerPosition.RIGHT, '.blue-orange-drawer-card-right'],
        [DrawerPosition.TOP, '.blue-orange-drawer-card-top'],
        [DrawerPosition.BOTTOM, '.blue-orange-drawer-card-bottom'],
    ])('renders the card for each position', (position, selector) => {
        const {baseElement} = render(<Drawer position={position}><span>Body</span></Drawer>);
        expect(baseElement.querySelector(selector as string)).toBeInTheDocument();
    });

    it('applies width to left and right drawers', () => {
        const {baseElement} = render(<Drawer position={DrawerPosition.RIGHT} width="420px"><span>Body</span></Drawer>);
        const card = baseElement.querySelector('.blue-orange-drawer-card-right') as HTMLElement;
        expect(card.style.width).toBe('420px');
    });

    it('applies height to top and bottom drawers', () => {
        const {baseElement} = render(<Drawer position={DrawerPosition.BOTTOM} height="320px"><span>Body</span></Drawer>);
        const card = baseElement.querySelector('.blue-orange-drawer-card-bottom') as HTMLElement;
        expect(card.style.height).toBe('320px');
    });

    it('animates in when rendered without an open prop', () => {
        const {baseElement} = render(<Drawer position={DrawerPosition.RIGHT}><span>Body</span></Drawer>);
        expect(baseElement.querySelector('.blue-orange-drawer-card-enter')).not.toBeInTheDocument();

        settleOpen();
        expect(baseElement.querySelector('.blue-orange-drawer-card-enter')).toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-drawer-window-open')).toBeInTheDocument();
    });

    it('calls onClose when the backdrop is clicked', () => {
        const onClose = vi.fn();
        const {baseElement} = render(<Drawer onClose={onClose}><span>Body</span></Drawer>);
        fireEvent.click(baseElement.querySelector('.blue-orange-drawer-backdrop')!);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not throw when the backdrop is clicked without an onClose', () => {
        const {baseElement} = render(<Drawer><span>Body</span></Drawer>);
        expect(() => fireEvent.click(baseElement.querySelector('.blue-orange-drawer-backdrop')!)).not.toThrow();
    });

    // ── Controlled (open provided) ─────────────────────────────

    it('renders nothing when open is false', () => {
        const {baseElement} = render(<Drawer open={false}><span>Body</span></Drawer>);
        expect(baseElement.querySelector('.blue-orange-drawer-window')).not.toBeInTheDocument();
        expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });

    it('mounts and slides in when open flips to true', () => {
        const {baseElement, rerender} = render(
            <Drawer open={false} position={DrawerPosition.RIGHT}><span>Body</span></Drawer>);
        expect(baseElement.querySelector('.blue-orange-drawer-window')).not.toBeInTheDocument();

        rerender(<Drawer open={true} position={DrawerPosition.RIGHT}><span>Body</span></Drawer>);
        expect(baseElement.querySelector('.blue-orange-drawer-card-right')).toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-drawer-card-enter')).not.toBeInTheDocument();

        settleOpen();
        expect(baseElement.querySelector('.blue-orange-drawer-card-enter')).toBeInTheDocument();
    });

    it('stays mounted while it slides out, then unmounts', () => {
        const {baseElement, rerender} = render(
            <Drawer open={true} position={DrawerPosition.RIGHT}><span>Body</span></Drawer>);
        settleOpen();
        expect(baseElement.querySelector('.blue-orange-drawer-card-enter')).toBeInTheDocument();

        rerender(<Drawer open={false} position={DrawerPosition.RIGHT}><span>Body</span></Drawer>);
        // still mounted, but back in its off screen state so the transition runs
        expect(baseElement.querySelector('.blue-orange-drawer-card-right')).toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-drawer-card-enter')).not.toBeInTheDocument();
        expect(baseElement.querySelector('.blue-orange-drawer-window-open')).not.toBeInTheDocument();

        settleClose();
        expect(baseElement.querySelector('.blue-orange-drawer-window')).not.toBeInTheDocument();
    });

    it('re-opens cleanly after closing', () => {
        const {baseElement, rerender} = render(
            <Drawer open={true} position={DrawerPosition.LEFT}><span>Body</span></Drawer>);
        settleOpen();

        rerender(<Drawer open={false} position={DrawerPosition.LEFT}><span>Body</span></Drawer>);
        settleClose();
        expect(baseElement.querySelector('.blue-orange-drawer-window')).not.toBeInTheDocument();

        rerender(<Drawer open={true} position={DrawerPosition.LEFT}><span>Body</span></Drawer>);
        settleOpen();
        expect(baseElement.querySelector('.blue-orange-drawer-card-enter')).toBeInTheDocument();
    });

    it('cancels the pending unmount when re-opened mid close', () => {
        const {baseElement, rerender} = render(
            <Drawer open={true} position={DrawerPosition.RIGHT}><span>Body</span></Drawer>);
        settleOpen();

        rerender(<Drawer open={false} position={DrawerPosition.RIGHT}><span>Body</span></Drawer>);
        act(() => {
            vi.advanceTimersByTime(100);
        });
        rerender(<Drawer open={true} position={DrawerPosition.RIGHT}><span>Body</span></Drawer>);
        settleOpen();

        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(baseElement.querySelector('.blue-orange-drawer-card-enter')).toBeInTheDocument();
    });
});
