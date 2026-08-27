import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Dropdown} from './Dropdown';
import {DropdownItemText} from '../items/DropdownItemText/DropdownItemText';

// jsdom has no layout, so the anchor is given a rect by hand — every position the popup takes is
// derived from it.
const ANCHOR = {left: 100, top: 50, width: 240, height: 36, bottom: 86, right: 340};

let anchorRect = {...ANCHOR};

const stubLayout = () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('blue-orange-dropdown')) {
            return {...anchorRect, x: anchorRect.left, y: anchorRect.top, toJSON: () => ({})} as DOMRect;
        }
        if (this.classList.contains('blue-orange-dropdown-window')) {
            return {left: 0, top: 0, width: 240, height: 200, bottom: 200, right: 240,
                x: 0, y: 0, toJSON: () => ({})} as DOMRect;
        }
        return {left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0,
            x: 0, y: 0, toJSON: () => ({})} as DOMRect;
    });
};

const renderDropdown = (props: Record<string, any> = {}, wrapper?: React.CSSProperties) => {
    const dropdown = (
        <Dropdown {...props}>
            <DropdownItemText label="Alpha" value="alpha"/>
            <DropdownItemText label="Beta" value="beta"/>
        </Dropdown>
    );
    return render(wrapper ? <div style={wrapper}>{dropdown}</div> : dropdown);
};

const open = (container: HTMLElement) => {
    fireEvent.click(container.querySelector('.blue-orange-dropdown') as HTMLElement);
};

const popup = () => document.body.querySelector('.blue-orange-dropdown-window') as HTMLElement;

describe('Dropdown popup placement', () => {

    beforeEach(() => {
        anchorRect = {...ANCHOR};
        window.innerWidth = 1024;
        window.innerHeight = 768;
        stubLayout();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('does not render the popup until it is opened', () => {
        const {container} = renderDropdown();
        expect(popup()).toBeNull();
        open(container);
        expect(popup()).toBeInTheDocument();
    });

    // ── Width ─────────────────────────────────────────────────

    it('sizes the popup to the input by default', () => {
        const {container} = renderDropdown();
        open(container);
        expect(popup().style.width).toBe('240px');
    });

    it('resolves a percentage contextWidth against the input, not the viewport', () => {
        // the popup is `position: fixed`, so a raw `100%` would be resolved by the browser against
        // the initial containing block and render a full screen wide
        const {container} = renderDropdown({contextWidth: '100%'});
        open(container);
        expect(popup().style.width).toBe('240px');
    });

    it('resolves a partial percentage contextWidth against the input', () => {
        const {container} = renderDropdown({contextWidth: '50%'});
        open(container);
        expect(popup().style.width).toBe('120px');
    });

    it('passes a numeric contextWidth through and centres the popup on the input', () => {
        const {container} = renderDropdown({contextWidth: 400});
        open(container);
        // 100 - (400 - 240) / 2
        expect(popup().style.left).toBe('20px');
    });

    it('leaves a keyword contextWidth to CSS', () => {
        const {container} = renderDropdown({contextWidth: 'max-content'});
        open(container);
        expect(popup().style.width).toBe('max-content');
    });

    // ── Position ──────────────────────────────────────────────

    it('places the popup under an input in the top half of the viewport', () => {
        const {container} = renderDropdown();
        open(container);
        expect(popup().style.top).toBe('96px');
        expect(popup().style.bottom).toBe('unset');
    });

    it('places the popup above an input in the bottom half of the viewport', () => {
        anchorRect = {...ANCHOR, top: 600, bottom: 636};
        const {container} = renderDropdown();
        open(container);
        expect(popup().style.bottom).toBe('178px');
        expect(popup().style.top).toBe('unset');
    });

    it('re-measures the anchor when the page scrolls under an open popup', () => {
        const {container} = renderDropdown();
        open(container);
        expect(popup().style.top).toBe('96px');
        anchorRect = {...ANCHOR, top: 10, bottom: 46};
        fireEvent.scroll(window);
        expect(popup().style.top).toBe('56px');
    });

    it('re-measures the anchor when the window resizes under an open popup', () => {
        const {container} = renderDropdown();
        open(container);
        anchorRect = {...ANCHOR, left: 40};
        fireEvent(window, new Event('resize'));
        expect(popup().style.left).toBe('40px');
    });

    it('pulls a popup that would run off the right edge back onto the screen', () => {
        anchorRect = {...ANCHOR, left: 900, right: 1140};
        const {container} = renderDropdown();
        open(container);
        // measured popup width is 240, so the furthest left it can sit is 1024 - 10 - 240
        expect(popup().style.left).toBe('774px');
    });

    // ── Portal ────────────────────────────────────────────────

    it('portals the popup out of the caller tree and into the body', () => {
        // an ancestor with a transform — a modal or drawer card mid-animation — would otherwise
        // become the containing block for the fixed popup and misplace it entirely
        const {container} = renderDropdown({}, {transform: 'translateZ(0)'});
        open(container);
        expect(container.querySelector('.blue-orange-dropdown-window')).toBeNull();
        expect(popup()).toBeInTheDocument();
    });

    it('carries a dark wrapper through the portal', () => {
        const {container} = render(
            <div className="dark">
                <Dropdown><DropdownItemText label="Alpha" value="alpha"/></Dropdown>
            </div>
        );
        open(container);
        expect(popup()).toHaveClass('dark');
    });

    it('does not mark the popup dark outside a dark wrapper', () => {
        const {container} = renderDropdown();
        open(container);
        expect(popup()).not.toHaveClass('dark');
    });

    // ── Behaviour through the portal ──────────────────────────

    it('still selects an item clicked inside the portalled popup', () => {
        const onSelection = vi.fn();
        const {container} = renderDropdown({onSelection});
        open(container);
        onSelection.mockClear();
        fireEvent.click(screen.getByText('Beta'));
        expect(onSelection).toHaveBeenCalledWith(expect.objectContaining({reference: 'beta'}));
    });

    // ── Children ──────────────────────────────────────────────

    it('collects items wrapped in a fragment', () => {
        // React.Children does not descend into a fragment, so a group of items returned from a
        // helper or a conditional block used to render an empty popup
        const {container} = render(
            <Dropdown>
                <>
                    <DropdownItemText label="Alpha" value="alpha"/>
                    <DropdownItemText label="Beta" value="beta"/>
                </>
            </Dropdown>
        );
        open(container);
        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.getByText('Beta')).toBeInTheDocument();
    });

    it('collects items out of nested fragments and arrays', () => {
        const {container} = render(
            <Dropdown>
                <DropdownItemText label="Alpha" value="alpha"/>
                <>
                    {['beta', 'gamma'].map(value => (
                        <React.Fragment key={value}>
                            <DropdownItemText label={value} value={value}/>
                        </React.Fragment>
                    ))}
                </>
            </Dropdown>
        );
        open(container);
        ['Alpha', 'beta', 'gamma'].forEach(label => expect(screen.getByText(label)).toBeInTheDocument());
    });

    it('selects an item that reached the popup through a fragment', () => {
        const onSelection = vi.fn();
        const {container} = render(
            <Dropdown onSelection={onSelection}>
                <><DropdownItemText label="Alpha" value="alpha"/><DropdownItemText label="Beta" value="beta"/></>
            </Dropdown>
        );
        open(container);
        onSelection.mockClear();
        fireEvent.click(screen.getByText('Beta'));
        expect(onSelection).toHaveBeenCalledWith(expect.objectContaining({reference: 'beta'}));
    });

    it('removes the popup from the body when it closes', () => {
        const {container} = renderDropdown();
        open(container);
        expect(popup()).toBeInTheDocument();
        fireEvent.click(screen.getByText('Beta'));
        expect(popup()).toBeNull();
    });
});
