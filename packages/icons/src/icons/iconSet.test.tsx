import React from 'react';
import { render } from '@testing-library/react';
import * as GeneratedComponents from '../generated/components';
import { IconCategories, IconCategoryNames } from '../generated/iconCategories';
import { IconNames, isIconName } from '../generated/iconNames';
import { IconSvgPaths } from '../generated/iconPaths';
import { Icon24HoursLine } from '../generated/components/Finance';
import { AddLine } from '../generated/components/System';

const ALL_ICON_NAMES = Object.values(IconNames);

describe('generated icon set', () => {
    it('defines path data for every icon name', () => {
        const missing = ALL_ICON_NAMES.filter(name => IconSvgPaths[name] === undefined);
        expect(missing).toEqual([]);
    });

    it('defines exactly one path per icon', () => {
        const malformed = ALL_ICON_NAMES.filter(name => IconSvgPaths[name].length !== 1 || !IconSvgPaths[name][0]);
        expect(malformed).toEqual([]);
    });

    it('exports one component per icon name', () => {
        const componentCount = Object.keys(GeneratedComponents).length;
        expect(componentCount).toBe(ALL_ICON_NAMES.length);
    });

    it('groups every icon into exactly one category', () => {
        const categorised = IconCategoryNames.flatMap(category => IconCategories[category]);
        expect(new Set(categorised).size).toBe(categorised.length);
        expect([...categorised].sort()).toEqual([...ALL_ICON_NAMES].sort());
    });

    it('recognises its own names and rejects others', () => {
        expect(isIconName('add-line')).toBe(true);
        expect(isIconName('not-a-real-icon')).toBe(false);
        expect(isIconName(undefined)).toBe(false);
    });
});

describe('generated icon components', () => {
    it('renders its own glyph and name', () => {
        const { container } = render(<AddLine />);

        const svg = container.querySelector('svg')!;
        expect(svg.getAttribute('data-icon')).toBe('add-line');
        expect(svg.querySelector('path')?.getAttribute('d')).toBe(IconSvgPaths['add-line'][0]);
    });

    it('accepts the same props as the generic Icon', () => {
        const { container } = render(<AddLine className="custom" color="#ff0000" size={20} title="Add" />);

        const wrapper = container.firstElementChild!;
        expect(wrapper).toHaveClass('foundations-icon', 'foundations-icon-add-line', 'custom');
        expect(container.querySelector('svg')?.getAttribute('fill')).toBe('#ff0000');
        expect(container.querySelector('title')?.textContent).toBe('Add');
    });

    it('prefixes names that would otherwise start with a digit', () => {
        const { container } = render(<Icon24HoursLine />);
        expect(container.querySelector('svg')?.getAttribute('data-icon')).toBe('24-hours-line');
    });
});
