import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { Intent } from '../../common/intent';
import { AddLine } from '../../generated/components/System';
import { IconNames } from '../../generated/iconNames';
import { IconSvgPaths } from '../../generated/iconPaths';
import { IconSize } from '../../icons/iconTypes';

function svgFor(container: HTMLElement): SVGSVGElement {
    const svg = container.querySelector('svg');
    if (svg === null) {
        throw new Error('expected an <svg> to be rendered');
    }
    return svg;
}

describe('Icon', () => {
    it('renders the glyph for a named icon', () => {
        const { container } = render(<Icon icon={IconNames.ADD_LINE} />);

        const svg = svgFor(container);
        expect(svg.getAttribute('data-icon')).toBe('add-line');
        expect(svg.querySelector('path')?.getAttribute('d')).toBe(IconSvgPaths['add-line'][0]);
    });

    it('wraps the glyph in a span carrying the icon and size classes', () => {
        const { container } = render(<Icon icon={IconNames.ADD_LINE} />);

        const wrapper = container.firstElementChild!;
        expect(wrapper.tagName).toBe('SPAN');
        expect(wrapper).toHaveClass('foundations-icon', 'foundations-icon-add-line', 'foundations-icon-standard');
    });

    it('defaults to the standard size and scales the svg with the size prop', () => {
        const { container: standard } = render(<Icon icon={IconNames.ADD_LINE} />);
        expect(svgFor(standard).getAttribute('width')).toBe(String(IconSize.STANDARD));

        const { container: large } = render(<Icon icon={IconNames.ADD_LINE} size={IconSize.LARGE} />);
        expect(svgFor(large).getAttribute('width')).toBe(String(IconSize.LARGE));
        expect(svgFor(large).getAttribute('height')).toBe(String(IconSize.LARGE));
    });

    it('always draws on the 24px grid the glyphs are authored at', () => {
        const { container } = render(<Icon icon={IconNames.ADD_LINE} size={48} />);
        expect(svgFor(container).getAttribute('viewBox')).toBe('0 0 24 24');
    });

    it('applies the intent class', () => {
        const { container } = render(<Icon icon={IconNames.ALERT_LINE} intent={Intent.DANGER} />);
        expect(container.firstElementChild).toHaveClass('foundations-intent-danger');
    });

    it('fills with currentColor unless a colour is given', () => {
        const { container: inherited } = render(<Icon icon={IconNames.ADD_LINE} />);
        expect(svgFor(inherited).getAttribute('fill')).toBe('currentColor');

        const { container: coloured } = render(<Icon icon={IconNames.ADD_LINE} color="#ff0000" />);
        expect(svgFor(coloured).getAttribute('fill')).toBe('#ff0000');
    });

    it('hides decorative icons from assistive technology', () => {
        const { container } = render(<Icon icon={IconNames.ADD_LINE} />);
        expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('exposes a titled icon to assistive technology', () => {
        render(<Icon icon={IconNames.ADD_LINE} title="Add item" />);

        const icon = screen.getByTitle('Add item');
        expect(icon).toBeInTheDocument();
        expect(icon.closest('[aria-hidden="true"]')).toBeNull();
    });

    it('renders the bare svg when tagName is null', () => {
        const { container } = render(<Icon icon={IconNames.ADD_LINE} tagName={null} />);
        expect(container.firstElementChild?.tagName).toBe('svg');
    });

    it('renders nothing for nullish or false icons', () => {
        const { container: nullIcon } = render(<Icon icon={null} />);
        expect(nullIcon).toBeEmptyDOMElement();

        const { container: falseIcon } = render(<Icon icon={false} />);
        expect(falseIcon).toBeEmptyDOMElement();
    });

    it('reserves space for an unknown icon name', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const { container } = render(<Icon icon={'not-a-real-icon' as any} size={20} />);

        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper.querySelector('svg')).toBeNull();
        expect(wrapper.style.width).toBe('20px');
        expect(wrapper.style.height).toBe('20px');
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it('merges className and intent onto an icon element and forwards size and colour', () => {
        const { container } = render(
            <Icon className="custom" color="#00ff00" icon={<AddLine />} intent={Intent.PRIMARY} size={20} />,
        );

        const wrapper = container.firstElementChild!;
        expect(wrapper).toHaveClass('custom', 'foundations-intent-primary');
        expect(svgFor(container).getAttribute('width')).toBe('20');
        expect(svgFor(container).getAttribute('fill')).toBe('#00ff00');
    });

    it("lets the icon element's own size and colour win", () => {
        const { container } = render(<Icon color="#00ff00" icon={<AddLine color="#0000ff" size={32} />} size={20} />);

        expect(svgFor(container).getAttribute('width')).toBe('32');
        expect(svgFor(container).getAttribute('fill')).toBe('#0000ff');
    });

    it('passes DOM attributes through to the root element', () => {
        const { container } = render(<Icon data-testid="target" htmlTitle="hover me" icon={IconNames.ADD_LINE} />);

        const wrapper = container.firstElementChild!;
        expect(wrapper).toHaveAttribute('title', 'hover me');
        expect(wrapper).toHaveAttribute('data-testid', 'target');
    });

    it('passes svgProps through to the svg element', () => {
        const { container } = render(
            <Icon icon={IconNames.ADD_LINE} svgProps={{ className: 'inner', focusable: false }} />,
        );

        const svg = svgFor(container);
        expect(svg).toHaveClass('inner');
        expect(svg).toHaveAttribute('focusable', 'false');
    });

    it('forwards a ref to the root element', () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Icon icon={IconNames.ADD_LINE} ref={ref} />);
        expect(ref.current?.tagName).toBe('SPAN');
    });
});
