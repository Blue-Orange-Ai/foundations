import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {ButtonDropdown} from './ButtonDropdown';
import {ButtonIconDropdown} from '../button-icon-dropdown/ButtonIconDropdown';
import {ButtonType} from '../button/Button';
import {DropdownItemText} from '../../inputs/dropdown/items/DropdownItemText/DropdownItemText';
import {ButtonDevelopment} from '../../../development/components/buttons/ButtonDevelopment';

// jsdom has no layout, so the anchor is given a rect by hand. It is deliberately narrow — the point
// of the popup sizing to its own content is that a short button does not open a sliver.
const stubLayout = () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('blue-orange-dropdown')) {
            return {left: 100, top: 50, width: 60, height: 36, bottom: 86, right: 160,
                x: 100, y: 50, toJSON: () => ({})} as DOMRect;
        }
        return {left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0,
            x: 0, y: 0, toJSON: () => ({})} as DOMRect;
    });
};

const items = [
    <DropdownItemText key="edit" label="Edit" value="edit"/>,
    <DropdownItemText key="delete" label="Delete" value="delete"/>,
];

const open = (container: HTMLElement) => {
    fireEvent.click(container.querySelector('.blue-orange-dropdown') as HTMLElement);
};

const popup = () => document.body.querySelector('.blue-orange-dropdown-window') as HTMLElement;

describe('ButtonDropdown popup', () => {

    beforeEach(() => {
        window.innerWidth = 1024;
        window.innerHeight = 768;
        stubLayout();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sizes the popup to the options rather than the button label', () => {
        const {container} = render(
            <ButtonDropdown text="Small" buttonType={ButtonType.PRIMARY}>{items}</ButtonDropdown>
        );
        open(container);
        expect(popup().style.width).toBe('max-content');
    });

    it('carries the class the min-width floor is hung off, since the popup is portalled away', () => {
        const {container} = render(
            <ButtonDropdown text="Small" buttonType={ButtonType.PRIMARY}>{items}</ButtonDropdown>
        );
        open(container);
        expect(popup()).toHaveClass('blue-orange-button-dropdown-window');
    });

    it('still honours an explicit contextWidth', () => {
        const {container} = render(
            <ButtonDropdown text="Small" buttonType={ButtonType.PRIMARY} contextWidth={320}>{items}</ButtonDropdown>
        );
        open(container);
        expect(popup().style.width).toBe('320px');
    });

    it('left aligns a content sized popup with the button', () => {
        const {container} = render(
            <ButtonDropdown text="Small" buttonType={ButtonType.PRIMARY}>{items}</ButtonDropdown>
        );
        open(container);
        expect(popup().style.left).toBe('100px');
    });

    it('selects an option through the portalled popup', () => {
        const onSelection = vi.fn();
        const {container} = render(
            <ButtonDropdown text="Small" buttonType={ButtonType.PRIMARY} onSelection={onSelection}>{items}</ButtonDropdown>
        );
        open(container);
        onSelection.mockClear();
        fireEvent.click(screen.getByText('Delete'));
        expect(onSelection).toHaveBeenCalledWith('delete');
    });
});

describe('ButtonIconDropdown popup', () => {

    beforeEach(() => {
        window.innerWidth = 1024;
        window.innerHeight = 768;
        stubLayout();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sizes the popup to the options rather than the icon button', () => {
        const {container} = render(
            <ButtonIconDropdown icon="ri-more-2-fill">{items}</ButtonIconDropdown>
        );
        open(container);
        expect(popup().style.width).toBe('max-content');
    });

    it('carries the class the min-width floor is hung off, since the popup is portalled away', () => {
        const {container} = render(
            <ButtonIconDropdown icon="ri-more-2-fill">{items}</ButtonIconDropdown>
        );
        open(container);
        expect(popup()).toHaveClass('blue-orange-btn-icon-dropdown-window');
    });
});

describe('the buttons docs page', () => {

    beforeEach(() => {
        window.innerWidth = 1024;
        window.innerHeight = 768;
        stubLayout();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lists options behind the Export playground button', () => {
        // the demo items are written as a fragment, which Dropdown used to walk straight past —
        // the button opened onto an empty popup
        const {container} = render(<ButtonDevelopment/>);
        const exportButton = Array.from(container.querySelectorAll('.blue-orange-button-dropdown-default-btn'))
            .find(button => (button.textContent ?? '').includes('Export')) as HTMLElement;
        expect(exportButton).toBeDefined();
        open(exportButton);
        const popupText = popup().textContent ?? '';
        expect(popupText).toContain('Download as');
        expect(popupText).toContain('Spreadsheet (.xlsx)');
        expect(popupText).toContain('PDF document');
    });
});

// The class name used to be seeded into state at mount and only re-derived by an
// effect keyed on [isLoading], so `isDisabled` never reached the DOM after the
// first render — a dropdown mounted disabled stayed painted disabled however the
// prop changed, while its trigger read the live prop.
describe('ButtonDropdown disabled state', () => {

    const trigger = () =>
        document.querySelector('.blue-orange-button-dropdown-default-btn') as HTMLElement;
    const isPaintedDisabled = () =>
        trigger().classList.contains('blue-orange-button-dropdown-default-btn-disabled');

    const Harness = ({start}: {start: boolean}) => {
        const [disabled, setDisabled] = React.useState(start);
        return (
            <div>
                <button data-testid="toggle" onClick={() => setDisabled(!start)}>toggle</button>
                <ButtonDropdown text="Actions" buttonType={ButtonType.PRIMARY} isDisabled={disabled}>
                    {items}
                </ButtonDropdown>
            </div>
        );
    };

    it('stops painting disabled once isDisabled goes false', () => {
        render(<Harness start={true}/>);
        expect(isPaintedDisabled()).toBe(true);

        fireEvent.click(screen.getByTestId('toggle'));
        expect(isPaintedDisabled()).toBe(false);
    });

    it('starts painting disabled once isDisabled goes true', () => {
        render(<Harness start={false}/>);
        expect(isPaintedDisabled()).toBe(false);

        fireEvent.click(screen.getByTestId('toggle'));
        expect(isPaintedDisabled()).toBe(true);
    });
});
