import React from 'react';
import {render, screen} from '@testing-library/react';
import {AccordionBody} from './AccordionBody';

describe('AccordionBody', () => {

    it('renders without crashing', () => {
        render(<AccordionBody><span>Body</span></AccordionBody>);
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('renders children as a fragment (no wrapper DOM element)', () => {
        const {container} = render(
            <div data-testid="wrapper">
                <AccordionBody><span>Child</span></AccordionBody>
            </div>
        );
        const wrapper = screen.getByTestId('wrapper');
        expect(wrapper.children.length).toBe(1);
        expect(wrapper.children[0].tagName).toBe('SPAN');
        expect(wrapper.children[0].textContent).toBe('Child');
    });

    it('renders string children', () => {
        render(<AccordionBody>Plain text</AccordionBody>);
        expect(screen.getByText('Plain text')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
        render(
            <AccordionBody>
                <span>First</span>
                <span>Second</span>
            </AccordionBody>
        );
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('renders nested elements', () => {
        render(
            <AccordionBody>
                <div>
                    <h3>Title</h3>
                    <p>Description</p>
                </div>
            </AccordionBody>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('passes through interactive elements', () => {
        const handleClick = jest.fn();
        render(
            <AccordionBody>
                <button onClick={handleClick}>Click me</button>
            </AccordionBody>
        );
        screen.getByText('Click me').click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not add any wrapper DOM nodes', () => {
        const {container} = render(
            <div data-testid="parent">
                <AccordionBody>
                    <span data-testid="child">Content</span>
                </AccordionBody>
            </div>
        );
        const parent = screen.getByTestId('parent');
        const child = screen.getByTestId('child');
        expect(child.parentElement).toBe(parent);
    });
});
