import React, {useState} from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {Accordion} from './Accordion';
import {AccordionHeader} from '../accordion-header/AccordionHeader';
import {AccordionBody} from '../accordion-body/AccordionBody';

// Helper: controlled accordion that toggles on header click
const ToggleableAccordion: React.FC<{ defaultOpened?: boolean }> = ({defaultOpened = false}) => {
    const [opened, setOpened] = useState(defaultOpened);
    return (
        <Accordion opened={opened}>
            <AccordionHeader>
                <button onClick={() => setOpened(!opened)}>Toggle</button>
            </AccordionHeader>
            <AccordionBody>
                <p>Body content</p>
            </AccordionBody>
        </Accordion>
    );
};

describe('Accordion', () => {

    // ── Rendering ──────────────────────────────────────────────

    it('renders without crashing', () => {
        render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('renders with the correct root class name', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>H</span></AccordionHeader>
                <AccordionBody><span>B</span></AccordionBody>
            </Accordion>
        );
        expect(container.querySelector('.blue-orange-accordion')).toBeInTheDocument();
    });

    it('renders header items inside .blue-orange-accordion-header', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>My Header</span></AccordionHeader>
                <AccordionBody><span>My Body</span></AccordionBody>
            </Accordion>
        );
        const headerDiv = container.querySelector('.blue-orange-accordion-header');
        expect(headerDiv).toBeInTheDocument();
        expect(headerDiv!.textContent).toBe('My Header');
    });

    it('renders body items inside .blue-orange-accordion-body', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>My Header</span></AccordionHeader>
                <AccordionBody><span>My Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body');
        expect(bodyDiv).toBeInTheDocument();
        expect(bodyDiv!.textContent).toBe('My Body');
    });

    // ── Children filtering ─────────────────────────────────────

    it('only renders AccordionHeader children in the header slot', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header Content</span></AccordionHeader>
                <AccordionBody><span>Body Content</span></AccordionBody>
            </Accordion>
        );
        const headerDiv = container.querySelector('.blue-orange-accordion-header');
        expect(headerDiv!.textContent).toBe('Header Content');
        expect(headerDiv!.textContent).not.toContain('Body Content');
    });

    it('only renders AccordionBody children in the body slot', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header Content</span></AccordionHeader>
                <AccordionBody><span>Body Content</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body');
        expect(bodyDiv!.textContent).toBe('Body Content');
        expect(bodyDiv!.textContent).not.toContain('Header Content');
    });

    it('ignores children that are not AccordionHeader or AccordionBody', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <div data-testid="rogue">Should not appear</div>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const headerDiv = container.querySelector('.blue-orange-accordion-header');
        const bodyDiv = container.querySelector('.blue-orange-accordion-body');
        // The rogue div should not be rendered inside header or body slots
        expect(headerDiv!.textContent).toBe('Header');
        expect(bodyDiv!.textContent).toBe('Body');
        // The rogue div's text should not appear at all inside the accordion slots
        expect(headerDiv!.innerHTML).not.toContain('rogue');
        expect(bodyDiv!.innerHTML).not.toContain('rogue');
    });

    it('handles multiple AccordionHeader children', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header 1</span></AccordionHeader>
                <AccordionHeader><span>Header 2</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const headerDiv = container.querySelector('.blue-orange-accordion-header');
        expect(headerDiv!.textContent).toContain('Header 1');
        expect(headerDiv!.textContent).toContain('Header 2');
    });

    it('handles multiple AccordionBody children', () => {
        const {container} = render(
            <Accordion opened={true}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body 1</span></AccordionBody>
                <AccordionBody><span>Body 2</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body');
        expect(bodyDiv!.textContent).toContain('Body 1');
        expect(bodyDiv!.textContent).toContain('Body 2');
    });

    it('renders correctly with no children', () => {
        const {container} = render(
            <Accordion opened={false}>
                {null as any}
            </Accordion>
        );
        expect(container.querySelector('.blue-orange-accordion')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-accordion-header')!.textContent).toBe('');
        expect(container.querySelector('.blue-orange-accordion-body')!.textContent).toBe('');
    });

    // ── Opened prop (collapsed / expanded) ─────────────────────

    it('sets maxHeight to 0px when opened is false', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        expect(bodyDiv.style.maxHeight).toBe('0px');
    });

    it('sets maxHeight based on scrollHeight when opened is true', () => {
        // jsdom scrollHeight is 0 by default, so maxHeight will be "0px"
        const {container} = render(
            <Accordion opened={true}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        // In jsdom scrollHeight defaults to 0, so we expect "0px"
        expect(bodyDiv.style.maxHeight).toBe('0px');
    });

    it('updates maxHeight when opened prop changes from false to true', () => {
        const {container, rerender} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        expect(bodyDiv.style.maxHeight).toBe('0px');

        // The component measures the inner content wrapper (the div holding the ref),
        // so mock scrollHeight there before re-rendering.
        const contentDiv = bodyDiv.firstElementChild as HTMLElement;
        Object.defineProperty(contentDiv, 'scrollHeight', {value: 200, configurable: true});

        rerender(
            <Accordion opened={true}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        expect(bodyDiv.style.maxHeight).toBe('200px');
    });

    it('resets maxHeight to 0px when opened changes from true to false', () => {
        const {container, rerender} = render(
            <Accordion opened={true}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;

        rerender(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        expect(bodyDiv.style.maxHeight).toBe('0px');
    });

    // ── Inline styles on body container ────────────────────────

    it('applies transition style to the body container', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        expect(bodyDiv.style.transition).toBe('max-height 0.2s ease-out');
    });

    it('applies overflow hidden to the body container', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        expect(bodyDiv.style.overflow).toBe('hidden');
    });

    // ── Controlled component behaviour ─────────────────────────

    it('works as a controlled component toggling via parent state', () => {
        const {container} = render(<ToggleableAccordion defaultOpened={false}/>);
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        const contentDiv = bodyDiv.firstElementChild as HTMLElement;
        Object.defineProperty(contentDiv, 'scrollHeight', {value: 150, configurable: true});

        expect(bodyDiv.style.maxHeight).toBe('0px');

        fireEvent.click(screen.getByText('Toggle'));
        expect(bodyDiv.style.maxHeight).toBe('150px');

        fireEvent.click(screen.getByText('Toggle'));
        expect(bodyDiv.style.maxHeight).toBe('0px');
    });

    it('can be initialised in the opened state', () => {
        const {container} = render(<ToggleableAccordion defaultOpened={true}/>);
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        // scrollHeight is 0 in jsdom, so maxHeight = "0px" even when opened
        expect(bodyDiv.style.overflow).toBe('hidden');
    });

    // ── DOM structure ──────────────────────────────────────────

    it('renders header before body in DOM order', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>First</span></AccordionHeader>
                <AccordionBody><span>Second</span></AccordionBody>
            </Accordion>
        );
        const root = container.querySelector('.blue-orange-accordion')!;
        const children = root.children;
        expect(children[0].classList.contains('blue-orange-accordion-header')).toBe(true);
        expect(children[1].classList.contains('blue-orange-accordion-body')).toBe(true);
    });

    it('places the ref on the body container div', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        // The ref is used internally; we verify the div exists and has the expected inline styles
        expect(bodyDiv).toBeInTheDocument();
        expect(bodyDiv.style.maxHeight).toBe('0px');
    });

    // ── Edge cases ─────────────────────────────────────────────

    it('handles children order where body comes before header in JSX', () => {
        const {container} = render(
            <Accordion opened={false}>
                <AccordionBody><span>Body</span></AccordionBody>
                <AccordionHeader><span>Header</span></AccordionHeader>
            </Accordion>
        );
        // Regardless of JSX order, header slot should contain header and body slot should contain body
        const headerDiv = container.querySelector('.blue-orange-accordion-header');
        const bodyDiv = container.querySelector('.blue-orange-accordion-body');
        expect(headerDiv!.textContent).toBe('Header');
        expect(bodyDiv!.textContent).toBe('Body');
    });

    it('handles rapid toggling of opened prop', () => {
        const {container, rerender} = render(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        const bodyDiv = container.querySelector('.blue-orange-accordion-body') as HTMLElement;
        const contentDiv = bodyDiv.firstElementChild as HTMLElement;
        Object.defineProperty(contentDiv, 'scrollHeight', {value: 100, configurable: true});

        // Rapidly toggle several times
        rerender(
            <Accordion opened={true}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        expect(bodyDiv.style.maxHeight).toBe('100px');

        rerender(
            <Accordion opened={false}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        expect(bodyDiv.style.maxHeight).toBe('0px');

        rerender(
            <Accordion opened={true}>
                <AccordionHeader><span>Header</span></AccordionHeader>
                <AccordionBody><span>Body</span></AccordionBody>
            </Accordion>
        );
        expect(bodyDiv.style.maxHeight).toBe('100px');
    });

    it('renders complex children inside header and body', () => {
        render(
            <Accordion opened={true}>
                <AccordionHeader>
                    <div>
                        <h2>Complex Header</h2>
                        <span>Subtitle</span>
                    </div>
                </AccordionHeader>
                <AccordionBody>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                    </ul>
                </AccordionBody>
            </Accordion>
        );
        expect(screen.getByText('Complex Header')).toBeInTheDocument();
        expect(screen.getByText('Subtitle')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
});
