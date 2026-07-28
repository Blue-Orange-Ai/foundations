import React from 'react';
import {render, screen} from '@testing-library/react';
import {AccordionHeader} from './AccordionHeader';

describe('AccordionHeader', () => {

    it('renders without crashing', () => {
        render(<AccordionHeader><span>Header</span></AccordionHeader>);
        expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('renders children as a fragment (no wrapper DOM element)', () => {
        const {container} = render(
            <div data-testid="wrapper">
                <AccordionHeader><span>Child</span></AccordionHeader>
            </div>
        );
        const wrapper = screen.getByTestId('wrapper');
        // AccordionHeader renders a fragment, so the span should be a direct child of wrapper
        expect(wrapper.children.length).toBe(1);
        expect(wrapper.children[0].tagName).toBe('SPAN');
        expect(wrapper.children[0].textContent).toBe('Child');
    });

    it('renders string children', () => {
        render(<AccordionHeader>Plain text</AccordionHeader>);
        expect(screen.getByText('Plain text')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
        render(
            <AccordionHeader>
                <span>First</span>
                <span>Second</span>
            </AccordionHeader>
        );
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('renders nested elements', () => {
        render(
            <AccordionHeader>
                <div>
                    <h3>Title</h3>
                    <p>Description</p>
                </div>
            </AccordionHeader>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('passes through interactive elements', () => {
        const handleClick = vi.fn();
        render(
            <AccordionHeader>
                <button onClick={handleClick}>Click me</button>
            </AccordionHeader>
        );
        screen.getByText('Click me').click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not add any wrapper DOM nodes', () => {
        const {container} = render(
            <div data-testid="parent">
                <AccordionHeader>
                    <span data-testid="child">Content</span>
                </AccordionHeader>
            </div>
        );
        const parent = screen.getByTestId('parent');
        const child = screen.getByTestId('child');
        // The child should be a direct child of parent (no intermediate wrapper)
        expect(child.parentElement).toBe(parent);
    });
});
