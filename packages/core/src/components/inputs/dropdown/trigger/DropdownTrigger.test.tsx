import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {DropdownBadge} from '../../../text-decorations/dropdown-badge/DropdownBadge';
import {DropdownTag} from '../../../text-decorations/dropdown-tag/DropdownTag';
import {DropdownCompoundBadge} from '../../../text-decorations/dropdown-compound-badge/DropdownCompoundBadge';
import {DropdownCompoundTag} from '../../../text-decorations/dropdown-compound-tag/DropdownCompoundTag';
import {CompoundBadge} from '../../../text-decorations/compound-badge/CompoundBadge';
import {CompoundTag} from '../../../text-decorations/compound-tag/CompoundTag';
import {DropdownItemText} from '../items/DropdownItemText/DropdownItemText';

// jsdom has no layout, so the anchor is given a rect by hand. It is deliberately narrow — the point
// of the popup sizing to its own content is that a short tag does not open a sliver.
const stubLayout = () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('blue-orange-dropdown')) {
            return {left: 100, top: 50, width: 60, height: 24, bottom: 74, right: 160,
                x: 100, y: 50, toJSON: () => ({})} as DOMRect;
        }
        return {left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0,
            x: 0, y: 0, toJSON: () => ({})} as DOMRect;
    });
};

const items = [
    <DropdownItemText key="production" label="Production" value="production" selected={true}/>,
    <DropdownItemText key="staging" label="Staging" value="staging" selected={false}/>,
];

const open = (container: HTMLElement) => {
    fireEvent.click(container.querySelector('.blue-orange-dropdown') as HTMLElement);
};

const popup = () => document.body.querySelector('.blue-orange-dropdown-window') as HTMLElement;

describe('the tag dropdown variants', () => {

    beforeEach(() => {
        window.innerWidth = 1024;
        window.innerHeight = 768;
        stubLayout();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('opens a popup from the badge itself', () => {
        const {container} = render(<DropdownBadge label="Production">{items}</DropdownBadge>);
        expect(popup()).toBeNull();
        open(container);
        expect(popup()).not.toBeNull();
        expect(popup().textContent).toContain('Staging');
    });

    it('sizes the popup to the options rather than the tag', () => {
        const {container} = render(<DropdownTag label="Production">{items}</DropdownTag>);
        open(container);
        expect(popup().style.width).toBe('max-content');
    });

    it('carries the class the min-width floor is hung off, since the popup is portalled away', () => {
        const {container} = render(<DropdownTag label="Production">{items}</DropdownTag>);
        open(container);
        expect(popup()).toHaveClass('blue-orange-dropdown-trigger-window');
    });

    it('marks the trigger with a chevron, and drops it on request', () => {
        const {container, rerender} = render(<DropdownTag label="Production">{items}</DropdownTag>);
        expect(container.querySelector('.blue-orange-dropdown-tag-chevron')).not.toBeNull();

        rerender(<DropdownTag label="Production" chevron={false}>{items}</DropdownTag>);
        expect(container.querySelector('.blue-orange-dropdown-tag-chevron')).toBeNull();
    });

    // Dropdown reports its starting value on mount, which is the placeholder item when nothing is
    // selected — a caller wiring onSelection straight to a setter would have had the tag relabel
    // itself before anybody touched it.
    it('reports selections a person makes, and not the one it starts on', () => {
        const onSelection = vi.fn();
        const {container} = render(
            <DropdownCompoundTag leftContent="Environment" rightContent="Production" onSelection={onSelection}>
                {items}
            </DropdownCompoundTag>
        );
        expect(onSelection).not.toHaveBeenCalled();

        open(container);
        fireEvent.click(screen.getByText('Staging'));
        expect(onSelection).toHaveBeenCalledTimes(1);
        expect(onSelection.mock.calls[0][0].reference).toBe('staging');
    });

    it('leaves the popup shut while disabled', () => {
        const {container} = render(
            <DropdownCompoundBadge leftContent="Environment" rightContent="Production" disabled={true}>
                {items}
            </DropdownCompoundBadge>
        );
        open(container);
        expect(popup()).toBeNull();
    });

    it('removes a compound tag without opening it', () => {
        const onRemove = vi.fn();
        const {container} = render(
            <DropdownCompoundTag leftContent="Environment" rightContent="Production" onRemove={onRemove}>
                {items}
            </DropdownCompoundTag>
        );
        fireEvent.click(container.querySelector('.blue-orange-compound-tag-remove') as HTMLElement);
        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(popup()).toBeNull();
    });
});

describe('a compound pill that is still resolving its key', () => {

    it('stands a spinner in the left half of a compound tag', () => {
        const {container} = render(<CompoundTag leftContent="Environment" loading={true}>Production</CompoundTag>);
        const left = container.querySelector('.blue-orange-compound-tag-left') as HTMLElement;
        expect(left.querySelector('.blue-orange-spinner')).not.toBeNull();
        expect(left.textContent).not.toContain('Environment');
    });

    it('stands a spinner in the left half of a compound badge', () => {
        const {container} = render(<CompoundBadge leftContent="Environment" loading={true}>Production</CompoundBadge>);
        const left = container.querySelector('.blue-orange-compound-badge-left') as HTMLElement;
        expect(left.querySelector('.blue-orange-spinner')).not.toBeNull();
        expect(left.textContent).not.toContain('Environment');
    });

    it('carries the spinner through the dropdown variants', () => {
        const {container} = render(
            <DropdownCompoundBadge leftContent="Environment" rightContent="Production" loading={true}>
                {items}
            </DropdownCompoundBadge>
        );
        const left = container.querySelector('.blue-orange-compound-badge-left') as HTMLElement;
        expect(left.querySelector('.blue-orange-spinner')).not.toBeNull();
    });

    it('takes the colour of the half it sits in rather than the themed spinner colour', () => {
        const {container} = render(
            <CompoundTag leftContent="Environment" loading={true} leftTextColor="#f97316">Production</CompoundTag>
        );
        const spinner = container.querySelector('.blue-orange-spinner') as HTMLElement;
        expect(spinner.style.color).toBe('currentcolor');
    });
});
